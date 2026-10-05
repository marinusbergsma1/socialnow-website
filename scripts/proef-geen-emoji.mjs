// Proef 6 oktober 2026 (Marinus): "NOOIT EMOJI'S GEBRUIKEN." Er stond een raket achter de kop op de homepage
// en vlaggetjes in de landkeuze van de cookiemelding. Deze proef zoekt in alle bronbestanden van de site naar emoji.
// Typografische tekens zoals ✓ → ↗ tellen niet mee. Rood op main f2925cb, groen op fix/geen-emoji-20261006.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const emoji = /\p{Extended_Pictographic}️|[\u{1F000}-\u{1FAFF}]/u;
const typografisch = /^[←-⇿✓✔™©®]$/;
const mappen = ["proposal", "components", "index.html"];
const fouten = [];
const loop = (pad) => {
  if (statSync(pad).isDirectory()) { for (const n of readdirSync(pad)) if (!n.startsWith(".")) loop(join(pad, n)); return; }
  if (!/\.(tsx?|jsx?|css|html|json|md)$/.test(pad)) return;
  readFileSync(pad, "utf8").split("\n").forEach((regel, i) => {
    for (const teken of regel.matchAll(/\p{Extended_Pictographic}️?|[\u{1F1E6}-\u{1F1FF}]/gu)) {
      if (typografisch.test(teken[0]) && !emoji.test(teken[0])) continue;
      fouten.push(`${pad}:${i + 1}  ${teken[0]}`);
    }
  });
};
mappen.forEach(loop);
for (const f of fouten) console.log(`ROOD  ${f}`);
console.log(fouten.length ? `${fouten.length} emoji gevonden` : "groen geen emoji in de site");
process.exit(fouten.length ? 1 : 0);
