import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { LANGUAGES, LANGUAGE_NAMES, languagePrefix, useLanguage, type Language } from "./i18n/context";
import { rememberLanguage } from "./i18n/detect";
import { stopTaalwissel, useToonTaal } from "./taalwissel";

// 16 september 2026 (Marinus, voor de beurs): één strak vlaggetje met een uitklapmenu. Sinds 5 oktober 2026
// tien talen; het menu staat dan in twee kolommen (experience.css), op een smal scherm in één kolom die scrolt.
// De vlaggen zijn kleine SVG's, geen emoji, zodat ze op elk systeem hetzelfde ogen.
export function Flag({ code, size = 18 }: { code: Language; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const, focusable: "false" as const, className: "h-flag" };
  switch (code) {
    case "nl": return <svg {...common}><rect width="24" height="8" fill="#AE1C28"/><rect y="8" width="24" height="8" fill="#fff"/><rect y="16" width="24" height="8" fill="#21468B"/></svg>;
    case "de": return <svg {...common}><rect width="24" height="8" fill="#000"/><rect y="8" width="24" height="8" fill="#DD0000"/><rect y="16" width="24" height="8" fill="#FFCE00"/></svg>;
    case "fr": return <svg {...common}><rect width="8" height="24" fill="#0055A4"/><rect x="8" width="8" height="24" fill="#fff"/><rect x="16" width="8" height="24" fill="#EF4135"/></svg>;
    case "es": return <svg {...common}><rect width="24" height="24" fill="#AA151B"/><rect y="6" width="24" height="12" fill="#F1BF00"/></svg>;
    case "it": return <svg {...common}><rect width="8" height="24" fill="#009246"/><rect x="8" width="8" height="24" fill="#fff"/><rect x="16" width="8" height="24" fill="#CE2B37"/></svg>;
    case "pt": return <svg {...common}><rect width="24" height="24" fill="#DA291C"/><rect width="9.6" height="24" fill="#046A38"/><circle cx="9.6" cy="12" r="4" fill="#FFE900"/><circle cx="9.6" cy="12" r="2.4" fill="#DA291C"/><rect x="8.4" y="10.6" width="2.4" height="2.9" rx=".5" fill="#fff"/></svg>;
    case "pl": return <svg {...common}><rect width="24" height="12" fill="#fff"/><rect y="12" width="24" height="12" fill="#DC143C"/></svg>;
    case "sv": return <svg {...common}><rect width="24" height="24" fill="#006AA7"/><rect x="7" width="4" height="24" fill="#FECC00"/><rect y="10" width="24" height="4" fill="#FECC00"/></svg>;
    case "da": return <svg {...common}><rect width="24" height="24" fill="#C8102E"/><rect x="7" width="3.4" height="24" fill="#fff"/><rect y="10.3" width="24" height="3.4" fill="#fff"/></svg>;
    default: return <svg {...common}><rect width="24" height="24" fill="#012169"/><path d="M0 0l24 24M24 0L0 24" stroke="#fff" strokeWidth="4.5"/><path d="M0 0l24 24M24 0L0 24" stroke="#C8102E" strokeWidth="2"/><path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="7"/><path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="4"/></svg>;
  }
}

export default function LanguageSwitch() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const tail = location.pathname + location.search + location.hash;
  // Het vlaggetje wisselt mee met de kop op de homepage; bij openen van het menu stopt dat.
  const getoond = useToonTaal();
  const vlag = !open && getoond ? getoond : language;
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <div className={`h-language-switch${open ? " is-open" : ""}`} ref={wrap} translate="no">
      <button type="button" className="h-language-current" aria-haspopup="listbox" aria-expanded={open} aria-label={`Language: ${LANGUAGE_NAMES[language]}`} onClick={() => { stopTaalwissel(); setOpen((v) => !v); }}>
        <Flag key={`vlag-${vlag}`} code={vlag} />
        <span key={`code-${vlag}`}>{vlag.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <ul className="h-language-menu" role="listbox" aria-label="Language" hidden={!open}>
        {LANGUAGES.map((code) => (
          <li key={code} role="option" aria-selected={code === language}>
            <a href={`${languagePrefix(code)}${tail}`} lang={code} hrefLang={code} aria-current={code === language ? "true" : undefined} onClick={() => { rememberLanguage(code); setOpen(false); }}>
              <Flag code={code} />
              <span>{LANGUAGE_NAMES[code]}</span>
              <small>{code.toUpperCase()}</small>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
