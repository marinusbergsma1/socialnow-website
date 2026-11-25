#!/usr/bin/env node
// Proef, Marinus 25 nov 2026, bij het startbeeld van de homepagevideo: "Kan je deze weer 3D maken en reageren op mousemovements maar
// iets meer aanwezig nog dan die andere versie." Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const tsx = fs.readFileSync("proposal/HeaderAlgemeen.tsx", "utf8"), css = fs.readFileSync("proposal/header-algemeen.css", "utf8");
const KAART = "public/video/explainer/socialnow-explainer-5x4-thumb-diepte.webp";
const standaard = +(fs.readFileSync("proposal/Diepte3D.tsx", "utf8").match(/sterkte = ([\d.]+)/) || [])[1];
const m = tsx.match(/<Diepte3D src=\{FILM_POSTER\} diepte=\{FILM_DIEPTE\}[^>]*sterkte=\{([\d.]+)\}/);
eis(fs.existsSync(KAART) && fs.statSync(KAART).size < 150_000, "dieptekaart van de startfoto staat in public/ (< 150 KB)");
eis(/const FILM_DIEPTE = "\/video\/explainer\/socialnow-explainer-5x4-thumb-diepte\.webp"/.test(tsx) && !!m, "startbeeld is een 3D-foto die op de muis reageert");
eis(!!m && +m[1] >= standaard * 1.5, `sterker dan de beursfoto's (${m ? m[1] : "-"} tegen ${standaard})`);
eis(/className="sn-alg-filmstart"/.test(tsx) && /\.sn-alg-filmstart\.is-3d \.sn-diepte3d\{opacity:1\}/.test(css) && /\.sn-alg-filmstart\[data-weg\]\{[^}]*opacity:0/.test(css), "3D-laag verdwijnt zodra de film start");
eis(tsx.indexOf('className="sn-alg-filmstart"') > -1 && tsx.indexOf('className="sn-alg-filmstart"') < tsx.indexOf('className="sn-alg-filmwaas"'), "zwarte overlay ligt over de 3D-foto");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
