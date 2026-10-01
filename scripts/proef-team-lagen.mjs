// Proef 1 oktober 2026: /team begint met twee sterke teams, Michelle met een kantoorfoto, Douwe erbij met een nieuwe foto.
// Marinus: "Ik wil graag Michelle iets groter en normale achtergrond + Daarbij de eerste Laag Mij en Steef met daarnaast
// Arttesso, Sid en Douwe." "Nieuwe foto van Douwe ook graag." "Het punt Moet zijn Dat Sid en Ik Spreken en de sterke teams
// Ik en Steef samen met Sid en Douwe samen zijn."
// Gebruik: node scripts/proef-team-lagen.mjs [--url http://127.0.0.1:8831/]
// Met --url meet hij ook /nl/team in een echte browser (Chrome via CHROME of de Playwright-cache) op 1440 px.
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const lees = (p) => readFileSync(p, "utf8");
const paginas = lees("proposal/paginas.tsx"), content = lees("proposal/content.ts"), css = lees("proposal/experience.css");
const team = paginas.slice(paginas.indexOf("export function TeamPage"), paginas.indexOf("export function BlogPage"));
const MICHELLE = "Michelle-Yang-kantoor", DOUWE = "Douwe-Kramer-attesso";
const klein = (n) => existsSync(`public/images/${n}.webp`) && [96, 160, 320].every((m) => existsSync(`public/images/klein/${n}-${m}.webp`));
const NOOT = "Marinus en Sid spreken samen";
const woordenboeken = ["en", "de", "fr"].map((t) => JSON.parse(lees(`proposal/i18n/${t}.json`)));
const zinnen = ["Twee sterke teams.", "Samen bouwen we het.", "Marinus en Steef bouwen het OS en maken het schaalbaar. Sid en Douwe van Attesso zorgen dat elke betaling veilig en goedgekeurd is. Marinus en Sid spreken samen: live demo's, talks en workshops, overal ter wereld."];

const eisen = [
  ["/team begint met de twee sterke teams, vóór het oprichtersblok", team.includes("h-sterke-teams") && team.indexOf("h-sterke-teams") < team.indexOf("<Founder />")],
  ["SocialNow-team: Marinus en Steef", team.includes('vind(["Marinus Bergsma", "Steef Komen"])') && team.includes("is-socialnow")],
  ["Attesso-team: Sid en Douwe", team.includes('vind(["Sid van Kalken", "Douwe Kramer"])') && team.includes("is-attesso")],
  ["Marinus en Sid als sprekers genoemd", team.includes(NOOT)],
  ["oude duo Michelle en Steef weg", !team.includes("Michelle en Steef.")],
  ["Michelle vooraan bij de system experts", /const specialists = \[\s*\.\.\.vind\(\["Michelle Yang"\]\)/.test(team)],
  ["Douwe in het team met zijn Attesso-rol en nieuwe foto", content.includes('name: "Douwe Kramer"') && content.includes(`image: "${DOUWE}.webp"`) && klein(DOUWE)],
  ["Michelle met de kantoorfoto (en kleine versies)", content.includes(`image: "${MICHELLE}.webp"`) && klein(MICHELLE)],
  ["duo's naast elkaar, groen en roze", /\.h-teams-duo \{[^}]*grid-template-columns: repeat\(2/.test(css) && /\.h-team-duo\.is-attesso \{[^}]*#d4a0b5/.test(css)],
  ["nieuwe zinnen in het Engels, Duits en Frans", woordenboeken.every((w) => zinnen.every((z) => typeof w[z] === "string" && w[z].length > 0))],
];

const urlIndex = process.argv.indexOf("--url");
const basis = urlIndex > -1 ? process.argv[urlIndex + 1].replace(/\/$/, "") : "";
const chrome = process.env.CHROME || `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
if (basis && existsSync(chrome)) {
  const poort = 9500 + Math.floor(Math.random() * 200);
  const proc = spawn(chrome, [`--remote-debugging-port=${poort}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "proef-"))}`, "about:blank"], { stdio: "ignore" });
  const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
  let doelen;
  for (let i = 0; i < 50 && !doelen; i++) { await wacht(200); try { doelen = await (await fetch(`http://127.0.0.1:${poort}/json`)).json(); } catch {} }
  const ws = new WebSocket(doelen.find((d) => d.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0; const open = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (open.has(m.id)) { open.get(m.id)(m); open.delete(m.id); } });
  const zend = (method, params = {}) => new Promise((r) => { const n = ++id; open.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  await zend("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await zend("Page.navigate", { url: `${basis}/nl/team` });
  await wacht(6000);
  const m = (await zend("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: `(async () => {
    const sectie = document.querySelector(".h-sterke-teams");
    const namen = (el) => el ? [...el.querySelectorAll("figure strong")].map((s) => s.textContent.trim()) : [];
    const duos = [...document.querySelectorAll(".h-team-duo")];
    for (const img of document.querySelectorAll(".h-sterke-teams img, .h-people-grid img")) { img.loading = "eager"; img.scrollIntoView(); }
    await new Promise((r) => setTimeout(r, 2500));
    const geladen = sectie ? [...sectie.querySelectorAll("img")].every((i) => i.complete && i.naturalWidth > 0) : false;
    const grids = [...document.querySelectorAll(".h-people-grid")].filter((g) => !g.closest(".h-sterke-teams"));
    const expert = grids.at(-1)?.querySelector("figure");
    const michelle = expert?.querySelector("img");
    return {
      teams: namen(sectie),
      duoNamen: duos.map((d) => namen(d)),
      naastElkaar: duos.length === 2 && Math.abs(duos[0].getBoundingClientRect().top - duos[1].getBoundingClientRect().top) < 1 && duos[0].getBoundingClientRect().right < duos[1].getBoundingClientRect().left,
      labelsGelijk: duos.length === 2 && Math.abs(duos[0].querySelector(".h-team-duo-label").getBoundingClientRect().bottom - duos[1].querySelector(".h-team-duo-label").getBoundingClientRect().bottom) < 1,
      geladen,
      sectieVoorOprichter: Boolean(sectie && document.querySelector(".h-founder")) && (sectie.compareDocumentPosition(document.querySelector(".h-founder")) & Node.DOCUMENT_POSITION_FOLLOWING) > 0,
      eersteExpert: expert?.querySelector("strong")?.textContent.trim() ?? "",
      michelleFoto: michelle ? michelle.currentSrc.split("/").pop() + (michelle.naturalWidth > 0 ? "" : " (niet geladen)") : "",
      sprekers: (sectie?.textContent ?? "").includes("${NOOT}"),
    };
  })()` })).result.result.value;
  const v = JSON.stringify;
  eisen.push(
    [`browser: eerste laag Marinus, Steef, Sid, Douwe (${v(m.teams)})`, v(m.teams) === v(["Marinus Bergsma", "Steef Komen", "Sid van Kalken", "Douwe Kramer"])],
    [`browser: twee duo's naast elkaar, labels op één lijn (${v(m.duoNamen)})`, m.naastElkaar && m.labelsGelijk && v(m.duoNamen) === v([["Marinus Bergsma", "Steef Komen"], ["Sid van Kalken", "Douwe Kramer"]])],
    ["browser: alle vier portretten geladen", m.geladen],
    ["browser: sterke teams staan boven het oprichtersblok", m.sectieVoorOprichter],
    ["browser: sprekers Marinus en Sid in beeld", m.sprekers],
    [`browser: Michelle eerste system expert met kantoorfoto (${m.eersteExpert}, ${m.michelleFoto})`, m.eersteExpert === "Michelle Yang" && m.michelleFoto.startsWith(MICHELLE) && !m.michelleFoto.includes("niet geladen")],
  );
  ws.close(); proc.kill();
} else if (basis) {
  console.log(`meting overgeslagen: geen Chrome op ${chrome}`);
}

let fout = 0;
for (const [naam, ok] of eisen) { console.log(`${ok ? "groen" : "ROOD "} ${naam}`); if (!ok) fout++; }
console.log(fout ? `${fout} rood` : "alles groen");
process.exit(fout ? 1 : 0);
