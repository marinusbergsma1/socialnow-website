#!/usr/bin/env node
// Proef (27 okt 2026, Marinus: "Free Website DEMO en Security SCAN is misschien een mooie kop, dan kunnen de PHP-boodschap
// met websitescan en websitedemo nog makkelijker bij elkaar"). Gekozen: menu + gecombineerde pagina.
// Eisen: 1) het menu-item heet "Demo & Scan" (groen schildje, naar /security, in elke taal gelijk);
//        2) /security opent met de kop "Free Website DEMO & Security SCAN." met de punt groen;
//        3) onder de kop twee sprongen: naar de scan (#scan) en naar de websitedemo (#demo);
//        4) /security heeft een websitedemo-blok (#demo) met de websitevoorbeelden en de knop naar website.socialnow.nl;
//        5) één h1 op de pagina (de oude kop "Is je website veilig?" wordt een h2);
//        6) nieuwe zinnen staan in alle woordenboeken;
//        7) op de homepage staat onder de video de zin "Begin met je gratis websitedemo en securityscan." naar /security.
// Gebruik: node scripts/check-demo-en-scan.mjs (rood op main d65eb5f, groen met de wijziging)
import { existsSync, readFileSync } from "node:fs";

const lees = (pad) => (existsSync(pad) ? readFileSync(pad, "utf8") : "");
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };

const menu = lees("proposal/Producten.tsx");
const pagina = lees("proposal/PhpCheck.tsx");
const shell = lees("proposal/WebsiteProposal.tsx");
const zonderCommentaar = pagina.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/^\s*\/\/.*$/gm, "");

eis(/<span translate="no">Demo &amp; Scan<\/span>/.test(menu) && /<NavLink to=\{SECURITY_PAD\}/.test(menu) && /ShieldCheck/.test(menu), "menu-item \"Demo & Scan\" met groen schildje naar /security");
eis(!/<span translate="no">Security<\/span>/.test(menu), "menu-item heet niet meer \"Security\"");
eis(/const TOPKOP = "Free Website DEMO & Security SCAN";/.test(pagina) && /<h1 className="pc-kop pc-topkop" translate="no">\{TOPKOP\}<span className="pc-punt">\.<\/span><\/h1>/.test(pagina), "kop \"Free Website DEMO & Security SCAN.\" met groene punt");
eis((zonderCommentaar.match(/<h1[\s>]/g) || []).length === 1, "precies één h1 op /security");
eis(/<h2 className="pc-kop">Is je website veilig\?<\/h2>/.test(pagina), "\"Is je website veilig?\" is een h2 boven de scan");
eis(/href="#scan"/.test(pagina) && /href="#demo"/.test(pagina), "sprongen naar #scan en #demo onder de kop");
eis(/id="demo"/.test(pagina) && /<WebsiteExamples \/>/.test(pagina) && /import \{ WebsiteExamples \} from "\.\/FreeWebsite"/.test(pagina), "websitedemo-blok #demo met de websitevoorbeelden");
eis(/href="https:\/\/website\.socialnow\.nl"/.test(pagina), "knop naar website.socialnow.nl voor de gratis websitedemo");
eis(/"\/security": "Free Website DEMO & Security SCAN"/.test(shell), "paginatitel van /security is de nieuwe kop");
eis(/\.pc-punt\s*\{[^}]*#25d366/i.test(lees("proposal/php-check.css")), "punt achter de kop is groen #25D366");

const hero = lees("proposal/HeaderBestaand.tsx");
eis(/<Link className="bs-gratis-start" to="\/security"[^>]*>[\s\S]{0,120}<span>Begin met je gratis websitedemo en securityscan<span className="bs-punt">\.<\/span><\/span>/.test(hero) && hero.indexOf("bs-gratis-start") > hero.indexOf("<ExplainerPlayer"), "homepage: onder de video de zin naar /security, punt groen");
eis(/\.bs-gratis-start \.bs-punt\{color:#25d366\}/.test(lees("proposal/header-bestaand.css")), "homepage-zin: punt groen #25D366");
const nieuw = ["Vraag je gratis websitedemo aan", "Gratis voor iedereen die zijn website wil laten checken of vernieuwen.", "Begin met je gratis websitedemo en securityscan"];
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const d = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const mist = nieuw.filter((z) => !(z in d));
  eis(nieuw.every((z) => pagina.includes(z) || hero.includes(z)) && mist.length === 0, `${taal}.json heeft de nieuwe zinnen${mist.length ? `; mist: ${mist.join(" | ")}` : ""}`);
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
