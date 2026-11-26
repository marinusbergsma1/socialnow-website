#!/usr/bin/env node
// Proef, Black Friday campagne 26 nov 2026 (briefing 07_MARKETING/BLACK-FRIDAY-20261126/BRIEF.md): menu-item en blokken
// "Website-actie" worden "Black Friday Deal", boven de homepage-video een switch Explainer | Black Friday Deal (deal = 4:5 op
// desktop, 9:16 op mobiel, thumbnail als poster, placeholder zolang de film er niet is), alle talen. Rood op main, groen op de tak.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const menu = lees("proposal/Producten.tsx"), home = lees("proposal/HomeEnthousiast.tsx"), gratis = lees("proposal/GratisWebsite.tsx");
const kop = lees("proposal/HeaderAlgemeen.tsx"), css = lees("proposal/header-algemeen.css");
const team = lees("components/Team.tsx") + lees("components/TeamPage.tsx");

eis(/<span>Black Friday Deal<\/span>/.test(menu.slice(menu.indexOf("export function SecurityLink"))) && !/<span>Website-actie<\/span>/.test(menu), "menu-item heet Black Friday Deal");
eis(!/>Website-actie</.test(home) && (home.match(/Black Friday Deal/g) || []).length >= 2, "homepageknop en band heten Black Friday Deal");
eis(!/<i \/>Website-actie</.test(gratis) && /<i \/>Black Friday Deal</.test(gratis), "label op /gratis-website is Black Friday Deal");
eis(!/5 JAAR/.test(team), "geen 5 JAAR SOCIALNOW-actie meer in de oude teamcode");
eis(/role="group"[^>]*aria-label="Kies een video"/.test(kop) && /aria-pressed=\{modus === "explainer"\}/.test(kop) && /aria-pressed=\{modus === "deal"\}/.test(kop), "switch Explainer | Black Friday Deal boven de video");
eis(/<\/?div className="sn-alg-switch"[\s\S]{0,1200}<figure/.test(kop), "switch staat boven het videokader");
eis(/DEAL_FILM_5X4/.test(kop) && /DEAL_FILM_9X16/.test(kop) && /DEAL_POSTER/.test(kop), "deal heeft een 5:4-film, een plek voor 9:16 en een poster");
// 27 nov: de goedgekeurde NL-film (5:4) staat erin, webversie met faststart, poster klein.
const FILM_BF = "public/video/black-friday/socialnow-black-friday-5x4-nl.mp4", POSTER_BF = "public/video/black-friday/socialnow-black-friday-5x4-nl-thumb.jpg";
eis(/const DEAL_FILM_5X4(?:: string)? = "\/video\/black-friday\/socialnow-black-friday-5x4-nl\.mp4"/.test(kop) && fs.existsSync(FILM_BF) && fs.statSync(FILM_BF).size < 12_000_000, "dealfilm NL 5:4 staat in public/ en is kleiner dan 12 MB");
eis(fs.existsSync(FILM_BF) && fs.readFileSync(FILM_BF).subarray(0, 64).includes("moov"), "dealfilm heeft faststart (moov vooraan)");
eis(/const DEAL_POSTER = "\/video\/black-friday\/socialnow-black-friday-5x4-nl-thumb\.jpg"/.test(kop) && fs.existsSync(POSTER_BF) && fs.statSync(POSTER_BF).size < 250_000, "poster staat in public/ en is kleiner dan 250 KB");
eis(/\[data-staand="true"\]\{aspect-ratio:9\/16\}/.test(css) && !/\[data-dealfilm="true"\]\{aspect-ratio:9\/16\}/.test(css), "een liggende film krijgt op mobiel geen 9:16-kader");
eis(/max-width:700px/.test(kop) && /DEAL_FILM_9X16/.test(kop), "op mobiel speelt de 9:16-versie");
eis(/sn-alg-deal-wacht/.test(kop) && /sn-alg-deal-wacht/.test(css), "placeholder zolang de Black Friday-film er niet is");
eis(/#black-friday/.test(kop), "een link naar #black-friday opent direct de deal");
eis(/\.sn-alg-switch\{/.test(css) && /\.sn-alg-foto\[data-modus="deal"\]/.test(css), "stijl voor de switch en het dealkader");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
eis(!/€/.test(kop) && !/€/.test(lees("../../../../../07_MARKETING/BLACK-FRIDAY-20261126/copy/DEAL-EN-PITCH.md")), "geen prijzen in de deal");

// 27 nov (Marinus): "Graag de thumbnail video gebruiken die ik heb gestuurd. Kies hier een mooi stukje uit en maak er een loop van."
const LOOP_BF = "public/video/black-friday/socialnow-black-friday-loop.mp4";
eis(/const DEAL_LOOP = "\/video\/black-friday\/socialnow-black-friday-loop\.mp4"/.test(kop) && fs.existsSync(LOOP_BF) && fs.statSync(LOOP_BF).size < 2_000_000, "bewegend startbeeld: loop uit de gestuurde video, kleiner dan 2 MB");
eis(/className="sn-alg-dealloop"[^>]*muted loop playsInline/.test(kop) && /!dealGestart && <video className="sn-alg-dealloop"/.test(kop), "loop speelt stil en verdwijnt zodra de film start");
eis(/className="sn-alg-dealloop" src=\{draait \? DEAL_LOOP : undefined\}/.test(kop), "bij reduced motion geen bewegend startbeeld");
const NIEUW = ["Black Friday Deal", "Kies een video", "Explainer", "Bekijk de Black Friday-film", "Claim de Black Friday Deal",
  "Je nieuwe website, gratis gemaakt", "De Black Friday-film komt eraan. Claim de deal alvast hieronder.", "Black Friday Deal: dit is de deal"];
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  let w = {}; try { w = JSON.parse(lees(`proposal/i18n/${taal}.json`)); } catch {}
  const mist = NIEUW.filter((s) => !w[s]);
  eis(!mist.length, `${taal}: alle nieuwe teksten vertaald${mist.length ? ` (mist: ${mist.join(" | ")})` : ""}`);
}
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
