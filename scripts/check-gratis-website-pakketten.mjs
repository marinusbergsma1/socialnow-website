#!/usr/bin/env node
// Proef: "Gratis website en rebranding moet bij elk pakket staan." (Marinus, 19 okt 2026)
// Alle OS-abonnementen (Gratis, Business, Enterprise) en alle Connect-pakketten (Start, Meta, Meta + Google, Compleet) noemen het,
// sterk en op dezelfde plek; het custom OS blijft bij Connect staan; vertaald in alle 10 talen; en zo op de gebouwde /diensten.
// Gebruik: node scripts/check-gratis-website-pakketten.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const REGEL = "Gratis website en rebranding", OS_REGEL = "Custom OS rond je bedrijf";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const src = fs.readFileSync("proposal/Pricing.tsx", "utf8");
const lijst = naam => { const s = src.indexOf(`const ${naam}: Pakket[] = [`); return src.slice(s, src.indexOf("\n];", s)); };
const pakketten = blok => blok.split(/\n  \{\n/).slice(1);
for (const [naam, verwacht] of [["OS", 3], ["CONNECT", 4]]) {
  const p = pakketten(lijst(naam));
  eis(p.length === verwacht, `${naam}: ${verwacht} pakketten gevonden`);
  for (const k of p) {
    const id = (k.match(/id: "([^"]+)"/) || [])[1];
    const punten = [...k.matchAll(/\{ tekst: "([^"]+)"([^}]*)\}/g)];
    const r = punten.find(m => m[1] === REGEL);
    eis(r && /sterk: true/.test(r[2]) && !/uit: true/.test(r[2]), `${naam} ${id}: "${REGEL}" staat erbij, sterk`);
    if (naam === "CONNECT") eis(punten.some(m => m[1] === OS_REGEL), `${naam} ${id}: custom OS blijft genoemd`);
    eis(!punten.some(m => /^Gratis (demo)?website$/.test(m[1])), `${naam} ${id}: geen losse oude websiteregel meer`);
  }
}
for (const t of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  eis([REGEL, OS_REGEL].every(k => typeof w[k] === "string" && w[k].trim() && w[k] !== k), `${t}: beide regels vertaald`);
}
if (process.argv.includes("--dist")) {
  const nl = fs.readFileSync("dist/nl/diensten/index.html", "utf8"), en = fs.readFileSync("dist/diensten/index.html", "utf8");
  const tel = (h, s) => h.split(s).length - 1;
  eis(tel(nl, REGEL) >= 7, `gebouwde nl-/diensten noemt "${REGEL}" bij alle 7 pakketten (${tel(nl, REGEL)})`);
  eis(tel(en, "Free website and rebrand") >= 7, `gebouwde en-/diensten noemt het bij alle 7 pakketten (${tel(en, "Free website and rebrand")})`);
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
