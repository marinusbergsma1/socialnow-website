// Proef keurmerken via partners in de footer (31 oktober 2026). Rood op main 856a3ab, groen op feat/footer-partner-keurmerken-20261031.
// Marinus: "Verder uncanny en Indexworld certificaten etc via partners vermelden." Gekozen: de rij "Gecertificeerd & erkend"
// krijgt een tweede rij "Via onze partners", met per partner de naam en hun keurmerken, en een link naar hun partnerkaart.
// Alleen echte keurmerken: Claude, Sage en QuickBooks zijn partners van Indexworld, geen certificaten.
import { readFileSync } from "node:fs";

const footer = readFileSync("proposal/BrandFooter.tsx", "utf8");
const css = readFileSync("proposal/concept-tech.css", "utf8");
const rij = footer.match(/className="h-footer-erkend-partners"[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? "";
const talen = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];

const eisen = [
  ["rij \"Via onze partners\" onder Gecertificeerd & erkend", /Gecertificeerd &amp; erkend[\s\S]*className="h-footer-erkend-partners"/.test(footer) && rij.includes("Via onze partners")],
  ["Uncanny met Odoo Silver, Shopify, Salesforce ISV en Adobe Certified", rij.includes("Uncanny") && ["Odoo Silver Partner", "Shopify Partners", "Salesforce ISV-partner", "Adobe Certified Professional"].every((k) => rij.includes(`alt="${k}"`))],
  ["Indexworld met Odoo-partner", rij.includes("Indexworld") && rij.includes('alt="Odoo-partner"')],
  ["geen partners van Indexworld als keurmerk", !/claude|sage|quickbooks/i.test(rij)],
  ["partnernamen linken naar de partnerkaarten", (rij.match(/to="\/#sn-samen-kop"/g) ?? []).length === 2],
  ["keurmerken grijs (wit maken vult de uitgespaarde letters), zonder vlak erachter", /\.h-footer-erkend-partners img \{[^}]*filter: grayscale\(1\)/.test(css) && !/\.h-footer-erkend-partners[^{]*\{[^}]*background(?!: none)/.test(css)],
  ...talen.map((taal) => [`vertaling ${taal}`, /"Via onze partners": "[^"]+"/.test(readFileSync(`proposal/i18n/${taal}.json`, "utf8"))]),
];

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
