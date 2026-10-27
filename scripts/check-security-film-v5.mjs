#!/usr/bin/env node
// Proef (27 okt 2026, Marinus: "In die explainer verspreek ik mij nog een paar keer en wil ik graag net als die versie van
// Instagram dat je mij ook ziet spreken"). De liggende securityfilm op /security is v5: nieuwe takes ("public interest",
// "nobody has updated in a while"), 115,6 s in plaats van 116,3 s, en Marinus weer in beeld in het telefoonkader.
// Gebruik: node scripts/check-security-film-v5.mjs (ffprobe nodig). Rood op main, groen met de nieuwe film.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const film = "public/security/film/security-16x9.mp4";
const probe = (pad, args) => execFileSync("ffprobe", ["-v", "error", ...args, "-of", "default=nw=1:nk=1", pad], { encoding: "utf8" }).trim().split("\n");

eis(existsSync(film), `${film} bestaat`);
const duur = Number(probe(film, ["-show_entries", "format=duration"])[0]);
eis(Math.abs(duur - 115.63) < 0.15, `film is de v5-montage van 115,6 s (nu ${duur.toFixed(2)} s; v3 was 116,3 s)`);
const [w, h] = probe(film, ["-select_streams", "v:0", "-show_entries", "stream=width,height"]).map(Number);
eis(w === 1920 && h === 1080, `film is 1920x1080 (nu ${w}x${h})`);
eis(probe(film, ["-select_streams", "a:0", "-show_entries", "stream=codec_name"])[0] === "aac", "film heeft AAC-geluid");
eis(statSync(film).size < 20e6, `film blijft licht voor het web (${(statSync(film).size / 1e6).toFixed(1)} MB < 20 MB)`);
const poster = "public/security/film/poster-16x9.jpg";
const [pw, ph] = probe(poster, ["-show_entries", "stream=width,height"]).map(Number);
eis(pw === 1920 && ph === 1080, `poster is 1920x1080 (nu ${pw}x${ph})`);
const bron = readFileSync("proposal/PhpCheck.tsx", "utf8");
eis(/security-16x9\.mp4/.test(bron) && /poster-16x9\.jpg/.test(bron), "Film() speelt security-16x9.mp4 met poster-16x9.jpg");
eis(/27 oktober 2026.*v5/.test(bron) && !/sinds de avond zonder Marinus in beeld/.test(bron), "toelichting in PhpCheck.tsx beschrijft v5 met Marinus in beeld");
process.exit(fouten.length ? 1 : 0);
