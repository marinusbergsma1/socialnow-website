
import React, { useRef, useState, useEffect, useMemo } from 'react';
import Button from './Button';
import { Star, ArrowRight, Send } from 'lucide-react';
import ScrollTypewriter from './ScrollTypewriter';

interface ImpressionSectionProps {
  onOpenBooking?: () => void;
  onOpenProject?: () => void;
}

const ImpressionSection: React.FC<ImpressionSectionProps> = ({ onOpenBooking, onOpenProject }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDist = rect.height - viewportHeight;
      if (totalDist <= 0) return;
      let scrollProgress = Math.abs(rect.top) / totalDist;
      scrollProgress = Math.min(Math.max(scrollProgress, 0), 1);
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clipRadius = progress * 150; 
  const realityOpacity = Math.max(0, 1 - (progress * 4));
  const impressionOpacity = Math.max(0, (progress - 0.2) * 3);
  const galleryOpacity = Math.max(0, Math.min(1, (progress - 0.4) * 3));
  const galleryTranslate = Math.max(0, (1 - galleryOpacity) * 100);
  const ctaOpacity = Math.max(0, Math.min(1, (progress - 0.85) * 5));
  const ctaTranslate = Math.max(0, (1 - ctaOpacity) * 50);

  const particles = useMemo(() => {
    return [...Array(50)].map((_, i) => {
        const isStreamer = i % 4 === 0;
        const angle = Math.random() * 360;
        const distance = 150 + Math.random() * 200; 
        const x = Math.cos(angle * (Math.PI / 180)) * distance;
        const y = Math.sin(angle * (Math.PI / 180)) * distance;
        const rotation = Math.random() * 1000; 
        const color = ['#F62961', '#F7E644', '#5BA4F5', '#ffffff'][Math.floor(Math.random() * 4)];
        return { id: i, width: isStreamer ? 4 : 8, height: isStreamer ? 24 : 8, x, y, rotation, color, delay: Math.random() * 0.1 };
    });
  }, []);

  const galleryImages = [
      "https://i.ibb.co/SDKqJK5k/Light-Art-Collection-Artwork.webp", 
      "https://i.ibb.co/RpS1gGDc/Butterfly-Effect-Light-Art-Collection.webp",
      "https://i.ibb.co/HD1xVQK4/Infinita-Light-Art-Collection.webp"
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setRotation({ x: 0, y: 0 });

  return (
    <section ref={sectionRef} className="relative h-[350vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 w-full h-full">
            <img 
               src="https://i.ibb.co/Wv382j1y/Eternal-Sundown-Afbeelding-Before-geconverteerd-van-png-1.webp" 
               className="w-full h-full object-cover filter brightness-[0.6] grayscale-[0.2]" 
               alt="Reality"
               loading="lazy"
               decoding="async"
            />
            <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div 
            className="absolute inset-0 w-full h-full z-10"
            style={{ clipPath: `circle(${clipRadius}% at 50% 50%)` }}
        >
            <img 
               src="https://i.ibb.co/dsDCqX5t/Eternal-Sundown-Afbeelding-After.webp" 
               className="w-full h-full object-cover" 
               alt="Impression"
               loading="lazy"
               decoding="async"
            />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transform transition-all duration-300 ease-out z-20 pointer-events-none" style={{ opacity: realityOpacity, transform: `translate(-50%, -50%) scale(${1 + progress})` }}>
             <span className="text-xs md:text-sm font-bold tracking-[0.5em] text-gray-400 mb-4 block uppercase">The Start</span>
             <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">REALITY</h2>
        </div>

        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-center transform transition-all duration-300 ease-out z-20 pointer-events-none" style={{ opacity: impressionOpacity > 0 && galleryOpacity < 0.5 ? 1 : 0 }}>
             <span className="text-xs md:text-sm font-bold tracking-[0.5em] text-[#F7E644] mb-4 block uppercase animate-pulse">The Vision</span>
             <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-[0_0_35px_rgba(247,230,68,0.5)]">IMAGINATION</h2>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-6xl z-30 transition-all duration-700 ease-out" style={{ opacity: galleryOpacity, transform: `translate(-50%, calc(-50% + ${galleryTranslate}px))` }}>
            {progress > 0.3 && (
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h3 className="text-3xl font-black uppercase text-white mb-2">Light Art Collection</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex text-[#F7E644]">
                                    {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={18} fill="currentColor" strokeWidth={0} />))}
                                </div>
                                <span className="text-gray-400 text-sm font-bold tracking-wider">FEATURED PROJECT</span>
                            </div>
                        </div>
                        <button onClick={onOpenProject} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">Bekijk Project <ArrowRight size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className="rounded-2xl overflow-hidden aspect-video border border-white/5 shadow-lg group relative cursor-pointer" onClick={onOpenProject}>
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="absolute bottom-12 md:bottom-20 pointer-events-auto transition-all duration-700 transform w-[90%] md:w-auto z-50 left-1/2 -translate-x-1/2 perspective-[1000px]" style={{ opacity: ctaOpacity, transform: `translate(-50%, ${ctaTranslate}px)` }}>
             <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="bg-black/90 backdrop-blur-2xl border border-[#F7E644]/50 p-12 md:p-16 rounded-[3rem] text-center max-w-4xl mx-auto shadow-[0_0_80px_rgba(247,230,68,0.15)] flex flex-col items-center relative overflow-hidden transition-transform duration-100 ease-out" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#F7E644] opacity-[0.05] blur-3xl pointer-events-none"></div>
                 <div className="flex text-[#F7E644] mb-6 relative z-10 drop-shadow-[0_0_10px_rgba(247,230,68,0.5)] gap-1">
                    {[1, 2, 3, 4, 5].map((s, i) => (<Star key={s} size={24} fill="currentColor" strokeWidth={0} className="animate-[fadeInUp_0.5s_ease-out_both]" style={{ animationDelay: `${i * 0.1}s` }} />))}
                 </div>
                 <div className="mb-12 relative z-10"><ScrollTypewriter text="Let's Get SocialNow!" className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter drop-shadow-2xl" withHighlight={true} /></div>
                 <div className="relative group inline-block z-10 p-2">
                    <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none z-0">
                        {particles.map((p) => (
                            <div key={p.id} className="absolute top-0 left-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-0 transition-all duration-[800ms] ease-out" style={{ width: `${p.width}px`, height: `${p.height}px`, backgroundColor: p.color, transform: 'translate(-50%, -50%)' }}>
                                <div className="absolute top-0 left-0 w-full h-full rounded-sm opacity-0 transition-all duration-[1000ms] ease-out group-hover:opacity-0 group-hover:scale-50" style={{ backgroundColor: p.color, width: p.width, height: p.height, transform: 'translate(0, 0) rotate(0deg) scale(1)', transitionDelay: `${p.delay}s`, ['--tx' as string]: `${p.x}px`, ['--ty' as string]: `${p.y}px`, ['--rot' as string]: `${p.rotation}deg` }} />
                            </div>
                        ))}
                    </div>
                    <Button variant="green" icon={true} IconComponent={Send} onClick={onOpenBooking}>LANCEER JOUW SUCCES</Button>
                 </div>
             </div>
        </div>

        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-32 w-1 bg-white/10 rounded-full z-30 overflow-hidden hidden md:block">
            <div className="w-full bg-[#F7E644] rounded-full shadow-[0_0_10px_#F7E644]" style={{ height: `${progress * 100}%` }}></div>
        </div>
      </div>
    </section>
  );
};

export default ImpressionSection;
