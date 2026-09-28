// 28 september 2026: maakt uit proposal/vacatures.ts de teksten om in Indeed te plakken (docs/vacatures-indeed.md).
// Draaien: node scripts/vacatures-indeed.mjs
import { readFileSync, writeFileSync } from "node:fs";
const src = readFileSync("proposal/vacatures.ts", "utf8").split("export const vacatures")[1];
const lijst = (blok, veld) => [...(blok.match(new RegExp(`${veld}: \\[([\\s\\S]*?)\\]`))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const waarde = (blok, veld) => blok.match(new RegExp(`${veld}: "([^"]+)"`))?.[1] ?? "";
const blokken = src.split(/\n  \{/).slice(1);
const over = "SocialNow bouwt een gratis OS voor ondernemers: website, CRM, content en advertenties in één systeem, met AI die het werk doet. Wat ons anders maakt is de laag erbovenop: mensen die je kent en die altijd voor je klaarstaan. Wij geloven dat elke vorm van intelligentie goed is, en dat mensen het verschil maken. We bewijzen altijd eerst gratis wat we kunnen.";
let md = `# Vacatures SocialNow voor Indeed\n\nGegenereerd uit proposal/vacatures.ts. Per functie: titel, soort, uren en de volledige tekst om in Indeed te plakken.\n\nBedrijf: SocialNow, Amstelstraat 43G, 1017 DA Amsterdam. Solliciteren: info@socialnow.nl of socialnow.nl/vacatures.\n\n`;
for (const b of blokken) {
  const slug = waarde(b, "slug");
  md += `---\n\n## ${waarde(b, "titel")}\n\n- Dienstverband: ${waarde(b, "soort")}\n- Uren: ${waarde(b, "uren")}\n- Locatie: ${waarde(b, "plek") || "Amsterdam, hybride"}\n- Salaris: ${waarde(b, "salaris") || "nog invullen"}\n- Link: https://socialnow.nl/vacatures#${slug}\n\n### Tekst\n\n${waarde(b, "kort")}${waarde(b, "samen") ? `\n\n${waarde(b, "samen")}` : ""}\n\n**Over SocialNow**\n\n${over}\n\n**Wat je doet**\n\n${lijst(b, "wat").map((r) => `- ${r}`).join("\n")}\n\n**Wie je bent**\n\n${lijst(b, "wie").map((r) => `- ${r}`).join("\n")}\n\n**Wat wij bieden**\n\n- Een team dat elkaar kent en elkaar helpt\n- Werken met het nieuwste op het gebied van AI\n- Groeien met een bedrijf dat duizenden ondernemers gaat helpen\n\nSolliciteren: mail naar info@socialnow.nl met als onderwerp "Sollicitatie: ${waarde(b, "titel")}".\n\n`;
}
writeFileSync("docs/vacatures-indeed.md", md);
console.log(`${blokken.length} vacatures naar docs/vacatures-indeed.md`);
