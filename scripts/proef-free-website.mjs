// Proef FREE WEBSITE (11 oktober 2026, Marinus): "Ik wil de onboarding gewoon als onderdeel van de site: FREE WEBSITE,
// groen vlak. En dan uitleg over beide, plus de onboarding, en dat we dan een mail krijgen."
// Eisen, op 375 en 1440 px, op de gebouwde homepage in alle 10 talen:
// - sectie #free-website met een groen vlak (#25D366-familie) en een kop die op een niet-groene punt eindigt;
// - beide routes (zelf bouwen in Odoo, gratis demo via SocialNow) met odoo.com-link;
// - 3 stappen, waarvan één met "mail";
// - een knop naar https://website.socialnow.nl die 200 geeft (en de formuliersessie daar ook);
// - de prijsregel;
// - elke tekst in de sectie bestaat in alle woordenboeken; de gratis-aanbodlink in de hero wijst naar #free-website;
// - niets buiten beeld (geen horizontale scroll, geen element in de sectie buiten het scherm).
// Browser op en-US, anders stuurt de taaldetectie / door naar /nl/. Leest de bouw in dist/, dus eerst npm run build. PLAYWRIGHT_CORE en BROWSER_CHANNEL=chrome zoals de andere proeven.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}

const ONBOARDING = "https://website.socialnow.nl";
const TALEN = ["nl", "en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const BREEDTES = [375, 1440];
const KOP = "GRATIS WEBSITE";
const ROUTE_ODOO = "Zelf bouwen in Odoo, gratis";
const ROUTE_DEMO = "Gratis demo via SocialNow";
const STAP_MAIL = "Wij krijgen meteen een mail met je antwoorden.";
const KNOP = "Start je gratis website-onboarding";
const PRIJS = "Gratis tot 10 GB opslag, daarna €20 per maand, of custom OS op aanvraag.";
const woordenboek = Object.fromEntries(TALEN.filter((t) => t !== "nl").map((t) => [t, JSON.parse(readFileSync(`proposal/i18n/${t}.json`, "utf8"))]));
const vertaal = (taal, zin) => (taal === "nl" ? zin : woordenboek[taal][zin]);
const pad = (taal) => (taal === "en" ? "/" : `/${taal}/`);
const eisen = [];

// 1. Onboarding bereikbaar: de pagina en de formuliersessie geven 200 (alleen lezen, geen inzending).
for (const url of [ONBOARDING, `${ONBOARDING}/api/sessie.php`]) {
  let status = 0;
  try { status = (await fetch(url, { redirect: "follow" })).status; } catch { status = 0; }
  eisen.push([`${url} geeft 200 (${status})`, status === 200]);
}

// 2. Woordenboeken: de kernzinnen bestaan in alle talen en zijn vertaald.
for (const taal of TALEN.filter((t) => t !== "nl")) {
  const ontbreekt = [KOP, ROUTE_ODOO, ROUTE_DEMO, STAP_MAIL, KNOP, PRIJS].filter((z) => !vertaal(taal, z));
  eisen.push([`${taal}: kernzinnen in het woordenboek${ontbreekt.length ? ` (mist: ${ontbreekt.join(" | ")})` : ""}`, ontbreekt.length === 0]);
}

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".otf": "font/otf", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json" };
const server = createServer((req, res) => {
  let p = path.join("dist", decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const breedte of BREEDTES) {
    const context = await browser.newContext({ viewport: { width: breedte, height: 900 }, reducedMotion: "reduce", locale: "en-US", timezoneId: "America/New_York" });
    await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
    const page = await context.newPage();
    for (const taal of TALEN) {
      const t = (zin) => vertaal(taal, zin) || `«${zin}»`;
      await page.goto(`${base}${pad(taal)}`);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => {
        const sectie = document.getElementById("free-website");
        const heroLink = [...document.querySelectorAll(".h-hero a")].find((a) => /#free-website$/.test(a.getAttribute("href") || ""));
        if (!sectie) return { sectie: false, heroLink: Boolean(heroLink) };
        sectie.scrollIntoView({ block: "start" });
        const kleur = getComputedStyle(sectie).backgroundColor.match(/\d+/g).map(Number);
        const punt = sectie.querySelector("h2 .sn-fw-punt");
        const puntKleur = punt ? getComputedStyle(punt).color.match(/\d+/g).map(Number) : null;
        const knop = sectie.querySelector('a[href^="https://website.socialnow.nl"]');
        const stappen = [...sectie.querySelectorAll("ol > li")].map((li) => li.textContent.replace(/\s+/g, " ").trim());
        const odooLink = [...sectie.querySelectorAll('a[href^="https://www.odoo.com"]')].length;
        const vw = document.documentElement.clientWidth;
        const buiten = [...sectie.querySelectorAll("*")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.left < -1 || r.right > vw + 1);
        }).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
        // Alle zichtbare tekst in de sectie, per tekstknoop, behalve wat translate="no" heeft.
        const zinnen = [];
        const loper = document.createTreeWalker(sectie, NodeFilter.SHOW_TEXT);
        while (loper.nextNode()) {
          const s = loper.currentNode.textContent.trim();
          if (s && !loper.currentNode.parentElement.closest('[translate="no"]')) zinnen.push(s);
        }
        return {
          sectie: true, heroLink: Boolean(heroLink), kleur, puntKleur,
          tekst: sectie.innerText.replace(/\s+/g, " "), zinnen,
          knop: knop ? { tekst: knop.textContent.trim(), target: knop.target, rel: knop.rel, hoogte: knop.getBoundingClientRect().height } : null,
          stappen, odooLink, buiten, scroll: document.documentElement.scrollWidth - vw,
        };
      });
      const n = `${breedte} ${taal}`;
      eisen.push([`${n}: sectie #free-website aanwezig`, m.sectie]);
      eisen.push([`${n}: de onboardinglink in het gratis aanbod (hero) wijst naar #free-website`, m.heroLink]);
      if (!m.sectie) continue;
      const [r, g, b] = m.kleur;
      eisen.push([`${n}: groen vlak (rgb ${m.kleur.slice(0, 3).join(",")})`, r < 90 && g > 180 && b > 70 && b < 140]);
      eisen.push([`${n}: kop "${t(KOP)}" met een niet-groene punt`, m.tekst.includes(t(KOP)) && m.puntKleur && !(m.puntKleur[1] > 150 && m.puntKleur[0] < 120)]);
      eisen.push([`${n}: beide routes ("${t(ROUTE_ODOO)}" en "${t(ROUTE_DEMO)}") met link naar odoo.com`, m.tekst.includes(t(ROUTE_ODOO)) && m.tekst.includes(t(ROUTE_DEMO)) && m.odooLink >= 1]);
      eisen.push([`${n}: 3 stappen, met de mail-stap`, m.stappen.length === 3 && m.stappen.some((s) => s.includes(t(STAP_MAIL))) && (taal !== "nl" && taal !== "en" || m.stappen.some((s) => /mail/i.test(s)))]);
      eisen.push([`${n}: knop "${t(KNOP)}" naar ${ONBOARDING} in nieuw tabblad`, Boolean(m.knop) && m.knop.tekst.includes(t(KNOP)) && m.knop.target === "_blank" && /noopener/.test(m.knop.rel) && m.knop.hoogte >= 44]);
      eisen.push([`${n}: prijsregel`, m.tekst.includes(t(PRIJS))]);
      const onvertaald = taal === "nl" ? [] : m.zinnen.filter((z) => !Object.values(woordenboek[taal]).includes(z));
      eisen.push([`${n}: alle ${m.zinnen.length} teksten vertaald${onvertaald.length ? ` (niet: ${onvertaald.slice(0, 3).join(" | ")})` : ""}`, onvertaald.length === 0]);
      eisen.push([`${n}: geen modelnamen`, !/claude|anthropic|openai|chatgpt|\bgpt\b|gemini/i.test(m.tekst)]);
      eisen.push([`${n}: niets buiten beeld (scroll ${m.scroll}px${m.buiten.length ? `, ${m.buiten.slice(0, 3).join(", ")}` : ""})`, m.scroll <= 0 && m.buiten.length === 0]);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
