// Proef Light Art Collection ronde 2 (30 september 2026). Rood op main a4a084c, groen op feat/light-art-drie-20260930.
// Marinus: "Ik wil graag even de befores meer before en de afters realistischer after en 3 is genoeg. Maak dus 3 befores
// en 3 afters met image2.5 en zorg dat de kunstwerken zichtbaar zijn".
// Draai: node scripts/proef-light-art-drie.mjs   (exit 0 = groen). Helderheid meet python3 met Pillow.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
const lees = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");
const bron = lees("proposal/LightArtStrook.tsx");
const css = lees("proposal/bereikt.css");

// Breedte en hoogte uit de WebP-kop (VP8, VP8L en VP8X), zonder extra pakketten.
function webpMaat(pad) {
  if (!existsSync(pad)) return null;
  const b = readFileSync(pad);
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;
  const soort = b.toString("ascii", 12, 16);
  if (soort === "VP8 ") return { breed: b.readUInt16LE(26) & 0x3fff, hoog: b.readUInt16LE(28) & 0x3fff };
  if (soort === "VP8L") { const n = b.readUInt32LE(21); return { breed: (n & 0x3fff) + 1, hoog: ((n >> 14) & 0x3fff) + 1 }; }
  if (soort === "VP8X") return { breed: 1 + b.readUIntLE(24, 3), hoog: 1 + b.readUIntLE(27, 3) };
  return null;
}
const is1610 = (m) => Boolean(m) && m.breed * 10 === m.hoog * 16;

// Gemiddelde helderheid (0 tot 255) van een beeld.
function helderheid(pad) {
  try {
    const uit = execFileSync("python3", ["-c", "import sys;from PIL import Image,ImageStat;print(ImageStat.Stat(Image.open(sys.argv[1]).convert('L')).mean[0])", pad], { stdio: ["ignore", "pipe", "ignore"] });
    return Number(String(uit).trim());
  } catch { return NaN; }
}

const impressies = [...bron.matchAll(/\{ titel: "([^"]+)", voor: "([^"]+)", na: "([^"]+)", breed: (\d+), hoog: (\d+) \}/g)]
  .map(([, titel, voor, na, breed, hoog]) => ({ titel, voor, na, breed: Number(breed), hoog: Number(hoog) }));
// De strook laadt per beeld images/light-art/licht/<naam>-800.webp en -1400.webp (zie bronnen() in LightArtStrook.tsx).
const licht = (pad, maat) => `public/images/light-art/licht/${pad.split("/").pop().replace(/\.webp$/, "")}-${maat}.webp`;

const eisen = [
  ["precies drie impressies: Eternal Sundown, Infinita, Butterfly Effect",
    impressies.map((i) => i.titel).join("|") === "Eternal Sundown|Infinita|Butterfly Effect"],
  ["elk voor- en na-beeld is een nieuw paar in public/images/light-art",
    impressies.length > 0 && impressies.every((i) => /\/images\/light-art\/[a-z-]+-voor\.webp$/.test(i.voor) && i.na === i.voor.replace(/-voor\.webp$/, "-na.webp") && existsSync(`public${i.voor}`) && existsSync(`public${i.na}`))],
  ["alles wat de strook laadt (800 en 1400) is 16:10, de maat van de kaart, zodat het kunstwerk niet wegvalt",
    impressies.length > 0 && impressies.every((i) => [i.voor, i.na].every((p) => is1610(webpMaat(licht(p, 800))) && is1610(webpMaat(licht(p, 1400))) && is1610(webpMaat(`public${p}`))) && i.breed * 10 === i.hoog * 16)],
  // Daglicht meet hier boven 90 van 255, een nachtfoto onder 70; de oude voor-beelden van Infinita en Butterfly Effect waren nacht.
  ["voor is overdag (helderheid boven 90) en na is nacht (onder 70)",
    impressies.length > 0 && impressies.every((i) => helderheid(licht(i.voor, 800)) > 90 && helderheid(licht(i.na, 800)) < 70)],
  ["pc: drie kaarten naast elkaar in 16:10, niets bijgesneden",
    /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/.test(css) && /\.h-lac-beeld\s*\{[^}]*aspect-ratio:\s*16 \/ 10;\s*\}\s*\}/.test(css)],
  ["oude voor-beelden van pier en overzicht en de lichte kopieën van de oude impressies zijn weg",
    ["public/images/light-art/pier-voor.webp", "public/images/light-art/light-art-collection-voor.webp", "public/images/light-art/licht/Infinita-Light-Art-Collection-800.webp", "public/images/light-art/licht/Eternal-Sundown-Afbeelding-After-800.webp"].every((p) => !existsSync(p))],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
