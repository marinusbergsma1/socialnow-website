#!/usr/bin/env node
// Proef (Marinus 20 okt 2026): "Dit mag iets korter en misschien naast elkaar + bij samen bouwen Attesso met de gehele economie
// erbij in de talking to balk zoals eerder ook was ingezet."
// Gebruik: node scripts/check-korter-attesso.mjs [--dist] [url]   (url: ook in de browser op 390 px meten, PLAYWRIGHT_CORE nodig)
// Rood op main vóór de wijziging, groen erna.
import fs from "node:fs";
import { createRequire } from "node:module";
const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const src = fs.readFileSync("proposal/SamenEnVeilig.tsx", "utf8"), css = fs.readFileSync("proposal/samen-en-veilig.css", "utf8");
const veld = naam => (src.match(new RegExp(`\\b${naam}: "([^"]*)"`)) || [])[1] || "";
const vormen = [...src.matchAll(/\{ kop: "(Teamtrainingen|AI-workshops|Cursussen)", tekst: "([^"]*)" \}/g)].map(m => m[2]);
eis(veld("uspUitleg").length <= 90, `uitleg onder de kop korter (${veld("uspUitleg").length} tekens, max 90)`);
eis(veld("tUitleg").length <= 140, `trainingstekst korter (${veld("tUitleg").length} tekens, max 140)`);
eis(vormen.length === 3 && vormen.every(t => t.length <= 45), `drie trainingsvormen met korte tekst (${vormen.map(t => t.length).join(", ")})`);
eis(/@media\(max-width:700px\)\{[^@]*\.sn-samen-po,[^{]*\.sn-samen-vormen\{display:flex;[^}]*overflow-x:auto;scroll-snap-type:x mandatory/.test(css), "op de telefoon probleem/oplossing en trainingsvormen naast elkaar in een schuifrij");
eis(src.includes('naam: "Attesso", href: "https://www.attesso.com/"') && src.includes("~/attesso"), "Attesso staat bij Samen bouwen, met het woordmerk ~/attesso");
const praat = ["visa.svg", "mastercard.svg", "airwallex.webp", "adyen.svg", "rabobank.svg"];
eis(praat.every(l => src.includes(`/images/partners/betalen/${l}`) && fs.existsSync(`public/images/partners/betalen/${l}`)), "Talking to-balk met Visa, Mastercard, Airwallex, Adyen en Rabobank");
eis(src.includes('<span translate="no">Talking to</span>') && /\.sn-samen-praat\{[^}]*background:#fff;border-top:2px solid var\(--s-groen\);border-bottom:2px solid var\(--s-groen\)/.test(css), "balk is wit met een groene lijn boven en onder, zoals op 5 oktober");
eis(/animation:sn-samen-loop/.test(css) && /prefers-reduced-motion:reduce\)\{\.sn-samen-lus\{animation:none\}/.test(css) && /\.sn-samen-praat:hover \.sn-samen-lus/.test(css), "logo's lopen door, stil bij hover en bij minder beweging");
// 20 oktober 2026, explainer v8 (02-webtekst §2): "drie bedrijven" klopt niet meer; vier partners, elk met een eigen rol, Attesso daarbij.
eis(src.includes('\n  kop: "SocialNow en vier partners, elk met een eigen rol.",') && /wie: "Attesso"/.test(src), "kop en rollen noemen de partners, met Attesso");
if (process.argv.includes("--dist")) {
  for (const f of ["dist/nl/index.html", "dist/index.html"]) {
    const h = fs.readFileSync(f, "utf8");
    eis(h.includes("Talking to") && h.includes("~/attesso") && h.includes("/images/partners/betalen/rabobank.svg"), `${f}: Attesso met Talking to-balk`);
  }
  const en = fs.readFileSync("dist/index.html", "utf8").replace(/<span class="sn-title-dot">\.<\/span>/g, ".");
  // 20 oktober 2026, explainer v8 (02-webtekst §2): nieuwe kop en Attesso-kop.
  eis(en.includes("SocialNow and four partners, each with its own role.") && en.includes("Ad spend within your budget."), "dist/index.html: Engelse koppen vertaald");
}
const url = process.argv.slice(2).find(a => a.startsWith("http"));
if (url) {
  const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_CORE || "playwright-core");
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(url, { waitUntil: "load" }); await p.locator(".sn-samen").scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  const m = await p.evaluate(() => {
    const naast = sel => { const k = [...document.querySelectorAll(sel)]; return k.length >= 2 && Math.abs(k[0].getBoundingClientRect().top - k[1].getBoundingClientRect().top) < 2; };
    const lus = document.querySelector(".sn-samen-lus"); const t1 = lus && getComputedStyle(lus).transform;
    return { po: naast(".sn-samen-po p"), vormen: naast(".sn-samen-vormen li"), lus: !!lus, t1, scrollX: document.documentElement.scrollWidth > innerWidth };
  });
  await p.waitForTimeout(1200);
  const t2 = await p.evaluate(() => { const l = document.querySelector(".sn-samen-lus"); return l ? getComputedStyle(l).transform : null; });
  eis(m.po && m.vormen, `390px: probleem/oplossing (${m.po}) en trainingsvormen (${m.vormen}) naast elkaar`);
  eis(m.lus && m.t1 !== t2, "390px: de Talking to-balk beweegt");
  eis(!m.scrollX, "390px: geen horizontaal scrollen van de pagina");
  await b.close();
}
console.log(fouten.length ? `\n${fouten.length} eis(en) rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
