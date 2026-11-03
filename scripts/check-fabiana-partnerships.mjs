#!/usr/bin/env node
// Proef: Fabiana Abauna als Head of New Partnerships en de salesgroep heet Partnerships. Marinus, 3 nov 2026: "Ik wil wat
// meer weg gaan van de standaard sales en meer iedereen focus op Partnership. Fabiana mag wel Head of new Partnerships worden."
// Gebruik: node scripts/check-fabiana-partnerships.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const content = fs.readFileSync("proposal/content.ts", "utf8");
const trust = fs.readFileSync("proposal/TeamTrust.tsx", "utf8");
const en = JSON.parse(fs.readFileSync("proposal/i18n/en.json", "utf8"));
const postbuild = fs.readFileSync("scripts/postbuild.mjs", "utf8");

eis(/name: "Fabiana Abauna", role: "Head of New Partnerships", image: "Fabiana-Abauna\.webp"/.test(content), "Fabiana in het team als Head of New Partnerships");
eis(["Fabiana-Abauna.webp", ...[96, 160, 320, 480].map(m => `klein/Fabiana-Abauna-${m}.webp`)].every(f => fs.existsSync(`public/images/${f}`)), "foto van Fabiana in alle maten");
const groep = content.match(/\{ name: "Partnerships", members: \[([^\]]*)\]/);
eis(!!groep && /"Elian Coellar", "Fabiana Abauna"/.test(groep[1]), "Connect-groep heet Partnerships, Fabiana direct na Elian");
eis(!content.includes('"Sales & partnerships"') && !trust.includes('"Sales & partnerships"'), "geen groep Sales & partnerships meer");
eis(/functie: "Partnerships", mensen: \[[^\]]*"Fabiana Abauna"/.test(trust), "teammuur: Fabiana onder Partnerships");
eis(/\["Head", \[[^\]]*"Fabiana Abauna"/.test(trust), "teamlagen: Fabiana in de laag Head");
eis(!trust.includes('"Sales & network"') && /\["Partnerships", \[/.test(trust), "teamlagen: Sales & network heet Partnerships");
eis(en["Partnerships"] && en["Head of New Partnerships"] && en["Fabiana Abauna"], "Engelse teksten aanwezig");
eis(postbuild.includes("person('Fabiana Abauna', 'Head of New Partnerships')"), "Fabiana in de gestructureerde teamgegevens");
if (process.argv.includes("--dist")) {
  const html = fs.readFileSync("dist/nl/index.html", "utf8");
  eis(html.includes("Fabiana Abauna") && html.includes("Head of New Partnerships"), "gebouwde homepage toont Fabiana");
  eis(!html.includes(">Sales &amp; partnerships<"), "gebouwde homepage zonder Sales & partnerships");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
