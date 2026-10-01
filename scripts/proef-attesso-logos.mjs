// Proef Talking to (1 oktober 2026). Rood op main 9b9b29a, groen op feat/attesso-partnerlogos-20261001.
// Marinus: "Vanuit de video staan de logo's waar mijn partners van Attesso mee in gesprek gaan. Die mogen ook op de site.",
// "Zet trouwens maar hieronder bij talking to en laat deze balk Primefone, DIVEINE, KWH weg." en
// "SocialNowOS mag gwn boven hier weg." en "Dan kunnen er meer logo's onder Attesso met talking to."
import { readFileSync, existsSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const home = pages.slice(pages.indexOf("export function Home()"));
const logos = ["visa.svg", "mastercard.svg", "airwallex.webp", "adyen.svg", "rabobank.svg"];
const talking = home.slice(home.indexOf('className="h-talking"'));
const eisen = [
  ["vijf logobestanden aanwezig", logos.every((f) => existsSync(`public/images/partners/betalen/${f}`))],
  ["TALKING TO direct onder PAYMENT PARTNER ~/attesso", /PAYMENT PARTNER <code>~\/attesso<\/code><\/span>\s*<\/p>\s*(\{\/\*[\s\S]*?\*\/\}\s*)?<div className="h-talking">\s*<span className="h-talking-label">TALKING TO<\/span>/.test(home)],
  ["volgorde zoals in de film: Visa, Mastercard, Airwallex, Adyen, Rabobank", (() => { const i = logos.map((f) => talking.indexOf(`/images/partners/betalen/${f}`)); return i.every((x, n) => x > 0 && (n === 0 || x > i[n - 1])); })()],
  ["elk logo heeft alt-tekst", ["Visa", "Mastercard", "Airwallex", "Adyen", "Rabobank"].every((a) => talking.includes(`alt="${a}"`))],
  ["witte chips, label roze zoals PAYMENT PARTNER", /\.h-attesso-logos li \{[^}]*background: #fff/.test(css) && /\.h-talking-label \{[^}]*#d4a0b5/.test(css)],
  ["klantenbalk Trusted by (PrimeFone, DIVINE, kWh) weg uit de header", !home.includes("<ClientLogos kort />") && !home.includes(">Trusted by<")],
  ["SocialNow OS-logo-animatie boven het team weg", !pages.includes("<HeroLogo") && !pages.includes('className="h-hero-logo"')],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
