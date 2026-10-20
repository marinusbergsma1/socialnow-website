#!/usr/bin/env node
// Proef (Marinus 20 okt 2026), over "Meld je aan als expert" in Connect: "Vulling hier blauw met witte tekst. Verder moet er ook
// een gedeelte komen met vraag een opdracht aan." Bij hover was de knop groen met blauwe letters.
// Gebruik: node scripts/check-connect-opdracht.mjs [--dist] [url]   (url: in de browser meten, ook bij hover; PLAYWRIGHT_CORE nodig)
import fs from "node:fs";
import { createRequire } from "node:module";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const tsx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8"), css = fs.readFileSync("proposal/connect-experts.css", "utf8");
eis(tsx.includes("<span>Vraag een opdracht aan</span>") && tsx.includes('mailLink(t("Opdracht aanvragen bij Connect"))'), "vak om een opdracht aan te vragen, met een mail met onderwerp");
eis((tsx.match(/className="cx-onder-vak"/g) || []).length === 2 && (tsx.match(/cx-blauw-knop/g) || []).length === 2, "twee vakken naast elkaar, elk met een blauwe knop");
eis(/\.cx-blauw-knop, [^{]*\.cx-blauw-knop:hover, [^{]*\{[^}]*background: #00739e !important;[^}]*color: #fff !important/.test(css), "blauwe vulling met witte tekst, ook bij hover");
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
  for (const breedte of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: breedte, height: 900 } });
    await p.goto(url, { waitUntil: "load" });
    const knoppen = p.locator(".cx-onder a");
    await knoppen.first().scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    const kleur = () => p.evaluate(() => [...document.querySelectorAll(".cx-onder a")].map(a => ({ bg: getComputedStyle(a).backgroundColor, tekst: getComputedStyle(a.querySelector("span")).color, wtf: getComputedStyle(a.querySelector("span")).webkitTextFillColor })));
    const rust = await kleur();
    await knoppen.last().hover(); await p.waitForTimeout(400);
    const hover = await kleur();
    const blauw = k => /rgb\(0, (115|95), (158|130)\)/.test(k.bg) && k.tekst === "rgb(255, 255, 255)" && k.wtf === "rgb(255, 255, 255)";
    eis(rust.length === 2 && rust.every(blauw), `${breedte}px: twee blauwe knoppen met witte tekst (${rust.map(k => k.bg).join(" | ")})`);
    eis(hover.length === 2 && hover.every(blauw), `${breedte}px: bij hover nog steeds blauw met witte tekst (${hover.map(k => k.bg + " " + k.wtf).join(" | ")})`);
    await p.close();
  }
  await b.close();
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
