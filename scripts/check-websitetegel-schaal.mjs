#!/usr/bin/env node
// Proef (27 okt 2026, Marinus: "Gaat niet helemaal goed met VASTIQ.AI"). In de carrousel "Altijd een gratis websitedemo"
// is elk voorbeeld een iframe van 1280 x 800 dat op de tegelbreedte wordt geschaald (--preview-scale). Op een breed
// scherm bleef die schaal 1, waardoor de site in een smallere tegel links en rechts werd afgesneden.
// Eis per breedte: de actieve iframe is niet breder dan zijn tegel. Twee keer: gewoon, en met een ResizeObserver die nooit
// vuurt (zo bootsen we de race na die Marinus zag: herladen of een verborgen venster, waarna de schaal op 1 bleef staan).
// Gebruik: PLAYWRIGHT_CORE=~/SocialNow-OS/app/node_modules/playwright-core/index.mjs node scripts/check-websitetegel-schaal.mjs <url of dist>
// Een map (bijv. dist) wordt geserveerd alsof het https://socialnow.nl is: vastiq.ai laat zich alleen daar in een frame zetten.
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
const arg = process.argv[2] || "https://socialnow.nl/nl/";
const map = existsSync(arg) && statSync(arg).isDirectory() ? arg : "";
const url = map ? "https://socialnow.nl/nl/" : arg;
const soorten = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".mp4": "video/mp4" };
const serveer = async (route) => {
  const pad = decodeURIComponent(new URL(route.request().url()).pathname);
  const kandidaat = [join(map, pad), join(map, pad, "index.html")].find((f) => existsSync(f) && statSync(f).isFile());
  if (!kandidaat) return route.fulfill({ status: 404, body: "" });
  return route.fulfill({ status: 200, body: readFileSync(kandidaat), contentType: soorten[extname(kandidaat)] || "application/octet-stream" });
};
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
for (const stil of [false, true]) for (const [breed, hoog] of [[1512, 945], [1920, 1080], [1024, 768], [375, 812]]) {
  const page = await browser.newPage({ viewport: { width: breed, height: hoog } });
  if (map) await page.route(/^https:\/\/(www\.)?socialnow\.nl\//, serveer);
  if (stil) await page.addInitScript(() => { ResizeObserver.prototype.observe = function () {}; });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await page.locator(".sn-web-deck").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => {
    const tegel = document.querySelector(".sn-web-tile.is-active"), vlak = tegel?.querySelector(".sn-web-preview"), frame = vlak?.querySelector("iframe");
    return { host: tegel?.querySelector(".sn-web-host")?.textContent, vlak: vlak?.clientWidth, frame: frame?.getBoundingClientRect().width };
  });
  eis(m.frame !== undefined && m.frame <= m.vlak + 1, `${breed}px${stil ? " (observer stil)" : ""}: ${m.host} past in de tegel (iframe ${Math.round(m.frame)} ≤ tegel ${m.vlak})`);
  await page.close();
}
await browser.close();
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
