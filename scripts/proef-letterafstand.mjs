// Proef letterafstand (9 oktober 2026, Marinus: "Op mobiel zitten de letters aan elkaar bij www.socialnow.nl."
// en "DAT WIL IK NOOIT."). Nergens negatieve letterafstand, en de spatie in TT Norms (0,19 em) wordt breder.
// Leest de bouw in dist/, dus eerst npm run build. Rood op main 606558c, groen op fix/letterafstand-mobiel-20261009.
// PLAYWRIGHT_CORE kan naar een aanwezige Playwright-module wijzen; BROWSER_CHANNEL=chrome gebruikt de lokale Chrome.
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}

const MIN_WOORDAFSTAND = 0.24; // em, spatie plus word-spacing
const ROUTES = ["/nl/", "/", "/nl/het-os/", "/nl/prijzen/", "/nl/team/"];
const BREEDTES = [375, 1440];
const eisen = [];

// 1. Gebouwde CSS: geen enkele negatieve letter-spacing, ook niet uit Tailwind-klassen als tracking-tight.
const cssBestanden = readdirSync("dist/assets").filter((f) => f.endsWith(".css"));
const negatiefCss = cssBestanden.flatMap((f) => readFileSync(`dist/assets/${f}`, "utf8").match(/letter-spacing:\s*-[^;}]*/g) || []);
eisen.push([`gebouwde CSS heeft geen negatieve letter-spacing (${negatiefCss.length} gevonden)`, cssBestanden.length > 0 && negatiefCss.length === 0]);

// 2. Browser (vangt ook inline stijlen) op de gebouwde site: per zichtbaar tekstblok letterafstand >= 0 en woordafstand >= 0,24 em.
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
    const context = await browser.newContext({ viewport: { width: breedte, height: 900 }, reducedMotion: "reduce" });
    await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
    const page = await context.newPage();
    for (const route of ROUTES) {
      if (!existsSync(path.join("dist", route, "index.html"))) { eisen.push([`${breedte} ${route}: pagina bestaat`, false]); continue; }
      await page.goto(`${base}${route}`);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      const meting = await page.evaluate((min) => {
        const canvas = document.createElement("canvas").getContext("2d");
        const krap = [];
        let geteld = 0;
        for (const el of document.querySelectorAll("body *")) {
          const tekst = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
          if (!tekst) continue;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (!r.width || !r.height || cs.visibility === "hidden" || cs.display === "none") continue;
          geteld++;
          const fs = parseFloat(cs.fontSize);
          const ls = cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing);
          const ws = cs.wordSpacing === "normal" ? 0 : parseFloat(cs.wordSpacing);
          canvas.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const spatie = canvas.measureText(" ").width;
          const woord = (spatie + ws + 2 * ls) / fs;
          if (ls < -0.01 || (tekst.includes(" ") && /TT Norms/.test(cs.fontFamily) && woord < min)) {
            krap.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} "${tekst.slice(0, 24)}" ls=${ls.toFixed(2)}px woord=${woord.toFixed(3)}em`);
          }
        }
        return { geteld, krap };
      }, MIN_WOORDAFSTAND);
      eisen.push([`${breedte} ${route}: ${meting.geteld} tekstblokken, ${meting.krap.length} te krap${meting.krap.length ? ` (${meting.krap.slice(0, 3).join("; ")})` : ""}`, meting.geteld > 20 && meting.krap.length === 0]);
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
