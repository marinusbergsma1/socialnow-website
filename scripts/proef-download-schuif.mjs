// Proef 30 september 2026: de downloadknoppen onder "Log in op je gratis OS" wisselen met één schuivend vlak.
// Rood op main e4cb6e5, groen op fix/download-schuifvlak-20260930.
import { readFileSync } from "node:fs";
const tsx = readFileSync("proposal/os-entry.tsx", "utf8");
const css = readFileSync("proposal/experience.css", "utf8");
const eisen = [
  ["één schuivend vlak in de downloadrij", /className=\{`h-dock-schuif/.test(tsx) && tsx.includes('"--x": `${maat.x}px`') && tsx.includes('"--w": `${maat.w}px`')],
  ["vlak volgt muis en toetsenbordfocus", tsx.includes("onPointerEnter={dock ? () => setZweef(i)") && tsx.includes("onFocus={dock ? () => setZweef(i)")],
  ["vlak blijft op het gekozen systeem", tsx.includes("const doel = zweef ?? (gekozen >= 0 ? gekozen : null);")],
  ["soepele overgang, eerste keer ter plekke", /\.h-dock-schuif \{[^}]*transition: transform \.42s cubic-bezier/.test(css) && css.includes(".h-dock-schuif.is-direct { transition: opacity .22s ease; }")],
  ["geen harde hoverkleur meer per knop", css.includes('.sn-site .h-dock-platform:hover, .sn-site .h-dock-platform[aria-expanded="true"] { background: transparent; }')],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
