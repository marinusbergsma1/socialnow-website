// Proef Daniel Schotman (Creator Code) in het team (10 oktober 2026). Rood op main 74ea592, groen op feat/team-daniel-20261010.
// Marinus: "Hoeft niet groot", "Mag wat kleiner zijn" en bij optie D "Zo iets is wel mooi": één regel in het track record,
// naast Tristan, Douwe en Steven, in plaats van een vierkant in de teammuur. Via people staat hij wel in de portretstrook en op /team.
import { readFileSync, existsSync } from "node:fs";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const tech = readFileSync("proposal/concept-tech.css", "utf8");
const daniel = team.includes('naam="Daniel Schotman"') ? team.slice(team.indexOf('naam="Daniel Schotman"'), team.indexOf("</Bouwer>", team.indexOf('naam="Daniel Schotman"'))) : "";
const laag = (naam) => (team.match(new RegExp(`\\["${naam}", \\[([^\\]]*)\\]\\]`)) ?? [])[1] ?? "";
const eisen = [
  ["Daniel in het team, met foto en sinds 10 oktober", /name: "Daniel Schotman", role: "Content & Personal Branding · Creator Code", image: "Daniel-Schotman\.webp", sinds: "2026-10-10"/.test(content)],
  ["foto en kleine varianten staan in public", ["Daniel-Schotman.webp", "klein/Daniel-Schotman-96.webp", "klein/Daniel-Schotman-160.webp", "klein/Daniel-Schotman-320.webp"].every(f => existsSync(`public/images/${f}`))],
  ["Daniel is de vierde regel in het track record, na Steven", /naam="Tristan Slobbe"[\s\S]*naam="Douwe Kramer"[\s\S]*naam="Steven Goudsblom"[\s\S]*naam="Daniel Schotman"/.test(team)],
  ["rol Founder · Content & personal branding, met New partner", daniel.includes('rol="Founder · Content & personal branding"') && /naam="Daniel Schotman"[^>]*\bnieuw>/.test(team)],
  ["naam linkt naar zijn Instagram, met Instagram-teken", daniel.includes('instagram="https://www.instagram.com/danielschotman/"') && team.includes("<InstagramMark />") && existsSync("proposal/InstagramMark.tsx")],
  ["logo Creator Code linkt naar thecreatorcode.nl", daniel.includes('href="https://www.thecreatorcode.nl/"') && daniel.includes('src="/images/merken/creator-code.webp"') && existsSync("public/images/merken/creator-code.webp")],
  ["cijfer 10M+ views erbij", daniel.includes("10M+ views")],
  ["vier regels passen: raster vult zich zelf (2 bij 2 in het teamvlak)", /:root \.sn-site \.h-bouwers \{[^}]*repeat\(auto-fit, minmax\(240px, 1fr\)\)/.test(tech)],
  // Bewaking (op main ook groen): "Mag wat kleiner zijn", dus geen vierkant in de teammuur of de functiefilter.
  ["geen vierkant in de teammuur of functiefilter", !laag("Specialist").includes("Daniel") && !team.slice(team.indexOf("const FUNCTIES"), team.indexOf("const LAGEN")).includes("Daniel Schotman")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
