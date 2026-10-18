#!/usr/bin/env node
// Proef (18 okt 2026, Marinus: "Bij resultaten graag ook even bovenaan die 100k en de 100 leads in 1 week").
// Rood op release/site-20261018 67937d1, groen met de wijziging. Gebruik: node scripts/check-resultaten-cijfers.mjs
import { existsSync, readFileSync } from "node:fs";
const lees = (pad) => (existsSync(pad) ? readFileSync(pad, "utf8") : "");
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const blok = lees("proposal/ResultatenCijfers.tsx");
const pagina = lees("proposal/paginas.tsx");
const projecten = lees("data/projects.ts");
eis(Boolean(blok), "proposal/ResultatenCijfers.tsx bestaat");
eis(/<ResultatenCijfers \/>\s*<FeaturedWork \/>/.test(pagina) && /<\/PageHeading>|\/>\s*<ResultatenCijfers/.test(pagina), "cijfers staan bovenaan /projecten, direct onder de paginakop");
eis(/waarde: "€100K"/.test(blok) && /waarde: "100", eenheid: "leads in één week"/.test(blok), "€100K en 100 leads in één week");
for (const slug of ["vdz-brigade-website", "kwh-garant-website"]) eis(blok.includes(`/project/${slug}`) && projecten.includes(`slug: "${slug}"`), `link naar de bestaande case ${slug}`);
eis(/Bento/.test(blok) && /Tegel/.test(blok), "in de bestaande bentotaal");
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const d = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const mist = ["omzet voor VDZ", "leads in één week", "Van nul online zichtbaarheid naar een merk dat verkoopt.", "Meta en Odoo gekoppeld. Elke offerteaanvraag komt direct in hun OS binnen.", "Bekijk de case"].filter((z) => !(z in d));
  eis(mist.length === 0, `${taal}.json heeft alle zinnen${mist.length ? `; mist: ${mist.join(" | ")}` : ""}`);
}
process.exit(fouten.length ? 1 : 0);
