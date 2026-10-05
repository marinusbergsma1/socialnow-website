// Proef witte Talking to-balk weg (5 oktober 2026). Rood op main 1902c5c, groen op feat/talking-to-weg-20261005.
// Marinus over de witte balk met TALKING TO, René van der Zel / XXL Nutrition en de logoslider: "Deze mag weg."
import { readFileSync, existsSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const eisen = [
  ["balk niet meer op de homepage", !pages.includes("<PartnerBalk />") && !pages.includes('from "./PartnerBalk"')],
  ["component PartnerBalk is weg", !existsSync("proposal/PartnerBalk.tsx")],
  ["CSS van de balk is weg", !readFileSync("proposal/hero-c.css", "utf8").includes(".h-partners")],
  ["TALKING TO in de hero blijft", pages.includes('<span className="h-talking-label">TALKING TO</span>')],
  ["team en sprekers staan nog in de hero", pages.includes("<TeamJoin />") && pages.includes("<HeroSprekers />")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
