#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: "Zet deze maar alvast live op socialnow.nl als versie. Ipv die er nu live staat." De lange explainer
// in 5:4 (19-SocialNow-OS-Connect-lang-5x4-eigen-beeld-animatie-v1, 2:25, bron 04_OS-VIDEO/video-project/92-os-connect-lang-beeld-animatie)
// vervangt de oude 16:9-explainer op de homepage. Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const tsx = lees("proposal/HeaderAlgemeen.tsx"), css = lees("proposal/header-algemeen.css");
const FILM = "public/video/explainer/socialnow-explainer-5x4.mp4", POSTER = "public/video/explainer/socialnow-explainer-5x4.jpg";
eis(/const FILM = "\/video\/explainer\/socialnow-explainer-5x4\.mp4"/.test(tsx), "homepage speelt de nieuwe 5:4-explainer af");
// Startbeeld: sinds 25 nov de foto van Marinus (zie proef-explainer-knop-wit.mjs), niet meer een frame uit de film.
eis(fs.existsSync(FILM) && fs.statSync(FILM).size < 35_000_000, "filmbestand staat in public/ en is kleiner dan 35 MB");
eis(fs.existsSync(POSTER) && fs.statSync(POSTER).size < 300_000, "startbeeld staat in public/ en is kleiner dan 300 KB");
if (fs.existsSync(FILM)) {
  // de mp4-boxen op het hoogste niveau doorlopen: moov moet vóór mdat staan
  const fd = fs.openSync(FILM, "r"), b8 = Buffer.alloc(16), volgorde = [];
  for (let pos = 0, n = 0; n < 20; n++) {
    if (fs.readSync(fd, b8, 0, 16, pos) < 8) break;
    let grootte = b8.readUInt32BE(0); const type = b8.toString("latin1", 4, 8);
    if (grootte === 1) grootte = Number(b8.readBigUInt64BE(8));
    volgorde.push(type); if (!grootte) break; pos += grootte;
  }
  fs.closeSync(fd);
  eis(volgorde.indexOf("moov") > -1 && volgorde.indexOf("moov") < volgorde.indexOf("mdat"), "faststart: film begint direct met afspelen (moov vóór mdat)");
} else eis(false, "faststart: film begint direct met afspelen (moov vóór mdat)");
eis(/className="sn-alg-foto is-vijfvier"/.test(tsx) && /\.sn-alg-foto\.is-vijfvier\{aspect-ratio:5\/4/.test(css), "kader is 5:4, zodat er links en rechts niets van de film wegvalt");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand in header-algemeen.css");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
