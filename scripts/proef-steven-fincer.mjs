// Proef Steven Goudsblom in Currently building (5 oktober 2026). Rood op main 30b3343, groen op feat/steven-fincer-20261005.
import { readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
const hash = f => existsSync(f) ? createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 16) : "";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
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
  // 5 oktober 2026 (Marinus): "HIJ MOET OOK BIJ HET TEAM EN BIJ NEW PARTNER."
  ["Steven in het team als New partner", /name: "Steven Goudsblom", role: "New partner · Wealth management · Fincer", image: "Steven-Goudsblom\.webp"/.test(content)],
  ["Steven in de teamstrook na Tristan", team.includes('"Tristan Slobbe", "Steven Goudsblom"]')],
  ["scherpe foto voor de teampagina", existsSync("public/images/klein/Steven-Goudsblom-320.webp") && statSync("public/images/Steven-Goudsblom.webp").size > 20000],
  // 5 oktober 2026 (Marinus): "Graag voor Antony deze foto." en "En voor Youri deze." (WhatsApp-foto's, vierkant bijgesneden)
  ["nieuwe foto Antony", hash("public/images/Antony-Soosaipillaj.webp") === "7b0990386a4143a6"],
  ["nieuwe foto Youri", hash("public/images/Youri-van-der-Donk.webp") === "bab0ebe5629e624a"],
  ["op /team blijft de eigen rol zichtbaar, zonder System Expert-badge", readFileSync("proposal/ui.tsx", "utf8").includes('<span>{person.role}</span>') && !readFileSync("proposal/ui.tsx", "utf8").includes('"System Expert"')],
  ["bouwers twee bij twee", /\.h-bouwers \{[^}]*grid-template-columns: 1fr 1fr/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
