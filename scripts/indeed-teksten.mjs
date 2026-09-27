// 28 september 2026: schrijft VACATURES-INDEED.md uit proposal/vacaturelijst.ts, zodat de teksten op Indeed
// en op socialnow.nl/vacatures altijd gelijk zijn. Draaien met: node scripts/indeed-teksten.mjs
import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";
const bron = ts.transpileModule(readFileSync("proposal/vacaturelijst.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { vacatures } = await import("data:text/javascript," + encodeURIComponent(bron));
const eur = (n) => n.toLocaleString("nl-NL");
const blok = (v) => `## ${v.titel}

| Veld op Indeed | Invullen |
|---|---|
| Functietitel | ${v.titel} |
| Locatie | Amsterdam (1017 DA), hybride |
| Type | Fulltime, vast contract na proeftijd |
| Uren | ${v.urenMin} tot ${v.urenMax} per week |
| Salaris | €${eur(v.salarisMin)} tot €${eur(v.salarisMax)} per maand |
| Solliciteren | via Indeed, cv verplicht |

**Beschrijving (plakken in het tekstvak)**

${v.kort}

${v.samen}

**Wat je doet**
${v.taken.map((r) => `- ${r}`).join("\n")}

**Wat je meebrengt**
${v.jij.map((r) => `- ${r}`).join("\n")}

**Wat wij bieden**
- Salaris van €${eur(v.salarisMin)} tot €${eur(v.salarisMax)} bruto per maand, afhankelijk van ervaring.
- ${v.urenMin} tot ${v.urenMax} uur, hybride vanuit Amsterdam.
- Direct werken aan SocialNow OS, gebruikt door bedrijven op Odoo.
- Een klein senior team, korte lijnen met de oprichter.

Meer over ons: https://socialnow.nl/vacatures#${v.slug}
`;
writeFileSync("VACATURES-INDEED.md", `# Vacatures voor Indeed\n\nGegenereerd uit proposal/vacaturelijst.ts. Pas teksten daar aan en draai het script opnieuw.\n\n${vacatures.map(blok).join("\n")}`);
console.log(`VACATURES-INDEED.md: ${vacatures.length} vacatures`);
