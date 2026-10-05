// Proef Board op de homepage (5 oktober 2026). Rood op main 4aea085, groen op feat/board-groen-20261005.
// Marinus: "Michelle, Tristan en Steven wil ik graag groot hebben als bestuursonderdeel." Gekozen optie D, "graag groen dus".
import { readFileSync } from "node:fs";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const eisen = [
  ["Board met Michelle, Tristan en Steven", /const BOARD = \["Michelle Yang", "Tristan Slobbe", "Steven Goudsblom"\]/.test(team)],
  // 5 oktober 2026: onder het Board staat nu het team per functie (scripts/proef-team-functies.mjs).
  ["Board onder de duo's en boven het team per functie", /className="h-team-kern"[\s\S]*className="h-board"[\s\S]*<TeamPerFunctie \/>/.test(team)],
  ["groene tekstkaart met Board en de drie namen", team.includes('className="h-board-tekst"') && team.includes("<b>Board</b>") && team.includes("Operations, data and wealth.") && team.includes("Michelle, Tristan and Steven")],
  ["korte rollen", team.includes('"Michelle Yang": "Supply Chain & Operations"') && team.includes('"Tristan Slobbe": "Data & AI"') && team.includes('"Steven Goudsblom": "Wealth management"')],
  // 5 oktober 2026 (Marinus): het Board staat bewust ook in het team per functie, dus de oude eis "niet meer op de muur" vervalt.
  ["kaart is groen, vier vakken, twee bij twee op een telefoon", /\.h-board-tekst \{[^}]*background: linear-gradient\([^)]*#0cb457/.test(css) && /\.h-board \{[^}]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/.test(css) && /max-width: 640px\) \{[^\n]*\.h-board \{ grid-template-columns: 1fr 1fr; \}/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
