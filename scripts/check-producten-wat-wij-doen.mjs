#!/usr/bin/env node
// Proef: /producten is "wat wij doen". Marinus, 4 november 2026 (avond): "Wie wij zijn - wat wij doen - hoe wij onszelf bewijzen" en
// "De wat wij doen wil ik nog even wat meer focus over de connectie en ons geloof in dat experts altijd nodig zullen zijn plus de
// partners die helpen bouwen en attesso en hun allemaal met de logo's Met deze header alleen een andere titel [...] meer op het doel
// van wat wij doen gefocust [...] onderaan nog even een zelfde soort website actie blok als wie wij zijn".
// Gebruik: node scripts/check-producten-wat-wij-doen.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const pages = fs.readFileSync("proposal/pages.tsx", "utf8");
const prod = pages.slice(pages.indexOf("export function ProductenPagina"));
const ZIN = "Jouw doelen halen, met echte experts en AI.";
eis(prod.includes(`<HeaderBestaand meet={() => {}} kop="${ZIN}"`), "header van gisteren met een eigen, doelgerichte titel");
eis(!prod.includes("Een betrouwbare partner voor groei en cybersecurity"), "titel van de homepage niet opnieuw gebruikt");
const hb = fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8");
eis(/kop = "Een betrouwbare partner voor groei en cybersecurity\."/.test(hb) && hb.includes("{kop}</h1>"), "HeaderBestaand neemt de titel als prop, /het-os houdt de oude titel");
const volgorde = ["<HeaderBestaand", "<ExpertsGeloof", "<SamenEnVeilig", "<ConnectExperts", "<WebsiteCTA"];
const p = volgorde.map((v) => prod.indexOf(v));
eis(p.every((x) => x >= 0) && p.every((x, i) => i === 0 || x > p[i - 1]), `volgorde: ${volgorde.join(" → ").replace(/</g, "")}`);
const g = fs.existsSync("proposal/ExpertsGeloof.tsx") ? fs.readFileSync("proposal/ExpertsGeloof.tsx", "utf8") : "";
eis(g.includes("Experts blijven altijd nodig") && g.includes("Connect"), "blok over ons geloof: experts blijven altijd nodig, via Connect");
eis(["indexworld.png", "uncanny-op-zwart.svg", "komen-operation-systems.webp", "~/attesso"].every((l) => g.includes(l)), "bouwpartners met logo's: Indexworld, Uncanny, Komen Consultancy en Attesso");
eis(!/\bClaude\b|GPT|Gemini/.test(g), "geen modelnamen in de sitecopy");
eis(/<WebsiteCTA tweede \/>\s*<\/div>;\s*\}\s*$/.test(prod.slice(0, prod.indexOf("\n}\n") + 3)), "website-actieblok helemaal onderaan /producten");
if (process.argv.includes("--dist")) {
  const nl = fs.readFileSync("dist/nl/producten/index.html", "utf8");
  eis(nl.includes("Jouw doelen halen") && nl.includes("Experts blijven altijd nodig") && nl.includes('class="sn-cta-web'), "gebouwde /nl/producten: titel, geloof en website-actie");
  const en = fs.readFileSync("dist/producten/index.html", "utf8");
  eis(!en.includes("Experts blijven altijd nodig") && !en.includes("Jouw doelen halen"), "gebouwde Engelse /producten is vertaald");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
