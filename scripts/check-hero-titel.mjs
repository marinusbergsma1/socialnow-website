#!/usr/bin/env node
// Proef: de hero van de homepage (Marinus 16 okt 2026, avond):
//   h1 "Meer inzicht in je bedrijf." · eronder "Hogere winst, lagere kosten." · daaronder "Plug-and-play software die je zelf bezit en experts die je inhuurt."
//   (en, woorden van Marinus: "Plug and Play software you can own and Experts you can hire.")
// in alle 10 talen vertaald, en zo in de gebouwde pagina's (prerender) van nl en en.
// Gebruik: node scripts/check-hero-titel.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const H1 = "Meer inzicht in je bedrijf.", PAY = "Hogere winst, lagere kosten.", INC = "Plug-and-play software die je zelf bezit en experts die je inhuurt.";
const EN = { [H1]: "More insight into your business.", [PAY]: "Higher profit, lower costs.", [INC]: "Plug and Play software you can own and Experts you can hire." };
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const kop = fs.readFileSync("proposal/HomeHeader.tsx", "utf8");
eis(kop.includes(`<h1>${H1}</h1>`), `h1 is "${H1}"`);
eis(kop.includes(`<p className="pay-line">${PAY}</p>`), `regel eronder is "${PAY}"`);
eis(kop.includes(`<p className="expertise-included">${INC}</p>`), `regel daaronder is "${INC}"`);
for (const t of TALEN) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  const ok = [H1, PAY, INC].every(k => typeof w[k] === "string" && w[k].trim() && w[k] !== k);
  eis(ok && (t !== "en" || [H1, PAY, INC].every(k => w[k] === EN[k])), `${t}: alle drie de zinnen vertaald`);
}
if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");  // de titelpunt is een eigen span
  const nl = tekst("dist/nl/index.html"), en = tekst("dist/index.html");
  eis([H1, PAY, INC].every(x => nl.includes(x)), "gebouwde nl-pagina toont de drie regels");
  eis([H1, PAY, INC].every(x => en.includes(EN[x])), "gebouwde en-pagina toont de Engelse regels");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
