import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useLanguage } from "../proposal/i18n/context";
import type { LegalDoc } from "./legal";

// 16 september 2026: één opmaak voor de voorwaarden en het privacybeleid. De tekst komt uit
// components/legal.ts in de taal van de bezoeker; translate="no" houdt de vertaallaag erbuiten.
export default function LegalPage({ doc, path }: { doc: Record<"en" | "nl", LegalDoc>; path: string }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const d = doc[language] || doc.nl;
  useSEO({ title: d.title, description: d.intro, path });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen text-white pt-28 md:pt-36 pb-20" translate="no">
      <div className="container mx-auto px-6 max-w-3xl">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8">
          <ChevronLeft size={14} />
          {language === "nl" ? "Terug" : "Back"}
        </button>
        <div className="scroll-reveal">
          <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter mb-4">{d.title}</h1>
          <p className="text-gray-300 text-base mb-3">{d.intro}</p>
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-12">{d.updated}</p>
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
