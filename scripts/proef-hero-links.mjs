// Proef hero-links en LinkedIn (5 oktober 2026). Rood op main 53c767c, groen op feat/hero-links-linkedin-20261005.
// Marinus: "Hier moet ook nog het bedrijf van Steven bij en graag bij iedereen Linkedin doorlink. Even goeie Linkbuilding
// opzetten ook naar Rabobank en ADYEN etc." en "Talking to wit maken."
import { readFileSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const team = readFileSync("proposal/TeamTrust.tsx", "utf8");
const ui = readFileSync("proposal/ui.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const hero = pages.slice(pages.indexOf('className="h-integratie"'), pages.indexOf("<HeroFilm")).replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
const linkedin = {
  "Marinus Bergsma": "marinus-bergsma-20b81a144",
  "Sergio Jovovic": "sergio-jovovic-203483220",
  "Carmel Boon": "carmel-boon-984940136",
  "Sam van der Sluis": "sam-van-der-sluis-740781199",
  "Nick van Keulen": "nick-van-keulen-nl",
  "Sid van Kalken": "sid-van-kalken-65b486223",
  "Douwe Kramer": "douwekramer",
  "Steef Komen": "steef-komen-60632236",
  "Tristan Slobbe": "tristan-slobben-105056159",
  "Steven Goudsblom": "steven-goudsblom-bb3ab0197",
};
const persoon = naam => { const i = content.indexOf(`name: "${naam}"`); return i < 0 ? "" : content.slice(i, content.indexOf("}", i)); };
const merken = [
  ["Odoo", "https://www.odoo.com"], ["Salesforce", "https://www.salesforce.com"], ["Attesso", "https://attesso.com"],
  ["Visa", "https://www.visa.nl"], ["Mastercard", "https://www.mastercard.nl"], ["Airwallex", "https://www.airwallex.com"],
  ["Adyen", "https://www.adyen.com"], ["Rabobank", "https://www.rabobank.nl"],
];
const eisen = [
  ...merken.map(([naam, url]) => [`hero linkt ${naam} naar ${url}`, hero.includes(`href="${url}"`) || (pages.includes(`["${naam}", "${url}"`) && hero.includes("TALKING_TO.map") && hero.includes("href={url}")) || (naam === "Salesforce" && hero.includes("INTEGRATIES.map") && team.includes('url: "https://www.salesforce.com"'))]),
  // Linkbuilding: de partner moet socialnow.nl als verwijzer zien, dus geen noreferrer en geen nofollow in de hero.
  ["hero-links zonder noreferrer of nofollow", !/noreferrer|nofollow/.test(hero) && hero.includes('rel="noopener"')],
  ["Fincer van Steven staat in de hero", /WEALTH PARTNER[\s\S]{0,120}Fincer/.test(hero) && hero.includes("linkedin.com/in/steven-goudsblom-bb3ab0197")],
  // Daarna: "Graag ook bewegend en balk wit ... met dus groene line erboven en eronder."
  ["Talking to is een witte balk met groene lijn boven en onder", /\.h-talking \{[^}]*background: #fff;[^}]*border-top: 2px solid #25d366;[^}]*border-bottom: 2px solid #25d366;/.test(css)],
  ["Talking to beweegt (lus), stil bij reduced motion", /\.h-talking-lus \{[^}]*animation: h-talking-loop/.test(css) && /prefers-reduced-motion: reduce\) \{ \.sn-site \.h-talking-lus \{ animation: none;/.test(css)],
  ["kopie van de lus verborgen voor schermlezer en toetsenbord", hero.includes("aria-hidden={kopie || undefined}") && hero.includes("tabIndex={kopie ? -1 : undefined}")],
  ...Object.entries(linkedin).map(([naam, slug]) => [`LinkedIn bij ${naam}`, persoon(naam).includes(`linkedin: "https://www.linkedin.com/in/${slug}/"`)]),
  ["duo's, board en functiemuur linken naar LinkedIn", team.includes("person.linkedin") && !/<Link to="\/team" className="h-(team-kern|board|functie-muur)"/.test(team)],
  ["teampagina linkt naar LinkedIn", ui.includes("person.linkedin")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
