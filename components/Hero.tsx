
import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { Star, Handshake } from 'lucide-react';
import MiloHeaderShow, { useMiloShow } from './MiloHeaderShow';
import GenerateButton from './GenerateButton';

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

const Hero: React.FC<HeroProps> = ({ startAnimation, onOpenBooking }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const wordIndexRef = useRef(0);
  const [showCycle, setShowCycle] = useState(false);
  const [showCycleQuote, setShowCycleQuote] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  // Milo header-show: slapende Milo + Genereer-knop vóór de hero-content
  const { phase, setPhase, finish } = useMiloShow();
  const showDone = phase === 'done';
  // Speelde de show in deze page-load? Dan staat de headline al (uit de show) en slaat de h1 zijn fade over
  const playedRef = useRef(false);
  if (phase === 'playing') playedRef.current = true;

  // Small delay so fade-in is visible even when loader is skipped (return visits)
  const [animReady, setAnimReady] = useState(false);
  useEffect(() => {
    if (!startAnimation || !showDone) return;
    const t = setTimeout(() => setAnimReady(true), 50);
    return () => clearTimeout(t);
  }, [startAnimation, showDone]);

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
      {/* Milo header-show overlay — 1× per sessie */}
      {startAnimation && (
        <MiloHeaderShow phase={phase} onStart={() => setPhase('playing')} onFinish={finish} />
      )}
      {/* Background Decor — desktop only */}

      <section className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center">

          <div className={`transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`}>
             {/* Live-badge (opaque zodat de achtergrond-orb er niet overheen valt) */}
             <div id="hero-live-badge" className="inline-flex mb-8 md:mb-10">
               <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0e0e12] border border-white/10">
                 <div className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute h-full w-full rounded-full bg-[#25D366] opacity-75" aria-hidden="true"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                 </div>
                 <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">LIVE · SINDS 2021</span>
               </div>
             </div>
          </div>

          <div id="hero-headline" className={`w-full max-w-[1400px] ${playedRef.current ? '' : `transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`}`} style={playedRef.current ? undefined : { animationDelay: '0.1s' }}>
              <h1 className="sn-vhs font-black uppercase tracking-tighter text-white leading-[1.08] text-center">
                <div className="block text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5.5rem]">
                  JE WEBSITE, CRM,
                </div>
                <div className="block text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5.5rem]">
                  CONTENT &amp; ADS
                </div>
                <div className="block text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5.5rem] text-[#25D366]">
                  IN ÉÉN AI CHAT.
                </div>
              </h1>
          </div>

          <div className={`flex justify-center transition-all duration-700 mt-8 md:mt-12 mb-2 md:mb-4 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.3s' }}>
            <GenerateButton
              text="Let's meet"
              morphText="Let's meet"
              icon={<Handshake strokeWidth={2.25} />}
              onClick={onOpenBooking}
              className="text-lg md:text-2xl"
            />
          </div>

          <p className={`max-w-2xl mx-auto text-gray-400 text-sm md:text-xl mb-6 md:mb-8 font-medium leading-relaxed px-6 mt-6 md:mt-8 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.5s' }}>
            Start met een <span className="text-white font-black">gratis proof of concept</span>: een complete <span className="text-white font-black">website demo</span> én <span className="text-white font-black">rebranding</span>. Je ziet het werken vóórdat je iets betaalt.
          </p>

          <div className={`flex flex-col sm:flex-row items-center gap-4 md:gap-6 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.7s' }}>
            <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="relative !px-5 md:!px-7 text-sm md:text-lg md:shadow-[0_20px_60px_rgba(37,211,102,0.3)]">
              CLAIM JE GRATIS PROOF OF CONCEPT
            </Button>
          </div>

          <p className={`text-white/30 text-xs font-bold uppercase tracking-widest mt-4 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.8s' }}>
            <button onClick={onOpenBooking} className="hover:text-[#25D366] transition-colors cursor-pointer">Plan een gratis call →</button>
          </p>

          <div className={`flex flex-col items-center gap-6 mt-10 md:mt-12 transition-all duration-700 ${animReady ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '0.9s' }}>
            {/* Geen scale-utilities op deze wrapper: ook scale-100 is een blijvende
                transform en zou de pills hun backdrop (globe) afnemen */}
            <div onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-6 cursor-pointer group pb-4">
               <div className="sn-warp-tile rounded-full px-4 md:px-6 py-2 md:shadow-2xl transition-colors duration-700 group-hover:border-white/30 flex items-center gap-2 md:gap-4 max-w-[95vw] md:max-w-none">
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

               <div className="sn-warp-tile rounded-full px-8 py-3 md:shadow-2xl flex items-center gap-4 group cursor-pointer hover:border-white/40 transition-colors">
                  <div className="flex text-[#F7E644]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <div className="h-4 w-[1px] bg-white/20"></div>
                  <p className="text-white font-black uppercase tracking-widest text-[10px] md:text-[11px]">
                    4.9/5 <span className="text-white/40 mx-2">|</span> 500+ PROJECTEN <span className="text-white/40 mx-2">|</span> LEES REVIEWS
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
