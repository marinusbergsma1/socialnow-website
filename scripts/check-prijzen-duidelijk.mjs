#!/usr/bin/env node
// Proef: de prijzen zeggen overal hetzelfde, in één oogopslag (Marinus 22 okt 2026). De hero zei "Free up to 10 GB of storage.",
// dat vond hij verwarrend: het moet over de teamgrootte gaan. Gratis is jij plus 2 teamleden (header #157, gelijk aan "Nodig 2
// mensen uit"). Per pakket: prijs, voor wie (teamgrootte) en de belangrijkste grens. Gratis jij en 2 teamleden, Business €35
// tot 5 personen, Enterprise €65 tot 10 (jaarprijzen);
// Connect per maand, minimaal 3 maanden. Hero, prijskaarten op /diensten, slotblok, /het-os, FAQ en llms.txt, in alle talen.
// Gebruik: node scripts/check-prijzen-duidelijk.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (pad) => fs.readFileSync(pad, "utf8");

const hero = lees("proposal/HeaderBestaand.tsx");
eis(hero.includes("<strong>Gratis voor jou en 2 teamleden.</strong>"), "hero: Gratis voor jou en 2 teamleden.");
eis(!hero.includes("Gratis tot 10 GB aan opslag."), "hero: de opslagregel is weg");
eis(lees("proposal/HomeHeader.tsx").includes("<strong>Gratis voor jou en 2 teamleden.</strong>"), "hero variant A (/nl/?ab=a): dezelfde regel");

const prijs = lees("proposal/Pricing.tsx");
const os = prijs.slice(prijs.indexOf("const OS: Pakket[]"), prijs.indexOf("const GRATIS_USPS"));
const eerstePunt = (id) => { const blok = os.slice(os.indexOf(`id: "${id}"`)); return (blok.match(/punten: \[\s*\{ tekst: "([^"]+)"/) || [])[1]; };
eis(eerstePunt("gratis") === "Jij en 2 teamleden", `kaart Gratis begint met de teamgrootte (${eerstePunt("gratis")})`);
eis(eerstePunt("business") === "Teams tot 5 personen", `kaart Business begint met de teamgrootte (${eerstePunt("business")})`);
eis(eerstePunt("enterprise") === "Teams tot 10 personen", `kaart Enterprise begint met de teamgrootte (${eerstePunt("enterprise")})`);
eis(!/Nodig 2 mensen uit|medewerkers/.test(os), "geen 'Nodig 2 mensen uit' of 'medewerkers' meer op de OS-kaarten");
eis(!os.includes('"per maand, jaarlijks"') && (os.match(/per: "per maand bij jaarabonnement"/g) || []).length === 2, "Business en Enterprise: per maand bij jaarabonnement");
eis(os.includes('per: "voor altijd"'), "Gratis: €0 voor altijd");
const connect = prijs.slice(prijs.indexOf("export const CONNECT"), prijs.indexOf("function Team("));
eis((connect.match(/per: "per maand, minimaal 3 maanden"/g) || []).length === 4, "Connect: alle vier per maand, minimaal 3 maanden");
eis(!prijs.includes("label=\"02 / Connect-pakketten · per periode"), "Connect-label zegt niet meer 'per periode van 3 maanden' (leek een prijs per periode)");

const ui = lees("proposal/ui.tsx");
const slot = ui.slice(ui.indexOf("if (compact)"), ui.indexOf("</section>;", ui.indexOf("if (compact)")));
eis(slot.includes('"Jij en 2 teamleden"') && !slot.includes("Nodig 2 mensen uit"), "slotblok: Jij en 2 teamleden");

const start = lees("proposal/ProductStart.tsx");
eis(start.includes("<strong>GRATIS voor jou en 2 teamleden</strong>") && !start.includes("GRATIS tot 10 GB opslag"), "/het-os: GRATIS voor jou en 2 teamleden");

const faq = lees("proposal/brand-faq.ts");
const antwoorden = [...faq.matchAll(/id: "free-os", question: "[^"]+", answer: "([^"]+)"/g)].map((m) => m[1]);
eis(antwoorden.length === 10, `FAQ 'wat kost het OS' in 10 talen (${antwoorden.length})`);
eis(antwoorden[0]?.includes("gratis voor jou en 2 teamleden") && antwoorden[0]?.includes("tot 5 personen") && antwoorden[0]?.includes("tot 10 personen"), "FAQ NL noemt de teamgrootte per pakket");
eis(antwoorden.every((a) => /\b2\b/.test(a) && /\b5\b/.test(a) && /\b10\b/.test(a) && /35/.test(a) && /65/.test(a)), "FAQ in elke taal: 2 teamleden, 5 en 10 personen, €35 en €65");
eis(!antwoorden.some((a) => /uitnodigen|invite 2|einladen|à inviter|invitar a 2|da invitare|convidar 2|zaproszenie|bjud in|invitér/.test(a)), "FAQ: nergens meer '2 mensen uitnodigen'");

const llms = lees("public/llms.txt");
eis(llms.includes("jou en 2 teamleden") && llms.includes("teams tot 5 personen") && llms.includes("teams tot 10 personen"), "llms.txt: dezelfde teamgroottes");

const NIEUW = [
  "Gratis voor jou en 2 teamleden.", "Jij en 2 teamleden", "Teams tot 5 personen", "Teams tot 10 personen", "voor altijd",
  "per maand bij jaarabonnement", "per maand, minimaal 3 maanden", "02 / Connect-pakketten", "GRATIS voor jou en 2 teamleden",
  "Met 10 GB opslag. Groter team? Kies Business of Enterprise.",
];
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(lees(`proposal/i18n/${taal}.json`));
  const mist = NIEUW.filter((k) => !w[k] || w[k] === k);
  eis(mist.length === 0, `${taal}: nieuwe zinnen vertaald${mist.length ? ` (mist: ${mist.join(" | ")})` : ""}`);
}
// 22 oktober 2026 (Regie): gratis is jij plus 2, dus nergens "teams tot 2 personen" (dat las als 2 in totaal).
const bronnen = ["proposal/HeaderBestaand.tsx", "proposal/HomeHeader.tsx", "proposal/Pricing.tsx", "proposal/ui.tsx", "proposal/ProductStart.tsx", "proposal/brand-faq.ts", "public/llms.txt", "worker/kennis.txt"];
eis(!bronnen.some((f) => /teams tot 2 personen|teams of up to 2/i.test(lees(f))), "nergens 'teams tot 2 personen'");

if (process.argv.includes("--dist")) {
  // De homepage en /diensten worden vooraf als HTML gebouwd (prerender), per taal met de vertaalde tekst.
  const talen = ["nl", "en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
  const woord = (taal) => (taal === "nl" ? {} : JSON.parse(lees(`proposal/i18n/${taal}.json`)));
  const html = (taal, pad) => lees(`dist/${taal === "en" ? "" : taal + "/"}${pad}index.html`).replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&");
  for (const taal of talen) {
    const w = woord(taal), t = (k) => w[k] || k;
    const home = html(taal, ""), diensten = html(taal, "diensten/");
    eis(home.includes(t("Gratis voor jou en 2 teamleden.")) && !home.includes(t("Gratis tot 10 GB aan opslag.")), `${taal}: gebouwde homepage heeft de nieuwe hero-regel en niet de oude`);
    eis(["Jij en 2 teamleden", "Teams tot 5 personen", "Teams tot 10 personen", "per maand bij jaarabonnement", "per maand, minimaal 3 maanden"].every((k) => diensten.includes(t(k))), `${taal}: gebouwde /diensten heeft teamgrootte en looptijd op de kaarten`);
  }
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
