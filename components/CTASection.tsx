
import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { PieChart } from 'lucide-react';
import { PixelGlobe } from './PixelGlobe';

interface CTASectionProps {
  onOpenBooking: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onOpenBooking, onVisibilityChange }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
        }
        onVisibilityChange?.(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  return (
    <section 
      ref={sectionRef} 
      className={`pt-12 pb-24 md:pt-24 md:pb-36 bg-transparent relative overflow-visible transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hasRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Main Simplified CTA Card */}
        <div className="flex justify-center overflow-visible">
            <div className="w-full max-w-5xl bg-[#050505]/40 border border-white/10 rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 relative overflow-visible group shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#61F6FD]/5 via-transparent to-[#F62961]/5 opacity-40 rounded-[3rem] md:rounded-[4rem]"></div>
              
              {/* PixelGlobe Beeldmerk */}
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-20 pointer-events-none">
                <PixelGlobe scaleMultiplier={0.45} type="all" opacity={0.8} glowEnabled={true} largeParticles={true} />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 overflow-visible">

                  {/* Text Content */}
                  <div className="flex-1 text-center md:text-left z-30">
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                          <PieChart size={14} className="text-[#25D366]" />
                          <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">READY TO SYNC?</span>
                      </div>
                      
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-8">
                          LET'S GET <br/> <span className="text-[#25D366]">SOCIALNOW</span>
                      </h2>
                      
                      <p className="text-gray-400 font-bold text-lg md:text-xl leading-tight mb-10 max-w-lg mx-auto md:mx-0 italic">
                        "Ontdek wat AI-powered development voor jouw project kan betekenen. Van idee tot lancering, wij bouwen de toekomst."
                      </p>

                      <div className="flex justify-center md:justify-start">
                        <Button 
                          variant="green" 
                          icon={true} 
                          onClick={onOpenBooking} 
                          triggerOnHover
                          className="shadow-[0_0_30px_rgba(37,211,102,0.25)]"
                        >
                          START JOUW PROJECT
                        </Button>
                      </div>
                  </div>
                  
              </div>
            </div>
        </div>
      </div>

    </section>
  );
};

export default CTASection;
