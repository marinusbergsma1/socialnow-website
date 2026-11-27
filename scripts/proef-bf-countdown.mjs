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
eis(/BLACK FRIDAY DEAL/.test(bf) && /SocialNow-Logo-2026\.webp/.test(bf) && !/Social-Now-Logo-Breed-Wit/.test(bf), "blok heeft het glanzende SocialNow-logo (2026) met BLACK FRIDAY DEAL; niet het platte logo (Marinus 27 nov)");
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
eis(/GRATIS\s+WEBSITEDEMO/.test(lees("proposal/BlackFridayKop.tsx").replace(/<[^>]+>/g, " ")), "kop noemt websitedemo, rebranding en ad creatives");
eis(/Heel december, alleen voor bedrijven die serieus zijn over groei\./.test(gw) && /AI en menselijke experts/.test(gw), "uitleg volgt de video: heel december, serieus over groei, AI en experts");
eis(!/Wij maken jouw website, gratis/.test(gw), "oude websitekop is weg");
// 27 nov (Marinus), bij "Welke stijl spreekt je aan?": "Hier mogen nog meer websites staan doe ook maar de Black.." (NEW BLACK).
const stijlen = (gw.match(/const STIJLEN = \[([\s\S]*?)\];/) || [, ""])[1];
const ids = [...stijlen.matchAll(/id: "([^"]+)"/g)].map(m => m[1]);
eis(ids.includes("newblack") && ids.length >= 8, `stijlvraag toont minstens 8 websites, met NEW BLACK (nu ${ids.length})`);
eis(!/kwh/i.test(stijlen), "geen kWh-site in de stijlvraag (Marinus 4 nov)");
for (const b of [...stijlen.matchAll(/beeld: "([^"]+)"/g)].map(m => m[1])) eis(fs.existsSync("public" + b), `stijlbeeld bestaat: ${b}`);
// 27 nov (Marinus): "Verder 6 vragen 10 vragen van maken en iets over branding ook erbij."
const stappen = (gw.match(/const STAPPEN = \[([^\]]*)\]/) || [, ""])[1];
eis((stappen.match(/"[^"]+"/g) || []).length === 10, `onboarding heeft 10 vragen (nu ${(stappen.match(/"[^"]+"/g) || []).length})`);
eis(/Wat wil je deze december/.test(stappen) && /merk/.test(stappen) && /adverteren/.test(stappen), "vragen over de deal, het merk (branding) en adverteren");
eis(/extra\?: \[string, string\]\[\]/.test(lees("proposal/aanvragen.ts")) && /extra:/.test(gw), "nieuwe antwoorden gaan mee in de aanvraag");
// 27 nov (Marinus): "gekke teksten zoals de video, FLINK BLACK, AI MOUSE ICONEN DIE AF EN TOE IETS SELECTEREN, EEN TEKST DIE INFADE,
// KAPITALS ... ÉN REBRANDING ÉN AD CREATIVES!"
const held = lees("proposal/BlackFridayKop.tsx"), heldTekst = held.replace(/<[^>]+>/g, "");
eis(/<BlackFridayKop \/>/.test(gw) && /ÉN REBRANDING/.test(heldTekst) && /ÉN AD CREATIVES/.test(heldTekst), "kop in kapitalen: websitedemo, ÉN REBRANDING, ÉN AD CREATIVES");
eis(/gw2-muis/.test(held) && /gw2-muis/.test(css) && /gekozen/.test(held), "cursor die af en toe een woord selecteert");
// 27 nov (Marinus): "Doe maar 1 pijltje die elke keer een ander stuk tekst selecteerd. Deze." (de I-beam-tekstcursor)
eis((held.match(/className="gw2-muis"/g) || []).length === 1 && !/Developer|Designer/.test(held) && /gw2-ibeam/.test(held), "één I-beam-tekstcursor, geen naamlabels");
// 27 nov (Marinus): "Deze niet zo groot en iets rustiger selecteren en het selecteren in meerdere kleuren en infaden zoals de teksten
// bij het ELT project." en "na selecteren moet ie weer terug veranderen in een muis."
eis(/width="16"/.test(held) && /gw2-pijl/.test(held) && /dataset\.vorm = "pijl"/.test(held) && /dataset\.vorm = "tekst"/.test(held), "kleine cursor: pijl onderweg, I-beam bij selecteren, daarna weer pijl");
eis((held.match(/#[0-9a-f]{6}/gi) || []).filter((k, i, a) => a.indexOf(k) === i).length >= 4 && /KLEUREN/.test(held), "selecteren in meerdere kleuren (logokleuren)");
eis(/RUST = (\d+)/.test(held) && Number(held.match(/RUST = (\d+)/)[1]) >= 2500, "rustig tempo: minstens 2,5 s rust tussen selecties");
eis(/className="gw2-bw"/.test(held) && /\.gw2-bw\{[^}]*filter:blur\(10px\)/.test(css), "woorden faden in met blur, zoals ELT");
eis(/\.gw2-held-woord\{[^}]*background-size:0% 100%/.test(css) && /\.gw2-held-woord\.gekozen\{[^}]*background-size:100% 100%/.test(css), "selectie groeit van links naar rechts, zoals slepen");
// 27 nov (Marinus): "Verder Plan een Cal mag verder weg." Geen Plan een call-knop meer in de kop van /gratis-website.
eis(!/className="sn-pill" href=\{boekingsPlannerUrl\}/.test(gw), "geen Plan een call-knop in de kop van /gratis-website");
eis(/@keyframes gw2-kop-in/.test(css) && /prefers-reduced-motion:reduce\)\{[\s\S]{0,400}gw2-muis\{display:none/.test(css), "tekst fadet in; bij reduced motion geen muisjes");
eis(/\.gw2-held-woord\.gekozen\{[^}]*color:#fff/.test(css), "geselecteerd woord: witte tekst op groen");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
