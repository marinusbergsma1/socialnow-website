// 30 september 2026: proef dat scripts/check-proposal.mjs zichtbaar uit staat.
// Het script faalde sinds 2c08bf2 (10 september) op regel 48 en crashte daarna bij het renderen van
// de hele site in Node, terwijl docs/WEBSITE-VOORSTEL.md hem nog als dé controle noemde. Marinus
// koos voor uitzetten: exit 2 met een reden, zodat niemand een oude uitkomst als groen leest.
// Draaien: node scripts/proef-check-proposal-uit.mjs
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const uitkomst = [];
const eis = (naam, goed, detail) => uitkomst.push({ naam, goed, detail });

const run = spawnSync(process.execPath, ["scripts/check-proposal.mjs"], { encoding: "utf8", timeout: 180000 });
eis("C1 check-proposal.mjs stopt met exit 2", run.status === 2, `exit ${run.status}`);
const uitvoer = `${run.stdout}\n${run.stderr}`;
eis("C2 check-proposal.mjs zegt dat hij uit staat en waarom", /staat uit/.test(uitvoer) && /2c08bf2/.test(uitvoer),
  `uitvoer: ${uitvoer.trim().split("\n").filter((r) => !/browserslist|update-db|npx update/i.test(r)).slice(0, 2).join(" | ")}`);

const docs = readFileSync("docs/WEBSITE-VOORSTEL.md", "utf8").split("\n");
for (const [i, regel] of docs.entries())
  if (regel.includes("check-proposal.mjs"))
    eis("C3 docs noemen check-proposal.mjs alleen als uitgezet", /staat uit/.test(regel), `docs/WEBSITE-VOORSTEL.md:${i + 1}`);

for (const naam of [...new Set(uitkomst.map((u) => u.naam))]) {
  const r = uitkomst.filter((u) => u.naam === naam);
  const fout = r.filter((u) => !u.goed);
  console.log(`${fout.length ? "ROOD " : "GROEN"}  ${naam}: ${r.length - fout.length} goed, ${fout.length} fout`);
  for (const f of fout) console.log(`         ${f.detail}`);
}
const fouten = uitkomst.filter((u) => !u.goed).length;
console.log(fouten ? `\nROOD: ${fouten} fouten` : "\nGROEN: alle eisen gehaald");
process.exit(fouten ? 1 : 0);
