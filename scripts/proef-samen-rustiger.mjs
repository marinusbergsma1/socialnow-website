#!/usr/bin/env node
// Proef (22 oktober 2026, Marinus): "Deze balk niet wit en verder is dit denk teveel informatie."
// Talking to-balk donker met leesbare logo's, en "Zo wordt elke versie beter" en "Jij bepaalt wie wat ziet" kort.
// Rood op main, groen op de tak. Gebruik: node scripts/proef-samen-rustiger.mjs
import fs from "node:fs";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const css = fs.readFileSync("proposal/samen-en-veilig.css", "utf8");
const tsx = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8");
const regel = (sel) => [...css.matchAll(new RegExp(`(?:^|\\n)${sel.replace(/[.>]/g, "\\$&")}\\{([^}]*)\\}`, "g"))].map((m) => m[1]).join(";");
eis(!/background:#fff\b/.test(regel(".sn-samen-praat")), "Talking to-balk is niet wit");
eis(/border-top:2px solid var\(--s-groen\)/.test(regel(".sn-samen-praat")), "groene lijn boven en onder blijft");
eis(!/color:#0b0f12/.test(regel(".sn-samen-praat>span")), "label Talking to is licht op donker");
eis(/img\[alt="Visa"\][^{]*img\[alt="Rabobank"\][^{]*img\[alt="Airwallex"\][^{]*\{filter:brightness\(0\) invert\(1\)\}/.test(css), "donkere woordmerken (Visa, Rabobank, Airwallex) wit op de donkere balk");
const cyclus = JSON.parse(tsx.match(/cyclus: (\[[^\]]*\])/)[1]);
eis(cyclus.length === 5 && cyclus.every((s) => s.length <= 32), `vijf korte stappen (${cyclus.map((s) => s.length).join(", ")} tekens)`);
eis((tsx.match(/cyclusRegel: "([^"]*)"/)?.[1] || "").length <= 40, "één korte zin onder de stappen");
const toegang = tsx.slice(tsx.indexOf("toegang: ["), tsx.indexOf("],", tsx.indexOf("toegang: [")));
const punten = [...toegang.matchAll(/tekst: "([^"]*)"/g)].map((m) => m[1]);
eis(punten.length <= 3 && punten.every((p) => p.length <= 80), `hooguit drie korte punten bij "Jij bepaalt wie wat ziet" (${punten.length})`);
eis(!/status: "volgt"/.test(toegang), "geen volgende-stap-punten meer in dit blok");
const talen = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const nieuw = [...cyclus, tsx.match(/cyclusRegel: "([^"]*)"/)[1], ...punten];
const mist = talen.flatMap((t) => { const w = JSON.parse(fs.readFileSync(`proposal/i18n/${t}.json`, "utf8")); return nieuw.filter((z) => !(z in w)).map((z) => `${t}: ${z}`); });
eis(mist.length === 0, `vertaald in alle negen talen${mist.length ? ` (mist ${mist.slice(0, 3).join(" | ")})` : ""}`);
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
