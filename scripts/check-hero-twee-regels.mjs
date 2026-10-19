#!/usr/bin/env node
// Proef: de hero-titel is nooit meer dan twee regels (Marinus 19 okt 2026: "Graag nooit 3 regels onder elkaar. Maximaal 2.").
// De lettergrootte schaalt met de breedte van de titelkolom (container query) en de lengte van de titel in die taal (--tekens).
// De echte meting (aantal regels per taal en breedte) staat in de PR; deze proef bewaakt dat het mechanisme er staat.
// Gebruik: node scripts/check-hero-twee-regels.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const tsx = fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8");
const css = fs.readFileSync("proposal/header-bestaand.css", "utf8");
eis(/<h1 [^>]*style=\{\{ "--tekens": /.test(tsx), "h1 krijgt de lengte van de vertaalde titel mee (--tekens)");
eis(/\.video-title\{[^}]*container-type:\s*inline-size/.test(css), "de titelkolom is een container");
eis(/\.video-title h1\{[^}]*font-size:\s*min\([^}]*cqi[^}]*var\(--tekens/.test(css), "lettergrootte is begrensd door kolombreedte en titellengte");
if (process.argv.includes("--dist")) {
  for (const [taal, pad] of [["nl", "dist/nl/index.html"], ["en", "dist/index.html"], ["de", "dist/de/index.html"]]) {
    const h = fs.readFileSync(pad, "utf8");
    eis(/<h1 style="--tekens:\s*\d+/.test(h), `gebouwde ${taal}-pagina zet --tekens op de titel`);
  }
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
