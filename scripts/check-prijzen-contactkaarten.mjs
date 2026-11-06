#!/usr/bin/env node
// Proef, Marinus 6 nov 2026: "Die knoppen zijn wat lomp ik wil graag de Cards met Steef voor die onderdelen en voor Growth ik en
// zakelijker." Contactkaarten in plaats van pilknoppen bij de onderdelen op maat op /diensten.
// Gebruik: node scripts/check-prijzen-contactkaarten.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const p = fs.readFileSync("proposal/Pricing.tsx", "utf8");
const css = fs.readFileSync("proposal/pricing.css", "utf8");
const opMaat = p.slice(p.indexOf("const OP_MAAT"), p.indexOf("];", p.indexOf("const OP_MAAT")));
const blok = (id) => opMaat.slice(opMaat.indexOf(`id: "${id}"`), opMaat.indexOf("}", opMaat.indexOf(`id: "${id}"`)));
eis(/contact: "steef"/.test(blok("cybersecurity")), "Cybersecurity: kaart met Steef");
eis(/contact: "steef"/.test(blok("erp-crm")), "ERP & CRM: kaart met Steef");
eis(/contact: "marinus"/.test(blok("growth")), "Growth: kaart met Marinus");
const lijst = p.slice(p.indexOf('className="prijs-maat-lijst"'), p.indexOf("</ol>", p.indexOf('className="prijs-maat-lijst"')));
eis(lijst.includes("<Contactkaart") && !lijst.includes("sn-pill"), "geen pilknoppen meer in de onderdelen op maat, wel contactkaarten");
eis(/\.prijs-contact \{[^}]*border: 1px solid[^}]*border-radius: 12px/.test(css) && /\.prijs-contact img \{[^}]*width: 48px/.test(css), "kaart zakelijk: dunne rand, kleine vierkante foto");
if (process.argv.includes("--dist")) {
  const html = fs.readFileSync("dist/nl/diensten/index.html", "utf8");
  const s = html.indexOf('class="prijs-maat-lijst"'), b = s < 0 ? "" : html.slice(s, html.indexOf("</ol>", s));
  eis((b.match(/Steef Komen/g) ?? []).length === 2 && (b.match(/Marinus Bergsma/g) ?? []).length === 1 && !b.includes("sn-pill"), "gebouwde pagina: 2x Steef, 1x Marinus, geen pilknoppen");
  eis(["/images/prijzen/steef.webp", "/images/prijzen/marinus.webp"].every(f => b.includes(f) && fs.existsSync(`dist${f}`)), "foto's in de kaarten bestaan");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
