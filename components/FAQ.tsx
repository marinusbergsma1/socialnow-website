
import React, { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "Wat kost een website bij SocialNow?",
    answer: "Transparantie first: een one-pager start vanaf \u20AC1.500, een business website vanaf \u20AC3.500, en custom projecten op maat. AI maakt ons sneller, en dat voordeel geven we door. Elk project begint met een gratis intake.",
    color: "#00A3E0"
  },
  {
    question: "Hoe snel staat mijn website live?",
    answer: "Een website in 2\u20134 weken. Een web app in 4\u20138 weken. Ja, echt. AI versnelt ons design- en development-proces met 50% \u2014 zonder in te leveren op kwaliteit. Spoed? Bespreekbaar.",
    color: "#F7E644"
  },
  {
    question: "Hoe gebruiken jullie AI precies?",
    answer: "AI zit in ons hele proces: van design-validatie met neurale heatmaps tot code-generatie en performance-optimalisatie. Het resultaat: snellere delivery, minder bugs, en websites die bewezen beter presteren.",
    color: "#25D366"
  },
  {
    question: "Kan ik mijn website zelf aanpassen na oplevering?",
    answer: "Absoluut. We bouwen met een gebruiksvriendelijk CMS zodat je zelf teksten, afbeeldingen en pagina\u2019s kunt beheren. En als je hulp nodig hebt: we bieden maandelijkse support-pakketten aan.",
    color: "#F62961"
  },
  {
    question: "Wat als ik ook een app of web applicatie nodig heb?",
    answer: "Daar zijn we sterk in. Van SaaS-platforms tot e-commerce en dashboards \u2014 we bouwen full-stack met dezelfde AI-versnelde aanpak. Alles onder \u00E9\u00E9n dak, \u00E9\u00E9n team.",
    color: "#00A3E0"
  },
  {
    question: "Hoe ziet een samenwerking eruit?",
    answer: "Het begint met een vrijblijvend gesprek van 30 minuten. Daarna een voorstel op maat. Bij akkoord starten we direct. Geen eindeloze meetings, geen bureaucratie \u2014 gewoon bouwen.",
    color: "#F7E644"
  }
];

interface FAQProps {
  onOpenContact?: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onOpenContact }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-36 bg-transparent relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
        <h2 className="text-[25vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">FAQ</h2>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">

        {/* Minimal header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 md:mb-24">
          <div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.85]">
              DIRECT<br className="md:hidden" /> ANTWOORD
            </h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-xs leading-relaxed">
            Geen sales talk. Gewoon eerlijke antwoorden op de vragen die je echt hebt.
          </p>
        </div>

        {/* Clean stacked FAQ items */}
        <div className="space-y-0">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-t border-white/10 last:border-b">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-7 md:py-9 text-left group"
                >
                  <div className="flex items-center gap-5 md:gap-8">
                    <span
                      className="text-[11px] font-black tracking-widest transition-colors duration-300"
                      style={{ color: isOpen ? faq.color : 'rgba(255,255,255,0.2)' }}
                    >
                      0{index + 1}
                    </span>
                    <span className={`text-base md:text-xl font-black uppercase tracking-tight transition-colors duration-300 leading-tight ${
                      isOpen ? 'text-white' : 'text-gray-500 group-hover:text-white'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ml-4 ${
                    isOpen ? 'rotate-0' : 'rotate-0'
                  }`}
                    style={{ backgroundColor: isOpen ? faq.color : 'transparent', border: isOpen ? 'none' : '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {isOpen
                      ? <Minus size={16} className="text-black" />
                      : <Plus size={16} className="text-white/40 group-hover:text-white transition-colors" />
                    }
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-8 md:pb-10 pl-10 md:pl-[4.5rem] pr-14">
                      <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium max-w-2xl">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-12 md:mt-20 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
            Vraag niet beantwoord?
          </p>
          <a
            href="https://wa.me/31637404577"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            <MessageCircle size={14} />
            WhatsApp ons — reactie binnen 2 uur
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
