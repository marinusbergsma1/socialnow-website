// Proef 11 oktober 2026 (stippen, chat 4 "Bereikt"): de Odoo Experience-tegel vertelt het echte verhaal in stippen (vlak vol
// aanmeldingen, uitdunnen tot vijf, één groen met kleurburst) in plaats van een markering over de logo's met "..."-puntjes;
// Il Gordo-ringen (100/100/93) zijn ringen van stippen; het vinkje heeft een ring; ongebruikte keyframes zijn weg.
// Start zelf een Vite-server op 3104 en kijkt met Chromium (ms-playwright 1243) op 1440 en 390.
// Gebruik: PLAYWRIGHT_CORE=/pad/naar/playwright-core/index.mjs node scripts/proef-stippen-bereikt.mjs [map-voor-schermafdrukken]
import { readFileSync } from "node:fs";
import { createServer, loadConfigFromFile } from "vite";
import { homedir } from "node:os";

const css = readFileSync("proposal/bereikt.css", "utf8"), tsx = readFileSync("proposal/Bereikt.tsx", "utf8");
const talen = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"].map((t) => JSON.parse(readFileSync(`proposal/i18n/${t}.json`, "utf8")));
const nieuw = ["Aanmeldingen", "Eén winnaar", "Honderden aanmeldingen dunnen uit tot vijf finalisten en één winnaar", "Bekijk de aftermovie van Odoo Experience 2026"];
const eisen = [
  ["geen ongebruikte keyframes meer (h-stip-aan, h-stroom, h-os-klop, h-melding, h-scroll)", !/@keyframes (h-stip-aan|h-stroom|h-os-klop|h-melding|h-scroll)\b/.test(css)],
  ["geen puntjesanimatie en geen gloed-ring om de winnaar", !css.includes("h-puntjes") && !css.includes("h-winnaar-golf") && !tsx.includes("h-trekking-bezig")],
  ["geen verzonnen aantal bij de beurs (geen cijfer voor aanmeldingen)", !/\b\d{3}\s*(aanmeldingen|sign-ups)/i.test(tsx)],
  ["nieuwe teksten in alle 9 woordenboeken", nieuw.every((k) => talen.every((d) => typeof d[k] === "string" && d[k].length > 0))],
];

const uit = process.argv[2];
// De siteconfig zonder de VASTIQ-preview (die wil poort 4330, vaak al bezet door een andere chat).
const { config } = await loadConfigFromFile({ command: "serve", mode: "development" }, "vite.config.ts");
config.plugins = config.plugins.flat().filter((p) => p && p.name !== "local-vastiq-preview");
const server = await createServer({ ...config, configFile: false, server: { port: 3104, strictPort: true, host: "127.0.0.1" }, logLevel: "error" });
await server.listen();
// playwright zit niet in package.json: PLAYWRIGHT_CORE wijst naar een playwright-core elders, Chromium uit de cache (1243).
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright");
const chrome = `${homedir()}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME || chrome });
try {
  for (const [breed, hoog] of [[1440, 1000], [390, 844]]) {
    const pagina = await browser.newPage({ viewport: { width: breed, height: hoog } });
    await pagina.goto("http://127.0.0.1:3104/", { waitUntil: "domcontentloaded" });
    await pagina.waitForSelector("#bereikt .h-bereikt-beurs", { timeout: 30000 });
    await pagina.locator("#bereikt .h-bereikt-beurs").scrollIntoViewIfNeeded();
    await pagina.waitForTimeout(400);
    // Halverwege het uitdunnen: veel minder stippen dan bij het begin; aan het eind precies vijf lichte plekken en één groene.
    const tel = () => pagina.evaluate(() => {
      const c = document.querySelector("#bereikt .h-beurs-stippen canvas");
      if (!c) return null;
      const ctx = c.getContext("2d"), d = ctx.getImageData(0, 0, c.width, c.height).data, schaal = c.width / c.getBoundingClientRect().width;
      // Raster van 16 px (desktop) of 8 px (telefoon): tel op beide en neem het raster waar de stippen op staan.
      // Het veld lijnt uit op het documentraster (chat 10), dus de stippen staan niet altijd op stap/2: probeer elke verschuiving.
      const telOp = (px) => {
        const stap = px * schaal; let best = { licht: 0, groen: 0 };
        for (let oy = 0; oy < stap; oy++) for (let ox = 0; ox < stap; ox++) {
          let licht = 0, groen = 0;
          for (let y = oy; y < c.height; y += stap) for (let x = ox; x < c.width; x += stap) {
            const n = (Math.round(y) * c.width + Math.round(x)) * 4; if (d[n + 3] < 40) continue;
            licht++; if (d[n + 1] > 150 && d[n] < 120) groen++;
          }
          if (licht > best.licht) best = { licht, groen };
        }
        return best;
      };
      const a = telOp(16), b = telOp(8);
      const { licht, groen } = b.licht > a.licht ? b : a;
      return { licht, groen };
    });
    await pagina.waitForTimeout(1900);
    const vol = await tel();
    await pagina.waitForTimeout(7500);
    const eind = await tel();
    const fase = await pagina.locator("#bereikt .h-beurs-fase .is-aan").textContent().catch(() => null);
    const klaar = await pagina.locator("#bereikt .h-trekking.is-klaar li.is-winnaar").count();
    eisen.push([`${breed}: beurs vult zich met honderden stippen (${vol?.licht ?? "geen canvas"})`, !!vol && vol.licht >= 100]);
    eisen.push([`${breed}: uitgedund tot vijf, één groen (${eind ? `${eind.licht} licht, ${eind.groen} groen` : "geen canvas"})`, !!eind && eind.licht >= 5 && eind.licht <= 40 && eind.groen >= 1]);
    eisen.push([`${breed}: fase "Eén winnaar" en de winnaar omrand (${fase})`, fase === "Eén winnaar" && klaar === 1]);
    const ilgordo = pagina.locator("#bereikt .h-bereikt-ilgordo");
    await ilgordo.scrollIntoViewIfNeeded(); await pagina.waitForTimeout(2600);
    const ringen = await pagina.evaluate(() => [...document.querySelectorAll("#bereikt .h-score-stippen canvas")].map((c) => {
      const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let g = 0;
      for (let n = 0; n < d.length; n += 4) if (d[n + 3] > 200 && d[n + 1] > 150 && d[n] < 120) g++;
      return g;
    }));
    eisen.push([`${breed}: drie Lighthouse-ringen van stippen, 93 minder groen dan 100 (${ringen.join("/")})`, ringen.length === 3 && ringen[0] > 0 && ringen[2] < ringen[0]]);
    const vink = await pagina.locator("#bereikt .h-vink-stippen").count();
    eisen.push([`${breed}: vinkje uit stippen staat er`, vink === 1]);
    if (uit) {
      await pagina.locator("#bereikt .h-bereikt-beurs").screenshot({ path: `${uit}/bereikt-beurs-${breed}.png` });
      await ilgordo.screenshot({ path: `${uit}/bereikt-ilgordo-${breed}.png` });
      await pagina.locator("#bereikt .h-bereikt-sec").screenshot({ path: `${uit}/bereikt-vink-${breed}.png` });
    }
    await pagina.close();
  }
} finally { await browser.close(); await server.close(); }

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
