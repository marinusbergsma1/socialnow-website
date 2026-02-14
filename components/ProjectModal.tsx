
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Project } from '../types';
import Button from './Button';
import {
  X, ArrowLeft, User, Calendar, Layers, ChevronLeft, ChevronRight,
  ArrowRight, Activity, Terminal, Volume2, VolumeX
} from 'lucide-react';
import { muteGlobalVideo } from './ShortContent';

// Tappable video with unmute support
const TappableVideo: React.FC<{ src: string; className?: string }> = ({ src, className = "" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isUnmuted, setIsUnmuted] = useState(false);

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isUnmuted) {
      video.muted = true;
      setIsUnmuted(false);
    } else {
      muteGlobalVideo();
      video.muted = false;
      video.volume = 0.5;
      video.play().catch(() => {});
      setIsUnmuted(true);
    }
  };

  return (
    <div className="relative" onClick={handleTap}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={className}
      />
      <div className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
        isUnmuted ? 'bg-[#25D366] scale-110' : 'bg-black/60 scale-90'
      }`}
        style={{ backdropFilter: isUnmuted ? 'none' : 'blur(8px)' }}
      >
        {isUnmuted
          ? <Volume2 size={14} className="text-black" />
          : <VolumeX size={14} className="text-white/70" />
        }
      </div>
    </div>
  );
};

interface ProjectModalProps {
  project: Project | null;
  projects: Project[]; // Added to calculate index for pagination
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenBooking: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  projects,
  onClose,
  onNext,
  onPrev,
  onOpenBooking
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (project) {
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
      if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  }, [onClose]);

  if (!project && !isClosing) return null;

  const currentIndex = projects.findIndex(p => p.id === project.id);
  const totalProjects = projects.length;
  
  const prevProject = projects[(currentIndex - 1 + totalProjects) % totalProjects];
  const nextProject = projects[(currentIndex + 1) % totalProjects];

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-400 ${isClosing ? 'opacity-0 scale-95' : 'animate-fade-in-up'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/95 backdrop-blur-2xl transition-opacity duration-400 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative w-full h-full md:w-[95%] md:h-[90%] max-w-[1800px] bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-[0] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col">
        
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)', 
            backgroundSize: '40px 40px', 
            maskImage: 'radial-gradient(circle, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 100%)'
          }}
        ></div>

        {/* Navigation Header */}
        <div className="absolute top-0 left-0 w-full z-50 px-4 py-4 md:px-8 md:py-6 flex justify-between items-center pointer-events-none">
          <button
            onClick={handleClose}
            className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-lg">
              <button 
                onClick={onPrev}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 min-w-[50px] text-center">
                {currentIndex + 1} / {totalProjects}
              </span>
              <button 
                onClick={onNext}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="bg-black/40 backdrop-blur-xl border border-white/10 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#F62961] hover:border-[#F62961] hover:text-white transition-all shadow-lg hover:scale-110"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">
          <div className="flex flex-col lg:flex-row min-h-full">
            
            {/* Left Column: Fixed Content on Desktop */}
            <div className="w-full lg:w-[40%] xl:w-[35%] bg-black/40 backdrop-blur-sm lg:border-r border-white/10 lg:sticky lg:top-0 lg:h-full flex flex-col">
              
              {/* Mobile Hero Image - Geforceerd 16:9 (aspect-video) met object-cover */}
              <div className="lg:hidden w-full aspect-video relative bg-black">
                {project.image.endsWith('.mp4') ? (
                  <TappableVideo src={project.image} className="w-full h-full object-cover" />
                ) : (
                  <img className="w-full h-full object-cover" alt="Hero" loading="eager" src={project.image} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
              </div>

              <div className="p-6 md:p-12 lg:pt-32 pb-8 md:pb-12 flex flex-col h-full justify-between">
                <div>
                  <div className="inline-block px-3 py-1 mb-4 md:mb-6 rounded-full border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#F62961] bg-white/5 backdrop-blur-md shadow-inner">
                    {project.category}
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-[0.9] mb-4 md:mb-8 drop-shadow-lg tracking-tighter">
                    {project.title}
                  </h2>
                  
                  <p className="text-gray-300 leading-relaxed font-medium text-sm md:text-lg border-l-2 border-white/20 pl-4 md:pl-6 mb-8 md:mb-12 italic">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-2 gap-y-4 md:gap-y-8 gap-x-4 border-t border-b border-white/10 py-6 md:py-8 mb-6 md:mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1.5 md:mb-2">
                        <User size={12} className="text-[#00A3E0]" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest">Klant</span>
                      </div>
                      <p className="text-white font-bold text-xs md:text-base uppercase tracking-tight">{project.client || "Confidential"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1.5 md:mb-2">
                        <Calendar size={12} className="text-[#F62961]" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest">Jaar</span>
                      </div>
                      <p className="text-white font-bold text-xs md:text-base uppercase tracking-tight">{project.year || "2024"}</p>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-gray-500 mb-2 md:mb-4">
                        <Layers size={12} className="text-[#F7E644]" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest">Services</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {project.services?.map((service, i) => (
                          <span key={i} className="px-2 md:px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] md:text-[10px] text-gray-300 font-black uppercase tracking-widest">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-8">
                  <Button variant="green" icon onClick={onOpenBooking} className="w-full justify-center !h-[60px]">
                    Start jouw project
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Image & Video Gallery */}
            <div className="w-full lg:w-[60%] xl:w-[65%] p-4 md:p-8 lg:p-12 lg:pt-32">
              <div className="max-w-5xl mx-auto flex flex-col gap-6 md:gap-16 pb-12 md:pb-20">
                
                {/* Desktop Hero Image - Geforceerd 16:9 (aspect-video) met object-cover */}
                <div className="hidden lg:block w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-[#0a0a0a]">
                  {project.image.endsWith('.mp4') ? (
                    <TappableVideo src={project.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]" />
                  ) : (
                    <img alt="Hero" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]" loading="eager" src={project.image} />
                  )}
                </div>

                {/* Gallery Items (Images or Videos) */}
                {project.gallery?.map((item, idx) => (
                  <div key={idx} className="w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-lg bg-[#0a0a0a] group relative">
                    {item.endsWith('.mp4') ? (
                      <TappableVideo
                        src={item}
                        className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.01]"
                      />
                    ) : (
                      <img
                        alt={`Detail ${idx}`}
                        className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.01]"
                        loading="lazy"
                        decoding="async"
                        src={item}
                      />
                    )}
                  </div>
                ))}

                {/* Case Navigation Cards */}
                <div className="mt-8 md:mt-20 pt-8 md:pt-12 border-t border-white/10 flex flex-col items-center gap-6 md:gap-12">
                  <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Navigeer door onze cases</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    
                    {/* Previous Case Card */}
                    <div 
                      onClick={onPrev}
                      className="group relative rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-white/5 p-6 md:p-10 cursor-pointer hover:bg-white/10 hover:border-[#F62961] transition-all overflow-hidden backdrop-blur-md text-left"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F62961]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <span className="text-[#F62961] text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] block mb-2 md:mb-3 opacity-60 group-hover:opacity-100 transition-opacity">Vorige Case</span>
                        <h3 className="text-base md:text-2xl font-black uppercase text-white flex items-center gap-2 md:gap-3 tracking-tighter">
                          <ChevronLeft size={24} className="group-hover:-translate-x-2 transition-transform text-[#F62961]" /> 
                          {prevProject.title}
                        </h3>
                      </div>
                    </div>

                    {/* Next Case Card */}
                    <div 
                      onClick={onNext}
                      className="group relative rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-white/5 p-6 md:p-10 cursor-pointer hover:bg-white/10 hover:border-[#00A3E0] transition-all overflow-hidden backdrop-blur-md text-left md:text-right"
                    >
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-[#00A3E0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <span className="text-[#00A3E0] text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] block mb-2 md:mb-3 opacity-60 group-hover:opacity-100 transition-opacity">Volgende Case</span>
                        <h3 className="text-base md:text-2xl font-black uppercase text-white flex items-center md:justify-end gap-2 md:gap-3 tracking-tighter">
                          {nextProject.title}
                          <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform text-[#00A3E0]" /> 
                        </h3>
                      </div>
                    </div>

                  </div>

                  <button 
                    onClick={onClose}
                    className="relative overflow-hidden rounded-full group cursor-pointer transition-all duration-300 border-2 active:scale-95 bg-transparent border-transparent text-white/40 hover:text-[#00A3E0] mt-2 md:mt-4"
                  >
                    <div className="relative z-10 flex items-center justify-center font-black uppercase tracking-[0.4em] text-[10px] md:text-xs px-6 py-3 gap-2">
                      <span className="transition-colors duration-300 ">Terug naar overzicht</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
