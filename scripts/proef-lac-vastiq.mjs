// Proef Light Art-strook en VASTIQ-film (30 september 2026). Rood op main a6f9c98, groen op fix/header-rust-20260930.
import { existsSync, readFileSync } from "node:fs";
const css = readFileSync("proposal/bereikt.css", "utf8");
const bereikt = readFileSync("proposal/Bereikt.tsx", "utf8");
const eisen = [
  ["Light Art: op de pc alle vijf in een raster, geen zijwaartse strook", /@media \(min-width: 900px\) \{[^@]*\.h-lac-venster \{[^}]*display: grid;[^}]*overflow: visible/.test(css)],
  ["Light Art: drie boven, twee eronder", css.includes(".h-lac-kaart:nth-child(n + 4) { grid-column: span 3; }")],
  ["Light Art: op de telefoon zie je de volgende kaart", /@media \(max-width: 899px\) \{[^@]*\.h-lac-kaart \{ width: 82%; \}/.test(css)],
  ["VASTIQ-tegel speelt de nieuwe film", /Tegel kop="VASTIQ"[\s\S]{0,700}<BentoFilm src="\/video\/vastiq\/vastiq-zoom-v2\.mp4"/.test(bereikt)],
  ["VASTIQ-film en poster staan in public", existsSync("public/video/vastiq/vastiq-zoom-v2.mp4") && existsSync("public/video/vastiq/vastiq-zoom-v2.jpg")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
