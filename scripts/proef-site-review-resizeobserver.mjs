// Proef M12 (Indexworld, 5 november 2026): "A script that hides an error message (ResizeObserver loop) runs on every page."
// Eis 1: de gebouwde pagina's hebben geen script meer dat die fout wegdrukt.
// Eis 2: in een echte browser treedt de fout ook niet op: homepage en /nl/ op 375 en 1440 px, helemaal doorscrollen,
// het venster een paar keer van maat veranderen. Een eigen luisteraar staat vóór elk paginascript, dus hij ziet de fout
// ook als de pagina hem zelf zou wegdrukken.
// Leest dist/, dus eerst npm run build. PLAYWRIGHT_CORE kan naar een aanwezige playwright-core wijzen.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/index.html")) { console.error("Geen dist/index.html: draai eerst npm run build."); process.exit(1); }
const eisen = [];

const PADEN = ["dist/index.html", "dist/nl/index.html", "dist/team/index.html", "dist/security/index.html"];
for (const p of PADEN) {
  const html = readFileSync(p, "utf8");
  eisen.push([`${p}: geen script dat de ResizeObserver-fout wegdrukt`, !/ResizeObserver loop/.test(html)]);
  eisen.push([`${p}: geen ontwikkelcommentaar over deze review in de gepubliceerde HTML`, !/Indexworld M\d/.test(html)]);
}

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".mp4": "video/mp4" };
const server = createServer((req, res) => {
  let p = path.join("dist", decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const [breedte, hoogte] of [[375, 812], [1440, 900]]) {
    for (const route of ["/", "/nl/", "/team/", "/security/", "/diensten/", "/producten/"]) {
      const context = await browser.newContext({ viewport: { width: breedte, height: hoogte } });
      await context.route("**/*", (r) => (new URL(r.request().url()).origin === base ? r.continue() : r.abort()));
      await context.addInitScript(() => {
        window.__roFouten = [];
        window.addEventListener("error", (e) => { if (/ResizeObserver/.test(String(e.message))) window.__roFouten.push(String(e.message)); }, true);
      });
      const page = await context.newPage();
      const paginafouten = [];
      page.on("pageerror", (e) => paginafouten.push(String(e.message)));
      await page.goto(`${base}${route}`, { waitUntil: "load" });
      await page.waitForTimeout(1500);
      const hoog = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < hoog; y += Math.round(hoogte * 0.8)) { await page.mouse.wheel(0, Math.round(hoogte * 0.8)); await page.waitForTimeout(120); }
      for (const w of [breedte + 37, breedte - 21, breedte + 180, breedte]) { await page.setViewportSize({ width: Math.max(320, w), height: hoogte }); await page.waitForTimeout(250); }
      await page.waitForTimeout(800);
      const ro = await page.evaluate(() => window.__roFouten);
      eisen.push([`${breedte} ${route}: ${ro.length} ResizeObserver-fouten${ro.length ? ` (${ro[0]})` : ""}`, ro.length === 0]);
      eisen.push([`${breedte} ${route}: ${paginafouten.length} andere paginafouten${paginafouten.length ? ` (${paginafouten[0].slice(0, 80)})` : ""}`, paginafouten.length === 0]);
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
