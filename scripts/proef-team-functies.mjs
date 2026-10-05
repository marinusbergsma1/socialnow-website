// Proef team per functie (5 oktober 2026). Rood op main b0c8a9f, groen op feat/team-functies-20261005. Indeling aangepast op fix/team-functies-indeling-20261005 (rood op bfee27a).
// Marinus: "D is goed maar zowel ik als Attesso en management moet behalve management er nog bij ook in het onderverdelen
// terugkomen." Optie D (filterpillen) met het hele team, ook Marinus, Steef, Attesso en het Board.
import { readFileSync } from "node:fs";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const mensen = content.slice(content.indexOf("export const people"), content.indexOf("export const agents"));
const namen = [...mensen.matchAll(/name: "([^"]+)"/g)].map(m => m[1]);
const blok = team.slice(team.indexOf("const FUNCTIES"), team.indexOf("];", team.indexOf("const FUNCTIES")));
const eisen = [
  ["zes functies", ["AI development", "Web development", "Finance & operations", "Ads & search", "Video, photo & design", "Sales & partnerships"].every(f => blok.includes(`"${f}"`)) && !blok.includes('"AI & development"')],
  // 5 oktober 2026 (Marinus): "Ai development is meer Tristan an Douwe. Antony Soosaipillaj is voor Webdevelopment." Marinus naar Sales & partnerships.
  ["AI development is Tristan en Douwe", blok.includes('{ functie: "AI development", mensen: ["Tristan Slobbe", "Douwe Kramer"] }')],
  ["Web development is Sid en Antony", blok.includes('{ functie: "Web development", mensen: ["Sid van Kalken", "Antony Soosaipillaj"] }')],
  ["Marinus bij Sales & partnerships", /functie: "Sales & partnerships", mensen: \["Marinus Bergsma"/.test(blok)],
  ["iedereen uit het team staat in precies één functie", namen.length > 15 && namen.every(n => blok.split(`"${n}"`).length === 2)],
  ["Marinus, Steef, Attesso en het Board doen mee", ["Marinus Bergsma", "Steef Komen", "Sid van Kalken", "Douwe Kramer", "Michelle Yang", "Tristan Slobbe", "Steven Goudsblom"].every(n => blok.includes(`"${n}"`))],
  ["filterpillen met All en aria-pressed", team.includes('className="h-functie-pillen"') && team.includes('pil("", "All", alle.length)') && team.includes("aria-pressed={")],
  ["naam en rol onder de foto", team.includes('className="h-functie-naam"')],
  ["duo's en Board blijven bovenaan", team.includes('className="h-team-kern"') && team.includes('className="h-board"')],
  ["pillen gestyled, 8 kolommen, 4 op een telefoon", css.includes(".h-functie-pillen button[aria-pressed=\"true\"]") && /\.h-functie-muur \{[^}]*repeat\(8, minmax\(0, 1fr\)\)/.test(css) && /max-width: 900px\)[^\n]*\.h-functie-muur \{ grid-template-columns: repeat\(4, minmax\(0, 1fr\)\); \}/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
