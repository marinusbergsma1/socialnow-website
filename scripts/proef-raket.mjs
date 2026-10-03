// Proef raketjes (3 oktober 2026). Rood op main f3e5a43, groen op feat/doel-familie-20261003.
// Marinus bij de join-balk: "Deze is niet mooi nog dat raketje etc liefst er gwn naast." En bij de kop
// "Let's get SocialNow!🚀": "HIER VERDER ER VANDAAN."
// Draai: node scripts/proef-raket.mjs   (exit 0 = groen).
import { readFileSync, existsSync } from "node:fs";
const css = existsSync("proposal/hero-c.css") ? readFileSync("proposal/hero-c.css", "utf8") : "";
const eisen = [
  ["join-balk: zin loopt als gewone tekst, de raket wrapt niet naar een eigen regel",
    /\.h-team-join-balk \.h-team-join-zin\s*\{\s*display:\s*block;/.test(css)],
  ["join-balk: raket direct naast de zin met wat lucht",
    /\.h-team-join-balk \.h-raket\s*\{[^}]*margin-left:\s*\.3em/.test(css)],
  ["kop: raket verder van het uitroepteken",
    /\.h-kop-typen > \.h-kop-raket\s*\{\s*margin-left:\s*\.(2|3)\d*em/.test(css)],
  ["join-balk: SocialNow! en de raket zitten in één niet-brekend slot",
    /<span className="h-team-join-slot">SocialNow!<span className="h-raket"/.test(existsSync("proposal/TeamTrust.tsx") ? readFileSync("proposal/TeamTrust.tsx", "utf8") : "") && /\.h-team-join-slot\s*\{\s*white-space:\s*nowrap;/.test(css)],
  // Marinus: "Geen glow, geen jump en gwn een groene balk."
  ["join-balk: effen groene balk", /\.h-team-join\.h-team-join-balk\s*\{\s*background:\s*#25d366;/.test(css)],
  ["join-balk: geen glans (::after uit) en geen tekstgloed", /\.h-team-join-balk \.h-team-join-tekst::after\s*\{\s*content:\s*none;/.test(css) && /text-shadow:\s*none/.test(css)],
  ["join-balk: geen sprong of lancering van de raket",
    /\.h-team-join-balk:hover \.h-raket[^{]*\{\s*transform:\s*none;/.test(css) && !/is-lancering/.test(existsSync("proposal/TeamTrust.tsx") ? readFileSync("proposal/TeamTrust.tsx", "utf8") : "is-lancering")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
