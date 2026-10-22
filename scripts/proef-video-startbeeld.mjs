#!/usr/bin/env node
// Proef: startbeeld van de OS-film in de hero (22 oktober 2026). Rood op main ce8c917, groen op feat/video-startbeeld-20261022.
// Marinus vond het voorbeeldbeeld (een filmframe met water dat in een zwembad spat) een slecht moment. Gewenst: een donker vlak
// met een dunne witte rand, bovenaan SocialNow OS en SocialNow Connect even groot (bijgesneden bestanden uit het brein,
// 70-MERK/logo, Connect op 0,83 x de hoogte), in het midden de bestaande knop, daaronder één korte zin. HTML/CSS, geen
// nieuwe rasterafbeelding van het beeld, verdwijnt zodra de film speelt, in alle talen. Geen partnerlogo's (regel 19 okt 2026).
// De meting op 390 en 1440 breed (regels per taal, alles binnen de rand) staat in de PR; deze proef bewaakt de bron.
// Gebruik: node scripts/proef-video-startbeeld.mjs
import fs from "node:fs";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
const speler = lees("proposal/ExplainerPlayer.tsx");
const css = lees("proposal/explainer-player.css");
const hdr = lees("proposal/HeaderBestaand.tsx");
const ZIN = "In ruim twee minuten: wat je met het OS doet, wie het bouwt en wat het kost.";

// Afmetingen van een webp (VP8, VP8L of VP8X) zonder extra pakketten.
function webpMaat(f) {
  if (!fs.existsSync(f)) return null;
  const b = fs.readFileSync(f);
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const soort = b.toString("ascii", 12, 16);
  if (soort === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (soort === "VP8L") { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
  if (soort === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  return null;
}

// 1. Geen filmframe meer als voorbeeldbeeld van de OS-film, maar het startbeeld.
const start = speler.slice(speler.indexOf("function Startbeeld"), speler.indexOf("export default function ExplainerPlayer"));
eis(start.length > 0 && /const start = kind === "explainer" && !compact/.test(speler), "OS-film krijgt een startbeeld (component Startbeeld)");
eis(/\{start\s*\?\s*<button className="sn-explainer-cover sn-explainer-start"/.test(speler), "de knop in de hero toont het startbeeld in plaats van het filmframe");
eis(/poster=\{start \? undefined : poster\}/.test(speler), "ook in de speler geen zwembadframe als poster bij de OS-film");

// 2. Logo: SocialNow OS en SocialNow Connect even groot, bijgesneden bestanden uit het brein.
const os = webpMaat("public/images/merk/socialnow-os-bijgesneden.webp"), con = webpMaat("public/images/merk/socialnow-connect-bijgesneden.webp");
eis(start.includes('src="/images/merk/socialnow-os-bijgesneden.webp"') && start.includes('src="/images/merk/socialnow-connect-bijgesneden.webp"'), "startbeeld gebruikt beide bijgesneden logo's");
eis(os?.join("x") === "596x88", `OS-logo is de brein-uitsnede 596x88: ${os?.join("x") ?? "ontbreekt"}`);
eis(con && Math.abs(con[0] / con[1] - 1851 / 182) < 0.05, `Connect-logo heeft de verhouding van de brein-uitsnede 1851x182: ${con?.join("x") ?? "ontbreekt"}`);
eis(/\.sn-startbeeld-connect\{height:calc\(var\(--logo-h\) \* \.83\)\}/.test(css) && /\.sn-startbeeld-os\{height:var\(--logo-h\)\}/.test(css), "Connect op 0,83 x de hoogte van het OS-logo, zodat SocialNow even groot is");
eis(!/indexworld|uncanny|komen|attesso|partner/i.test(start), "geen partnerlogo's in het startbeeld (regel 19 okt 2026)");

// 3. Vlak, rand, knop, zin.
eis(/\.sn-explainer-cover\.sn-explainer-start\{[^}]*background:#000;[^}]*border:1px solid #ffffff/.test(css), "donker vlak met een dunne witte rand");
eis(/\.sn-explainer-start>\.sn-startbeeld\{[^}]*grid-template-rows:1fr auto 1fr[^}]*aspect-ratio:16\/9/.test(css), "logo boven, knop in het midden, zin eronder; vlak houdt 16:9 en groeit mee");
eis(/<span className="sn-pill"><span>\{label\}<\/span><span className="h-button-icon"><ArrowUpRight/.test(start), "de bestaande knop (label met pijl ernaast) staat in het startbeeld");
eis(/\.sn-startbeeld>\.sn-pill\{[^}]*background:#0b7a37 !important;[^}]*color:#fff !important/.test(css) && /\.sn-startbeeld>\.sn-pill \.h-button-icon\{background:#fff !important;color:#0b7a37 !important\}/.test(css), "knop groen met witte tekst, icoon wit met groen; nooit zwart");
eis(/font-variant-ligatures:none/.test(css.slice(css.indexOf(".sn-explainer-cover.sn-explainer-start{"))), "letters nooit aan elkaar (geen ligaturen)");
eis(speler.includes(`const STARTZIN = "${ZIN}"`) && start.includes("{STARTZIN}"), "één korte uitlegzin onder de knop");
eis(!hdr.includes("In ruim twee minuten") && /film === "connect" && <p className="bs-explainer-onder">/.test(hdr), "de OS-zin staat niet nog eens onder de speler");

// 4. Verdwijnt zodra de film speelt.
eis(/\{start && !started && <button className="sn-explainer-cover sn-explainer-start sn-video-startlaag"/.test(speler) && /onPlay=\{\(\) => \{ setPaused\(false\); setStarted\(true\); \}\}/.test(speler), "in de speler ligt het startbeeld over de film tot die speelt");

// 5. Alle talen.
for (const taal of ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"]) {
  const w = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const en = JSON.parse(lees("proposal/i18n/en.json") || "{}");
  const v = w[ZIN];
  eis(typeof v === "string" && v.trim() && v !== ZIN && (taal === "en" || v !== en[ZIN]) && !/Engels|English|Englisch|anglais|inglés|inglese|inglês|angielsku|engelska|engelsk/i.test(v), `${taal}: zin vertaald${v ? `: ${v.slice(0, 44)}…` : ""}`);
}

console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
