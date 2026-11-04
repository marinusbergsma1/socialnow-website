#!/usr/bin/env node
// Proef (Marinus 20 okt 2026): "Ik wil nooit meer dan 1 regel met expertises altijd 1 balk en misschien al die vlakjes wel gewoon
// weg is voor later. Haal maar weg." en "Bekijk Connect mag ook naar dat onderdeel doorverwijzen."
// Gebruik: node scripts/check-connect-zonder-vlakjes.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const cx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8"), kop = fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8"), band = fs.readFileSync("proposal/HomeHeader.tsx", "utf8");
eis(!cx.includes('className="cx-chips"') && cx.includes('className="cx-zoek"'), "geen vakgebiedvlakjes meer, zoekveld blijft");
eis(/HomeConnectBand\(\)\{return <div className="sn-choice" id="connect">/.test(band), "Connect-blok op de homepage heeft het anker #connect");
const knop = kop.slice(kop.lastIndexOf("<a", kop.indexOf("<span>Bekijk Connect</span>")), kop.indexOf("<span>Bekijk Connect</span>"));
eis(knop.includes('href="#connect"') && knop.includes('getElementById("connect")') && !knop.includes('href="/connect/"'), "Bekijk Connect springt naar het Connect-blok");
// Sinds 4 november 2026 staat die header op /het-os, waar geen Connect-blok staat: daar gaat de knop naar de Connect-pagina.
eis(knop.includes('window.location.assign("/connect/")'), "Bekijk Connect gaat zonder Connect-blok naar /connect/");
if (process.argv.includes("--dist")) {
  for (const [f, os] of [["dist/nl/index.html", "dist/nl/het-os/index.html"], ["dist/index.html", "dist/het-os/index.html"]]) {
    const h = fs.readFileSync(f, "utf8"), o = fs.readFileSync(os, "utf8");
    eis(!h.includes('class="cx-chips"') && h.includes('id="connect"') && /href="#connect"[^>]*>(<span>)?(Bekijk Connect|Explore Connect)/.test(o), `${f}: geen vlakjes en het anker #connect; ${os}: knop Bekijk Connect`);
  }
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
