// Proef doelmeter €1.000.000 en team met eigen bedrijfsnaam (3 oktober 2026). Rood op main f3e5a43, groen op
// feat/doel-familie-20261003 zodra Marinus de stand, de bestemming en de teamgegevens heeft gegeven.
// Marinus: "people joining our cause by joining the new way of working. Not another useless tool. How Steve Jobs intended
// compute to be.", "We doubled our team in a week." en "WE KNOW WHAT'S COMING NOW. AND IT'S GOING TO BE SOCIAL!".
// De twee poorten onderaan (stand bevestigd, Bruno en Robbin) blijven rood tot zijn antwoord: zo kan er niets live.
// Draai: node scripts/proef-doel.mjs [map]   (exit 0 = groen; map = andere checkout, standaard deze).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const map = process.argv[2] ?? ".";
const lees = (p) => (existsSync(join(map, p)) ? readFileSync(join(map, p), "utf8") : "");
const doel = lees("proposal/Doel.tsx");
const stand = lees("proposal/doel-stand.ts");
const css = lees("proposal/doel.css");
const pages = lees("proposal/pages.tsx");
const content = lees("proposal/content.ts");
const woordenboeken = ["en", "de", "fr"].map((taal) => JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}"));

const waarde = (veld) => (stand.match(new RegExp(`^\\s*${veld}:\\s*([^,\\n]+)`, "m")) ?? [])[1]?.trim() ?? "";
const nlZinnen = [...doel.matchAll(/>\s*([A-Z][^<>{}]*?[a-z.!?])\s*</g)].map((m) => m[1].replace(/\s+/g, " ").trim())
  .concat([...doel.matchAll(/(?:kop|label)="([^"]+)"/g)].map((m) => m[1]))
  .concat([...doel.matchAll(/\bt\("([^"]+)"\)/g)].map((m) => m[1]))
  .filter((z) => !/joining|doubled|COMING|SOCIAL|Steve Jobs|Not another/.test(z));
const modelnamen = /\b(Claude|Anthropic|OpenAI|ChatGPT|GPT|Gemini|Llama|Mistral|Copilot)\b/;
const mensen = [...content.matchAll(/name: "([^"]+)"[\s\S]*?image: "([^"]+)"([\s\S]*?)\}/g)]
  .map((m) => ({ naam: m[1], beeld: m[2], bedrijf: /bedrijf: "[^"]+"/.test(m[3]) }));

const eisen = [
  ["één bronbestand proposal/doel-stand.ts met einddoel 1000000",
    waarde("einddoel") === "1000000"],
  ["Doel.tsx haalt bedrag en deelnemers alleen uit doel-stand.ts (geen bedragen hard in de component)",
    doel.includes('from "./doel-stand"') && !/1[.,]000[.,]000|1000000|€\s?\d/.test(doel)],
  ["zonder liveschakelaar en bevestigde stand geen sectie in de productiebuild en geen nepbedrag",
    /if \(!\(DOEL\.live && doelBevestigd\) && !import\.meta\.env\.DEV\) return null/.test(doel) && waarde("live") !== "" && /opgehaald === null \? <strong className="is-volgt">Stand volgt<\/strong>/.test(doel)],
  ["bento-taal: Bento en Tegel, geen eigen sectiekop",
    /<Bento\b/.test(doel) && (doel.match(/<Tegel\b/g) ?? []).length >= 6 && !/<section|<h2/.test(doel)],
  ["de regels van Marinus staan er letterlijk en blijven Engels",
    ["joining our cause by joining the new way of working.", "Not another useless tool. How Steve Jobs intended compute to be.",
      "We doubled our team in a week.", "WE KNOW WHAT&rsquo;S COMING NOW.", "AND IT&rsquo;S GOING TO BE SOCIAL!"].every((z) => doel.includes(z))
      && (doel.match(/translate="no"/g) ?? []).length >= 4],
  ["voor werkgevers en werkzoekenden, met knoppen naar mail en /vacatures",
    doel.includes("Voor werkgevers en werkzoekenden.") && doel.includes("mailLink(") && doel.includes('to="/vacatures"')],
  ["zijn waarom: automatiseren voor de verbinding tussen creatives en ondernemers, zelf de diepgang kiezen",
    /verbinding tussen creatives en ondernemers/.test(doel) && /waar je de diepgang in gaat/.test(doel)],
  ["verdienmodel: geen oneerlijk verdienmodel, eigen klanten, geen managementlagen, keihard werken (geen '0 kosten' zonder akkoord)",
    /Geen oneerlijk verdienmodel nodig\./.test(doel) && /genoeg verdiend met mijn eigen klanten/.test(doel)
      && /Geen managementlagen\./.test(doel) && /keihard werken/.test(doel) && !/0 kosten|overhead/.test(doel.replace(/\{\/\*[\s\S]*?\*\/\}/g, ""))],
  ["team trots met eigen bedrijfsnaam in de tegel",
    /persoon\.bedrijf/.test(doel) && /Trots op ons team/.test(doel) && mensen.filter((p) => p.bedrijf).length >= 9
      && /<b translate="no">\{persoon\.name\}<\/b>/.test(doel) && !/<ul className="h-doel-gezichten" translate="no"/.test(doel)],
  ["Pepijn Bos (Bos Design) en Armando van Bruggen (Bruggn Design) staan in het team met portret",
    ["Pepijn Bos", "Armando van Bruggen"].every((n) => mensen.some((p) => p.naam === n && p.bedrijf && existsSync(join(map, "public/images", p.beeld))))],
  ["oproep ook voor partners en investeerders, mailonderwerp vertaald",
    doel.includes('to="/investeerders"') && doel.includes('mailLink(t("Meedoen als werkgever"))')],
  ["sectie staat op de homepage na het verhaal",
    /const Doel = later\(/.test(pages) && /<Verhaal \/>\s*\{\/\*[\s\S]*?\*\/\}\s*<Doel \/>/.test(pages)],
  ["eigen CSS voor meter en teamtegel, ook voor de telefoon",
    /\.h-doel-balk/.test(css) && /@media \(max-width: 760px\)/.test(css) && /import "\.\/doel\.css";/.test(pages) && !/import "\.\/doel\.css"/.test(doel)],
  ["geen modelnamen in de copy",
    doel !== "" && !modelnamen.test(doel) && !modelnamen.test(stand)
      && woordenboeken.every((w) => nlZinnen.every((z) => !modelnamen.test(w[z] ?? "")))],
  ["geen losse algemene sleutel 'van' in de woordenboeken",
    woordenboeken.every((w) => !("van" in w))],
  [`alle Nederlandse zinnen (${nlZinnen.length}) staan in en, de en fr`,
    nlZinnen.length >= 15 && woordenboeken.every((w) => nlZinnen.every((z) => typeof w[z] === "string" && w[z].length > 0))],
  // Poorten: rood tot Marinus antwoordt.
  ["POORT stand bevestigd: opgehaald, deelnemers, datum en bestemming echt ingevuld, bestemming vertaald in en/de/fr",
    ["opgehaald", "deelnemers", "bijgewerkt", "bestemming"].every((v) => waarde(v) !== "" && !waarde(v).startsWith("null"))
      && woordenboeken.every((w) => typeof w[JSON.parse(waarde("bestemming").replace(/,$/, "") || "null")] === "string")],
  ["POORT Bruno en Robbin in het team, met foto en bedrijfsnaam",
    ["Bruno", "Robbin"].every((n) => mensen.some((p) => p.naam.startsWith(n) && p.bedrijf && existsSync(join(map, "public/images", p.beeld))))],
  ["POORT liveschakelaar aan na akkoord van Marinus",
    waarde("live").startsWith("true")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
