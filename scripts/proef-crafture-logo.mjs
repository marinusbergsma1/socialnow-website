#!/usr/bin/env node
// Proef: Crafture-logo in de Trusted by-balk van het startbeeld (22 oktober 2026). Rood op main e556542, groen op feat/crafture-logo-20261022.
// Marinus: vervang de tekst "via Crafture" door het Crafture-logo, dan een dunne verticale streep, dan de logo's die via Crafture liepen.
// Volgorde: AZ, Supperclub | Crafture | Universal, Warner Bros., MOJO, IMAX, Marvel. Even hoog en rustig van kleur, niets nagetekend.
// Het logo is het bestaande Crafture-bestand (02-SOCIALNOW/GESPREK-STEVEN-2026-10-05/logos/crafture.svg, 13 identieke kopieën op WORK).
// De meting op 390 en 1440 breed staat in de PR; deze proef bewaakt de bron.
// Gebruik: node scripts/proef-crafture-logo.mjs
import fs from "node:fs";
import crypto from "node:crypto";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
const speler = lees("proposal/ExplainerPlayer.tsx");
const css = lees("proposal/explainer-player.css");
const start = speler.slice(speler.indexOf("function Startbeeld"), speler.indexOf("export default function ExplainerPlayer"));
const LOGO = "public/images/merken/CRAFTURE-LOGO.svg";
const sha = (f) => (fs.existsSync(f) ? crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex") : "");

eis(fs.existsSync(LOGO) && /viewBox="0 0 526\.5 707\.2"/.test(lees(LOGO)) && !/<script|onload=|href=/i.test(lees(LOGO)), "Crafture-logo staat in public/images/merken als het bestaande vectorbestand (526,5 x 707,2), zonder scripts");
eis(sha(LOGO) === "34bee4cb5c53da279a5ce52cfd959f77b63116b65f7894d2f445b2c1a8f89223", "het bestand is byte voor byte het bestaande Crafture-logo, niet nagetekend");
eis(!/>via Crafture</.test(start) && !start.includes("sn-startbeeld-via") && !css.includes("sn-startbeeld-via"), 'de tekst "via Crafture" in de balk is weg');
eis(/const CRAFTURE = \{ naam: "Crafture", src: "\/images\/merken\/CRAFTURE-LOGO\.svg"/.test(speler), "Crafture staat als logo in de code");

// Volgorde in de balk: AZ, Supperclub | Crafture | Universal, Warner Bros., MOJO, IMAX, Marvel
const balk = start.slice(start.indexOf('className="sn-startbeeld-merken"'));
const volgorde = ["{DIRECT.map(merk)}", "{merk(CRAFTURE)}", "sn-startbeeld-streep", "{VIA_CRAFTURE.map(merk)}"].map(s => balk.indexOf(s));
eis(volgorde.every(i => i > 0) && volgorde.every((i, n) => n === 0 || i > volgorde[n - 1]), "volgorde: AZ en Supperclub, streep, Crafture-logo, streep, de vijf merken via Crafture");
const lijst = (naam) => { const i = speler.indexOf(`const ${naam} = [`); return i < 0 ? "" : speler.slice(i, speler.indexOf("];", i)); };
eis(["AZ", "Supperclub"].every(n => lijst("DIRECT").includes(`naam: "${n}"`)), "direct: AZ en Supperclub");
eis(["Universal", "Warner Bros.", "MOJO", "IMAX", "Marvel"].map(n => lijst("VIA_CRAFTURE").indexOf(`naam: "${n}"`)).every((i, n, a) => i > 0 && (n === 0 || i > a[n - 1])), "via Crafture, in deze volgorde: Universal, Warner Bros., MOJO, IMAX, Marvel");

// Streep en kleur
eis(/\.sn-startbeeld-streep\{[^}]*width:1px;[^}]*background:#ffffff26/.test(css), "dunne verticale streep tussen Crafture en de vijf merken, zelfde kleur als de streep na Supperclub");
eis(/\.sn-startbeeld-merken img\{[^}]*filter:brightness\(0\) invert\(1\);opacity:\.72\}/.test(css), "rustig van kleur, zoals de andere logo's");
eis(/naam: "Crafture"[^}]*maat: 1\.55/.test(speler), "optisch even hoog als de andere staande logo's (maat 1,55, zoals Supperclub)");

console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
