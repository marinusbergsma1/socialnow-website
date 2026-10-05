// Proef concept live (5 oktober 2026). Rood op main f2925cb, groen op feat/concept-live-20261005.
// Marinus: "ik wil 10 talen zei ik", "Ik wil graag iets meer tech en minder schreeuwerig", "je zou die andere stijl
// presenteren", "Dit moest er 1 worden", "ERP market gewoon net als bij de header" en de resultaten: "100.000 euro's voor
// VDZ ... vanuit 0 online zichtbaarheid ... alleen een door to door team. Zelfde voor kWh 100 leads in 1 week."
import { readFileSync, existsSync } from "node:fs";
const lees = (f) => (existsSync(f) ? readFileSync(f, "utf8") : "");
const context = lees("proposal/i18n/context.ts");
const bereikt = lees("proposal/Bereikt.tsx");
const nul = lees("proposal/NulNaarBedrijf.tsx");
const lac = lees("proposal/LightArtStrook.tsx");
const deuren = lees("proposal/Deuren.tsx");
const TALEN = ["en", "nl", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const NIEUW = ["leads in één week", "omzet voor VDZ", "Van nul online zichtbaarheid naar een merk dat verkoopt.", "Daarvoor had VDZ alleen een deur-aan-deurteam.", "ERP-markt", "Boekhouding"];
const woordenboek = (taal) => { try { return JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}"); } catch { return {}; } };
const eisen = [
  ["tien sitetalen", /export const LANGUAGES: Language\[\] = \["en", "nl", "de", "fr", "es", "it", "pt", "pl", "sv", "da"\]/.test(context)],
  ["een woordenboek per taal", TALEN.filter((t) => t !== "nl").every((t) => existsSync(`proposal/i18n/${t}.json`))],
  ["nieuwe zinnen vertaald in alle negen talen", TALEN.filter((t) => t !== "nl").every((t) => NIEUW.every((zin) => woordenboek(t)[zin]))],
  ["tech-stijl laadt na concept.css", /concept\.css";\nimport "\.\/proposal\/concept-tech\.css"/.test(lees("index.tsx")) && existsSync("proposal/concept-tech.css")],
  ["kWh Garant: 100 leads in één week", /waarde="100" eenheid="leads in één week"/.test(bereikt)],
  ["VDZ Brigade: € 100.000 omzet, vanaf alleen deur-aan-deur", bereikt.includes('waarde="€ 100.000" eenheid="omzet voor VDZ"') && bereikt.includes("deur-aan-deurteam")],
  ["geen stroom en geen browser meer in kWh en VDZ", !bereikt.includes("KwhStroom") && !bereikt.includes("vdz-brigade-desktop")],
  ["Alles gekoppeld zonder grote OS-bol", nul.includes("h-koppel-lijst") && !nul.includes('h-koppel-knoop is-os')],
  ["één Artist Impression", lac.includes("<VoorNaSchuif impressie={IMPRESSIES[0]} />") && !lac.includes("IMPRESSIES.map")],
  ["ERP-markt zoals in de header", deuren.includes('kop="ERP-markt"') && deuren.includes("INTEGRATIES.map") && !deuren.includes('kop="Salesforce"')],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
