// Proef header: login direct onder de kop (30 september 2026). Rood op main d2ec9e8, groen op fix/header-login-onder-kop-20260930.
import { readFileSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const home = pages.slice(pages.indexOf("export function Home()"), pages.indexOf("<HeroFilm />"));
const plek = (naam) => home.indexOf(naam);
const eisen = [
  ["login direct onder de kop", /<HeroTitle \/>\s*(\{\/\*[\s\S]*?\*\/\}\s*)?<div className="h-knoppen">\s*<div className="os-entry">\s*<OsDock \/>/.test(home)],
  ["Odoo, Salesforce en Attesso onder de login", plek("<OsDock />") > -1 && plek("<OsDock />") < plek('className="h-integratie"')],
  ["statement onder de merken", plek('className="h-integratie"') < plek('className="h-statement"')],
  ["demoknop blijft, onder het statement", plek('className="h-statement"') < plek("Book a free live demo")],
  ["login staat er één keer", home.split("<OsDock />").length === 2],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
