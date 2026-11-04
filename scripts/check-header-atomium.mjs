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
const header = kop.slice(kop.indexOf("export default function HeaderAlgemeen"));
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

// Het Odoo-blok en de voorbeelden onder het team mochten later die dag weer weg: "Deze weg".
eis(!kop.includes("export function OdooPartners"), "geen apart Odoo-blok met standfoto meer");
// "Dit uit de footer en hier meer een geheel." en "Met kleur". Groei en cybersecurity staat weer onder de oude header, nu op /het-os.
const footer = lees("proposal/BrandFooter.tsx");
eis(!footer.includes("<SamenEnVeilig"), "Groei en cybersecurity staat niet meer in de footer");
const erkend = footer.slice(footer.indexOf('className="h-footer-erkend"'), footer.indexOf("</div>\n          </div>", footer.indexOf('className="h-footer-erkend"')));
eis(["Odoo Silver Partner", "Shopify Partners", "Salesforce-partner", "Adobe-partner"].every((n) => erkend.includes(`alt="${n}"`)) && !erkend.includes("h-footer-erkend-partners"), "footer: één rij met de partnerlogo's");
// Over Google, Meta en Google Developers in die rij: "Deze mogen weg".
eis(!/google-logo|meta-logo|Google Developers/.test(erkend), "footer: geen Google, Meta en Google Developers meer");
const tech = lees("proposal/concept-tech.css");
eis(!/\.h-footer-erkend img \{[^}]*filter/.test(tech) && !/\.h-footer-erkend > div \{[^}]*opacity/.test(tech) , "footer: logo's in kleur, niet gedimd");

// "ik wil alleen niet af van de stippenachtergrond." De header en het Odoo-blok tekenen geen eigen dicht vlak over het stippenraster.
const css = lees("proposal/header-algemeen.css");
const basis = (css.match(/\.sn-alg\{[^}]*\}/) || [""])[0];
eis(/background:\s*transparent/.test(basis) && !/background:\s*#0{3,6}\b/.test(basis), "stippenachtergrond blijft zichtbaar: .sn-alg heeft geen eigen zwarte achtergrond");

const pages = lees("proposal/pages.tsx");
const home = pages.slice(pages.indexOf("export function Home()"));
// Over Wat we bereikten: "Deze mag weg."
eis(!home.includes("<Bereikt") && !pages.includes('import("./Bereikt")'), "homepage: geen blok Wat we bereikten meer");
const plek = ["<HeaderAlgemeen", "<ConnectExperts"].map((v) => home.indexOf(v));
eis(plek.every((p) => p >= 0) && plek[0] < plek[1] && !home.includes("<OdooPartners"), "homepage: header, dan meteen het team, geen Odoo-blok");

// "Deze onderdelen bedoel ik meer die mag anders wel op de productenpagina oid." De oude header met OS, Connect en partners.
const paginas = lees("proposal/paginas.tsx");
const osPagina = paginas.slice(paginas.indexOf("export function OsPage"), paginas.indexOf("export function", paginas.indexOf("export function OsPage") + 10));
eis(!home.includes("<HeaderBestaand") && osPagina.includes("<HeaderBestaand"), "oude header met OS en Connect staat op /het-os, niet meer op de homepage");

eis(osPagina.indexOf("<SamenEnVeilig") > osPagina.indexOf("<HeaderBestaand"), "Groei en cybersecurity staat op /het-os onder de oude header");
// "Vanuit onder de websites zelf mag er meer content komen vanuit de branding en voorbeelden." en "Net als hier maar kortere titels."
const naWeb = home.slice(home.indexOf("<FreeWebsite"));
eis(["<ImageSliders kort", "<VideoSlider kort", "<ShowcaseFilms"].every((k) => naWeb.includes(k)), "homepage: onder de websites recent werk, video en See it in motion");
const sliders = lees("proposal/MediaSliders.tsx");
eis(sliders.includes("kort ? <>Branding en campagnes.</>") && sliders.includes("kort ? <>Video en motion.</>"), "homepage-rijen hebben korte koppen");
// "Hier dezelfde logo's als ook op de main page." De logostrook op /projecten gebruikt de Trusted by-merken uit de header.
const ui = lees("proposal/ui.tsx");
const strook = ui.slice(ui.indexOf("export function ClientLogos"), ui.indexOf("export function Questions"));
eis(strook.includes("[...DIRECT, CRAFTURE, ...VIA_CRAFTURE]") && !strook.includes("logos.map"), "logostrook op /projecten: dezelfde merken als Trusted by op de homepage");

const cx = lees("proposal/ConnectExperts.tsx");
eis(!cx.includes("<details") && !cx.includes("NieuwHier"), "Connect: het team staat meteen open, geen uitklapper en geen Nieuw hier");
eis(cx.indexOf('className="cx-org"') > 0 && !cx.includes("cx-voorbeelden") && !cx.includes("VOORBEELDEN"), "Connect: geen rij voorbeelden meer na het team");
// "Deze knoppen wil ik ook met die filling en met die style zoals die": de knop Inloggen gratis OS (sn-pill).
const acties = header.slice(header.indexOf('className="sn-alg-acties"'), header.indexOf("</div>", header.indexOf('className="sn-alg-acties"')));
eis((acties.match(/className="sn-pill"/g) || []).length === 2 && !acties.includes("sn-alg-knop"), "headerknoppen hebben dezelfde stijl als Inloggen gratis OS (sn-pill)");

const nieuw = [...STAPPEN, "Een betrouwbare partner voor groei en cybersecurity", "Start met een gratis websitedemo", "Ons team bij het Atomium in Brussel", "Wij helpen je met management, operations en Odoo.", "Salesforce-partner", "Partners en specialiteiten", "Branding en campagnes.", "Video en motion."];
for (const l of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(lees(`proposal/i18n/${l}.json`) || "{}");
  const mist = nieuw.filter((k) => !w[k] || /[–—]/.test(w[k]));
  eis(!mist.length, `nieuwe teksten vertaald zonder gedachtestreepjes (${l})${mist.length ? ": mist " + mist.slice(0, 3).join(", ") : ""}`);
}

if (process.argv.includes("--dist")) {
  const nl = lees("dist/nl/index.html");
  eis(nl.includes("team-atomium.webp") && nl.includes("Systemen en operations"), "gebouwde nl-homepage: Atomium-beeld en de vier stappen");
  eis(!nl.includes('id="groei"') && !nl.includes("odoo-experience-stand") && !nl.includes("cx-voorbeelden") && nl.includes("h-image-showcase") && !nl.includes('id="bereikt"'), "gebouwde nl-homepage: geen Groei-blok in de footer, geen Odoo-blok, wel branding en video onder de websites");
  const os = lees("dist/nl/het-os/index.html");
  eis(os.includes("sn-bestaand") && os.includes('id="groei"') && !nl.includes("sn-bestaand"), "gebouwde /het-os toont de oude header met Groei en cybersecurity, de homepage niet");
  const en = lees("dist/index.html");
  eis(en.includes("Systems and operations") && en.includes("We help you with management, operations and Odoo."), "gebouwde en-homepage is vertaald");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
