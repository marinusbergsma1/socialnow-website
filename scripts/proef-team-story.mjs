#!/usr/bin/env node
// Proef: redesign van /team en Mijn story, 22 oktober 2026 (Marinus):
// "ik wil een compleet redesign van team en mijn story. Ook graag mijn story video [...] niet alleen dit zo groot en totaal uit
// verhouding allemaal. [...] Ook moet hier juist die samenwerking staan met Uncanny en Indexworld."
// Gebruik: node scripts/proef-team-story.mjs [--dist]
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = f => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
const verhaal = lees("proposal/Verhaal.tsx"), paginas = lees("proposal/paginas.tsx"), css = lees("proposal/verhaal-story.css");
const team = paginas.slice(paginas.indexOf("export function TeamPage()"), paginas.indexOf("export function BlogPage"));
eis(/<video className="vs-video" src=\{STORYFILM\}[^>]*controls/.test(verhaal) && verhaal.includes('"/video/verhaal/story-presentatie.mp4'), "de storyfilm staat groot in Mijn story, met bediening");
eis(/\.vs-video\{[^}]*aspect-ratio:16\/9/.test(css) && /\.vs-portret img\{[^}]*aspect-ratio:4\/5/.test(css), "film 16:9 en portret 4:5: vaste verhoudingen");
eis(!/LightArtStrook|HeroReview|FounderProfile|ExplainerPlayer kind="story" compact/.test(verhaal), "geen Artist Impressions, review of losse profielkaart meer in de story");
eis(/<SamenParen \/>/.test(verhaal) && /export function SamenParen\(\)/.test(lees("proposal/SamenEnVeilig.tsx")), "samenwerking met Indexworld en Uncanny staat bij de story (zelfde kaarten als op de homepage)");
eis(team.indexOf("<Verhaal />") > 0 && team.indexOf("<Verhaal />") < team.indexOf("h-sterke-teams") && !team.includes("<Founder />"), "op /team eerst de story en de samenwerking, dan het team; geen dubbel oprichtersblok");
for (const l of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(lees(`proposal/i18n/${l}.json`) || "{}");
  eis(["Mijn verhaal in twee minuten", "Samen gebouwd", "Met Indexworld, Uncanny en Attesso."].every(k => w[k]), `${l}: nieuwe zinnen vertaald`);
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
