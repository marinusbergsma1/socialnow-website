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
// 27 nov (Marinus): "Die moet ook ipv de timer mijn video laten zien. Dus video en daaronder die slider." De timer en het losse logo
// zijn weg; de Black Friday-film (met de thumbnail als startbeeld, die het logo al heeft) staat erboven.
eis(/const FILM = "\/video\/black-friday\/socialnow-black-friday-5x4-nl\.mp4"/.test(bf) && /const POSTER = "\/video\/black-friday\/socialnow-black-friday-thumbnail\.jpg"/.test(bf) && /<video[^>]*src=\{FILM\} poster=\{POSTER\}/.test(bf), "blok toont de Black Friday-film met de thumbnail als startbeeld");
eis(!/gw2-bf-klok|2026-12-31T23:59/.test(bf), "geen countdown meer in het blok");
eis(/\.load\(\)/.test(bf) && /onEnded/.test(bf), "film eindigt weer op de thumbnail");
eis(bf.indexOf("<video") < bf.indexOf("<Rij "), "video boven de slider");
const rij = (bf.match(/const RIJ_(WERK|SITES)\s*=\s*\[([\s\S]*?)\];/g) || []);
eis((bf.match(/<Rij /g) || []).length === 1 && /RIJ_WERK[\s\S]{0,120}RIJ_SITES/.test(bf), "één rij: content en websites om en om (Marinus: \"1 row\")");
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
eis(((held.split("export function ShowcaseKop")[0]).match(/className="gw2-muis"/g) || []).length === 1 && !/Developer|Designer/.test(held) && /gw2-ibeam/.test(held), "één I-beam-tekstcursor, geen naamlabels");
// 27 nov (Marinus): "Deze niet zo groot en iets rustiger selecteren en het selecteren in meerdere kleuren en infaden zoals de teksten
// bij het ELT project." en "na selecteren moet ie weer terug veranderen in een muis."
eis(/width="16"/.test(held) && /gw2-pijl/.test(held) && /dataset\.vorm = "pijl"/.test(held) && /dataset\.vorm = "tekst"/.test(held), "kleine cursor: pijl onderweg, I-beam bij selecteren, daarna weer pijl");
eis((held.match(/#[0-9a-f]{6}/gi) || []).filter((k, i, a) => a.indexOf(k) === i).length >= 4 && /KLEUREN/.test(held), "selecteren in meerdere kleuren (logokleuren)");
// 27 nov (Marinus): "Het selecteren van de woorden mag nog iets sneller gaan."
const getal = (n) => Number((held.match(new RegExp(n + " = (\\d+)")) || [])[1]);
eis(getal("BEWEEG") <= 750 && getal("SLEEP") <= 800 && getal("RUST") >= 1500 && getal("RUST") <= 2200, `sneller selecteren (beweeg ${getal("BEWEEG")}, sleep ${getal("SLEEP")}, rust ${getal("RUST")} ms)`);
eis(/className="gw2-bw"/.test(held) && /\.gw2-bw\{[^}]*filter:blur\(10px\)/.test(css), "woorden faden in met blur, zoals ELT");
eis(/\.gw2-held-woord\{[^}]*background-size:0% 100%/.test(css) && /\.gw2-held-woord\.gekozen\{[^}]*background-size:100% 100%/.test(css), "selectie groeit van links naar rechts, zoals slepen");
// 27 nov (Marinus): "Verder Plan een Cal mag verder weg." Geen Plan een call-knop meer in de kop van /gratis-website.
eis(!/className="sn-pill" href=\{boekingsPlannerUrl\}/.test(gw), "geen Plan een call-knop in de kop van /gratis-website");
eis(/@keyframes gw2-kop-in/.test(css) && /prefers-reduced-motion:reduce\)\{[\s\S]{0,400}gw2-muis\{display:none/.test(css), "tekst fadet in; bij reduced motion geen muisjes");
eis(/\.gw2-held-woord\.gekozen\{[^}]*color:#fff/.test(css), "geselecteerd woord: witte tekst op groen");
// 27 nov (Marinus): "Vervolgens wil ik een showcase en dat mag de versie zijn die ik gister naar Albert heb gestuurd." "Maar dan zonder
// reviewoptie als showcase versie en als live tile naast of boven het onboardingsformulier." "Verder misschien een bekijk Showcase knop
// ... of een Vraag jouw Gratis Demo Pakket aan. 2 knoppen dan de showcase onder de vragen." "Deze tekst mag verder kleiner."
const SC = "public/showcase/elt-live/index.html", sc = lees(SC);
eis(fs.existsSync(SC) && /noindex/.test(sc) && /Showcase · SocialNow/.test(sc), "showcase ELT Live staat in public/, noindex");
const scBody = sc.split("</head>")[1] || "";
eis(!/data-fb|ELT_FB|feedback\.php|Geef je feedback|fbband/.test(scBody), "showcase zonder reviewoptie (geen feedbacklaag)");
eis(fs.existsSync("public/showcase/elt-live/website/index.html") && !/feedback\.js/.test(lees("public/showcase/elt-live/website/index.html")), "website in de showcase zonder feedbacklaag");
eis(/id="showcase"/.test(gw) && /<iframe[^>]*src="\/showcase\/elt-live\/index\.html"/.test(gw) && gw.indexOf('id="showcase"') > gw.indexOf("</form>"), "live tegel met de showcase onder de vragen");
eis(/href="#showcase"[^>]*>[\s\S]{0,80}Bekijk de showcase/.test(gw) && /href="#onboarding"[^>]*>[\s\S]{0,80}Vraag jouw gratis demopakket aan/.test(gw), "twee knoppen: Bekijk de showcase en Vraag jouw gratis demopakket aan");
eis(/\.gw2-kop \.sn-alg-uitleg\{[^}]*font-size:15px/.test(css), "uitleg onder de kop is kleiner");
// 27 nov (Marinus): "En pagina moet heten BLACKFRIDAY DEAL." en, bij de knop Volgende: "Hier graag witte tekst".
eis(/"\/gratis-website": "BLACK FRIDAY DEAL"/.test(lees("proposal/WebsiteProposal.tsx")) && /'gratis-website': \{title: 'BLACK FRIDAY DEAL \| SocialNow'/.test(lees("scripts/postbuild.mjs")), "paginatitel is BLACK FRIDAY DEAL");
eis(/\.gw2-verder\{[^}]*color:#fff[;}]/.test(css), "knop Volgende: witte tekst op groen");
// 27 nov (Marinus): "De Showcase mag op een zwarte achtergrond en nog groter met BLACK teksten GROWTH PACKAGE SHOWCASE!"
eis(/<ShowcaseKop \/>/.test(gw) && /GROWTH<\/W>[\s\S]{0,120}PACKAGE<\/W>[\s\S]{0,160}SHOWCASE<\/W>[\s\S]{0,60}gw2-punt/.test(lees("proposal/BlackFridayKop.tsx")), "showcase-kop: GROWTH PACKAGE SHOWCASE met groene punt");
eis(/\.gw2-showcase::before\{[^}]*width:100vw[^}]*background:#000/.test(css), "showcase op zwart over de volle breedte");
eis(/\.gw2-showcase\{[^}]*max-width:1400px/.test(css) && /\.gw2-showcase h2#gw2-showcase-kop\{[^}]*font-size:clamp\(40px/.test(css), "showcase groter: breder vlak en grote kop");
eis(/\.gw2-showcase h2#gw2-showcase-kop\{[^}]*color:#fff/.test(css) && !/\.gw2-showcase[^{]*\{[^}]*letter-spacing:-/.test(css), "kop wit, geen negatieve letterafstand");
// 27 nov (Marinus): "KNAL DEZE nog even groot linksboven" en "Zelfde verhaal op de homepage".
const he = lees("proposal/HomeEnthousiast.tsx"), hcss = lees("proposal/header-algemeen.css");
eis(fs.existsSync("public/images/growth-package-deal.webp"), "sticker Growth Package Deal staat in public/images");
eis(/<div className="sn-alg-tekst">\s*<GrowthDealSticker \/>/.test(gw), "sticker linksboven in de kop van /gratis-website");
eis(/<GrowthDealSticker naar="\/gratis-website" \/>\s*<p className="sn-alg-label">/.test(he), "sticker linksboven op de homepage, linkt naar de deal");
eis(/\.sn-gpd\{[^}]*width:clamp\(190px,24vw,340px\)/.test(hcss), "sticker groot (tot 340 px)");
// 27 nov (Marinus): "zelfde soort effect als bij de titel zelf met het selecteren etc en misschien als sectie kaart over de onboarding laten
// schuiven als je verder scrollt. En teksten ook infaden."
const kopSrc = lees("proposal/BlackFridayKop.tsx");
eis(/export function ShowcaseKop[\s\S]*useSelectie\(vak, inBeeld\)/.test(kopSrc) && /gw2-held-woord/.test(kopSrc.split("export function ShowcaseKop")[1] || ""), "showcase-kop: zelfde selectie-cursor, start in beeld");
eis(/\.gw2-vel\{position:sticky;top:var\(--vel-top/.test(css) && /--vel-top/.test(gw), "onboarding blijft staan, showcase schuift er als kaart overheen");
eis(/\.gw2-showcase::before\{[^}]*border-radius:36px 36px 0 0/.test(css), "showcase-kaart met ronde bovenhoeken");
eis(/\.gw2-showcase\.in-beeld :is\([^)]*gw2-showcase-sub/.test(css) && /\.gw2-showcase:not\(\.in-beeld\) \.gw2-bw/.test(css), "teksten faden in zodra de showcase in beeld komt");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
