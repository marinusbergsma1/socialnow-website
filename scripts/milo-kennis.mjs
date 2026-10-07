// Bouwt worker/kennis.txt: de kennis waarmee Milo antwoordt (30 september 2026). Bronnen die de site al bijhoudt:
// public/llms.txt (aanbod en prijzen, bewaakt door scripts/check-aanbod.mjs) en de veelgestelde vragen uit proposal/content.ts,
// plus een korte vaste alinea over team, partners en het verhaal. Draai na elke wijziging aan die bronnen:
//   node scripts/milo-kennis.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { getBrandFaq } from "../proposal/brand-faq.ts";
const llms = readFileSync("public/llms.txt", "utf8").trim();
const content = readFileSync("proposal/content.ts", "utf8");
const blok = content.slice(content.indexOf("export const faqs"), content.indexOf("];", content.indexOf("export const faqs")));
const vragen = [...blok.matchAll(/question:\s*"([^"]+)",\s*answer:\s*"([^"]+)"/g)].map(([, v, a]) => `V: ${v}\nA: ${a}`);
if (vragen.length < 5) throw new Error(`Te weinig veelgestelde vragen gevonden (${vragen.length}); controleer proposal/content.ts.`);
const vast = `## Team, partners en verhaal
- Oprichter en CEO: Marinus Bergsma. Begon als grafisch vormgever (2019), werkte voor onder meer AZ en Supperclub, richtte SocialNow op in november 2021.
- Met Steef Komen (partner, finance, data en Odoo) zette Marinus VASTIQ op, een waarderingsplatform voor vastgoed. Vanuit VASTIQ ontstond SocialNow OS.
- Attesso (Sid van Kalken) is de betaalpartner: SocialNow en Attesso bouwen dit samen en geven samen live demo's, lezingen en workshops.
- Odoo is een optionele koppeling voor SocialNow OS. Andere ERP-koppelingen, waaronder Salesforce, zijn in ontwikkeling.
- Contact: steef@socialnow.nl of een gesprek plannen via https://socialnow.nl/contact. Een gratis live demo boek je met Marinus en Sid.`;
vragen.unshift(...getBrandFaq("nl").items.map(({ question, answer }) => `V: ${question}\nA: ${answer}`));
const tekst = `${llms}\n\n## Veelgestelde vragen\n\n${vragen.join("\n\n")}\n\n${vast}\n`;
writeFileSync("worker/kennis.txt", tekst);
console.log(`worker/kennis.txt: ${vragen.length} vragen, ${tekst.length} tekens`);
