// Proef Steven Goudsblom in Currently building (5 oktober 2026). Rood op main 30b3343, groen op feat/steven-fincer-20261005.
import { readFileSync, existsSync } from "node:fs";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const steven = team.slice(team.indexOf('naam="Steven Goudsblom"'));
const eisen = [
  ["Steven staat als derde bouwer, na Tristan en Douwe", /naam="Tristan Slobbe"[\s\S]*naam="Douwe Kramer"[\s\S]*naam="Steven Goudsblom"/.test(team)],
  ["LinkedIn-link van Steven", team.includes("https://www.linkedin.com/in/steven-goudsblom-bb3ab0197/")],
  ["rol Founder · Wealth management", team.includes('rol="Founder · Wealth management"')],
  ["label New partner", /naam="Steven Goudsblom"[^>]*\bnieuw>/.test(team) && team.includes('<span className="h-bouwer-nieuw">New partner</span>') && css.includes(".h-bouwer-nieuw")],
  // 5 oktober 2026 (Marinus): "Dus ABN AMRO dan FINCER."
  ["eerst ABN AMRO, dan Fincer", /merken\/abn-amro\.svg[\s\S]*merken\/fincer\.png/.test(steven.slice(0, 1200))],
  ["ABN AMRO linkt naar abnamro.nl", steven.slice(0, 1200).includes('href="https://www.abnamro.nl"')],
  ["logo's en foto staan in public", ["merken/abn-amro.svg", "merken/fincer.png", "Steven-Goudsblom.webp", "klein/Steven-Goudsblom-96.webp", "klein/Steven-Goudsblom-160.webp"].every(f => existsSync(`public/images/${f}`))],
  ["bouwers twee bij twee", /\.h-bouwers \{[^}]*grid-template-columns: 1fr 1fr/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
