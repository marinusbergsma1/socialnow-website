#!/usr/bin/env node
// Proef: het 32-px-stippenraster is overal duidelijk zichtbaar. Marinus, 4 november 2026: "EN DIE FUCKING DOTS OVERAL MEER DUIDELIJK
// DAT ZEG IK AL 100X NU". Eisen: minimale dekking en straal van de stippen (canvas én css-terugval), raster 32 px, en de donkere
// vlakken die het raster afdekten zijn doorzichtig. Met --dist: de gebouwde css bevat het duidelijke raster.
// Gebruik: node scripts/check-stippen-zichtbaar.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
// Ondergrens, geen maximum. Daarna "Dots zijn nu te ...": middenweg .18 / 1,1 px; de drempel bewaakt dat het niet weer wegzakt.
// Avond 4 nov: "de dots zijn te zichtbaar ook en het is niet mooi": .13 / 1 px, ondergrens .12 / 1 px, bovengrens .15.
const MIN_DEKKING = 0.12, MIN_STRAAL = 1;

const ts = fs.readFileSync("proposal/stippen.ts", "utf8");
const veld = ts.match(/site = new Veld\(c, \{ basis: "rgba\(255,255,255,([\d.]+)\)", vast: true, r: ([\d.]+) \}\)/);
eis(!!veld && +veld[1] >= MIN_DEKKING && +veld[2] >= MIN_STRAAL, `canvas: dekking ≥ ${MIN_DEKKING} en straal ≥ ${MIN_STRAAL} (nu ${veld ? `${veld[1]} en ${veld[2]}` : "onbekend"})`);

// "Dots zijn nu te ..." (na #204 te fel): rustig maar duidelijk, de middenweg tussen .1 (te zwak) en .26 (te fel).
eis(!!veld && +veld[1] <= 0.15, `canvas rustig: dekking hoogstens 0.15 (nu ${veld ? veld[1] : "onbekend"})`);

const css = fs.readFileSync("proposal/stippen.css", "utf8");
const body = css.match(/:root body \{[^}]*background-image: radial-gradient\(circle at 16px 16px, rgba\(255, 255, 255, ([\d.]+)\) ([\d.]+)px[^}]*background-size: 32px 32px/);
eis(!!body && +body[1] >= MIN_DEKKING && +body[2] >= MIN_STRAAL, `css-terugval op body: zelfde duidelijke stip op een raster van 32 px (nu ${body ? `${body[1]} en ${body[2]}px` : "onbekend"})`);

const DOORZICHTIG = [".sn-web-tile", ".sn-samen", ".sn-samen-blok", ".sn-samen-partner", ".prijs-kaart", ".sn-infrastructure", ".h-bedankt"];
const regel = css.match(/:root \.sn-site :is\(([^)]*)\) \{ background-color: transparent !important; \}/);
eis(!!regel && DOORZICHTIG.every((k) => regel[1].includes(k)), `donkere vlakken laten het raster door (${DOORZICHTIG.join(", ")})`);
eis(/\.h-producten-menu \{[^}]*background-image: radial-gradient\(circle at 16px 16px, rgba\(255, 255, 255, \.1[2-5]\)[^}]*background-size: 32px 32px/.test(css), "uitklapmenu's: zwart met hetzelfde raster erin");

// "Dit ook weg ik wil die oude kWh site niet meer zien." Geen beeld van de oude kWh Garant-site op de homepage of in de onboarding.
const zichtbaar = ["proposal/HomeEnthousiast.tsx", "proposal/GratisWebsite.tsx"].map((f) => fs.readFileSync(f, "utf8")).join("\n");
eis(!/kwhgarant|cases\/kwh/.test(zichtbaar), "geen beeld van de oude kWh Garant-site op de homepage en in de onboarding");

if (process.argv.includes("--dist")) {
  const assets = fs.readdirSync("dist/assets").filter((f) => f.endsWith(".css")).map((f) => fs.readFileSync(`dist/assets/${f}`, "utf8")).join("\n");
  eis(/rgba\(255,\s*255,\s*255,\s*\.1[2-5]\)\s*1(\.\d+)?px/.test(assets), "gebouwde css bevat het duidelijke raster");
  const home = fs.readFileSync("dist/nl/index.html", "utf8");
  eis(!/kwhgarant/.test(home), "gebouwde homepage zonder het oude kWh-beeld");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
