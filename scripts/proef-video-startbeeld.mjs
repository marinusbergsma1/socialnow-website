#!/usr/bin/env node
// Proef: startbeeld van de OS-film in de hero (22 oktober 2026). Rood op main ce8c917, groen op feat/video-startbeeld-20261022.
// Marinus vond het voorbeeldbeeld (een filmframe met water dat in een zwembad spat) een slecht moment. Gewenst, strak en zakelijk,
// vertrouwen vóór de film start: donker vlak met dunne witte rand; boven SocialNow OS x Indexworld en SocialNow Connect x Uncanny
// (partners hier wél, dat gaat op deze plek voor de regel van 19 okt); SocialNow in beide logo's even groot en geen schuine streep
// in het Connect-logo; midden een grote afspeelknop (transparant, groene rand, kleine zwarte outline) met één zin; onder Trusted by
// met eerlijke route (AZ en Supperclub direct, Universal, Warner Bros., MOJO, IMAX en Marvel via Crafture), bestaande logobestanden.
// HTML/CSS, verdwijnt zodra de film speelt, alle talen. De knop op de Connect-film krijgt het ontwerp van de blauwe knoppen links.
// De meting op 390 en 1440 breed (regels per taal, alles binnen de rand, contrast) staat in de PR; deze proef bewaakt de bron.
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

// 2. Logo's boven: SocialNow even groot, Connect zonder schuine streep, met de partners.
const os = webpMaat("public/images/merk/socialnow-os-bijgesneden.webp"), con = webpMaat("public/images/merk/socialnow-connect.webp");
// Later op 22 oktober: boven geen paren meer maar Software Partners met één balk, zie scripts/proef-software-partners.mjs.
eis(start.includes("Software Partners") && !start.includes("sn-startbeeld-paren"), "boven Software Partners in plaats van de paren");
eis(os?.join("x") === "596x88", `OS-logo is de brein-uitsnede 596x88: ${os?.join("x") ?? "ontbreekt"}`);
eis(con && Math.abs(con[0] / con[1] - 1359 / 153) < 0.05, `Connect-logo is het site-logo, bijgesneden tot 1359x153: ${con?.join("x") ?? "ontbreekt"}`);
eis(/\.sn-startbeeld-connect\{height:calc\(var\(--logo-h\) \* 1\.017\)\}/.test(css) && /\.sn-startbeeld-os\{height:var\(--logo-h\)\}/.test(css), "Connect op 1,017 x de hoogte: woord SocialNow even breed als in het OS-logo (3,955 tegen 3,889)");
eis(start.includes('src="/images/home-header/indexworld.png"') && start.includes('src="/images/home-header/uncanny-op-zwart.svg"'), "partners Indexworld en Uncanny staan in het startbeeld");

// 3. Vlak, knop, zin, Trusted by.
eis(/\.sn-explainer-cover\.sn-explainer-start\{[^}]*background:#000;[^}]*border:1px solid #ffffff/.test(css), "donker vlak met een dunne witte rand");
eis(/\.sn-explainer-start>\.sn-startbeeld\{[^}]*grid-template-rows:auto 1fr auto[^}]*aspect-ratio:16\/9/.test(css), "logo's boven, knop en zin in het midden, Trusted by onder; vlak houdt 16:9 en groeit mee");
eis(/<span className="sn-pill sn-startbeeld-knop"><span>\{label\}<\/span><span className="h-button-icon"><ArrowUpRight/.test(start), "de afspeelknop (label met pijl ernaast) staat in het startbeeld");
eis(/\.sn-startbeeld-midden>\.sn-pill\{--sn-pill-height:62px;[^}]*background:transparent !important;[^}]*outline:1\.5px solid #000/.test(css) && /\.sn-startbeeld-knop \.h-button-icon\{color:#002912 !important\}/.test(css), "afspeelknop groot, transparant, groene rand, kleine zwarte outline, donkere pijl op groen rondje");
eis(/font-variant-ligatures:none/.test(css.slice(css.indexOf(".sn-explainer-cover.sn-explainer-start{"))), "letters nooit aan elkaar (geen ligaturen)");
eis(speler.includes(`const STARTZIN = "${ZIN}"`) && start.includes("{STARTZIN}"), "één korte uitlegzin onder de knop");
eis(!hdr.includes("In ruim twee minuten") && /film === "connect" && <p className="bs-explainer-onder">/.test(hdr), "de OS-zin staat niet nog eens onder de speler");
const lijst = (naam) => { const i = speler.indexOf(`const ${naam} = [`); return i < 0 ? "" : speler.slice(i, speler.indexOf("];", i)); };
const direct = lijst("DIRECT"), crafture = lijst("VIA_CRAFTURE");
eis(["AZ", "Supperclub"].every(n => direct.includes(`naam: "${n}"`)) && ["Universal", "Warner Bros.", "MOJO", "IMAX", "Marvel"].every(n => crafture.includes(`naam: "${n}"`)), "Trusted by: AZ en Supperclub direct, Universal, Warner Bros., MOJO, IMAX en Marvel via Crafture");
// Later op 22 oktober: de route als Crafture-logo in plaats van tekst, zie scripts/proef-crafture-logo.mjs.
eis(start.includes('{merk(CRAFTURE)}<i className="sn-startbeeld-streep" /><span className="sn-startbeeld-groep">{VIA_CRAFTURE.map(merk)}</span>'), "de route via Crafture staat er eerlijk bij (Crafture-logo, streep, de vijf merken)");
const bestanden = [...(direct + crafture).matchAll(/src: "([^"]+)"/g)].map(m => m[1]);
eis(bestanden.length >= 7 && bestanden.every(b => fs.existsSync(`public${b}`)), `alle zeven logo's zijn bestaande bestanden: ${bestanden.filter(b => !fs.existsSync(`public${b}`)).join(", ") || "ja"}`);
eis(/\.sn-startbeeld-merken img\{[^}]*filter:brightness\(0\) invert\(1\);opacity:\.72\}/.test(css), "Trusted by rustig van kleur");

// 3b. Knop op de Connect-film: zoals de blauwe knoppen links in de hero, met kleine zwarte outline.
eis(/\.sn-explainer-cover>\.sn-pill\.sn-pill-connect\{[^}]*background:#00000080 !important;border-color:#20afde !important;outline:1\.5px solid #000/.test(css) && /\.sn-explainer-cover>\.sn-pill\.sn-pill-connect \.h-button-icon\{background:#20afde !important;color:#05282e !important\}/.test(css), "Connect-knop: geen blauwe vulling meer, blauwe rand, blauw pijlrondje, kleine zwarte outline");

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
