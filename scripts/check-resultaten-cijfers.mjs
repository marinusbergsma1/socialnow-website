#!/usr/bin/env node
// Proef (18 okt 2026, Marinus: "Bij resultaten graag ook even bovenaan die 100k en de 100 leads in 1 week").
// Rood op release/site-20261018 67937d1, groen met de wijziging. Gebruik: node scripts/check-resultaten-cijfers.mjs
import { existsSync, readFileSync } from "node:fs";
const lees = (pad) => (existsSync(pad) ? readFileSync(pad, "utf8") : "");
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const blok = lees("proposal/ResultatenHero.tsx");
const uitgelicht = lees("proposal/FeaturedWork.tsx");
const pagina = lees("proposal/paginas.tsx");
const projecten = lees("data/projects.ts");
eis(Boolean(blok), "proposal/ResultatenHero.tsx bestaat");
// Tweede ronde (Marinus: "Dit triggert mij niet zo"): één opening, label Resultaten, cijfers, merkenbalk, dan de cases.
eis(/<ResultatenHero \/>\s*<FeaturedWork kop=\{false\} \/>/.test(pagina) && !/label="Ons werk"/.test(pagina), "/projecten opent met ResultatenHero, geen Ons werk-kop meer");
eis(/\{kop && <Heading/.test(uitgelicht), "geen tweede intro boven de cases");
eis(/<p className="h-eyebrow">Resultaten<\/p>/.test(blok) && /Wat ons werk oplevert\./.test(blok), "label Resultaten en een kop over resultaten");
eis(/<ClientLogos \/>/.test(blok), "merkenbalk met de bestaande logo's");
eis(/naar: "\/project\/ilgordo-website"/.test(blok), "derde cijfer (Il Gordo, Lighthouse SEO 100) staat al op de site en linkt naar de case");
eis(/waarde: "€100K"/.test(blok) && /waarde: "100", eenheid: "leads in één week"/.test(blok), "€100K en 100 leads in één week");
for (const slug of ["vdz-brigade-website", "kwh-garant-website"]) eis(blok.includes(`/project/${slug}`) && projecten.includes(`slug: "${slug}"`), `link naar de bestaande case ${slug}`);
eis(/Bento/.test(blok) && /Tegel/.test(blok), "in de bestaande bentotaal");
// Derde ronde (Marinus: "Neem daarbij ook andere resultaten van mijn team mee"): alleen bestaande trackrecords, met foto.
const team = lees("proposal/TeamTrackrecord.tsx");
const content = lees("proposal/content.ts");
eis(/<TeamTrackrecord \/>/.test(blok), "rij Trackrecord van ons team staat in de opening");
const namen = [...team.matchAll(/\["([^"]+)", \[M\./g)].map((m) => m[1]);
eis(namen.length >= 10 && namen.every((n) => content.includes(`name: "${n}"`)), `alle ${namen.length} teamleden bestaan in content.ts (foto en rol)`);
const zonderBron = ["Emma Peperkamp", "Antony Soosaipillaj", "Aron", "Youri van der Donk", "Pieter Bergsma"];
eis(zonderBron.every((n) => !namen.includes(n)), "teamleden zonder bron staan er niet in");
for (const logo of [...team.matchAll(/logo: "([^"]+)"/g)].map((m) => m[1])) eis(existsSync(`public${logo}`), `logo bestaat: ${logo}`);
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const d = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const mist = ["Trackrecord van ons team", "Wat ons werk oplevert.", "In cijfers.", "Resultaten", "Werk gemaakt voor onder meer", "Snel, vindbaar, gebouwd door ons team.", "omzet voor VDZ", "leads in één week", "Van nul online zichtbaarheid naar een merk dat verkoopt.", "Meta en Odoo gekoppeld. Elke offerteaanvraag komt direct in hun OS binnen.", "Bekijk de case"].filter((z) => !(z in d));
  eis(mist.length === 0, `${taal}.json heeft alle zinnen${mist.length ? `; mist: ${mist.join(" | ")}` : ""}`);
}
process.exit(fouten.length ? 1 : 0);
