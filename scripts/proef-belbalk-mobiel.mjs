#!/usr/bin/env node
// Proef, Marinus 25 nov 2026, bij de balk rechtsonder: "Op mobiel mag dit plan een Call en Whatsapp zijn." Rood op main, groen erna.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const tsx = fs.readFileSync("proposal/BelApp.tsx", "utf8"), css = fs.readFileSync("proposal/bel-app.css", "utf8");
const mobiel = (css.match(/@media \(max-width: 600px\) \{([\s\S]*?)\n\}/) || [])[1] || "";
eis(!/<span>Bellen<\/span>/.test(tsx), "geen Bellen meer in de balk (Marinus 27 nov)");

eis(/\.sn-bel-app a \{[^}]*white-space: nowrap/.test(mobiel), "op mobiel staat Plan een call op één regel");
eis(/sn-bel-app-call" href=\{boekingsPlannerUrl\}/.test(tsx) && /href=\{appLink\(\)\}/.test(tsx), "Plan een call en WhatsApp blijven");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
