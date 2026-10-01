// Proef partnerlogo's onder de betaalpartner (1 oktober 2026). Rood op main 9b9b29a, groen op feat/attesso-partnerlogos-20261001.
// Marinus: "Vanuit de video staan de logo's waar mijn partners van Attesso mee in gesprek gaan. Die mogen ook op de site."
// en "Graag hier dan eronder." (onder PAYMENT PARTNER ~/attesso).
import { readFileSync, existsSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const logos = ["visa.svg", "mastercard.svg", "airwallex.webp", "adyen.svg", "rabobank.svg"];
const na = pages.slice(pages.indexOf('className="h-attesso"'));
const eisen = [
  ["vijf logobestanden aanwezig", logos.every((f) => existsSync(`public/images/partners/betalen/${f}`))],
  ["rij staat direct onder PAYMENT PARTNER ~/attesso", /^[\s\S]{0,700}<ul className="h-attesso-logos"/.test(na)],
  ["volgorde zoals in de film: Visa, Mastercard, Airwallex, Adyen, Rabobank", (() => { const i = logos.map((f) => na.indexOf(`/images/partners/betalen/${f}`)); return i.every((x, n) => x > 0 && (n === 0 || x > i[n - 1])); })()],
  ["elk logo heeft alt-tekst", ["Visa", "Mastercard", "Airwallex", "Adyen", "Rabobank"].every((a) => na.includes(`alt="${a}"`))],
  ["witte chips in de stijl", css.includes(".h-attesso-logos li") && /\.h-attesso-logos li \{[^}]*background: #fff/.test(css)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
