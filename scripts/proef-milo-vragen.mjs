// Proef 30 september 2026: het vragenblok op de homepage is een gesprek met Milo (Opus 5.5 in de Worker, vragenlijst als
// vangnet), met vertrouwensstappen en de bron onder elk antwoord. Rood op main b759d3d, groen op fix/vragen-stijl-20260930.
import { existsSync, readFileSync } from "node:fs";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const pages = lees("proposal/pages.tsx"), mv = lees("proposal/MiloVragen.tsx"), ui = lees("proposal/ui.tsx"), worker = lees("worker/milo-worker.js");
const toml = lees("worker/wrangler.toml"), kennis = lees("worker/kennis.txt");
const home = pages.slice(pages.indexOf("export function Home()"), pages.indexOf("export function OsPage()"));
const eisen = [
  ["vragenblok is een gesprek met Milo", home.includes('<Tegel kop="Vraag het Milo"') && home.includes("<MiloVragen />") && !home.includes("<Questions />")],
  ["klaargezette vragen, rustig: vier plus meer", mv.includes("open.slice(0, 4)") && mv.includes('className="is-meer"')],
  ["eigen vraag via dezelfde Milo als de zwevende chat", ui.includes("export async function vraagMilo(") && ui.includes("await vraagMilo(heen, language, t)") && mv.includes("await vraagMilo(heen, language, t)")],
  ["vertrouwen: stappen tijdens het denken en de bron onder elk antwoord", mv.includes('"Versleuteld verstuurd", "Milo leest je vraag", "Checkt het tegen onze eigen kennis"') && mv.includes("h-mv-bron")],
  ["liever een mens: Steef met foto", home.includes('<Tegel kop="Liever een mens?"') && home.includes('src="/images/Steef-Komen.webp"')],
  ["Worker antwoordt met Claude Opus 5.5, met fallback", worker.includes('const MODEL = "claude-opus-5-5"') && worker.includes('fallbacks: "default"') && worker.includes('betas: ["server-side-fallback-2026-07-01"]')],
  ["Worker: limiet per bezoeker en geen sleutel in de code", toml.includes("[[ratelimits]]") && worker.includes("env.MILO_LIMIET") && !/sk-ant-|AIza[0-9A-Za-z_-]{20,}/.test(worker + toml)],
  ["kennis uit llms.txt en de vragenlijst", kennis.includes("## Aanbod en prijzen") && kennis.includes("## Veelgestelde vragen") && kennis.includes("V: Waar begin ik?")],
  ["meetlat voor Milo staat klaar", existsSync("scripts/milo-meetlat.mjs")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
