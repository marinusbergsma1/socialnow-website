// Proef: merkenstrook "Werk gemaakt voor onder meer" zonder PrimeFone en in eigen kleur (28 oktober 2026, Marinus).
// Rood op main 0ec541b, groen op feat/merken-kleur-20261028.
import { readFileSync, existsSync } from "node:fs";

const lees = p => readFileSync(p, "utf8");
const content = lees("proposal/content.ts");
const blok = content.slice(content.indexOf("export const logos"), content.indexOf("];", content.indexOf("export const logos")));
let rood = 0;
const eis = (ok, tekst) => { console.log(`${ok ? "groen" : "ROOD "}  ${tekst}`); if (!ok) rood++; };

eis(!/PRIMEFONE|PrimeFone"/.test(blok.replace(/\/\/.*$/gm, "")), "PrimeFone uit de merkenstrook");
eis(blok.includes('["merken/KWH-GARANT-KLEUR.svg", "kWh Garant"') && existsSync("public/images/merken/KWH-GARANT-KLEUR.svg"), "kWh Garant in eigen kleur");
const kwh = existsSync("public/images/merken/KWH-GARANT-KLEUR.svg") ? lees("public/images/merken/KWH-GARANT-KLEUR.svg") : "";
eis(kwh.includes("#009245") && kwh.includes("#00a24b") && !kwh.includes("#1c2739"), "kWh-groen uit het officiele logo, geen donkerblauw dat wegvalt op zwart");
eis(blok.includes('["merken/AZ-LOGO-KLEUR.svg", "AZ"'), "AZ blijft in kleur");
eis(["MOJO", "DIVINE", "Supperclub", "Universal", "Chin Chin Club", "Light Art Collection", "Amsterdam Light Festival"].every(n => blok.includes(`"${n}"`)), "overige merken staan er nog");

process.exit(rood ? 1 : 0);
