#!/usr/bin/env node
// Proef, Marinus 6 nov 2026: "Haal ook na de standaard OS de rest van de pakketten en prijzen weg dat is allemaal op aanvraag en
// custom namelijk. Maak die pagina mooi zakelijk en stijlvol." en "Verder de groene glow weg bij website-actie en het SocialNow
// 5 YEARS logo inzetten."
// Gebruik: node scripts/check-prijzen-op-aanvraag.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const pricing = fs.readFileSync("proposal/Pricing.tsx", "utf8");
const render = pricing.slice(pricing.indexOf("export default function Pricing"));
const menu = fs.readFileSync("proposal/Producten.tsx", "utf8");
const nav = fs.readFileSync("proposal/hoofdmenu.css", "utf8");
const header = fs.readFileSync("proposal/WebsiteProposal.tsx", "utf8");
const faq = fs.readFileSync("proposal/brand-faq.ts", "utf8");
const llms = fs.readFileSync("public/llms.txt", "utf8");

eis(!/pakketten=\{(OS|CONNECT)\}|<Vergelijk|LOS\.map/.test(render), "dienstenpagina toont geen Business/Enterprise, Connect-pakketten, vergelijking of losse prijzen");
eis(/GRATIS = OS\[0\]/.test(pricing) && render.includes('id="prijs-os-titel"'), "alleen het gratis OS met prijs");
eis(/const OP_MAAT = \[/.test(pricing) && ["cybersecurity", "erp-crm", "growth"].every(id => pricing.includes(`id: "${id}"`)) && render.includes("Op aanvraag"), "op maat: Cybersecurity, ERP & CRM en Growth, op aanvraag");
const opMaat = pricing.slice(pricing.indexOf("const OP_MAAT"), pricing.indexOf("];", pricing.indexOf("const OP_MAAT")));
eis(!/€/.test(opMaat), "geen bedragen in de onderdelen op maat");
eis(!/OS-pakketten|Connect-pakketten|Liever één ding|vaste prijs vooraf/.test(menu.slice(menu.indexOf("export const DIENSTEN"), menu.indexOf("] as const", menu.indexOf("export const DIENSTEN")))), "dienstenmenu zonder pakketten en vaste prijzen");
eis(!/€35|€65|35 €|65 €/.test(faq), "FAQ noemt geen Business- en Enterprise-prijzen meer");
eis(!/Business €35|Enterprise €65|Start €3\.000|€2\.000 tot €5\.000|vanaf €10\.000/.test(llms), "llms.txt noemt geen pakketprijzen meer");
const security = nav.match(/a\.h-security>span,[^{]*\{([^}]*)\}/g)?.join("") ?? "";
eis(security.length > 0 && !/sn-glans|#25d366/.test(security), "Website-actie zonder groene glans");
// 6 nov (later): het CSS-label is vervangen door het echte 5 YEARS-logo uit de film (proposal/Logo5Jaar.tsx, scripts/proef-5years-logo-intro.mjs).
eis(/<Logo5Jaar /.test(header) && /alt="SocialNow 5 YEARS"/.test(fs.readFileSync("proposal/Logo5Jaar.tsx", "utf8")), "SocialNow-logo met wit 5 YEARS-label");
for (const l of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${l}.json`, "utf8"));
  eis(["De rest bouwen we rond jouw bedrijf.", "Op aanvraag", "Connect op maat", "Gratis OS"].every(k => w[k]), `nieuwe teksten vertaald (${l})`);
}
if (process.argv.includes("--dist")) {
  for (const [pad, taal] of [["dist/nl/diensten/index.html", "nl"], ["dist/diensten/index.html", "en"], ["dist/de/diensten/index.html", "de"]]) {
    if (!fs.existsSync(pad)) { eis(false, `${pad} bestaat`); continue; }
    const html = fs.readFileSync(pad, "utf8");
    const s = html.indexOf('id="prijzen"'), blok = s < 0 ? "" : html.slice(s, html.indexOf("prijs-btw", s));
    eis(blok.includes("prijs-maat-lijst") && !/€35|€65|€3\.000|€4\.000|€2\.000|€10\.000/.test(blok), `${taal}: gebouwde dienstenpagina zonder pakketprijzen, met onderdelen op maat`);
    eis(html.includes("5 YEARS"), `${taal}: 5 YEARS-label in de header`);
  }
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
