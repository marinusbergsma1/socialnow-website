#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: "Graag deze als thumbnail met de knop voor afspelen onder de video met de breedte van de video en die
// transitioneert op een hele mooie animatie manier [...] nadat je klikt met een mooie filling of slide naar een plan een call in."
// Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const tsx = lees("proposal/HeaderAlgemeen.tsx"), css = lees("proposal/header-algemeen.css");
const THUMB = "public/video/explainer/socialnow-explainer-5x4-thumb.jpg";
eis(/const FILM_POSTER = "\/video\/explainer\/socialnow-explainer-5x4-thumb\.jpg"/.test(tsx), "startbeeld is de foto van Marinus die naar beneden wijst");
eis(fs.existsSync(THUMB) && fs.statSync(THUMB).size < 250_000, "startbeeld staat in public/ en is kleiner dan 250 KB");
eis(!/sn-alg-knop-video/.test(tsx), "geen afspeelknop meer over de video heen");
eis(/<\/figure>\s*\{?\s*<a[^>]*className="sn-alg-filmknop"/.test(tsx) || /<\/figure>[\s\S]{0,80}className="sn-alg-filmknop"/.test(tsx), "afspeelknop staat direct onder de video");
eis(/\.sn-alg-filmknop\{[^}]*width:100%/.test(css), "knop is even breed als de video");
eis(/href=\{boekingsPlannerUrl\}/.test(tsx) && /data-stand=\{gestart \? "call" : "video"\}/.test(tsx), "na de klik wordt de knop een Plan een call-link naar de afsprakenplanner");
eis(/\[data-stand="call"\][^{]*::before\{[^}]*transform:scaleX\(1\)/.test(css), "groene vulling veegt over de knop zodra de video start");
eis(/\.sn-alg-filmknop[^{]*\.lb-call\{[^}]*translateY/.test(css) && /\[data-stand="call"\] \.lb-video\{[^}]*translateY\(-/.test(css), "label schuift: Bekijk de video omhoog weg, Plan een call komt van onder");
eis(/prefers-reduced-motion:reduce\)\{[^@]*\.sn-alg-filmknop/.test(css), "zonder animatie bij reduced motion");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
