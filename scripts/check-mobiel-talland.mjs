#!/usr/bin/env node
// Proef (Marinus 16 okt): 1) op mobiel begint de homepage met de titel en de explainer, vóór de productblokken; op desktop blijft het naast elkaar;
// 2) bij "Uitgenodigd" staat naast de Student Entrepreneurs Club ook Talland College, met het officiële logo.
// Gebruik: PLAYWRIGHT_CORE=… node scripts/check-mobiel-talland.mjs <url-nl>   (rood op live main, groen op de build)
const url = process.argv[2] || "http://127.0.0.1:4977/nl/";
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
for (const breed of [375, 1440]) {
  const page = await browser.newPage({ viewport: { width: breed, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  const m = await page.evaluate(() => {
    const v = document.querySelector("#os-explainer"), h = document.querySelector(".showcase > .hero");
    const rv = v.getBoundingClientRect(), rh = h.getBoundingClientRect();
    return { vTop: Math.round(rv.top + scrollY), hTop: Math.round(rh.top + scrollY), vX: Math.round(rv.left), hX: Math.round(rh.left) };
  });
  if (breed === 375) eis(m.vTop < m.hTop, `375px: titel en video staan bovenaan, vóór de productblokken (video ${m.vTop}, producten ${m.hTop})`);
  else eis(m.vX > m.hX, `1440px: titel en video staan nog rechts naast de productblokken (x ${m.vX} > ${m.hX})`);
  if (breed === 1440) {
    await page.locator(".h-bereikt-sec").scrollIntoViewIfNeeded().catch(() => {});
    const t = await page.evaluate(async () => {
      const tegel = document.querySelector(".h-bereikt-sec"); if (!tegel) return null;
      const img = tegel.querySelector('img[alt="Talland College"]');
      if (img && !img.complete) await new Promise(r => img.addEventListener("load", r, { once: true }));
      return { tekst: tegel.innerText, logo: !!img && img.naturalWidth > 0, src: img?.getAttribute("src") };
    });
    eis(!!t && /Student Entrepreneurs Club/.test(t.tekst) && /Talland College/.test(t.tekst), `tegel "Uitgenodigd" noemt SEC en Talland College`);
    eis(!!t && t.logo && /talland/i.test(t.src || ""), `Talland-logo zichtbaar in de tegel (${t?.src})`);
  }
  await page.close();
}
await browser.close();
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
