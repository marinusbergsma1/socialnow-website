
import React, { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "Wat kost een rebranding traject gemiddeld?",
    answer: "Elk traject is maatwerk. Een high-end rebranding start doorgaans vanaf \u20AC2.500. Dit omvat volledige merkstrategie, visuele identiteit, typografie en uitgebreide Brand OS guidelines voor alle kanalen.",
    color: "#5BA4F5"
  },
  {
    question: "Hoe integreert SocialNow AI in het proces?",
    answer: "Wij gebruiken AI als multiplier. Van neurale heatmapping voor design-validatie tot AI-gedreven copywriting en predictive analytics om de effectiviteit van visuals te testen voordat ze live gaan.",
    color: "#F7E644"
  },
  {
    question: "Wat is de gemiddelde doorlooptijd?",
    answer: "Een intensieve rebranding duurt gemiddeld 4 tot 8 weken. We werken in sprints om de snelheid hoog te houden zonder in te leveren op de brute kwaliteit waar we om bekend staan.",
    color: "#25D366"
  },
  {
    question: "Werken jullie ook met maandelijkse retainers?",
    answer: "Zeker. Voor merken die continu willen domineren bieden we Brand Management pakketten aan. Hierbij fungeren we als jullie externe creative department voor design, content en marketing.",
    color: "#F62961"
  },
  {
    question: "Welke data gebruiken jullie voor design?",
    answer: "We analyseren markttrends, consumentengedrag en concurrentie-data. Door deze inzichten te combineren met brute creativiteit, bouwen we merken die niet alleen mooi zijn, maar ook converteren.",
    color: "#5BA4F5"
  },
  {
    question: "Hoe ziet het kennismakingsproces eruit?",
    answer: "We starten altijd met een Deep Dive sessie. Hierin analyseren we de huidige status van je merk en de rauwe ambitie. Na deze sessie ontvang je een op maat gemaakt voorstel voor jouw Next Gen merk.",
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
              VRAGEN &amp;<br className="md:hidden" /> ANTWOORDEN
            </h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-xs leading-relaxed">
            De antwoorden op de meest gestelde vragen over onze werkwijze.
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
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                    isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pb-8 md:pb-10 pl-10 md:pl-[4.5rem] pr-14">
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium max-w-2xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-12 md:mt-20 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
            Staat jouw vraag er niet bij?
          </p>
          <a
            href="https://wa.me/31637404577"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            <MessageCircle size={14} />
            Stel je vraag via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
