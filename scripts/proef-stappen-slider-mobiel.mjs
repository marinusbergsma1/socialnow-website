#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: "Verder op mobiel graag deze in een slide zetten." (Zo werken we, vijf stappen).
// Rood vóór de wijziging, groen erna. Gebruik: node scripts/proef-stappen-slider-mobiel.mjs
import fs from "node:fs";
const css = fs.readFileSync("proposal/stappenplan.css", "utf8");
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const mobiel = [...css.matchAll(/@media\(max-width:600px\)\{([\s\S]*?)\n\}/g)].map((m) => m[1]).join("\n");
eis(/\.st-lijst\{[^}]*display:flex/.test(mobiel) && /\.st-lijst\{[^}]*overflow-x:auto/.test(mobiel), "mobiel: stappen naast elkaar in een horizontale slider");
eis(/\.st-lijst\{[^}]*scroll-snap-type:x mandatory/.test(mobiel) && /\.st-lijst li\{[^}]*scroll-snap-align:start/.test(mobiel), "slider klikt per kaart vast (scroll-snap)");
eis(/\.st-lijst li\{[^}]*flex:0 0 (7\d|8[0-5])%/.test(mobiel), "kaart 70–85% breed, zodat de volgende stap zichtbaar uitsteekt");
eis(/\.st-lijst li:last-child\{grid-column:auto/.test(mobiel), "laatste kaart niet meer over de volle breedte");
eis(/\.st-lijst::-webkit-scrollbar\{display:none/.test(mobiel) && /scrollbar-width:none/.test(mobiel), "geen schuifbalk zichtbaar");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
