// Proef M9 (Indexworld, 5 november 2026): "No CSP and no clickjack protection (frame headers)."
// De inhoudsregels staan al als <meta http-equiv="Content-Security-Policy"> in index.html; een meta-CSP kan frame-ancestors
// niet zetten. Eis: vercel.json stuurt op elk pad frame-ancestors (alleen socialnow.nl en eigen subdomeinen) en
// X-Frame-Options, en verder niets dat de pagina kan breken.
// Browserdeel: een lokale server past de headers uit vercel.json toe op dist/. Een pagina op een ander adres mag de site niet
// in een frame laden, de site zelf wel; en op de belangrijkste pagina's komt geen enkele CSP-overtreding voor.
// Leest dist/, dus eerst npm run build. PLAYWRIGHT_CORE kan naar een aanwezige playwright-core wijzen.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/index.html")) { console.error("Geen dist/index.html: draai eerst npm run build."); process.exit(1); }
const eisen = [];
const config = JSON.parse(readFileSync("vercel.json", "utf8"));
const alles = (config.headers || []).find((h) => h.source === "/(.*)")?.headers || [];
const kop = (naam) => alles.find((h) => h.key.toLowerCase() === naam.toLowerCase())?.value;
const csp = kop("Content-Security-Policy") || "";
eisen.push([`vercel.json: frame-ancestors op elk pad (${csp || "ontbreekt"})`, /frame-ancestors 'self'/.test(csp)]);
eisen.push(["vercel.json: CSP-header bevat alleen frame-ancestors (de inhoudsregels blijven in de meta-CSP)", csp !== "" && csp.split(";").map((d) => d.trim()).filter(Boolean).every((d) => d.startsWith("frame-ancestors"))]);
eisen.push([`vercel.json: X-Frame-Options (${kop("X-Frame-Options") || "ontbreekt"})`, kop("X-Frame-Options") === "SAMEORIGIN"]);

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".mp4": "video/mp4" };
let metKoppen = true; // de positieve controle zet de headers even uit
const server = createServer((req, res) => {
  let p = path.join("dist", decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
  const koppen = { "content-type": types[path.extname(p)] || "application/octet-stream" };
  if (metKoppen) for (const h of alles) koppen[h.key] = h.value;
  res.writeHead(200, koppen);
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
// Een vreemde site op een ander adres (andere poort = ander origin).
const vreemd = createServer((req, res) => { res.writeHead(200, { "content-type": "text/html" }); res.end(`<iframe id="f" src="${base}/" width="800" height="600"></iframe>`); });
await new Promise((r) => vreemd.listen(0, "127.0.0.1", r));
const vreemdBase = `http://127.0.0.1:${vreemd.address().port}`;

const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.route("**/*", (r) => { const o = new URL(r.request().url()).origin; return o === base || o === vreemdBase ? r.continue() : r.abort(); });
  await context.addInitScript(() => { window.__csp = []; document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(`${e.effectiveDirective} ${e.blockedURI}`)); });
  const page = await context.newPage();

  // Frame van de vreemde site: geeft true als de app erin echt geladen is.
  const framed = async () => {
    await page.goto(`${vreemdBase}/`, { waitUntil: "load" });
    const kind = page.frames().find((f) => f !== page.mainFrame());
    if (!kind) return { geladen: false, url: "geen" };
    await kind.waitForLoadState("load").catch(() => {});
    await page.waitForTimeout(800);
    return { geladen: await kind.evaluate(() => Boolean(document.querySelector("#root"))).catch(() => false), url: kind.url() };
  };
  // Positieve controle: zonder de headers moet hetzelfde frame wél laden, anders zegt de echte toets niets.
  metKoppen = false;
  const zonder = await framed();
  metKoppen = true;
  eisen.push([`controle: zonder headers laadt het frame wel (${zonder.url})`, zonder.geladen]);
  const met = await framed();
  eisen.push([`vreemde site kan socialnow.nl niet in een frame laden (frame: ${met.url})`, zonder.geladen && !met.geladen]);

  await page.goto(`${base}/`, { waitUntil: "load" });
  await page.evaluate((b) => { const f = document.createElement("iframe"); f.src = `${b}/connect`; f.id = "eigen"; document.body.append(f); }, base);
  await page.waitForTimeout(1200);
  const eigen = page.frames().find((f) => /\/connect$/.test(f.url()));
  const eigenOk = eigen ? await eigen.evaluate(() => /Coming/.test(document.body.innerText)).catch(() => false) : false;
  eisen.push(["de site zelf mag zichzelf wel in een frame laden", eigenOk]);

  for (const route of ["/", "/nl/", "/connect", "/security/", "/team/", "/diensten/"]) {
    await page.goto(`${base}${route}`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const v = await page.evaluate(() => window.__csp);
    const tekst = await page.evaluate(() => document.body.innerText.length);
    eisen.push([`${route}: ${v.length} CSP-overtredingen, ${tekst} tekens tekst${v.length ? ` (${v[0]})` : ""}`, v.length === 0 && tekst > 200]);
  }
  await context.close();
} finally {
  await browser.close();
  server.close();
  vreemd.close();
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
