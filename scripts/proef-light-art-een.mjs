// Proef Light Art: één voor-en-na-paar (3 oktober 2026). Rood op main f3e5a43, groen op feat/doel-familie-20261003.
// Marinus, bij een schermafdruk van Eternal Sundown: "1 IS GOED GENOEG VAN DEZE". Vervangt de drie paren van
// scripts/proef-light-art-drie.mjs (die proef is daarmee bewust rood).
// Ook: "De omslag" in Verhaal.tsx groen ("DEZE GROEN VOOR DE POSITIEVE MESSAGE").
// Draai: node scripts/proef-light-art-een.mjs   (exit 0 = groen).
import { readFileSync, existsSync } from "node:fs";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const bron = lees("proposal/LightArtStrook.tsx");
const css = lees("proposal/bereikt.css");
const titels = [...bron.matchAll(/\{ titel: "([^"]+)", voor:/g)].map((m) => m[1]);
const eisen = [
  ["precies één impressie: Eternal Sundown", titels.join("|") === "Eternal Sundown"],
  ["pc: één kaart, niet in een rooster van drie", !/\.h-lac-venster\s*\{[^}]*repeat\(3/.test(css) && /\.h-lac-venster\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(css)],
  ["telefoon: de kaart vult de breedte", /\.h-lac-kaart\s*\{\s*width:\s*100%;\s*\}/.test(css)],
  // Marinus, bij "De omslag": "DEZE GROEN VOOR DE POSITIEVE MESSAGE."
  ["tegel De omslag is groen in plaats van roze", /wanneer: "De omslag",[\s\S]{0,400}soort: "groen"/.test(lees("proposal/Verhaal.tsx"))],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
