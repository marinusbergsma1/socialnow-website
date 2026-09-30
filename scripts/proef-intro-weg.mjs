// Proef: geen stille introvideo meer vóór de site (30 september 2026). Rood op main vóór deze wijziging, groen erna.
import { readFileSync } from "node:fs";
const app = readFileSync("proposal/WebsiteProposal.tsx", "utf8");
const html = readFileSync("index.html", "utf8");
const eisen = [
  ["WebsiteProposal toont LogoIntro niet", !/<LogoIntro/.test(app)],
  ["index.html laadt header-intro niet vooraf", !html.includes("header-intro")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
process.exit(fout ? 1 : 0);
