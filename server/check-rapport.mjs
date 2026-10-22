// Het websiterapport op /check (22 oktober 2026, Marinus): onder de php2shell-uitslag vijf punten met echte data.
//   1. Snelheid op mobiel        Google PageSpeed Insights (sleutel in PAGESPEED_API_KEY), anders eigen meting
//   2. Beveiligde verbinding     https, doorsturen, certificaat, HSTS, TLS-versie
//   3. Verouderde software       generator, feed, scripts en stylesheets tegen OSV.dev en wordpress.org
//   4. Beveiligingsheaders       CSP, frame-bescherming, nosniff, Referrer-Policy, Permissions-Policy, versielekken
//   5. E-mailbeveiliging         SPF, DMARC en MX via DNS
// Twee aanroepen, zodat de pagina niet op Google hoeft te wachten: "rest" (punt 2 tot en met 5, binnen ~15 s) en
// "snelheid" (punt 1, tot ~50 s). Elk punt mag apart mislukken: dan "onbekend" met een reden, nooit een foutmelding.
//
// Verzamelen gebeurt alleen passief: de homepage en hooguit 5 interne pagina's die de homepage zelf linkt, met
// robots.txt voor die extra pagina's, één GET per pagina, eigen user agent, geen gokpaden, geen POST. Alleen publieke
// adressen, ook na elke redirect. Uitkomsten blijven 10 minuten per domein in het geheugen van deze functie; er wordt
// niets opgeslagen.

import dnsMod from "node:dns";
import { binnenLimiet, normaliseerDomein, testbankModus } from "./php-check.mjs";
import { haal, leesRobots, magVolgensRobots, zoekAdres, poorten } from "./rapport/ophalen.mjs";
import { beoordeelEigenSnelheid, beoordeelEmail, beoordeelHeaders, beoordeelPageSpeed, beoordeelVerbinding } from "./rapport/punten.mjs";
import { beoordeelSoftware, vindSoftware } from "./rapport/software.mjs";

export const VERSIE_RAPPORT = "check-rapport/1 (2026-10-22)";
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map();

const onbekend = (reden) => ({ status: "onbekend", reden, problemen: [], bewijs: [] });

// ---------------------------------------------------------------------------------------------
// DNS voor e-mail
// ---------------------------------------------------------------------------------------------

function maakResolver() {
  const r = new dnsMod.promises.Resolver({ timeout: 2500, tries: 2 });
  if (testbankModus() && process.env.CHECK_RAPPORT_DNS) r.setServers([process.env.CHECK_RAPPORT_DNS]);
  return r;
}
const dnsFout = (e) => ({ fout: ["ENODATA", "ENOTFOUND"].includes(e?.code) ? "geen" : e?.code === "ETIMEOUT" ? "timeout" : "dns" });

export async function meetEmailDns(domein) {
  const r = maakResolver();
  const txt = (naam) => r.resolveTxt(naam).then((rijen) => rijen.map((delen) => delen.join(""))).catch((e) => (dnsFout(e).fout === "geen" ? [] : dnsFout(e)));
  const [t, d, mx] = await Promise.all([
    // Bestaat het domein zelf niet (NXDOMAIN), dan is er niets te beoordelen: "onbekend", niet "slecht".
    r.resolveTxt(domein).then((rijen) => rijen.map((delen) => delen.join(""))).catch((e) => (e?.code === "ENOTFOUND" ? { fout: "nxdomain" } : dnsFout(e).fout === "geen" ? [] : dnsFout(e))),
    txt(`_dmarc.${domein}`),
    r.resolveMx(domein).catch((e) => (dnsFout(e).fout === "geen" ? [] : dnsFout(e))),
  ]);
  return { domein, txt: t, dmarc: d, mx };
}

// ---------------------------------------------------------------------------------------------
// Interne pagina's kiezen
// ---------------------------------------------------------------------------------------------

const ZELFDE_SITE = (a, b) => a === b || a === `www.${b}` || b === `www.${a}`;
const NIET_VOLGEN = /\/(wp-admin|wp-login|wp-json|xmlrpc|cart|checkout|winkelwagen|afrekenen|account|mijn-account|login|inloggen|logout|uitloggen|feed|cdn-cgi)(\/|$)|\.(pdf|jpe?g|png|gif|webp|svg|avif|mp4|mp3|zip|docx?|xlsx?|pptx?|xml|json|txt|ics|css|js)$/i;

export function kiesPaginas(html, basisUrl, max = 5) {
  const basis = new URL(basisUrl);
  const gekozen = [];
  const gezien = new Set([basis.pathname]);
  for (const m of String(html).matchAll(/<a\b[^>]*?\bhref\s*=\s*["']([^"'#][^"']{0,400})["']/gi)) {
    let u;
    try { u = new URL(m[1].replace(/&amp;/g, "&"), basis); } catch { continue; }
    if (!["http:", "https:"].includes(u.protocol) || !ZELFDE_SITE(u.hostname, basis.hostname)) continue;
    if (u.search && /(add-to-cart|action=|logout|replytocom|share=|s=)/i.test(u.search)) continue;
    if (NIET_VOLGEN.test(u.pathname) || gezien.has(u.pathname)) continue;
    gezien.add(u.pathname);
    u.hash = "";
    u.search = "";
    u.protocol = basis.protocol;
    u.hostname = basis.hostname;
    u.port = basis.port;
    gekozen.push(u.href);
    if (gekozen.length >= max) break;
  }
  return gekozen;
}

export function vindFeed(html, basisUrl) {
  const basis = new URL(basisUrl);
  for (const m of String(html).matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel\s*=\s*["']alternate["']/i.test(m[0]) || !/application\/(rss|atom)\+xml/i.test(m[0])) continue;
    const href = (m[0].match(/\bhref\s*=\s*["']([^"']{1,400})["']/i) || [])[1];
    if (!href) continue;
    try {
      const u = new URL(href.replace(/&amp;/g, "&"), basis);
      if (ZELFDE_SITE(u.hostname, basis.hostname) && !/comments/i.test(u.pathname)) { u.protocol = basis.protocol; u.hostname = basis.hostname; u.port = basis.port; return u.href; }
    } catch { /* volgende */ }
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Punt 3: software
// ---------------------------------------------------------------------------------------------

async function meetSoftware(homepage, einde) {
  if (!homepage?.ok || !/html/i.test(String(homepage.headers?.["content-type"] || "text/html"))) return onbekend(homepage?.reden || "geen-html");
  const basis = new URL(homepage.url);
  const origin = `${basis.protocol}//${basis.host}`;
  const robotsAntw = await haal(`${origin}/robots.txt`, { einde: Math.min(einde, Date.now() + 4000), maxBody: 128 * 1024, accept: "text/plain,*/*;q=0.1", maxRedirects: 2 });
  const robots = robotsAntw.ok && robotsAntw.status === 200 && !/html/i.test(String(robotsAntw.headers?.["content-type"] || "")) ? leesRobots(robotsAntw.body) : { regels: [], groep: null };
  const feed = vindFeed(homepage.body, homepage.url);
  const kandidaten = kiesPaginas(homepage.body, homepage.url, 10);
  const pad = (u) => new URL(u).pathname;
  const toegestaan = kandidaten.filter((u) => magVolgensRobots(robots, pad(u)));
  const overgeslagen = kandidaten.length - toegestaan.length;
  // Hooguit 5 extra verzoeken: de feed (als de homepage hem linkt en robots.txt hem toestaat) telt mee.
  const metFeed = feed && magVolgensRobots(robots, pad(feed));
  const paginaUrls = toegestaan.slice(0, metFeed ? 4 : 5);
  const paginaEinde = Math.min(einde, Date.now() + 7000);
  const [paginas, feedAntw] = await Promise.all([
    Promise.all(paginaUrls.map((u) => haal(u, { einde: paginaEinde, maxBody: 512 * 1024, maxRedirects: 2 }))),
    metFeed ? haal(feed, { einde: paginaEinde, maxBody: 256 * 1024, accept: "application/rss+xml,application/atom+xml,text/xml;q=0.9,*/*;q=0.1", maxRedirects: 2 }) : null,
  ]);
  const gelezen = [{ url: homepage.url, body: homepage.body }, ...paginas.filter((p) => p.ok && p.status < 400 && ZELFDE_SITE(new URL(p.url).hostname, basis.hostname) && /html/i.test(String(p.headers?.["content-type"] || ""))).map((p) => ({ url: p.url, body: p.body }))];
  const gevonden = vindSoftware(gelezen, feedAntw?.ok ? { url: feedAntw.url, body: feedAntw.body } : null);
  const { onderdelen, bronFouten } = await beoordeelSoftware(gevonden);
  const beoordeeld = onderdelen.filter((o) => o.status !== "onbekend");
  const status = !onderdelen.length ? "goed" : !beoordeeld.length ? "onbekend" : beoordeeld.some((o) => o.status === "slecht") ? "slecht" : beoordeeld.some((o) => o.status === "aandacht") ? "aandacht" : "goed";
  const problemen = [];
  if (onderdelen.some((o) => o.soort === "cms" && o.status === "slecht")) problemen.push(onderdelen.find((o) => o.soort === "cms").naam === "Drupal" ? "cms-eol" : "cms-onveilig");
  if (onderdelen.some((o) => o.soort === "bibliotheek" && o.status !== "goed" && o.aantalLekken)) problemen.push("bibliotheek-lek");
  if (onderdelen.some((o) => o.soort === "cms" && o.status === "aandacht")) problemen.push("cms-verouderd");
  if (onderdelen.some((o) => o.soort === "plugin" && o.status === "aandacht")) problemen.push("plugin-verouderd");
  const cms = gevonden.cms;
  return {
    status,
    ...(status === "onbekend" ? { reden: "bron" } : {}),
    problemen,
    waarde: {
      cms: cms ? { naam: cms.naam, versie: cms.versie } : null,
      metLekken: onderdelen.filter((o) => o.aantalLekken).length,
      verouderd: onderdelen.filter((o) => o.status === "slecht" || o.status === "aandacht").length,
      gevonden: onderdelen.length,
      paginas: gelezen.length,
    },
    onderdelen,
    bewijs: [
      ...onderdelen.map((o) => ({ k: o.soort, v: `${o.bewijs}`, url: o.url, s: o.status })),
      { k: "paginas", v: gelezen.map((p) => p.url).join("\n") },
      ...(feedAntw?.ok ? [{ k: "feed", v: feedAntw.url }] : []),
      { k: "robots", v: robots.groep ? `robots.txt, groep ${robots.groep}${overgeslagen ? `, ${overgeslagen} pagina('s) overgeslagen` : ""}` : "geen robots.txt-regels" },
      ...(bronFouten.length ? [{ k: "bronfout", v: bronFouten.join(", ") }] : []),
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// Alles samen: punt 2 tot en met 5
// ---------------------------------------------------------------------------------------------

async function veilig(fn) {
  try { return await fn(); } catch (e) { console.error("check-rapport punt", String(e?.stack || e).slice(0, 300)); return onbekend("fout"); }
}

async function haalBeide(host, einde) {
  const p = poorten();
  const sfx = (prot) => ((prot === "https" ? p.https !== 443 : p.http !== 80) ? `:${prot === "https" ? p.https : p.http}` : "");
  return Promise.all([
    haal(`https://${host}${sfx("https")}/`, { einde, maxBody: 1024 * 1024, oudeTls: true }),
    haal(`http://${host}${sfx("http")}/`, { einde, maxBody: 64 * 1024 }),
  ]);
}

export async function maakRapport(invoer, { budgetMs = 22000 } = {}) {
  const d = normaliseerDomein(invoer);
  if (!d.ok) return { ok: false, code: d.reden };
  const sleutel = `rest:${d.host}`;
  const c = cache.get(sleutel);
  if (c && Date.now() - c.t < CACHE_MS) return { ...c.uit, uitCache: true };
  if (!testbankModus() && !binnenLimiet(`rapport-domein:${d.host}`, 6)) return { ok: true, domein: d.host, punten: { verbinding: onbekend("limiet"), software: onbekend("limiet"), headers: onbekend("limiet"), email: onbekend("limiet") } };

  const start = Date.now();
  const einde = start + budgetMs;
  const mailDomein = d.host.replace(/^www\./, "");
  const emailBelofte = veilig(async () => beoordeelEmail(await meetEmailDns(mailDomein)));
  let host = d.host;
  let [https, http] = await haalBeide(host, Math.min(einde, start + 10000));
  // Zelfde gedrag als de PHP-check: werkt de naam zoals getypt niet, probeer hem met of zonder www.
  if (!https.ok && !https.stappen?.length && !http.ok && !http.stappen?.length && ["dns", "verbinding", "geweigerd", "tls"].includes(https.reden)) {
    const ander = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
    const [h2, h1] = await haalBeide(ander, Math.min(einde, Date.now() + 8000));
    if (h2.ok || h2.stappen?.length || h1.ok || h1.stappen?.length) { host = ander; https = h2; http = h1; }
  }
  const homepage = https.ok && https.status < 500 ? https : http.ok ? http : https.ok ? https : null;
  // Een blokkadepagina (WAF, 403, 429, 503) of foutpagina zegt niets over de echte headers of software: "niet te meten".
  const afgeschermd = homepage && homepage.status >= 400 ? onbekend([401, 403, 429, 503].includes(homepage.status) ? "afgeschermd" : "foutpagina") : null;
  const [verbinding, headers, software, email] = await Promise.all([
    veilig(async () => beoordeelVerbinding({ https, http })),
    veilig(async () => afgeschermd || (homepage ? { ...beoordeelHeaders(homepage) } : onbekend(https.reden || http.reden || "verbinding"))),
    veilig(async () => afgeschermd || (homepage ? meetSoftware(homepage, einde) : onbekend(https.reden || http.reden || "verbinding"))),
    emailBelofte,
  ]);
  const uit = { ok: true, domein: d.host, gemetenOp: host, gemeten: new Date().toISOString(), duurMs: Date.now() - start, versie: VERSIE_RAPPORT, punten: { verbinding, software, headers, email } };
  cache.set(sleutel, { t: Date.now(), uit });
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return uit;
}

// ---------------------------------------------------------------------------------------------
// Punt 1: snelheid op mobiel
// ---------------------------------------------------------------------------------------------

const PSI = () => (testbankModus() && process.env.CHECK_PSI_URL ? process.env.CHECK_PSI_URL : "https://www.googleapis.com/pagespeedonline/v5/runPagespeed");

export async function vraagPageSpeed(url, { sleutel = process.env.PAGESPEED_API_KEY, ms = 45000 } = {}) {
  const q = new URLSearchParams({ url, strategy: "mobile", category: "performance" });
  if (sleutel) q.set("key", sleutel);
  let r;
  try { r = await fetch(`${PSI()}?${q}`, { signal: AbortSignal.timeout(ms) }); } catch (e) { return { ok: false, reden: /timeout|abort/i.test(String(e?.name || e)) ? "psi-timeout" : "psi-onbereikbaar" }; }
  const j = await r.json().catch(() => null);
  if (r.status === 429) return { ok: false, reden: sleutel ? "psi-limiet" : "psi-limiet-zonder-sleutel" };
  if (r.status === 400 && /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS_FAILURE|NO_FCP|unable to/i.test(JSON.stringify(j?.error || ""))) return { ok: false, reden: "psi-kon-site-niet-laden" };
  if (r.status === 400 || r.status === 403) return { ok: false, reden: /key/i.test(JSON.stringify(j?.error || "")) ? "psi-sleutel" : "psi-fout" };
  if (!r.ok || !j) return { ok: false, reden: "psi-fout" };
  if (j.lighthouseResult?.runtimeError?.code && j.lighthouseResult.runtimeError.code !== "NO_ERROR") return { ok: false, reden: "psi-kon-site-niet-laden" };
  return { ok: true, data: j };
}

export async function meetSnelheid(invoer, { psiMs = 45000 } = {}) {
  const d = normaliseerDomein(invoer);
  if (!d.ok) return { ok: false, code: d.reden };
  const sleutel = `snelheid:${d.host}`;
  const c = cache.get(sleutel);
  if (c && Date.now() - c.t < CACHE_MS) return { ...c.uit, uitCache: true };
  const start = Date.now();
  const snelheid = await veilig(async () => {
    // Eerst zelf controleren dat de naam naar een publiek adres wijst; Google haalt hem daarna zelf op.
    let host = d.host;
    let adres = await zoekAdres(host);
    if (!adres.ok && adres.reden === "dns") { const ander = host.startsWith("www.") ? host.slice(4) : `www.${host}`; const a2 = await zoekAdres(ander); if (a2.ok) { host = ander; adres = a2; } }
    if (!adres.ok) return onbekend(adres.reden);
    const p = poorten();
    const doel = `https://${host}${p.https !== 443 ? `:${p.https}` : ""}/`;
    const psi = !testbankModus() && !binnenLimiet(`psi-domein:${host}`, 3) ? { ok: false, reden: "limiet" } : await vraagPageSpeed(doel, { ms: psiMs });
    const oordeel = psi.ok ? beoordeelPageSpeed(psi.data) : null;
    if (oordeel) return oordeel;
    // Terugval: één eigen GET van de homepage.
    let eigen = await haal(doel, { einde: Date.now() + 10000, maxBody: 2 * 1024 * 1024 });
    if (!eigen.ok) eigen = await haal(`http://${host}${p.http !== 80 ? `:${p.http}` : ""}/`, { einde: Date.now() + 8000, maxBody: 2 * 1024 * 1024 });
    return beoordeelEigenSnelheid(eigen, { psiReden: psi.ok ? "psi-geen-score" : psi.reden, regio: process.env.VERCEL_REGION ? `Vercel ${process.env.VERCEL_REGION}` : null });
  });
  const uit = { ok: true, domein: d.host, gemeten: new Date().toISOString(), duurMs: Date.now() - start, versie: VERSIE_RAPPORT, punten: { snelheid } };
  // Een terugval door de limiet van Google bewaren we korter, zodat een sleutel die Marinus net plakt meteen telt.
  if (snelheid.waarde?.bron === "pagespeed" || snelheid.status === "onbekend") cache.set(sleutel, { t: Date.now(), uit });
  else cache.set(sleutel, { t: Date.now() - CACHE_MS + 2 * 60 * 1000, uit });
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return uit;
}

export function leegCache() { cache.clear(); }
