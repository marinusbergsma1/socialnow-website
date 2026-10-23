// 23 oktober 2026 (Marinus): Gijsbert Westeneng (Full-Stack AI Engineer) erbij in het team en bij Connect, en "Tristan mag er ook weer bij."
// Proef: beiden staan in people, in AI development bij Connect en op /team, met foto in elke maat.
import { readFileSync, existsSync } from "node:fs";
const content = readFileSync("proposal/content.ts", "utf8");
const trust = readFileSync("proposal/TeamTrust.tsx", "utf8");
const en = JSON.parse(readFileSync("proposal/i18n/en.json", "utf8"));
const mensen = [["Gijsbert Westeneng", "Full-Stack AI Engineer"], ["Tristan Slobbe", "Data & AI Engineer"]];
const fouten = [];
for (const [naam, rol] of mensen) {
  const stam = naam.replace(" ", "-");
  if (!content.includes(`name: "${naam}", role: "${rol}"`)) fouten.push(`${naam} mist in people`);
  if (!new RegExp(`name: "AI development", members: \\[[^\\]]*"${naam}"`).test(content)) fouten.push(`${naam} mist in Connect AI development`);
  if (!new RegExp(`functie: "AI development", mensen: \\[[^\\]]*"${naam}"`).test(trust)) fouten.push(`${naam} mist op /team AI development`);
  for (const f of [`public/images/${stam}.webp`, ...[96, 160, 320, 480].map((m) => `public/images/klein/${stam}-${m}.webp`)]) if (!existsSync(f)) fouten.push(`${f} ontbreekt`);
  for (const k of [naam, rol]) if (!en[k]) fouten.push(`en.json mist ${k}`);
}
if (existsSync("dist/index.html")) {
  const html = readFileSync("dist/index.html", "utf8");
  for (const [naam] of mensen) if (!html.includes(naam)) fouten.push(`${naam} niet in de gebouwde homepage`);
}
if (fouten.length) { console.error("ROOD\n" + fouten.join("\n")); process.exit(1); }
console.log("GROEN: Gijsbert en Tristan staan in team en Connect");
