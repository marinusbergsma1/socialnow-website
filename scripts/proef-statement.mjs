// Proef header optie C (30 september 2026). Rood op main ff3eecd, groen op header-c.
import { readFileSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const styles = readFileSync("proposal/styles.tsx", "utf8");
const eisen = [
  ["kop From 0 to SocialNow! met raket, niet groen", styles.includes('"From 0 to SocialNow!"') && styles.includes('"🚀"') && !styles.includes('h-kop-groen">{translate(KOP_2')],
  ["statement als zin in de hero", pages.includes("fully automated systems.") && pages.includes("That&rsquo;s why we offer it for free.")],
  ["SaaS-regel klein", pages.includes("If SaaS can&rsquo;t be free, it&rsquo;s not good enough!")],
  ["geen los statementblok boven de hero", !pages.includes("<Statement />")],
  ["demoknop met founder", pages.includes("Book a free live demo")],
  ["bewijs Odoo met film", pages.includes("IT&rsquo;S PROVEN AT ODOO") && pages.includes("/video/odoo-experience/odoo-experience.mp4")],
  ["Salesforce in de maak", pages.includes("WORKING ON SALESFORCE")],
  ["rechts OS-film en veiligheid, My story vol onder de bewijsbalk", /h-film-os[\s\S]*VeiligheidSpeler[\s\S]*h-bewijs[\s\S]*<HeroStory \/>[\s\S]*<ClientLogos kort/.test(pages)],
  ["logobalk met Odoo en Salesforce", readFileSync("proposal/content.ts","utf8").includes('"partners/odoo.svg", "Odoo"') && readFileSync("proposal/content.ts","utf8").includes('"partners/salesforce.svg", "Salesforce"')],
  ["kop niet omlaag geduwd", readFileSync("proposal/hero-c.css","utf8").includes("h1.h-taalwissel { margin-top: 0; }")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
