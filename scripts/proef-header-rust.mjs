// Proef header rust (30 september 2026). Rood op main a6f9c98, groen op fix/header-rust-20260930.
import { readFileSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const css = readFileSync("proposal/hero-c.css", "utf8");
const heroFilm = pages.slice(pages.indexOf("function HeroFilm("), pages.indexOf("function HeroStory("));
const osFilm = heroFilm.slice(0, heroFilm.indexOf("function HeroVeilig(") > 0 ? heroFilm.indexOf("function HeroVeilig(") : undefined);
const home = pages.slice(pages.indexOf("export function Home()"));
const eisen = [
  // 1 oktober 2026 (Marinus): "SocialNowOS mag gwn boven hier weg." De logo-animatie boven het team is weg.
  ["geen logo-animatie boven het team, team op de lijn", !home.includes("<HeroLogo") && css.includes(".h-team-portraits { padding-left: 0; }")],
  ["kop zonder groene gloed", /h1\.h-taalwissel \.h-kop-groen \{ text-shadow: 1\.5px 0 rgba\(255,0,60,\.35\), -1\.5px 0 rgba\(0,229,255,\.35\); \}/.test(css)],
  ["rechts alleen de OS-film", !osFilm.includes("<VeiligheidSpeler")],
  // 1 oktober 2026 (Marinus): Trusted by is weg ("laat deze balk Primefone, DIVEINE, KWH weg"); veiligheid blijft onder de OS-film.
  ["veiligheid onder de OS-film", /<HeroFilm\b[\s\S]*<HeroVeilig\b/.test(home)],
  ["aftermovie als tekstlink zonder pil", /\.h-hero \.h-aftermovie \{[^}]*border: 0/.test(css)],
  ["geen losse streep na de Odoo-regel", !/INTEGRATED IN ODOO&rsquo;S ERP SYSTEM<\/b>\s*<i aria-hidden/.test(pages)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
