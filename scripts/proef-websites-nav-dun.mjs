// Proef navigatie onder "Onze websites" (27 oktober 2026, Marinus): de dikke groene cirkels met tekstpijlen "niet zo mooi";
// gekozen variant A, "dun en strak", ook voor de homepage (gelijk aan de website-onboarding).
// Eisen, op 375 en 1440 px, op de gebouwde homepage in nl en en:
// - vorige/volgende: rond, doorzichtig, dunne lichte rand, een SVG-pijl in plaats van tekst "←"/"→", wit icoon;
//   40 px op desktop, minstens 44 px op mobiel (aanraakdoel);
// - paginering als smalle balkjes: actief 28 x 2 px groen (#25D366), de rest 14 x 2 px;
// - de knoppen werken nog: "volgende" zet de tweede site actief.
// Browser op en-US, anders stuurt de taaldetectie / door naar /nl/. Leest de bouw in dist/, dus eerst npm run build. PLAYWRIGHT_CORE en BROWSER_CHANNEL=chrome zoals de andere proeven.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
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
const eisen = [];

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const breedte of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width: breedte, height: 900 }, reducedMotion: "reduce", locale: "en-US", timezoneId: "America/New_York" });
    await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
    const page = await context.newPage();
    for (const taal of ["nl", "en"]) {
      await page.goto(`${base}${taal === "en" ? "/" : `/${taal}/`}`);
      await page.waitForLoadState("networkidle");
      const n = `${breedte} ${taal}`;
      const meet = () => page.evaluate(() => {
        const nav = document.querySelector("#free-website .sn-web-navigation");
        if (!nav) return null;
        nav.scrollIntoView({ block: "center" });
        const knoppen = [...nav.querySelectorAll(":scope > button")].map((b) => {
          const s = getComputedStyle(b), r = b.getBoundingClientRect();
          return { svg: Boolean(b.querySelector("svg")), tekst: b.textContent.trim(), w: r.width, h: r.height, radius: s.borderTopLeftRadius,
            bg: s.backgroundColor, rand: s.borderTopColor, randBreedte: s.borderTopWidth, kleur: s.color };
        });
        const balkjes = [...nav.querySelectorAll(".sn-web-pagination button")].map((b) => {
          const s = b.querySelector("span"), r = s.getBoundingClientRect();
          return { aan: b.getAttribute("aria-pressed") === "true", w: Math.round(r.width), h: Math.round(r.height), bg: getComputedStyle(s).backgroundColor };
        });
        return { knoppen, balkjes, actief: document.querySelector("#free-website .sn-web-tile.is-active .sn-web-host")?.textContent };
      });
      const m = await meet();
      eisen.push([`${n}: navigatie aanwezig`, Boolean(m)]);
      if (!m) continue;
      const doel = breedte < 651 ? 44 : 40;
      for (const [i, k] of m.knoppen.entries()) {
        const naam = `${n}: knop ${i ? "volgende" : "vorige"}`;
        eisen.push([`${naam} heeft een SVG-pijl, geen tekstpijl ("${k.tekst}")`, k.svg && k.tekst === ""]);
        eisen.push([`${naam} rond en ${doel} px (${Math.round(k.w)}x${Math.round(k.h)}, ${k.radius})`, Math.round(k.w) === doel && Math.round(k.h) === doel && k.radius === "50%"]);
        eisen.push([`${naam} doorzichtig met dunne lichte rand (${k.bg}, ${k.randBreedte} ${k.rand})`, /rgba\(0, 0, 0, 0\)|transparent/.test(k.bg) && k.randBreedte === "1px" && /rgba\(255, 255, 255, 0\.1[0-9]*\)/.test(k.rand)]);
        eisen.push([`${naam} wit icoon (${k.kleur})`, k.kleur === "rgb(255, 255, 255)"]);
      }
      const aan = m.balkjes.filter((b) => b.aan), uit = m.balkjes.filter((b) => !b.aan);
      eisen.push([`${n}: actief balkje 28x2 groen (${aan.map((b) => `${b.w}x${b.h} ${b.bg}`).join()})`, aan.length === 1 && aan[0].w === 28 && aan[0].h === 2 && aan[0].bg === "rgb(37, 211, 102)"]);
      eisen.push([`${n}: overige balkjes 14x2 (${[...new Set(uit.map((b) => `${b.w}x${b.h}`))].join()})`, uit.length > 0 && uit.every((b) => b.w === 14 && b.h === 2)]);
      const voor = m.actief;
      await page.locator("#free-website .sn-web-navigation > button").last().click();
      const na = (await meet()).actief;
      eisen.push([`${n}: "volgende" wisselt de site (${voor} → ${na})`, Boolean(voor && na && voor !== na)]);
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
