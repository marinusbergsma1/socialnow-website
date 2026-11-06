#!/usr/bin/env node
// Proef: de Odoo Experience-film weer op de homepage, naast de 5-jaarfilm, 6 november 2026. Marinus: "Doe daarnaast maar de Odoo
// video nog op de website." Gedempt vanzelf, met een duidelijke geluidsknop (geluid kan pas na een klik). De 5-jaarfilm blijft.
// Rood op main vóór deze wijziging (tag bewaard/2026-11-06/voor-odoo-film), groen erna. Gebruik: node scripts/proef-odoo-film-home.mjs
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = p => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const home = lees("proposal/HomeEnthousiast.tsx"), odoo = lees("proposal/OdooFilm.tsx"), css = lees("proposal/vijf-jaar.css");
eis(/<VijfJaarFilm \/>/.test(home), "5-jaarfilm blijft de hoofdvideo");
eis(/import OdooFilm from "\.\/OdooFilm"/.test(home) && /<OdooFilm \/>/.test(home), "Odoo Experience-film staat op de homepage");
eis(/sn-hero-films/.test(home) && home.indexOf("<VijfJaarFilm />") < home.indexOf("<OdooFilm />"), "Odoo-film naast (na) de 5-jaarfilm in de hero");
eis(/muted/.test(odoo) && /loop/.test(odoo) && /playsInline/.test(odoo), "gedempt, inline en in een lus");
eis(!/setTimeout/.test(odoo), "geen automatische wissel na 3 seconden: geluid alleen na een klik");
eis(/sn-film-geluid/.test(odoo) && /Geluid aan/.test(odoo) && /aria-pressed/.test(odoo), "duidelijke geluidsknop (rond icoon in de video)");
eis(/prefers-reduced-motion: reduce/.test(odoo) && /addEventListener\("load"/.test(odoo) && /preload="none"/.test(odoo), "lazy en niets vanzelf bij minder beweging");
eis(/\.sn-odoo-film\{[^}]*aspect-ratio:9\/16/.test(css) && /\.sn-odoo-film\{[^}]*background:#000/.test(css), "vaste 9:16-maat op zwart");
for (const t of ["Geluid aan", "Geluid uit", "Aftermovie Odoo Experience 2026"]) for (const taal of ["en", "de", "fr"])
  eis(t in JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}"), `vertaling ${taal}: ${t}`);
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
