import React from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "./i18n/context";
export default function LanguageSwitch() {
 const { language }=useLanguage(); const location=useLocation();
 const tail=location.pathname+location.search+location.hash;
 return <nav className="h-language-switch" aria-label="Language" translate="no">
  <a href={tail} lang="en" hrefLang="en" aria-current={language==="en"?"true":undefined}>EN</a>
  <span aria-hidden="true">/</span>
  <a href={`/nl${tail}`} lang="nl" hrefLang="nl" aria-current={language==="nl"?"true":undefined}>NL</a>
 </nav>;
}
