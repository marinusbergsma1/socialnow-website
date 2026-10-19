#!/usr/bin/env node
// Proef: de hero van de homepage (HeaderBestaand.tsx, Marinus 19 okt 2026):
//   "Get more out of your business. En daaronder, more insights, better management everything custom made plug and play"
//   h1 "Haal meer uit je bedrijf." · de getypte regel eronder wisselt tussen "Meer inzicht.", "Beter management.",
//   "Alles op maat." en "Plug and play.", in alle 10 talen vertaald, en zo in de gebouwde pagina's (prerender) van nl en en.
// Gebruik: node scripts/check-hero-titel.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const H1 = "Haal meer uit je bedrijf.";
const TYPER = ["Meer inzicht.", "Beter management.", "Alles op maat.", "Plug and play."];
const EN = { [H1]: "Get more out of your business.", "Meer inzicht.": "More insights.", "Beter management.": "Better management.", "Alles op maat.": "Everything custom made.", "Plug and play.": "Plug and play." };
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const kop = fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8");
eis(kop.includes(`<h1>${H1} <Typer /></h1>`), `h1 is "${H1}" met de getypte regel`);
eis(kop.includes(`const ZINNEN = ${JSON.stringify(TYPER).replace(/,/g, ", ")};`), `getypte regel wisselt tussen ${TYPER.join(" ")}`);
eis(!kop.includes("Meer inzicht in je bedrijf."), "oude titel staat niet meer in de hero");
for (const t of TALEN) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  const ok = [H1, ...TYPER].every(k => typeof w[k] === "string" && w[k].trim() && (w[k] !== k || k === "Plug and play."));
  eis(ok && (t !== "en" || [H1, ...TYPER].every(k => w[k] === EN[k])), `${t}: titel en getypte zinnen vertaald`);
}
if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");  // de titelpunt is een eigen span
  const nl = tekst("dist/nl/index.html"), en = tekst("dist/index.html");
  eis([H1, TYPER.join(" ")].every(x => nl.includes(x)), "gebouwde nl-pagina toont titel en getypte zinnen");
  eis([EN[H1], TYPER.map(z => EN[z]).join(" ")].every(x => en.includes(x)), "gebouwde en-pagina toont de Engelse titel en zinnen");
  eis(!en.includes("More insight into your business.") && !nl.includes("Meer inzicht in je bedrijf."), "gebouwde pagina's tonen de oude titel niet meer");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
