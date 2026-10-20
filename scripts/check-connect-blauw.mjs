#!/usr/bin/env node
// Proef: Connect op de homepage (ConnectExperts.tsx), Marinus 19 okt 2026: "Connect gedeelte moet blauw zijn en expertlaag
// 1 laag die je kan sliden en logo niet 2x staat daarboven al."
// Gebruik: node scripts/check-connect-blauw.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const tsx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8");
const css = fs.readFileSync("proposal/connect-experts.css", "utf8");
const blok = css.slice(css.indexOf("ontwerp 1"));
eis(!tsx.includes("cx-merk"), "geen tweede SocialNow Connect-logo boven de kop");
eis(!/#25d366|#1a9c4b/i.test(blok), "Connect-blok gebruikt geen groen meer");
eis(/#00a3e0/i.test(blok) && /#00739e/i.test(blok), "Connect-blok is blauw (#00a3e0, op wit #00739e voor tekst en vlakken)");
eis(/\.cx-raster\s*\{[^}]*display:\s*flex[^}]*overflow-x:\s*auto/.test(blok), "experts staan in één rij die schuift");
eis(/\.cx-raster > li\s*\{[^}]*flex:\s*0 0/.test(blok), "kaarten krimpen niet, de rij loopt door");
eis(!tsx.includes("Toon alle experts") && !tsx.includes("slice(0, 8)"), "geen tweede laag of 'toon alle'-knop: iedereen staat in de rij");
eis(/aria-label="Vorige experts"/.test(tsx) && /aria-label="Volgende experts"/.test(tsx), "pijlen om te schuiven met de muis");
const samen = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8");
// Zelfde avond: "We verbeteren het product met twee bedrijven. Moet de producten zijn en team van Connect voor de rest van het doorontwikkel verhaal."
// 20 oktober 2026: met Attesso erbij zijn het drie bedrijven; "de producten" blijft.
// 20 oktober 2026, explainer v8 (81-explainer-v8/werk/02-webtekst.md §2, DEFINITIEF): de kop noemt nu SocialNow en vier partners met
// elk een rol, en de praktijk komt van klanten en experts (de experts zijn het team van Connect). Zie scripts/check-explainer-v8.mjs.
eis(samen.includes('kop: "SocialNow en vier partners, elk met een eigen rol."') && !samen.includes("We verbeteren het product met"), "kop noemt SocialNow en de partners met hun rol");
eis(/Wat klanten en experts in de praktijk tegenkomen, gaat als eerste de volgende versie in\./.test(samen), "wat klanten en experts (Connect) tegenkomen gaat als eerste de volgende versie in");
const en = JSON.parse(fs.readFileSync("proposal/i18n/en.json", "utf8"));
eis(["Vorige experts", "Volgende experts"].every(k => en[k] && en[k] !== k), "pijlen vertaald");
eis(["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"].every(l => { const w = JSON.parse(fs.readFileSync(`proposal/i18n/${l}.json`, "utf8")); return w["We verbeteren de producten met twee bedrijven."] && Object.keys(w).some(k => k.includes("doorontwikkeling doen we met het team van Connect")); }), "nieuwe kop en uitleg in alle talen");
if (process.argv.includes("--dist")) {
  const html = fs.readFileSync("dist/nl/index.html", "utf8");
  const s = html.indexOf('class="cx-raster"'), rij = html.slice(s, html.indexOf("</ul>", s));
  const aantal = (rij.match(/<li>/g) || []).length;
  eis(aantal > 8, `gebouwde nl-homepage zet alle experts in de rij (${aantal})`);
  eis(!html.includes('class="cx-merk"'), "gebouwde pagina heeft geen tweede Connect-logo");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
