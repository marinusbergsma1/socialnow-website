
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { Terminal, Database, Zap, SearchCode, ArrowRight, Plus, Cpu, Volume2, Activity, Shield, BarChart3, Fingerprint, Globe } from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import ProgressiveImage from './ProgressiveImage';
import Button from './Button';

const projects: Project[] = [
  {
    id: 1,
    title: "Banners & Socials",
    category: "Universal Studios, Sony",
    client: "Universal / Sony Pictures",
    year: "2023 - 2024",
    services: ["Campaign Design", "Social Media", "Digital OOH Media", "Offline Media"],
    description: "Voor diverse filmreleases van UNIVERSAL_NL en SonyPicturesNL ontwikkelden wij geïntegreerde on- en offline campagnes die de bioscooplanceringen direct ondersteunden door meer bezoekers te trekken, de zichtbaarheid van de films te vergroten en het publiek online én offline te enthousiasmeren.",
    image: "https://i.ibb.co/WWZCxsb2/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp", 
    align: 'right', 
    gallery: [
      "https://i.ibb.co/nNb5FYBq/WARNER-FLASH-FRAMES.webp",
      "https://i.ibb.co/d4Xvg2Nd/UNIVERSAL-OPENHEIMER-FRAMES.webp",
      "https://i.ibb.co/mV9FkFZy/UNIVERSAL-NOHARDFEELINGS-FRAMES.webp"
    ]
  },
  {
    id: 5,
    title: "Social Artworks",
    category: "Voetbalclub AZ",
    client: "AZ Alkmaar",
    year: "Ongoing",
    services: ["Social Media Design", "Webvisuals", "Campaign Design", "UX/UI Visuals", "Branding"],
    description: "Voor AZ ontwierpen wij diverse socialmediaposts en websitevisuals, waaronder dankuitingen voor spelers, wedstrijdwijzigingen en campagnes voor de jeugdteams. Daarnaast ontwikkelden we nieuwe headers en home-achtergronden voor de spelerspagina’s op AZ.nl.",
    image: "https://i.ibb.co/GQqxQHmz/AZ-Champions-Leageu-Header.webp",
    align: 'right',
    gallery: [
      "https://i.ibb.co/HDnNddpm/header-Bouadu-v2-2.webp",
      "https://i.ibb.co/BKYLR4wG/AZ-25-K-Volgers-Post.webp",
      "https://i.ibb.co/RkHCGbNS/AZ-Boadu-Bedankt-Post.webp"
    ]
  },
  {
    id: 2,
    title: "Performance Branding",
    category: "RAVEG",
    client: "RAVEG",
    year: "2024",
    services: ["Branding", "Visual Identity", "Webdesign", "Video & Motion Design", "Content Creation"],
    description: "Voor RAVEG ontwikkelden wij de volledige branding vanaf de start, opgebouwd tot een herkenbare en consistente merkidentiteit. Deze werd doorvertaald naar een moderne website en dynamische video- en motion design-content.",
    image: "https://i.ibb.co/yBXWFYqx/RAVEG-Hyperpower.webp",
    align: 'left',
    gallery: [
      "https://storage.googleapis.com/video-slider/RAVEG%20DYADIUM%20STORY.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_2_STORY.mp4",
      "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_4_STORY.mp4"
    ]
  },
  {
    id: 3,
    title: "Content Engine",
    category: "Kids Heroes",
    client: "DAY&NITE",
    year: "2024",
    services: ["Campaign Design", "Social Media", "Digital OOH Media", "Offline Media"],
    description: "Voor Kids Heroes verzorgden wij de complete branding en uitvoering van de campagnes, verspreid over meerdere edities. Van concept en planning tot de doorvertaling naar social media, drukwerk en eventaankleding.",
    image: "https://i.ibb.co/tTCTL6DZ/Slider-Mobiel-Kids-Heroes-Koningshoek-1.webp",
    align: 'right',
    gallery: [
      "https://i.ibb.co/HD1RJt2z/1200x1200-Kids-Heroes-Koningshoek2-1.webp",
      "https://i.ibb.co/LXBkrK52/1200x1200-Kids-Heroes-Koningshoek3-1.webp",
      "https://i.ibb.co/tTCTL6DZ/Slider-Mobiel-Kids-Heroes-Koningshoek-1.webp"
    ]
  },
  {
    id: 4,
    title: "Creative Interieurdesign",
    category: "Print & Bind",
    client: "Print & Bind Amsterdam",
    year: "2023",
    services: ["Brand Activation", "Environmental Design", "Print Design", "Visual Identity", "Signage"],
    description: "Voor Print&Bind verzorgden wij de visuele aankleding en merkdoorvertaling, met als doel de merkidentiteit ook fysiek tot leven te brengen op de werkvloer. Het volledige pand werd voorzien van banners en stickers.",
    image: "https://i.ibb.co/wZwdpDnY/666f15bbb49442553d264e6d-PRINT-BIND.webp",
    align: 'left',
    gallery: [
      "https://i.ibb.co/8D1GLhGM/Bannert.webp",
      "https://i.ibb.co/xSTR7yV9/Meeting-Room-2.webp",
      "https://i.ibb.co/998R1QP8/IMG-1686.webp"
    ]
  }
];

const accentColors = ['#61F6FD', '#F62961', '#F7E644', '#25D366'];

const ProjectShowcase: React.FC<{ onOpenBooking?: () => void; setSelectedIndex: (index: number | null) => void; }> = ({ onOpenBooking, setSelectedIndex }) => {
  const [webdesignScale, setWebdesignScale] = useState(0.85);
  const [betcityScale, setBetcityScale] = useState(0.85);
  const [lacScale, setLacScale] = useState(0.85);
  
  const [showAll, setShowAll] = useState(false);

  const [isWebdesignHovered, setIsWebdesignHovered] = useState(false);
  const [isBetcityHovered, setIsBetcityHovered] = useState(false);

  const webdesignRef = useRef<HTMLDivElement>(null);
  const betcityRef = useRef<HTMLDivElement>(null);
  const lacRef = useRef<HTMLDivElement>(null);
  
  const webdesignVideoRef = useRef<HTMLVideoElement>(null);
  const betcityVideoRef = useRef<HTMLVideoElement>(null);

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

  // Force play for mobile on visibility
  useEffect(() => {
    const videos = [webdesignVideoRef.current, betcityVideoRef.current];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const vid = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
                vid.play().catch(() => {
                    vid.muted = true;
                    vid.play();
                });
            } else {
                vid.pause();
            }
        });
    }, { threshold: 0.2 });

    videos.forEach(v => v && observer.observe(v));
    return () => observer.disconnect();
  }, []);

  // Handle Webdesign Sound on Hover
  useEffect(() => {
    const video = webdesignVideoRef.current;
    if (!video) return;

    video.muted = !isWebdesignHovered;
    if (isWebdesignHovered) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isWebdesignHovered]);

  // Handle Betcity Sound on Hover
  useEffect(() => {
    const video = betcityVideoRef.current;
    if (!video) return;

    video.muted = !isBetcityHovered;
    if (isBetcityHovered) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isBetcityHovered]);

  const openProjectById = (id: number) => {
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      setSelectedIndex(idx);
    }
  };

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="projecten" className="bg-transparent pt-12 md:pt-48 pb-2 md:pb-10 relative overflow-hidden">
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
        <div className="flex flex-col items-center mb-12 md:mb-32 text-center relative z-10 scroll-reveal">
           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
             <Cpu size={14} className="text-[#61F6FD]" />
             <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">CASE STUDY ENGINE // V2.0</span>
           </div>
           
           <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] relative text-white flex flex-wrap justify-center items-center">
             <span className="inline-flex items-center whitespace-nowrap">
               <span className="text-[#F7E644] mr-2 md:mr-6 drop-shadow-[0_0_20px_rgba(247,230,68,0.4)]">"</span>
               FEATURED
             </span>
             <span className="mx-2 md:mx-4">WORK</span>
             <span className="text-[#F7E644] drop-shadow-[0_0_20px_rgba(247,230,68,0.4)]">"</span>
           </h2>
        </div>

        {/* --- HIGHLIGHT 1: NEXT GEN WEBDESIGN --- */}
        <div 
          ref={webdesignRef} 
          onMouseEnter={() => setIsWebdesignHovered(true)}
          onMouseLeave={() => setIsWebdesignHovered(false)}
          className="relative w-full max-w-6xl mx-auto mb-20 md:mb-64 group cursor-pointer"
        >
          <div className="flex flex-col items-center mb-6 md:mb-10 px-6">
            <div className="text-center flex flex-col items-center">
               <div className="flex items-center gap-3 mb-4 opacity-40">
                  <Globe size={14} className="text-[#61F6FD]" />
                  <span className="text-[10px] font-mono tracking-[0.5em] text-white uppercase">ID_WEB_NEXT_GEN</span>
               </div>
               <h3 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                  Next Gen <span className="text-[#61F6FD]">Webdesign</span>
               </h3>
            </div>
          </div>
          <div className="relative flex justify-center items-center overflow-hidden">
            <div className="relative w-full aspect-video rounded-none overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out bg-black border border-white/5" style={{ transform: `scale(${webdesignScale})` }}>
               <video 
                  ref={webdesignVideoRef}
                  src="https://storage.googleapis.com/socialnow_branding/SocialNow%20NEXT%20GEN%20WEBDESIGN.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-contain"
               />
               <div className={`absolute bottom-4 right-4 md:bottom-8 md:right-8 p-2 md:p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 transition-all duration-500 transform ${isWebdesignHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}`}>
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
          className="relative w-full max-w-6xl mx-auto mb-16 md:mb-48 group cursor-pointer"
        >
          <div className="flex flex-col items-center mb-6 md:mb-10 px-6">
            <div className="text-center flex flex-col items-center">
               <div className="flex items-center gap-3 mb-4 opacity-40">
                  <Terminal size={14} className="text-[#0071BC]" />
                  <span className="text-[10px] font-mono tracking-[0.5em] text-white uppercase">ID_BET_MOTION_OS</span>
               </div>
               <h3 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                  Motion <span className="text-[#0071BC]">Design</span>
               </h3>
            </div>
          </div>
          <div className="relative flex justify-center items-center overflow-hidden">
            <div className="relative w-full aspect-video rounded-none overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out bg-black border border-white/5" style={{ transform: `scale(${betcityScale})` }}>
              <video 
                ref={betcityVideoRef}
                src="https://storage.googleapis.com/video-slider/FEATURED/BetCity-branded%20bumper%20ad%20-%20.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-contain"
              />
              <div className={`absolute bottom-4 right-4 md:bottom-8 md:right-8 p-2 md:p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 transition-all duration-500 transform ${isBetcityHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}`}>
                <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-[#0071BC]" />
              </div>
            </div>
          </div>
        </div>

        {/* --- HIGHLIGHT 3: ARTIST IMPRESSIONS --- */}
        <div ref={lacRef} className="relative w-full max-w-6xl mx-auto mb-16 md:mb-48">
          <div className="flex flex-col items-center mb-6 md:mb-10 px-6">
            <div className="text-center flex flex-col items-center">
               <div className="flex items-center gap-3 mb-4 opacity-40">
                  <Database size={14} className="text-[#F7E644]" />
                  <span className="text-[10px] font-mono tracking-[0.5em] text-white uppercase">ID_LAC_IMPRESSION_ALPHA</span>
               </div>
               <h3 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
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
        <div className="mt-12 md:mt-32 mb-16 md:mb-32 max-w-6xl mx-auto">
           <div className="flex flex-col items-center mb-12 md:mb-32 text-center scroll-reveal">
               <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
                 <SearchCode size={14} className="text-[#F7E644]" />
                 <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">DEEP DIVE // CASE ARCHIVES</span>
               </div>
               <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] relative text-white flex flex-wrap justify-center items-center">
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
                      <div className="w-full lg:w-[55%] relative z-10 cursor-pointer" onClick={() => openProjectById(project.id)}>
                        <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-xl transition-transform duration-700 bg-black/40 backdrop-blur-xl group-hover:scale-[1.01] h-auto overflow-visible">
                          <div className="w-full flex flex-col p-2 md:p-4 gap-2 md:gap-4 h-auto">
                            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg relative bg-black/20">
                              <ProgressiveImage src={project.image} alt={project.title} className="w-full h-full block" objectFit="cover" />
                            </div>

                            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 h-auto">
                              {project.gallery?.slice(0, 3).map((img, i) => (
                                <div key={i} className="rounded-lg md:rounded-xl overflow-hidden relative border border-white/10 bg-zinc-900 shadow-2xl transition-transform hover:scale-105 aspect-[2/3]">
                                  {img.endsWith('.mp4') ? (
                                    <video src={img} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Text Intel */}
                      <div className="w-full lg:w-[45%] flex flex-col justify-center p-5 md:p-12 relative z-20 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mb-3 md:mb-5">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
                          <span className="text-xs md:text-lg font-black tracking-[0.2em] uppercase" style={{ color: color }}>
                            0{idx + 1} / {project.category}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-5xl font-black uppercase text-white mb-4 md:mb-6 leading-tight tracking-tighter">
                          {project.title}
                        </h3>

                        <p className="text-gray-400 text-sm md:text-xl leading-relaxed mb-10 md:mb-12 font-medium italic opacity-80">
                          "{project.description}"
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8 md:mb-12">
                          {project.services?.map((service, i) => (
                            <span key={i} className="text-[8px] md:text-[10px] uppercase font-black text-white/40 border border-white/5 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                              {service}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-center lg:justify-start">
                          <Button 
                            variant="green" 
                            icon 
                            onClick={() => openProjectById(project.id)}
                            triggerOnHover
                            className="!min-w-[240px]"
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
                   className="shadow-[0_20px_60px_rgba(37,211,102,0.2)]"
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
