#!/usr/bin/env node
// Proef: de hero van de homepage (HeaderBestaand.tsx).
// 22 oktober 2026 (Marinus): "Kan jij zorgen dat de slogan op de website word A trusted growth and cyber security partner."
// en "Ipv dit en veranderende tekst. Gewoon bam dat statement en de uitlijning by security is verkeerd op mobiele versies."
// Dus: h1 is alleen het statement, zonder getypte regel, in alle 10 talen vertaald; de link Veilig in de vinkjes staat op
// een touchscreen op dezelfde lijn als de andere punten (geen 44 px hoge blokbox met de streep eronder).
// Daarna: "Hier graag growth - security - en eigen beheer en keuzes is wel goed." De vinkjes zijn Groei, Veiligheid (link)
// en Eigen beheer en keuzes; in het Engels Growth, Security en Your own control and choices.
// Gebruik: node scripts/check-hero-titel.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const H1 = "Een betrouwbare partner voor groei en cybersecurity.";
const EN = "A trusted growth and cyber security partner.";
const OUD = ["Haal meer uit je bedrijf.", "Get more out of your business."];
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const kop = fs.readFileSync("proposal/HeaderBestaand.tsx", "utf8");
const css = fs.readFileSync("proposal/header-bestaand.css", "utf8");
eis(new RegExp(`<h1( [^>]*)?>${H1.replace(/[.]/g, "\\.")}</h1>`).test(kop), `h1 is alleen "${H1}"`);
eis(!/<Typer|function Typer|const ZINNEN/.test(kop), "geen getypte, wisselende regel meer");
eis(!OUD.some(x => kop.includes(`>${x}`)), "oude titel staat niet meer in de hero");
eis(/\.bs-zeker a\{[^}]*min-height:\s*0/.test(css) && /\.bs-zeker a\{[^}]*border-bottom:\s*0/.test(css), "link Veilig heeft geen 44 px blokhoogte en geen losse streep");
const VINK = ["Groei", "Veiligheid", "Eigen beheer en keuzes"], VINK_EN = { Groei: "Growth", Veiligheid: "Security" };
const lijst = (kop.match(/<ul className="bs-zeker">([\s\S]*?)<\/ul>/) || [, ""])[1].replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\{\(\) => [^}]*\}/g, "");
const punten = [...lijst.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].replace(/<[^>]+>/g, "").trim());
eis(JSON.stringify(punten) === JSON.stringify(VINK), `vinkjes zijn ${VINK.join(", ")} (nu: ${punten.join(", ")})`);
eis(/<Link to="\/veiligheid"[^>]*>Veiligheid<\/Link>/.test(lijst), "Veiligheid linkt naar /veiligheid");
for (const t of TALEN) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  eis(VINK.slice(0, 2).every(k => typeof w[k] === "string" && w[k] !== k && (t !== "en" || w[k] === VINK_EN[k])), `${t}: Groei en Veiligheid vertaald`);
}
for (const t of TALEN) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  const ok = typeof w[H1] === "string" && w[H1].trim() && w[H1] !== H1;
  eis(ok && (t !== "en" || w[H1] === EN), `${t}: statement vertaald${t === "en" ? ` als "${EN}"` : ""}`);
}
if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");  // de titelpunt is een eigen span
  const nl = tekst("dist/nl/index.html"), en = tekst("dist/index.html");
  eis(nl.includes(H1), "gebouwde nl-pagina toont het statement");
  eis(en.includes(EN), "gebouwde en-pagina toont het Engelse statement");
  eis(!en.includes(OUD[1]) && !nl.includes(OUD[0]) && !nl.includes("bs-typer"), "gebouwde pagina's tonen de oude titel en typregel niet meer");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
