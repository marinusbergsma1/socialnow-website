// Proef Light Art-strook en VASTIQ-film (30 september 2026). Rood op main a6f9c98, groen op fix/header-rust-20260930.
import { existsSync, readFileSync } from "node:fs";
const css = readFileSync("proposal/bereikt.css", "utf8");
const bereikt = readFileSync("proposal/Bereikt.tsx", "utf8");
const eisen = [
  ["Light Art: op de pc alle vijf in een raster, geen zijwaartse strook", /@media \(min-width: 900px\) \{[^@]*\.h-lac-venster \{[^}]*display: grid;[^}]*overflow: visible/.test(css)],
  ["Light Art: alleen de drie Artist Impressions, naast elkaar", /\.h-lac-venster \{ display: grid; grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/.test(css) && (readFileSync("proposal/LightArtStrook.tsx", "utf8").match(/\{ titel: "/g) || []).length === 3],
  ["Light Art: lichte beelden in 800 en 1400 px", readFileSync("proposal/LightArtStrook.tsx", "utf8").includes("-800.webp 800w, ${licht(pad)}-1400.webp 1400w") && ["Eternal-Sundown-Afbeelding-After", "Infinita-Light-Art-Collection", "Butterfly-Effect-Light-Art-Collection", "infinita-voor", "butterfly-effect-voor", "Eternal-Sundown-Afbeelding-Before-geconverteerd-van-png-1"].every((n) => existsSync(`public/images/light-art/licht/${n}-800.webp`) && existsSync(`public/images/light-art/licht/${n}-1400.webp`))],
  ["Light Art: op de telefoon zie je de volgende kaart", /@media \(max-width: 899px\) \{[^@]*\.h-lac-kaart \{ width: 82%; \}/.test(css)],
  ["VASTIQ-tegel speelt de nieuwe film", /Tegel kop="VASTIQ"[\s\S]{0,700}<BentoFilm src="\/video\/vastiq\/vastiq-zoom-v2\.mp4"/.test(bereikt)],
  ["VASTIQ-film en poster staan in public", existsSync("public/video/vastiq/vastiq-zoom-v2.mp4") && existsSync("public/video/vastiq/vastiq-zoom-v2.jpg")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
