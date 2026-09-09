import React, { createContext, useContext, useEffect } from "react";
import english from "./en.json";
export type Language = "en" | "nl";
// Eén gedeelde context-instantie, ook als deze module twee keer geladen wordt.
// In dev prebundelt Vite de JSX-runtime (jsxImportSource) apart, met een eigen
// kopie van dit bestand; zonder deze singleton zag LocalizedElement dan altijd
// de standaardtaal "en" en bleef /nl/ Engels op localhost.
const shared = globalThis as unknown as { __snLanguageContext?: React.Context<Language>; __snNoTranslation?: React.Context<boolean> };
export const LanguageContext = (shared.__snLanguageContext ??= createContext<Language>("en"));
export const NoTranslation = (shared.__snNoTranslation ??= createContext(false));
export const missingTranslations = new Set<string>();
const dictionary = english as Record<string, string>;
export function translate(text: string, language: Language): string {
  if (language === "nl" || !text.trim()) return text;
  const key = text.replace(/\s+/g, " ").trim();
  const found = dictionary[key];
  if (found !== undefined) return text.replace(text.trim(), found);
  for (const [prefix, replacement] of [["Live website van ", "Live website by "], ["Websiteontwerp voor ", "Website design for "]]) {
    if (key.startsWith(prefix)) return replacement + key.slice(prefix.length);
  }
  if (/[A-Za-zÀ-ž]/.test(key)) missingTranslations.add(key);
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
