#!/usr/bin/env node
// Proef: slotblok op de homepage (Closing compact in proposal/ui.tsx), Marinus 19 okt 2026: "Dit kan ook nog beter plus klopt
// niet helemaal meer." Het moet het gratis pakket van nu noemen (10 GB, 2 mensen, gratis website en rebranding), niet de oude
// regel "Onder 10 GB schrijven we niets af", en de knoppen zijn groen met wit of wit met groen, nooit zwart.
// Gebruik: node scripts/check-slot-gratis-os.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const ui = fs.readFileSync("proposal/ui.tsx", "utf8");
const blok = ui.slice(ui.indexOf("if (compact)"), ui.indexOf("</section>;", ui.indexOf("if (compact)")));
const PUNTEN = ["10 GB opslag", "Nodig 2 mensen uit", "Gratis website en rebranding"];
eis(!blok.includes("schrijven we niets af"), "oude regel over afschrijven is weg");
eis(PUNTEN.every(p => blok.includes(p)), `noemt het gratis pakket van nu: ${PUNTEN.join(", ")}`);
eis(blok.includes("GRATIS_OS_URL") && blok.includes('to="/diensten#prijzen"'), "knop naar het gratis OS en naar de pakketten");
const css = fs.readFileSync("proposal/home-simple.css", "utf8");
eis(/\.sn-home-final \.sn-slot-start\{[^}]*background:#25d366[^}]*color:#fff/.test(css) && /\.sn-home-final \.sn-slot-pakketten\{[^}]*background:#fff[^}]*color:#1a9c4b/.test(css), "knoppen groen met wit en wit met groen");
const en = JSON.parse(fs.readFileSync("proposal/i18n/en.json", "utf8"));
eis(["Bekijk de pakketten", "Meer nodig? Kies later Business of Enterprise."].every(k => en[k] && en[k] !== k), "nieuwe zinnen vertaald");
if (process.argv.includes("--dist")) {
  // Het slotblok staat in de footer en wordt in de browser opgebouwd, dus de proef leest de gebouwde scripts.
  const js = fs.readdirSync("dist/assets").filter(f => f.endsWith(".js") && !f.startsWith("_sn-woordenboek")).map(f => fs.readFileSync(`dist/assets/${f}`, "utf8")).join("\n");
  eis(!js.includes("schrijven we niets af") && js.includes("Meer nodig? Kies later Business of Enterprise.") && js.includes("sn-slot-start"), "gebouwde site heeft het nieuwe slotblok en niet de oude zin");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
