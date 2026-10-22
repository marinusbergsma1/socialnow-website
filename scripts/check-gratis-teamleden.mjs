// 22 oktober 2026 (Marinus): "Free up to 10 GB of storage" onder SocialNow OS in de header wordt het aantal teamleden.
// Gratis = jij plus 2 uitgenodigde mensen, gelijk aan "Nodig 2 mensen uit" op de prijskaart.
// Gebruik: node scripts/check-gratis-teamleden.mjs [--dist]
import { readFileSync, readdirSync, existsSync } from "node:fs";
const NL = "Gratis voor jou en 2 teamleden.";
const fouten = [];
const header = readFileSync("proposal/HeaderBestaand.tsx", "utf8");
if (!header.includes(`<strong>${NL}</strong>`)) fouten.push("HeaderBestaand.tsx mist de teamledenzin");
if (header.includes("Gratis tot 10 GB aan opslag.")) fouten.push("HeaderBestaand.tsx toont nog 10 GB");
for (const f of readdirSync("proposal/i18n").filter(f => f.endsWith(".json") && !f.startsWith("._"))) {
  const t = JSON.parse(readFileSync(`proposal/i18n/${f}`, "utf8"));
  if (!t[NL]) fouten.push(`${f} mist de vertaling`);
}
if (process.argv.includes("--dist")) {
  for (const [pad, zin] of [["dist/index.html", "Free for you and 2 team members."], ["dist/nl/index.html", NL]]) {
    if (!existsSync(pad)) { fouten.push(`${pad} ontbreekt`); continue; }
    const html = readFileSync(pad, "utf8");
    if (!html.includes(zin)) fouten.push(`${pad} mist "${zin}"`);
    if (/up to 10 GB of storage|tot 10 GB aan opslag/.test(html)) fouten.push(`${pad} toont nog 10 GB`);
  }
}
if (fouten.length) { console.error("ROOD\n" + fouten.join("\n")); process.exit(1); }
console.log("GROEN: teamleden in plaats van 10 GB");
