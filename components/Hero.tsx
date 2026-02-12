
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Star } from 'lucide-react';
import ScrollTypewriter from './ScrollTypewriter';
import BinaryTagline from './BinaryTagline';
import { PixelGlobe } from './PixelGlobe';

interface HeroProps {
  startAnimation: boolean;
  onOpenBooking?: () => void;
}

const reviewsData = [
  {
    name: "Niels Groen",
    handle: "RAVEG",
    image: "https://i.ibb.co/mFGckZkS/Niels-Groen.webp"
  },
  {
    name: "Albert Deltour",
    handle: "LIGHT ART COLLECTION",
    image: "https://i.ibb.co/FbghZnyG/66ed2e6a48aae627d6698e31-Albert-Deltour.webp"
  },
  {
    name: "Hussein Awqati",
    handle: "DIVINE MACHINES",
    image: "https://i.ibb.co/xKKZT9Fg/Hussein.webp"
  }
];

const words = [
  { text: "BRANDING", color: "text-[#25D366]" },
  { text: "DESIGN", color: "text-[#61F6FD]" },
  { text: "MARKETING", color: "text-[#F7E644]" },
  { text: "STRATEGY", color: "text-[#F62961]" },
  { text: "AI", color: "text-[#61F6FD]" }
];

const Hero: React.FC<HeroProps> = ({ startAnimation, onOpenBooking }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [showCycle, setShowCycle] = useState(false);
  const [showCycleQuote, setShowCycleQuote] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    if (startAnimation) {
      const startTimeout = setTimeout(() => {
        setShowCycle(true);
        const interval = setInterval(() => {
          setShowCycleQuote(false);
          setTimeout(() => {
            setWordIndex(prev => (prev + 1) % words.length);
            setTimeout(() => setShowCycleQuote(true), 300);
          }, 300);
        }, 2000);

        setTimeout(() => setShowCycleQuote(true), 300);

        return () => clearInterval(interval);
      }, 600);
      return () => clearTimeout(startTimeout);
    }
  }, [startAnimation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviewsData.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[100svh] flex flex-col justify-center select-none overflow-hidden bg-transparent">
      {/* PixelGlobe Background - beeldmerk */}
      {startAnimation && (
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-30">
          <PixelGlobe
            scaleMultiplier={0.5}
            type="all"
            opacity={0.6}
            entranceAnimation={true}
            glowEnabled={true}
            largeParticles={true}
          />
        </div>
      )}

      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 100%)'
        }}
      ></div>

      <section className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center">

          <div className={`transition-all duration-700 ${startAnimation ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`}>
             <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-2.5 rounded-full mb-8 md:mb-10 hover:border-[#61F6FD]/50 transition-colors">
               <div className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
               </div>
               <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white">BEREIKBAAR VOOR Q1 2026</span>
             </div>
          </div>

          <div className="w-full max-w-[1600px]">
              <h1 className="font-black uppercase tracking-tighter text-white leading-[0.85]">
                {/* THE NEXT */}
                <div className="text-[2rem] sm:text-5xl md:text-7xl lg:text-[8rem] xl:text-[9rem] flex items-center justify-center gap-2 md:gap-4">
                  <span className="text-[#F7E644]">"</span>
                  <ScrollTypewriter text='THE NEXT' delay={100} start={startAnimation} withHighlight={false} />
                </div>
                {/* GENERATION */}
                <div className="text-[2.5rem] sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[11rem] flex justify-center">
                  <ScrollTypewriter text="GENERATION" delay={400} start={startAnimation} withHighlight={false} />
                </div>
                {/* OF + cycling word */}
                <div className="text-[2rem] sm:text-5xl md:text-7xl lg:text-[8rem] xl:text-[9rem]">
                  <div className="flex items-center justify-center">
                    <ScrollTypewriter text="OF" delay={800} start={startAnimation} withHighlight={false} />
                    <div className="relative inline-flex items-center h-[1.1em] ml-2 md:ml-10">
                      {showCycle ? (
                        <span key={wordIndex} className={`${words[wordIndex].color} animate-fade-in-right transition-colors duration-1000 flex items-center drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]`}>
                          {words[wordIndex].text}
                          <span className={`text-[#F7E644] ml-2 md:ml-6 transition-all duration-700 ${showCycleQuote ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            "
                          </span>
                        </span>
                      ) : (
                        <span className="opacity-0">BRANDING</span>
                      )}
                    </div>
                  </div>
                </div>
              </h1>
          </div>

          <div className={`transition-all duration-1000 mt-4 md:mt-14 ${startAnimation ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '1.2s' }}>
            <BinaryTagline />
          </div>

          <p className={`max-w-3xl mx-auto text-gray-400 text-sm md:text-2xl mb-10 md:mb-16 font-medium leading-relaxed px-6 transition-all duration-1000 ${startAnimation ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '1.4s' }}>
            Wij bouwen websites, applicaties en digitale projecten met AI als fundament. <span className="text-white font-black italic">Voor bedrijven die de toekomst vormgeven.</span>
          </p>

          <div className={`flex flex-col items-center gap-10 md:gap-12 transition-all duration-1000 ${startAnimation ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-6'}`} style={{ animationDelay: '1.6s' }}>
            <div className="relative group">
                <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="relative !px-12 text-sm md:text-xl shadow-[0_20px_60px_rgba(37,211,102,0.3)]">START JOUW PROJECT</Button>
            </div>

            <div onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-6 cursor-pointer group pb-4 scale-90 md:scale-100">
               <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-6 py-2 shadow-2xl transition-all duration-700 group-hover:border-white/30 flex items-center gap-2 md:gap-4 max-w-[95vw] md:max-w-none">
                  <div className="flex -space-x-3 shrink-0">
                    {reviewsData.map((review, i) => (
                      <div key={i} className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-black overflow-hidden transition-all duration-700 ${activeReviewIndex === i ? 'scale-110 z-10 border-[#61F6FD] shadow-[0_0_20px_rgba(97,246,253,0.4)]' : 'opacity-40 grayscale scale-90'}`}>
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="h-4 w-[1px] bg-white/20 shrink-0"></div>
                  <div className="flex flex-col items-start justify-center h-full">
                    <p className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs leading-none">
                      {reviewsData[activeReviewIndex].name}
                    </p>
                    <p className="text-[#61F6FD] font-bold uppercase tracking-widest text-[8px] md:text-[9px] leading-none mt-1 opacity-80">
                      {reviewsData[activeReviewIndex].handle}
                    </p>
                  </div>
               </div>

               <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 shadow-2xl flex items-center gap-4 group cursor-pointer hover:border-white/40 transition-all">
                  <div className="flex text-[#F7E644]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <div className="h-4 w-[1px] bg-white/20"></div>
                  <p className="text-white font-black uppercase tracking-widest text-[10px] md:text-[11px]">
                    4.9/5 <span className="text-white/40 mx-2">|</span> LEES REVIEWS
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${startAnimation ? 'opacity-30' : 'opacity-0'}`} style={{ animationDelay: '2.2s' }}>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent animate-bounce"></div>
      </div>
    </div>
  );
};

export default Hero;
