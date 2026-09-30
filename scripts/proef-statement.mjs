// Proef header optie C (30 september 2026). Rood op main ff3eecd, groen op header-c.
import { readFileSync } from "node:fs";
const pages = readFileSync("proposal/pages.tsx", "utf8");
const styles = readFileSync("proposal/styles.tsx", "utf8");
const content = readFileSync("proposal/content.ts", "utf8");
const eisen = [
  ["kop Let's get SocialNow! typt uit, wit, raket erachter", styles.includes('"Let’s get"') && styles.includes('"SocialNow!"') && styles.includes("h-kop-typen") && styles.includes("🚀") && !styles.includes('h-kop-groen">{KOP_2}') && readFileSync("proposal/hero-c.css","utf8").includes("@keyframes h-typ")],
  ["integratieregel Odoo en Salesforce", pages.includes("INTEGRATED IN ODOO&rsquo;S ERP SYSTEM") && pages.includes("NEXT STEP <img src=\"/images/partners/salesforce.svg\"")],
  ["aftermovie-link naast Odoo", pages.includes("Watch the aftermovie") && pages.includes("/video/odoo-experience/odoo-experience.mp4")],
  ["betaalpartner Attesso", pages.includes("~/attesso")],
  ["Milo-pillen met naam", pages.includes("h-milo-pil")],
  ["demoknop blijft", pages.includes("Book a free live demo")],
  ["Trusted by boven de logobalk, alleen merken", pages.includes(">Trusted by<") && !content.includes('"partners/odoo.svg"')],
  // 30 september 2026 (Marinus): "Deze video mag weg", My story staat niet meer in de header.
  ["volgorde: OS-film, dan Trusted by", /<HeroFilm\b[\s\S]*Trusted by/.test(pages)],
  ["regel over software weg", !pages.includes(">If software can&rsquo;t be free")],
  ["stijl R1: dun dan dik, groen dik", pages.includes('<b className="g">NO ONE CAN AUTOMATE PEOPLE WHO CARE</b><b>.</b>') && pages.includes('<span className="d">Software is a tool.</span> <b>We are SocialNow!</b>') && readFileSync("proposal/hero-c.css","utf8").includes("h-statement.is-r1")],
  ["geen dubbele expertzinnen meer", !pages.includes(">With a team of human experts") && !pages.includes("We get paid for our expertise")],
  // 30 september 2026 (Marinus): de demobanner werd een liggend sprekersblok met Marinus en Sid (Attesso).
  ["demo met Marinus en Sid van Attesso", pages.includes('className="h-sprekers"') && pages.includes("Sid van Kalken") && pages.includes("~/attesso")],
  ["zin over human control weg", !pages.includes("</strong> With all the human control")],
  ["Join our team met link naar vacatures", pages.includes('<span className="d">Join our team at:</span> <Link to="/vacatures">')],
  ["team met join-uitnodiging rechts", pages.includes("<TeamJoin />") && readFileSync("proposal/TeamTrust.tsx","utf8").includes("Let&rsquo;s make a difference together and join SocialNow! 🚀")],
  ["meer ruimte in het statement", readFileSync("proposal/hero-c.css","utf8").includes("statement lucht")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
