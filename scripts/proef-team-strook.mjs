// 3 oktober 2026 (Marinus): "ZORG DAT IEDEREEN EROP STAAT". De fotostrook "Technologie met mensen erachter" toont het hele team.
// Leest de gebouwde homepage (npm run build). Optioneel een dist-map als eerste argument.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const dist = process.argv[2] || "dist";
const html = readFileSync(join(dist, "index.html"), "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const team = [...content.slice(0, content.indexOf("export const agents")).matchAll(/name: "([^"]+)"[^}]*image: "([^"]+)"/g)].map((m) => m[2].replace(/\.[a-z]+$/, ""));

const strook = html.match(/class="h-team-portraits"[^>]*>(.*?)<\/span>/s)?.[1] ?? "";
const inStrook = team.filter((beeld) => strook.includes(`/${beeld}-`));

const eisen = [
  ["de strook staat op de homepage", strook.length > 0],
  ...team.map((beeld) => [`${beeld} staat in de strook`, inStrook.includes(beeld)]),
];
let rood = 0;
for (const [eis, ok] of eisen) { if (!ok) rood++; console.log(`${ok ? "groen" : "rood "}  ${eis}`); }
console.log(`\n${rood} rood, ${eisen.length - rood} groen (${inStrook.length} van ${team.length} gezichten)`);
process.exit(rood ? 1 : 0);
