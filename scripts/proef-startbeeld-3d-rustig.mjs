#!/usr/bin/env node
// Proef, Marinus 25 nov 2026 (laat): (1) videoknop "Nog kleiner gwn zoals die andere knoppen" en "rechts van het blok uitlijnen";
// (2) "Plus mij een beetje 3D live maken en zetten op basis van mousemovement zoals eerder maar dan minder extreem." Eerder (#257)
// verschoof het te veel en trok de microfoon. Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const tsx = lees("proposal/HeaderAlgemeen.tsx"), css = lees("proposal/header-algemeen.css"), d3 = lees("proposal/Diepte3D.tsx");
const knop = (css.match(/\.sn-alg-filmknop\{[^}]*\}/) || [""])[0];
eis(/height:46px/.test(knop) && /width:1[78]\dpx/.test(knop) && /font-size:11px/.test(knop), "videoknop even groot als Website-actie en Neem contact op (46 px hoog, ±180 px breed, 11 px)");
eis(/align-self:flex-end/.test(knop) && /margin-left:auto/.test(knop), "videoknop rechts uitgelijnd onder het blok");
const m = tsx.match(/<Diepte3D src=\{FILM_POSTER\}[^>]*sterkte=\{([\d.]+)\} anker=\{([\d.]+)\}/);
eis(!!m && Number(m[1]) <= 0.02, "startbeeld weer 3D op de muis, maar mild (sterkte ≤ 0,02; #257 had 0,052)");
eis(!!m && Number(m[2]) <= 0.1 && /uAnker/.test(d3), "achtergrond blijft stil: anker op de diepte van de muur");
const kaart = "public/video/explainer/socialnow-explainer-5x4-thumb-diepte.webp";
eis(fs.existsSync(kaart) && fs.statSync(kaart).size < 20_000, "dieptekaart aanwezig en klein");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
