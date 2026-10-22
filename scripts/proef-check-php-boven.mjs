#!/usr/bin/env node
// Proef: /check na de feedback van Marinus (22 oktober 2026, fix/check-php-boven). Rood op main (1cacc5e), groen op de tak.
// 1. Het PHP-blok staat altijd als eerste in de uitslag en is groot en duidelijk: status, PHP-versie of "afgeschermd",
//    één zin wat het betekent en "What you can do right now". Pas daaronder de vijf punten. Echt gerenderd (esbuild +
//    react-dom/server) voor elke soort uitslag, in het Nederlands en het Engels.
// 2. De film staat helemaal bovenaan, boven de check: 16:9 op desktop, 9:16 op mobiel, klik om af te spelen, poster.
// 3. Geen knoppenparen meer: een contactblok met Steef en Michelle (foto, naam en rol uit proposal/content.ts), per persoon
//    een call plannen en mailen naar secure@socialnow.nl. Het korte formulier (#aanvraag) staat eronder.
// 4. Eerlijke snelheid: zonder PageSpeed nooit "Goed" of "laadt snel", maar "Serverreactie" met het getal en een neutrale status.
// 5. Verbeteringen gegroepeerd per punt, geen dubbele labels onder elkaar.
// Gebruik: node scripts/proef-check-php-boven.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const tsx = lees("proposal/PhpCheck.tsx");
const rapport = lees("proposal/CheckRapport.tsx");
const css = lees("proposal/php-check.css");
const rcss = lees("proposal/check-rapport.css");
const en = JSON.parse(lees("proposal/i18n/en.json") || "{}");

// 1. PHP-blok bovenaan, altijd compleet
const uitslag = tsx.slice(tsx.indexOf('className="pc-uitslag"'), tsx.indexOf("</section>", tsx.indexOf('className="pc-uitslag"')));
const iBlok = uitslag.indexOf("<PhpBlok"), iRapport = uitslag.indexOf("<CheckRapport"), iMensen = uitslag.indexOf("<Mensen");
eis(iBlok > 0 && iRapport > iBlok && iMensen > iRapport, "in de uitslag eerst het PHP-blok, dan de vijf punten, dan Steef en Michelle");
eis(!/<Oproepen|pc-oproep/.test(uitslag.slice(0, iRapport > 0 ? iRapport : uitslag.length)), "tussen PHP-blok en vijf punten geen knoppenrij");
eis(/:root \.sn-site \.pc-php h2 \{[^}]*font-size: clamp\((2[89]|3\d)px[^;]*!important/.test(css) && /:root \.sn-site \.pc-php-versie dd \{[^}]*font-size: clamp\((2[4-9]|3\d)px/.test(css), "statuskop minstens 28 px en PHP-versie minstens 24 px");

let render = null;
try {
  const { build } = await import("esbuild");
  const uit = path.join(process.cwd(), "proposal", `.proef-php-blok-${process.pid}.mjs`);
  const ingang = path.join(process.cwd(), "proposal", `.proef-php-blok-${process.pid}.tsx`);
  fs.writeFileSync(ingang, `import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "./i18n/context";
import { PhpBlok } from "./PhpCheck";
export const toon = (u: any, taal: any) => renderToStaticMarkup(React.createElement(LanguageProvider, { language: taal }, React.createElement(PhpBlok, { u })));
`);
  try {
    await build({
      entryPoints: [ingang], outfile: uit, bundle: true, format: "esm", platform: "node", jsx: "automatic",
      jsxImportSource: path.join(process.cwd(), "proposal", "i18n"), logLevel: "silent", packages: "external",
      loader: { ".json": "json" },
      plugins: [{ name: "proef", setup(b) {
        b.onResolve({ filter: /\.json\?(kern|rest)$/ }, (a) => ({ path: path.join(a.resolveDir, a.path.replace(/\?.*$/, "")) }));
        b.onResolve({ filter: /\.css$/ }, () => ({ path: "leeg", namespace: "leeg" }));
        b.onLoad({ filter: /.*/, namespace: "leeg" }, () => ({ contents: "", loader: "js" }));
        b.onResolve({ filter: /i18n\/jsx-(dev-)?runtime$/ }, (a) => ({ path: path.join(process.cwd(), "proposal", "i18n", "jsx-runtime.ts") }));
      } }],
    });
    globalThis.window ??= undefined;
    render = (await import(pathToFileURL(uit).href)).toon;
    fs.rmSync(uit, { force: true });
  } finally { fs.rmSync(ingang, { force: true }); setTimeout(() => {}, 0); }
} catch (e) { console.log(`       (render: ${String(e.message || e).split("\n")[0]})`); }

const gevallen = [
  { naam: "afgeschermd (wikipedia.org, link.nl)", u: { ok: true, domein: "link.nl", uitslag: "onbekend", phpVersie: null, code: "versie-verborgen" }, versie: { nl: "afgeschermd", en: "shielded" }, kop: { nl: "Je site schermt dit af.", en: "Your site shields this." } },
  { naam: "geen PHP te zien", u: { ok: true, domein: "x.nl", uitslag: "onbekend", phpVersie: null, code: "geen-php-gezien" }, versie: { nl: "afgeschermd", en: "shielded" } },
  { naam: "onze functie faalt", u: { ok: true, domein: "x.nl", uitslag: "onbekend", phpVersie: null, code: "fout" }, versie: { nl: "afgeschermd", en: "shielded" } },
  { naam: "oranje, PHP 5.2.12 (bloemist.nl)", u: { ok: true, domein: "bloemist.nl", uitslag: "oranje", phpVersie: "5.2.12", hersteldVanaf: null, code: "eol-alleen-via-host" }, versie: { nl: "5.2.12", en: "5.2.12" } },
  { naam: "oranje, nummer onder de fix", u: { ok: true, domein: "x.nl", uitslag: "oranje", phpVersie: "8.4.26", hersteldVanaf: "8.4.27", code: "onder-de-fix-zonder-bewijs" }, versie: { nl: "8.4.26", en: "8.4.26" } },
  { naam: "rood, Ubuntu-build", u: { ok: true, domein: "x.nl", uitslag: "rood", phpVersie: "8.1.2-1ubuntu2.25", hersteldVanaf: "8.1.2-1ubuntu2.28", code: "ubuntu-voor-de-fix" }, versie: { nl: "8.1.2-1ubuntu2.25", en: "8.1.2-1ubuntu2.25" } },
  { naam: "groen", u: { ok: true, domein: "x.nl", uitslag: "groen", phpVersie: "8.5.12", hersteldVanaf: "8.5.12", code: "op-of-boven-de-fix" }, versie: { nl: "8.5.12", en: "8.5.12" } },
];
if (!render) eis(false, "PhpBlok is los te renderen (export function PhpBlok in PhpCheck.tsx)");
else for (const g of gevallen) for (const taal of ["nl", "en"]) {
  let html = "";
  try { html = render(g.u, taal); } catch (e) { html = ""; }
  html = html.replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  if (process.env.PROEF_TOON) console.log(html);
  const tekst = html.replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const kop = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]?.replace(/<[^>]+>/g, "").trim() || "";
  const zin = (html.match(/<p class="pc-php-zin"[^>]*>([\s\S]*?)<\/p>/) || [])[1]?.replace(/<[^>]+>/g, "") || "";
  const stappen = (html.match(/<ol class="pc-stappen"[\s\S]*?<\/ol>/) || [""])[0].match(/<li/g)?.length || 0;
  const nlRest = taal === "en" && /\b(je|jouw|de fix|niet|wordt|Vraag)\b/.test(tekst.replace(/php2shell|CVE-[\d-]+/g, ""));
  eis(/class="pc-php pc-(rood|oranje|groen|onbekend)"/.test(html)
    && kop.length > 5 && (!g.kop || kop === g.kop[taal])
    && new RegExp(`PHP[^<]*</dt>\\s*<dd[^>]*>${g.versie[taal].replace(/\./g, "\\.")}</dd>`).test(html)
    && zin.length > 30 && (zin.match(/[.!?](\s|$)/g) || []).length === 1
    && tekst.includes(taal === "en" ? "What you can do right now." : "Dit kun je zelf al doen.") && stappen >= 3
    && !nlRest,
    `${taal.toUpperCase()} ${g.naam}: status "${kop}", PHP-versie ${g.versie[taal]}, één zin, ${stappen} stappen`);
}

// 2. Film bovenaan
const pagina = tsx.slice(tsx.indexOf('<div className="pc">'));
eis(pagina.indexOf("<Film />") > 0 && pagina.indexOf("<Film />") < pagina.indexOf('<form className="pc-check"') && pagina.indexOf("<Film />") < pagina.indexOf("<h1"), "film helemaal bovenaan, boven de kop en de check");
eis(/max-width: 760px/.test(tsx) && /check-\$\{vorm\}\$\{nl\}\.mp4/.test(tsx) && /poster=\{/.test(tsx) && /preload="none"/.test(tsx) && /controls/.test(tsx) && !/autoPlay/.test(tsx)
  && ["", "-nl"].flatMap((n) => [`check-16x9${n}.mp4`, `check-9x16${n}.mp4`, `poster-16x9${n}.jpg`, `poster-9x16${n}.jpg`]).every((b) => fs.existsSync(`public/websitecheck/film/${b}`)),
  "film: 16:9 op desktop, 9:16 op mobiel, klik om af te spelen, poster, ondertitels in beeld");
eis(/\.pc-video-9x16 \{[^}]*max-height: \d+svh/.test(css), "9:16 op mobiel past op het scherm (max-height in svh)");

// 3. Geen knoppenparen, wel Steef en Michelle
const alles = tsx + rapport;
eis(!/function Oproepen|pc-oproep-knoppen|Neem contact op|Laat het ons oplossen|cr-knoppen|Plan een uitgebreide check/.test(alles), "geen knoppenparen meer (uitgebreide check + contact, call + laat het ons oplossen)");
const content = lees("proposal/content.ts");
const rol = (naam) => (content.match(new RegExp(`name: "${naam}",\\s*role: "([^"]+)"`)) || [])[1];
eis(/function Mensen/.test(tsx) && /people\.filter\(\(p\) => MENSEN\.includes\(p\.name\)\)|MENSEN\.map\(\(naam\) => people\.find/.test(tsx) && /const MENSEN = \["Steef Komen", "Michelle Yang"\]/.test(tsx) && !!rol("Steef Komen") && !!rol("Michelle Yang") && !/role: "/.test(tsx.slice(tsx.indexOf("function Mensen"))), "contactblok met Steef en Michelle: foto, naam en rol uit proposal/content.ts, geen verzonnen rollen");
const mensen = tsx.slice(tsx.indexOf("function Mensen"), tsx.indexOf("\n}\n", tsx.indexOf("function Mensen")));
eis(/boekLink\(language, domein, "uitgebreide-check"\)/.test(mensen) && /href=\{boekExtern \? boek : "#aanvraag"\}/.test(mensen) && /mailto:\$\{SECURE\}/.test(mensen) && /const SECURE = "secure@socialnow\.nl"/.test(tsx), "per persoon: call plannen (boekingspagina, tot die live is het formulier) en mailen naar secure@socialnow.nl");
const aanvragen = lees("proposal/aanvragen.ts");
eis(/type === "uitgebreide-check" && domein \? `&domein=\$\{encodeURIComponent\(domein\)\}`/.test(aanvragen), "boekingslink voor de uitgebreide check met type en domein ingevuld (&domein=)");
const slot = pagina.slice(pagina.indexOf('id="aanvraag"') - 200);
eis(/id="aanvraag"/.test(pagina) && slot.indexOf("<Mensen") >= 0 && slot.indexOf("<Aanvraag") > slot.indexOf("<Mensen"), "onderaan Steef en Michelle, met het korte formulier (#aanvraag) eronder");
eis(/\.pc-mens img \{[^}]*border-radius/.test(css) && !/\.pc-mens[^{]*\.pc-knop/.test(css), "mensen met foto, hun links zijn geen pillknoppen");

// 4. Eerlijke snelheid
eis(/w\.bron === "eigen"/.test(rapport) && /Serverreactie/.test(rapport) && en["Serverreactie"] === "Server response" && /"Gemeten"/.test(rapport) && /cr-neutraal/.test(rapport + rcss), "zonder PageSpeed: \"Server response\" met het gemeten getal en een neutrale status");
const eigenZin = (rapport.match(/const EIGEN_ZIN = "([^"]+)"/) || [])[1] || "";
eis(!!eigenZin && /kon niet volledig gemeten worden/.test(eigenZin) && !!en[eigenZin] && !/laadt snel|loads fast/i.test(eigenZin + en[eigenZin]), "zonder PageSpeed nooit \"laadt snel\": \"kon niet volledig gemeten worden\"");
eis(/const eigen = k === "snelheid" && p\.waarde\?\.bron === "eigen"/.test(rapport), "eigen meting telt niet mee als goed of slecht");
eis(/sleutel = process\.env\.PAGESPEED_API_KEY/.test(lees("server/check-rapport.mjs")), "met PAGESPEED_API_KEY de echte PageSpeed-score");

// 5. Verbeteringen per punt
const advies = rapport.slice(rapport.indexOf('className="cr-advies"'));
eis(/className="cr-groep"/.test(advies) && /<h4>\{t\(TITEL\[k\]\)\}<\/h4>/.test(advies) && !/<strong>\{t\(TITEL\[k\]\)\}<\/strong>/.test(advies) && /new Set\(\(punten\[k\]\?\.problemen/.test(rapport), "verbeteringen gegroepeerd per punt, elke titel één keer, geen dubbele adviezen");

// Vaste eisen
eis(!/type="checkbox"/.test(tsx) && !/toestemming/i.test(tsx + lees("api/php-check.js")), "geen toestemmingsvinkje");
eis(/toon\(\{ ok: true, domein: host, uitslag: "onbekend"/.test(tsx) && !/De check lukte niet/.test(tsx), "nooit een foutmelding");
eis(/font-variant-ligatures: none/.test(css) && /\.pc \{[^}]*background: #000/.test(css), "zwarte grond, geen ligaturen");
const nieuw = [...new Set([...(tsx + rapport).matchAll(/\bt\("([^"]+)"\)/g)].map((m) => m[1]))].filter((z) => !(z in en));
eis(nieuw.length === 0, `elke t()-zin heeft Engels${nieuw.length ? ` (mist: ${nieuw.slice(0, 3).join(" | ")})` : ""}`);
const talen = ["de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const zinnen = [...new Set([...(tsx + rapport).matchAll(/\bt\("([^"]+)"\)/g)].map((m) => m[1]))];
const mist = talen.flatMap((t) => { const w = JSON.parse(lees(`proposal/i18n/${t}.json`) || "{}"); return zinnen.filter((z) => z in en && !(z in w)).map((z) => `${t}: ${z}`); });
eis(mist.length === 0, `ook in de acht andere talen${mist.length ? ` (mist ${mist.length}, bijv. ${mist[0]})` : ""}`);

console.log(fouten.length ? `\n${fouten.length} rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
