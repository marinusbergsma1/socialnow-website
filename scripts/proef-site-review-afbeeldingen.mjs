// Proef M11 (Indexworld, 5 november 2026): "52 of 120 images have no alt text; 32 images don't load lazily."
// Nagemeten op de gebouwde homepage: elke <img> heeft een alt-attribuut. De lege alt's zijn bewust (videoposters in een
// role="img" met aria-label, portretten naast de naam in dezelfde link, decoratieve dubbels), dat is de WCAG-regel (H2/H67).
// Wat wél ontbrak: beelden ver onder de vouw die meteen laden. Alleen wat in het eerste scherm staat mag eager zijn.
// Leest dist/, dus eerst npm run build.
import { existsSync, readFileSync } from "node:fs";

const PAGINAS = ["dist/index.html", "dist/nl/index.html", "dist/de/index.html"];
if (!PAGINAS.every(existsSync)) { console.error("Geen dist/: draai eerst npm run build."); process.exit(1); }
// In het eerste scherm: logo, de vier partnerlogo's in de hero, de teamfoto (fetchpriority high) en het Connect-logo met overlay.
const MAX_EAGER = 8;
const eisen = [];
for (const p of PAGINAS) {
  const html = readFileSync(p, "utf8");
  const root = html.slice(html.indexOf('<div id="root"'));
  const imgs = root.match(/<img\b[^>]*>/g) || [];
  const zonderAlt = imgs.filter((i) => !/\salt(?=[\s=>/])/.test(i));
  const eager = imgs.filter((i) => !/loading="lazy"/.test(i));
  const leegZonderReden = [...root.matchAll(/<img\b[^>]*\salt(?:="")?(?=[\s>/])[^>]*>/g)].filter((m) => {
    // Lege alt is goed als het beeld verborgen is of als de omliggende 400 tekens een naam/label geven.
    const i = m[0];
    if (/aria-hidden="true"/.test(i)) return false;
    // Ouder (of buur-img in dezelfde ouder) verborgen: <span aria-hidden="true"><img alt><img alt></span>.
    if (/<[a-z]+\b[^>]*aria-hidden="true"[^>]*>(?:<img\b[^>]*>)*$/.test(root.slice(Math.max(0, m.index - 600), m.index))) return false;
    const rond = root.slice(Math.max(0, m.index - 400), m.index + i.length + 400);
    return !/aria-label="[^"]+"|<strong[^>]*>[^<]+<\/strong>|role="img"/.test(rond);
  });
  eisen.push([`${p}: ${imgs.length} beelden, ${zonderAlt.length} zonder alt-attribuut`, imgs.length > 50 && zonderAlt.length === 0]);
  eisen.push([`${p}: ${leegZonderReden.length} lege alt's zonder label of naam ernaast${leegZonderReden.length ? ` (${leegZonderReden[0][0].slice(0, 90)})` : ""}`, leegZonderReden.length === 0]);
  eisen.push([`${p}: ${eager.length} beelden laden meteen (max ${MAX_EAGER}, alleen het eerste scherm)`, eager.length <= MAX_EAGER]);
}
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} van ${eisen.length} rood` : `alles groen (${eisen.length} eisen)`);
process.exit(fout ? 1 : 0);
