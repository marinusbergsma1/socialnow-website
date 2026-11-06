#!/usr/bin/env node
// Proef (6 nov 2026, Marinus over de websiteslider: "Pijltjes weg" en "gwn DE JUISTE TITEL VAN NEW BLACK EN CLIENT
// DEMO.SOCIALNOW.NL ALS ADRES OID ZODAT ZE ZIEN DAT HET EEN DEMO IS").
// Eisen: 1) de slider in proposal/LiveWebsites.tsx heeft geen pijlknoppen (vorige/volgende) meer; de keuzeknoppen
//           per website blijven, met klik en toetsenbord (pijltoetsen links/rechts);
//        2) het project heet NEW BLACK (merknaam zoals in het logo), ook als klantnaam en in alle woordenboeken;
//        3) het adres is https://newblack.client-demo.socialnow.nl/: dat staat in projects.ts en dus in de adresbalk
//           van het frame en achter "Open live website";
//        4) live: het nieuwe adres geeft 200 met noindex en de titel "NEW BLACK | International Fashion Agency";
//           newblack-demo.socialnow.nl stuurt met een 301 door naar het nieuwe adres.
// Gebruik: node scripts/check-newblack-client-demo.mjs   (rood op main, groen met de wijziging; OFFLINE=1 slaat eis 4 over)
import { readFileSync, readdirSync } from "node:fs";

const ADRES = "https://newblack.client-demo.socialnow.nl/";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };

const slider = readFileSync("proposal/LiveWebsites.tsx", "utf8");
eis(!/h-rail-arrows/.test(slider) && !/Vorige website|Volgende website/.test(slider) && !/Chevron(Left|Right)/.test(slider),
  "geen pijlknoppen onder de websiteslider");
eis(/className="h-site-thumbnails"/.test(slider) && /onClick=\{\(\) => choose\(itemIndex\)\}/.test(slider), "keuzeknoppen per website blijven (klik)");
eis(/onKeyDown=\{[\s\S]{0,200}ArrowRight[\s\S]{0,200}ArrowLeft/.test(slider), "keuzeknoppen werken met pijltoetsen links/rechts");

const projects = readFileSync("data/projects.ts", "utf8");
const start = projects.indexOf('slug: "newblack-website"');
const blok = projects.slice(start, projects.indexOf("\n  },", start));
eis(/title: "NEW BLACK",/.test(blok) && /client: "NEW BLACK",/.test(blok), "project en klant heten NEW BLACK");
eis(blok.includes(`url: "${ADRES}",`), `adres (adresbalk + Open live website) is ${ADRES}`);
eis(!/newblack-demo\.socialnow\.nl/.test(projects), "geen newblack-demo.socialnow.nl meer in projects.ts");
const woordenboeken = readdirSync("proposal/i18n").filter((f) => f.endsWith(".json"));
const oud = woordenboeken.filter((f) => /NewBlack/.test(readFileSync(`proposal/i18n/${f}`, "utf8")));
const nieuw = woordenboeken.filter((f) => /"NEW BLACK": "NEW BLACK"/.test(readFileSync(`proposal/i18n/${f}`, "utf8")));
eis(oud.length === 0 && nieuw.length === woordenboeken.length, `alle ${woordenboeken.length} woordenboeken gebruiken NEW BLACK${oud.length ? ` (nog NewBlack in ${oud.join(", ")})` : ""}`);

if (!process.env.OFFLINE) {
  try {
    const res = await fetch(ADRES);
    const html = await res.text();
    eis(res.ok && /<title>NEW BLACK \| International Fashion Agency<\/title>/.test(html), "live: nieuw adres geeft 200 met titel NEW BLACK | International Fashion Agency");
    eis(/noindex/.test(res.headers.get("x-robots-tag") || "") && /<meta name="robots" content="noindex, nofollow">/.test(html), "live: noindex blijft");
    const oudAdres = await fetch("https://newblack-demo.socialnow.nl/project?x=1", { redirect: "manual" });
    eis(oudAdres.status === 301 && oudAdres.headers.get("location") === `${ADRES}project?x=1`, `live: newblack-demo.socialnow.nl geeft 301 naar het nieuwe adres (${oudAdres.status} ${oudAdres.headers.get("location")})`);
  } catch (e) {
    eis(false, `demo bereikbaar (${e.message})`);
  }
}

if (fouten.length) { console.error(`\n${fouten.length} eis(en) rood`); process.exit(1); }
console.log("\nalles groen");
