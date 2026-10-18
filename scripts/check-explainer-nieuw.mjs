#!/usr/bin/env node
// Proef: "Wat is er nieuw in SocialNow OS" (18 okt 2026), korte explainer onder de explainer v6 op de homepage.
// Film: 04_OS-VIDEO/video-project/79-wat-is-nieuw (HyperFrames, stijl en assets van v6), EN en NL, 63,1 s.
// Eisen: 1) de homepage toont de bentosectie #wat-is-nieuw direct na de header met de explainer;
//        2) /nl krijgt de NL-film, elke andere taal de EN-film, met cache-versie 20261018-nieuw;
//        3) beide films webgeschikt: H.264 1280×720, AAC, 45–75 s, moov vóór mdat, kleiner dan 15 MB, exact de render (sha256);
//        4) posters 1280×720;
//        5) alle nieuwe zinnen staan in en, de en fr (en de andere woordenboeken), zonder streepje;
//        6) wat nog niet live is (Face ID via Attesso, ads via Zernio) staat alleen onder "Binnenkort";
//        7) na `npm run build` staat de sectie in dist/index.html en dist/nl/index.html.
// Gebruik: node scripts/check-explainer-nieuw.mjs   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";

const VERSIE = "20261018-nieuw";
const SHA = {
  en: "81edea0b8cb764d0d70c42081c2bd5d8eddcca44fb5dd5fd8a65f2fc2a5c1a30",
  nl: "4d133afe679fa5e3591621d2186cabf36bf5e676e29ba16bcfd5426ada6a38b1",
};
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = f => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
const probe = (f, args) => JSON.parse(execFileSync("ffprobe", ["-v", "error", ...args, "-of", "json", f], { encoding: "utf8" }));

const comp = lees("proposal/WatIsNieuw.tsx");
const pages = lees("proposal/pages.tsx");
eis(comp.length > 0, "proposal/WatIsNieuw.tsx bestaat");
eis(/import WatIsNieuw from "\.\/WatIsNieuw"/.test(pages) && /<HomeHeader \/>\s*<WatIsNieuw \/>/.test(pages), "Home toont <WatIsNieuw /> direct na de header met de explainer");
eis(comp.includes('id="wat-is-nieuw"') && comp.includes("<Bento") && comp.includes("<Tegel") && comp.includes("<BentoFilm"), "sectie is een bentogrid (Bento, Tegel, BentoFilm)");
const versieOk = comp.includes(`const VERSIE = "${VERSIE}"`);
eis(versieOk && comp.includes("/video/os/wat-is-nieuw-${taal}.mp4?v=${VERSIE}") && /language === "nl" \? "nl" : "en"/.test(comp), `NL-film op /nl, EN-film elders, ?v=${VERSIE}`);
eis(versieOk && comp.includes("/video/os/wat-is-nieuw-${taal}-poster.jpg?v=${VERSIE}"), "poster per taal met dezelfde cache-versie");

for (const taal of ["en", "nl"]) {
  const f = `public/video/os/wat-is-nieuw-${taal}.mp4`;
  if (!fs.existsSync(f)) { eis(false, `${f} bestaat`); continue; }
  const v = probe(f, ["-show_entries", "format=duration,size:stream=codec_type,codec_name,width,height"]);
  const duur = +v.format.duration, mb = +v.format.size / 1e6;
  const beeld = v.streams.find(s => s.codec_type === "video"), geluid = v.streams.find(s => s.codec_type === "audio");
  eis(duur >= 45 && duur <= 75, `${taal}: duur 45–75 s: ${duur.toFixed(1)} s`);
  eis(beeld?.codec_name === "h264" && beeld.width === 1280 && beeld.height === 720, `${taal}: H.264 1280×720: ${beeld?.codec_name} ${beeld?.width}×${beeld?.height}`);
  eis(geluid?.codec_name === "aac", `${taal}: AAC-geluid`);
  eis(mb < 15, `${taal}: kleiner dan 15 MB: ${mb.toFixed(1)} MB`);
  const kop = fs.readFileSync(f).subarray(0, 4096).toString("latin1");
  eis(kop.indexOf("moov") >= 0 && (kop.indexOf("mdat") < 0 || kop.indexOf("moov") < kop.indexOf("mdat")), `${taal}: moov vóór mdat (faststart)`);
  eis(crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex") === SHA[taal], `${taal}: videobestand is de render van 79-wat-is-nieuw (sha256)`);
  const p = `public/video/os/wat-is-nieuw-${taal}-poster.jpg`;
  const pp = fs.existsSync(p) ? probe(p, ["-show_entries", "stream=width,height"]).streams[0] : {};
  eis(pp.width === 1280 && pp.height === 720, `${taal}: poster 1280×720`);
}

// zinnen uit de component: tekst tussen > en <, en kop=/label=-props
const zinnen = [...new Set([
  ...[...comp.matchAll(/>([^<>{}]*[A-Za-zÀ-ÿ][^<>{}]*)</g)].map(m => m[1].trim()),
  ...[...comp.matchAll(/\b(?:kop|label)="([^"]+)"/g)].map(m => m[1].trim()),
].filter(z => z && !/^(MCP|CLI|API|Face ID|SocialNow OS)$/.test(z)))];
eis(zinnen.length >= 8, `component heeft vertaalbare zinnen: ${zinnen.length}`);
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const boek = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const mist = zinnen.filter(z => !(z in boek));
  eis(mist.length === 0, `${taal}.json heeft alle nieuwe zinnen${mist.length ? `: mist ${mist.slice(0, 3).join(" | ")}` : ""}`);
  if (["en", "de", "fr"].includes(taal)) eis(zinnen.every(z => !/[–—]| - /.test(boek[z] || "")), `${taal}: geen streepje in de vertalingen`);
}
eis(zinnen.every(z => !/[–—]| - /.test(z)), "geen streepje in de Nederlandse tekst");

const live = comp.split("Binnenkort")[0];
eis(comp.includes("Binnenkort") && !/Face ID|Attesso|Zernio/i.test(live), "Face ID en ads via agents staan alleen onder Binnenkort");

for (const f of ["dist/index.html", "dist/nl/index.html"]) {
  const h = lees(f);
  eis(h.includes('id="wat-is-nieuw"'), `${f} bevat de sectie (na npm run build)`);
}

console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
