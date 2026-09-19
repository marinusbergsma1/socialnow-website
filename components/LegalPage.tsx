import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Download } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useLanguage, languagePrefix } from "../proposal/i18n/context";
import type { LegalDoc } from "./legal";
import type { Language } from "../proposal/i18n/context";

// 16 september 2026: één opmaak voor de voorwaarden en het privacybeleid. De tekst komt uit
// components/legal.ts in de taal van de bezoeker; translate="no" houdt de vertaallaag erbuiten.
// 19 september 2026: een document is ook als pdf te bewaren. Wie een inkoopvragenlijst invult of
// een versie moet archiveren, wil een bestand met een datum erin en niet een pagina die morgen
// anders kan zijn. De pdf komt uit dezelfde tekst als deze pagina (scripts/legal-pdf.mjs), dus
// er kan geen verschil tussen de twee ontstaan. Zonder slug is er geen pdf en dan staat de knop
// er ook niet: een downloadknop die een 404 oplevert is erger dan geen downloadknop.
export default function LegalPage({ doc, path, slug }: { doc: Partial<Record<Language, LegalDoc>> & { nl: LegalDoc; en: LegalDoc }; path: string; slug?: string }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const d = doc[language] || doc.en;
  useSEO({ title: d.title, description: d.intro, path });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen text-white pt-28 md:pt-36 pb-20" translate="no">
      <div className="container mx-auto px-6 max-w-3xl">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8">
          <ChevronLeft size={14} />
          {({ nl: "Terug", en: "Back", de: "Zurück", fr: "Retour", it: "Indietro", es: "Volver" } as Record<string, string>)[language] || "Back"}
        </button>
        <div className="scroll-reveal">
          <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter mb-4">{d.title}</h1>
          <p className="text-gray-300 text-base mb-3">{d.intro}</p>
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{d.updated}</p>
            {slug && (
              <a href={`/documenten/socialnow-${slug}-${language === "nl" ? "nl" : "en"}.pdf`} download
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-[11px] font-bold uppercase tracking-widest text-white hover:border-white/50 transition-colors">
                <Download size={12} />PDF
              </a>
            )}
            <Link to={`${languagePrefix(language)}/juridisch`} className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              {({ nl: "Alle documenten", en: "All documents", de: "Alle Dokumente", fr: "Tous les documents", it: "Tutti i documenti", es: "Todos los documentos" } as Record<string, string>)[language] || "All documents"}
            </Link>
          </div>
        </div>
        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 text-sm leading-relaxed scroll-reveal">
          {d.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-black uppercase text-white tracking-tight mb-3">{s.title}</h2>
              {s.paragraphs.map((p, i) => (
                <React.Fragment key={i}>
                  <p className={i ? "mt-3" : ""}>{p}</p>
                  {s.bullets?.[i] && (
                    <ul className="pl-6 space-y-1 text-gray-400 mt-2" style={{ listStyle: "disc" }}>{s.bullets[i].map((b) => <li key={b} style={{ display: "list-item" }}>{b}</li>)}</ul>
                  )}
                </React.Fragment>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
