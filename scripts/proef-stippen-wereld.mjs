// Proef wereldkaart in het stippenraster (11 oktober 2026, stippenproject chat 7). De kaart "Let's keep the world social. Now."
// tekende eigen SVG-stippen die nergens op het 32-px-sitegrid vielen, met pulsringen op de plekken. Nu:
// 1. geen eigen SVG-land en geen pulsringen meer;
// 2. een canvas waarvan elke stip op het siteraster valt (32 px, of een onderverdeling van 16 of 8 px die het 32-raster bevat:
//    stipmiddens op 16 + stap·k in documentcoördinaten);
// 3. het land staat er ook met "minder beweging" (eindstand);
// 4. hover op een plek (Amsterdam) geeft een kleurgolf (geel) door de stippen.
// Leest de bouw in dist/, dus eerst npm run build. Rood op feat/stippen-site-20261011 cdcbe51, groen op stippen/wereld.
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

// Meet het canvas van de kaart: positie in het document, stap, en waar de verlichte pixels liggen.
const meet = () => {
  const fig = document.querySelector(".sn-wereld-kaart");
  const c = fig?.querySelector("canvas");
  const uit = { svgLand: !!document.querySelector(".sn-wereld-land"), puls: document.querySelectorAll(".sn-wereld-puls").length, canvas: !!c };
  if (!c) return uit;
  const stap = Number(fig.dataset.stap || 0);
  const r = c.getBoundingClientRect();
  const links = r.left + scrollX, boven = r.top + scrollY;
  const sx = c.width / r.width, sy = c.height / r.height;
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let aan = 0, naast = 0, geel = 0;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const o = (y * c.width + x) * 4;
    if (d[o + 3] < 60) continue;
    aan++;
    if (d[o] > 180 && d[o + 1] > 130 && d[o + 2] < 90) geel++;
    // documentpositie van deze pixel; dichtstbijzijnde stipmidden op 16 + stap·k
    const px = links + (x + 0.5) / sx, py = boven + (y + 0.5) / sy;
    const dx = Math.abs(((px - 16) % stap + stap * 1.5) % stap - stap / 2), dy = Math.abs(((py - 16) % stap + stap * 1.5) % stap - stap / 2);
    if (Math.hypot(dx, dy) > 3.2) naast++;
  }
  return { ...uit, stap, links, boven, aan, naast, geel };
};

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const [breedte, beweging] of [[1440, "no-preference"], [390, "no-preference"], [1440, "reduce"]]) {
    const naam = `${breedte}${beweging === "reduce" ? " (minder beweging)" : ""}`;
    const context = await browser.newContext({ viewport: { width: breedte, height: 900 }, reducedMotion: beweging });
    await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
    const page = await context.newPage();
    await page.goto(`${base}/nl/`);
    await page.waitForLoadState("networkidle");
    const kaart = page.locator(".sn-wereld-kaart");
    if (!(await kaart.count())) { eisen.push([`${naam}: wereldkaart staat op /nl/`, false]); await context.close(); continue; }
    await kaart.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2600); // binnenkomst (land vult zich) is klaar
    const m = await page.evaluate(meet);
    eisen.push([`${naam}: geen eigen SVG-land meer`, !m.svgLand]);
    eisen.push([`${naam}: geen pulsringen meer (${m.puls})`, m.puls === 0]);
    eisen.push([`${naam}: kaart is een stippencanvas`, m.canvas]);
    if (!m.canvas) { await context.close(); continue; }
    eisen.push([`${naam}: stap ${m.stap} px valt in het 32-raster`, [8, 16, 32].includes(m.stap)]);
    eisen.push([`${naam}: land getekend (${m.aan} pixels aan)`, m.aan > 2000]);
    eisen.push([`${naam}: elke pixel hoort bij een stip op het raster (${m.naast} ernaast)`, m.aan > 0 && m.naast === 0]);
    if (beweging !== "reduce") {
      const geelVoor = m.geel;
      await page.locator(".sn-wereld-lijst li", { hasText: "Amsterdam" }).hover();
      let geel = 0;
      for (let n = 0; n < 12 && geel <= geelVoor + 20; n++) { await page.waitForTimeout(80); geel = (await page.evaluate(meet)).geel; }
      eisen.push([`${naam}: hover op Amsterdam geeft een gele golf door de stippen (${geelVoor} → ${geel} gele pixels)`, geel > geelVoor + 20]);
      const na = await page.evaluate(meet);
      eisen.push([`${naam}: ook tijdens de golf alles op het raster (${na.naast} ernaast)`, na.naast === 0]);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

let fout = 0;
for (const [tekst, ok] of eisen) { console.log(`${ok ? "✓" : "✗"} ${tekst}`); if (!ok) fout++; }
console.log(fout ? `\nROOD: ${fout} van ${eisen.length} eisen niet gehaald.` : `\nGROEN: alle ${eisen.length} eisen gehaald.`);
process.exit(fout ? 1 : 0);
