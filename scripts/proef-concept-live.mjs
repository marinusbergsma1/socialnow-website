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
  ["Il Gordo toont de headerfilm", bereikt.includes("/video/ilgordo/ilgordo-header.mp4") && existsSync("public/video/ilgordo/ilgordo-header.mp4")],
  ["één Artist Impression", lac.includes("<VoorNaSchuif impressie={IMPRESSIES[0]} />") && !lac.includes("IMPRESSIES.map")],
  // "Next step en dan alle ERP's en Next talks wil ik graag en dan die logobalk."
  ["hero: NEXT STEP met alle vijf ERP's", /NEXT STEP<\/span>[\s\S]{0,200}INTEGRATIES\.map/.test(lees("proposal/pages.tsx"))],
  ["hero: logobalk heet NEXT TALKS", lees("proposal/pages.tsx").includes('<span className="h-talking-label">NEXT TALKS</span>')],
  // Ronde 3: video's, Attesso, verhaal en wereldkaart.
  ["VDZ toont hun animatie", bereikt.includes("/video/vdz/vdz-animatie.mp4") && existsSync("public/video/vdz/vdz-animatie.mp4")],
  ["Hajenius toont het pand", bereikt.includes("/video/hajenius/hajenius-pand.mp4") && existsSync("public/video/hajenius/hajenius-pand.mp4")],
  ["Odoo Experience: aftermovie in plaats van stippenblok", bereikt.includes("odoo-experience-kort.mp4") && !bereikt.includes("<Aanmeldingen />")],
  ["marketingtegel toont Attesso", nul.includes('className="h-nul-attesso"')],
  ["5 jaar SocialNow, niet Marinus", lees("proposal/Verhaal.tsx").includes("jaar SocialNow in november")],
  ["De omslag niet meer roze", !/wanneer: "De omslag",[\s\S]{0,300}soort: "roze"/.test(lees("proposal/Verhaal.tsx"))],
  ["VASTIQ-hoofdstuk: oude huisfilm en LinkedIn Steef", lees("proposal/Verhaal.tsx").includes("vastiq-inzoom.mp4") && lees("proposal/Verhaal.tsx").includes("steef-komen-60632236")],
  ["wereldkaart: Let's keep the world, creators groen en OS-gebruikers blauw", lees("proposal/WereldKaart.tsx").includes("Let’s keep the world social. Now.") && lees("proposal/wereldkaart.css").includes(".sn-wereld-gebruikers.is-os { stroke: #4f8cff")],
  ["tellers: 356 creators +12 per dag, 1125 OS-gebruikers +215 per dag", /CREATORS_START = 356;[\s\S]*CREATORS_PER_DAG = 12;[\s\S]*OS_GEBRUIKERS_START = 1125;[\s\S]*OS_GEBRUIKERS_PER_DAG = 215;/.test(lees("proposal/tellers.ts"))],
  ["Odoo: volledig geïntegreerd en waarom Odoo (website via onze eigen websitebouwer)", deuren.includes("Volledig geïntegreerd") && deuren.includes("onze eigen websitebouwer")],
  ["wereldkaart zonder boog", !lees("proposal/WereldKaart.tsx").includes("sn-wereld-boog")],
  ["footer: Gecertificeerd & erkend met Google en Meta", lees("proposal/BrandFooter.tsx").includes("h-footer-erkend") && lees("proposal/BrandFooter.tsx").includes("Meta Business Partner")],
  ["slotkop: One operation and management system", lees("proposal/ui.tsx").includes("Not to automate, but to connect.") && lees("proposal/ui.tsx").includes("Human connection, powered by AI technology.")],
  ["hero-knop Plan a talk", lees("proposal/os-entry.tsx").includes(">Plan a talk</a>")],
  ["Vier gezichten met mensen", lees("proposal/pages.tsx").includes("OS_MENSEN")],
  ["AI-laag koppelt de AI die je al gebruikt", lees("proposal/MensEnAI.tsx").includes("h-mens-ai-koppel")],
  ["begeleiding: chat met Steef, dashboard, stappen met Marinus", lees("proposal/TrustStories.tsx").includes("tr-chat") && lees("proposal/TrustStories.tsx").includes("tr-stappen")],
  ["ERP-markt zoals in de header", deuren.includes('kop="ERP-markt integration"') && deuren.includes("INTEGRATIES.map") && !deuren.includes('kop="Salesforce"')],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
