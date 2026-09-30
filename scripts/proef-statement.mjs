// Proef header optie C (30 september 2026). Rood op main ff3eecd, groen op header-c.
import { readFileSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const styles = readFileSync("proposal/styles.tsx", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const eisen = [
  ["kop Let's get SocialNow! met SocialNow groen", styles.includes('"Let’s get"') && styles.includes('"SocialNow!"') && styles.includes('h-kop-groen">{KOP_2}')],
  ["integratieregel Odoo en Salesforce", pages.includes("INTEGRATED IN ODOO&rsquo;S ERP SYSTEM") && pages.includes("NEXT STEP <img src=\"/images/partners/salesforce.svg\"")],
  ["aftermovie-link naast Odoo", pages.includes("Watch the aftermovie") && pages.includes("/video/odoo-experience/odoo-experience.mp4")],
  ["betaalpartner Attesso", pages.includes("~/attesso")],
  ["Milo-pillen met naam", pages.includes("h-milo-pil")],
  ["statement en demoknop blijven", pages.includes("That&rsquo;s why we offer it for free.") && pages.includes("Book a free live demo")],
  ["Trusted by boven de logobalk, alleen merken", pages.includes(">Trusted by<") && !content.includes('"partners/odoo.svg"')],
  // 30 september 2026 (Marinus): "Deze video mag weg", My story staat niet meer in de header.
  ["volgorde: OS-film, dan Trusted by", /<HeroFilm\b[\s\S]*Trusted by/.test(pages)],
  ["software in plaats van SaaS", pages.includes("If software can&rsquo;t be free") && !pages.includes("If SaaS can")],
  ["expertise-regel", pages.includes("We get paid for our expertise: helping you!")],
  ["demobanner met Sid van Attesso", pages.includes("h-demo-knop is-groot") && pages.includes("/images/Sid-van-Kalken.webp") && pages.includes("Sid, Attesso")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
