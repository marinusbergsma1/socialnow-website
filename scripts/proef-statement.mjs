// Proef statement en founder-demo onder de hero (30 september 2026). Rood op main, groen op feat/statement-gratis.
import { readFileSync, existsSync } from "node:fs";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const pages = lees("proposal/pages.tsx");
const st = lees("proposal/Statement.tsx");
const eisen = [
  ["Home toont <Statement /> bovenaan, vóór de hero", /<Statement \/>\s*<LanguageContext\.Provider value=\{getoond\}>\s*<section className="h-hero"/.test(pages)],
  ["zes woorden van het statement", ["Proven", "Branded", "End to end", "Highly profitable", "Personal", "Fully automated"].every((w) => st.includes(`"${w}"`))],
  ["That's why we offer it for free.", st.includes("That&rsquo;s why we offer it for free.")],
  ["kleine regel over SaaS", st.includes("If SaaS can&rsquo;t be free, it&rsquo;s not good enough!")],
  ["founder-demo gratis end to end", st.includes("free end to end demo")],
  ["live overal ter wereld", st.includes("I present it live, anywhere in the world.")],
  ["demoknop via aanvragen.ts", st.includes('from "./aanvragen"') && !/mailto:/.test(st)],
  ["Engels in elke taal (translate=no)", st.includes('translate="no"')],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
