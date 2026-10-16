#!/usr/bin/env node
// Proef: de hoofdtitel van de homepage is "Gratis software en automatisering. Betaal voor expertise." (Marinus 16 okt 2026),
// in alle 10 talen vertaald, en staat zo in de gebouwde pagina's (prerender) van nl en en.
// Gebruik: node scripts/check-hero-titel.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const H1 = "Gratis software en automatisering.", PAY = "Betaal voor expertise.";
const EN = { [H1]: "Free software and automation.", [PAY]: "Pay for expertise." };
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const kop = fs.readFileSync("proposal/HomeHeader.tsx", "utf8");
eis(kop.includes(`<h1>${H1}</h1>`), `h1 is "${H1}"`);
eis(kop.includes(`<p className="pay-line">${PAY}</p>`), `regel eronder is "${PAY}"`);
for (const t of TALEN) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  const ok = [H1, PAY].every(k => typeof w[k] === "string" && w[k].trim() && w[k] !== k);
  eis(ok && (t !== "en" || (w[H1] === EN[H1] && w[PAY] === EN[PAY])), `${t}: beide zinnen vertaald${t === "en" ? " (Free software and automation. / Pay for expertise.)" : ""}`);
}
if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");  // de titelpunt is een eigen span
  const nl = tekst("dist/nl/index.html"), en = tekst("dist/index.html");
  eis(nl.includes(H1) && nl.includes(PAY), "gebouwde nl-pagina toont de titel");
  eis(en.includes(EN[H1]) && en.includes(EN[PAY]), "gebouwde en-pagina toont de Engelse titel");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
