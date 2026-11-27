#!/usr/bin/env node
// Proef, Marinus 25 nov 2026, bij de vijf stappentegels: "Kennismaken moet op 1." Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const st = fs.readFileSync("proposal/Stappenplan.tsx", "utf8"), pg = fs.readFileSync("proposal/pages.tsx", "utf8"), fw = fs.readFileSync("proposal/FreeWebsite.tsx", "utf8");
const lijst = (st.match(/export const STAPPEN = \[([\s\S]*?)\] as const/) || [])[1] || "";
const volgorde = [...lijst.matchAll(/nr: "(\d+)", id: "([\w-]+)"/g)].map((m) => `${m[1]}:${m[2]}`).join(" ");
eis(volgorde === "01:stap-contact 02:stap-website 03:stap-marketing 04:stap-operations 05:stap-os", `Kennismaken is stap 01, de rest schuift op (nu: ${volgorde})`);
eis(/Mini id=\{s\.id\}/.test(st), "mini-animatie hoort bij de stap zelf, niet bij het nummer");
eis(/Stap 01 · Kennismaken/.test(st) && /Stap 04 · Management en operations/.test(st) && /Stap 05 · Groei en opschalen/.test(st), "stapkoppen op de pagina volgen de nieuwe nummers");
eis(/StapKop nr="03" titel="Marketing en advertenties"/.test(pg) && /Stap 02 · Website en branding/.test(fw), "marketing is 03, website is 02");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
