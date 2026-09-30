// 30 september 2026: de prerender rendert in Node met het volledige woordenboek, de browser hydrateert na
// laadWoordenboek(taal, "kern"). Staat er in de HTML een zin die niet in de kern zit, dan geeft hydrateRoot
// React-fout 418 en tekent React de hele pagina opnieuw (flits, snelheidswinst weg). Deze proef laadt elke
// url uit dist/sitemap.xml op 1440 en 390 breed, met cookie sn-taal=en, en telt fout 418 en lege prerender.
// Gebruik na `npm run build`: node scripts/proef-hydratie.mjs [filter]   (filter bv. "/ja/")
import http from "node:http";
import path from "node:path";
import { existsSync, readFileSync, statSync } from "node:fs";

const DIST = path.resolve("dist");
// Lokaal geeft /projecten altijd 418 door de hostnaamtoets in LiveWebsites; op socialnow.nl niet.
const OVERSLAAN = process.env.ALLES ? /^$^/ : /\/projecten\/?$/;
const typen = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".mp4": "video/mp4", ".webm": "video/webm" };
const pw = await import(process.env.PLAYWRIGHT_CORE || "/Users/marinusbergsma/SocialNow-OS/app-explainer/node_modules/playwright-core/index.mjs");

const filter = process.argv[2] || "";
const paden = [...new Set([...readFileSync(path.join(DIST, "sitemap.xml"), "utf8").matchAll(/<loc>https:\/\/socialnow\.nl([^<]*)<\/loc>/g)].map((m) => m[1] || "/"))]
  .filter((p) => p.includes(filter));

const server = http.createServer((req, res) => {
  const pad = decodeURIComponent(req.url.split("?")[0]);
  let bestand = path.join(DIST, pad);
  if (existsSync(bestand) && statSync(bestand).isDirectory()) bestand = path.join(bestand, "index.html");
  const status = existsSync(bestand) ? 200 : 404;
  if (status === 404) bestand = path.join(DIST, "404.html");
  res.writeHead(status, { "content-type": typen[path.extname(bestand)] ?? "application/octet-stream" });
  res.end(readFileSync(bestand));
});
await new Promise((klaar) => server.listen(0, "127.0.0.1", klaar));
const basis = `http://127.0.0.1:${server.address().port}`;
const browser = await pw.chromium.launch({ headless: true });

const fouten = [];
let getest = 0;
for (const breedte of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width: breedte, height: breedte === 390 ? 844 : 900 }, reducedMotion: "reduce" });
  await context.addCookies([{ name: "sn-taal", value: "en", url: basis }]);
  await context.addInitScript(() => { try { localStorage.setItem("sn-akkoord", "9999-12-31"); } catch {} });
  // Beeld en film zijn voor deze proef niet nodig; dat scheelt minuten.
  await context.route(/\.(mp4|webm|webp|png|jpe?g)(\?|$)/, (route) => route.abort());
  const wachtrij = paden.filter((p) => !OVERSLAAN.test(p));
  await Promise.all(Array.from({ length: 6 }, async () => {
    const pagina = await context.newPage();
    let fout418 = false;
    pagina.on("pageerror", (e) => { if (/Minified React error #418|Hydration/i.test(e.message)) fout418 = true; });
    while (wachtrij.length) {
      const pad = wachtrij.shift();
      fout418 = false;
      await pagina.goto(basis + pad, { waitUntil: "domcontentloaded" }).catch(() => {});
      const prerender = await pagina.evaluate(() => document.getElementById("root")?.dataset.prerender || "").catch(() => "");
      await pagina.waitForTimeout(1200);
      getest++;
      if (!prerender) fouten.push(`${breedte} ${pad}: geen data-prerender`);
      if (fout418) fouten.push(`${breedte} ${pad}: React-fout 418 (hydratie klopt niet)`);
    }
    await pagina.close();
  }));
  await context.close();
}
await browser.close();
server.close();

console.log(`${getest} laadbeurten (${paden.length} urls, 1440 en 390; /projecten overgeslagen)`);
if (fouten.length) { console.log(`ROOD: ${fouten.length}`); for (const f of fouten.slice(0, 60)) console.log(" -", f); process.exit(1); }
console.log("GROEN: geen fout 418, elke pagina vooraf gerenderd");
