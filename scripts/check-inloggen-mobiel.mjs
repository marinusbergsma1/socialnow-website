#!/usr/bin/env node
// Proef: de knop "Inloggen" in de kopbalk is op een telefoon (375 en 320 px) helemaal leesbaar.
// Eisen per breedte: 1) de knop wordt niet afgesneden (scrollWidth ≤ clientWidth); 2) het woord "Inloggen" staat er volledig in;
//                    3) de kopbalk past (menuknop binnen het scherm).
// Gebruik: PLAYWRIGHT_CORE=~/SocialNow-OS/app-explainer/node_modules/playwright-core/index.mjs node scripts/check-inloggen-mobiel.mjs <url>
//          (rood op de live stand van main vóór de wijziging, groen op een build met de wijziging)
const url = process.argv[2] || "http://127.0.0.1:4977/nl/";
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
for (const breed of [375, 320]) {
  const page = await browser.newPage({ viewport: { width: breed, height: 812 }, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "networkidle" });
  const m = await page.evaluate(() => {
    const a = document.querySelector(".h-header-claim"), kort = a?.querySelector(".h-header-login-short");
    const ra = a?.getBoundingClientRect(), rk = kort?.getBoundingClientRect(), menu = document.querySelector(".h-menu-toggle")?.getBoundingClientRect();
    return { sw: a?.scrollWidth, cw: a?.clientWidth, tekst: kort?.textContent.trim(), kortL: rk?.left, kortR: rk?.right, knopL: ra?.left, knopR: ra?.right, menuR: menu?.right, breed: innerWidth };
  });
  eis(m.sw <= m.cw + 1, `${breed}px: knop niet afgesneden (scrollWidth ${m.sw} ≤ ${m.cw})`);
  eis(m.tekst === "Inloggen" && m.kortL >= m.knopL - .5 && m.kortR <= m.knopR + .5, `${breed}px: "Inloggen" staat volledig in de knop`);
  eis(m.menuR <= m.breed, `${breed}px: menuknop binnen het scherm (${Math.round(m.menuR)} ≤ ${m.breed})`);
  await page.close();
}
await browser.close();
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
