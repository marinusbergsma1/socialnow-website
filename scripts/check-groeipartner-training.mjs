#!/usr/bin/env node
// Proef: blok onder de homepage-header (Marinus 20 okt 2026): "Your growth partner in the AGI Era", probleem en oplossing
// (software hoort gratis te zijn, expertise kun je niet automatiseren), volledige AI-training van het team bij elk pakket op maat,
// teamtrainingen, AI-workshops en cursussen, de twee bevestigde sessies met vlag, en een echte beursfoto van Marinus en Steef.
// Gebruik: node scripts/check-groeipartner-training.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
// 22 oktober 2026: kop met cybersecurity erbij (Marinus).
const KOP = "Groei en cybersecurity in het AGI-tijdperk.", KOP_EN = "Growth and cybersecurity for the AGI era.";
const OUD = "Veiliger dan je verouderde software en processen.";
const VORMEN = ["Teamtrainingen", "AI-workshops", "Cursussen"];
const FOTO = ["800.webp", "1600.webp", "1600.jpg"].map(e => `public/images/beurs/marinus-steef-odoo-experience-${e}`);
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const ZELFDE = { sv: ["AI-workshops"], da: ["AI-workshops"] };  // leenwoord, in het Zweeds en Deens dezelfde schrijfwijze
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const src = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8");
const css = fs.readFileSync("proposal/samen-en-veilig.css", "utf8");
const veld = naam => (src.match(new RegExp(`\\b${naam}: "([^"]*)"`)) || [])[1] || "";
eis(veld("uspKop") === KOP, "kop is de groeipartner in het AGI-tijdperk");
eis(!src.includes(`uspKop: "${OUD}"`), "de oude veiligheidskop staat niet meer bovenaan");
eis(/échte taken/.test(veld("uspUitleg")) && /cybersecurity-experts/.test(veld("uspUitleg")), "echte taken en doelen, cybersecurity-experts die je data beschermen (22 okt)");
eis(/honderden euro/.test(veld("probleem")) && /bezit en zelf host/.test(veld("oplossing")), "probleem honderden euro's; oplossing: kopen, bezitten en zelf hosten (22 okt)");
eis(!!veld("probleem") && !!veld("oplossing") && src.includes("{t.probleemLabel}") && src.includes("{t.oplossingLabel}"), "probleem en oplossing staan er concreet en zichtbaar");
eis(/volledige AI-training/.test(veld("tUitleg")) && /pakket op maat/.test(veld("tUitleg")), "volledige AI-training bij elk pakket op maat");
eis(/trainingen en workshops op maat en op locatie, zodat jullie klaar zijn voor groei/.test(veld("tUitleg")), "trainingen en workshops op maat en op locatie, klaar voor groei");
eis(VORMEN.every(v => src.includes(`kop: "${v}"`)) && src.includes("sn-samen-vormen"), "teamtrainingen, AI-workshops en cursussen");
eis(/vlag: "be", naam: "Student Entrepreneurs Club", plaats: "Brussel"/.test(src) && /vlag: "nl", naam: "Talland College", plaats: "Hoorn"/.test(src), "bevestigde sessies in Brussel en Hoorn");
eis(src.includes('"#fdda24"') && src.includes('"#21468b"') && src.includes("<Vlag land={x.vlag} />") && css.includes(".sn-samen-vlag{"), "Belgische en Nederlandse vlag als svg");
// Zelfde dag: de beursfoto viel af ("niet dat je ziet dat we in gesprek gaan met mensen"); de lezingen heten "Volgende lezingen".
eis(veld("sessiesLabel") === "Volgende lezingen", "label boven de sessies is Volgende lezingen");
eis(/abonnementen/.test(veld("probleem")) && /niet met elkaar samenwerken/.test(veld("probleem")), "probleem: abonnementen op software en diensten die niet samenwerken");
eis(/bezit en zelf host/.test(veld("oplossing")) && /projecttarief/.test(veld("oplossing")), "oplossing: kopen, bezitten, zelf hosten, experts tegen projecttarief");
eis(src.includes("<Rocket size={14}") && !src.includes("Sparkles"), "raket bij Groeipartner, geen sterretje");
eis(!src.includes("sn-samen-foto") && FOTO.every(f => !fs.existsSync(f)), "de afgekeurde beursfoto staat er niet meer in");
eis(src.includes('naam: "Indexworld"') && src.includes('naam: "Uncanny"') && src.includes("sn-samen-partners"), "partners Indexworld en Uncanny blijven erin");
const nieuw = ["uspLabel", "uspKop", "uspUitleg", "probleemLabel", "probleem", "oplossingLabel", "oplossing", "tLabel", "tKop", "tUitleg", "sessiesLabel"].map(veld)
  .concat(VORMEN, [...src.matchAll(/kop: "[^"]*", tekst: "([^"]*)"/g)].map(m => m[1]).filter(t => !/Indexworld|Uncanny/.test(t)).slice(0, 3));
for (const t of TALEN) {
  const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8"));
  const mist = nieuw.filter(k => !(typeof w[k] === "string" && w[k].trim() && (w[k] !== k || (ZELFDE[t] || []).includes(k))));
  const kop = w[KOP] || "";
  eis(!mist.length && (t !== "en" || kop === KOP_EN) && kop.length <= 44 && !/[–—]/.test(nieuw.map(k => w[k]).join(" ")), `${t}: alles vertaald, kop kort genoeg (${kop.length} tekens)${mist.length ? `, mist: ${mist.slice(0, 2).join(" | ")}` : ""}`);
}
if (process.argv.includes("--dist")) {
  const tekst = f => fs.readFileSync(f, "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  const nl = tekst("dist/nl/index.html"), en = tekst("dist/index.html");
  eis(nl.includes(KOP) && nl.includes("Volgende lezingen") && nl.includes("Talland College"), "gebouwde nl-pagina toont kop en Volgende lezingen");
  eis(en.includes(KOP_EN) && en.includes("Upcoming talks") && !en.includes("marinus-steef-odoo-experience"), "gebouwde en-pagina toont kop, Upcoming talks en geen beursfoto");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
