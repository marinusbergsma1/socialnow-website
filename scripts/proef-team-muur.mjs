// Proef 1 oktober 2026: team-sectie in de hero als gezichtenmuur (versie 3) in kleur, en Sid overal met zijn nieuwe foto.
// Marinus: "Deze, maar het team in kleur. En Sid zijn foto overal nog vervangen graag."
// Rood op fix/sprekers-manifest-20260930 934c3f2, groen op feat/team-muur-20261001.
import { readFileSync, existsSync } from "node:fs";
const lees = (p) => readFileSync(p, "utf8");
const team = lees("proposal/TeamTrust.tsx"), css = lees("proposal/hero-c.css");
const join = team.slice(team.indexOf("export function TeamJoin"));
const bronnen = ["proposal/content.ts", "components/Team.tsx", "components/TeamPage.tsx"].map(lees).join("\n");
const eisen = [
  ["Sid nergens meer met de oude foto", !bronnen.includes("Sid-van-Kalken.webp")],
  ["Sid overal met sid-attesso.webp", ["proposal/content.ts", "components/Team.tsx", "components/TeamPage.tsx"].every((p) => lees(p).includes("sid-attesso.webp"))],
  ["kleine versies van Sids nieuwe foto voor de muur", ["96", "160", "320"].every((m) => existsSync(`public/images/klein/sid-attesso-${m}.webp`))],
  ["muur met twaalf portretten, naam en rol", join.includes('className="h-team-muur"') && join.includes("<figcaption>") && join.includes("person.role")],
  ["portretten in kleur, geen grijsfilter", /\.h-team-muur img \{[^}]*object-fit: cover/.test(css) && !/\.h-team-muur img \{[^}]*grayscale/.test(css)],
  ["join-regel als balk met Open positions", join.includes("h-team-join-balk") && join.includes("Open positions")],
  ["statement blijft links ongewijzigd", lees("proposal/pages.tsx").includes("NO ONE CAN AUTOMATE PEOPLE WHO CARE")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
