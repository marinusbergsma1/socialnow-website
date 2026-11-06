#!/usr/bin/env node
// Proef, Marinus 6 nov 2026: "Finance & operations Moet Wealth Management zijn en zet onder erp en Cybersecurity".
// Gebruik: node scripts/check-wealth-management.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const content = fs.readFileSync("proposal/content.ts", "utf8");
const trust = fs.readFileSync("proposal/TeamTrust.tsx", "utf8");
const tsx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8");
const css = fs.readFileSync("proposal/connect-experts.css", "utf8");
eis(!/"Finance & operations"/.test(content + trust + tsx), "nergens meer Finance & operations als groep");
eis(/\{ name: "Wealth Management", members: \["Steef Komen", "Michelle Yang", "Steven Goudsblom"\] \}/.test(content), "groep Wealth Management met Steef, Michelle en Steven");
eis(/functie: "Wealth Management"/.test(trust), "teampagina: functie Wealth Management");
const takken = tsx.match(/const TAKKEN[\s\S]*?\n\];/)?.[0] ?? "";
eis(/naam: "Wealth Management"/.test(takken) && /IN_TAK = new Set\(\[[^\]]*"Wealth Management"/.test(tsx), "Wealth Management is een tak in Kernonderdelen, niet meer onderaan bij de vakgebieden");
eis(/\.cx-tak\.is-wealth \{ grid-column: 1 \/ span 2; grid-row: 2; \}/.test(css) && /\.cx-tak\.is-groot \{ grid-column: 3; grid-row: 1 \/ span 2; \}/.test(css), "breed scherm: onder Cybersecurity en ERP & CRM, Growth ernaast");
if (process.argv.includes("--dist")) {
  const html = fs.readFileSync("dist/nl/producten/index.html", "utf8");
  const s = html.indexOf('class="cx-takken"'), blok = s < 0 ? "" : html.slice(s, html.indexOf("Vakgebieden", s));
  const w = blok.indexOf("Wealth Management");
  eis(w > 0 && blok.indexOf("Michelle Yang", w) > w && blok.indexOf("Steven Goudsblom", w) > w, "gebouwde pagina: Wealth Management met Michelle en Steven in de takken");
  eis(!html.includes("Finance &amp; operations"), "gebouwde pagina zonder Finance & operations");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
