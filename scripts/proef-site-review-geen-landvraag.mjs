// Proef M8 (Indexworld, 5 november 2026): "On your first visit the site asks milo-chat.socialnow-marinus.workers.dev for
// your country." Eis: geen landvraag meer naar buiten; de taalkeuze blijft gelijk voor wie een sitetaal in de browser heeft.
// Gauntlet r1/r2: ook een omweg naar een andere landdienst, een latere fetch of een verborgen iframe wordt rood
// (allowlist met de carrouselhosts bij naam, 15 s na networkidle).
// Leest dist/, dus eerst npm run build. PLAYWRIGHT_CORE kan naar een aanwezige playwright-core wijzen.
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/index.html")) { console.error("Geen dist/index.html: draai eerst npm run build."); process.exit(1); }
const eisen = [];
const js = readdirSync("dist/assets").filter((f) => f.endsWith(".js")).map((f) => readFileSync(`dist/assets/${f}`, "utf8")).join("\n");
eisen.push(["geen cdn-cgi/trace in de gebouwde scripts", !/cdn-cgi\/trace/.test(js)]);
eisen.push(["geen landvraag in dist/index.html", !/cdn-cgi\/trace|__snLand/.test(readFileSync("dist/index.html", "utf8"))]);

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

// Browsertaal -> verwacht pad na het laden. ja-JP en en-US houden Engels, regio zonder sitetaal ook.
// ru-BE, tr-CH en zh-Hant-TW hebben geen sitetaal: daar beslist alleen de regio uit de browsertaal (browserLand).
const GEVALLEN = [["en-US", "/"], ["nl-NL", "/nl/"], ["de-CH", "/de/"], ["fr-BE", "/fr/"], ["ja-JP", "/"], ["pt-BR", "/pt/"], ["ru-BE", "/nl/"], ["tr-CH", "/de/"], ["zh-Hant-TW", "/"]];
// De live klantsites in de websitecarrousel (proposal/FreeWebsite.tsx, data/projects.ts webShowcaseProjects).
const CARROUSEL = new Set(["vastiq.ai", "ilgordo.nl", "www.vdz-brigade.nl", "vdz-brigade.nl", "newblack.netlify.app", "divinemachines.nl"]);
// Hoe lang na networkidle de proef nog meekijkt. Elke grens is te omzeilen met een latere fetch; daarom vangt de CSP
// (connect-src zonder wildcard) de rest af en toetst proef-site-review-headers.mjs die CSP.
const NAKIJKEN_MS = 15000;
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  for (const [locale, verwacht] of GEVALLEN) {
    const context = await browser.newContext({ locale, viewport: { width: 1280, height: 800 } });
    // Elk extern verzoek telt (gauntlet r1: een omweg via ipapi.co of een latere fetch moet ook rood worden). Toegestaan zijn
    // alleen iframe-documenten van de klantsites in de websitecarrousel, bij naam (gauntlet r2: een verborgen iframe naar
    // een landdienst moet ook rood worden). Komt er een site bij in de carrousel, dan zet je hem hier in CARROUSEL.
    const buiten = new Set();
    const nietToegestaan = new Set();
    await context.route("**/*", (r) => {
      const q = r.request();
      const u = new URL(q.url());
      if (u.origin === base) return r.continue();
      buiten.add(u.host);
      if (!(q.resourceType() === "document" && q.frame() !== q.frame().page().mainFrame() && CARROUSEL.has(u.host))) nietToegestaan.add(`${q.resourceType()} ${u.host}${u.pathname}`);
      return r.abort();
    });
    const page = await context.newPage();
    const fouten = [];
    page.on("pageerror", (e) => fouten.push(String(e.message)));
    // Hydratiefouten van React (#418, #423, #424) komen als console.error, niet als pageerror.
    page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_FAILED/.test(m.text())) fouten.push(m.text()); });
    await page.goto(`${base}/`, { waitUntil: "load" });
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(NAKIJKEN_MS);
    const pad = new URL(page.url()).pathname;
    const workers = [...buiten].filter((h) => /workers\.dev$/.test(h));
    eisen.push([`${locale}: geen sn-land-cookie zonder echte keuze`, !(await context.cookies()).some((c) => c.name === "sn-land")]);
    eisen.push([`${locale}: geen extern verzoek buiten de carrousel-frames binnen ${NAKIJKEN_MS / 1000} s na networkidle${nietToegestaan.size ? ` (${[...nietToegestaan].slice(0, 2).join(", ")})` : ""}`, nietToegestaan.size === 0]);
    eisen.push([`${locale}: geen verzoek naar workers.dev bij het eerste bezoek${workers.length ? ` (${workers.join(", ")})` : ""}`, workers.length === 0]);
    eisen.push([`${locale}: taal ${pad} (verwacht ${verwacht})`, pad === verwacht]);
    eisen.push([`${locale}: ${fouten.length} paginafouten${fouten.length ? ` (${fouten[0].slice(0, 80)})` : ""}`, fouten.length === 0]);
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
