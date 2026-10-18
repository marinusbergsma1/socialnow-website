#!/usr/bin/env node
// Proef (18 okt 2026, Marinus: "Plan een call voor custom OS" in de hero, met een boekingspaneel).
// Rood op main 32f3a15, groen met de wijziging. Gebruik: node scripts/check-plan-call.mjs
import { existsSync, readFileSync } from "node:fs";

const lees = (pad) => (existsSync(pad) ? readFileSync(pad, "utf8") : "");
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };

const kop = lees("proposal/HomeHeader.tsx");
const knop = lees("proposal/PlanCall.tsx");
const paneel = lees("proposal/PlanCallPaneel.tsx");
const aanvragen = lees("proposal/aanvragen.ts");
const shell = lees("proposal/WebsiteProposal.tsx");
const menu = lees("proposal/Producten.tsx");
eis(Boolean(knop && paneel), "proposal/PlanCall.tsx en PlanCallPaneel.tsx bestaan");
eis(/<CustomCall\/>/.test(kop) && /<PlanCallKnop label="Plan een call"\/>/.test(kop), "hero: knop Plan een call naast Maak een account aan");
// 18 okt, prijsmodel: hulppakket vanaf €3.000 p/m in plaats van custom OS vanaf €10.000; Plan een call niet drie keer boven de vouw.
eis(/Custom OS en gratis website<\/strong> in elk hulppakket, vanaf €3\.000 p\/m/.test(kop) && !/vanaf €10\.000|€10\.000 tot €20\.000/.test(paneel + kop.replace(/\/\/.*$/gm, "")), "hero en paneel: hulppakket vanaf €3.000 p/m, geen €10.000 meer");
eis(!/custom-call-line/.test(kop), "geen tweede tekstlink Plan een call onder de ondertitel");
eis(/<PlanCallHost \/>/.test(shell) && !/<PlanCallHost/.test(kop), "paneel-host staat sitebreed in WebsiteProposal.tsx (één keer)");
// Hoofdnavigatie (18 okt): Producten, Diensten, Resultaten, Prijzen, Team; rechts Plan een call en Inloggen gratis OS.
eis(/<ProductenMenu \/>/.test(shell) && /const nav = NAV_LINKS/.test(shell), "hoofdnavigatie begint met het Producten-menu");
eis(/\["\/diensten", "Diensten"\],\s*\["\/projecten", "Resultaten"\],\s*\["\/prijzen", "Prijzen"\],\s*\["\/team", "Team"\]/.test(menu), "Diensten, Resultaten, Prijzen, Team in die volgorde");
eis(/"\/het-os"/.test(menu) && /"\/connect\/"/.test(menu), "Producten toont OS en Connect");
eis(/<HeaderCall \/>/.test(shell) && /openPlanCall/.test(menu), "Plan een call rechts in de header opent het paneel");
eis(/h-mobile-call/.test(shell), "mobiel menu heeft Plan een call");
for (const pad of ["/blog", "/contact", "/het-os"]) eis(new RegExp(`path="${pad}"`).test(shell) && new RegExp(`"${pad}": "`).test(shell), `route ${pad} blijft en houdt een titel`);
const voet = lees("proposal/BrandFooter.tsx");
eis(/to="\/blog"/.test(voet) && /to="\/contact"/.test(voet), "Blog en Contact staan in de voettekst");
eis(/navigator\.webdriver/.test(paneel), "verzenden is droog in geautomatiseerde browsers en met ?proef");
eis(/get\("bron"\) === "os"/.test(knop) && /\[0-9a-f\]\{8\}/.test(knop), "OS-parameters bron en ref worden gecontroleerd");
eis(/later\(\(\) => import\("\.\/PlanCallPaneel"\)/.test(knop), "paneel laadt pas bij de eerste klik (later)");
eis(/export const AGENDA_LINK = "";/.test(aanvragen), "aanvragen.ts: AGENDA_LINK bestaat en is leeg");
eis(/conceptLink/.test(aanvragen) && /conceptLink\(/.test(paneel), "aanvraag loopt via aanvragen.ts (conceptLink)");
eis(!/wa\.me|mailto:/.test(knop + paneel), "geen wa.me of mailto hard in de componenten");
eis(/showModal\(\)/.test(paneel) && /onClose=\{sluit\}/.test(paneel), "paneel is een modale dialoog die met Escape sluit");
for (const vraag of ["Bedrijf", "Welke onderdelen wil je op maat?", "Budgetindicatie"]) eis(paneel.includes(vraag), `paneel vraagt: ${vraag}`);

// Alle nieuwe zinnen in alle negen woordenboeken, zonder streepje.
const zinnen = [...new Set([...`${knop}\n${paneel}`.matchAll(/(?:t\(|label: |>)"?([A-Z€][^"<>{}\n]*?[a-z0-9.?!)])(?:"|<)/g)].map((m) => m[1].trim()))]
  .filter((z) => /\s|€/.test(z) || ["Bedrijf", "Budgetindicatie", "Moment", "Toelichting", "Dag", "Stap", "Naam"].includes(z));
const nieuw = ["Producten", "Resultaten", "Prijzen", "Bron", "Referentie", "Custom OS en gratis website", "in elk hulppakket, vanaf €3.000 p/m", "Hulppakket vanaf €3.000 p/m", "Budgetindicatie per maand", "Plan een call", "Plan een call voor custom OS", "Plan een call voor je custom OS.", "Kies een budgetindicatie.", "Wanneer past een call?", "Verstuur per e-mail"];
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const d = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const mist = [...new Set([...nieuw, ...zinnen])].filter((z) => paneel.includes(z) || kop.includes(z) || knop.includes(z) || menu.includes(z)).filter((z) => !(z in d));
  eis(mist.length === 0, `${taal}.json heeft alle zinnen${mist.length ? `; mist: ${mist.slice(0, 4).join(" | ")}` : ""}`);
  const streep = nieuw.concat(zinnen).filter((z) => z in d && /[–—]/.test(d[z]));
  eis(streep.length === 0, `${taal}: geen streepje in de vertalingen`);
}
process.exit(fouten.length ? 1 : 0);
