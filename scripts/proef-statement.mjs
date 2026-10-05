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
  // 1 oktober 2026 (Marinus): Trusted by met klantlogo's is weg; onder het statement staat "Talking to" met de Attesso-gesprekspartners.
  ["geen Trusted by meer, TALKING TO onder Attesso", !pages.includes(">Trusted by<") && pages.includes(">TALKING TO<") && !content.includes('"partners/odoo.svg"')],
  // 30 september 2026 (Marinus): "Deze video mag weg", My story staat niet meer in de header.
  ["volgorde: Attesso met TALKING TO, dan OS-film, dan statement", /~\/attesso[\s\S]*TALKING TO[\s\S]*<HeroFilm\b[\s\S]*h-statement is-r1/.test(pages)],
  ["regel over software weg", !pages.includes(">If software can&rsquo;t be free")],
  ["stijl R1: dun dan dik, groen dik", pages.includes('<b className="g">No one can automate people who care</b><b>.</b>') && pages.includes('<span className="d">Software is a tool.</span> <b>We are SocialNow!</b>') && readFileSync("proposal/hero-c.css","utf8").includes("h-statement.is-r1")],
  ["geen dubbele expertzinnen meer", !pages.includes(">With a team of human experts") && !pages.includes("We get paid for our expertise")],
  // 30 september 2026 (Marinus): de demobanner werd een liggend sprekersblok met Marinus en Sid (Attesso).
  ["demo met Marinus en Sid van Attesso", pages.includes('className="h-sprekers"') && pages.includes("Sid van Kalken") && pages.includes("~/attesso")],
  ["zin over human control weg", !pages.includes("</strong> With all the human control")],
  // 30 september 2026 (Marinus): "Deze weg op de site." De regel Join our team at: Jobs at SocialNow.nl gaat uit het statement.
  ["regel Join our team weg", !pages.includes("Join our team at:") && !pages.includes("Jobs at SocialNow.nl")],
  ["team met join-uitnodiging rechts", pages.includes("<TeamJoin />") && readFileSync("proposal/TeamTrust.tsx","utf8").includes("Let&rsquo;s make a difference together and join SocialNow!") && readFileSync("proposal/TeamTrust.tsx","utf8").includes("h-raket")],
  ["meer ruimte in het statement", readFileSync("proposal/hero-c.css","utf8").includes("statement lucht")],
  // 30 september 2026 (Marinus): "Alleen een lichte witte glow dus niet groen. Die komt alleen van links naar rechts bij hover."
  ["join-zin wit, glow alleen bij hover", (() => { const c = readFileSync("proposal/hero-c.css","utf8"); const blok = c.slice(c.indexOf("join-zin wit")); return blok.includes("join-zin wit") && !/h-team-join-tekst[^}]*#25d366/.test(blok) && blok.includes(".h-team-join:hover .h-team-join-tekst::after") && /h-team-join-tekst::after\s*\{[^}]*animation:\s*none/.test(blok); })()],
  // 30 september 2026 (Marinus): "Hier geen vuurtje alleen gewoon omhoog en ietsje minder nog."
  ["raket zonder vuur, recht en minder omhoog", !readFileSync("proposal/TeamTrust.tsx","utf8").includes("h-raket-vuur") && !readFileSync("proposal/hero-c.css","utf8").includes("h-raket-vuur") && readFileSync("proposal/hero-c.css","utf8").includes(".h-team-join:hover .h-raket, .sn-site .h-team-join:focus-visible .h-raket { transform: translateY(-6px); }")],
  // 30 september 2026 (Marinus): "Hier is nu rechts iets teveel witruimte." Het veiligheidsblok vult de volle breedte.
  ["veiligheidsblok zonder rechterwitruimte", !readFileSync("proposal/hero-c.css","utf8").includes(".h-hero-veilig { grid-column: 1 / -1; width: 100%; max-width: 1180px;")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
