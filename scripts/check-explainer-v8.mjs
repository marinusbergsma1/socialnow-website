#!/usr/bin/env node
// Proef: de site-explainer v8 (21 okt 2026, OS-film v9 2:08 en Connect-film v1 1:02, uit code): v7 plus hoe SocialNow OS en SocialNow Connect samenwerken,
// wie eraan bouwt (SocialNow, INDEXWORLD, Uncanny, Komen Consultancy Operation Systems, Attesso) en wat het kost (custom OS en prijzen).
// Bron: 04_OS-VIDEO/video-project/81-explainer-v8 (bouw_v8.py). Webteksten: 81-explainer-v8/werk/02-webtekst.md (DEFINITIEF).
// Eisen: 1) de speler laadt de nieuwe versie (cache-versie 20261020-v8) voor video én poster;
//        2) het videobestand is de OS-film v9 (120–135 s, niet v7 van 146,3 s) en precies de webversie van v9-os01 (sha256);
//        3) webgeschikt: H.264 1280×720, AAC, moov vóór mdat (snel starten), kleiner dan 40 MB; poster 1280×720;
//        4) de regel onder de speler en het blok "Samen bouwen" (rollen, verbetercyclus, wie wat ziet) staan in de bron en in en.json;
//        5) niets meer van wat 01-bronnen §3b schrapt ("drie bedrijven", CPA-leiding, "direct in jouw systemen").
// Gebruik: node scripts/check-explainer-v8.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";

const VERSIE = "20261021-v9";
const SHA = "ec952eeee6848257d10213b5f957d24fc1ba81717234dbd49adc2b97a7224dbe";   // 81-explainer-v8/renders/explainer-v9-os01-web.mp4 (OS-film v9, 2:08)
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
eis(duur > 120 && duur < 135, `video is de OS-film v9 (120–135 s): ${duur.toFixed(1)} s`);
eis(beeld?.codec_name === "h264" && beeld.width === 1280 && beeld.height === 720, `H.264 1280×720: ${beeld?.codec_name} ${beeld?.width}×${beeld?.height}`);
eis(geluid?.codec_name === "aac", `AAC-geluid: ${geluid?.codec_name}`);
eis(mb < 40, `kleiner dan 40 MB: ${mb.toFixed(1)} MB`);
eis(crypto.createHash("sha256").update(fs.readFileSync(VIDEO)).digest("hex") === SHA, "videobestand is de webversie van v9-os01 (sha256)");
const kop = fs.readFileSync(VIDEO).subarray(0, 4096).toString("latin1");
eis(kop.indexOf("moov") >= 0 && (kop.indexOf("mdat") < 0 || kop.indexOf("moov") < kop.indexOf("mdat")), "moov vóór mdat (faststart)");
const p = probe(POSTER, ["-show_entries", "stream=width,height"]).streams[0];
eis(p.width === 1280 && p.height === 720, `poster 1280×720: ${p.width}×${p.height}`);

// tweede speler: de Connect-film in het Connect-blok (82-connect-film-v1), eigen poster en cachebuster
const C_VERSIE = "20261021-c2", C_VIDEO = "public/video/connect/socialnow-connect-film.mp4", C_POSTER = "public/video/connect/socialnow-connect-film-poster.jpg";
const C_SHA = "b8b87db33efe906200e24ace9da66cae95c7ea59b1cf804591269cef5faf2b7e";   // 82-connect-film-v1/renders/connect-c1-02-web.mp4 (Connect-film v1, 1:02, eigen muziek)
const experts = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8");
eis(speler.includes(`/video/connect/socialnow-connect-film.mp4?v=${C_VERSIE}`) && speler.includes(`/video/connect/socialnow-connect-film-poster.jpg?v=${C_VERSIE}`), `Connect-speler laadt film en poster met ?v=${C_VERSIE}`);
eis(/<ExplainerPlayer kind="connect"/.test(experts), "het Connect-blok (ConnectExperts.tsx) heeft de tweede speler");
if (fs.existsSync(C_VIDEO) && fs.existsSync(C_POSTER)) {
  const cv = probe(C_VIDEO, ["-show_entries", "format=duration,size:stream=codec_type,codec_name,width,height"]);
  const cd = +cv.format.duration, cb = cv.streams.find(s => s.codec_type === "video"), cg = cv.streams.find(s => s.codec_type === "audio");
  eis(cd > 55 && cd < 90 && cb?.codec_name === "h264" && cb.width === 1280 && cb.height === 720 && cg?.codec_name === "aac" && +cv.format.size < 15e6, `Connect-film 55–90 s, H.264 1280×720, AAC, < 15 MB: ${cd.toFixed(1)} s`);
  eis(crypto.createHash("sha256").update(fs.readFileSync(C_VIDEO)).digest("hex") === C_SHA, "Connect-film is de webversie van de render (sha256)");
  const ck = fs.readFileSync(C_VIDEO).subarray(0, 4096).toString("latin1");
  eis(ck.indexOf("moov") >= 0 && (ck.indexOf("mdat") < 0 || ck.indexOf("moov") < ck.indexOf("mdat")), "Connect-film: moov vóór mdat (faststart)");
  const cp = probe(C_POSTER, ["-show_entries", "stream=width,height"]).streams[0];
  eis(cp.width === 1280 && cp.height === 720, `Connect-poster 1280×720: ${cp.width}×${cp.height}`);
} else eis(false, "Connect-film en poster staan in public/video/connect/");

// webteksten (NL in de bron, EN in en.json): 02-webtekst.md §1 en §2
const TEKST = {
  "In ruim twee minuten: wat je met het OS doet, wie het bouwt en wat het kost. Gesproken in het Engels.":
    "In just over two minutes: what you do with the OS, who builds it and what it costs. Spoken in English.",
  "SocialNow en vier partners, elk met een eigen rol.": "SocialNow and four partners, each with its own role.",
  "In één minuut: zelf je expert kiezen, wat een expert van je ziet, de pakketten en onze groeigarantie. Gesproken in het Engels.": "In one minute: choosing your own expert, what an expert sees, the packages and our growth guarantee. Spoken in English.",
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
const bron = ["proposal/HeaderBestaand.tsx", "proposal/SamenEnVeilig.tsx", "proposal/ConnectExperts.tsx"].map(f => fs.readFileSync(f, "utf8")).join("\n");
const en = JSON.parse(fs.readFileSync("proposal/i18n/en.json", "utf8"));
for (const [nl, eng] of Object.entries(TEKST)) eis(bron.includes(nl) && en[nl] === eng, `NL in de bron en EN in en.json: ${nl.slice(0, 48)}…`);
for (const taal of ["de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${taal}.json`, "utf8"));
  eis(Object.keys(TEKST).every(k => typeof w[k] === "string" && w[k].trim() && w[k] !== k && w[k] !== en[k]), `${taal}: de nieuwe teksten zijn vertaald (niet Engels)`);
}
const samen = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8");
eis(["SocialNow", "Indexworld", "Uncanny", "Komen Consultancy Operation Systems", "Attesso"].every(n => samen.includes(`wie: "${n}"`)), "vijf rollen: SocialNow, Indexworld, Uncanny, Komen, Attesso");
eis(!/drie bedrijven|registeraccountants|Geleid door CPA|nagekeken door accountants|direct in jouw systemen|Elke betaalvorm|Binnenkort/.test(samen), "geen geschrapte claims (drie bedrijven, CPA-leiding, direct in jouw systemen, elke betaalvorm, binnenkort)");
eis(/status: "werkt"/.test(samen) && /status: "bouwt"/.test(samen) && /status: "volgt"/.test(samen) && ["Werkt al", "In ontwikkeling", "Volgende stap"].every(k => en[k] && en[k] !== k),
  "wie wat ziet: werkt al, in ontwikkeling en volgende stap hebben elk een eigen icoon en label (review 6a.3)");
eis(/partnersLabel: "Hun partners"/.test(samen) && en["Hun partners"] === "Their partners", "de logobalk heet Hun partners: partners van Indexworld en Uncanny, niet van SocialNow");

// schakelaar boven de header-speler (Marinus 21 okt 2026): OS en Connect in één speler, OS standaard, regel eronder wisselt mee
const hdr = fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8"), hdrCss = fs.readFileSync("proposal/header-bestaand.css", "utf8");
eis(/useState<"os" \| "connect">\("os"\)/.test(hdr), "header: filmkeuze met OS als standaard");
eis(/className="bs-filmkeuze"/.test(hdr) && (hdr.match(/aria-pressed=\{film === "(os|connect)"\}/g) || []).length === 2, "header: schakelaar met twee knoppen en aria-pressed");
eis(/<span translate="no">SocialNow OS<\/span>/.test(hdr) && /<span translate="no">SocialNow Connect<\/span>/.test(hdr) && /<LayoutDashboard /.test(hdr) && /<Users /.test(hdr), "header: SocialNow OS en SocialNow Connect, elk met een icoon naast de tekst");
eis(/<ExplainerPlayer key="connect" kind="connect"/.test(hdr) && /<ExplainerPlayer key="os"/.test(hdr), "header: de schakelaar wisselt de speler tussen de OS-film en de Connect-film");
eis(/film === "os"\s*\? "In ruim twee minuten/.test(hdr) && hdr.includes("In één minuut: zelf je expert kiezen"), "header: de regel onder de speler wisselt mee");
eis(/\.bs-film-os\.is-aan\{background:#0B7A37;color:#fff\}/.test(hdrCss) && /\.bs-film-connect\.is-aan\{background:#00739E;color:#fff\}/.test(hdrCss) && !/bs-filmkeuze[^}]*(#000|black)/.test(hdrCss), "header: actief groen of blauw met witte tekst, nooit zwart");
eis(/\.bs-explainer-onder\{min-height:/.test(hdrCss) && en["Kies een film"] === "Choose a film", "header: vaste hoogte onder de speler (geen verspringen) en vertaald groepslabel");

if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  const nl = tekst("dist/nl/index.html"), enHtml = tekst("dist/index.html");
  eis(enHtml.includes(`socialnow-os-explainer-poster.jpg?v=${VERSIE}`), "gebouwde en-pagina laadt de nieuwe poster");
  eis(Object.keys(TEKST).slice(0, 2).every(k => nl.includes(k)), "gebouwde nl-pagina toont de nieuwe teksten");
  eis(Object.values(TEKST).slice(0, 2).every(k => enHtml.includes(k)), "gebouwde en-pagina toont de Engelse teksten");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
