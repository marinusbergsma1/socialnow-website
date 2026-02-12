
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, SearchCode, Cpu, Volume2, Database, Globe, ExternalLink } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import ProgressiveImage from './ProgressiveImage';
import Button from './Button';
import { useVideoIntersection } from '../hooks/useVideoIntersection';
import { featuredProjects as projects } from '../data/projects';

const accentColors = ['#61F6FD', '#F62961', '#F7E644', '#25D366'];

// Lazy video component for featured sections
const LazyVideo: React.FC<{
  src: string;
  isHovered: boolean;
  className?: string;
}> = ({ src, isHovered, className = "" }) => {
  const { containerRef, videoRef, hasLoadedOnce } = useVideoIntersection(src, {
    rootMargin: '300px',
    threshold: 0.1,
    autoPlay: true,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isHovered;
    if (isHovered) {
      video.play().catch(() => {});
    }
  }, [isHovered, videoRef]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {!hasLoadedOnce && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/10 border-t-[#61F6FD] rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

// Lazy gallery video for case study cards
const LazyGalleryVideo: React.FC<{ src: string }> = ({ src }) => {
  const { containerRef, videoRef, hasLoadedOnce } = useVideoIntersection(src, {
    rootMargin: '200px',
    threshold: 0.1,
    autoPlay: true,
  });

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {!hasLoadedOnce && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <div className="w-4 h-4 border border-white/10 border-t-white/40 rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const ProjectShowcase: React.FC<{ onOpenBooking?: () => void; }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();
  const [webdesignScale, setWebdesignScale] = useState(0.85);
  const [betcityScale, setBetcityScale] = useState(0.85);
  const [lacScale, setLacScale] = useState(0.85);

  const [showAll, setShowAll] = useState(false);

  const [isWebdesignHovered, setIsWebdesignHovered] = useState(false);
  const [isBetcityHovered, setIsBetcityHovered] = useState(false);

  const webdesignRef = useRef<HTMLDivElement>(null);
  const betcityRef = useRef<HTMLDivElement>(null);
  const lacRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const updateScale = (ref: React.RefObject<HTMLDivElement | null>, setScale: (s: number) => void) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const center = viewportHeight / 2;
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(center - elementCenter);
          let newScale = 1.05 - (distance / viewportHeight) * 0.25;
          setScale(Math.max(0.85, Math.min(newScale, 1.05)));
        };

        updateScale(webdesignRef, setWebdesignScale);
        updateScale(betcityRef, setBetcityScale);
        updateScale(lacRef, setLacScale);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openProject = (slug: string) => {
    navigate(`/project/${slug}`);
  };

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="projecten" className="bg-transparent pt-12 md:pt-36 pb-2 md:pb-10 relative overflow-hidden">
      {/* Background technical lines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="white" strokeWidth="0.5" strokeDasharray="5,15" />
              <line x1="0" y1="40%" x2="100%" y2="40%" stroke="white" strokeWidth="0.5" strokeDasharray="5,15" />
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="white" strokeWidth="0.5" strokeDasharray="5,15" />
              <line x1="0" y1="80%" x2="100%" y2="80%" stroke="white" strokeWidth="0.5" strokeDasharray="5,15" />
          </svg>
      </div>

      <div className="absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.03] select-none">
        <h2 className="text-[25vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">ARCHIVE</h2>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-full overflow-hidden">
        <div className="flex flex-col items-center mb-12 md:mb-24 text-center relative z-10 scroll-reveal">
           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
             <Cpu size={14} className="text-[#61F6FD]" />
             <span className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">FEATURED WORK</span>
           </div>

           <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.8] relative text-white flex flex-wrap justify-center items-center">
             <span className="inline-flex items-center whitespace-nowrap">
               <span className="text-[#F7E644] mr-2 md:mr-6">"</span>
               FEATURED
             </span>
             <span className="mx-2 md:mx-4">WORK</span>
             <span className="text-[#F7E644]">"</span>
           </h2>
        </div>

        {/* --- HIGHLIGHT 1: NEXT GEN WEBDESIGN --- */}
        <div
          ref={webdesignRef}
          onMouseEnter={() => setIsWebdesignHovered(true)}
          onMouseLeave={() => setIsWebdesignHovered(false)}
          className="relative w-full max-w-6xl mx-auto mb-16 md:mb-40 group cursor-pointer"
        >
          <div className="flex flex-col items-center mb-6 md:mb-10 px-6">
            <div className="text-center flex flex-col items-center">
               <div className="flex items-center gap-3 mb-4 opacity-40">
                  <Globe size={14} className="text-[#61F6FD]" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/60 uppercase">Next Gen Webdesign</span>
               </div>
               <h3 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">
                  Next Gen <span className="text-[#61F6FD]">Webdesign</span>
               </h3>
            </div>
          </div>
          <div className="relative flex justify-center items-center overflow-hidden">
            <div className="relative w-full aspect-video rounded-none overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out bg-black border border-white/5" style={{ transform: `scale(${webdesignScale})` }}>
               <LazyVideo
                 src={`${import.meta.env.BASE_URL}videos/nextgen-webdesign.mp4`}
                 isHovered={isWebdesignHovered}
               />
               <div className={`absolute bottom-4 right-4 md:bottom-8 md:right-8 p-2 md:p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 transition-all duration-500 transform z-20 ${isWebdesignHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}`}>
                <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-[#61F6FD]" />
              </div>
            </div>
          </div>
        </div>

        {/* --- HIGHLIGHT 2: MOTION DESIGN --- */}
        <div
          ref={betcityRef}
          onMouseEnter={() => setIsBetcityHovered(true)}
          onMouseLeave={() => setIsBetcityHovered(false)}
          className="relative w-full max-w-6xl mx-auto mb-16 md:mb-36 group cursor-pointer"
        >
          <div className="flex flex-col items-center mb-6 md:mb-10 px-6">
            <div className="text-center flex flex-col items-center">
               <div className="flex items-center gap-3 mb-4 opacity-40">
                  <Terminal size={14} className="text-[#0071BC]" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/60 uppercase">Motion Design</span>
               </div>
               <h3 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">
                  Motion <span className="text-[#0071BC]">Design</span>
               </h3>
            </div>
          </div>
          <div className="relative flex justify-center items-center overflow-hidden">
            <div className="relative w-full aspect-video rounded-none overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out bg-black border border-white/5" style={{ transform: `scale(${betcityScale})` }}>
              <LazyVideo
                src={`${import.meta.env.BASE_URL}videos/betcity-bumper.mp4`}
                isHovered={isBetcityHovered}
              />
              <div className={`absolute bottom-4 right-4 md:bottom-8 md:right-8 p-2 md:p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 transition-all duration-500 transform z-20 ${isBetcityHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}`}>
                <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-[#0071BC]" />
              </div>
            </div>
          </div>
        </div>

        {/* --- HIGHLIGHT 3: ARTIST IMPRESSIONS --- */}
        <div ref={lacRef} className="relative w-full max-w-6xl mx-auto mb-16 md:mb-36">
          <div className="flex flex-col items-center mb-6 md:mb-10 px-6">
            <div className="text-center flex flex-col items-center">
               <div className="flex items-center gap-3 mb-4 opacity-40">
                  <Database size={14} className="text-[#F7E644]" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/60 uppercase">Artist Impressions</span>
               </div>
               <h3 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">
                  Artist <span className="text-[#F7E644]">Impressions</span>
               </h3>
            </div>
          </div>
          <div className="relative flex justify-center items-center group overflow-hidden">
            <div className="relative w-full transition-all duration-[1200ms] ease-out" style={{ transform: `scale(${lacScale})` }}>
              <BeforeAfterSlider
                beforeImage="https://i.ibb.co/Wv382j1y/Eternal-Sundown-Afbeelding-Before-geconverteerd-van-png-1.webp"
                afterImage="https://i.ibb.co/dsDCqX5t/Eternal-Sundown-Afbeelding-After.webp"
                className="rounded-none shadow-2xl !aspect-video border border-white/5"
              />
            </div>
          </div>
        </div>

        {/* --- GRID OF STUDIES --- */}
        <div className="mt-12 md:mt-24 mb-16 md:mb-24 max-w-6xl mx-auto">
           <div className="flex flex-col items-center mb-12 md:mb-24 text-center scroll-reveal">
               <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
                 <SearchCode size={14} className="text-[#F7E644]" />
                 <span className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">CASE STUDIES</span>
               </div>
               <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.8] relative text-white flex flex-wrap justify-center items-center">
                 <span className="inline-flex items-center whitespace-nowrap">
                    <span className="text-[#F7E644] mr-2 md:mr-6">"</span>
                    CASE
                 </span>
                 <span className="inline-flex items-center whitespace-nowrap ml-2 md:ml-4">
                    STUDIES
                    <span className="text-[#F7E644] ml-2 md:ml-6">"</span>
                 </span>
               </h2>
           </div>

           <div className="flex flex-col gap-6 md:gap-12 mb-12 relative px-2 md:px-0">
              {visibleProjects.map((project, idx) => {
                const color = accentColors[idx % accentColors.length];
                const stickyTop = 100 + (idx * 30);

                return (
                  <div
                    key={project.id}
                    className="sticky w-full group transition-all duration-500"
                    style={{ top: `${stickyTop}px` }}
                  >
                    <div
                      className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center relative z-10 bg-[#0a0a0a]/98 backdrop-blur-3xl border rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-2xl overflow-hidden transition-all duration-500 hover:border-white/20`}
                      style={{ borderColor: `${color}4d` }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-white/5 opacity-30 pointer-events-none"></div>

                      {/* Project Media */}
                      <div className="w-full lg:w-[55%] relative z-10 cursor-pointer" onClick={() => openProject(project.slug)}>
                        <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-xl transition-transform duration-700 bg-black/40 backdrop-blur-xl group-hover:scale-[1.01] h-auto">
                          <div className="w-full flex flex-col p-2 md:p-4 gap-2 md:gap-4 h-auto">
                            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg relative bg-black/20">
                              <ProgressiveImage src={project.image} alt={project.title} className="w-full h-full block" objectFit="cover" />
                            </div>

                            {project.gallery && project.gallery.length > 0 && (
                              <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 h-auto">
                                {project.gallery.slice(0, 3).map((img, i) => (
                                  <div key={i} className="rounded-lg md:rounded-xl overflow-hidden relative border border-white/10 bg-zinc-900 shadow-2xl transition-transform hover:scale-105 aspect-[2/3]">
                                    {img.endsWith('.mp4') ? (
                                      <LazyGalleryVideo src={img} />
                                    ) : (
                                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Project Text */}
                      <div className="w-full lg:w-[45%] flex flex-col justify-center p-5 md:p-10 relative z-20 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mb-3 md:mb-4">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
                          <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase" style={{ color: color }}>
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black uppercase text-white mb-4 md:mb-5 leading-tight tracking-tighter">
                          {project.title}
                        </h3>

                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 md:mb-10">
                          {project.description}
                        </p>

                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#25D366] text-sm font-bold mb-6 hover:underline"
                          >
                            <ExternalLink size={14} />
                            Bekijk live website
                          </a>
                        )}

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6 md:mb-8">
                          {project.services?.map((service, i) => (
                            <span key={i} className="text-[9px] md:text-[11px] uppercase font-bold text-white/50 border border-white/10 px-3 py-1.5 rounded-lg bg-white/[0.03]">
                              {service}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-center lg:justify-start">
                          <Button
                            variant="green"
                            icon
                            onClick={() => openProject(project.slug)}
                            triggerOnHover
                          >
                            BEKIJK DE CASE
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
           </div>

           {!showAll && projects.length > 3 && (
              <div className="flex justify-center mt-12 md:mt-24 scroll-reveal">
                 <Button
                   variant="green"
                   icon
                   onClick={() => setShowAll(true)}
                   triggerOnHover
                 >
                   LOAD MORE
                 </Button>
              </div>
           )}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
