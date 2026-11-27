#!/usr/bin/env node
// Proef, 27 nov 2026 (Marinus): "Ik wil graag ook hier de contentsliders etc BLACK FRIDAY LOGO met een countdown timer." Op /gratis-website
// vervangt een Black Friday-blok de twee websitetegels: logo, countdown tot 31 december 23:59 (keuze Marinus) en twee schuivende rijen werk.
// Rood op main, groen op de tak.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const gw = lees("proposal/GratisWebsite.tsx"), bf = lees("proposal/BlackFridayBlok.tsx"), css = lees("proposal/gratis-website-wit.css");

eis(/<BlackFridayBlok \/>/.test(gw) && !/className="gw2-stapel"/.test(gw), "/gratis-website toont het Black Friday-blok in plaats van de twee websitetegels");
eis(/BLACK FRIDAY DEAL/.test(bf) && /Social-Now-Logo-Breed-Wit\.webp/.test(bf), "blok heeft het SocialNow-logo met BLACK FRIDAY DEAL");
eis(/2026-12-31T23:59:59\+01:00/.test(bf), "countdown loopt tot 31 december 2026 23:59 (Amsterdam)");
eis(/setInterval\([^,]+,\s*1000\)/.test(bf) && /Dagen/.test(bf) && /Uren/.test(bf) && /Min/.test(bf) && /Sec/.test(bf), "countdown telt per seconde: dagen, uren, minuten, seconden");
eis(/useState<number \| null>\(null\)/.test(bf), "countdown pas na laden berekend (geen verschil met de prerender)");
const rij = (bf.match(/const RIJ_(WERK|SITES)\s*=\s*\[([\s\S]*?)\];/g) || []);
eis(rij.length === 2, "twee rijen: content en websites");
for (const p of [...bf.matchAll(/"(\/(?:images|screenshots)\/[^"]+\.webp)"/g)].map(m => m[1])) eis(fs.existsSync("public" + p), `beeld bestaat: ${p}`);
eis(/@keyframes gw2-bf-loop/.test(css) && /prefers-reduced-motion:reduce\)\{[\s\S]{0,200}gw2-bf-baan\{animation:none/.test(css), "rijen schuiven, en staan stil bij reduced motion");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
eis(!/€/.test(bf), "geen prijzen in het blok");
// 27 nov (Marinus): "Eindig de Nederlandse versie weer gwn op de Thumbnail." Na afloop laadt de film opnieuw, zodat de poster terugkomt.
const kop = lees("proposal/HeaderAlgemeen.tsx");
eis(/className="sn-alg-dealfilm"[\s\S]{0,400}onEnded=\{\(\) => \{[^}]*\.load\(\)/.test(kop), "dealfilm eindigt weer op de thumbnail (load na afloop)");
// 27 nov (Marinus): "Bellen mag wel weg hier. Gewoon Plan een Call of Whatsapp." Zwevende balk: alleen Plan een call en WhatsApp.
const belapp = lees("proposal/BelApp.tsx");
eis(!/<span>Bellen<\/span>/.test(belapp) && !/belLink/.test(belapp) && /sn-bel-app-call" href=\{boekingsPlannerUrl\}/.test(belapp) && /href=\{appLink\(\)\}/.test(belapp), "zwevende balk: alleen Plan een call en WhatsApp");
// 27 nov (Marinus): "De COPY MOET VEEL BETER AANSLUITEN OP de video zelf, we doen namelijk veel meer dan alleen de websites."
// In de video: AI en menselijke experts samen voor groei; heel december naast de gratis websitedemo ook gratis rebranding en ad creatives;
// alleen voor bedrijven die serieus zijn over groei; plan een call.
eis(/<h1 id="gw2-kop">Gratis websitedemo, rebranding en ad creatives<span className="sn-alg-punt">\.<\/span><\/h1>/.test(gw), "kop noemt websitedemo, rebranding en ad creatives");
eis(/Heel december, alleen voor bedrijven die serieus zijn over groei\./.test(gw) && /AI en menselijke experts/.test(gw), "uitleg volgt de video: heel december, serieus over groei, AI en experts");
eis(!/Wij maken jouw website, gratis/.test(gw), "oude websitekop is weg");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
