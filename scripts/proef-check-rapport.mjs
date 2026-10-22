#!/usr/bin/env node
// Proef: het websiterapport onder de PHP-uitslag op /check (22 oktober 2026). Rood op feat/php-check (c62dc91), groen op
// feat/check-rapport. Per punt een nagebootste meting met de verwachte uitslag, plus de regels "nooit een foutmelding" en
// "niet te meten is nooit rood". Gebruik: node scripts/proef-check-rapport.mjs
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const laad = async (p) => (fs.existsSync(p) ? import(pathToFileURL(`${process.cwd()}/${p}`).href) : null);

const tsx = lees("proposal/CheckRapport.tsx");
eis(/<CheckRapport domein=/.test(lees("proposal/PhpCheck.tsx")), "rapport staat onder de PHP-uitslag in PhpCheck.tsx");
eis(/"check-rapport"/.test(lees("vite.config.ts")) && /api\/check-rapport\.js/.test(lees("vercel.json")), "api/check-rapport ook lokaal en met maxDuration op Vercel");
eis(/onbekend: "Niet te meten"/.test(tsx) && /role="progressbar"/.test(tsx), "niet te meten heet zo; snelheid met zichtbare voortgang");
eis(/reden: "fout"/.test(tsx) && /\.catch\(\(\) => null\)/.test(tsx), "faalt onze API, dan per punt 'Niet te meten', geen foutmelding");

const p = await laad("server/rapport/punten.mjs");
const s = await laad("server/rapport/software.mjs");
const o = await laad("server/rapport/ophalen.mjs");
if (!p || !s || !o) eis(false, "servermodules bestaan (server/rapport/*.mjs)");
else {
  const nu = Date.parse("2026-10-22T12:00:00Z");
  const tls = (dagen, extra = {}) => ({ protocol: "TLSv1.3", geldig: true, fout: null, onderwerp: "x.nl", uitgever: "Let's Encrypt", geldigTot: new Date(nu + dagen * 864e5).toISOString(), ...extra });
  const stap = (url, status, headers = {}, t = null) => ({ url, status, headers, tls: t });
  const hsts = { "strict-transport-security": "max-age=31536000" };
  const goedHttps = { ok: true, url: "https://x.nl/", status: 200, headers: hsts, stappen: [stap("https://x.nl/", 200, hsts, tls(80))] };
  const doorHttp = { ok: true, url: "https://x.nl/", stappen: [stap("http://x.nl/", 301, { location: "https://x.nl/" }), stap("https://x.nl/", 200)] };
  // 2. Verbinding
  eis(p.beoordeelVerbinding({ https: goedHttps, http: doorHttp, nu }).status === "goed", "verbinding: https, geldig, HSTS, doorsturen = goed");
  eis(p.beoordeelVerbinding({ https: { ...goedHttps, stappen: [stap("https://x.nl/", 200, hsts, tls(10))] }, http: doorHttp, nu }).problemen[0] === "cert-bijna", "verbinding: certificaat verloopt over 10 dagen = aandacht (grens 21)");
  eis(p.beoordeelVerbinding({ https: { ...goedHttps, stappen: [stap("https://x.nl/", 200, hsts, tls(-3, { geldig: false, fout: "CERT_HAS_EXPIRED" }))] }, http: doorHttp, nu }).status === "slecht", "verbinding: verlopen certificaat = slecht");
  eis(p.beoordeelVerbinding({ https: { ...goedHttps, stappen: [stap("https://x.nl/", 200, hsts, tls(80, { protocol: "TLSv1" }))] }, http: doorHttp, nu }).problemen.includes("tls-oud"), "verbinding: TLS 1.0 = slecht");
  eis(p.beoordeelVerbinding({ https: { ok: false, reden: "geweigerd", stappen: [] }, http: { ok: true, url: "http://x.nl/", status: 200, stappen: [stap("http://x.nl/", 200)] }, nu }).problemen[0] === "geen-https", "verbinding: alleen http = slecht");
  eis(p.beoordeelVerbinding({ https: { ok: true, url: "https://x.nl/", stappen: [stap("https://x.nl/", 200, {}, tls(80))] }, http: { ok: true, url: "http://x.nl/", status: 200, stappen: [stap("http://x.nl/", 200)] }, nu }).problemen.join() === "geen-hsts,geen-doorsturen", "verbinding: geen HSTS en geen doorsturen = aandacht");
  eis(p.beoordeelVerbinding({ https: { ok: false, reden: "dns", stappen: [] }, http: { ok: false, reden: "dns", stappen: [] }, nu }).status === "onbekend", "verbinding: onbereikbaar = niet te meten, nooit rood");
  // 4. Headers
  const alle = { "content-security-policy": "default-src 'self'; frame-ancestors 'self'", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "permissions-policy": "camera=()" };
  eis(p.beoordeelHeaders({ url: "https://x.nl/", headers: alle }).status === "goed", "headers: alle vijf (frame via frame-ancestors) = goed");
  eis(p.beoordeelHeaders({ url: "https://x.nl/", headers: { ...alle, server: "Apache/2.4.41 (Ubuntu)" } }).problemen.includes("versie-lek"), "headers: Server met versie = versielek, aandacht");
  eis(p.beoordeelHeaders({ url: "https://x.nl/", headers: { "x-content-type-options": "nosniff" } }).status === "slecht", "headers: 1 van 5 = slecht");
  eis(p.beoordeelHeaders({ url: "https://x.nl/", headers: { "content-security-policy-report-only": "default-src 'self'" } }).problemen.includes("mist-csp"), "headers: alleen Report-Only telt niet als CSP");
  // 5. E-mail
  const mx = [{ exchange: "mx.x.nl", priority: 10 }];
  eis(p.beoordeelEmail({ domein: "x.nl", txt: ["v=spf1 include:_spf.google.com -all"], dmarc: ["v=DMARC1; p=reject; rua=mailto:d@x.nl"], mx }).status === "goed", "e-mail: SPF -all en DMARC reject = goed");
  eis(p.beoordeelEmail({ domein: "x.nl", txt: ["v=spf1 -all"], dmarc: ["v=DMARC1; p=none"], mx }).status === "aandacht", "e-mail: DMARC p=none = aandacht");
  eis(p.beoordeelEmail({ domein: "x.nl", txt: [], dmarc: [], mx }).problemen.join() === "geen-spf,geen-dmarc", "e-mail: geen SPF en geen DMARC = slecht");
  eis(p.beoordeelEmail({ domein: "x.nl", txt: ["v=spf1 +all"], dmarc: ["v=DMARC1; p=reject"], mx }).problemen.includes("spf-open"), "e-mail: SPF +all = slecht");
  eis(p.beoordeelEmail({ domein: "x.nl", txt: ["v=spf1 -all"], dmarc: { fout: "timeout" }, mx }).status === "onbekend", "e-mail: DMARC-opzoeking mislukt = niet te meten, niet goed op de helft");
  eis(p.beoordeelEmail({ domein: "bestaatniet.nl", txt: { fout: "nxdomain" }, dmarc: [], mx: [] }).status === "onbekend", "e-mail: domein bestaat niet = niet te meten, nooit rood");
  // 1. Snelheid
  const psi = (score, lcp) => ({ lighthouseResult: { lighthouseVersion: "12.6.0", categories: { performance: { score } }, audits: { "largest-contentful-paint": { numericValue: lcp }, "total-blocking-time": { numericValue: 150 }, "cumulative-layout-shift": { numericValue: 0.02 }, "server-response-time": { numericValue: 300 }, "total-byte-weight": { numericValue: 1.2e6 } } }, loadingExperience: {} });
  eis(p.beoordeelPageSpeed(psi(0.95, 1800)).status === "goed" && p.beoordeelPageSpeed(psi(0.95, 1800)).waarde.score === 95, "snelheid: PageSpeed 95 = goed, score als getal");
  eis(p.beoordeelPageSpeed(psi(0.34, 7200)).status === "slecht" && p.beoordeelPageSpeed(psi(0.34, 7200)).problemen[0] === "lcpMs-slecht", "snelheid: PageSpeed 34 met LCP 7,2 s = slecht");
  const eigen = p.beoordeelEigenSnelheid({ ok: true, ttfbMs: 2300, lijnBytes: 90000, codering: null }, { psiReden: "psi-limiet-zonder-sleutel" });
  eis(eigen.status === "slecht" && eigen.waarde.bron === "eigen" && eigen.problemen.includes("geen-compressie"), "snelheid: zonder Google een eigen meting (TTFB 2,3 s = slecht, geen compressie)");
  eis(p.beoordeelEigenSnelheid({ ok: false, reden: "timeout" }, { psiReden: "psi-timeout" }).status === "onbekend", "snelheid: niets te meten = niet te meten");
  // 3. Software
  const html = `<meta name="generator" content="WordPress 6.4.2" /><script src="/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"></script>
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script><link rel="stylesheet" href="/wp-content/plugins/contact-form-7/style.css?ver=5.8.1">
    <script src="/wp-content/plugins/zonder-versie/a.js?ver=6.4.2"></script><link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">`;
  const g = s.vindSoftware([{ url: "https://x.nl/", body: html }]);
  eis(g.cms?.versie === "6.4.2", "software: WordPress-versie uit de generator");
  eis(["jquery@3.7.1", "jquery@1.12.4", "bootstrap@3.3.7"].every((k) => g.bibliotheken.some((b) => `${b.naam}@${b.versie}` === k)), "software: jQuery via wp-includes ?ver= en code.jquery.com, Bootstrap via cdnjs");
  eis(g.plugins.length === 1 && g.plugins[0].slug === "contact-form-7" && g.plugins[0].versie === "5.8.1", "software: pluginversie alleen uit de HTML; ?ver= gelijk aan WordPress telt niet");
  eis(s.vindSoftware([], { url: "https://x.nl/feed/", body: "<generator>https://wordpress.org/?v=6.2.1</generator>" }).cms?.versie === "6.2.1", "software: WordPress-versie uit de gelinkte feed");
  // Grenzen
  eis(o.magVolgensRobots(o.leesRobots("User-agent: *\nDisallow: /prive\nAllow: /prive/open"), "/prive/x") === false && o.magVolgensRobots(o.leesRobots("User-agent: *\nDisallow: /prive\nAllow: /prive/open"), "/prive/open/a") === true, "robots.txt: langste regel wint");
  eis(o.magVolgensRobots(o.leesRobots("User-agent: SocialNowCheck\nDisallow: /\n\nUser-agent: *\nDisallow:"), "/over") === false, "robots.txt: eigen groep voor SocialNowCheck gaat voor *");
  eis(o.USER_AGENT === "SocialNowCheck/1.0 (+https://socialnow.nl/check)", "eigen user agent");
  eis((await o.zoekAdres("127.0.0.1")).ok === false && (await o.zoekAdres("localhost")).ok === false && (await o.zoekAdres("metadata.internal")).ok === false, "SSRF: IP-adressen, localhost en interne namen geweigerd");
  const r = await laad("server/check-rapport.mjs");
  const pag = r.kiesPaginas('<a href="/over">o</a><a href="/wp-admin/">a</a><a href="https://ander.nl/x">x</a><a href="/over#team">t</a><a href="/c.pdf">p</a><a href="/contact">c</a>', "https://x.nl/");
  eis(pag.join() === "https://x.nl/over,https://x.nl/contact", "pagina's: alleen interne links, geen wp-admin, geen bestanden, geen dubbele");
  const api = lees("api/check-rapport.js");
  eis(/binnenLimiet\(`rapport-\$\{deel\}-ip:/.test(api) && /rapport-domein:/.test(lees("server/check-rapport.mjs")) && /CACHE_MS = 10 \* 60 \* 1000/.test(lees("server/check-rapport.mjs")), "limiet per IP en per domein, cache 10 minuten");
  eis(/punten: leeg\("fout"\)/.test(api), "api geeft bij een eigen fout ook punten (niet te meten)");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
