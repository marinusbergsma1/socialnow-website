
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, ExternalLink, ChevronLeft, ChevronRight, Maximize2, ChevronDown } from 'lucide-react';
import { webShowcaseProjects } from '../data/projects';

// Detect if we're inside an iframe (to prevent recursive loading)
const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

const WebShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState<boolean[]>(
    webShowcaseProjects.map(() => false)
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(0.6);
  const [isSticky, setIsSticky] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const thumbTrackRef = useRef<HTMLDivElement>(null);

  const activeProject = webShowcaseProjects[activeIndex];

  // SSR-safe responsive check with resize listener
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mark iframe as loaded
  const handleIframeLoad = useCallback((idx: number) => {
    setIframeLoaded(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  // Navigation
  const goNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % webShowcaseProjects.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }, []);

  const goPrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + webShowcaseProjects.length) % webShowcaseProjects.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }, []);

  const goToIndex = useCallback((idx: number) => {
    if (idx === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goNext, goPrev]);

  // Scroll-driven grow animation (desktop only)
  useEffect(() => {
    if (!isDesktop) {
      setScale(1);
      setIsSticky(false);
      return;
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const enterPoint = windowHeight * 0.8;
      const fullPoint = windowHeight * 0.15;

      if (rect.top > enterPoint) {
        setScale(0.55);
        setIsSticky(false);
      } else if (rect.top < fullPoint) {
        setScale(1);
        setIsSticky(true);
      } else {
        const progress = 1 - (rect.top - fullPoint) / (enterPoint - fullPoint);
        const eased = 1 - Math.pow(1 - progress, 3);
        setScale(0.55 + eased * 0.45);
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  // Auto-center active thumbnail
  useEffect(() => {
    if (!thumbTrackRef.current) return;
    const track = thumbTrackRef.current;
    const activeThumb = track.children[activeIndex] as HTMLElement | undefined;
    if (!activeThumb) return;

    const trackRect = track.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();
    const scrollLeft = track.scrollLeft;
    const thumbCenter = thumbRect.left - trackRect.left + scrollLeft + thumbRect.width / 2;
    const trackCenter = trackRect.width / 2;

    track.scrollTo({ left: thumbCenter - trackCenter, behavior: 'smooth' });
  }, [activeIndex]);

  // Fullscreen body lock
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  // Touch swipe
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStart.current = null;
  };

  // Self-link detection
  const shouldUseUnlock = (project: typeof activeProject) => {
    return (project.url?.includes('socialnow-website') && isInIframe);
  };

  // Desktop: live iframe
  const renderDesktopIframe = (project: typeof activeProject, idx: number) => {
    const isActive = idx === activeIndex && !isTransitioning;

    if (shouldUseUnlock(project)) {
      return (
        <div key={`desk-${project.id}`} className={`absolute inset-0 transition-opacity duration-400 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" loading={idx < 2 ? 'eager' : 'lazy'} />
        </div>
      );
    }

    return (
      <div key={`desk-${project.id}`} className={`absolute inset-0 transition-opacity duration-400 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
        {!iframeLoaded[idx] && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-white/20 border-t-[#25D366] rounded-full animate-spin" />
              <span className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em]">Loading</span>
            </div>
          </div>
        )}
        <iframe
          src={project.url}
          title={project.title}
          className={`w-full h-full border-0 transition-opacity duration-500 ${iframeLoaded[idx] ? 'opacity-100' : 'opacity-0'}`}
          style={{ colorScheme: 'normal' }}
          onLoad={() => handleIframeLoad(idx)}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    );
  };

  // Fullscreen render
  const renderFullscreenPreview = (project: typeof activeProject, idx: number) => {
    if (shouldUseUnlock(project)) {
      return (
        <div key={`fs-${project.id}`} className={`w-full h-full ${idx === activeIndex ? 'flex' : 'hidden'} items-center justify-center`}
          style={{ background: 'radial-gradient(ellipse at center, rgba(37,211,102,0.08) 0%, rgba(0,0,0,0.95) 70%)' }}>
          <div className="flex flex-col items-center gap-6 text-center px-8 max-w-lg">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter">
              INCEPTION <span className="text-[#25D366]">DEPTH</span> REACHED
            </h3>
            <a href="https://wa.me/31637404577" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-black font-black uppercase tracking-wider text-xs hover:bg-[#20bd5a] transition-all shadow-[0_0_30px_rgba(37,211,102,0.3)]">
              NEEM CONTACT OP <ExternalLink size={14} />
            </a>
          </div>
        </div>
      );
    }

    return (
      <iframe key={`fs-${project.id}`} src={project.url} title={`${project.title} - Fullscreen`}
        className={`w-full h-full border-0 ${idx === activeIndex ? 'block' : 'hidden'}`}
        style={{ colorScheme: 'normal' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    );
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  };

  return (
    <>
      <section ref={sectionRef} className="relative bg-transparent overflow-visible">
        {/* Background watermark */}
        <div className="absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
          <h2 className="text-[25vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">WEBSITES</h2>
        </div>

        {/* Section Header */}
        <div className="pt-8 md:pt-32 pb-3 md:pb-12">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white flex flex-wrap justify-center items-center">
                <span className="inline-flex items-center whitespace-nowrap">
                  <span className="text-[#F7E644] mr-1 md:mr-6">&ldquo;</span>
                  WEBSITES
                </span>
                <span className="mx-1.5 md:mx-4">WE</span>
                <span className="inline-flex items-center whitespace-nowrap">
                  BUILT
                  <span className="text-[#F7E644] ml-1 md:ml-6">&rdquo;</span>
                </span>
              </h2>
              <p className="mt-3 md:mt-6 text-[8px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">
                CMS · Back-end · Analytics · AI Chatbot · SEO · Responsive
              </p>
            </div>
          </div>
        </div>

        {/* Sticky showcase container (desktop only) */}
        <div className={`${isDesktop ? 'lg:sticky lg:top-0' : ''} z-20`}
          style={{ minHeight: isDesktop ? '100vh' : 'auto' }}>
          <div className="lg:h-screen flex flex-col items-center justify-center px-2 md:px-8 relative py-2 lg:py-0">

            {/* Grow-animated wrapper */}
            <div
              className="w-full max-w-[1400px] transition-transform duration-100 ease-out will-change-transform"
              style={{ transform: `scale(${scale})` }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Action bar */}
              <div className="flex items-center justify-between mb-2 md:mb-4 px-3 md:px-5 py-2 md:py-2.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#25D366] animate-pulse flex-shrink-0" />
                  <span className="text-white font-black uppercase tracking-tight text-xs md:text-lg truncate">{activeProject.title}</span>
                  <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-[#5BA4F5] hidden sm:inline flex-shrink-0">{activeProject.category}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setIsFullscreen(true)} className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all" aria-label="Fullscreen">
                    <Maximize2 size={10} /><span className="hidden sm:inline">Fullscreen</span>
                  </button>
                  <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 hover:border-[#25D366]/40 hover:text-[#25D366] transition-all" aria-label="Open live site">
                    <Globe size={10} /><span className="hidden sm:inline">Live</span><ExternalLink size={9} />
                  </a>
                </div>
              </div>

              {/* ═══ MOBILE: PC screenshot with link (< lg) ═══ */}
              <div className="flex lg:hidden items-center gap-1.5">
                <button onClick={goPrev} aria-label="Vorige" className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 active:text-white active:bg-white/10 transition-all flex-shrink-0">
                  <ChevronLeft size={14} strokeWidth={1.5} />
                </button>

                <div className="relative flex-1 min-w-0">
                  <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio: '16 / 9', ...glassStyle }}>
                      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none z-40" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
                      {webShowcaseProjects.map((project, idx) => (
                        <div key={`smob-${project.id}`} className={`absolute inset-0 transition-opacity duration-500 ${idx === activeIndex && !isTransitioning ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover object-top" loading={idx < 2 ? 'eager' : 'lazy'} />
                        </div>
                      ))}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-30 rounded-b-xl" />
                    </div>
                  </a>
                </div>

                <button onClick={goNext} aria-label="Volgende" className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 active:text-white active:bg-white/10 transition-all flex-shrink-0">
                  <ChevronRight size={14} strokeWidth={1.5} />
                </button>
              </div>

              {/* ═══ DESKTOP: Live iframe with side previews (lg+) ═══ */}
              <div className="hidden lg:flex items-center gap-4 relative">
                {/* Previous site peek (left) */}
                <button onClick={goPrev} aria-label="Vorige" className="relative w-[12%] flex-shrink-0 group cursor-pointer">
                  <div className="rounded-xl overflow-hidden relative opacity-25 group-hover:opacity-40 transition-all duration-500 scale-[0.92] group-hover:scale-[0.95]" style={{ aspectRatio: '16 / 9', ...glassStyle }}>
                    {(() => {
                      const prevIdx = (activeIndex - 1 + webShowcaseProjects.length) % webShowcaseProjects.length;
                      const prevProject = webShowcaseProjects[prevIdx];
                      return <img src={prevProject.image} alt={prevProject.title} className="w-full h-full object-cover object-top" loading="lazy" />;
                    })()}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                      <ChevronLeft size={14} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                </button>

                {/* Main center iframe */}
                <div className="relative flex-1 min-w-0">
                  <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16 / 9', ...glassStyle }}>
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none z-40" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
                    {webShowcaseProjects.map((project, idx) => renderDesktopIframe(project, idx))}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-30 rounded-b-2xl" />
                  </div>
                </div>

                {/* Next site peek (right) */}
                <button onClick={goNext} aria-label="Volgende" className="relative w-[12%] flex-shrink-0 group cursor-pointer">
                  <div className="rounded-xl overflow-hidden relative opacity-25 group-hover:opacity-40 transition-all duration-500 scale-[0.92] group-hover:scale-[0.95]" style={{ aspectRatio: '16 / 9', ...glassStyle }}>
                    {(() => {
                      const nextIdx = (activeIndex + 1) % webShowcaseProjects.length;
                      const nextProject = webShowcaseProjects[nextIdx];
                      return <img src={nextProject.image} alt={nextProject.title} className="w-full h-full object-cover object-top" loading="lazy" />;
                    })()}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                      <ChevronRight size={14} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-3 md:mt-6 flex items-center justify-center gap-2 md:gap-3">
                <button onClick={goPrev} aria-label="Vorige" className="md:hidden w-6 h-6 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white transition-all flex-shrink-0">
                  <ChevronLeft size={12} strokeWidth={1.5} />
                </button>
                <div ref={thumbTrackRef} className="flex gap-1 md:gap-1.5 overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {webShowcaseProjects.map((project, idx) => (
                    <button key={project.id} onClick={() => goToIndex(idx)} aria-label={`Ga naar ${project.title}`}
                      className={`relative rounded-sm md:rounded-md overflow-hidden transition-all duration-300 flex-shrink-0 ${idx === activeIndex ? 'ring-1 ring-[#5BA4F5]/60 shadow-[0_0_10px_rgba(97,246,253,0.2)] scale-110 opacity-100' : 'opacity-30 hover:opacity-60'}`}
                      style={{ width: idx === activeIndex ? '36px' : '30px', height: idx === activeIndex ? '22px' : '19px' }}>
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button onClick={goNext} aria-label="Volgende" className="md:hidden w-6 h-6 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white transition-all flex-shrink-0">
                  <ChevronRight size={12} strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-2 md:mt-3 text-center">
                <p className="text-white/15 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.5em]">
                  {activeProject.client} — {activeProject.year}
                </p>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${isSticky ? 'opacity-40' : 'opacity-0'}`}>
              <div className="flex flex-col items-center gap-1 animate-bounce">
                <ChevronDown size={16} className="text-white/30" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block" style={{ height: '25vh' }} />
      </section>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          <div className="flex items-center justify-between px-6 py-3 bg-[#0a0a0a] border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-white font-black uppercase tracking-tight text-sm">{activeProject.title}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5BA4F5]">{activeProject.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={goPrev} aria-label="Vorige" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"><ChevronLeft size={16} /></button>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">{activeIndex + 1} / {webShowcaseProjects.length}</span>
              <button onClick={goNext} aria-label="Volgende" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"><ChevronRight size={16} /></button>
              <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 transition-all ml-2">
                <ExternalLink size={10} />Open
              </a>
              <button onClick={() => setIsFullscreen(false)} aria-label="Sluiten" className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all ml-2">ESC</button>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            {webShowcaseProjects.map((project, idx) => renderFullscreenPreview(project, idx))}
          </div>
        </div>
      )}
    </>
  );
};

export default WebShowcase;
