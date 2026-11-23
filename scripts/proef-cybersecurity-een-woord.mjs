// Proef: "cybersecurity" overal als één woord (28 oktober 2026, Marinus: "dat is 1 woord, belangrijk dat het overal écht als 1 woord wordt weergegeven").
// Rood op main, groen op fix/cybersecurity-een-woord-20261028.
import { readFileSync, readdirSync } from "node:fs";

const bestanden = ["proposal/i18n", "proposal"].flatMap(d => readdirSync(d).filter(f => /\.(json|tsx?|css)$/.test(f)).map(f => `${d}/${f}`));
const fout = bestanden.filter(f => /cyber[ -]security/i.test(readFileSync(f, "utf8")));
let rood = 0;
const eis = (ok, tekst) => { console.log(`${ok ? "groen" : "ROOD "}  ${tekst}`); if (!ok) rood++; };

eis(fout.length === 0, `nergens "cyber security" of "cyber-security" in de sitebron${fout.length ? ` (nog in ${fout.join(", ")})` : ""}`);
process.exit(rood ? 1 : 0);
