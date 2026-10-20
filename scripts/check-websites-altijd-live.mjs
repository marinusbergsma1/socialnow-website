#!/usr/bin/env node
// Proef: websitekaarten op de homepage (Marinus 20 okt 2026): "Deze moeten ALTIJD ALLEMAAL LADEN IK WIL NOOIT NAAR EEN
// SCREENSHOT KIJKEN." Gemeten op live vóór de wijziging: alle vijf de sites waren geladen, maar de kaarten naast de middelste
// stonden op opacity 0 en toonden het screenshot.
// Gebruik: node scripts/check-websites-altijd-live.mjs [url]   (zonder url alleen de bron; met url ook in de browser,
// PLAYWRIGHT_CORE=<pad naar playwright-core> nodig). Rood op live main, groen op de build.
import fs from "node:fs";
import { createRequire } from "node:module";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const css = fs.readFileSync("proposal/free-website.css", "utf8"), tsx = fs.readFileSync("proposal/FreeWebsite.tsx", "utf8");
eis(css.includes(".sn-site .sn-web-preview iframe[data-ready=true]{opacity:1}") && !css.includes(".sn-web-tile.is-active .sn-web-preview iframe[data-ready=true]{opacity:1}"), "geladen site is zichtbaar in elke kaart, niet alleen in de middelste");
eis(/addEventListener\("load", start/.test(tsx) && /allesLaden/.test(tsx), "alle sites starten direct na het laden van de pagina");
const url = process.argv.slice(2).find(a => a.startsWith("http"));
// vastiq.ai staat framen alleen toe vanaf socialnow.nl (frame-ancestors); buiten productie telt die kaart niet mee.
const telt = host => url && (/socialnow\.nl/.test(new URL(url).hostname) || host !== "vastiq.ai");
if (url) {
  const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_CORE || "playwright-core");
  const b = await chromium.launch();
  for (const breedte of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: breedte, height: 900 } });
    await p.goto(url, { waitUntil: "load" });
    await p.waitForTimeout(9000);
    const vooraf = await p.evaluate(() => [...document.querySelectorAll(".sn-fw-examples")[0].querySelectorAll(".sn-web-tile")].map(t => ({ host: t.querySelector(".sn-web-host").textContent, klaar: t.querySelector("iframe")?.dataset.ready === "true" })));
    await p.locator(".sn-web-deck").first().scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
    const tegels = await p.evaluate(() => [...document.querySelectorAll(".sn-fw-examples")[0].querySelectorAll(".sn-web-tile")].map(t => {
      const f = t.querySelector("iframe"), box = t.getBoundingClientRect();
      return { host: t.querySelector(".sn-web-host").textContent, inBeeld: box.right > 0 && box.left < innerWidth, live: !!f && f.dataset.ready === "true" && getComputedStyle(f).opacity === "1" };
    })).then(r => r.filter(t => telt(t.host)));
    const klaar = vooraf.filter(t => telt(t.host) && t.klaar).length;
    eis(klaar === tegels.length, `${breedte}px: alle ${tegels.length} sites geladen vóór je naar het blok scrolt (${klaar})`);
    const scherm = tegels.filter(t => t.inBeeld && !t.live).map(t => t.host);
    eis(tegels.every(t => t.live), `${breedte}px: elke kaart toont de live site${scherm.length ? `, screenshot in beeld bij ${scherm.join(", ")}` : ""}`);
    await p.close();
  }
  await b.close();
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
