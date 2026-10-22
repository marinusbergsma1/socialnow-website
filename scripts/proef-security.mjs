#!/usr/bin/env node
// Proef: de securityscan op /security (22 oktober 2026, feat/security-pagina). Rood op main (a29c468), groen op de tak.
// Marinus: "de pagina heet security, dit kan wel eens een belangrijke pagina worden."
// 1. /security is de pagina in alle talen; /check, /php-check en hun taalversies sturen permanent (308) door, met
//    ?domein= en #aanvraag erbij. Titel, description, canonical, sitemap en deelbeeld horen bij /security.
// 2. In de teksten heet het "Securityscan" / "Security scan", niet meer "check".
// 3. Onder de film en boven de scan: "Wie werd geraakt" (Nintendo, Wikipedia, vier overheden met vlag en naam, nooit een
//    overheidslogo) en "Wie loopt risico" (zeven PHP-platforms), elk logo een link naar de bron, en de regel dat het geen
//    klanten of partners zijn.
// 4. In het PHP-blok bij oranje en rood de regel over de tijdelijk gratis updates boven Steef en Michelle, en bij PHP 8.1
//    en ouder de regel over de overstap. Echt gerenderd.
// 5. #aanvraag scrolt naar het formulier, ook na de doorverwijzing.
// Live (na de merge): PROEF_LIVE=1 node scripts/proef-security.mjs controleert ook de 308 op socialnow.nl.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const fouten = [];
const eis = (ok, tekst) => { console.log(`${ok ? "GROEN" : "ROOD "}  ${tekst}`); if (!ok) fouten.push(tekst); };
const lees = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const tsx = lees("proposal/PhpCheck.tsx");
const app = lees("proposal/WebsiteProposal.tsx");
const vercel = JSON.parse(lees("vercel.json") || "{}");
const post = lees("scripts/postbuild.mjs");
const en = JSON.parse(lees("proposal/i18n/en.json") || "{}");
const talen = ["de", "fr", "es", "it", "pt", "pl", "sv", "da"];
const woorden = Object.fromEntries(talen.map((t) => [t, JSON.parse(lees(`proposal/i18n/${t}.json`) || "{}")]));

// 1. Route en doorverwijzingen
eis(/<Route path="\/security" element=\{<PhpCheckPage \/>\} \/>/.test(app) && !/path="\/security" element=\{<Navigate to="\/veiligheid"/.test(app), "/security is de securityscan (niet meer een alias van /veiligheid)");
eis(/<Route path="\/check" element=\{<NaarSecurity \/>\} \/>/.test(app) && /<Route path="\/php-check" element=\{<NaarSecurity \/>\} \/>/.test(app) && /to=\{`\/security\$\{search\}\$\{hash\}`\}/.test(app), "in de app: /check en /php-check naar /security, met ?domein= en #aanvraag");
const r = vercel.redirects || [];
const door = (bron, doel) => r.some((x) => x.source === bron && x.destination === doel && x.permanent === true);
eis(door("/check", "/security") && door("/:taal(nl|de|fr|es|it|pt|pl|sv|da)/check", "/:taal/security") && door("/php-check", "/security") && door("/:taal(nl|de|fr|es|it|pt|pl|sv|da)/php-check", "/:taal/security"), "vercel.json: /check, /nl/check (alle talen) en /php-check permanent (308) naar /security");
const meta = (post.match(/\n  security: \{title: '([^']+)', description: '([^']+)', image: '([^']+)', imageAlt: '([^']+)'\}/) || []);
eis(!!meta[1] && !/\n  check: \{title:/.test(post) && /\n  security: 'Gratis securityscan',/.test(post), "postbuild: /security met eigen titel, description en kruimel; /check heeft geen eigen pagina meer");
eis(!!meta[1] && meta[1].length <= 70 && meta[2].length >= 110 && meta[2].length <= 160 && /securityscan/i.test(meta[1]) && /php2shell/.test(meta[1] + meta[2]), `titel (${meta[1]?.length || 0} tekens) en description (${meta[2]?.length || 0} tekens) passen in Google`);
eis(!!meta[1] && !!en[meta[1]] && !!en[meta[2]] && !!en[meta[4]] && /security scan/i.test(en[meta[1]]) && talen.every((t) => woorden[t][meta[1]] && woorden[t][meta[2]]), "titel en description vertaald (EN \"security scan\" en acht andere talen)");
const jpg = fs.existsSync("public/images/og-security.jpg") ? fs.readFileSync("public/images/og-security.jpg") : Buffer.alloc(0);
const sof = jpg.indexOf(Buffer.from([0xff, 0xc0])) >= 0 ? jpg.indexOf(Buffer.from([0xff, 0xc0])) : jpg.indexOf(Buffer.from([0xff, 0xc2]));
const [hoog, breed] = sof > 0 ? [jpg.readUInt16BE(sof + 5), jpg.readUInt16BE(sof + 7)] : [0, 0];
eis(meta[3] === "https://socialnow.nl/images/og-security.jpg" && breed === 1200 && hoog === 630 && /if \(meta\.image\) out = out/.test(post) && /og:image:alt/.test(lees("scripts/localize-build.mjs")), `eigen deelbeeld 1200x630 (${breed}x${hoog}) voor og:image en twitter:image, alt-tekst vertaald`);
eis(/socialnow\.nl\/security/.test(lees("server/check-aanvraag.mjs")) && !/socialnow\.nl\/check/.test(lees("server/check-aanvraag.mjs")), "aanvraagmail noemt socialnow.nl/security");

// 2. Teksten
const jsx = tsx.slice(tsx.indexOf('<div className="pc">'));
eis(/Gratis securityscan<\/p>/.test(jsx) && /"Doe de gratis securityscan"/.test(jsx) && !/php2shell-check|gratis check|de check/i.test(jsx) && en["Gratis securityscan"] === "Free security scan" && en["Doe de gratis securityscan"] === "Run the free security scan", "de pagina heet Securityscan / Security scan, nergens meer \"check\"");

// 3. Wie werd geraakt, wie loopt risico
const iFilm = jsx.indexOf("<Film />"), iGeraakt = jsx.indexOf("<Geraakt />"), iRisico = jsx.indexOf("<Risico />"), iScan = jsx.indexOf('<form className="pc-check"');
eis(iFilm >= 0 && iGeraakt > iFilm && iRisico > iGeraakt && iScan > iRisico, "volgorde: film, Wie werd geraakt, Wie loopt risico, dan de scan");
const lijst = (naam) => { const m = tsx.match(new RegExp(`const ${naam}[^=]*= \\[([\\s\\S]*?)\\n\\];`)); return m ? [...m[1].matchAll(/\{ ([^\n]*?) \},?(?:\n|$)/g)].map((x) => x[1]) : []; };
const geraakt = lijst("GERAAKT"), risico = lijst("RISICO");
const veld = (regel, k) => (regel.match(new RegExp(`${k}: "([^"]*)"`)) || [])[1] || "";
const bedrijven = geraakt.filter((g) => veld(g, "logo")), overheden = geraakt.filter((g) => veld(g, "vlag"));
eis(bedrijven.map((g) => veld(g, "naam")).join() === "Nintendo,Wikipedia" && bedrijven.every((g) => fs.existsSync(`public${veld(g, "logo")}`)), "geraakt: Nintendo en Wikipedia met hun logo uit public/");
eis(overheden.map((g) => `${veld(g, "vlag")}:${veld(g, "org")}`).sort().join() === "be:Buitenlandse Zaken,de:ITZBund,fi:Valtori,nl:Overheid.nl" && en["Buitenlandse Zaken"] === "Foreign Affairs" && !geraakt.some((g) => /bank|revolut/i.test(g)), "geraakt: vier overheden met vlag en de naam uit de film (ITZBund, Valtori, Foreign Affairs, Overheid.nl), geen banken");
const logos = fs.existsSync("public/security/logos") ? fs.readdirSync("public/security/logos").filter((f) => !f.startsWith("._")) : [];
eis(!logos.some((f) => /rijk|overheid|bund|valtori|kamer|wapen|coat|seal|itz|ncsc|fod|spf|bsi|gov/i.test(f)) && /src=\{`\/security\/vlaggen\/\$\{g\.vlag\}\.svg`\}/.test(tsx) && ["de", "fi", "be", "nl"].every((v) => /^<svg[^>]*viewBox[^>]*>(<rect [^>]*\/>)+<\/svg>\s*$/.test(lees(`public/security/vlaggen/${v}.svg`))) && !/wapen|rijkslogo|coat-of-arms/i.test(tsx.replace(/\/\/.*$/gm, "")), "nooit een overheidslogo of wapen: vlaggen tekenen we zelf");
eis(risico.map((g) => veld(g, "naam")).join() === "WordPress,WooCommerce,Magento,Joomla,Drupal,PrestaShop,Laravel" && risico.every((g) => fs.existsSync(`public${veld(g, "logo")}`)), "risico: WordPress, WooCommerce, Magento, Joomla, Drupal, PrestaShop en Laravel met logo");
eis([...geraakt, ...risico].every((g) => /^https:\/\/[^"]+$/.test(veld(g, "bron"))) && /function Extern[\s\S]{0,200}target="_blank" rel="noopener"/.test(tsx) && (tsx.slice(tsx.indexOf("function Geraakt"), tsx.indexOf("export function PhpCheckPage")).match(/<Extern href=\{/g) || []).length >= 3 && !/<a [^>]*href=\{[gp]\.bron\}/.test(tsx), "elk logo en elke vlag linkt naar een bron (https), in een nieuw tabblad met rel=noopener");
eis(/\(opent in een nieuw tabblad\)/.test(tsx) && en["(opent in een nieuw tabblad)"] === "(opens in a new tab)", "externe links gemarkeerd voor schermlezers");
const geraaktNoot = "Geen klanten of partners van SocialNow. Gemeld als offline of verstoord tijdens php2shell.";
const risicoNoot = "Platforms die op PHP draaien. Geen klanten of partners van SocialNow.";
eis(tsx.includes(geraaktNoot) && en[geraaktNoot] === "Not clients or partners of SocialNow. Reported offline or disrupted during php2shell." && tsx.includes(risicoNoot) && en[risicoNoot] === "Platforms that run on PHP. Not clients or partners of SocialNow.", "kleine regel: geen klanten of partners (NL en EN letterlijk)");
const oproep = "Gebouwd op een van deze en heeft niemand er al een tijdje naar omgekeken? Doe de scan.";
eis(tsx.includes(oproep) && en[oproep] === "Built on one of these and nobody has looked after it in a while? Run the scan." && /moderne host/.test(tsx), "risico: oproep letterlijk, en eerlijk dat een moderne host die PHP bijwerkt minder risico geeft");
eis(/className="pc-bronnen pc-geraakt-bronnen"/.test(tsx), "bronnen per naam in de voetnoot");

// 4. PHP-blok: tijdelijk gratis updates en PHP 8.1 en ouder (gerenderd)
const GRATIS_NL = "Omdat dit ons allemaal raakt, voeren we de essentiële updates tijdelijk gratis uit. Plan een call of stuur een mail.";
const GRATIS_EN = "Because this affects all of us, we're temporarily doing the essential updates for free. Book a call or send us an email.";
const OUD_NL = "Voor PHP 8.1 en ouder komt geen officiële fix meer. We plannen samen de overstap.";
const OUD_EN = "PHP 8.1 and older no longer get official fixes. We plan the upgrade together.";
eis(en[GRATIS_NL] === GRATIS_EN && en[OUD_NL] === OUD_EN && talen.every((t) => woorden[t][GRATIS_NL] && woorden[t][OUD_NL]), "regels over gratis updates en PHP 8.1 letterlijk in EN en vertaald in alle talen");
let render = null;
try {
  const { build } = await import("esbuild");
  const id = `${process.pid}-${Date.now()}`;
  const ingang = path.join(process.cwd(), "proposal", `.proef-sec-${id}.tsx`), uit = path.join(process.cwd(), "proposal", `.proef-sec-${id}.mjs`);
  fs.writeFileSync(ingang, `import React from "react";\nimport { renderToStaticMarkup } from "react-dom/server";\nimport { LanguageProvider } from "./i18n/context";\nimport { PhpBlok } from "./PhpCheck";\nexport const toon = (u: any, taal: any) => renderToStaticMarkup(React.createElement(LanguageProvider, { language: taal }, React.createElement(PhpBlok, { u })));\n`);
  try {
    await build({ entryPoints: [ingang], outfile: uit, bundle: true, format: "esm", platform: "node", jsx: "automatic", jsxImportSource: path.join(process.cwd(), "proposal", "i18n"), logLevel: "silent", packages: "external", plugins: [{ name: "proef", setup(b) {
      b.onResolve({ filter: /\.json\?(kern|rest)$/ }, (a) => ({ path: path.join(a.resolveDir, a.path.replace(/\?.*$/, "")) }));
      b.onResolve({ filter: /\.css$/ }, () => ({ path: "leeg", namespace: "leeg" }));
      b.onLoad({ filter: /.*/, namespace: "leeg" }, () => ({ contents: "", loader: "js" }));
    } }] });
    render = (await import(pathToFileURL(uit).href)).toon;
  } finally { fs.rmSync(ingang, { force: true }); fs.rmSync(uit, { force: true }); }
} catch (e) { console.log(`       (render: ${String(e.message || e).split("\n")[0]})`); }
const tekst = (html) => html.replace(/<span class="sn-title-dot">\.<\/span>/g, ".").replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ");
const gevallen = [
  { naam: "oranje PHP 5.2.12", u: { ok: true, domein: "bloemist.nl", uitslag: "oranje", phpVersie: "5.2.12", code: "eol-alleen-via-host" }, gratis: true, oud: true },
  { naam: "oranje PHP 8.4.26", u: { ok: true, domein: "x.nl", uitslag: "oranje", phpVersie: "8.4.26", hersteldVanaf: "8.4.27", code: "onder-de-fix-zonder-bewijs" }, gratis: true, oud: false },
  { naam: "rood PHP 8.1.2 Ubuntu", u: { ok: true, domein: "x.nl", uitslag: "rood", phpVersie: "8.1.2-1ubuntu2.25", hersteldVanaf: "8.1.2-1ubuntu2.28", code: "ubuntu-voor-de-fix" }, gratis: true, oud: true },
  { naam: "groen PHP 8.5.12", u: { ok: true, domein: "x.nl", uitslag: "groen", phpVersie: "8.5.12", code: "op-of-boven-de-fix" }, gratis: false, oud: false },
  { naam: "afgeschermd", u: { ok: true, domein: "x.nl", uitslag: "onbekend", phpVersie: null, code: "versie-verborgen" }, gratis: false, oud: false },
];
if (!render) eis(false, "PhpBlok is los te renderen");
else for (const g of gevallen) for (const taal of ["nl", "en"]) {
  let html = ""; try { html = render(g.u, taal); } catch { html = ""; }
  const t = tekst(html);
  const gratis = t.includes(taal === "en" ? GRATIS_EN : GRATIS_NL), oud = t.includes(taal === "en" ? OUD_EN : OUD_NL);
  const mensen = (html.match(/class="pc-mens"/g) || []).length;
  const volgorde = !g.gratis || (html.indexOf('class="pc-gratis"') > 0 && html.indexOf('class="pc-gratis"') < html.indexOf('class="pc-mens"'));
  eis(!!html && gratis === g.gratis && oud === g.oud && mensen === (g.gratis ? 2 : 0) && volgorde, `${taal.toUpperCase()} ${g.naam}: ${g.gratis ? "regel gratis updates boven Steef en Michelle" : "geen regel gratis updates"}${g.oud ? ", regel PHP 8.1 en ouder" : ""}`);
}
const uitslag = tsx.slice(tsx.indexOf('className="pc-uitslag"'), tsx.indexOf("</section>", tsx.indexOf('className="pc-uitslag"')));
eis(/u\.uitslag !== "rood" && u\.uitslag !== "oranje" && <Mensen /.test(uitslag), "bij oranje en rood staan Steef en Michelle in het PHP-blok, niet nog eens onder het rapport");

// 5. #aanvraag
eis(/hash !== "#aanvraag"/.test(tsx) && /for \(const ms of \[0, 300, 900, 1800\]\)[^\n]*aanvraagRef\.current\?\.scrollIntoView/.test(tsx) && /id="aanvraag" ref=\{aanvraagRef\}/.test(tsx), "#aanvraag scrolt naar het formulier, ook als de pagina na het laden nog opbouwt");

if (process.env.PROEF_LIVE) {
  const kop = async (u) => { const res = await fetch(u, { redirect: "manual" }); return [res.status, res.headers.get("location") || ""]; };
  for (const [bron, doel] of [["/check", "/security"], ["/nl/check", "/nl/security"], ["/check?domein=link.nl", "/security?domein=link.nl"], ["/php-check", "/security"], ["/de/check", "/de/security"]]) {
    const [s, l] = await kop(`https://socialnow.nl${bron}`);
    eis(s === 308 && (l === doel || l === `https://socialnow.nl${doel}`), `live: ${bron} geeft ${s} naar ${l || "-"}`);
  }
  for (const p of ["/security", "/nl/security"]) {
    const html = await (await fetch(`https://socialnow.nl${p}`)).text();
    eis(/<link rel="canonical" href="https:\/\/socialnow\.nl(\/nl)?\/security"/.test(html) && /og-security\.jpg/.test(html) && /<title>[^<]*(security ?scan)/i.test(html), `live: ${p} met eigen titel, canonical en deelbeeld`);
  }
  const sitemap = await (await fetch("https://socialnow.nl/sitemap.xml")).text();
  eis(sitemap.includes("https://socialnow.nl/security<") && !sitemap.includes("https://socialnow.nl/check<"), "live: sitemap noemt /security en niet /check");
}

console.log(fouten.length ? `\n${fouten.length} rood` : "\nalles groen");
process.exit(fouten.length ? 1 : 0);
