import React, { createContext, useContext, useEffect } from "react";
import english from "./en.json";
import german from "./de.json";
import french from "./fr.json";
import italian from "./it.json";
import spanish from "./es.json";
// 16 september 2026 (Marinus, voor de beurs): zes talen. Nederlands is de bron in de code, de
// andere vijf zijn woordenboeken met de Nederlandse zin als sleutel. Ontbreekt een zin in een
// woordenboek, dan valt hij terug op het Engels en daarna op het Nederlands.
export type Language = "en" | "nl" | "de" | "fr" | "it" | "es";
export const LANGUAGES: Language[] = ["en", "nl", "de", "fr", "it", "es"];
export const LANGUAGE_NAMES: Record<Language, string> = { en: "English", nl: "Nederlands", de: "Deutsch", fr: "Français", it: "Italiano", es: "Español" };
export const LOCALES: Record<Language, string> = { en: "en_GB", nl: "nl_NL", de: "de_DE", fr: "fr_FR", it: "it_IT", es: "es_ES" };
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
  it: italian as Record<string, string>,
  es: spanish as Record<string, string>,
};
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
