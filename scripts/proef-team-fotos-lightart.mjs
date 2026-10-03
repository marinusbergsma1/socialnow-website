// 3 oktober 2026 (Marinus): "Zorg even dat Youri, Aren en Antony niet allemaal zo dezelfde afbeeldingen hebben. Mag meer
// variatie en kleur in." En bij Light Art: "GRAAG ALLEEN DE EERSTE" van de drie kopjes.
// Meet de gemiddelde kleur van elk 96px-portret (via dwebp) en eist onderling duidelijk verschil plus kleur.
// Optioneel een map als eerste argument (standaard: hier).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] || ".";
const gemiddelde = (naam) => {
  const ppm = execFileSync("dwebp", ["-quiet", "-ppm", join(root, `public/images/klein/${naam}-96.webp`), "-o", "-"]);
  let kop = 0, regels = 0;
  while (regels < 3) if (ppm[kop++] === 0x0a) regels++; // P6, maten, maximum
  const px = ppm.subarray(kop), som = [0, 0, 0];
  for (let i = 0; i < px.length; i++) som[i % 3] += px[i];
  return som.map((s) => s / (px.length / 3));
};
const verzadiging = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b);
const afstand = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const namen = ["Youri-van-der-Donk", "Aren", "Antony-Soosaipillaj"];
const kleur = Object.fromEntries(namen.map((n) => [n, gemiddelde(n)]));
const strook = readFileSync(join(root, "proposal/LightArtStrook.tsx"), "utf8");
const kop = strook.match(/<p className="h-lac-kop">([\s\S]*?)<\/p>/)?.[1] ?? "";

const eisen = [
  ["Youri en Aren verschillen duidelijk van kleur", afstand(kleur[namen[0]], kleur[namen[1]]) > 40],
  ["Youri en Antony verschillen duidelijk van kleur", afstand(kleur[namen[0]], kleur[namen[2]]) > 40],
  ["Aren en Antony verschillen duidelijk van kleur", afstand(kleur[namen[1]], kleur[namen[2]]) > 40],
  ["Youri en Aren hebben kleur in plaats van grijs", verzadiging(kleur[namen[0]]) > 30 && verzadiging(kleur[namen[1]]) > 30],
  ["Light Art heeft alleen het kopje Artist Impressions", kop.includes("Artist Impressions") && !kop.includes("Light Art Collection") && !kop.includes("Schuif voor en na")],
];
let rood = 0;
for (const [eis, ok] of eisen) { if (!ok) rood++; console.log(`${ok ? "groen" : "rood "}  ${eis}`); }
for (const n of namen) console.log(`  ${n}: rgb(${kleur[n].map(Math.round).join(", ")})`);
console.log(`\n${rood} rood, ${eisen.length - rood} groen`);
process.exit(rood ? 1 : 0);
