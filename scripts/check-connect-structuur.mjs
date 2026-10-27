#!/usr/bin/env node
// Proef: Connect op de homepage als bedrijfsstructuur (ConnectExperts.tsx), Marinus 27 okt 2026: "Ik wil dat op de socialnow.nl
// website het connect onderdeel meer de structuur krijgt van het laatste plan en architecture. Dus met developers en weer naar
// beneden zoals het was dus meer een soort bedrijfsstructuur dan slider. Wel alle foto's lekker klein houden."
// Het plan (plan-site, structure.json, 27 okt): Marinus, Gijsbert, Douwe en Steef samen eindverantwoordelijk.
// Gebruik: node scripts/check-connect-structuur.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const tsx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8");
const css = fs.readFileSync("proposal/connect-experts.css", "utf8");
const TOP = ["Marinus Bergsma", "Gijsbert Westeneng", "Douwe Kramer", "Steef Komen"];

eis(!/aria-label="(Vorige|Volgende) experts"/.test(tsx) && !tsx.includes("scrollBy"), "geen slider meer: geen schuifpijlen en geen schuifrij");
const top = tsx.match(/const EINDVERANTWOORDELIJK = \[([^\]]*)\]/);
eis(!!top && TOP.every((n, i) => top[1].split(",").map(s => s.trim().replace(/"/g, ""))[i] === n), "bovenste laag uit het plan: Marinus, Gijsbert, Douwe, Steef");
const plek = (k) => tsx.indexOf(`>${k}</p>`);
eis(["Eindverantwoordelijk", "Developers", "Vakgebieden"].every(k => plek(k) > 0), "lagen van boven naar beneden: Eindverantwoordelijk, Developers, Vakgebieden");
eis(plek("Eindverantwoordelijk") < plek("Developers") && plek("Developers") < plek("Vakgebieden"), "volgorde klopt in de code");
const foto = css.match(/\.cx-org-persoon img\s*\{[^}]*width:\s*(\d+)px/);
eis(!!foto && Number(foto[1]) <= 64, `foto's klein (${foto ? foto[1] + " px" : "geen maat"}, hoogstens 64 px)`);
const mobiel = [...css.matchAll(/@media \(max-width: (\d+)px\) \{([^@]*)/g)].filter(m => Number(m[1]) <= 640).map(m => m[2]).join("\n");
const fotoMobiel = [...mobiel.matchAll(/\.cx-org-persoon img\s*\{[^}]*width:\s*(\d+)px/g)].map(m => Number(m[1]));
eis(fotoMobiel.length > 0 && Math.min(...fotoMobiel) <= 48, "op de telefoon nog kleiner (hoogstens 48 px)");
eis(/\.cx-org-lijn/.test(css), "verbindingslijnen tussen de lagen, als een organogram");
for (const l of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${l}.json`, "utf8"));
  eis(["Eindverantwoordelijk", "Developers", "Vakgebieden"].every(k => w[k]), `laagnamen vertaald (${l})`);
}
if (process.argv.includes("--dist")) {
  const html = fs.readFileSync("dist/nl/index.html", "utf8");
  const s = html.indexOf('class="cx-org"'), blok = s < 0 ? "" : html.slice(s, html.indexOf("cx-onder", s));
  const namen = [...blok.matchAll(/<strong translate="no">([^<]+)<\/strong>/g)].map(m => m[1]);
  eis(namen.length === 30 && new Set(namen).size === namen.length, `gebouwde nl-homepage toont iedereen precies één keer (${namen.length})`);
  eis(TOP.every((n, i) => namen[i] === n), "gebouwde pagina begint met de vier eindverantwoordelijken");
  eis(!html.includes('class="cx-raster"'), "gebouwde pagina heeft geen schuifrij meer");
  const fotos = [...blok.matchAll(/<img[^>]*?\ssrc="([^"?]+)/g)].map(m => m[1]);
  const kwijt = fotos.filter(f => !fs.existsSync(`dist${f}`));
  eis(fotos.length === 30 && kwijt.length === 0, `elke kleine foto bestaat echt (${fotos.length} foto's${kwijt.length ? ", kwijt: " + kwijt.slice(0, 3).join(" ") : ""})`);
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
