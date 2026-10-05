// Proef nieuwe foto Aren (5 oktober 2026). Rood op main 1902c5c, groen op feat/foto-aren-20261005.
// Marinus: "Deze voor Aron." Selfie uit de auto, vierkant bijgesneden rond het gezicht.
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const hash = f => existsSync(f) ? createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 16) : "";
const eisen = [
  ["nieuwe foto Aren", hash("public/images/Aren.webp") === "246e73e53634109e"],
  ["kleine varianten bestaan", [96, 160, 320, 480].every(m => existsSync(`public/images/klein/Aren-${m}.webp`))],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
