// Proef logobalken (9 oktober 2026, Marinus: "Graag deze niet laten doodlopen dus gwn door laten gaan en die andere met logo's.").
// 1. NEXT TALKS in de hero: de lus schuift precies een helft op, dus elke helft moet minstens zo breed zijn als de zichtbare
//    strook, anders loopt de rij op brede schermen leeg. Gemeten op 375, 1440 en 2560 px.
// 2. "Zij melden zich al aan.": de partnerlogo's staan op witte chips, dus geen witmakend filter (brightness(0) invert(1)).
// Leest de bouw in dist/, dus eerst npm run build. Rood op main d97fa72, groen op fix/logobalken-20261009.
// PLAYWRIGHT_CORE kan naar een aanwezige Playwright-module wijzen; BROWSER_CHANNEL=chrome gebruikt de lokale Chrome.
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
  for (const breedte of [375, 1440, 2560]) {
    const page = await browser.newPage({ viewport: { width: breedte, height: 900 } });
    await page.goto(`${base}/nl/`, { waitUntil: "networkidle" });
    const m = await page.evaluate(() => {
      const strook = document.querySelector(".h-talking-strook");
      const helft = document.querySelector(".h-talking-lus > ul");
      return strook && helft ? { strook: strook.getBoundingClientRect().width, helft: helft.getBoundingClientRect().width } : null;
    });
    eisen.push([`${breedte}px: NEXT TALKS-helft ${m ? Math.round(m.helft) : "?"} px >= strook ${m ? Math.round(m.strook) : "?"} px`, !!m && m.helft >= m.strook]);
    if (breedte === 1440) {
      const filters = await page.evaluate(() => [...document.querySelectorAll(".h-deur-logos img")].map((i) => getComputedStyle(i).filter));
      const wit = filters.filter((f) => f.includes("invert"));
      eisen.push([`partnerlogo's in eigen kleur (${filters.length} logo's, ${wit.length} wit gemaakt)`, filters.length === 5 && wit.length === 0]);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "GROEN" : "ROOD "}  ${naam}`); if (!ok) fout++; }
console.log(fout ? `\n${fout} eis(en) rood.` : "\nAlles groen.");
process.exit(fout ? 1 : 0);
