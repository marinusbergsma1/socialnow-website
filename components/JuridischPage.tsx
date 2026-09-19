import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Download } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useLanguage, languagePrefix } from "../proposal/i18n/context";
import { DOCUMENTEN } from "./legal-index";

// De juridische hub — 19 september 2026.
//
// Tot vandaag stonden de voorwaarden en het privacybeleid als twee losse links in de voettekst.
// Met zes documenten werkt dat niet meer: wie een vragenlijst van een inkoper invult of wie wil
// weten of er een verwerkersovereenkomst ís, moet één adres hebben waar alles staat, met per
// document één regel die zegt wanneer je het nodig hebt. Dat is deze pagina.
//
// Elk document staat hier ook als pdf. Niet omdat een pdf beter leest dan een webpagina — dat is
// hij niet — maar omdat een inkoopafdeling een bestand wil dat zij kan opslaan met een datum
// erin, en omdat een versie die je kunt archiveren iets anders is dan een pagina die morgen kan
// veranderen. De pdf's worden gemaakt uit exact dezelfde tekst als deze pagina's
// (scripts/legal-pdf.mjs), dus ze kunnen niet uit elkaar lopen.

const TEKST = {
  nl: {
    titel: "Juridisch en compliance",
    intro: "Alle documenten die vastleggen wat wij met jouw gegevens doen, wat wij afspreken en waar je ons op kunt aanspreken. De Nederlandse tekst is bindend; de andere talen staan er voor het lezen.",
    terug: "Terug",
    lezen: "Lezen",
    pdf: "Pdf",
    vragen: "Vragen over een van deze documenten, of een vragenlijst die ingevuld moet worden?",
    contact: "Mail privacy@socialnow.nl voor gegevens en privacy, security@socialnow.nl voor kwetsbaarheden.",
    gegevens: "SocialNow · Amstelstraat 43G, 1017 DA Amsterdam · KVK 90877179 · privacy@socialnow.nl",
  },
  en: {
    titel: "Legal and compliance",
    intro: "Every document that sets out what we do with your data, what we agree and what you can hold us to. The Dutch text is binding; the other languages are there to be read.",
    terug: "Back",
    lezen: "Read",
    pdf: "PDF",
    vragen: "Questions about any of these documents, or a questionnaire that needs filling in?",
    contact: "Mail privacy@socialnow.nl for data and privacy, security@socialnow.nl for vulnerabilities.",
    gegevens: "SocialNow · Amstelstraat 43G, 1017 DA Amsterdam, the Netherlands · CoC 90877179 · privacy@socialnow.nl",
  },
} as const;

export default function JuridischPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TEKST[language === "nl" ? "nl" : "en"];
  const prefix = languagePrefix(language);
  useSEO({ title: t.titel, description: t.intro, path: "/juridisch" });
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen text-white pt-28 md:pt-36 pb-20" translate="no">
      <div className="container mx-auto px-6 max-w-3xl">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8">
          <ChevronLeft size={14} />
          {t.terug}
        </button>
        <div className="scroll-reveal">
          <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter mb-4">{t.titel}</h1>
          <p className="text-gray-300 text-base mb-12 max-w-2xl">{t.intro}</p>
        </div>

        <div className="space-y-4 scroll-reveal">
          {DOCUMENTEN.map((d) => {
            const doc = d.doc[language] || d.doc.en;
            const waarvoor = d.waarvoor[language] || d.waarvoor.en;
            return (
              <article key={d.slug} className="border border-white/10 rounded-2xl p-5 md:p-6 bg-white/[0.02] hover:border-white/25 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-white">{doc.title}</h2>
                    <p className="text-gray-400 text-sm mt-2 max-w-xl">{waarvoor}</p>
                    <p className="text-white/25 text-[11px] font-bold uppercase tracking-widest mt-3">{doc.updated}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`${prefix}${d.path}`} className="px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:border-white/50 transition-colors">
                      {t.lezen}
                    </Link>
                    {/* De pdf is een gewoon bestand in public/, dus geen router-link maar een echte href. */}
                    <a href={`/documenten/socialnow-${d.slug}-${language === "nl" ? "nl" : "en"}.pdf`} download
                       className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:border-white/50 transition-colors">
                      <Download size={13} />{t.pdf}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-gray-400 scroll-reveal">
          <p className="text-white font-bold">{t.vragen}</p>
          <p className="mt-2">{t.contact}</p>
          <p className="mt-6 text-white/30 text-xs">{t.gegevens}</p>
        </div>
      </div>
    </div>
  );
}
