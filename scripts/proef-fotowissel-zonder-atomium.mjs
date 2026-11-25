#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: "Deze foto mag in die slider weg omdat ie daaronder al staat." De Atomium-teamfoto staat al lager
// op de pagina (Stappenplan), dus de fotowissel onder de homepagevideo slaat hem over. BEURSFOTOS zelf blijft heel voor Stappenplan.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const tsx = fs.readFileSync("proposal/HeaderAlgemeen.tsx", "utf8");
eis(/const DIAS = BEURSFOTOS\.filter\(\(?f\)? => f\.bestand !== "team-atomium"\)/.test(tsx), "fotowissel gebruikt een lijst zonder team-atomium");
eis(/DIAS\.map\(/.test(tsx) && /% DIAS\.length/.test(tsx) && !/BEURSFOTOS\.map\(/.test(tsx), "wissel en teller lopen over die lijst");
eis(/\{ bestand: "team-atomium"/.test(tsx), "BEURSFOTOS houdt de Atomium-foto voor Stappenplan");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
