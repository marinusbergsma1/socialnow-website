
import React, { useEffect, useState } from 'react';
import { 
  X, Shield, PieChart, TrendingUp, Zap, Fingerprint, 
  Terminal, Network, Layers, Globe, Linkedin, Mail, 
  ArrowRight, Activity, Target, Eye,
  PlayCircle, Box, BarChart3, Send, CircleDollarSign, Calendar, User
} from 'lucide-react';
import Button from './Button';
import ScrollTypewriter from './ScrollTypewriter';
import ProgressiveImage from './ProgressiveImage';
import { PixelGlobe } from './PixelGlobe';
import { Project } from '../types';

interface ProjectsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Artist Impression",
    category: "LIGHT ART COLLECTION",
    client: "LAC International",
    year: "2024",
    services: ["3D Visualisation", "Concept Art", "VFX"],
    description: "Visuele magie voor LAC en Amsterdam Light Festival. Wij creëren hoogwaardige artist impressions die lichtkunstwerken tot leven brengen nog voor ze gebouwd zijn. Een blik in de toekomst van lichtkunst.",
    image: "https://i.ibb.co/SDKqJK5k/Light-Art-Collection-Artwork.webp", 
    align: 'left',
    gallery: [
      "https://i.ibb.co/RpS1gGDc/Butterfly-Effect-Light-Art-Collection.webp",
      "https://i.ibb.co/HD1xVQK4/Infinita-Light-Art-Collection.webp",
      "https://i.ibb.co/wZZrCrnw/SIGN-Light-Art-Collection.webp"
    ]
  },
  {
    id: 5,
    title: "Social Artwork OS",
    category: "VOETBALCLUB AZ",
    client: "AZ Alkmaar",
    year: "Ongoing",
    services: ["Social Graphics", "Matchday Designs", "Motion", "Fan Intelligence"],
    description: "Een digitaal ecosysteem voor de passie van het spel. Voor AZ Alkmaar bouwen we high-end social artwork en website visuals die fans diep in de clubcultuur trekken. Elk design is een strategische zet in de visuele dominantie van de Eredivisie.",
    image: "https://i.ibb.co/d4Jy4Bxr/Logo-s-AZ-Media-Concept.webp",
    align: 'right',
    gallery: [
      "https://i.ibb.co/HDnNddpm/header-Bouadu-v2-2.webp",
      "https://i.ibb.co/GQqxQHmz/AZ-Champions-Leageu-Header.webp",
      "https://i.ibb.co/BKYLR4wG/AZ-25-K-Volgers-Post.webp",
      "https://i.ibb.co/RkHCGbNS/AZ-Boadu-Bedankt-Post.webp",
      "https://i.ibb.co/rRvDwPcZ/Logo-s-AZ-Media-Voorbeeld-1.webp"
    ]
  },
  {
    id: 2,
    title: "Banners & Socials",
    category: "ENTERTAINMENT OPS",
    client: "Universal / Sony Pictures",
    year: "2023 - 2024",
    services: ["Motion Design", "Ad Scaling", "Campaigns"],
    description: "Wij transformeren bioscooplanceringen tot visuele spektakels. Voor UNIVERSAL NL en SonyPicturesNL engineeren we on- en offline campagnes die de grens tussen entertainment en realiteit doen vervagen. Onze perswanden en social content zijn geprogrammeerd voor maximale impact.",
    image: "https://i.ibb.co/YFMBv29X/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp", 
    align: 'right', 
    gallery: [
      "https://i.ibb.co/nNb5FYBq/WARNER-FLASH-FRAMES.webp",
      "https://i.ibb.co/d4Xvg2Nd/UNIVERSAL-OPENHEIMER-FRAMES.webp",
      "https://i.ibb.co/mV9FkFZy/UNIVERSAL-NOHARDFEELINGS-FRAMES.webp"
    ]
  },
  {
    id: 3,
    title: "Interior & Branding",
    category: "SPATIAL IDENTITY",
    client: "Print & Bind Amsterdam",
    year: "2023",
    services: ["Interior Design", "Signage", "Office Branding"],
    description: "Ruimtelijke intelligentie ontmoet merkbeleving. We hebben het kantoor van Print & Bind in Amsterdam getransformeerd tot een fysiek manifest van hun creatieve vermogen. Een kantoor dat niet alleen inspireert, maar de kernwaarden van het merk ademt.",
    image: "https://i.ibb.co/7Nr2Nmdr/666f15bbb49442553d264e6d-PRINT-BIND.webp",
    align: 'left',
    gallery: [
      "https://i.ibb.co/8D1GLhGM/Bannert.webp",
      "https://i.ibb.co/xSTR7yV9/Meeting-Room-2.webp",
      "https://i.ibb.co/998R1QP8/IMG-1686.webp"
    ]
  }
];

const ProjectsPage: React.FC<ProjectsPageProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const nodeColors = ["#61F6FD", "#25D366", "#F62961", "#F7E644", "#61F6FD", "#25D366"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 z-[250] bg-black overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isClosing ? 'opacity-0 scale-95 blur-2xl' : 'opacity-100 scale-100 blur-0'
    }`}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`, backgroundSize: '100px 100px' }}></div>
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F7E644] to-transparent z-[260] animate-pulse"></div>

      <div className="sticky top-0 z-[270] w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between backdrop-blur-3xl border-b border-white/5 bg-black/80">
          <div className="flex items-center gap-6">
              <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="Logo" className="w-32 md:w-44" />
              <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6">
                  <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F7E644] animate-ping"></div>
                      <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">ARCHIVE_ACCESS_V3</span>
                  </div>
              </div>
          </div>
          <button onClick={handleClose} className="group relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#F7E644] hover:text-black transition-all overflow-hidden shadow-2xl">
             <X size={24} className="group-hover:rotate-90 transition-transform duration-500 relative z-10" />
          </button>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl pt-24 pb-48 px-6">
          <div className="text-center mb-32 relative px-4">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
                <Layers size={16} className="text-[#F7E644]" />
                <span className="text-white font-black uppercase tracking-[0.6em] text-[10px]">PROJECT ARCHIVE ENGINE</span>
              </div>
              <h1 className="text-5xl md:text-9xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-12">
                 BRAND <br/> <span className="text-white">CASE STUDIES</span>
              </h1>
              <p className="text-gray-400 font-bold text-xl md:text-3xl max-w-4xl mx-auto italic leading-tight">
                 "Wij bouwen geen projecten, wij engineeren visuele monumenten die resultaat genereren."
              </p>
          </div>

          <div className="space-y-48">
              {projects.map((project, idx) => (
                  <div key={project.id} className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-br from-white/[0.02] to-transparent rounded-[5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      
                      <div className="relative z-10 bg-[#050505] border border-white/10 rounded-[4rem] p-8 md:p-16 overflow-hidden flex flex-col lg:flex-row gap-16 shadow-3xl">
                          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.01] to-transparent pointer-events-none"></div>
                          
                          {/* Project Media */}
                          <div className="w-full lg:w-[50%] shrink-0">
                              <div className="relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl group-hover:border-white/20 transition-all duration-700">
                                  <ProgressiveImage src={project.image} alt={project.title} className="w-full h-full transition-transform duration-1000 group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                  
                                  <div className="absolute top-8 left-8 flex gap-3">
                                      <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white">
                                          ID_{project.id}
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mt-8">
                                  {project.gallery?.map((img, i) => (
                                      <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                                          <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Project Intel */}
                          <div className="flex-1 flex flex-col justify-between py-4">
                              <div className="space-y-10">
                                  <div>
                                      <div className="flex items-center gap-4 mb-6">
                                          <div className="h-[2px] w-12 bg-[#F7E644]"></div>
                                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F7E644]">{project.category}</span>
                                      </div>
                                      <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8">{project.title}</h2>
                                  </div>

                                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                      <div>
                                          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-3">CLIENT // UNIT</span>
                                          <div className="flex items-center gap-3">
                                              <User size={14} className="text-[#61F6FD]" />
                                              <span className="text-sm font-black text-white uppercase">{project.client}</span>
                                          </div>
                                      </div>
                                      <div>
                                          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-3">STAMP // YEAR</span>
                                          <div className="flex items-center gap-3">
                                              <Calendar size={14} className="text-[#F62961]" />
                                              <span className="text-sm font-black text-white uppercase">{project.year}</span>
                                          </div>
                                      </div>
                                  </div>

                                  <p className="text-gray-400 text-lg md:text-2xl font-medium leading-tight">
                                      {project.description}
                                  </p>

                                  <div className="flex flex-wrap gap-3">
                                      {project.services?.map((s, i) => (
                                          <div key={i} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest">
                                              {s}
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              <div className="mt-12 flex items-center justify-between gap-8 pt-12 border-t border-white/5">
                                  <div className="flex items-center gap-4">
                                      <div className="flex flex-col">
                                          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">IMPACT_SCORE</span>
                                          <div className="flex gap-1 h-5 items-end">
                                              {[0.4, 0.8, 0.6, 0.9, 0.5, 0.7].map((h, i) => (
                                                  <div key={i} className="w-1.5 rounded-full bg-[#25D366]/40" style={{ height: `${h * 100}%` }}></div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                                  <Button variant="green" icon onClick={handleClose}>Start Vergelijkbaar Project</Button>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* UNIFIED CTA SECTION */}
          <div className="mt-48 mb-24 flex justify-center px-4 overflow-visible">
              <div className="w-full max-w-6xl bg-white/[0.02] border border-white/10 rounded-[4rem] p-10 md:p-24 relative overflow-visible group transition-all duration-1000 scale-100 opacity-100 shadow-3xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#61F6FD]/5 via-transparent to-[#F62961]/5 opacity-40 rounded-[4rem]"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16 overflow-visible">
                    <div className="flex-1 text-center md:text-left z-30">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
                            <Shield size={14} className="text-[#61F6FD]" />
                            <span className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px]">INTEGRATED BRAND OS</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-8xl font-black uppercase text-white tracking-tighter leading-[0.8] mb-12">
                            LET'S GET <br/> <span className="text-[#25D366]">SOCIALNOW</span>
                        </h2>
                        
                        <p className="text-gray-400 font-bold text-lg md:text-2xl leading-tight mb-12">
                            Wij vertalen rauwe ambitie naar <span className="text-white">geïntegreerde visuele ecosystemen</span>. Onze strategie is gecodeerd voor dominantie.
                        </p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-12">
                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                <Shield size={18} className="text-[#61F6FD]" />
                                <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Brand Protection</span>
                            </div>
                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                <PieChart size={18} className="text-[#25D366]" />
                                <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Market Analytics</span>
                            </div>
                        </div>

                        <Button variant="green" icon={true} IconComponent={Send} onClick={handleClose} className="!px-14 !text-lg shadow-[0_0_30px_rgba(37,211,102,0.2)]">Neem Contact Op</Button>
                    </div>
                    
                    <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center overflow-visible">
                        <div className="absolute inset-0 flex items-center justify-center z-10 overflow-visible">
                            <PixelGlobe scaleMultiplier={0.25} glowEnabled={true} largeParticles={true} />
                        </div>

                        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                            <div 
                                key={deg} 
                                className="absolute w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 z-20"
                                style={{ transform: `rotate(${deg}deg) translate(230px) rotate(-${deg}deg)` }}
                            >
                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full" style={{ backgroundColor: nodeColors[i] }}></div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
          </div>
      </div>

      <style>{`
        @keyframes scan-sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
