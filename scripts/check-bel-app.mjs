#!/usr/bin/env node
// Proef (27 okt 2026, Marinus): "PLAN EEN CALL mag hier weg. Net als bij FNDR STUDIO rechtsonder iets zodat je
// lekker snel en zakelijk mij kan bellen of appen." Rood op main d65eb5f, groen met de wijziging.
// Gebruik: node scripts/check-bel-app.mjs [url]
//          Met een url ook in de browser (desktop 1440 en telefoon 375):
//          PLAYWRIGHT_CORE=~/SocialNow-OS/app-explainer/node_modules/playwright-core/index.mjs node scripts/check-bel-app.mjs http://127.0.0.1:4977/nl/
import { existsSync, readFileSync } from "node:fs";

const lees = (pad) => (existsSync(pad) ? readFileSync(pad, "utf8") : "");
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };

const shell = lees("proposal/WebsiteProposal.tsx");
const aanvragen = lees("proposal/aanvragen.ts");
const knop = lees("proposal/BelApp.tsx");
const css = lees("proposal/bel-app.css");

eis(!/<HeaderCall \/>/.test(shell), "header: geen Plan een call meer naast Inloggen gratis OS");
eis(/h-mobile-call/.test(shell), "mobiel menu houdt Plan een call voor custom OS");
eis(/export const MARINUS_NUMMER = "31637404577";/.test(aanvragen), "aanvragen.ts: MARINUS_NUMMER is Marinus' eigen nummer");
eis(/export const WHATSAPP_NUMMER = "";/.test(aanvragen), "Steef-route (WHATSAPP_NUMMER) blijft leeg");
eis(/belLink/.test(aanvragen) && /tel:\+\$\{MARINUS_NUMMER\}/.test(aanvragen), "aanvragen.ts: belLink naar tel:+31637404577");
eis(/appLink/.test(aanvragen) && /wa\.me\/\$\{MARINUS_NUMMER\}/.test(aanvragen), "aanvragen.ts: appLink naar wa.me/31637404577");
eis(/<BelApp \/>/.test(shell), "BelApp staat sitebreed in WebsiteProposal.tsx");
eis(/Bellen/.test(knop) && /translate="no">WhatsApp/.test(knop), "pil heeft Bellen en WhatsApp (WhatsApp niet vertaald)");
eis(/Phone/.test(knop) && /MessageCircle/.test(knop), "iconen Phone en MessageCircle");
eis(/position:\s*fixed/.test(css) && /right:/.test(css) && /bottom:/.test(css), "pil staat vast rechtsonder");
eis(/#25d366/i.test(css) && /border-radius:\s*999px/.test(css), "groene iconen, ronde pil");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const d = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  eis("Bellen" in d && "Bel of app Marinus" in d && !/[–—]/.test(`${d.Bellen}${d["Bel of app Marinus"]}`), `${taal}.json heeft Bellen en Bel of app Marinus`);
}

const url = process.argv[2];
if (url) {
  const { chromium } = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome" });
  for (const [breed, hoog] of [[1440, 900], [375, 812]]) {
    const page = await browser.newPage({ viewport: { width: breed, height: hoog } });
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    await page.evaluate(() => document.querySelector(".sn-consent")?.remove());
    const m = await page.evaluate(() => {
      const pil = document.querySelector(".sn-bel-app"), r = pil?.getBoundingClientRect();
      const kop = [...document.querySelectorAll("header .h-header-call")].filter((e) => e.offsetParent);
      const a = [...(pil?.querySelectorAll("a") || [])].map((x) => x.getAttribute("href"));
      return { r: r && { l: r.left, r: r.right, b: r.bottom, h: r.height }, pos: pil && getComputedStyle(pil).position, a, kop: kop.length, w: innerWidth, h: innerHeight };
    });
    eis(m.kop === 0, `${breed}px: geen zichtbare Plan een call in de header`);
    eis(m.pos === "fixed" && m.r && m.r.r <= m.w && m.r.l >= 0 && m.r.b <= m.h && m.r.r > m.w - 40 && m.r.b > m.h - 40, `${breed}px: pil vast rechtsonder binnen beeld`);
    eis(m.a.includes("tel:+31637404577") && m.a.some((h) => h?.startsWith("https://wa.me/31637404577")), `${breed}px: Bellen en WhatsApp linken naar Marinus`);
    if (process.env.SCHERM) await page.screenshot({ path: `${process.env.SCHERM}-${breed}.png` });
    await page.close();
  }
  await browser.close();
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
