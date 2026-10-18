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
eis(Boolean(knop && paneel), "proposal/PlanCall.tsx en PlanCallPaneel.tsx bestaan");
eis(/<CustomCall\/>/.test(kop) && /<PlanCallKnop\/>/.test(kop), "hero: knop Plan een call naast Maak een account aan");
eis(/custom-call-line[\s\S]*openPlanCall/.test(kop), "hero rechts: regel Een OS volledig op maat? met Plan een call");
eis(/<PlanCallHost\/>/.test(kop), "hero: paneel-host staat in de hero");
eis(/later\(\(\) => import\("\.\/PlanCallPaneel"\)/.test(knop), "paneel laadt pas bij de eerste klik (later)");
eis(/export const AGENDA_LINK = "";/.test(aanvragen), "aanvragen.ts: AGENDA_LINK bestaat en is leeg");
eis(/conceptLink/.test(aanvragen) && /conceptLink\(/.test(paneel), "aanvraag loopt via aanvragen.ts (conceptLink)");
eis(!/wa\.me|mailto:/.test(knop + paneel), "geen wa.me of mailto hard in de componenten");
eis(/showModal\(\)/.test(paneel) && /onClose=\{sluit\}/.test(paneel), "paneel is een modale dialoog die met Escape sluit");
for (const vraag of ["Bedrijf", "Welke onderdelen wil je op maat?", "Budgetindicatie"]) eis(paneel.includes(vraag), `paneel vraagt: ${vraag}`);

// Alle nieuwe zinnen in alle negen woordenboeken, zonder streepje.
const zinnen = [...new Set([...`${knop}\n${paneel}`.matchAll(/(?:t\(|label: |>)"?([A-Z€][^"<>{}\n]*?[a-z0-9.?!)])(?:"|<)/g)].map((m) => m[1].trim()))]
  .filter((z) => /\s|€/.test(z) || ["Bedrijf", "Budgetindicatie", "Moment", "Toelichting", "Dag", "Stap", "Naam"].includes(z));
const nieuw = ["vanaf €10.000", "Plan een call", "Plan een call voor custom OS", "Een OS volledig op maat?", "Plan een call voor je custom OS.", "Kies een budgetindicatie.", "Wanneer past een call?", "Verstuur per e-mail"];
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const d = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const mist = [...new Set([...nieuw, ...zinnen])].filter((z) => paneel.includes(z) || kop.includes(z) || knop.includes(z)).filter((z) => !(z in d));
  eis(mist.length === 0, `${taal}.json heeft alle zinnen${mist.length ? `; mist: ${mist.slice(0, 4).join(" | ")}` : ""}`);
  const streep = nieuw.concat(zinnen).filter((z) => z in d && /[–—]/.test(d[z]));
  eis(streep.length === 0, `${taal}: geen streepje in de vertalingen`);
}
process.exit(fouten.length ? 1 : 0);
