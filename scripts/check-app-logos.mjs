#!/usr/bin/env node
// Proef: appwand (proposal/apps.ts), Marinus 19 okt 2026: "Zoek met meerdere chats overal het juiste svg logo van." en
// "Verder bestaat Facebook niet eens meer dus kan die weg. Meta ervan maken."
// Vijf chats zochten de officiële SVG's; vijf apps hebben er aantoonbaar geen en houden een naamtegel.
// Gebruik: node scripts/check-app-logos.mjs   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const apps = [...fs.readFileSync("proposal/apps.ts", "utf8").matchAll(/^  (\{"naam".*\}),?$/gm)].map(m => JSON.parse(m[1]));
const zonder = apps.filter(a => !a.logo).map(a => a.slug).sort();
const ZONDER_OFFICIEEL = ["adobe-express", "google-business-profile", "stability", "twinfield", "yuki"];
eis(apps.length === 215, `215 apps op de wand (${apps.length})`);
eis(!apps.some(a => /^facebook$/i.test(a.naam) || a.slug === "facebook"), "Facebook staat er niet meer");
const meta = apps.find(a => a.slug === "meta");
eis(meta && meta.naam === "Meta" && meta.status === "os" && meta.logo === "/images/apps/meta.svg", "Meta staat erop, In het OS, met het Meta-logo");
eis(JSON.stringify(zonder) === JSON.stringify(ZONDER_OFFICIEEL), `alleen apps zonder officiële SVG hebben geen logo (${zonder.length}: ${zonder.join(", ")})`);
const officieel = JSON.parse(fs.readFileSync("scripts/app-logos-officieel.json", "utf8"));
eis(Object.keys(officieel).every(s => fs.existsSync(`public/images/apps/${s}.svg`) && officieel[s].bron && officieel[s].pagina && officieel[s].licentie), "elk officieel logo heeft een bestand en een bron, pagina en licentie");
const vuil = fs.readdirSync("public/images/apps").filter(f => f.endsWith(".svg") && !f.startsWith("._")).filter(f => /<script|\son[a-z]+=|href="https?:|<image|<foreignObject/i.test(fs.readFileSync(`public/images/apps/${f}`, "utf8")));
eis(vuil.length === 0, `geen scripts, links of bitmaps in de logo's${vuil.length ? ": " + vuil.join(", ") : ""}`);
const bronnen = fs.readFileSync("public/images/apps/BRONNEN.md", "utf8");
eis(apps.filter(a => a.logo).every(a => bronnen.includes(`| ${a.slug}.svg |`)), "elk logo staat met bron in BRONNEN.md");
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
