// 30 september 2026 (Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING"). De drie woordenboeken
// (en, de, fr) zaten alle drie volledig in het eerste script: samen 580 KB, 55 KB gzip per taal.
// In de productiebuild splitst deze plugin elk woordenboek in twee delen:
//   kern: zinnen uit modules die statisch met het eerste script meekomen (header, hero, gedeelde data),
//         plus zinnen die een sjabloon in die modules kan samenstellen. Alleen de Engelse kern zit in het
//         eerste script (Engels is de standaardtaal en de terugval); de Duitse en Franse kern laden vóór
//         het eerste beeld, alleen op een Duitse of Franse pagina (index.tsx).
//   rest: alle andere zinnen, ook oude die nergens meer in de code staan. De rest van één taal laadt
//         samen met de eerste latere sectie (proposal/later.tsx), nooit eerder dan nodig.
// De indeling volgt de echte modulegraaf van deze build, dus een sectie die van later naar het eerste
// script verhuist neemt haar zinnen vanzelf mee. In dev en in Node-controles verandert er niets:
// daar blijven de volledige JSON-bestanden gelden (./de.json, ./de.json?kern en ./de.json?rest geven alle drie alles).
import { readFileSync } from "node:fs";
import path from "node:path";

// 30 september 2026: twaalf talen op de site; elk woordenboek behalve Nederlands (de bron) wordt gesplitst.
const TALEN = ["en", "de", "fr", "es", "it", "pt", "pl", "sv", "da", "tr", "ja"];
const KERN = "\0sn-woordenboek-kern-";
const REST = "\0sn-woordenboek-rest-";
const plek = (soort, taal) => `__SN_WOORDENBOEK_${soort}_${taal}__`;
const sleutel = (tekst) => tekst.replace(/\s+/g, " ").trim();

// Zinnen die tijdens het draaien worden samengesteld, zoals `Ontdek ${name}` of "Stap " + n, staan niet letterlijk in de
// code. Van elk sjabloon en elke +-keten met tekst maken we een patroon; een zin die op zo'n patroon past, hoort bij
// de module van dat sjabloon.
const letterlijk = (d) => d.type === "Literal" && typeof d.value === "string";
function patroon(delen) {
  const tekst = delen.filter((d) => d !== null).join("");
  if (tekst.replace(/[\s\W]/g, "").length < 3) return null;
  const bron = delen.map((d) => (d === null ? "[\\s\\S]+?" : d.replace(/\s+/g, " ").replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s*"))).join("");
  return new RegExp(`^\\s*${bron}\\s*$`);
}
function plusKeten(knoop, uit) {
  if (knoop?.type === "BinaryExpression" && knoop.operator === "+") { plusKeten(knoop.left, uit); plusKeten(knoop.right, uit); }
  else uit.push(letterlijk(knoop) ? knoop.value : null);
  return uit;
}
function tekstenIn(knoop, uit, patronen) {
  if (!knoop || typeof knoop !== "object") return;
  if (Array.isArray(knoop)) { for (const k of knoop) tekstenIn(k, uit, patronen); return; }
  if (letterlijk(knoop)) uit.add(sleutel(knoop.value));
  if (knoop.type === "TemplateElement" && typeof knoop.value?.cooked === "string") uit.add(sleutel(knoop.value.cooked));
  if (knoop.type === "TemplateLiteral" && knoop.expressions.length) {
    const p = patroon(knoop.quasis.flatMap((q, i) => (i ? [null, q.value.cooked ?? ""] : [q.value.cooked ?? ""])));
    if (p) patronen.push(p);
  }
  if (knoop.type === "BinaryExpression" && knoop.operator === "+") {
    const delen = plusKeten(knoop, []);
    if (delen.some((d) => d !== null) && delen.some((d) => d === null)) { const p = patroon(delen); if (p) patronen.push(p); }
  }
  for (const [naam, waarde] of Object.entries(knoop)) if (naam !== "type" && waarde && typeof waarde === "object") tekstenIn(waarde, uit, patronen);
}

/** @param {{ verslag?: (v: { sleutels: number, kern: number, nergens: number, patroon: string[] }) => void }} [opties] @returns {import("vite").Plugin} */
export default function woordenboekSplit({ verslag } = {}) {
  let map = "";
  const inhoud = {};
  return {
    name: "sn-woordenboek-split",
    apply: "build",
    enforce: "pre",
    configResolved(config) { map = path.resolve(config.root, "proposal/i18n"); },
    resolveId(bron, importer) {
      // ./en.json is de kern van het Engels, ./xx.json?kern en ./xx.json?rest de delen van elke taal. Een gewone
      // ./de.json (bijvoorbeeld via import.meta.glob) blijft het hele woordenboek.
      const m = bron.match(/^\.\/(en|de|fr|es|it|pt|pl|sv|da|tr|ja)\.json(?:\?(kern|rest))?$/);
      if (!m || !importer || path.dirname(importer.split("?")[0]) !== map) return null;
      if (m[2] === "rest") return REST + m[1];
      if (m[2] === "kern" || m[1] === "en") return KERN + m[1];
      return null;
    },
    load(id) {
      if (id.startsWith(KERN)) return `export default JSON.parse(${JSON.stringify(plek("KERN", id.slice(KERN.length)))});`;
      if (id.startsWith(REST)) return `export default JSON.parse(${JSON.stringify(plek("REST", id.slice(REST.length)))});`;
      return null;
    },
    // Alleen het Engels hoort in het eerste script. De statische imports van andere talen in context.ts worden in de
    // build een leeg woordenboek; hun kern komt via laadWoordenboek(taal, "kern") vóór het eerste beeld (index.tsx).
    transform(code, id) {
      if (id.split("?")[0] !== path.join(map, "context.ts")) return null;
      const nieuw = code.replace(/import\s+(\w+)\s+from\s+["']\.\/(?!en\.json)(\w+)\.json["'];?/g, "const $1: Record<string, string> = {};");
      return nieuw === code ? null : { code: nieuw, map: null };
    },
    buildEnd(fout) {
      if (fout) return;
      const boeken = Object.fromEntries(TALEN.map((t) => {
        const bestand = path.join(map, `${t}.json`);
        this.addWatchFile(bestand);
        return [t, JSON.parse(readFileSync(bestand, "utf8"))];
      }));
      const ids = [...this.getModuleIds()];
      // Statische sluiting vanaf elk entrypunt: dit draait voordat er iets later laadt.
      const statisch = new Set();
      const stapel = ids.filter((id) => this.getModuleInfo(id)?.isEntry);
      while (stapel.length) {
        const id = stapel.pop();
        if (statisch.has(id)) continue;
        statisch.add(id);
        for (const dep of this.getModuleInfo(id)?.importedIds ?? []) stapel.push(dep);
      }
      const vroeg = new Set();
      const laat = new Set();
      const vroegePatronen = [];
      for (const id of ids) {
        const info = this.getModuleInfo(id);
        if (!info?.code || id.startsWith("\0") || id.includes("/node_modules/")) continue;
        const teksten = new Set();
        const patronen = [];
        try { tekstenIn(this.parse(info.code), teksten, patronen); } catch { continue; }
        for (const t of teksten) (statisch.has(id) ? vroeg : laat).add(t);
        if (statisch.has(id)) vroegePatronen.push(...patronen);
      }
      const alle = new Set(TALEN.flatMap((t) => Object.keys(boeken[t])));
      // Kern: letterlijk in het eerste script, of samen te stellen door een sjabloon daarin. Zinnen die nergens in de
      // code staan (oude teksten) gaan met de rest mee.
      const kernSet = new Set([...alle].filter((k) => vroeg.has(k) || (!laat.has(k) && vroegePatronen.some((p) => p.test(k)))));
      const inKern = (k) => kernSet.has(k);
      for (const t of TALEN) {
        const kern = {};
        const rest = {};
        for (const k of alle) {
          if (inKern(k)) { if (boeken[t][k] != null) kern[k] = boeken[t][k]; continue; }
          // Zelfde uitkomst als translate(): eerst de eigen taal, dan het Engels. De rest van en laadt
          // voor een Duitse of Franse bezoeker niet mee, dus de terugval zit er hier al in.
          const waarde = boeken[t][k] ?? (t === "en" ? undefined : boeken.en[k]);
          if (waarde != null) rest[k] = waarde;
        }
        inhoud[plek("KERN", t)] = kern;
        inhoud[plek("REST", t)] = rest;
      }
      verslag?.({
        sleutels: alle.size,
        kern: [...alle].filter(inKern).length,
        nergens: [...alle].filter((k) => !vroeg.has(k) && !laat.has(k)).length,
        patroon: [...alle].filter((k) => inKern(k) && !vroeg.has(k)),
      });
    },
    renderChunk(code) {
      if (!code.includes("__SN_WOORDENBOEK_")) return null;
      const nieuw = code.replace(/(["'`])(__SN_WOORDENBOEK_(?:KERN|REST)_(?:en|de|fr|es|it|pt|pl|sv|da|tr|ja)__)\1/g, (_, _q, naam) => {
        if (!inhoud[naam]) this.error(`woordenboek ${naam} ontbreekt`);
        return JSON.stringify(JSON.stringify(inhoud[naam]));
      });
      return { code: nieuw, map: null };
    },
  };
}
