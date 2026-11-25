#!/usr/bin/env node
// Proef, Marinus 25 nov 2026 (avond): de groene balk was "lelijk". "Ik wil m hetzelfde als deze [de Website-actie-pil] maar dan een
// witte variant die opvult met wit bij speel video af vervolgens veranderd ie in groen [...] terug van rechts naar links." en "Dus hij
// vult bij hover, dan bij klik nogsteeds hetzelfde maar terwijl die terug gaat veranderd ie van kleur en veranderd de tekst in neem
// contact op." Plus: de foto die naar beneden wijst als startbeeld ("Gebruik deze maar") en de partnerlogo's als slider.
// Rood op main, groen na de wijziging.
import fs from "node:fs";
import crypto from "node:crypto";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const tsx = lees("proposal/HeaderAlgemeen.tsx"), css = lees("proposal/header-algemeen.css");
const THUMB = "public/video/explainer/socialnow-explainer-5x4-thumb.jpg";
const hash = fs.existsSync(THUMB) ? crypto.createHash("sha256").update(fs.readFileSync(THUMB)).digest("hex").slice(0, 12) : "";
eis(hash === "b05700cf258b", "startbeeld is de hele foto die Marinus stuurde (1350×1080, niet bijgesneden)");
eis(fs.existsSync(THUMB) && fs.statSync(THUMB).size < 250_000, "startbeeld kleiner dan 250 KB");
eis(/\.sn-alg-filmknop\{[^}]*border-radius:999px/.test(css) && /\.sn-alg-filmknop\{[^}]*text-transform:uppercase/.test(css), "knop is een pil zoals Website-actie, hoofdletters");
eis(/\.sn-alg-filmknop\{[^}]*width:100%/.test(css) && /\.sn-alg-filmknop\{[^}]*border:2px solid #fff/.test(css), "witte variant, even breed als de video");
eis(/\.sn-alg-filmknop:is\(:hover,:focus-visible\)::before\{[^}]*translateX\(0\)/.test(css) && /\.sn-alg-filmknop::before\{[^}]*background:#fff/.test(css), "bij hover vult hij met wit");
eis(/\[data-stand="call"\]::after\{[^}]*animation:sn-alg-veeg/.test(css) && /\.sn-alg-filmknop::after\{[^}]*translateX\(101%\)/.test(css) && /\.sn-alg-filmknop::after\{[^}]*#25d366/.test(css), "na de klik veegt groen van rechts naar links over de knop");
eis(/\[data-stand="call"\]::before\{[^}]*translateX\(-101%\)/.test(css), "het wit trekt zich terug terwijl het groen komt");
eis(/Speel video af/.test(tsx) && /Neem contact op/.test(tsx), "tekst Speel video af wordt Neem contact op");
eis(/className="rond"/.test(tsx) && /\.sn-alg-filmknop \.rond\{[^}]*border-radius:50%/.test(css), "rond icoon rechts in de pil");
eis(/sn-alg-keur-baan/.test(tsx) && /@keyframes sn-alg-keur-loop/.test(css), "partnerlogo's lopen als slider");
eis(/prefers-reduced-motion:reduce\)\{[^@]*sn-alg-keur-baan/.test(css) && /prefers-reduced-motion:reduce\)\{[^@]*\.sn-alg-filmknop/.test(css), "geen beweging bij reduced motion");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
