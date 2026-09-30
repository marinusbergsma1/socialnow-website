// Proef statement en founder-demo bovenaan (30 september 2026). Eerst rood op main, groen op feat/statement-gratis.
// Ronde 2 (30 september 2026, Marinus koos optie A): één rustige zin, "automated systems." helemaal groen.
// Rood op main cb2a738, groen op feat/statement-een-zin.
import { readFileSync, existsSync } from "node:fs";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const pages = lees("proposal/pages.tsx");
const st = lees("proposal/Statement.tsx");
const css = lees("proposal/statement.css");
const eisen = [
  ["Home toont <Statement /> bovenaan, vóór de hero", /<Statement \/>\s*<LanguageContext\.Provider value=\{getoond\}>\s*<section className="h-hero"/.test(pages)],
  ["één zin met alle zes eigenschappen", /<p className="sn-statement-zin">Proven<span>,<\/span> branded<span>,<\/span> end to end<span>,<\/span> highly profitable<span>,<\/span> personal <span>and<\/span> fully <em>automated systems\.<\/em><\/p>/.test(st)],
  ["geen kapitalenlijst met stippen meer", !st.includes("WOORDEN.map") && !/text-transform:\s*uppercase/.test(css.match(/\.sn-statement-zin[^}]*}/)?.[0] || "")],
  ["\"automated systems.\" groen, komma's en \"and\" gedempt", /\.sn-statement-zin em\s*{[^}]*color:\s*#25d366/.test(css) && /\.sn-statement-zin span\s*{[^}]*color:\s*rgba\(255,\s*255,\s*255,\s*\.6/.test(css)],
  ["voetregel met lijn: gratis links, SaaS-regel rechts", /<div className="sn-statement-voet">\s*<p className="sn-statement-daarom">/.test(st) && /\.sn-statement-voet\s*{[^}]*border-top/.test(css)],
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
