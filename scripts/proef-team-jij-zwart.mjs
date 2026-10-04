// Proef 4 oktober 2026: de laatste tegel van de teammuur is geen groen vlak "Jij?" meer, maar zwart met "Let's get" en
// het SocialNow-logo. Marinus: "niet een groen vlak maar een zwarte balk Let's get SocialNow Logo".
// Rood op main 322163f, groen op feat/team-jij-zwart-20261004.
import { readFileSync, existsSync } from "node:fs";
const team = readFileSync("proposal/TeamTrust.tsx", "utf8"), css = readFileSync("proposal/hero-c.css", "utf8");
const tegel = (team.match(/<figure className="h-team-jij">[\s\S]*?<\/figure>/) || [""])[0];
const regel = (css.match(/\.h-team-muur \.h-team-jij \{[^}]*\}/g) || []).pop() || "";
const eisen = [
  ["tegel zegt Let's get, niet meer Jij?", tegel.includes("Let&rsquo;s get") && !tegel.includes("Jij?")],
  ["SocialNow-logo in de tegel", /<img src="\/images\/klein\/SocialNow-Logo-2026-400\.webp" alt="SocialNow"/.test(tegel) && existsSync("public/images/klein/SocialNow-Logo-2026-400.webp")],
  ["tegel zwart, niet groen", /background: #0b0f12/.test(regel) && !/#25d366/.test(regel)],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
