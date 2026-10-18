#!/usr/bin/env node
// Proef: de site-explainer v7 (18 okt 2026, 2:26,3, uit code): v6 (proef11) plus de scène "Custom OS" van 15 s na het
// verdienmodel: per onderdeel (website, CRM, content, ads, Studio, je eigen tools, Connect-experts) kies je standaard,
// je eigen of op maat, met als slot "Plan a call for custom OS". Bron: 04_OS-VIDEO/video-project/80-explainer-v7.
// Het videobestand is precies de webversie van proef proef01 (sha256).
// Eisen: 1) de speler laadt de nieuwe versie (cache-versie 20261018-v7) voor video én poster;
//        2) het videobestand is de nieuwe film (143–150 s, niet v6 van 131,3 s);
//        3) webgeschikt: H.264 1280×720, AAC, moov vóór mdat (snel starten), kleiner dan 40 MB;
//        4) de poster is 1280×720.
// Gebruik: node scripts/check-explainer-v7.mjs   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";

const VERSIE = "20261018-v7";
const SHA = "fc87456f2c9803f40ef3f74ec452cc82f316869554c33d555515dc0ae8dcfe87";
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
eis(duur > 143 && duur < 150, `video is de nieuwe film (143–150 s): ${duur.toFixed(1)} s`);
eis(beeld?.codec_name === "h264" && beeld.width === 1280 && beeld.height === 720, `H.264 1280×720: ${beeld?.codec_name} ${beeld?.width}×${beeld?.height}`);
eis(geluid?.codec_name === "aac", `AAC-geluid: ${geluid?.codec_name}`);
eis(mb < 40, `kleiner dan 40 MB: ${mb.toFixed(1)} MB`);
eis(crypto.createHash("sha256").update(fs.readFileSync(VIDEO)).digest("hex") === SHA, "videobestand is de webversie van v7 proef01 (sha256)");
const kop = fs.readFileSync(VIDEO).subarray(0, 4096).toString("latin1");
eis(kop.indexOf("moov") >= 0 && (kop.indexOf("mdat") < 0 || kop.indexOf("moov") < kop.indexOf("mdat")), "moov vóór mdat (faststart)");

const p = probe(POSTER, ["-show_entries", "stream=width,height"]).streams[0];
eis(p.width === 1280 && p.height === 720, `poster 1280×720: ${p.width}×${p.height}`);

console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
