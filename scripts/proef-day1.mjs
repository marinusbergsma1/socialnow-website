// Proef DAY1-regel in de witte partnerbalk (3 oktober 2026). Rood op main f3e5a43, groen op feat/doel-familie-20261003.
// Marinus: "Zet ook nog Sid van Kalken currently talking to René van der Zel - to present at DAY1 event. A DREAM COME
// TRUE FOR YOUNG ENTREPENEURS LIKE US. TO INSPIRE!"
// Draai: node scripts/proef-day1.mjs   (exit 0 = groen).
import { readFileSync, existsSync } from "node:fs";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const bron = lees("proposal/PartnerBalk.tsx");
const css = lees("proposal/hero-c.css");
const eisen = [
  ["René van der Zel · XXL Nutrition blijft groot in de balk", bron.includes("René van der Zel <span>· XXL Nutrition</span>")],
  ["Sid van Kalken is currently talking to René over presenteren op het DAY1-event",
    /Sid van Kalken<\/b> is currently talking to René van der Zel to present at the <b>DAY1<\/b> event\./.test(bron)],
  ["slotregel in kapitalen, juist gespeld", bron.includes("A DREAM COME TRUE FOR YOUNG ENTREPRENEURS LIKE US. TO INSPIRE!")],
  ["eigen opmaak voor de DAY1-regels", /\.h-partners-day1\s*\{/.test(css) && /\.h-partners-droom\s*\{/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
