// Proef teamhiërarchie (6 oktober 2026). Rood op 5f11a81, groen op feat/concept-live-20261005 na deze wijziging.
// Marinus: "Hier ook nog even iets van hierarchie", "Voor op de website en op de video", bij optie H3: "Deze vind ik nice
// maar liever vierkantjes omdat iedereen een plek verdient" en "Benoem ook de groei van het team in de afgelopen week".
import { readFileSync } from "node:fs";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const lagen = team.match(/const LAGEN[\s\S]*?\n\];/)?.[0] ?? "";
const volgorde = [...lagen.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const mensen = content.match(/export const people[\s\S]*?\n\];/)?.[0] ?? "";
const namen = [...mensen.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]);
const nieuw = ["Tristan Slobbe", "Douwe Kramer", "Antony Soosaipillaj", "Aren", "Youri van der Donk", "Isaak Munster", "Pieter Bergsma", "Pepijn Bos", "Armando van Bruggen", "Steven Goudsblom"];
const sinds = (naam) => content.match(new RegExp(`name: "${naam}"[^}]*sinds: "(2026-\\d\\d-\\d\\d)"`))?.[1];
const eisen = [
  ["lagen Partner, Board, Head, Specialist, Sales & network", ["Partner", "Board", "Head", "Specialist", "Sales & network"].every((l) => lagen.includes(`"${l}"`))],
  ["Marinus eerst, daarna Steef, Sid, Douwe en het Board", /"Partner", \["Marinus Bergsma", "Steef Komen", "Sid van Kalken", "Douwe Kramer"\]/.test(lagen) && /"Board", \["Michelle Yang", "Tristan Slobbe", "Steven Goudsblom"\]/.test(lagen)],
  ["iedereen uit het team staat precies één keer in de lagen", namen.length > 0 && namen.every((n) => volgorde.filter((v) => v === n).length === 1)],
  ["All toont de lagen, een functie filtert nog steeds", /!keuze \? <TeamInLagen/.test(team) && team.includes("x.functie === keuze")],
  ["iedereen een vierkante tegel, bovenste rij groter", /\.h-lagen-muur \{[^}]*grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/.test(css) && /\.h-lagen-muur figure \{[^}]*aspect-ratio: 1/.test(css) && /\.h-lagen-top \{/.test(css)],
  ["laaglabel bij elke tegel, Partner groen", team.includes('`h-laag${laag === "Partner" ? " is-partner" : ""}`') && /\.h-laag\.is-partner \{[^}]*color: #1a8f45/.test(css)],
  ["groei van de afgelopen week staat erbij", team.includes('className="h-team-groei"') && /7 \* 864e5/.test(team)],
  ["de tien nieuwe mensen hebben een sinds-datum binnen 29 sep t/m 5 okt", nieuw.every((n) => { const d = sinds(n); return d && d >= "2026-09-29" && d <= "2026-10-05"; })],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
