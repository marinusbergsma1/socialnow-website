#!/usr/bin/env node
// Proef: homepage-indeling van Marinus, 19 okt 2026 (avond): Developers + AI weg; Connect met meer over ons als team; daarna
// websites; dan technologie met een duidelijke rol en plug and play in één bentogrid; dan resultaten en reviews; "Vier
// gezichten" weg. Gebruik: node scripts/check-homepage-indeling.mjs [--dist]   (rood op main vóór de wijziging, groen erna)
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const pages = fs.readFileSync("proposal/pages.tsx", "utf8");
const home = pages.slice(pages.indexOf("export function Home()"));
const volgorde = ["<HeaderBestaand", "<SamenEnVeilig", "<HomeConnectBand", "<ConnectExperts", "<FreeWebsite", "<HomeTechniek", "<Bereikt"];
const plekken = volgorde.map(v => home.indexOf(v));
eis(plekken.every(p => p >= 0) && plekken.every((p, i) => i === 0 || p > plekken[i - 1]), `volgorde: ${volgorde.join(" → ").replace(/</g, "")}`);
eis(!home.includes("Vier gezichten") && !home.includes("agents.map"), "Vier gezichten staat niet meer op de homepage");
eis(!home.includes("<PixelInfrastructure") && !home.includes('id="jouw-systeem"'), "technologie en plug and play zijn één bentogrid, geen twee losse blokken");
const tech = pages.slice(pages.indexOf("function HomeTechniek"), pages.indexOf("export function Home()"));
eis(tech.includes("<Bento") && tech.includes("Plug and play.") && tech.includes("Technologie met een duidelijke rol"), "bentogrid noemt technologie met een duidelijke rol en plug and play");
eis((tech.match(/<Tegel /g) || []).length <= 5, "bentogrid is kort: hooguit vijf tegels");
eis(!fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8").includes("sn-samen-mens"), "Developers + AI is weg");
const cx = fs.readFileSync("proposal/ConnectExperts.tsx", "utf8");
eis(cx.includes('className="cx-team"'), "Connect vertelt over ons als team");
if (process.argv.includes("--dist")) {
  const nl = fs.readFileSync("dist/nl/index.html", "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  eis(!nl.includes("Samen beter beschermd dan elk apart") && !nl.includes("Vier gezichten"), "gebouwde nl-homepage zonder Developers + AI en Vier gezichten");
  eis(nl.includes('class="cx-team"') && nl.includes("Technologie met een duidelijke rol"), "gebouwde nl-homepage heeft het teamverhaal en de technologie-bento");
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
