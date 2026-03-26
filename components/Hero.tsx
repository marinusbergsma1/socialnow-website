
import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { Star } from 'lucide-react';
import { GlassEffect } from './ui/liquid-glass';

interface HeroProps {
  startAnimation: boolean;
  onOpenBooking?: () => void;
}

const reviewsData = [
  {
    name: "Niels Groen",
    handle: "RAVEG",
    image: `${import.meta.env.BASE_URL}images/Niels-Groen.webp`
  },
  {
    name: "Albert Deltour",
    handle: "LIGHT ART COLLECTION",
    image: `${import.meta.env.BASE_URL}images/66ed2e6a48aae627d6698e31-Albert-Deltour.webp`
  },
  {
    name: "Hussein Awqati",
    handle: "DIVINE MACHINES",
    image: `${import.meta.env.BASE_URL}images/Hussein.webp`
  }
];

const words = [
  { text: "AUTOMATION", color: "text-[#25D366]", duration: 4000 },
  { text: "CRM", color: "text-[#25D366]", duration: 2000 },
  { text: "BRANDING", color: "text-[#00A3E0]", duration: 2000 },
  { text: "WEBSITES", color: "text-[#F7E644]", duration: 2000 },
  { text: "ADVERTISEMENT", color: "text-[#F62961]", duration: 2000 },
  { text: "ANALYTICS", color: "text-[#00A3E0]", duration: 2000 },
  { text: "GROWTH", color: "text-[#25D366]", duration: 2000 }
];

// Binary decode effect: shows 0s and 1s that resolve into the real text
const BinaryReveal: React.FC<{ text: string }> = ({ text }) => {
  const [chars, setChars] = useState<string[]>(text.split('').map(c => c === ' ' ? ' ' : Math.random() > 0.5 ? '1' : '0'));
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    text.split('').forEach((char, i) => {
      if (char === ' ') return;
      // Each character resolves after a staggered delay
      const delay = 800 + i * 120 + Math.random() * 200;
      // Intermediate flicker
      const flicker1 = setTimeout(() => {
        setChars(prev => { const next = [...prev]; next[i] = Math.random() > 0.5 ? '1' : '0'; return next; });
      }, delay * 0.4);
      const flicker2 = setTimeout(() => {
        setChars(prev => { const next = [...prev]; next[i] = Math.random() > 0.5 ? '1' : '0'; return next; });
      }, delay * 0.7);
      const resolve = setTimeout(() => {
        setChars(prev => { const next = [...prev]; next[i] = char; return next; });
      }, delay);
      timers.push(flicker1, flicker2, resolve);
    });
    // Mark fully resolved
    const final = setTimeout(() => setResolved(true), 800 + text.length * 120 + 300);
    timers.push(final);
    return () => timers.forEach(clearTimeout);
  }, [text]);

  return (
    <span className="inline-flex">
      {chars.map((c, i) => {
        const isReal = c === text[i];
        return (
          <span
            key={i}
            className={`inline-block transition-all duration-300 ${
              c === ' ' ? 'w-[0.3em]' : ''
            } ${isReal ? 'text-[#25D366]' : 'text-[#25D366]/40 font-mono'}`}
            style={!isReal ? { textShadow: '0 0 8px rgba(37,211,102,0.6)' } : {}}
          >
            {c}
          </span>
        );
      })}
    </span>
  );
};

const Hero: React.FC<HeroProps> = ({ startAnimation, onOpenBooking }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const wordIndexRef = useRef(0);
  const [showCycle, setShowCycle] = useState(false);
  const [showCycleQuote, setShowCycleQuote] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  // Small delay so fade-in is visible even when loader is skipped (return visits)
  const [animReady, setAnimReady] = useState(false);
  useEffect(() => {
    if (!startAnimation) return;
    const t = setTimeout(() => setAnimReady(true), 50);
    return () => clearTimeout(t);
  }, [startAnimation]);

  useEffect(() => {
    if (!startAnimation) return;

    let intervalId: ReturnType<typeof setTimeout>;
    let quoteTimers: ReturnType<typeof setTimeout>[] = [];

    const startTimeout = setTimeout(() => {
      setShowCycle(true);

      const scheduleCycle = () => {
        const currentDuration = words[wordIndexRef.current].duration;
        intervalId = setTimeout(() => {
          setShowCycleQuote(false);
          const t1 = setTimeout(() => {
            const nextIndex = (wordIndexRef.current + 1) % words.length;
            wordIndexRef.current = nextIndex;
            setWordIndex(nextIndex);
            const t2 = setTimeout(() => setShowCycleQuote(true), 300);
            quoteTimers.push(t2);
            scheduleCycle();
          }, 300);
          quoteTimers.push(t1);
        }, currentDuration);
      };
      scheduleCycle();

      const initQuote = setTimeout(() => setShowCycleQuote(true), 300);
      quoteTimers.push(initQuote);
    }, 200);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(intervalId);
      quoteTimers.forEach(clearTimeout);
    };
  }, [startAnimation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviewsData.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[100svh] flex flex-col justify-center select-none overflow-hidden bg-transparent">
      {/* Background Decor — desktop only */}
      <div
        className="hidden md:block absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)'
        }}
      ></div>

      <section className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center">

          <div className={`transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`}>
             {/* Liquid glass badge — desktop uses glass effect, mobile uses simple bg */}
             <div className="inline-flex mb-8 md:mb-10">
               <GlassEffect className="hidden md:inline-flex items-center gap-3 px-6 py-2.5 rounded-full hover:border-[#00A3E0]/50 transition-colors cursor-default">
                 <div className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute h-full w-full rounded-full bg-[#25D366] opacity-75" aria-hidden="true"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                 </div>
                 <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white">ACTIE LOOPT TOT EIND MAART 2026</span>
               </GlassEffect>
               {/* Mobile fallback — no glass */}
               <div className="md:hidden inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full">
                 <div className="relative flex h-2.5 w-2.5">
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">ACTIE LOOPT TOT EIND MAART 2026</span>
               </div>
             </div>
          </div>

          <div className={`w-full max-w-[1400px] transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.1s' }}>
              <h1 className="font-black uppercase tracking-tighter text-white leading-[0.85] text-center">
                <div className="block text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[5.5rem] xl:text-[6.5rem]">
                  <span className="text-[#F7E644]">"</span> THE NEXT
                </div>
                <div className="block text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[5.5rem] xl:text-[6.5rem]">
                  GENERATION OF
                </div>
                {/* Cycling word — same size, clean alignment */}
                <div className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[5.5rem] xl:text-[6.5rem]">
                  <div className="relative inline-flex items-center h-[1.1em]">
                    {showCycle ? (
                      <span key={wordIndex} className={`${words[wordIndex].color} animate-fade-in-right transition-colors duration-1000`}>
                        {words[wordIndex].text}
                      </span>
                    ) : (
                      <span className="opacity-0">AUTOMATION</span>
                    )}
                  </div>
                  <span className="text-[#F7E644]"> "</span>
                </div>
              </h1>
          </div>

          <div className={`transition-all duration-700 mt-6 md:mt-14 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.3s' }}>
            <p className="text-sm md:text-lg font-black uppercase tracking-[0.15em] text-white/80">
              HUMAN CREATIVITY POWERED BY{' '}
              <BinaryReveal text="AI TECHNOLOGY" />
            </p>
          </div>

          <p className={`max-w-2xl mx-auto text-gray-400 text-sm md:text-xl mb-6 md:mb-8 font-medium leading-relaxed px-6 mt-6 md:mt-8 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.5s' }}>
            Ontvang een <span className="text-white font-black">gratis live website demo</span> én <span className="text-white font-black">20 creatives of ads</span> — zonder aanbetaling. Wij zoeken 5 bedrijven in Q2 die klaar zijn voor AI. Plan een call en bewijs dat jij er één van bent.
          </p>

          <div className={`flex flex-col sm:flex-row items-center gap-4 md:gap-6 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.7s' }}>
            <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="relative !px-8 md:!px-12 text-sm md:text-lg md:shadow-[0_20px_60px_rgba(37,211,102,0.3)]">
              CLAIM JE GRATIS CONTENT
            </Button>
            <Button variant="outline" icon onClick={onOpenBooking} className="relative !px-8 md:!px-12 text-sm md:text-lg !border-[#00A3E0]/50 hover:!border-[#00A3E0] !text-[#00A3E0]">
              GRATIS WEBSITE DEMO
            </Button>
          </div>

          <p className={`text-white/30 text-xs font-bold uppercase tracking-widest mt-4 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.8s' }}>
            <button onClick={onOpenBooking} className="hover:text-[#25D366] transition-colors cursor-pointer">Plan een gratis call →</button>
          </p>

          <div className={`flex flex-col items-center gap-6 mt-10 md:mt-12 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.9s' }}>
            <div onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-6 cursor-pointer group pb-4 scale-90 md:scale-100">
               <div className="bg-black/90 md:backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-6 py-2 md:shadow-2xl transition-colors duration-700 group-hover:border-white/30 flex items-center gap-2 md:gap-4 max-w-[95vw] md:max-w-none">
                  <div className="flex -space-x-3 shrink-0">
                    {reviewsData.map((review, i) => (
                      <div key={i} className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-black overflow-hidden transition-all duration-700 ${activeReviewIndex === i ? 'scale-110 z-10 border-[#00A3E0] md:shadow-[0_0_20px_rgba(0,163,224,0.4)]' : 'opacity-40 grayscale scale-90'}`}>
                        <img src={review.image} alt={review.name} width={48} height={48} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                      </div>
                    ))}
                  </div>
                  <div className="h-4 w-[1px] bg-white/20 shrink-0"></div>
                  <div className="flex flex-col items-start justify-center h-full">
                    <p className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs leading-none">
                      {reviewsData[activeReviewIndex].name}
                    </p>
                    <p className="text-[#00A3E0] font-bold uppercase tracking-widest text-[8px] md:text-[9px] leading-none mt-1 opacity-80">
                      {reviewsData[activeReviewIndex].handle}
                    </p>
                  </div>
               </div>

               <div className="bg-black/90 md:backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 md:shadow-2xl flex items-center gap-4 group cursor-pointer hover:border-white/40 transition-colors">
                  <div className="flex text-[#F7E644]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <div className="h-4 w-[1px] bg-white/20"></div>
                  <p className="text-white font-black uppercase tracking-widest text-[10px] md:text-[11px]">
                    4.9/5 <span className="text-white/40 mx-2">|</span> 50+ PROJECTEN <span className="text-white/40 mx-2">|</span> LEES REVIEWS
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${animReady ? 'opacity-30' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent animate-bounce"></div>
      </div>
    </div>
  );
};

export default Hero;
