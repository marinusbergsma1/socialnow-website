// Proef familietegel in het verhaal (3 oktober 2026). Rood op main f3e5a43, groen op feat/doel-familie-20261003.
// Marinus: "zowel op mijn website als mijn video dat ik uit een creatieve familie van ondernemers kom. Mijn moeder
// lerares en therapeut. Mijn vader kunstenaar dus vanaf kind meegekregen dat je kon worden wat je wilde, zolang je er maar
// keihard voor werkt." En: "Mijn vader heeft mijn hele jeugd ochtend en avond gewerkt." De Instagram-film "My biggest fan"
// hoort bij dat persoonlijke stuk.
// Draai: node scripts/proef-familie.mjs   (exit 0 = groen).
import { readFileSync, existsSync, statSync } from "node:fs";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const bron = lees("proposal/Verhaal.tsx");
const woordenboeken = ["en", "de", "fr"].map((taal) => [taal, JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}")]);

const zinnen = [
  "Waar ik vandaan kom",
  "Uit een creatieve familie van ondernemers.",
  "Mijn moeder is lerares en therapeut, mijn vader kunstenaar. Hij werkte mijn hele jeugd van 's ochtends tot 's avonds. Zo leerde ik als kind: je kunt worden wat je wilt, zolang je er maar keihard voor werkt.",
];
const film = "public/video/familie/biggest-fan.mp4";
const poster = "public/video/familie/biggest-fan-poster.webp";

const eisen = [
  ["verhaal heeft een tegel 'Waar ik vandaan kom' met moeder lerares en therapeut, vader kunstenaar",
    zinnen.every((z) => bron.includes(z))],
  ["vader werkte de hele jeugd ochtend en avond, en 'keihard werken' staat erin",
    /hele jeugd van 's ochtends tot 's avonds/.test(bron) && /keihard voor werkt/.test(bron)],
  ["filmtegel 'My biggest fan' speelt de familiefilm met poster",
    bron.includes('kop="My biggest fan"') && bron.includes("/video/familie/biggest-fan.mp4") && bron.includes("/video/familie/biggest-fan-poster.webp")],
  ["film en poster staan in public en de film is licht (onder 4 MB)",
    existsSync(film) && existsSync(poster) && statSync(film).size < 4 * 1024 * 1024],
  ["alle nieuwe zinnen staan in en, de en fr",
    woordenboeken.every(([, w]) => zinnen.every((z) => typeof w[z] === "string" && w[z].length > 0))],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
