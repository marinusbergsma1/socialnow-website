// Proef 1 oktober 2026: statement en gezichtenmuur in de hero mooi uitgelijnd, en Michelle met een nieuwe, uitgezoomde foto.
// Marinus: "Die tekst moet mooi met die afbeeldingen uitgelijnd zijn. Van Michelle zou een nieuwe image2.5 afbeelding
// gemaakt worden omdat het gezicht zo groot lijkt."
// Gebruik: node scripts/proef-team-uitlijning.mjs [--url http://127.0.0.1:8831/]
// Met --url meet hij ook in een echte browser (Chrome via CHROME of de Playwright-cache) op 1280, 1440 en 1920 px:
// de eerste regel moet op de bovenkant van de portretten staan en de laatste op de onderkant (1 px marge).
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const lees = (p) => readFileSync(p, "utf8");
const pages = lees("proposal/pages.tsx"), css = lees("proposal/hero-c.css");
const rij = pages.includes('className="h-team-rij"') ? pages.slice(pages.indexOf('className="h-team-rij"'), pages.indexOf("<HeroSprekers />")) : "";
const film = pages.slice(pages.indexOf("<HeroFilm geluid"), pages.indexOf("</HeroFilm>"));
const bronnen = ["proposal/content.ts", "components/Team.tsx", "components/TeamPage.tsx", "proposal/Deuren.tsx", "proposal/PartnerMichelle.tsx"];
const MICHELLE = "Michelle-Yang-2026-10-01";

const eisen = [
  ["statement en muur in één rij", rij.includes('className="h-statement is-r1"') && rij.includes("<TeamJoin />")],
  ["muur niet meer los onder de film", !film.includes("<TeamJoin />")],
  ["rij op de kolomlijnen van de hero (subgrid)", /\.h-team-rij \{[^}]*grid-template-columns: subgrid/.test(css)],
  ["statement rekt mee met de muur, regels op boven- en onderkant", /\.h-team-rij > \.h-statement\.is-r1 \{[^}]*justify-content: space-between/.test(css) && /text-box: trim-both cap alphabetic/.test(css)],
  ["Michelle nergens meer met de strakke HD-foto", bronnen.every((p) => !lees(p).includes("Michelle-Yang-HD.webp"))],
  ["Michelle overal met de nieuwe foto", bronnen.every((p) => lees(p).includes(`${MICHELLE}.webp`))],
  ["nieuwe foto met kleine versies voor de muur", existsSync(`public/images/${MICHELLE}.webp`) && [96, 160, 320].every((m) => existsSync(`public/images/klein/${MICHELLE}-${m}.webp`))],
];

const urlIndex = process.argv.indexOf("--url");
const url = urlIndex > -1 ? process.argv[urlIndex + 1] : "";
const chrome = process.env.CHROME || `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
if (url && existsSync(chrome)) {
  const poort = 9700 + Math.floor(Math.random() * 200);
  const proc = spawn(chrome, [`--remote-debugging-port=${poort}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "proef-"))}`, "about:blank"], { stdio: "ignore" });
  const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
  let doelen;
  for (let i = 0; i < 50 && !doelen; i++) { await wacht(200); try { doelen = await (await fetch(`http://127.0.0.1:${poort}/json`)).json(); } catch {} }
  const ws = new WebSocket(doelen.find((d) => d.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0; const open = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (open.has(m.id)) { open.get(m.id)(m); open.delete(m.id); } });
  const zend = (method, params = {}) => new Promise((r) => { const n = ++id; open.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  for (const breed of [1280, 1440, 1920]) {
    await zend("Emulation.setDeviceMetricsOverride", { width: breed, height: 900, deviceScaleFactor: 1, mobile: false });
    await zend("Page.navigate", { url });
    await wacht(5000);
    const m = (await zend("Runtime.evaluate", { returnByValue: true, expression: `(() => {
      const zin = [...document.querySelectorAll(".h-statement.is-r1 .h-sr")], muur = document.querySelector(".h-team-muur");
      if (!zin.length || !muur) return null;
      const r = (e) => e.getBoundingClientRect();
      return { boven: r(zin[0]).top - r(muur).top, onder: r(zin.at(-1)).bottom - r(muur).bottom };
    })()` })).result.result.value;
    const tekst = m ? `boven ${m.boven.toFixed(1)} px, onder ${m.onder.toFixed(1)} px` : "niet gevonden";
    eisen.push([`${breed} px: eerste regel op de bovenkant en laatste op de onderkant van de portretten (${tekst})`, Boolean(m) && Math.abs(m.boven) <= 1 && Math.abs(m.onder) <= 1]);
  }
  ws.close(); proc.kill();
} else if (url) {
  console.log(`meting overgeslagen: geen Chrome op ${chrome}`);
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
