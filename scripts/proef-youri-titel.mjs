// Proef functietitel Youri (28 oktober 2026). Rood op main 18a2244, groen op fix/youri-titel-20261028.
// Marinus: "Youri is Client Relations Manager. Zet dat in de teamvoet en op de site-teampagina."
// Met een URL als argument kijkt hij ook op de live teampagina.
import { readFileSync } from "node:fs";
const content = readFileSync("proposal/content.ts", "utf8");
const regel = content.split("\n").find(r => r.includes('name: "Youri van der Donk"')) || "";
const talen = ["da", "de", "en", "es", "fr", "it", "pl", "pt", "sv"];
const eisen = [
  ["Youri is Client Relations Manager", regel.includes('role: "Client Relations Manager"')],
  ["Youri is geen Senior Sales meer", !regel.includes("Senior Sales")],
  ["titel staat in alle 9 vertalingen", talen.every(t => JSON.parse(readFileSync(`proposal/i18n/${t}.json`, "utf8"))["Client Relations Manager"] === "Client Relations Manager")],
];
const url = process.argv[2];
if (url) {
  const html = await (await fetch(url, { headers: { "cache-control": "no-cache" } })).text();
  eisen.push(["live teampagina noemt Client Relations Manager", html.includes("Client Relations Manager")]);
}
let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
