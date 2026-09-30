// Proef 30 september 2026, ronde van 17 uur: statement, My story weg, AZ in kleur, VASTIQ uitzoomen, cachekoppen.
// Rood op main c39e803, groen op fix/lac-licht-20260930.
import { existsSync, readFileSync } from "node:fs";
const lees = (p) => readFileSync(p, "utf8");
const pages = lees("proposal/pages.tsx"), content = lees("proposal/content.ts"), verhaal = lees("proposal/Verhaal.tsx"), bereikt = lees("proposal/Bereikt.tsx");
const vercel = JSON.parse(lees("vercel.json"));
const kop = (bron) => vercel.headers.find((h) => h.source === bron)?.headers.find((k) => k.key === "Cache-Control")?.value || "";
const eisen = [
  ["statement: fully automated systems, human control, team van experts", pages.includes("Proven, branded, <strong>fully automated systems.</strong> With all the human control and help necessary.") && pages.includes("With a team of human experts to help you in every step.")],
  ["witregel voor That's why we offer it for free", /<p className="h-statement-zin h-statement-gratis">\s*<strong>That&rsquo;s why we offer it for free\.<\/strong>/.test(pages) && lees("proposal/hero-c.css").includes(".h-statement-gratis { margin-top:")],
  ["My story-film niet meer in de header", !pages.includes("<HeroStory") && !pages.includes('className="h-story-vol"')],
  ["AZ in kleur in Trusted by en in het verhaal", content.includes('["merken/AZ-LOGO-KLEUR.svg", "AZ"') && verhaal.includes('src="/images/merken/AZ-LOGO-KLEUR.svg"') && existsSync("public/images/merken/AZ-LOGO-KLEUR.svg") && lees("public/images/merken/AZ-LOGO-KLEUR.svg").includes("#d31245")],
  ["VASTIQ speelt de uitzoomfilm, licht", bereikt.includes('src="/video/vastiq/vastiq-uitzoom.mp4"') && existsSync("public/video/vastiq/vastiq-uitzoom.mp4") && readFileSync("public/video/vastiq/vastiq-uitzoom.mp4").length < 2.5e6 && !existsSync("public/video/vastiq/vastiq-zoom-v2.mp4")],
  ["cache: gehashte bestanden een jaar, beeld en film uit de cache", kop("/assets/(.*)").includes("immutable") && kop("/(images|video|videos|proposal)/(.*)").includes("stale-while-revalidate")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
