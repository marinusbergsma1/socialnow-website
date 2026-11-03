#!/usr/bin/env node
// Proef: homepage als landingspagina, Marinus 3 november 2026: grote titel en de video; partners en Odoo-hulp met beelden van de
// Odoo Experience; stap 1 websites (gratis updates, demo's); stap 2 een eigen management- en operationsysteem op basis van je data,
// veilig en lokaal, met Gijsbert (eerst), Douwe en Steef plus een animatie; stap 3 persoonlijke hulp in dat systeem (OS-laag en
// Connect); dan aanmelden of de onboarding. "Echt meer een landingspagina gefocust op conversie." De oude homepage blijft als
// landingspagina voor het OS en de Connect-laag op /os-connect.
// Gebruik: node scripts/proef-homepage-landing.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = f => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");

const pages = lees("proposal/pages.tsx");
const home = pages.slice(pages.lastIndexOf("export function Home()"));
const land = lees("proposal/HomeLanding.tsx");
eis(home.includes("<HomeLanding") && !home.includes("<HeaderBestaand"), "de homepage is de nieuwe landingspagina");
const oud = pages.slice(pages.indexOf("export function OsConnectLanding()"), pages.lastIndexOf("export function Home()"));
eis(pages.includes("export function OsConnectLanding()") && oud.includes("<HeaderBestaand") && oud.includes("<ConnectExperts"), "de vorige homepage bestaat nog als OsConnectLanding");
eis(lees("proposal/WebsiteProposal.tsx").includes('<Route path="/os-connect" element={<OsConnectLanding />} />'), "/os-connect toont de vorige homepage");

const volgorde = ['id="home"', 'id="partners"', 'id="stap-website"', 'id="stap-systeem"', 'id="stap-hulp"', 'id="aanmelden"'];
const plekken = volgorde.map(v => land.indexOf(v));
eis(plekken.every(p => p >= 0) && plekken.every((p, i) => i === 0 || p > plekken[i - 1]), `volgorde: ${volgorde.join(" → ")}`);
const hero = land.slice(plekken[0], plekken[1]);
eis(hero.includes("<h1>") && hero.includes("<ExplainerPlayer") && !hero.includes("<Downloads") && !hero.includes("MiloMotion"), "hero: alleen grote titel, knoppen en de video");

const films = [...land.matchAll(/src: "(\/video\/odoo-experience\/[^"]+\.mp4)"/g)].map(m => m[1]);
eis(films.length >= 3 && films.every(f => fs.existsSync(`public${f}`)), `drie of meer Odoo Experience-films die bestaan (${films.length})`);
eis(["Indexworld", "Uncanny", "Komen Consultancy", "Attesso"].every(n => land.includes(`naam: "${n}"`)) && land.includes("Odoo"), "partners met hun Odoo-rol");

const site = land.slice(plekken[2], plekken[3]);
eis(site.includes("<WebsiteExamples") && /gratis updates/i.test(site) && /demo/i.test(site), "stap 1: websites met gratis updates en demo's");
const systeem = land.slice(plekken[3], plekken[4]);
const experts = land.slice(land.indexOf("const EXPERTS"), land.indexOf("];", land.indexOf("const EXPERTS")));
const volgorde2 = ["Gijsbert Westeneng", "Douwe Kramer", "Steef Komen"].map(n => experts.indexOf(n));
eis(volgorde2.every(p => p >= 0) && volgorde2[0] < volgorde2[1] && volgorde2[1] < volgorde2[2], "stap 2: Gijsbert eerst, dan Douwe en Steef");
eis(systeem.includes("<DataScene") && land.includes("<canvas") && /veilig en lokaal/.test(systeem), "stap 2: animatie, eigen systeem op basis van je data, veilig en lokaal");
const hulp = land.slice(plekken[4], plekken[5]);
eis(hulp.includes("SocialNow-OS-Logo") && hulp.includes("socialnow-connect.png") && hulp.includes("CONNECT"), "stap 3: hulp op maat met de OS-laag en Connect");
const slot = land.slice(plekken[5]);
eis(slot.includes("AANMELDEN_URL") && slot.includes("ONBOARDING_URL") && /Meld je aan/.test(slot) && /onboarding/.test(slot), "slot: aanmelden of de onboarding invullen");
eis((land.match(/<Knoppen/g) || []).length >= 4, "conversie: na de hero en na elke stap de aanmeldknop");

// Nooit letters tegen elkaar en een titel van hooguit twee regels (vaste regels van Marinus).
const css = lees("proposal/home-landing.css");
eis(css.length > 0 && !/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");

const nieuw = [...new Set([...land.matchAll(/(?:kop|tekst|label|onderschrift|rol)[=:] ?"([^"]*[a-z][^"]*\.)"/g)].map(m => m[1]))];
const talen = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const mist = talen.flatMap(t => { const d = JSON.parse(lees(`proposal/i18n/${t}.json`) || "{}"); return nieuw.filter(z => !(z in d)).map(z => `${t}: ${z}`); });
eis(nieuw.length > 5 && mist.length === 0, `nieuwe zinnen vertaald in ${talen.length} talen${mist.length ? ` (mist: ${mist.slice(0, 3).join(" | ")})` : ""}`);

if (process.argv.includes("--dist")) {
  const nl = lees("dist/nl/index.html").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  eis(nl.includes('id="stap-systeem"') && nl.includes("Gebouwd met Odoo-partners.") && nl.includes("Begin vandaag."), "gebouwde nl-homepage is de landingspagina");
  const en = lees("dist/index.html").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  eis(en.includes("Built with Odoo partners.") && en.includes("Start today."), "gebouwde Engelse homepage is vertaald");
  eis(fs.existsSync("dist/nl/os-connect/index.html") && lees("dist/nl/os-connect/index.html").includes("Twee producten"), "gebouwde /nl/os-connect is de vorige homepage");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
