#!/usr/bin/env node
// Proef: geluidsicoon rechtsonder ín de video's van de hero, titels naast elkaar, nieuwe eindversie van de 5-jaarfilm. 6 november 2026,
// Marinus: "Geluid icoon mag rechtsonder hier bij de video net als bij de andere dan heb je mooi Odoo Experience en 5 Jaar SocialNow
// naast elkaar." Plus de eindrender van 19:13 (websites in 4K, ERP-logo's, swooshes, kWh-kaart niet meer wit). Rood vóór deze wijziging, groen erna.
// Gebruik: node scripts/proef-geluid-icoon.mjs
import fs from "node:fs";
import { createHash } from "node:crypto";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = p => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const vijf = lees("proposal/VijfJaarFilm.tsx"), odoo = lees("proposal/OdooFilm.tsx"), css = lees("proposal/vijf-jaar.css");
eis(!/Bekijk met geluid/.test(vijf) && !/sn-vijf-geluid/.test(vijf), "witte knop Bekijk met geluid onder de 5-jaarfilm is weg");
for (const [naam, src] of [["5-jaarfilm", vijf], ["Odoo-film", odoo]]) {
  const fig = src.slice(src.indexOf("<figure"), src.indexOf("</figure>"));
  eis(/className="sn-film-geluid"/.test(fig) && /aria-pressed/.test(fig) && /aria-label=\{[^}]*Geluid/.test(fig), `${naam}: rond geluidsicoon ín de video`);
}
eis(/\.sn-film-geluid\{[^}]*position:absolute[^}]*right:12px[^}]*bottom:12px[^}]*border-radius:50%/.test(css), "icoon rechtsonder, rond");
eis(/\.sn-hero-films\{[^}]*align-items:flex-end/.test(css) && !/\.sn-odoo\{[^}]*margin-top/.test(css), "titels van beide films op één lijn naast elkaar");
eis(!/@media\(max-width:960px\)\{\s*\.sn-hero-films\{flex-direction:column/.test(css), "ook op mobiel naast elkaar");
const md5 = p => fs.existsSync(p) ? createHash("md5").update(fs.readFileSync(p)).digest("hex") : "";
const oud = ["6e9bd0ec7f566215a65417876fc24437", "65695c4308ca690568d6aa67cf3fc072"]; // renders 18:13 en 18:59
eis(!oud.includes(md5("public/video/vijf-jaar/vijf-jaar.mp4")) && /const VERSIE = 3;/.test(vijf), "eindversie 19:13 (kWh-kaart niet meer wit), cache-versie 3");
for (const t of ["Geluid aan", "Geluid uit"]) for (const taal of ["en", "de", "fr"])
  eis(t in JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}"), `vertaling ${taal}: ${t}`);
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
