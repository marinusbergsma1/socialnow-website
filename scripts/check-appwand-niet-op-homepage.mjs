#!/usr/bin/env node
// Proef (Marinus 20 okt 2026): "Apps is misschien iets voor os zelf niet voor de homepage." en "Zet ook maar live trouwens."
// De appwand staat niet meer op de homepage; het onderdeel en de logo's blijven bewaard voor het OS.
// Gebruik: node scripts/check-appwand-niet-op-homepage.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const fw = fs.readFileSync("proposal/FreeWebsite.tsx", "utf8");
eis(!fw.includes("<AppWand") && !fw.includes('from "./AppWand"'), "het websiteblok op de homepage toont de appwand niet meer");
eis(fs.existsSync("proposal/AppWand.tsx") && fs.existsSync("proposal/apps.ts") && fs.existsSync("public/images/apps/meta.svg"), "AppWand, de lijst en de logo's blijven bewaard voor het OS");
if (process.argv.includes("--dist")) {
  for (const f of ["dist/nl/index.html", "dist/index.html"]) {
    const h = fs.readFileSync(f, "utf8");
    eis(!h.includes("sn-aw-") && !h.includes("/images/apps/"), `${f}: geen appwand en geen app-logo's`);
    eis(h.includes("sn-web-deck"), `${f}: de websitekaarten staan er nog`);
  }
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
