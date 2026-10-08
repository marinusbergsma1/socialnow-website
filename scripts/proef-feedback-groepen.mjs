// Proef Feedback-groepen (8 oktober 2026, Marinus: "Vermeld dan nog op de site dat wij nu groepen van 500 toelaten door
// grote vraag en kwaliteitswaarborging. Noem het Feedback-groepen.").
// Leest de bouw in dist/, dus eerst npm run build. Rood op main cc08b43, groen op feat/feedback-groepen-20261008.
import { existsSync, readFileSync } from "node:fs";

if (!existsSync("dist/nl/index.html")) {
  console.error("Geen dist/nl/index.html: draai eerst npm run build.");
  process.exit(1);
}

const KOP = "Nu in Feedback-groepen van 500";
const UITLEG = "Door de grote vraag en om de kwaliteit te bewaken laten we per groep 500 mensen toe.";
const TALEN = ["nl", "en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const woordenboek = Object.fromEntries(TALEN.filter((t) => t !== "nl").map((t) => [t, JSON.parse(readFileSync(`proposal/i18n/${t}.json`, "utf8"))]));
const vertaal = (taal, zin) => (taal === "nl" ? zin : woordenboek[taal][zin]);
const ontsnap = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " " };
// Zichtbare tekst van de voorgerenderde pagina, zonder scripts, stijlen en tags.
const tekst = (pad) => {
  const html = readFileSync(`dist${pad === "/" ? "" : pad.replace(/\/$/, "")}/index.html`, "utf8");
  return (html.split('<div id="root"')[1] || "")
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ontsnap[n] ?? m)
    .replace(/\s+/g, " ");
};
const pad = (taal, route) => `${taal === "en" ? "" : `/${taal}`}${route}`;
const voor = (t, a, b) => Boolean(a) && Boolean(b) && t.includes(a) && t.includes(b) && t.indexOf(a) < t.indexOf(b);

const eisen = [
  ["de Nederlandse kop gebruikt exact de term Feedback-groepen en noemt 500", /\bFeedback-groepen\b/.test(KOP) && KOP.includes("500")],
];
for (const taal of TALEN.filter((t) => t !== "nl")) {
  const kop = vertaal(taal, KOP);
  const uitleg = vertaal(taal, UITLEG);
  eisen.push([
    `${taal}: kop en uitleg staan vertaald in het woordenboek, met Feedback en 500`,
    Boolean(kop && uitleg) && kop !== KOP && uitleg !== UITLEG && /feedback/i.test(kop) && kop.includes("500") && uitleg.includes("500"),
  ]);
}
for (const taal of TALEN) {
  const kop = vertaal(taal, KOP);
  const uitleg = vertaal(taal, UITLEG);
  const home = tekst(pad(taal, "/"));
  const os = tekst(pad(taal, "/het-os/"));
  const prijzen = tekst(pad(taal, "/prijzen/"));
  const login = vertaal(taal, "Log in op je gratis OS");
  const probeer = vertaal(taal, "Probeer het OS gratis");
  eisen.push([`${taal}: homepage noemt de Feedback-groepen bij het gratis aanbod`, Boolean(kop && uitleg) && home.includes(kop) && home.includes(uitleg)]);
  eisen.push([`${taal}: Het OS noemt de Feedback-groepen boven de knop ${login}`, Boolean(uitleg) && voor(os, kop, login) && os.includes(uitleg)]);
  eisen.push([`${taal}: aanbodpagina noemt de Feedback-groepen boven de knop ${probeer}`, Boolean(uitleg) && voor(prijzen, kop, probeer) && prijzen.includes(uitleg)]);
}
const nieuw = [KOP, UITLEG, ...TALEN.filter((t) => t !== "nl").flatMap((t) => [vertaal(t, KOP), vertaal(t, UITLEG)])].filter(Boolean).join(" ");
eisen.push(["geen modelnamen in de nieuwe teksten", !/claude|anthropic|openai|chatgpt|\bgpt\b|gemini/i.test(nieuw)]);

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
