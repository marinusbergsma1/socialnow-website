// 30 september 2026 (Marinus): "Ik wil de site in minimaal 10 talen", "als drop down", plus twee losse
// wensen in dezelfde ronde: de teamregel onder het statement "mag weg" en Sid "meer deze kant op laten kijken".
// Rood op main (vier talen), groen op feat/talen-dropdown-20260930. Telt de fouten en sluit af met 1 bij rood.
import { readFileSync, existsSync } from "node:fs";

const lees = (pad) => (existsSync(pad) ? readFileSync(pad, "utf8") : "");
const fouten = [];
const eis = (ok, tekst) => { if (!ok) fouten.push(tekst); };

const context = lees("proposal/i18n/context.ts");
const splitser = lees("scripts/woordenboek-split.mjs");
const talen = JSON.parse((context.match(/export const LANGUAGES: Language\[\] = (\[[^\]]*\])/)?.[1] || "[]").replace(/'/g, '"'));
eis(talen.length >= 10, `minimaal 10 talen in LANGUAGES, nu ${talen.length}`);

const en = JSON.parse(lees("proposal/i18n/en.json") || "{}");
const sleutels = Object.keys(en);
for (const taal of talen.filter((t) => t !== "nl" && t !== "en")) {
  const boek = JSON.parse(lees(`proposal/i18n/${taal}.json`) || "{}");
  const gevuld = sleutels.filter((k) => typeof boek[k] === "string" && boek[k].trim()).length;
  eis(gevuld / sleutels.length >= 0.99, `${taal}.json dekt ${gevuld}/${sleutels.length} zinnen`);
  // Alleen de Engelse kern hoort in het eerste script: elke andere taal laadt haar eigen kern en rest.
  eis(context.includes(`./${taal}.json?kern`) && context.includes(`./${taal}.json?rest`), `${taal} heeft geen kern en rest in context.ts`);
  eis(new RegExp(`const TALEN = \\[[^\\]]*"${taal}"`).test(splitser), `woordenboek-split.mjs splitst ${taal} niet`);
  const modelnamen = Object.values(boek).filter((v) => /\b(Claude|Anthropic|GPT|Gemini|OpenAI)\b/.test(v));
  eis(modelnamen.length === 0, `${taal}.json noemt een AI-model (${modelnamen.length}x)`);
}

eis(/export function laadWoordenboek/.test(context), "context.ts laadt woordenboeken niet per taal");
eis(/laadWoordenboek\([^)]*"kern"\)/.test(lees("index.tsx")), "index.tsx laadt de kern niet vóór de eerste weergave");
const prerender = lees("scripts/prerender.mjs");
eis(/LANGUAGES\.filter/.test(prerender) || /\(nl\|de\|fr\|es\|it\|pt\|pl\|sv\|da\|tr\|ja\)/.test(prerender), "prerender.mjs kent de nieuwe talen niet (pagina slaat eerst in het Engels)");

const build = lees("scripts/localize-build.mjs");
const buildTalen = JSON.parse((build.match(/const LANGUAGES=(\[[^\]]*\])/)?.[1] || "[]").replace(/'/g, '"'));
eis(buildTalen.join() === talen.join(), `localize-build.mjs schrijft ${buildTalen.join()} i.p.v. ${talen.join()}`);
eis(!/for\(const oud of \['it','es'\]\)/.test(build), "localize-build.mjs stuurt /it en /es nog door naar Engels");

const detect = lees("proposal/i18n/detect.ts");
const schakelaar = lees("proposal/LanguageSwitch.tsx");
const popup = lees("proposal/ConsentPopup.tsx");
const balk = lees("proposal/HeroBalk.tsx");
for (const taal of talen.filter((t) => t !== "en")) {
  eis(new RegExp(`\\^\\\\/\\([^)]*\\b${taal}\\b`).test(detect), `detect.ts herkent /${taal}/ niet als taallink`);
  if (taal !== "nl") eis(schakelaar.includes(`case "${taal}":`), `geen vlag voor ${taal} in het taalmenu`);
  eis(popup.includes(`taal: "${taal}"`), `geen land met taal ${taal} in de welkomstpopup`);
  eis(new RegExp(`^  ${taal}: \\[`, "m").test(balk), `herobalk heeft geen zinnen in ${taal}`);
}
eis(/h-language-menu \{[^}]*overflow-y: auto/.test(lees("proposal/experience.css")), "taalmenu scrollt niet bij een laag scherm");

eis(!lees("proposal/pages.tsx").includes("With a team of human experts to help you in every step."), "teamregel onder het statement staat er nog");
eis(/\.h-spreker\.is-attesso img \{[^}]*scaleX\(-1\)/.test(lees("proposal/hero-c.css")), "Sid kijkt nog van Marinus af");

if (fouten.length) { console.log(`ROOD: ${fouten.length} fouten`); for (const f of fouten) console.log(" -", f); process.exit(1); }
console.log(`GROEN: ${talen.length} talen (${talen.join(", ")}), taalmenu, statement en Sid in orde`);
