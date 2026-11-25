#!/usr/bin/env node
// Proef, Marinus 25 nov 2026, /gratis-website: "Doe maar gewoon alleen een groene plan een call in en daaronder een kleine witte
// tekst, vul de onboarding in." Dus één groene knop naar de planner, daaronder een kleine witte link naar vraag 1. De blauwe
// rapportknop en de contactknoppen van Steef, Michelle en Ben zijn weg. Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const gw = fs.readFileSync("proposal/GratisWebsite.tsx", "utf8"), css = fs.readFileSync("proposal/gratis-website-wit.css", "utf8");
const kop = gw.slice(gw.indexOf('className="sn-alg gw2-kop"'), gw.indexOf('className="gw2-stapel"'));
const pillen = kop.match(/className="sn-pill[^"]*"/g) || [];
eis(pillen.length === 1 && /<a className="sn-pill" href=\{boekingsPlannerUrl\}><span>Plan een call<\/span>/.test(kop), "precies één groene knop: Plan een call, naar de planner");
eis(/<a className="gw2-onboarding" href="#onboarding" onClick=\{naarStart\}>Vul de onboarding in<\/a>/.test(kop), "kleine tekstlink 'Vul de onboarding in' onder de knop, naar vraag 1");
eis(/\.gw2-onboarding\{[^}]*color:#fff[^}]*font-size:1[2-4]px/.test(css), "die tekst is klein en wit");
eis(!/sn-pill-blauw/.test(kop) && !/veiligheidsrapport aan</.test(kop), "geen blauwe rapportknop meer");
eis(!/ContactKnop|gw2-contacten/.test(gw), "geen contactknoppen Steef, Michelle en Ben meer");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
