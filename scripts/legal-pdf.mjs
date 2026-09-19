// De juridische documenten als pdf — 19 september 2026.
//
// WAAROM ZE GEMAAKT WORDEN EN NIET GESCHREVEN
//
// Een pdf die met de hand naast een webpagina wordt bijgehouden loopt binnen een maand uit de
// pas, en dan staan er twee versies van dezelfde afspraak in de wereld met verschillende tekst.
// Bij een privacybeleid of een verwerkersovereenkomst is dat geen slordigheid maar een risico:
// welke versie geldt dan? Daarom komen deze pdf's uit precies dezelfde bron als de pagina's
// (components/legal-index.ts), en draait dit script bij elke build mee.
//
// HOE
//
// De tekst gaat door scripts/pdf-schrijver.mjs, een kleine pdf-schrijver in dit project zelf.
// De eerste opzet liet Chrome de documenten afdrukken. Dat gaf een mooi resultaat en precies één
// keer: bij het tweede document bleef Chrome staan zonder melding, en daarna ook bij een proef
// van drie regels. Een bouwstap die soms werkt is geen bouwstap. De schrijver hiernaast gebruikt
// de standaardletters van pdf zelf, dus er valt niets in te sluiten en niets te installeren, en
// hij levert op elke machine hetzelfde bestand op.
//
// GEBRUIK
//   node scripts/legal-pdf.mjs            alle documenten, nl en en
//   node scripts/legal-pdf.mjs --check    alleen kijken of alles er is, niets maken
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Pdf, A4 } from "./pdf-schrijver.mjs";

const WORTEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UIT = path.join(WORTEL, "public", "documenten");
const TALEN = ["nl", "en"];
const MM = 72 / 25.4;

// De documenten staan in TypeScript. Dit script draait in Node, dat dat niet leest.
//
// Hier stond eerst een kleine regex die de typen eruit knipte. Dat leek genoeg, want deze
// bestanden bevatten alleen data. Het brak twee keer: een type op één regel eindigt óók op "};"
// en at daarmee het eerstvolgende document op, en een niet-geëxporteerd type in legal-vertaald.ts
// viel buiten het patroon. Beide keren was de fout niet dat de regex verkeerd stond, maar dat ik
// aannam dat TypeScript met een regex te herkennen is. Dat is het niet. Daarom draait nu de
// compiler zelf: die staat er al als devDependency en weet precies wat een type is.
function laadDocumenten() {
  const tijdelijk = fs.mkdtempSync(path.join(os.tmpdir(), "socialnow-legal-"));
  execFileSync("npx", ["tsc", "components/legal-index.ts",
    "--outDir", tijdelijk, "--module", "esnext", "--target", "es2022",
    "--moduleResolution", "bundler", "--skipLibCheck",
  ], { cwd: WORTEL, stdio: "inherit" });

  // De compiler laat de importpaden staan zoals ze in de bron stonden: zonder extensie, want de
  // bundelaar vult die aan. Node doet dat niet, dus dat gebeurt hier.
  for (const naam of fs.readdirSync(tijdelijk).filter((n) => n.endsWith(".js"))) {
    const bestand = path.join(tijdelijk, naam);
    fs.writeFileSync(bestand, fs.readFileSync(bestand, "utf8").replace(/(from\s+")(\.\/[a-z0-9-]+)(")/g, "$1$2.js$3"));
  }
  return { pad: tijdelijk, url: pathToFileURL(path.join(tijdelijk, "legal-index.js")).href };
}

const VOET = {
  nl: "SocialNow · Amstelstraat 43G, 1017 DA Amsterdam · KVK 90877179 · privacy@socialnow.nl",
  en: "SocialNow · Amstelstraat 43G, 1017 DA Amsterdam, the Netherlands · CoC 90877179 · privacy@socialnow.nl",
};
const BINDEND = {
  nl: "De Nederlandse tekst is de bindende versie. De actuele versie staat altijd op socialnow.nl",
  en: "The Dutch text is the binding version. The current version is always at socialnow.nl",
};
const GROEN = [0.04, 0.48, 0.22];
const GRIJS = [0.35, 0.35, 0.35];

// De omslag. Eén pagina met de titel, waar het document over gaat, de datum en de bedrijfsgegevens.
// Niet omdat het mooi is, maar omdat een document dat in een inkoopdossier belandt zichzelf moet
// kunnen voorstellen, zonder dat iemand ernaast moet onthouden welk bestand dit ook alweer was.
function omslag(pdf, doc, taal, slug) {
  pdf.y = A4.hoogte - 48 * MM;
  pdf.regel("SOCIALNOW", { grootte: 10, vet: true, kleur: GROEN });
  pdf.y -= 16 * MM;
  pdf.alinea(doc.title, { grootte: 27, vet: true, regelhoogte: 1.12, na: 8 * MM });
  pdf.alinea(doc.intro, { grootte: 11, regelhoogte: 1.5, kleur: GRIJS, na: 0 });

  pdf.y = pdf.onder + 26 * MM;
  pdf.lijn();
  pdf.alinea(doc.updated, { grootte: 8.6, vet: true, na: 1.5 });
  pdf.alinea(BINDEND[taal] + "/" + slug, { grootte: 8.4, kleur: GRIJS, na: 1.5 });
  pdf.alinea(VOET[taal], { grootte: 8.4, kleur: GRIJS, na: 0 });
  pdf.nieuwePagina();
}

function schrijf(doc, taal, slug) {
  const pdf = new Pdf();
  omslag(pdf, doc, taal, slug);
  for (const sectie of doc.sections) {
    pdf.kop(sectie.title);
    sectie.paragraphs.forEach((p, i) => {
      pdf.alinea(p);
      const punten = sectie.bullets && sectie.bullets[i];
      if (punten && punten.length) pdf.opsomming(punten);
    });
  }
  pdf.voetregels(doc.title + " · SocialNow · socialnow.nl/" + slug);
  return pdf.bouw({ titel: doc.title + " — SocialNow" });
}

async function main() {
  const alleenControleren = process.argv.includes("--check");
  const geladen = laadDocumenten();
  const mod = await import(geladen.url);
  const documenten = mod.DOCUMENTEN;
  fs.rmSync(geladen.pad, { recursive: true, force: true });

  const verwacht = documenten.flatMap((d) => TALEN.map((t) => `socialnow-${d.slug}-${t}.pdf`));
  if (alleenControleren) {
    const mist = verwacht.filter((n) => !fs.existsSync(path.join(UIT, n)));
    if (mist.length) { console.error("legal-pdf: deze pdf's ontbreken:\n  " + mist.join("\n  ")); process.exit(1); }
    console.log(`legal-pdf: ${verwacht.length} pdf's aanwezig`);
    return;
  }

  fs.mkdirSync(UIT, { recursive: true });
  let gemaakt = 0;
  for (const d of documenten) {
    for (const taal of TALEN) {
      const doc = d.doc[taal] || d.doc.en;
      const bestand = path.join(UIT, `socialnow-${d.slug}-${taal}.pdf`);
      const bytes = schrijf(doc, taal, d.slug);
      // Een pdf van een paar honderd bytes betekent dat er geen tekst in staat. Die hoort niet
      // stilletjes weggeschreven te worden; dan is er hierboven iets misgegaan.
      if (bytes.length < 2000) throw new Error("verdacht kleine pdf: " + bestand);
      fs.writeFileSync(bestand, bytes);
      gemaakt++;
    }
  }
  console.log(`legal-pdf: ${gemaakt} pdf's gemaakt in public/documenten`);
}

main().catch((e) => { console.error("legal-pdf:", e.message); process.exit(1); });
