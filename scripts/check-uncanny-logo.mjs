#!/usr/bin/env node
// Proef: in "Building together with" staat Uncanny in de eigen merkkleuren (paars #AE47FF zichtbaar, donkerpaars wit op zwart)
// en even groot als INDEXWORLD (breedte binnen 15 %) en helemaal in beeld, op 1440, 1100, 800 en 375 px (tussen ±760 en 900 kromp Uncanny).
// Gebruik: PLAYWRIGHT_CORE=… node scripts/check-uncanny-logo.mjs <url>   (rood op live main vóór de wijziging, groen erna)
const url = process.argv[2] || "http://127.0.0.1:4977/nl/";
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
for (const breed of [1440, 1100, 800, 375]) {
  const page = await browser.newPage({ viewport: { width: breed, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator(".building-partners").scrollIntoViewIfNeeded();
  const m = await page.evaluate(async () => {
    const u = document.querySelector(".building-company.uncanny img"), i = document.querySelector(".building-company.indexworld img");
    const svg = u ? await fetch(u.currentSrc || u.src).then(r => r.text()) : "";
    return { filter: u && getComputedStyle(u).filter, paars: svg.includes("#AE47FF"), donker: svg.includes("#23004F"),
             uw: u?.getBoundingClientRect().width, iw: i?.getBoundingClientRect().width, uh: u?.getBoundingClientRect().height,
             rechts: u?.getBoundingClientRect().right, breed: innerWidth };
  });
  eis(m.filter === "none" && m.paars && !m.donker, `${breed}px: Uncanny in merkkleuren op zwart (filter ${m.filter}, paars ${m.paars}, donkerpaars ${m.donker})`);
  eis(m.uw > 0 && Math.abs(m.uw - m.iw) / m.iw <= .15, `${breed}px: even breed als INDEXWORLD (${Math.round(m.uw)} vs ${Math.round(m.iw)} px)`);
  eis(m.rechts <= m.breed, `${breed}px: Uncanny helemaal in beeld (rechterrand ${Math.round(m.rechts)} ≤ ${m.breed})`);
  await page.close();
}
await browser.close();
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
