#!/usr/bin/env node
// Proef (16 okt 2026, Marinus: "de titel en regelafstand daaronder vooral op mobiel iets kleiner"):
// 375 px: titel ≤ 27 px, regel eronder ≤ 18 px, uitleg ≤ 15 px, blok titel+regels ≤ 125 px hoog; 1440 px: titel ≤ 48 px.
// Overal: titel heeft geen negatieve letterafstand en past op het scherm.
// Gebruik: PLAYWRIGHT_CORE=... node scripts/check-hero-titel-maat.mjs <url>  (rood op live main, groen op de build met de wijziging)
const url = process.argv[2] || "http://127.0.0.1:4977/nl/";
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
for (const [breed, maxH1] of [[375, 27], [1440, 48]]) {
  const page = await browser.newPage({ viewport: { width: breed, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  const m = await page.evaluate(() => {
    const t = document.querySelector(".sn-choice .showcase .video-title"), h = t.querySelector("h1");
    const p = t.querySelector(".pay-line"), e = t.querySelector(".expertise-included");
    const px = el => parseFloat(getComputedStyle(el).fontSize), ls = parseFloat(getComputedStyle(h).letterSpacing) || 0;
    const r = h.getBoundingClientRect(), eind = e.getBoundingClientRect().bottom;
    return { h1: px(h), pay: px(p), exp: px(e), ls, blok: Math.round(eind - r.top), rechts: r.right, breed: innerWidth };
  });
  eis(m.h1 <= maxH1, `${breed}px: titel ${m.h1.toFixed(1)} px ≤ ${maxH1}`);
  if (breed === 375) {
    eis(m.pay <= 18, `375px: regel eronder ${m.pay} px ≤ 18`);
    eis(m.exp <= 15, `375px: uitleg ${m.exp} px ≤ 15`);
    eis(m.blok <= 125, `375px: titel tot en met uitleg ${m.blok} px hoog ≤ 125`);
  }
  eis(m.ls >= 0, `${breed}px: geen negatieve letterafstand in de titel (${m.ls} px)`);
  eis(m.rechts <= m.breed, `${breed}px: titel past op het scherm`);
  await page.close();
}
await browser.close();
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
