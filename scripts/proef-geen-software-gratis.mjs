#!/usr/bin/env node
// Proef: Marinus 3 november 2026: "software gratis wil ik in ieder geval als eerste van de live website af" en "Meer iets van focus
// op doelgerichte totaaloplossingen met experts en Ai." Nergens meer dat de software gratis is; de herozin en de prijskop gaan over
// doelgerichte totaaloplossingen. Het gratis OS-pakket (€0) mag blijven: dat is een prijs, geen belofte over software.
// Gebruik: node scripts/proef-geen-software-gratis.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
import path from "node:path";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const CLAIM = /software is gratis|software gratis|Software, Studio, social media, boekhouding en AI agents gratis|software is free|free software/i;
const zonderCommentaar = s => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const bronnen = ["proposal", "components"].flatMap(map => fs.readdirSync(map).filter(f => /\.(tsx|ts)$/.test(f)).map(f => path.join(map, f)));
const treffers = bronnen.filter(f => CLAIM.test(zonderCommentaar(fs.readFileSync(f, "utf8"))));
eis(treffers.length === 0, `geen "software is gratis" in de sitebron${treffers.length ? ` (${treffers.join(", ")})` : ""}`);
const kop = "Doelgerichte totaaloplossingen, met experts en AI.";
eis(fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8").includes(`<p className="pay-line">${kop}</p>`), "herozin gaat over doelgerichte totaaloplossingen");
eis(fs.readFileSync("proposal/Pricing.tsx", "utf8").includes(`<span className="prijs-kop-r1">${kop}</span>`), "prijskop op /diensten gaat over doelgerichte totaaloplossingen");
const talen = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
eis(talen.every(t => kop in JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"))), "nieuwe zin vertaald in 9 talen");
if (process.argv.includes("--dist")) {
  const tekst = p => fs.existsSync(p) ? fs.readFileSync(p, "utf8").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ") : "";
  const paginas = ["dist/index.html", "dist/nl/index.html", "dist/diensten/index.html", "dist/nl/diensten/index.html", "dist/de/index.html"];
  const fout = paginas.filter(p => CLAIM.test(tekst(p)) || !tekst(p));
  eis(fout.length === 0, `gebouwde pagina's zonder gratis-softwareclaim (${fout.join(", ") || "ok"})`);
  eis(tekst("dist/index.html").includes("Goal-driven total solutions") && tekst("dist/nl/index.html").includes("Doelgerichte totaaloplossingen"), "gebouwde homepage toont de nieuwe zin in en en nl");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
