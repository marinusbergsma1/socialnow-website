#!/usr/bin/env node
// Proef: blok "Samen bouwen" op de homepage (Marinus 19 okt 2026): bij Indexworld en Uncanny hun eigen partnerbalk
// en waarom ze een waardevolle toevoeging zijn, in alle 10 talen, en zo in de gebouwde pagina's van nl en en.
// Gebruik: node scripts/check-partners-samen.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const KOP_IW = "Boekhouding en ERP, nagekeken door accountants.", KOP_UN = "Webshop, CRM en ERP echt aan elkaar gekoppeld.";
const BALK = { Indexworld: ["claude.png", "odoo-partner.webp", "sage.svg", "quickbooks.webp"], Uncanny: ["odoo.svg", "shopify.svg", "salesforce.svg", "adobe.svg"] };
const CIJFERS = ["150+ klanten", "3 continenten", "135+ klanten", "250+ projecten", "60+ tech-experts"];
const EN = { [KOP_IW]: "Accounting and ERP, checked by accountants.", [KOP_UN]: "Webshop, CRM and ERP truly connected." };
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const src = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8");
eis(src.includes(KOP_IW) && src.includes(KOP_UN), "beide partners hebben een kop over waarom ze erbij horen");
eis(CIJFERS.every(c => src.includes(`"${c}"`)), "cijfers van hun eigen site staan erbij");
for (const [naam, logos] of Object.entries(BALK)) {
  const blok = src.slice(src.indexOf(`naam: "${naam}"`), src.indexOf("],", src.indexOf("partners: [", src.indexOf(`naam: "${naam}"`))));
  eis(src.includes(`naam: "${naam}"`) && logos.every(l => blok.includes(`/images/partners/samen/${l}`)), `${naam}: partnerbalk met ${logos.join(", ")}`);
}
eis(Object.values(BALK).flat().every(l => fs.existsSync(`public/images/partners/samen/${l}`)), "alle logobestanden bestaan");
eis(src.includes(`className="sn-samen-balk"`) && fs.readFileSync("proposal/samen-en-veilig.css", "utf8").includes(".sn-samen-balk{"), "balk heeft eigen opmaak");
for (const t of TALEN) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  const ok = [KOP_IW, KOP_UN, ...CIJFERS].every(k => typeof w[k] === "string" && w[k].trim() && w[k] !== k);
  eis(ok && (t !== "en" || Object.entries(EN).every(([k, v]) => w[k] === v)), `${t}: koppen en cijfers vertaald`);
}
if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");  // de titelpunt is een eigen span
  const nl = tekst("dist/nl/index.html"), en = tekst("dist/index.html");
  eis([KOP_IW, KOP_UN].every(k => nl.includes(k)), "gebouwde nl-pagina toont beide koppen");
  eis(Object.values(EN).every(k => en.includes(k)), "gebouwde en-pagina toont beide Engelse koppen");
  eis(Object.values(BALK).flat().every(l => en.includes(`/images/partners/samen/${l}`)), "gebouwde en-pagina toont alle partnerlogo's");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
