#!/usr/bin/env node
// Proef, Marinus 25 nov 2026: "Kan ie eindigen op een groene outline nadat de vulling terug afzakt naar rechts en alleen een slider op
// mobiel van de partnership logo's." en "Er mag wel een zwarte overlay over de foto heen nog." Rood op main, groen na de wijziging.
import fs from "node:fs";
const fouten = [];
const eis = (ok, t) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${t}`); if (!ok) fouten.push(t); };
const tsx = fs.readFileSync("proposal/HeaderAlgemeen.tsx", "utf8"), css = fs.readFileSync("proposal/header-algemeen.css", "utf8");
const veeg = (css.match(/@keyframes sn-alg-veeg\{(.*?\})\}/) || [])[1] || "";
eis(/\[data-stand="call"\]::after\{[^}]*animation:sn-alg-veeg/.test(css), "na de klik speelt de groene veeg één keer");
eis(/0%\{transform:translateX\(101%\)\}/.test(veeg) && /translateX\(0\)/.test(veeg) && /100%\{transform:translateX\(101%\)\}/.test(veeg), "groen komt van rechts en zakt daarna terug naar rechts");
eis(/\.sn-alg-filmknop\[data-stand="call"\]\{[^}]*border-color:#25d366/.test(css) && /\.sn-alg-filmknop\[data-stand="call"\]\{[^}]*background:#0b0e0d/.test(css), "eindstand: donkere pil met groene outline");
eis(/\[data-stand="call"\] \.rond\{[^}]*background:#25d366[^}]*color:#fff/.test(css), "rondje groen met witte pijl, zoals Website-actie");
eis(/data-vers=/.test(tsx) && /onMouseLeave/.test(tsx), "direct na de klik vult hover niet meteen weer, pas na eerst weggaan");
eis(/@media\(max-width:760px\)\{[^@]*\.sn-alg-keur-baan\{[^}]*animation:sn-alg-keur-loop/.test(css), "logo-slider alleen op mobiel");
eis(/\.sn-alg-keur-baan\{[^}]*flex-wrap:wrap/.test(css) && /\.sn-alg-keur-baan li\[aria-hidden="true"\]\{display:none\}/.test(css), "op desktop één stille rij logo's");
eis(/className="sn-alg-filmwaas"/.test(tsx) && /\.sn-alg-filmwaas\{[^}]*background:#000[^}]*opacity:\.\d+/.test(css) && /\.sn-alg-filmwaas\[data-weg\]\{opacity:0\}/.test(css), "zwarte overlay over het startbeeld, weg zodra de film speelt");
eis(!/letter-spacing:\s*-/.test(css), "geen negatieve letterafstand");
if (fouten.length) { console.log(`\n${fouten.length} rood`); process.exit(1); } else console.log("\nAlles groen");
