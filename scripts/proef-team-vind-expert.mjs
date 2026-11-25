#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: "bij Team gewoon vanaf hier beginnen. Maar verbeter Vind je Expert."
// Gebruik: node scripts/proef-team-vind-expert.mjs            (huidige bestanden)
//          node scripts/proef-team-vind-expert.mjs origin/main (stand van main: moet rood zijn)
import fs from "node:fs";
import { execSync } from "node:child_process";
const ref = process.argv[2];
const lees = (p) => ref ? execSync(`git show ${ref}:${p}`, { encoding: "utf8" }) : fs.readFileSync(p, "utf8");
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const pag = lees("proposal/paginas.tsx");
const team = pag.slice(pag.indexOf("export function TeamPage()"), pag.indexOf("export function BlogPage()"));
const cx = lees("proposal/ConnectExperts.tsx");
const css = lees("proposal/connect-experts.css");
const en = JSON.parse(lees("proposal/i18n/en.json"));

eis(/^\s*<ConnectExperts paginaKop \/>/m.test(team.split("return (")[1].replace(/^\s*<>\s*/, "")), "/team begint met het expertblok (Vind je expert)");
eis(!/<PageHeading|<Verhaal|HomeConnectBand/.test(team), "geen paginakop, verhaal of Connect-band meer boven het expertblok");
eis(/ContactSlot/.test(team), "pagina eindigt nog bij de contacttegels");
eis(/const Kop = paginaKop \? "h1" : "h2"/.test(cx), "op /team is Vind je expert de h1 (homepage houdt h2)");
eis(!/ad-specialisten/.test(cx), "inleiding zonder \"ad-\" die midden in het woord afbreekt");
eis(/className="cx-filter"/.test(cx) && /Cybersecurity", "ERP & CRM", "Growth", "Wealth Management"/.test(cx), "snelfilters per kernonderdeel onder het zoekveld");
eis(/aria-pressed/.test(cx), "filters melden hun stand aan schermlezers (aria-pressed)");
eis(/experts gevonden/.test(cx) && /aria-live="polite"/.test(cx), "teller met het aantal gevonden experts tijdens zoeken of filteren");
eis(/\.cx-filter\[aria-pressed="true"\]\s*\{[^}]*color:\s*#fff/.test(css), "actief filter: witte tekst op Connect-blauw");
for (const k of ["Alle experts", "experts gevonden", "Vind je expert"]) eis(typeof en[k] === "string", `vertaling aanwezig: "${k}"`);
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand in connect-experts.css");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
