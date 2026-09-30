// Proef (30 sep 2026): boven de OS-film in de hero staat één wisselende Milo (website, CRM, content, advertenties)
// in plaats van vier kleine pillen. Rood op main b759d3d, groen op feat/milo-wissel-20260930.
import { readFileSync } from "node:fs";
const lees = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const pages = lees("proposal/pages.tsx");
const css = lees("proposal/hero-c.css");
const fouten = [];
if (!/<HeroMiloWissel \/>/.test(pages)) fouten.push("hero toont geen HeroMiloWissel");
if (/className="h-milo-pillen"/.test(pages)) fouten.push("de vier Milo-pillen staan er nog");
if (!/setInterval\([^]*?2800\)/.test(pages)) fouten.push("Milo wisselt niet automatisch");
if (!/\.h-milo-wissel-woord/.test(css)) fouten.push("geen opmaak voor het wisselende woord");
if (!/\.h-spreker\.is-attesso img \{ transform: scaleX\(-1\)/.test(css)) fouten.push("Sid kijkt nog van Marinus weg");
for (const taal of ["en", "de", "fr"]) if (!JSON.parse(lees(`proposal/i18n/${taal}.json`))["Eén OS voor je"]) fouten.push(`vertaling ${taal} ontbreekt`);
for (const f of fouten) console.log("ROOD:", f);
console.log(fouten.length ? `${fouten.length} rood` : "groen: 0 fouten");
process.exit(fouten.length ? 1 : 0);
