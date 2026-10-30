// Proef socials in de footer zonder kleur (30 oktober 2026). Rood op main 33fb469, groen op fix/socials-wit-20261030.
// Marinus, schermafdruk van het roze Instagram- en blauwe LinkedIn-icoon: "DEZE HOEFT NIET IN KLEUR OP MIJN SITE".
// Elke kleur in een regel voor .h-footer-socials moet wit of grijs zijn (rood = groen = blauw).
import { readdirSync, readFileSync } from "node:fs";

const bestanden = readdirSync("proposal").filter((f) => f.endsWith(".css")).map((f) => `proposal/${f}`);
const regels = [];
for (const pad of bestanden) {
  const css = readFileSync(pad, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selector.includes("h-footer-socials")) regels.push({ pad, selector: selector.trim(), body });
  }
}

const isGrijs = (waarde) => {
  const hex = waarde.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return h.slice(0, 2) === h.slice(2, 4) && h.slice(2, 4) === h.slice(4, 6);
  }
  const rgb = waarde.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return rgb[1] === rgb[2] && rgb[2] === rgb[3];
  return ["inherit", "currentcolor", "transparent", "white", "#fff"].includes(waarde.toLowerCase());
};

const eisen = [["er zijn regels voor .h-footer-socials", regels.length > 0]];
for (const { pad, selector, body } of regels) {
  const kleuren = [...body.matchAll(/#[0-9a-f]{3,6}\b|rgba?\([^)]*\)/gi)].map((m) => m[0]);
  const kleurWaarden = [...body.matchAll(/(?:^|;)\s*color:\s*([^;!]+)/gi)].map((m) => m[1].trim());
  const fout = [...kleuren, ...kleurWaarden].filter((k) => !isGrijs(k));
  eisen.push([`${pad}: ${selector} zonder merkkleur${fout.length ? ` (nu ${fout.join(", ")})` : ""}`, fout.length === 0]);
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
