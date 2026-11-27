// 27 nov 2026 (Marinus): stap 05 "Groei en opschalen" met groeianimatie, één doorlopende slider onder de Black Friday-film,
// één voortgangsbalk in de vragenlijst, sticker op de hoek van de film. Rood op main, groen op de tak.
import { readFileSync } from "node:fs";
const lees = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const stap = lees("proposal/Stappenplan.tsx"), css = lees("proposal/stappenplan.css"), bf = lees("proposal/BlackFridayBlok.tsx");
const rail = lees("proposal/MediaSliders.tsx"), gw = lees("proposal/GratisWebsite.tsx"), gwcss = lees("proposal/gratis-website-wit.css");
const talen = ["en", "de", "fr"].map((t) => JSON.parse(lees(`proposal/i18n/${t}.json`)));
const eisen = [
  ["stap 05 heet Groei en opschalen", /titel: "Groei en opschalen"/.test(stap) && !/titel: "Eén OS met Connect"/.test(stap)],
  ["stap 05 heeft een eigen groeianimatie", stap.includes("st-mini-groei") && css.includes("@keyframes st-staaf")],
  ["nieuwe titel in en/de/fr", talen.every((d) => d["Groei en opschalen"] && d["Stap 05 · Groei en opschalen"])],
  ["één portfolioslider onder de film", (bf.match(/<MediaRail /g) || []).length === 1 && !/<Rij /.test(bf)],
  ["slider loopt sneller en stopt niet bij aanwijzen", /snelheid=\{45\} doorlopen/.test(bf) && /doorlopen \|\| time > interaction/.test(rail)],
  ["voortgang is één doorlopende balk", /gw2-voortgang[^\n]*width: `\$\{\(\(stap \+ 1\)/.test(gw) && !/STAPPEN\.map\(\(_, i\) => <span/.test(gw)],
  ["sticker op de hoek van de film", /\.gw2-kop \.sn-gpd\{position:absolute/.test(gwcss)],
];
let rood = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "GROEN" : "ROOD "}  ${naam}`); if (!ok) rood++; }
console.log(rood ? `\n${rood} rood` : "\nAlles groen");
process.exit(rood ? 1 : 0);
