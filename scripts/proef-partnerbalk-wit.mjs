// Proef witte partnerbalk (3 oktober 2026). Rood op main 6834d9b, groen op feat/partnerbalk-wit-20261003.
// Marinus: "Waarom is de logobalk nogsteeds niet online? Mag dit in een witte balk? Dan valt het meer op."
// De balk stond wel live, maar diep in Bereikt (± 6400 px). Nu direct onder het team in de hero, en wit.
import { readFileSync, existsSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const bereikt = readFileSync("proposal/Bereikt.tsx", "utf8");
const balk = existsSync("proposal/PartnerBalk.tsx") ? readFileSync("proposal/PartnerBalk.tsx", "utf8") : "";
const css = readFileSync("proposal/hero-c.css", "utf8");
const team = pages.indexOf('<div className="h-team-rij">');
const sprekers = pages.indexOf("<HeroSprekers />");
const plek = pages.indexOf("<PartnerBalk />");
const logos = ["salesforce.svg", "betalen/visa.svg", "betalen/mastercard.svg", "betalen/airwallex.webp", "betalen/adyen.svg", "betalen/rabobank.svg"];
const eisen = [
  ["balk staat in de hero, direct na het team en vóór de sprekers", team > 0 && plek > team && plek < sprekers && !pages.slice(team, plek).includes("<HeroSprekers")],
  ["balk niet meer verstopt in Bereikt", !bereikt.includes("PartnerSlider") && !bereikt.includes("h-bereikt-partners")],
  ["alle zes partnerlogo's in de balk", logos.every((f) => balk.includes(`/images/partners/${f}`) && existsSync(`public/images/partners/${f}`))],
  ["witte balk", /\.h-partners \{[^}]*background: #fff/.test(css)],
  ["over de volle breedte van de hero", /\.h-hero \.h-partners \{[^}]*grid-column: 1 \/ -1/.test(css)],
  ["stil bij prefers-reduced-motion", /prefers-reduced-motion[^{]*\{[^@]*\.h-partners-lus \{ animation: none/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
