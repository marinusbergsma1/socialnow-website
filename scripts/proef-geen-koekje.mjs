// Proef geen cookiemelding (11 oktober 2026, Marinus): "Coockie pop up weg".
// Socialnow.nl plaatst geen trackingcookies, dus er hoeft niets gevraagd of gemeld te worden. Eisen op 390 en 1440 px,
// op de gebouwde homepage in NL/EN/DE/FR: na 3 seconden staat er geen cookiemelding (.h-koekje), en de cookieverklaring
// is nog bereikbaar via de voettekst. Leest de bouw in dist/, dus eerst npm run build. PLAYWRIGHT_CORE en BROWSER_CHANNEL=chrome.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}
const TALEN = ["nl", "en", "de", "fr"];
const BREEDTES = [390, 1440];
const pad = (taal) => (taal === "en" ? "/" : `/${taal}/`);
const eisen = [];
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json" };
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
    for (const taal of TALEN) {
      // Elke keer een schone context: de melding onthoudt in localStorage dat hij gesloten is.
      const context = await browser.newContext({ viewport: { width: breedte, height: 900 }, locale: "en-US" });
      await context.route("**/*", (route) => (new URL(route.request().url()).origin === base ? route.continue() : route.abort()));
      const page = await context.newPage();
      await page.goto(`${base}${pad(taal)}`);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3000);
      const melding = await page.locator(".h-koekje").count();
      await page.mouse.wheel(0, 30000);
      const verklaring = await page.waitForSelector('footer a[href*="cookie"]', { state: "attached", timeout: 15000 }).then(() => true).catch(() => false);
      const n = `${breedte} ${taal}`;
      eisen.push([`${n}: geen cookiemelding na 3 s (${melding})`, melding === 0]);
      eisen.push([`${n}: cookieverklaring in de voettekst`, verklaring]);
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
