#!/usr/bin/env node
// Proef: 3D-effect op foto's zoals Apple's ruimtelijke foto's. Marinus, 4 november 2026: "Of een 3D effect zoals Apple nu ook heeft
// met die foto's maar ga daar maar mee aan de slag als dit staat." Eerst de Atomium-foto in de homepage-hero: een echte dieptekaart,
// lagen bewegen met de muis (op touch rustig vanzelf), niets bij reduced motion of zonder WebGL, en pauze buiten beeld.
// Gebruik: node scripts/check-foto-3d.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
eis(fs.existsSync("public/images/verhaal/team-atomium-diepte.webp") && fs.statSync("public/images/verhaal/team-atomium-diepte.webp").size < 80000, "dieptekaart van de Atomium-foto bestaat en is klein (< 80 kB)");
const d = lees("proposal/Diepte3D.tsx");
eis(/getContext\("webgl"/.test(d) && d.includes("uDiepte") && d.includes("uMuis"), "WebGL-shader verschuift de foto per diepte met de muis");
eis(d.includes("prefers-reduced-motion") && d.includes("return;") , "niets bij prefers-reduced-motion (gewone foto blijft)");
eis(d.includes("IntersectionObserver") && d.includes("cancelAnimationFrame"), "pauzeert buiten beeld en ruimt op");
eis(d.includes("(hover: none)") || d.includes("pointer: coarse"), "op touch beweegt het rustig vanzelf");
const kop = lees("proposal/HeaderAlgemeen.tsx");
const foto = kop.slice(kop.indexOf("export function AtomiumFoto"), kop.indexOf("export default function HeaderAlgemeen"));
eis(foto.includes("<Diepte3D") && foto.includes('src="/images/verhaal/team-atomium.webp"') && foto.includes("team-atomium-diepte.webp"), "Atomium-foto gebruikt Diepte3D en houdt de gewone foto (alt-tekst, terugval)");
eis(/sn-alg-knop-video[^>]*onClick=\{open\}/.test(foto), "Bekijk de video blijft werken");
if (process.argv.includes("--dist")) {
  eis(fs.existsSync("dist/images/verhaal/team-atomium-diepte.webp"), "dieptekaart zit in de build");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
