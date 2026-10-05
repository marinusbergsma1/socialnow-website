// Proef 1 oktober 2026: "Let's get SocialNow!" bleef op live hangen op "Let's get S" (letters bleven visibility: hidden
// als de animatie niet afliep, bijvoorbeeld in een tab op de achtergrond). De letters zijn nu standaard zichtbaar; de
// animatie verbergt ze alleen tijdens het wachten (fill-mode backwards), dus afgelopen of niet: de kop staat er altijd.
// Rood op feat/team-muur-20261001 vóór de fix, groen erna.
import { readFileSync } from "node:fs";
const css = readFileSync("proposal/hero-c.css", "utf8");
const regel = (sel) => (css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + " \\{([^}]*)\\}")) || [])[1] || "";
const letter = regel(".sn-site .h-kop-typen > span");
const eisen = [
  ["letters: animatie vult alleen achteruit (backwards), nooit 'both' of 'forwards'", /h-typ 1ms steps\(1, end\) backwards/.test(letter) && !/h-typ[^,;]*\b(both|forwards)\b/.test(letter)],
  ["h-typ verbergt alleen in het begin", /@keyframes h-typ \{ from \{ visibility: hidden; \} to \{ visibility: hidden; \} \}/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
