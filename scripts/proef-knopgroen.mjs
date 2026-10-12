// Proef knopgroen (12 oktober 2026, Marinus over de knop "Log in to free OS": "Graag deze kleur groen meer doortrekken."
// Gekozen: alle knoppen en links. Daarna: "En overal een hele lichte lightsweep in het groen".)
// Elke zichtbare knop of link met een groene vulling, rand of tekst gebruikt precies #1A8F45 (rgb 26,143,69). Het felle
// merkgroen #25D366 blijft voor de punt achter koppen en de stippen. Elke knop met een dekkende groene vulling heeft een lichte lichtsweep ("alsof ie shined") die
// loopt, en met prefers-reduced-motion staat die stil. Leest de bouw in dist/, dus eerst npm run build.
// PLAYWRIGHT_CORE kan naar een aanwezige Playwright-module wijzen.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}

const ROUTES = ["/", "/nl/", "/nl/het-os/", "/nl/prijzen/", "/nl/team/", "/de/"];
const BREEDTES = [390, 1440];
const eisen = [];
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
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright");
const browser = await chromium.launch();

// In de pagina: groene knoppen en links verzamelen.
const meet = () => {
  const dekkend = (v) => { const m = v.match(/^rgba\(\d+, \d+, \d+, ([\d.]+)\)/); return !m || +m[1] >= 0.9; };
  const groen = (v) => { const m = v.match(/^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?/); if (!m) return null; const [r, g, b] = m.slice(1, 4).map(Number); const a = m[4] === undefined ? 1 : +m[4]; return a > 0.05 && g > r + 60 && g > b + 40 ? `${r},${g},${b}` : null; };
  const KNOP = "26,143,69";
  const fout = [], sweep = [];
  for (const el of document.querySelectorAll("a, button, [role=button]")) {
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    if (!r.width || !r.height || s.visibility === "hidden" || +s.opacity === 0) continue;
    const naam = `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).slice(0, 3).join(".")} "${el.textContent.trim().slice(0, 30)}"`;
    const vul = groen(s.backgroundColor), rand = s.borderTopWidth !== "0px" ? groen(s.borderTopColor) : null, tekst = groen(s.color);
    for (const [soort, w] of [["vulling", vul], ["rand", rand], ["tekst", tekst]]) if (w && w !== KNOP) fout.push(`${soort} rgb(${w}) ${naam}`);
    if (vul && dekkend(s.backgroundColor)) sweep.push({ naam, loopt: el.getAnimations().some((a) => a.playState === "running") });
  }
  return { fout, sweep };
};

for (const route of ROUTES) for (const breedte of BREEDTES) {
  const ctx = await browser.newContext({ viewport: { width: breedte, height: 900 } });
  await ctx.addCookies([{ name: "sn-taal", value: route.startsWith("/de/") ? "de" : route === "/" ? "en" : "nl", url: base }]);
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: "load" }); await page.waitForTimeout(800);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
  await page.waitForTimeout(1200);
  const { fout, sweep } = await page.evaluate(meet);
  const uniek = [...new Set(fout)];
  eisen.push([`${breedte} ${route}: knoppen en links alleen in #1A8F45 (${uniek.length} afwijkend)${uniek.length ? ": " + uniek.slice(0, 6).join(" | ") : ""}`, uniek.length === 0]);
  const stil = sweep.filter((k) => !k.loopt).map((k) => k.naam);
  eisen.push([`${breedte} ${route}: lichtsweep op elke groene knop (${sweep.length - stil.length}/${sweep.length})${stil.length ? ": " + [...new Set(stil)].slice(0, 4).join(" | ") : ""}`, sweep.length > 0 && stil.length === 0]);
  await ctx.close();
}

// Minder beweging: de sweep staat stil.
for (const breedte of BREEDTES) {
  const ctx = await browser.newContext({ viewport: { width: breedte, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + "/nl/", { waitUntil: "load" }); await page.waitForTimeout(800);
  const { sweep } = await page.evaluate(meet);
  const loopt = sweep.filter((k) => k.loopt).map((k) => k.naam);
  eisen.push([`${breedte} minder beweging: geen lichtsweep (${loopt.length} lopend)${loopt.length ? ": " + loopt.slice(0, 3).join(" | ") : ""}`, loopt.length === 0]);
  await ctx.close();
}

await browser.close();
server.close();
const rood = eisen.filter(([, ok]) => !ok);
for (const [naam, ok] of eisen) console.log(`${ok ? "groen" : "ROOD "} ${naam}`);
console.log(rood.length ? `${rood.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(rood.length ? 1 : 0);
