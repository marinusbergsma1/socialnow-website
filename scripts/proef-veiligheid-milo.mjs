#!/usr/bin/env node
// Proef veiligheids-Milo, 30 september 2026 (Marinus: "Hier nog een geanimeerde veiligheidsmilo voor maken.").
// Rood op origin/main (er is nog geen veiligheids-Milo), groen op feat/veiligheid-milo-20260930.
// Controleert: de component en zijn eigen CSS bestaan, hij staat in de veiligheidsspeler van de homepage en volgt de
// actieve stap, hij gebruikt een bestaand Milo-beeld, hij is decoratief (aria-hidden), heeft een beeld voor elk van de
// vijf films, en staat stil bij prefers-reduced-motion.
// Gebruik: node scripts/proef-veiligheid-milo.mjs  (exit 0 = groen, 1 = rood; het aantal fouten staat onderaan).
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lees = (pad) => (existsSync(join(root, pad)) ? readFileSync(join(root, pad), "utf8") : "");
const fouten = [];
const eis = (ok, melding) => { if (!ok) fouten.push(melding); };

const comp = lees("proposal/VeiligheidMilo.tsx");
const css = lees("proposal/veiligheid-milo.css");
const pages = lees("proposal/pages.tsx");
const beloftes = lees("proposal/veiligheid-beloftes.ts");

eis(comp, "proposal/VeiligheidMilo.tsx ontbreekt");
eis(css, "proposal/veiligheid-milo.css ontbreekt");
eis(/import\s+["']\.\/veiligheid-milo\.css["']/.test(comp), "VeiligheidMilo.tsx laadt zijn eigen CSS niet");
eis(/export default function VeiligheidMilo/.test(comp), "VeiligheidMilo.tsx heeft geen default export VeiligheidMilo");
eis(/aria-hidden="true"/.test(comp), "de veiligheids-Milo is niet decoratief gemarkeerd (aria-hidden)");

// Een bestaand Milo-beeld, geen nieuw verzonnen pad.
const beeld = comp.match(/["'](\/(?:images|proposal\/milo)\/milo-[\w-]+\.webp)["']/);
eis(beeld, "VeiligheidMilo.tsx gebruikt geen Milo-beeld uit public/images of public/proposal/milo");
if (beeld) eis(existsSync(join(root, "public", beeld[1])), `Milo-beeld ${beeld[1]} bestaat niet in public/`);

// Eén beeld per veiligheidsfilm, gekoppeld via de slugs uit veiligheid-beloftes.ts.
const slugs = [...beloftes.matchAll(/slug:\s*"([\w-]+)"/g)].map((m) => m[1]);
eis(slugs.length === 5, `verwacht vijf veiligheidsfilms, gevonden ${slugs.length}`);
for (const slug of slugs) eis(new RegExp(`\\b${slug}\\s*:`).test(comp), `geen beeld voor stap "${slug}" in VeiligheidMilo.tsx`);

// In de veiligheidsspeler op de homepage, en hij volgt de actieve film.
eis(/import\s+VeiligheidMilo\s+from\s+["']\.\/VeiligheidMilo["']/.test(pages), "pages.tsx importeert VeiligheidMilo niet");
const speler = pages.slice(pages.indexOf("function VeiligheidSpeler"), pages.indexOf("function VeiligheidSpeler") + 4000);
eis(pages.includes("function VeiligheidSpeler") && /<VeiligheidMilo\s+stap=\{nummer\}/.test(speler), "VeiligheidMilo staat niet in VeiligheidSpeler met stap={nummer}");

// Minder beweging: dan staat alles stil.
eis(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*animation:\s*none/.test(css), "geen prefers-reduced-motion-regel die de animatie uitzet");
// Telefoon: eigen regel voor smalle schermen.
eis(/@media\s*\(max-width:\s*640px\)/.test(css), "geen regel voor de telefoon (max-width: 640px)");

if (fouten.length) {
  console.log("ROOD");
  for (const f of fouten) console.log(" - " + f);
  console.log(`fouten: ${fouten.length}`);
  process.exit(1);
}
console.log("GROEN\nfouten: 0");
