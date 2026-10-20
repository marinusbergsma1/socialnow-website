#!/usr/bin/env node
// Proef: de site-explainer v8 (20 okt 2026, ca. 3:05, uit code): v7 plus hoe SocialNow OS en SocialNow Connect samenwerken,
// wie eraan bouwt (SocialNow, INDEXWORLD, Uncanny, Komen Consultancy Operation Systems, Attesso) en hoe elke versie beter wordt.
// Bron: 04_OS-VIDEO/video-project/81-explainer-v8 (bouw_v8.py). Webteksten: 81-explainer-v8/werk/02-webtekst.md (DEFINITIEF).
// Eisen: 1) de speler laadt de nieuwe versie (cache-versie 20261020-v8) voor video én poster;
//        2) het videobestand is de nieuwe film (180–190 s, niet v7 van 146,3 s) en precies de webversie van proef02 (sha256);
//        3) webgeschikt: H.264 1280×720, AAC, moov vóór mdat (snel starten), kleiner dan 40 MB; poster 1280×720;
//        4) de regel onder de speler en het blok "Samen bouwen" (rollen, verbetercyclus, wie wat ziet) staan in de bron en in en.json;
//        5) niets meer van wat 01-bronnen §3b schrapt ("drie bedrijven", CPA-leiding, "direct in jouw systemen").
// Gebruik: node scripts/check-explainer-v8.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";

const VERSIE = "20261020-v8";
const SHA = "47aa4b1c45206d1c75a9e1bb5c86429fa960d09d7028fa04487fe23c8651e610";   // renders/explainer-v8-proef02-web.mp4
const VIDEO = "public/video/os/socialnow-os-explainer.mp4";
const POSTER = "public/video/os/socialnow-os-explainer-poster.jpg";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const probe = (f, args) => JSON.parse(execFileSync("ffprobe", ["-v", "error", ...args, "-of", "json", f], { encoding: "utf8" }));

const speler = fs.readFileSync("proposal/ExplainerPlayer.tsx", "utf8");
eis(speler.includes(`/video/os/socialnow-os-explainer.mp4?v=${VERSIE}`), `speler laadt de video met ?v=${VERSIE}`);
eis(speler.includes(`/video/os/socialnow-os-explainer-poster.jpg?v=${VERSIE}`), `speler laadt de poster met ?v=${VERSIE}`);

const v = probe(VIDEO, ["-show_entries", "format=duration,size:stream=codec_type,codec_name,width,height"]);
const duur = +v.format.duration, mb = +v.format.size / 1e6;
const beeld = v.streams.find(s => s.codec_type === "video"), geluid = v.streams.find(s => s.codec_type === "audio");
eis(duur > 180 && duur < 190, `video is de nieuwe film (180–190 s): ${duur.toFixed(1)} s`);
eis(beeld?.codec_name === "h264" && beeld.width === 1280 && beeld.height === 720, `H.264 1280×720: ${beeld?.codec_name} ${beeld?.width}×${beeld?.height}`);
eis(geluid?.codec_name === "aac", `AAC-geluid: ${geluid?.codec_name}`);
eis(mb < 40, `kleiner dan 40 MB: ${mb.toFixed(1)} MB`);
eis(crypto.createHash("sha256").update(fs.readFileSync(VIDEO)).digest("hex") === SHA, "videobestand is de webversie van de v8-render (sha256)");
const kop = fs.readFileSync(VIDEO).subarray(0, 4096).toString("latin1");
eis(kop.indexOf("moov") >= 0 && (kop.indexOf("mdat") < 0 || kop.indexOf("moov") < kop.indexOf("mdat")), "moov vóór mdat (faststart)");
const p = probe(POSTER, ["-show_entries", "stream=width,height"]).streams[0];
eis(p.width === 1280 && p.height === 720, `poster 1280×720: ${p.width}×${p.height}`);

// webteksten (NL in de bron, EN in en.json): 02-webtekst.md §1 en §2
const TEKST = {
  "In drie minuten: wat je met OS en Connect doet, wie eraan bouwt en hoe elke versie beter wordt. Gesproken in het Engels.":
    "In three minutes: what you do with OS and Connect, who builds them and how every version gets better. Spoken in English.",
  "SocialNow en vier partners, elk met een eigen rol.": "SocialNow and four partners, each with its own role.",
  "Visie, stijl, UI/UX en AI-workflows. Wij keuren elke versie goed voor die live gaat.": "Vision, style, UI/UX and AI workflows. We approve every version before it goes live.",
  "Bouwt SocialNow OS en de gedeelde basis voor OS en Connect: accounts, rechten en audit.": "Builds SocialNow OS and the shared foundation for OS and Connect: accounts, permissions and audit.",
  "Bouwt SocialNow Connect als eigen app, op die gedeelde basis.": "Builds SocialNow Connect as its own app, on that shared foundation.",
  "Brengt kennis van finance, data en operations.": "Brings finance, data and operations know-how.",
  "Volgende stap: gasttoegang. Nodig een expert uit in een deel van je OS, met een eigen login en alleen de rechten die jij geeft.": "Next: guest access. Invite an expert into part of your OS, with their own login and only the rights you give.",
  "Het OS en de gedeelde basis, gebouwd door Odoo-specialisten.": "The OS and its shared foundation, built by Odoo specialists.",
  "Connect, gebouwd als eigen app.": "Connect, built as its own app.",
  "Zo wordt elke versie beter.": "How every version gets better.",
  "Jij bepaalt wie wat ziet.": "You decide who sees what.",
  "Chatten met een expert opent nooit je OS.": "Chatting with an expert never opens your OS.",
  "Advertentiegeld binnen jouw budget.": "Ad spend within your budget.",
};
const bron = ["proposal/HeaderBestaand.tsx", "proposal/SamenEnVeilig.tsx"].map(f => fs.readFileSync(f, "utf8")).join("\n");
const en = JSON.parse(fs.readFileSync("proposal/i18n/en.json", "utf8"));
for (const [nl, eng] of Object.entries(TEKST)) eis(bron.includes(nl) && en[nl] === eng, `NL in de bron en EN in en.json: ${nl.slice(0, 48)}…`);
for (const taal of ["de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${taal}.json`, "utf8"));
  eis(Object.keys(TEKST).every(k => typeof w[k] === "string" && w[k].trim() && w[k] !== k && w[k] !== en[k]), `${taal}: de nieuwe teksten zijn vertaald (niet Engels)`);
}
const samen = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8");
eis(["SocialNow", "Indexworld", "Uncanny", "Komen Consultancy Operation Systems", "Attesso"].every(n => samen.includes(`wie: "${n}"`)), "vijf rollen: SocialNow, Indexworld, Uncanny, Komen, Attesso");
eis(!/drie bedrijven|registeraccountants|Geleid door CPA|nagekeken door accountants|direct in jouw systemen|Elke betaalvorm|Binnenkort/.test(samen), "geen geschrapte claims (drie bedrijven, CPA-leiding, direct in jouw systemen, elke betaalvorm, binnenkort)");
eis(/partnersLabel: "Hun partners"/.test(samen) && en["Hun partners"] === "Their partners", "de logobalk heet Hun partners: partners van Indexworld en Uncanny, niet van SocialNow");

if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  const nl = tekst("dist/nl/index.html"), enHtml = tekst("dist/index.html");
  eis(enHtml.includes(`socialnow-os-explainer-poster.jpg?v=${VERSIE}`), "gebouwde en-pagina laadt de nieuwe poster");
  eis(Object.keys(TEKST).slice(0, 2).every(k => nl.includes(k)), "gebouwde nl-pagina toont de nieuwe teksten");
  eis(Object.values(TEKST).slice(0, 2).every(k => enHtml.includes(k)), "gebouwde en-pagina toont de Engelse teksten");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
