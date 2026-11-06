#!/usr/bin/env node
// Proef: de 5-jaarfilm als hoofdvideo op de homepage, 6 november 2026. Marinus: "met de video als MAIN VIDEO [...] plus die video op
// die andere plek waar nu de foto staat. Bewaar wel goed deze versies zodat ik m makkelijk terug kan zetten."
// Rood op main vóór deze wijziging (tag bewaard/2026-11-06/voor-5years-video), groen erna.
// Gebruik: node scripts/proef-vijf-jaar-film.mjs
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = p => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const home = lees("proposal/HomeEnthousiast.tsx");
const film = lees("proposal/VijfJaarFilm.tsx");
const css = lees("proposal/vijf-jaar.css");
const kop = lees("proposal/HeaderAlgemeen.tsx");

eis(/<VijfJaarFilm \/>/.test(home) && !/<AtomiumFoto \/>/.test(home), "homepage-hero toont de 5-jaarfilm op de plek van de teamfoto");
eis(/muted/.test(film) && /loop/.test(film) && /playsInline/.test(film), "film in de hero speelt gedempt, inline en in een lus (bevriest niet op het laatste beeld)");
eis(/prefers-reduced-motion: reduce/.test(film), "bij minder beweging speelt de film niet vanzelf");
eis(/preload="none"/.test(film) && /addEventListener\("load"/.test(film), "film laadt pas na de pagina (poster eerst, lazy)");
for (const f of ["vijf-jaar.mp4", "vijf-jaar-hevc.mp4", "vijf-jaar.webm", "vijf-jaar-mobiel.mp4", "vijf-jaar-mobiel-hevc.mp4", "vijf-jaar-poster.webp", "vijf-jaar-poster-mobiel.webp"])
  eis(fs.existsSync(`public/video/vijf-jaar/${f}`), `webversie aanwezig: ${f}`);
eis(/codecs="hvc1"/.test(film) && /video\/webm/.test(film), "bronnen: hevc, webm en mp4");
// Sinds de avond van 6 november: geen witte knop met venster meer, maar een rond geluidsicoon in de video (scripts/proef-geluid-icoon.mjs).
eis(/<button[^>]*sn-film-geluid/.test(film) && /v\.currentTime = 0;\s*v\.muted = false;/.test(film), "geluidsknop speelt de hele film met geluid vanaf het begin");
eis(/\.sn-vijf-film[^{]*\{[^}]*aspect-ratio:9\/16[^}]*background:#000/.test(css), "vaste 9:16-maat op puur zwart: geen verschuiving");
for (const t of ["Geluid aan", "5 jaar SocialNow"]) for (const taal of ["en", "de", "fr"])
  eis(t in JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}"), `vertaling ${taal}: ${t}`);
// Terugzetten blijft makkelijk: de oude onderdelen staan er nog.
eis(/export function AtomiumFoto/.test(kop) && fs.existsSync("public/images/verhaal/team-atomium.webp"), "teamfoto en AtomiumFoto blijven bewaard");
eis(fs.existsSync("public/video/header-intro.mp4") && fs.existsSync("public/video/header-intro-mobile.mp4"), "header-intro-video's blijven bewaard");
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
