// Proef: de Board-tegel in het team (6 oktober 2026). Marinus: "Deze lichtgroen met groene rand."
// Rood zolang de tegel een donkergroen verloop met witte tekst heeft, groen als hij lichtgroen is met een groene rand
// en donkere tekst. Leest de gebouwde css in dist (eerst npm run build).
import { readdirSync, readFileSync } from "node:fs";

const css = readdirSync("dist/assets").filter((f) => f.endsWith(".css")).map((f) => readFileSync(`dist/assets/${f}`, "utf8")).join("\n");
const regels = [...css.matchAll(/([^{}]*\.h-board-tekst)\s*\{([^}]*)\}/g)].map((m) => m[2]);
const laatste = (prop) => { let w = null; for (const r of regels) for (const m of r.matchAll(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, "g"))) w = m[1].trim(); return w; };
const hex = (s) => (/#([0-9a-f]{6})/i.exec(s || "") || [])[1];
const licht = (h) => h && [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).reduce((a, b) => a + b, 0) / 3 > 200;
const achtergrond = laatste("background(?:-color)?");
const rand = laatste("border");
const kleur = laatste("color");
const eisen = [
  [`achtergrond lichtgroen (nu ${achtergrond})`, licht(hex(achtergrond)) && !/gradient/.test(achtergrond || "")],
  [`groene rand (nu ${rand})`, /#(25d366|0cb457|1a8f45)/i.test(rand || "")],
  [`donkere tekst (nu ${kleur})`, !!hex(kleur) && !licht(hex(kleur))],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exitCode = fout ? 1 : 0;

// Live (6 oktober 2026): het label "Concept · niet live" mag op socialnow.nl niet te zien zijn, alleen op concept.socialnow.nl.
const label = /([^{}]*)\{[^}]*content:\s*"Concept · niet live"/.exec(css);
const html = readFileSync("dist/index.html", "utf8");
const live = [
  [`conceptlabel alleen met html.is-concept (selector: ${label?.[1]?.trim()})`, !!label && /html\.is-concept/.test(label[1])],
  ["index.html zet is-concept alleen op een concept.-host", /location\.hostname\.indexOf\("concept\."\)===0/.test(html)],
];
for (const [naam, ok] of live) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) process.exitCode = 1; }
