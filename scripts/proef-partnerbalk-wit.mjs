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
  // Marinus: "MASTERCARD IS VEEL TE GROOT." De twee cirkels mogen niet hoger zijn dan 40 px.
  ["Mastercard niet groter dan de rest (max 40 px)", (() => { const m = css.match(/\.h-partners-logo img\[alt="Mastercard"\] \{ max-height: (\d+)px/); return !!m && Number(m[1]) <= 40; })()],
  // Marinus: "Kloppen deze wel?" en "Heb je dat gecheckt via Sid?" Niet bevestigd, dus geen "OUR PARTNERS" maar TALKING TO.
  ["kop TALKING TO, niet OUR PARTNERS", balk.includes(">TALKING TO<") && !balk.includes("OUR PARTNERS")],
  ["groot: René van der Zel, XXL Nutrition", balk.includes("René van der Zel") && balk.includes("XXL Nutrition") && /\.h-partners-groot \{[^}]*font-size: clamp\(26px/.test(css)],
  ["Visa in het huidige blauw #1434CB", readFileSync("public/images/partners/betalen/visa.svg", "utf8").includes("#1434CB")],
  // Marinus: "ONS VLAK MET MENSEN WIT EN TEAM ER HELEMAAL OP".
  ["teamvlak is wit", /\.h-hero \.h-team-rij \{[^}]*background: #fff/.test(css)],
  ["iedereen uit people in de muur, plus Jij?", (() => { const t = readFileSync("proposal/TeamTrust.tsx", "utf8"); return t.includes("[...people].sort(") && t.includes('className="h-team-jij"'); })()],
  ["Aren, Youri en Antony in het team", ["Aren", "Youri van der Donk", "Antony Soosaipillaj"].every((n) => readFileSync("proposal/content.ts", "utf8").includes(`name: "${n}"`))],
  ["stil bij prefers-reduced-motion", /prefers-reduced-motion[^{]*\{[^@]*\.h-partners-lus \{ animation: none/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
