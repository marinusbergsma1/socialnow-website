
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Terminal, Activity } from 'lucide-react';
import Button from './Button';

const faqs = [
  {
    id: "DATA_01",
    question: "Wat kost een rebranding traject gemiddeld?",
    answer: "Elk traject is maatwerk. Een high-end rebranding start doorgaans vanaf €2.500. Dit omvat volledige merkstrategie, visuele identiteit, typografie en uitgebreide Brand OS guidelines voor alle kanalen."
  },
  {
    id: "DATA_02",
    question: "Hoe integreert SocialNow AI in het proces?",
    answer: "Wij gebruiken AI als 'multiplier'. Van neurale heatmapping voor design-validatie tot AI-gedreven copywriting en predictive analytics om de effectiviteit van visuals te testen voordat ze live gaan."
  },
  {
    id: "DATA_03",
    question: "Wat is de gemiddelde doorlooptijd?",
    answer: "Een intensieve rebranding duurt gemiddeld 4 tot 8 weken. We werken in 'sprints' om de snelheid hoog te houden zonder in te leveren op de brute kwaliteit waar we om bekend staan."
  },
  {
    id: "DATA_04",
    question: "Werken jullie ook met maandelijkse retainers?",
    answer: "Zeker. Voor merken die continu willen domineren bieden we 'Brand Management' pakketten aan. Hierbij fungeren we als jullie externe creative department voor design, content en marketing."
  },
  {
    id: "DATA_05",
    question: "Welke data gebruiken jullie voor design?",
    answer: "We analyseren markttrends, consumentengedrag en concurrentie-data. Door deze inzichten te combineren met brute creativiteit, bouwen we merken die niet alleen mooi zijn, maar ook converteren."
  },
  {
    id: "DATA_06",
    question: "Hoe ziet het kennismakingsproces eruit?",
    answer: "We starten altijd met een Deep Dive sessie. Hierin analyseren we de huidige status van je merk en de rauwe ambitie. Na deze sessie ontvang je een op maat gemaakt voorstel voor jouw 'Next Gen' merk."
  }
];

interface FAQProps {
  onOpenContact?: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onOpenContact }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="pt-12 md:pt-48 pb-8 md:pb-20 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Title Section with Consistent Quote Placement */}
        <div className="relative mb-12 md:mb-32 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
            <HelpCircle size={14} className="text-[#F7E644]" />
            <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">Knowledge Base // FAQ</span>
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black uppercase text-white tracking-tighter leading-none text-center max-w-5xl flex flex-wrap justify-center items-center">
            <span className="inline-flex items-center whitespace-nowrap">
              <span className="text-[#F7E644] mr-4 md:mr-8 drop-shadow-[0_0_20px_rgba(247,230,68,0.4)]">"</span>
              VRAGEN
            </span>
            <span className="mx-2 md:mx-4">&</span>
            <span className="inline-flex items-center whitespace-nowrap">
              ANTWOORDEN
              <span className="text-[#F7E644] ml-4 md:ml-8 drop-shadow-[0_0_20px_rgba(247,230,68,0.4)]">"</span>
            </span>
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-20 items-start">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`
                rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-700 overflow-hidden h-fit
                ${openIndex === index 
                  ? 'bg-black/90 border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.05)]' 
                  : 'bg-zinc-950/80 border-white/10 hover:border-white/30 shadow-2xl'
                }
              `}
            >
              <button 
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 md:p-12 text-left group"
              >
                <div className="flex flex-col gap-4 md:gap-6">
                   {/* Spacing (gap-4) for the node ID as requested */}
                   <div className="flex items-center gap-3 md:gap-4 opacity-40">
                      <Terminal size={12} className="text-[#61F6FD]" />
                      <span className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-white uppercase">{faq.id}</span>
                   </div>
                   <span className={`text-lg md:text-2xl font-black uppercase tracking-tighter transition-colors duration-300 leading-tight ${openIndex === index ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 border border-white/10 shrink-0 ml-4 md:ml-6 ${openIndex === index ? 'bg-[#61F6FD] text-black rotate-180' : 'bg-white/5 text-white group-hover:bg-white/10'}`}>
                   <ChevronDown size={20} />
                </div>
              </button>
              
              <div 
                className={`transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] px-8 md:px-12 ${
                  openIndex === index ? 'max-h-[600px] pb-10 md:pb-12 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
                }`}
              >
                <div className="h-[1px] w-full bg-white/10 mb-8 md:mb-10"></div>
                <div className="flex items-start gap-4 md:gap-6">
                    <Activity size={18} className="text-[#25D366] shrink-0 mt-1 md:mt-1.5 opacity-40" />
                    <p className="text-gray-300 leading-relaxed text-sm md:text-xl font-bold italic">
                      "{faq.answer}"
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in-up">
            <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-[11px]">Heb je een andere vraag?</p>
            <Button 
                variant="outline" 
                icon 
                onClick={onOpenContact} 
                className="!h-[54px] md:!h-[64px] !text-xs md:!text-sm px-10 md:px-12 group"
            >
                Stel je vraag direct
            </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
