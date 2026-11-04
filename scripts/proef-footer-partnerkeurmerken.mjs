// Proef keurmerken via partners in de footer (31 oktober 2026). Rood op main 856a3ab, groen op feat/footer-partner-keurmerken-20261031.
// Marinus: "Verder uncanny en Indexworld certificaten etc via partners vermelden." Gekozen: de rij "Gecertificeerd & erkend"
// krijgt een tweede rij "Via onze partners", met per partner de naam en hun keurmerken, en een link naar hun partnerkaart.
// Alleen echte keurmerken: Claude, Sage en QuickBooks zijn partners van Indexworld, geen certificaten.
import { readFileSync } from "node:fs";

const footer = readFileSync("proposal/BrandFooter.tsx", "utf8");
const css = readFileSync("proposal/concept-tech.css", "utf8");
// 4 november 2026 (Marinus): "Dit uit de footer en hier meer een geheel." en "Met kleur". De twee rijen zijn één rij geworden,
// zonder de losse namen Uncanny en Indexworld, en alle logo's in eigen kleur.
const rij = footer.slice(footer.indexOf('className="h-footer-erkend"'), footer.indexOf("</div>\n          </div>", footer.indexOf('className="h-footer-erkend"')));
const talen = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];

const eisen = [
  ["één rij Gecertificeerd, erkend en partners", rij.includes("Gecertificeerd, erkend en partners") && !rij.includes("h-footer-erkend-partners")],
  ["keurmerken via partners: Odoo Silver, Shopify, Salesforce en Adobe", ["Odoo Silver Partner", "Shopify Partners", "Salesforce-partner", "Adobe-partner"].every((k) => rij.includes(`alt="${k}"`))],
  ["geen partners van Indexworld als keurmerk", !/claude|sage|quickbooks/i.test(rij)],
  ["logo's in kleur: geen wit- of grijsfilter en niet gedimd", !/\.h-footer-erkend[^{]*img \{[^}]*filter/.test(css) && !/\.h-footer-erkend > div \{[^}]*opacity/.test(css)],
  ...talen.map((taal) => [`vertaling ${taal}`, /"Gecertificeerd, erkend en partners": "[^"]+"/.test(readFileSync(`proposal/i18n/${taal}.json`, "utf8"))]),
];

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
