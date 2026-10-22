#!/usr/bin/env node
// Proef: schakelaar boven de film in de header, 22 oktober 2026 (Marinus, ontwerp A uit de artifact "Filmschakelaar SocialNow").
// "Witte ring is nice maar moet echt een smooth morph transition zijn en Connect moet blauw zijn niet groen."
// Dus: witte ring, binnenkant open, de niet gekozen knop wit icoon en witte tekst; één vlak dat van OS naar Connect glijdt en
// in breedte en kleur meeloopt (OS groen, Connect blauw). Zonder JS of bij minder beweging blijft de oude vulling per knop werken.
// Gebruik: node scripts/proef-filmschakelaar.mjs
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const hdr = fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8"), css = fs.readFileSync("proposal/header-bestaand.css", "utf8");
eis(/\.bs-filmkeuze\{[^}]*border:3px solid #fff[^}]*background:transparent/.test(css), "witte ring, binnenkant open");
eis(/\.bs-filmkeuze button\{[^}]*background:transparent[^}]*color:#fff/.test(css), "niet gekozen knop: wit icoon en witte tekst, geen vulling");
eis(/<span className="bs-film-glijder" aria-hidden="true" \/>/.test(hdr) && /ref=\{filmkeuze\}/.test(hdr), "één glijdend vlak in de schakelaar");
eis(/\.bs-film-glijder\{[^}]*transform:translateX\(var\(--glijder-x[^}]*width:var\(--glijder-w/.test(css) && /\.bs-filmkeuze\[data-glijder="klaar"\] \.bs-film-glijder\{[^}]*transition:[^}]*transform[^}]*width[^}]*background-color/.test(css), "vlak schuift, rekt mee en wisselt van kleur (morph)");
eis(/\.bs-filmkeuze\[data-film="connect"\] \.bs-film-glijder\{background:#00739E\}/.test(css) && /\.bs-film-glijder\{[^}]*background:#0B7A37/.test(css), "OS groen, Connect blauw");
eis(/@media\(prefers-reduced-motion:reduce\)\{[^\n]*\.bs-film-glijder\{transition:none/.test(css), "geen beweging bij minder beweging");
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
