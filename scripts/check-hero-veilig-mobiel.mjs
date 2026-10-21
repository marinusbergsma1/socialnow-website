#!/usr/bin/env node
// Proef: het label "Veilig" onder de hero-kop staat op een telefoon gelijk met zijn vinkje en met de andere twee labels.
// Aanleiding, 21 oktober 2026: op 375 px (aanraakscherm) stond "Veilig" 14,5 px hoger dan zijn vinkje, met een losse
// groene streep eronder. Oorzaak: index.css geeft op (pointer: coarse) elke link min-height 44px; de streep zat op de link.
// Eisen per stand (375 px aanraak, 375 px muis, 1440 px):
//   1) tekst "Veilig" staat verticaal midden op zijn vinkje (≤ 1 px);  2) zelfde tekstregel als "Gratis website en rebranding";
//   3) de groene streep zit direct onder de tekst (≤ 4 px);  4) zelfde letterdikte en -grootte als "Eigen beheer en keuzes";
//   5) op een aanraakscherm blijft het tikvlak minstens 44 px hoog.
// Gebruik: PLAYWRIGHT_CORE=~/SocialNow-OS/app-explainer/node_modules/playwright-core/index.mjs node scripts/check-hero-veilig-mobiel.mjs <url>
//          (rood op de live stand van main vóór de wijziging, groen op een build met de wijziging)
const url = process.argv[2] || "http://127.0.0.1:4977/nl/";
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const standen = [
  { naam: "375px aanraak", viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
  { naam: "375px muis", viewport: { width: 375, height: 812 } },
  { naam: "1440px", viewport: { width: 1440, height: 900 } },
];
for (const s of standen) {
  const page = await browser.newPage({ viewport: s.viewport, isMobile: !!s.isMobile, hasTouch: !!s.hasTouch, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector(".bs-zeker li a");
  await page.evaluate(() => document.fonts.ready);
  const m = await page.evaluate(() => {
    const items = [...document.querySelectorAll(".bs-zeker li")];
    const tekstVak = (el) => {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) if (n.textContent.trim()) { const r = document.createRange(); r.selectNodeContents(n); return { r: r.getBoundingClientRect(), ouder: n.parentElement }; }
    };
    const [gratis, veilig, eigen] = items;
    const a = veilig.querySelector("a"), v = tekstVak(a), g = tekstVak(gratis), e = tekstVak(eigen);
    const vink = veilig.querySelector("svg").getBoundingClientRect();
    // Het element met de groene streep: de link zelf of iets erin.
    const streep = [a, ...a.querySelectorAll("*")].find((el) => parseFloat(getComputedStyle(el).borderBottomWidth) > 0);
    const cv = getComputedStyle(v.ouder), ce = getComputedStyle(e.ouder);
    return {
      tekstMidden: (v.r.top + v.r.bottom) / 2, vinkMidden: (vink.top + vink.bottom) / 2,
      tekstTop: v.r.top, gratisTop: g.r.top,
      streepOnder: streep ? streep.getBoundingClientRect().bottom - v.r.bottom : null,
      gewicht: cv.fontWeight, gewichtEigen: ce.fontWeight, maat: cv.fontSize, maatEigen: ce.fontSize,
      tikHoogte: a.getBoundingClientRect().height,
    };
  });
  const r = (x) => Math.round(x * 10) / 10;
  eis(Math.abs(m.tekstMidden - m.vinkMidden) <= 1, `${s.naam}: "Veilig" midden op zijn vinkje (verschil ${r(m.tekstMidden - m.vinkMidden)} px)`);
  eis(Math.abs(m.tekstTop - m.gratisTop) <= 1, `${s.naam}: "Veilig" op dezelfde regel als "Gratis website en rebranding" (verschil ${r(m.tekstTop - m.gratisTop)} px)`);
  eis(m.streepOnder !== null && m.streepOnder >= 0 && m.streepOnder <= 4, `${s.naam}: groene streep direct onder de tekst (${m.streepOnder === null ? "geen streep" : r(m.streepOnder) + " px"})`);
  eis(m.gewicht === m.gewichtEigen && m.maat === m.maatEigen, `${s.naam}: letterdikte en -grootte gelijk aan "Eigen beheer en keuzes" (${m.gewicht}/${m.maat} tegen ${m.gewichtEigen}/${m.maatEigen})`);
  if (s.hasTouch) eis(m.tikHoogte >= 44, `${s.naam}: tikvlak minstens 44 px (${r(m.tikHoogte)} px)`);
  await page.close();
}
await browser.close();
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
