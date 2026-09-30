import React, { createContext, useContext, useEffect } from "react";
// 30 september 2026: in de productiebuild bevat english alleen de kern (de zinnen van het eerste script) en starten
// de andere talen leeg; de rest komt per taal via laadWoordenboek(). Zie scripts/woordenboek-split.mjs.
import english from "./en.json";
import german from "./de.json";
import french from "./fr.json";
import spanish from "./es.json";
import italian from "./it.json";
import portuguese from "./pt.json";
import polish from "./pl.json";
import swedish from "./sv.json";
import danish from "./da.json";
import turkish from "./tr.json";
import japanese from "./ja.json";
// 16 september 2026 (Marinus, voor de beurs): zes talen. Sinds 26 september 2026 nog vier: Italiaans
// en Spaans zijn eraf. Nederlands is de bron in de code, de andere drie zijn woordenboeken met de Nederlandse zin als sleutel. Ontbreekt een zin in een
// woordenboek, dan valt hij terug op het Engels en daarna op het Nederlands.
// 30 september 2026 (Marinus): "Ik wil de site in minimaal 10 talen", "als drop down". Twaalf talen in het
// taalmenu; de acht nieuwe woordenboeken vult scripts/vertaal-talen.mjs.
export type Language = "en" | "nl" | "de" | "fr" | "es" | "it" | "pt" | "pl" | "sv" | "da" | "tr" | "ja";
export const LANGUAGES: Language[] = ["en", "nl", "de", "fr", "es", "it", "pt", "pl", "sv", "da", "tr", "ja"];
export const LANGUAGE_NAMES: Record<Language, string> = { en: "English", nl: "Nederlands", de: "Deutsch", fr: "Français", es: "Español", it: "Italiano", pt: "Português", pl: "Polski", sv: "Svenska", da: "Dansk", tr: "Türkçe", ja: "日本語" };
export const LOCALES: Record<Language, string> = { en: "en_GB", nl: "nl_NL", de: "de_DE", fr: "fr_FR", es: "es_ES", it: "it_IT", pt: "pt_PT", pl: "pl_PL", sv: "sv_SE", da: "da_DK", tr: "tr_TR", ja: "ja_JP" };
export function isLanguage(value: string): value is Language { return (LANGUAGES as string[]).includes(value); }
export function languagePrefix(language: Language): string { return language === "en" ? "" : `/${language}`; }
// Eén gedeelde context-instantie, ook als deze module twee keer geladen wordt.
// In dev prebundelt Vite de JSX-runtime (jsxImportSource) apart, met een eigen
// kopie van dit bestand; zonder deze singleton zag LocalizedElement dan altijd
// de standaardtaal "en" en bleef /nl/ Engels op localhost.
const shared = globalThis as unknown as { __snLanguageContext?: React.Context<Language>; __snNoTranslation?: React.Context<boolean> };
export const LanguageContext = (shared.__snLanguageContext ??= createContext<Language>("en"));
export const NoTranslation = (shared.__snNoTranslation ??= createContext(false));
export const missingTranslations = new Set<string>();
const dictionaries: Record<Exclude<Language, "nl">, Record<string, string>> = {
  en: english as Record<string, string>,
  de: german as Record<string, string>,
  fr: french as Record<string, string>,
  es: spanish as Record<string, string>,
  it: italian as Record<string, string>,
  pt: portuguese as Record<string, string>,
  pl: polish as Record<string, string>,
  sv: swedish as Record<string, string>,
  da: danish as Record<string, string>,
  tr: turkish as Record<string, string>,
  ja: japanese as Record<string, string>,
};
// De Duitse en Franse kern laden vóór het eerste beeld (index.tsx), de rest van een woordenboek samen met de eerste
// latere sectie of pagina (proposal/later.tsx). In dev en in Node-controles geven ./de.json?kern en ./de.json?rest
// het hele woordenboek; samenvoegen verandert dan niets.
type Deel = Partial<Record<Exclude<Language, "nl">, () => Promise<{ default: Record<string, string> }>>>;
const delen: Record<"kern" | "rest", Deel> = {
  kern: {
    de: () => import("./de.json?kern"), fr: () => import("./fr.json?kern"), es: () => import("./es.json?kern"), it: () => import("./it.json?kern"),
    pt: () => import("./pt.json?kern"), pl: () => import("./pl.json?kern"), sv: () => import("./sv.json?kern"), da: () => import("./da.json?kern"),
    tr: () => import("./tr.json?kern"), ja: () => import("./ja.json?kern"),
  },
  rest: {
    en: () => import("./en.json?rest"), de: () => import("./de.json?rest"), fr: () => import("./fr.json?rest"), es: () => import("./es.json?rest"),
    it: () => import("./it.json?rest"), pt: () => import("./pt.json?rest"), pl: () => import("./pl.json?rest"), sv: () => import("./sv.json?rest"),
    da: () => import("./da.json?rest"), tr: () => import("./tr.json?rest"), ja: () => import("./ja.json?rest"),
  },
};
const geladen = new Map<string, Promise<void>>();
const binnen = new Set<string>();
let paginaTaal: Language = "en";
export function laadWoordenboek(language: Language = paginaTaal, deel: "kern" | "rest" = "rest"): Promise<void> {
  const laad = language === "nl" ? undefined : delen[deel][language];
  if (!laad) return Promise.resolve();
  let klaar = geladen.get(`${deel}-${language}`);
  if (!klaar) {
    klaar = laad().then((woorden) => { Object.assign(dictionaries[language as Exclude<Language, "nl">], woorden.default); binnen.add(`${deel}-${language}`); });
    geladen.set(`${deel}-${language}`, klaar);
  }
  return klaar;
}
export function woordenboekBinnen(language: Language, deel: "kern" | "rest" = "rest"): boolean {
  return language === "nl" || !delen[deel][language] || binnen.has(`${deel}-${language}`);
}
export function translate(text: string, language: Language): string {
  if (language === "nl" || !text.trim()) return text;
  const key = text.replace(/\s+/g, " ").trim();
  const found = dictionaries[language]?.[key] ?? (language === "en" ? undefined : dictionaries.en[key]);
  if (found !== undefined) return text.replace(text.trim(), found);
  for (const [prefix, replacement] of [["Live website van ", "Live website by "], ["Websiteontwerp voor ", "Website design for "], ["Volledige paginaopname van de website van ", "Full-page capture of the website of "]]) {
    if (key.startsWith(prefix)) return replacement + key.slice(prefix.length);
  }
  if (language === "en" && /[A-Za-zÀ-ž]/.test(key)) missingTranslations.add(key);
  return text;
}
export function useLanguage() { const language=useContext(LanguageContext); return {language, t:(text:string)=>translate(text,language)}; }
export function LanguageProvider({children, language="en"}:{children:React.ReactNode;language?:Language}) {
 paginaTaal=language;
 useEffect(()=>{ document.documentElement.lang=language; },[language]);
 return React.createElement(LanguageContext.Provider,{value:language},children);
}
export function LocalizedElement({element, ...props}:{element:any;[key:string]:any}) {
 const language=useContext(LanguageContext);
 const inherited=useContext(NoTranslation);
 const disabled=inherited || props.translate === "no" || ["script","style","code","pre"].includes(element);
 const next={...props};
 if(!disabled) {
  for(const attr of ["title","placeholder","alt","aria-label","aria-description"]) if(typeof next[attr]==="string") next[attr]=translate(next[attr],language);
 }
 const localize=(child:any):any => !disabled && typeof child==="string" ? translate(child,language) : Array.isArray(child) ? child.map(localize) : child;
 let children=localize(next.children); delete next.children;
 if(disabled && !inherited && children != null) children=React.createElement(NoTranslation.Provider,{value:true},children);
 // Preserve void elements, refs, handlers and form values exactly.
 return children === undefined ? React.createElement(element,next) : React.createElement(element,next,children);
}
