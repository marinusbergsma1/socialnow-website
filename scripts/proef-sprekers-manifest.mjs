// Proef 30 september 2026: Sid met iets meer contrast in het gezicht en de "born to inspire"-tekst in het sprekersblok.
// Rood op main 553a45d, groen op fix/sprekers-manifest-20260930.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const lees = (p) => readFileSync(p, "utf8");
const pages = lees("proposal/pages.tsx"), css = lees("proposal/hero-c.css");
const hash = (p) => createHash("sha1").update(readFileSync(p)).digest("hex");
const oudeSid = "da45016b12fb1343eada86b1d747bc8adaa08b82"; // sid-attesso.webp op main 553a45d
const blok = pages.slice(pages.indexOf("function HeroSprekers()"), pages.indexOf("function HeroVeilig("));
const eisen = [
  ["Sid heeft een bijgewerkte foto (meer contrast), ook de kleine versies", hash("public/images/sid-attesso.webp") !== oudeSid && ["480", "800"].every((m) => readFileSync(`public/images/klein/sid-attesso-${m}.webp`).length > 0)],
  ["kop WE ARE BORN TO INSPIRE! in het sprekersblok", blok.includes('<p className="is-kop">We are born to inspire!</p>') && /p\.is-kop \{[^}]*text-transform: uppercase/.test(css)],
  ["niet door big tech, maar door de mogelijkheden", blok.includes("Not by the limitations of <b>big tech</b>,<br />but by the possibilities.")],
  ["open om ons verhaal te vertellen", blok.includes("Currently open to talk with everybody about telling our story,")],
  ["human connection powered by AI technology, in groen", blok.includes("<strong>human connection powered by AI technology!</strong>") && /\.h-sprekers-manifest strong \{ color: #25d366;/.test(css)],
  ["genoeg enters: losse regels met ruimte ertussen", /\.h-sprekers-manifest \{ display: flex; flex-direction: column; gap: 14px;/.test(css) && (blok.match(/<p[ >]/g) || []).length >= 6],
  ["tekst staat tussen uitleg en knoppen", blok.indexOf("anywhere in the world.") < blok.indexOf("h-sprekers-manifest") && blok.indexOf("h-sprekers-manifest") < blok.indexOf("h-sprekers-knoppen")],
];
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
