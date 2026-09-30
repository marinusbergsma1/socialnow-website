// Proef 30 september 2026: logobalk rechts onder de OS-film, PAYMENT PARTNER roze, "Milo ate them all. But we don't need them..." in elke taal,
// melding sluit na 5 s met outro, merken groter en vol wit.
// Rood op main ca129f5, groen op fix/cookie-milo-engels-20260930.
import { existsSync, readFileSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const koekje = readFileSync("proposal/MiloKoekje.tsx", "utf8");
const koekjeCss = readFileSync("proposal/milo-koekje.css", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const talen = ["en", "de", "fr"].map((t) => readFileSync(`proposal/i18n/${t}.json`, "utf8"));
const film = pages.slice(pages.indexOf("<HeroFilm geluid"), pages.indexOf("</HeroFilm>"));
const eisen = [
  ["logobalk rechts direct onder de OS-film", pages.includes("</HeroFilm>") && film.includes("<ClientLogos kort />") && film.includes(">Trusted by<")],
  ["PAYMENT PARTNER roze, niet grijs", !/\.h-integratie-rij > [^{]*\.h-attesso[^{]*\{ color: #a7b3ad/.test(css) && readFileSync("proposal/hero-c.css", "utf8").includes(".sn-site .h-attesso { color: #d4a0b5; }")],
  ["Milo-zin in het Engels in elke taal", /translate="no">Milo ate them all\. But we don&rsquo;t need them\. Our results speak for themselves!<\/p>/.test(koekje) && !koekje.includes("Milo heeft ze allemaal opgegeten.</p>")],
  ["melding sluit vanzelf na 5 s, pauzeert bij hover", /h-koekje-tijd" aria-hidden="true" onAnimationEnd=\{sluit\}/.test(koekje) && koekjeCss.includes("animation: h-koekje-tijd 5s linear") && /\.h-koekje:hover \.h-koekje-tijd[^{]*\{ animation-play-state: paused/.test(koekjeCss)],
  ["outro: kaart en Milo gaan met een eigen animatie weg", koekjeCss.includes("@keyframes h-koekje-weg") && koekjeCss.includes("@keyframes h-koekje-milo-weg")],
  ["merken bijgesneden en groter, vol wit", ["AMSTERDAM-LIGHT-FESTIVAL-LOGO", "CHIN-CHIN-CLUB-LOGO", "MOJO-LOGO", "SUPPERCLUB-LOGO", "UNDER-ARMOUR-LOGO-1"].every((n) => content.includes(`"merken/${n}.webp"`) && existsSync(`public/images/merken/${n}.webp`)) && css.includes(".sn-site .h-clients .h-clients-lus img { filter: none; opacity: 1; }")],
  ["merken iets kleiner (basis 3.9vw, max 58px)", css.includes("height: calc(clamp(40px, 3.9vw, 58px) * var(--logo-maat, 1)); max-width: 180px;")],
  ["meer ruimte tussen Trusted by en de logo's", css.includes(".h-hero-merken > .h-trusted { margin: 0 0 clamp(16px, 1.6vw, 24px); }")],
  ["LAC, kWh Garant, DIVINE en PrimeFone in de balk, vol wit", [["LIGHT-ART-COLLECTION-LOGO.webp", "Light Art Collection"], ["KWH-GARANT-LOGO.svg", "kWh Garant"], ["DIVINE-LOGO.svg", "DIVINE"], ["PRIMEFONE-LOGO.svg", "PrimeFone"]].every(([f, n]) => content.includes(`["merken/${f}", "${n}"`) && existsSync(`public/images/merken/${f}`)) && ["KWH-GARANT-LOGO.svg", "DIVINE-LOGO.svg", "PRIMEFONE-LOGO.svg"].every((f) => !/fill[:=]\s*"?#(?!fff\b)[0-9a-fA-F]{3,6}/.test(readFileSync(`public/images/merken/${f}`, "utf8")))],
  ["logobalk laadt meteen en loopt altijd door", readFileSync("proposal/ui.tsx", "utf8").includes('loading={kort ? "eager" : "lazy"}') && css.includes(".h-hero-merken .h-clients-lus { animation-delay: -23s; }") && css.includes(".h-hero-merken .h-clients-strook:hover .h-clients-lus { animation-play-state: running; }")],
  ["geen oude vertalingen meer", talen.every((s) => !s.includes("Milo heeft ze allemaal opgegeten."))],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
