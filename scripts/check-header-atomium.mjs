#!/usr/bin/env node
// Proef: homepage van Marinus, 4 november 2026.
// "Deze als main image en hier stappen maken met website and branding, systems and operations, marketing and sales en dan finance
// als de stappen en daaronder het team gewoon gelijk bij connect" en "Verder na het team de websites en branding en content
// voorbeelden en dan bij read more bij odoo partners eronder de focus leggen op het blok wat nu in de footer is." en over de header
// met standfoto: "De huidige header mag naar een andere plek."
// Gebruik: node scripts/check-header-atomium.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");

const kop = lees("proposal/HeaderAlgemeen.tsx");
const header = kop.slice(kop.indexOf("export default function HeaderAlgemeen"), kop.indexOf("export function OdooPartners"));
const odoo = kop.slice(kop.indexOf("export function OdooPartners"));
const STAPPEN = ["Website en branding", "Systemen en operations", "Marketing en sales", "Finance"];
eis(header.includes("/images/verhaal/team-atomium.webp"), "header: het team bij het Atomium is het hoofdbeeld");
const stappen = kop.match(/const STAPPEN = \[([^\]]*)\]/);
eis(!!stappen && JSON.stringify(stappen[1].split(",").map((s) => s.trim().replace(/"/g, ""))) === JSON.stringify(STAPPEN) && header.includes("STAPPEN.map"), `header: vier stappen ${STAPPEN.join(", ")}`);
eis(!header.includes("odoo-experience-stand") && !header.includes("PARTNERS"), "header: geen standfoto en geen partnerkaart meer");
eis(header.includes("Bekijk de video") && header.includes("trusted by"), "header: Bekijk de video en de Trusted by-balk blijven");
// "Ik wil dat het écht duidelijk is gelijk BAM Ze kunnen mij helpen met management en operations en Odoo." en "Haal anders
// Indexworld en Uncanny maar weg en zet alleen de logo's van samenwerking eronder."
eis(header.includes("Wij helpen je met management, operations en Odoo.") && header.indexOf("management, operations en Odoo") < header.indexOf("STAPPEN.map"), "header: meteen onder de titel dat we helpen met management, operations en Odoo");
eis(["Odoo Silver Partner", "Shopify Partners", "Salesforce-partner", "Adobe-partner"].every((n) => kop.includes(`naam: "${n}"`)) && header.includes("KEURMERKEN.map") && header.indexOf("KEURMERKEN.map") < header.indexOf("STAPPEN.map"), "header: logo's van Odoo Silver, Shopify, Salesforce en Adobe onder de titel");
eis(!/(indexworld|uncanny)[^"]*\.(png|svg|webp)/i.test(kop), "Indexworld en Uncanny staan niet meer in de header of het Odoo-blok");

eis(odoo.includes("odoo-experience-stand") && /href="#groei"/.test(odoo) && odoo.includes("Lees meer"), "Odoo als eigen blok met standfoto en Lees meer naar #groei");
eis(/<section className="sn-samen" id="groei"/.test(lees("proposal/SamenEnVeilig.tsx")) && lees("proposal/BrandFooter.tsx").includes("<SamenEnVeilig"), "Groei en cybersecurity staat in de footer met anker #groei");

const pages = lees("proposal/pages.tsx");
const home = pages.slice(pages.indexOf("export function Home()"));
const plek = ["<HeaderAlgemeen", "<ConnectExperts", "<OdooPartners"].map((v) => home.indexOf(v));
eis(plek.every((p) => p >= 0) && plek[0] < plek[1] && plek[1] < plek[2], "homepage: header, dan het team, dan de Odoo-partners");

// "Deze onderdelen bedoel ik meer die mag anders wel op de productenpagina oid." De oude header met OS, Connect en partners.
const paginas = lees("proposal/paginas.tsx");
const osPagina = paginas.slice(paginas.indexOf("export function OsPage"), paginas.indexOf("export function", paginas.indexOf("export function OsPage") + 10));
eis(!home.includes("<HeaderBestaand") && osPagina.includes("<HeaderBestaand"), "oude header met OS en Connect staat op /het-os, niet meer op de homepage");

const cx = lees("proposal/ConnectExperts.tsx");
eis(!cx.includes("<details") && !cx.includes("NieuwHier"), "Connect: het team staat meteen open, geen uitklapper en geen Nieuw hier");
eis(cx.indexOf('className="cx-org"') > 0 && cx.indexOf("cx-voorbeelden") > cx.indexOf('className="cx-org"'), "Connect: na het team de voorbeelden van websites, branding en content");

const nieuw = [...STAPPEN, "Een betrouwbare partner voor groei en cybersecurity", "Start met een gratis websitedemo", "Ons team bij het Atomium in Brussel", "Odoo en ander ERP, met sterke partners", "Wij helpen je met management, operations en Odoo.", "Salesforce-partner", "Lees meer", "Websites, branding en content", "Bekijk voorbeelden"];
for (const l of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(lees(`proposal/i18n/${l}.json`) || "{}");
  const mist = nieuw.filter((k) => !w[k] || /[–—]/.test(w[k]));
  eis(!mist.length, `nieuwe teksten vertaald zonder gedachtestreepjes (${l})${mist.length ? ": mist " + mist.slice(0, 3).join(", ") : ""}`);
}

if (process.argv.includes("--dist")) {
  const nl = lees("dist/nl/index.html");
  eis(nl.includes("team-atomium.webp") && nl.includes("Systemen en operations"), "gebouwde nl-homepage: Atomium-beeld en de vier stappen");
  eis(nl.includes('href="#groei"') && nl.includes('id="groei"'), "gebouwde nl-homepage: Lees meer en het anker in de footer");
  const os = lees("dist/nl/het-os/index.html");
  eis(os.includes("sn-bestaand") && !nl.includes("sn-bestaand"), "gebouwde /het-os toont de oude header, de homepage niet");
  const en = lees("dist/index.html");
  eis(en.includes("Systems and operations") && en.includes("We help you with management, operations and Odoo."), "gebouwde en-homepage is vertaald");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
