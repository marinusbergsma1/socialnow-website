#!/usr/bin/env node
// Proef: "In partnership with:" in het startbeeld van de OS-film (22 oktober 2026). Rood op main e556542, groen op feat/crafture-logo-20261022.
// Marinus liet een referentie zien: één rij logo's op zwart, in kleur, gescheiden door een kleine grijze x:
// SocialNow OS x attesso x Komen Consultancy (Operation Systems) x Uncanny x Indexworld. In het startbeeld: bovenaan SocialNow OS en
// SocialNow Connect even groot, daaronder de regel "In partnership with:" met attesso x Komen x Uncanny x Indexworld.
// Komen en Attesso uit 05_SALES/12PROCENT-2026-10-20/partnerblok (de echte bestanden), Indexworld en Uncanny zoals op de site.
// Nooit het oude chrome-lockup "SocialNow OS x Komen" uit _PRULLENBAK. De Trusted by-rij blijft eronder.
// De meting op 390 en 1440 breed staat in de PR; deze proef bewaakt de bron.
// Gebruik: node scripts/proef-partnership.mjs
import fs from "node:fs";
import crypto from "node:crypto";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
const sha = (f) => (fs.existsSync(f) ? crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex") : "");
const speler = lees("proposal/ExplainerPlayer.tsx");
const css = lees("proposal/explainer-player.css");
const start = speler.slice(speler.indexOf("function Startbeeld"), speler.indexOf("export default function ExplainerPlayer"));

// Afmetingen van een webp zonder extra pakketten.
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

// 1. Bovenaan SocialNow OS en SocialNow Connect, even groot, zonder schuine streep.
eis(start.includes('src="/images/merk/socialnow-os-bijgesneden.webp"') && start.includes('src="/images/merk/socialnow-connect.webp"'), "bovenaan SocialNow OS en SocialNow Connect");
eis(/\.sn-startbeeld-connect\{height:calc\(var\(--logo-h\) \* 1\.017\)\}/.test(css), "SocialNow even groot in beide logo's (Connect op 1,017 x de hoogte)");

// 2. De regel In partnership with: met vier partners, gescheiden door een kleine grijze x.
const partnerdeel = start.slice(start.indexOf('className="sn-startbeeld-partnerschap"'), start.indexOf('className="sn-startbeeld-midden"'));
eis(partnerdeel.length > 0 && partnerdeel.includes('<span className="sn-startbeeld-label" translate="no">In partnership with:</span>'), 'regel "In partnership with:" boven de partnerlogo\'s');
const volgorde = ["ATTESSO-MARK.png", "komen-operation-systems-partnerblok.webp", "uncanny-op-zwart.svg", "indexworld.png"].map(s => partnerdeel.indexOf(s));
eis(volgorde.every(i => i > 0) && volgorde.every((i, n) => n === 0 || i > volgorde[n - 1]), "volgorde: attesso, Komen Consultancy Operation Systems, Uncanny, Indexworld");
eis((partnerdeel.match(/<X className="sn-startbeeld-x[ "]/g) || []).length === 3, "drie keer een x tussen vier logo's");
eis(/\.sn-startbeeld-x\{[^}]*color:#7d8f86/.test(css), "de x is klein en grijs");

// 3. Echte bestanden, in kleur, nooit het oude lockup.
eis(sha("public/images/merken/ATTESSO-MARK.png") === "5ccb83a8ece77d15c78576be3be0a4fde4e471c81528d3826fa82d096e8ad7b7", "attesso: het beeldmerk uit het partnerblok, byte voor byte");
eis(webpMaat("public/images/merken/komen-operation-systems-partnerblok.webp")?.join("x") === "900x143", "Komen Consultancy Operation Systems: het bestand uit het partnerblok (900x143), alleen omgezet naar webp");
eis(/<span className="sn-startbeeld-attesso"><img[^>]*ATTESSO-MARK\.png[^>]*\/><span translate="no">Attesso<\/span><\/span>/.test(partnerdeel), "attesso zoals in het partnerblok: beeldmerk met de naam ernaast");
eis(![...(speler + css).matchAll(/(?:src="|url\()([^")]+)/g)].some(m => /prullenbak|lockup|socialnow-os-x-komen|komen-x-socialnow|chrome/i.test(m[1])), "nergens het oude chrome-lockup SocialNow OS x Komen als beeld");
eis(!/\.sn-startbeeld-partnerschap img\{[^}]*grayscale/.test(css), "partnerlogo's in kleur, geen grijsfilter");

// 4. Trusted by blijft eronder.
eis(start.indexOf('className="sn-startbeeld-partnerschap"') < start.indexOf('className="sn-startbeeld-trusted"') && start.includes("{merk(CRAFTURE)}"), "Trusted by met het Crafture-logo blijft onder het startbeeld");

console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
