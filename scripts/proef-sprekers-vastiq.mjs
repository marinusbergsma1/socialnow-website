// Proef 30 september 2026: liggend sprekersblok (Marinus en Sid van Attesso) en VASTIQ als hoofdstuk in het verhaal.
// Rood op main a4a084c, groen op feat/sprekers-vastiq-verhaal-20260930.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
const lees = (p) => readFileSync(p, "utf8");
const pages = lees("proposal/pages.tsx"), css = lees("proposal/hero-c.css"), verhaal = lees("proposal/Verhaal.tsx");
const hash = (p) => existsSync(p) ? createHash("sha1").update(readFileSync(p)).digest("hex") : "";
const home = pages.slice(pages.indexOf("export function Home()"));
const talen = ["en", "de", "fr"].map((t) => JSON.parse(lees(`proposal/i18n/${t}.json`)));
const eisen = [
  ["sprekersblok liggend over de hele breedte", /\.h-hero \.h-sprekers \{ grid-column: 1 \/ -1; display: grid; grid-template-columns: minmax\(0, 1\.25fr\) minmax\(0, \.8fr\) minmax\(0, \.8fr\)/.test(css) && home.includes("<HeroSprekers />")],
  ["twee sprekers: Marinus en Sid van Attesso", pages.includes('className="h-spreker is-socialnow"') && pages.includes('className="h-spreker is-attesso"') && pages.includes("Sid van Kalken") && pages.includes("Founder, SocialNow")],
  ["samen met Attesso, ook voor lezingen", pages.includes("SocialNow and Attesso build this together") && pages.includes("Book us for a talk")],
  ["Sid in Attesso-roze met een nieuwe, minder zakelijke foto", css.includes(".h-spreker.is-attesso { border-color: #d4a0b5;") && existsSync("public/images/sid-attesso.webp") && hash("public/images/sid-attesso.webp") !== hash("public/images/Sid-van-Kalken.webp")],
  ["geen kleine demoknop meer in de linkerkolom", !pages.includes("h-demo-knop is-groot")],
  ["VASTIQ-hoofdstuk met Steef, vlak voor Het OS", /wanneer: "VASTIQ",\s*titel: "Met Steef Komen zetten we VASTIQ op\."[\s\S]*?wanneer: "Het OS"/.test(verhaal) && !verhaal.includes('wanneer: "De partner"') && existsSync("public/images/cases/vastiq-waarde-640.webp")],
  ["VASTIQ-hoofdstuk vertaald in en, de en fr", talen.every((d) => d["Met Steef Komen zetten we VASTIQ op."] && d["Wat we voor VASTIQ bouwden, werd SocialNow OS: branding, advertenties en Odoo als laatste sleutel."])],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
