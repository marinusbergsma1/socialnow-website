#!/usr/bin/env node
// Proef: startbeeld van de OS-film, 22 oktober 2026 (Marinus, na PR #155).
// "Crafture iets groter dan de rest van de logo's, en geen streepje tussen Supperclub en Crafture."
// "Product Partners of Software Partners is hier sterk en dan de logobalk van hun. Zoals op het einde van de video."
// Dus boven niet meer twee paren (OS x Indexworld, Connect x Uncanny) maar het kopje Software Partners en één balk zoals het
// slotbeeld van de film, en daarna "Bij die Partnerbalk hoeft SocialNow verder niet": ~/attesso x Komen Consultancy x Uncanny x Indexworld.
// Gebruik: node scripts/proef-software-partners.mjs
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const speler = fs.readFileSync("proposal/ExplainerPlayer.tsx", "utf8");
const css = fs.readFileSync("proposal/explainer-player.css", "utf8");
const start = speler.slice(speler.indexOf("function Startbeeld"), speler.indexOf("export default function ExplainerPlayer"));

eis(!start.includes("sn-startbeeld-paren") && !start.includes("socialnow-connect.webp"), "geen twee paren meer boven in het startbeeld");
eis(/<span className="sn-startbeeld-kop"[^>]*>Software Partners<\/span>/.test(start), "kopje Software Partners");
const balk = start.slice(start.indexOf("sn-startbeeld-partnerbalk"), start.indexOf("sn-startbeeld-midden"));
eis(balk.length > 0 && !/socialnow/i.test(balk), "geen SocialNow-logo in de partnerbalk");
const volgorde = ["~/attesso", "komen-operation-systems.webp", "uncanny-op-zwart.svg", "indexworld.png"].map(s => start.indexOf(s));
eis(volgorde.every((i, n) => i > 0 && (n === 0 || i > volgorde[n - 1])), "balk zoals het slotbeeld: ~/attesso, Komen Consultancy, Uncanny, Indexworld");
eis((start.match(/<X className="sn-startbeeld-x"/g) || []).length === 3, "drie keer een x tussen de vier partners");
eis(/\.sn-startbeeld-groep\+\.sn-startbeeld-route\{[^}]*border-left:0/.test(css), "geen streep tussen Supperclub en Crafture");
const maten = [...speler.matchAll(/naam: "([^"]+)"[^}]*maat: ([\d.]+)/g)].map(m => [m[1], Number(m[2])]);
const craf = maten.find(m => m[0] === "Crafture")?.[1] ?? 0, rest = Math.max(...maten.filter(m => m[0] !== "Crafture").map(m => m[1]));
eis(craf > rest * 1.2, `Crafture groter dan de rest (maat ${craf} tegen hoogstens ${rest})`);
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
