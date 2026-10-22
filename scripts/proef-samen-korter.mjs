#!/usr/bin/env node
// Proef: blok Samen en veilig korter, 22 oktober 2026 (Marinus): "1 WEG EN 2 PAS BIJ MEER LEZEN EN DAN UITKLAPPEN".
// 1 = de kring "Zo wordt elke versie beter" en "Jij bepaalt wie wat ziet"; 2 = de lijst wie wat doet (SocialNow, Indexworld, ...).
import fs from "node:fs";
const s = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8");
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
eis(!s.includes('className="sn-samen-twee"') && !s.includes("t.cyclus.map") && !s.includes("t.toegang.map"), "kring en wie wat ziet zijn weg");
eis(/<details className="sn-samen-meer">\s*<summary><span>Lees meer<\/span>[\s\S]*?<ul className="sn-samen-rollen">[\s\S]*?<\/details>/.test(s), "wie wat doet staat achter Lees meer");
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
