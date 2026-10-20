#!/usr/bin/env node
// Proef (Marinus 20 okt 2026), over "Meld je aan als expert" in Connect: "Vulling hier blauw met witte tekst. Verder moet er ook
// een gedeelte komen met vraag een opdracht aan." Bij hover was de knop groen met blauwe letters. Daarna: "Licht met blauwe tekst
// naar blauw met witte tekst bij de blauwe knoppen." en "Ai powered management & operations is goed hier".
// Gebruik: node scripts/check-connect-opdracht.mjs [--dist] [url]   (url: in de browser meten, ook bij hover; PLAYWRIGHT_CORE nodig)
import fs from "node:fs";
import { createRequire } from "node:module";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const tsx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8"), css = fs.readFileSync("proposal/connect-experts.css", "utf8");
eis(tsx.includes("<span>Vraag een opdracht aan</span>") && tsx.includes('mailLink(t("Opdracht aanvragen bij Connect"))'), "vak om een opdracht aan te vragen, met een mail met onderwerp");
eis((tsx.match(/className="cx-onder-vak"/g) || []).length === 2 && (tsx.match(/cx-blauw-knop/g) || []).length === 2, "twee vakken naast elkaar, elk met een blauwe knop");
eis(/\.cx-blauw-knop \{[^}]*background: #fff !important;[^}]*color: #00739e !important/.test(css) && /\.cx-blauw-knop::before \{ background: #00739e !important; \}/.test(css), "in rust licht met blauwe tekst, de vulling bij hover is blauw (niet groen)");
const kop = ["HeaderBestaand.tsx", "HomeHeader.tsx"].map(f => fs.readFileSync(`proposal/${f}`, "utf8"));
eis(kop.every(k => k.includes("<h2>AI-powered management &amp; operations.</h2>") && !k.includes("<h2>AI management &amp;")), "kop bij het OS: AI-powered management & operations.");
for (const t of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  eis(["Heb je een opdracht? Vraag hem aan bij Connect.", "Vraag een opdracht aan", "Opdracht aanvragen bij Connect"].every(k => w[k] && w[k] !== k), `${t}: opdrachtvak vertaald`);
}
if (process.argv.includes("--dist")) {
  const en = fs.readFileSync("dist/index.html", "utf8"), nl = fs.readFileSync("dist/nl/index.html", "utf8");
  eis(nl.includes("Vraag een opdracht aan") && en.includes("Request a project"), "gebouwde nl- en en-pagina tonen het opdrachtvak");
}
const url = process.argv.slice(2).find(a => a.startsWith("http"));
if (url) {
  const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_CORE || "playwright-core");
  const b = await chromium.launch();
  for (const breedte of [1440, 390, 360]) {
    const p = await b.newPage({ viewport: { width: breedte, height: 900 } });
    await p.goto(url, { waitUntil: "load" });
    const knoppen = p.locator(".cx-onder a");
    await knoppen.first().scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    const kleur = () => p.evaluate(() => [...document.querySelectorAll(".cx-onder a")].map(a => { const span = a.querySelector("span"), voor = getComputedStyle(a, "::before");
      return { bg: getComputedStyle(a).backgroundColor, wtf: getComputedStyle(span).webkitTextFillColor, vulling: voor.backgroundColor, schuif: voor.transform, regels: Math.round(span.getBoundingClientRect().height / parseFloat(getComputedStyle(span).lineHeight)) }; }));
    const rust = await kleur();
    await knoppen.last().hover(); await p.waitForTimeout(900);
    const hover = (await kleur())[1];
    const BLAUW = "rgb(0, 115, 158)", WIT = "rgb(255, 255, 255)";
    eis(rust.length === 2 && rust.every(k => k.bg === WIT && k.wtf === BLAUW), `${breedte}px: in rust licht met blauwe tekst (${rust.map(k => k.bg + " " + k.wtf).join(" | ")})`);
    eis(hover && hover.vulling === BLAUW && /matrix\(1, 0, 0, 1, 0, 0\)|none/.test(hover.schuif) && hover.wtf === WIT, `${breedte}px: bij hover blauw met witte tekst (vulling ${hover?.vulling}, ${hover?.schuif}, tekst ${hover?.wtf})`);
    eis(rust.every(k => k.regels === 1), `${breedte}px: knoptekst op één regel (${rust.map(k => k.regels).join(", ")})`);
    await p.close();
  }
  await b.close();
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
