#!/usr/bin/env node
// Proef: partnerlogo's in de homepage-hero. 4 november 2026 (Marinus, bij een schermafdruk van de lege ruimte onder de knoppen):
// "Hier moeten weer de shopify logo's etc komen." Odoo, Shopify, Salesforce en Adobe staan onder de knoppen van de hero.
// Gebruik: node scripts/check-hero-partnerlogos.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const home = fs.readFileSync("proposal/HomeEnthousiast.tsx", "utf8");
const hero = home.slice(home.indexOf('className="sn-alg sn-blij"'), home.indexOf("<WebsiteCTA />"));
eis(hero.includes("<PartnerLogos"), "homepage-hero toont de partnerlogo's");
eis(hero.indexOf("<PartnerLogos") > hero.indexOf("sn-alg-acties"), "logo's staan onder de knoppen");
const kop = fs.readFileSync("proposal/HeaderAlgemeen.tsx", "utf8");
for (const n of ["odoo", "shopify", "salesforce", "adobe"]) {
  eis(kop.includes(`/images/partners/samen/${n}.svg`) && fs.existsSync(`public/images/partners/samen/${n}.svg`), `logo ${n} bestaat en zit in de lijst`);
}
if (process.argv.includes("--dist")) {
  const nl = fs.readFileSync("dist/nl/index.html", "utf8");
  eis(/class="sn-alg-keur"[^]*shopify\.svg/.test(nl), "gebouwde nl-homepage heeft de Shopify-logo in de hero");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
