#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: (1) "Deze mag uit de slider had ik al gezegd" (Atomium-foto in stap 04); (2) op /gratis-website "de 2
// tiles gewoon niet projecten maar die eerst op de homepage over elkaar heen stonden hoeft ook geen tekst bij maar mag gewoon lekker
// groot"; (3) "Neem Contact op en Veiligheidsrapport. Beide moeten gewoon doorlinken naar Call inplannen met mij."; (4) "Steef mag
// daaronder een simpelere tekst finance en dan bij klikken contactgegevens en op diezelfde manier ook Michelle en Ben verwerken."
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const st = fs.readFileSync("proposal/Stappenplan.tsx", "utf8"), gw = fs.readFileSync("proposal/GratisWebsite.tsx", "utf8");
const home = fs.readFileSync("proposal/HomeEnthousiast.tsx", "utf8"), ha = fs.readFileSync("proposal/HeaderAlgemeen.tsx", "utf8");
const css = fs.readFileSync("proposal/gratis-website-wit.css", "utf8");
eis(/STAP3_FOTOS = [^;]*f\.bestand !== "team-atomium"/.test(st), "Atomium-foto niet in de slider van stap 04");
eis(/gw2-stapel/.test(gw) && /vastiq-desktop\.webp/.test(gw) && /ilgordo-desktop\.webp/.test(gw) && !/gw2-voorbeeld"/.test(gw), "twee overlappende websitetegels zonder tekst in plaats van projecttegels");
eis(/\.gw2-stapel\{[^}]*max-width:(7\d\d|8\d\d|9\d\d)px/.test(css), "tegels lekker groot");
// Sinds 25 nov (later): rapportknop en contactknoppen vervangen door één Plan een call, zie proef-gratis-website-plan-call.mjs.
eis(/sn-pill sn-pill-blauw" href=\{boekingsPlannerUrl\}><span>Neem contact op/.test(home), "Neem contact op linkt naar call inplannen");
eis(!/getElementById\("contact"\)/.test(ha.slice(ha.indexOf("const knop"), ha.indexOf("const knop") + 600)), "videoknop Neem contact op gaat ook naar de planner");
// Sinds 25 nov (later): rapportknop en contactknoppen vervangen door één Plan een call, zie proef-gratis-website-plan-call.mjs.
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
