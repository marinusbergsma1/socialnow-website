#!/usr/bin/env node
// Proef, Marinus 25 nov 2026 (laat), fotowissel na de film: "Dit hoeft niet te veranderen zo." "Of doe maar naar deze afbeelding"
// (team bij het Atomium). En de build van #262 faalde op een ontbrekende vertaling. Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const tsx = fs.readFileSync("proposal/HeaderAlgemeen.tsx", "utf8");
eis(/const DIAS = BEURSFOTOS\.filter\(\(f\) => f\.bestand === "team-atomium"\)/.test(tsx), "na de film alleen de teamfoto bij het Atomium");
eis(/DIAS\.length < 2\) return;/.test(tsx) && /DIAS\.length > 1 && <button[^>]*sn-alg-knop-fotos/.test(tsx), "geen wissel en geen pauzeknop: de foto staat stil");
eis(/<strong>Ons team<span className="sn-alg-punt">/.test(tsx) && !/In gesprek op de beurs</.test(tsx), "bijschrift past bij de foto: Ons team");
const talen = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
eis(talen.every((t) => JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"))["Vul de onboarding in"]), "'Vul de onboarding in' vertaald in alle talen (build faalde hierop)");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
