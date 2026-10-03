// 3 oktober 2026 (Marinus): "Zet de rest er ook op". Pieter, Pepijn en Armando op de teamsite.
// Rood op main, groen op feat/team-aanvulling-20261003. Optioneel een map als eerste argument (standaard: hier).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] || ".";
const lees = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : "");
const content = lees("proposal/content.ts");
const nieuw = [
  ["Pieter Bergsma", "Pieter-Bergsma"],
  ["Pepijn Bos", "Pepijn-Bos"],
  ["Armando van Bruggen", "Armando-van-Bruggen"],
];

const eisen = nieuw.flatMap(([naam, beeld]) => [
  [`${naam} staat in people`, new RegExp(`name: "${naam}"[^}]*image: "${beeld}\\.webp"`).test(content)],
  [`${naam} heeft een portret met kleine versies`, existsSync(join(root, `public/images/${beeld}.webp`))
    && [96, 160, 320, 480].every((m) => existsSync(join(root, `public/images/klein/${beeld}-${m}.webp`)))],
  [`${naam} staat in de woordenboeken`, ["en", "de", "fr"].every((t) => lees(`proposal/i18n/${t}.json`).includes(`"${naam}": "${naam}"`))],
]);

let rood = 0;
for (const [eis, ok] of eisen) {
  if (!ok) rood++;
  console.log(`${ok ? "groen" : "rood "}  ${eis}`);
}
console.log(`\n${rood} rood, ${eisen.length - rood} groen`);
process.exit(rood ? 1 : 0);
