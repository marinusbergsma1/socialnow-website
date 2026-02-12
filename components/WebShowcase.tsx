
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, ExternalLink, Code, ChevronLeft, ChevronRight, Maximize2, ChevronDown } from 'lucide-react';
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
  const [mobileScale, setMobileScale] = useState(0.4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const thumbTrackRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  const activeProject = webShowcaseProjects[activeIndex];

  // Mark iframe as loaded
  const handleIframeLoad = useCallback((idx: number) => {
    setIframeLoaded(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  // Navigation with synchronized transition
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

  // Calculate mobile iframe scale based on container size (desktop sidebar)
  useEffect(() => {
    if (!mobileContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        const newScale = containerWidth / 375;
        setMobileScale(newScale);
      }
    });
    observer.observe(mobileContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll-driven grow animation (desktop only — skip on mobile for performance)
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
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
  }, []);

  // Auto-center active thumbnail
  useEffect(() => {
    if (!thumbTrackRef.current) return;
    const track = thumbTrackRef.current;
    const activeThumb = track.children[activeIndex] as HTMLElement;
    if (!activeThumb) return;

    const trackRect = track.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();
    const scrollLeft = track.scrollLeft;
    const thumbCenter = thumbRect.left - trackRect.left + scrollLeft + thumbRect.width / 2;
    const trackCenter = trackRect.width / 2;

    track.scrollTo({
      left: thumbCenter - trackCenter,
      behavior: 'smooth'
    });
  }, [activeIndex]);

  // Toggle fullscreen
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  // Touch swipe support for mobile
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

  // Helper: should this project use unlock fallback?
  const shouldUseUnlock = (project: typeof activeProject) => {
    const isSelf = project.url?.includes('socialnow-website');
    return isSelf && isInIframe;
  };

  // Desktop iframe render — only load active + adjacent for performance
  const renderDesktopPreview = (project: typeof activeProject, idx: number) => {
    const isActive = idx === activeIndex && !isTransitioning;
    const isNearby = Math.abs(idx - activeIndex) <= 1;

    if (shouldUseUnlock(project)) {
      return (
        <div
          key={`desk-${project.id}`}
          className={`absolute inset-0 transition-opacity duration-400 flex items-center justify-center ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          style={{ background: 'radial-gradient(ellipse at center, rgba(37,211,102,0.08) 0%, rgba(0,0,0,0.95) 70%)' }}
          ref={() => handleIframeLoad(idx)}
        >
          <div className="flex flex-col items-center gap-6 text-center px-8 max-w-md">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xl">🔒</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-tighter">
              INCEPTION <span className="text-[#25D366]">DEPTH</span> REACHED
            </h3>
            <p className="text-gray-500 text-xs font-bold">Je kijkt naar een website, in een website, in een website...</p>
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-black font-black uppercase tracking-wider text-[10px] hover:bg-[#20bd5a] transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)]"
            >
              UNLOCK <ExternalLink size={12} />
            </a>
          </div>
        </div>
      );
    }

    return (
      <div
        key={`desk-${project.id}`}
        className={`absolute inset-0 transition-opacity duration-400 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
      >
        {/* Only load iframe if nearby — huge performance win */}
        {isNearby ? (
          <iframe
            src={project.url}
            title={`${project.title} - Desktop Preview`}
            className="w-full h-full border-0"
            style={{ colorScheme: 'normal' }}
            onLoad={() => handleIframeLoad(idx)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Scroll-through overlay — prevents iframe from capturing scroll */}
        <div className="absolute inset-0 z-20" />
      </div>
    );
  };

  // Fullscreen render
  const renderFullscreenPreview = (project: typeof activeProject, idx: number) => {
    if (shouldUseUnlock(project)) {
      return (
        <div
          key={`fs-${project.id}`}
          className={`w-full h-full ${idx === activeIndex ? 'flex' : 'hidden'} items-center justify-center`}
          style={{ background: 'radial-gradient(ellipse at center, rgba(37,211,102,0.08) 0%, rgba(0,0,0,0.95) 70%)' }}
        >
          <div className="flex flex-col items-center gap-6 text-center px-8 max-w-lg">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter">
              INCEPTION <span className="text-[#25D366]">DEPTH</span> REACHED
            </h3>
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-black font-black uppercase tracking-wider text-xs hover:bg-[#20bd5a] transition-all shadow-[0_0_30px_rgba(37,211,102,0.3)]"
            >
              NEEM CONTACT OP <ExternalLink size={14} />
            </a>
          </div>
        </div>
      );
    }

    return (
      <iframe
        key={`fs-${project.id}`}
        src={project.url}
        title={`${project.title} - Fullscreen`}
        className={`w-full h-full border-0 ${idx === activeIndex ? 'block' : 'hidden'}`}
        style={{ colorScheme: 'normal' }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    );
  };

  return (
    <>
      <section ref={sectionRef} className="relative bg-transparent overflow-visible">
        {/* Section Header */}
        <div className="pt-20 md:pt-32 pb-8 md:pb-12">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
                <Code size={14} className="text-[#61F6FD]" />
                <span className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">WEB DESIGN & DEVELOPMENT</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.8] text-white flex flex-wrap justify-center items-center">
                <span className="inline-flex items-center whitespace-nowrap">
                  <span className="text-[#F7E644] mr-2 md:mr-6">&ldquo;</span>
                  WEBSITES
                </span>
                <span className="mx-2 md:mx-4">WE</span>
                <span className="inline-flex items-center whitespace-nowrap">
                  BUILT
                  <span className="text-[#F7E644] ml-2 md:ml-6">&rdquo;</span>
                </span>
              </h2>

              {/* USP tags */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8">
                {[
                  { label: 'INCL. CMS', color: '#61F6FD' },
                  { label: 'BACK-END', color: '#F7E644' },
                  { label: 'ANALYTICS', color: '#25D366' },
                  { label: 'AI CHATBOT', color: '#F62961' },
                  { label: 'SEO', color: '#61F6FD' },
                  { label: 'RESPONSIVE', color: '#F7E644' },
                ].map((usp) => (
                  <span
                    key={usp.label}
                    className="px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.25em]"
                    style={{
                      color: usp.color,
                      border: `1px solid ${usp.color}20`,
                      background: `${usp.color}08`,
                    }}
                  >
                    {usp.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky showcase container (sticky only on desktop) */}
        <div
          ref={stickyRef}
          className="lg:sticky lg:top-0 z-20"
          style={{ minHeight: window.innerWidth >= 1024 ? '100vh' : 'auto' }}
        >
          <div className="lg:h-screen flex flex-col items-center justify-center px-4 md:px-8 relative py-8 lg:py-0">

            {/* Grow-animated wrapper */}
            <div
              className="w-full max-w-[1600px] transition-transform duration-100 ease-out will-change-transform"
              style={{ transform: `scale(${scale})` }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Action bar — above previews — Glassmorphism */}
              <div
                className="flex items-center justify-between mb-3 md:mb-4 px-4 md:px-5 py-2.5 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Project info left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse flex-shrink-0"></div>
                  <span className="text-white font-black uppercase tracking-tight text-sm md:text-lg truncate">{activeProject.title}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#61F6FD] hidden sm:inline flex-shrink-0">{activeProject.category}</span>
                </div>

                {/* Actions right */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Maximize2 size={10} />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </button>
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 hover:border-[#25D366]/40 hover:text-[#25D366] transition-all"
                  >
                    <Globe size={10} />
                    <span className="hidden sm:inline">Live</span>
                    <ExternalLink size={9} />
                  </a>
                </div>
              </div>

              {/* ═══ MOBILE: Desktop-style 16:9 screenshot preview (< lg) — NO iframes ═══ */}
              <div className="flex lg:hidden items-center gap-2">
                {/* Left arrow */}
                <button
                  onClick={goPrev}
                  className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 active:text-white active:bg-white/10 transition-all flex-shrink-0"
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>

                {/* 16:9 Desktop screenshot preview — Glassmorphism */}
                <div className="relative flex-1 min-w-0">
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div
                      className="rounded-xl overflow-hidden relative"
                      style={{
                        aspectRatio: '16 / 9',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {/* Top edge highlight */}
                      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none z-40"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                      />

                      {/* Screenshot images — instant load, no iframes! */}
                      {webShowcaseProjects.map((project, idx) => (
                        <div
                          key={`smob-${project.id}`}
                          className={`absolute inset-0 transition-opacity duration-500 ${idx === activeIndex && !isTransitioning ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-top"
                            loading={idx < 2 ? 'eager' : 'lazy'}
                          />
                        </div>
                      ))}

                      {/* Subtle bottom gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-30 rounded-b-xl" />
                    </div>
                  </a>
                </div>

                {/* Right arrow */}
                <button
                  onClick={goNext}
                  className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 active:text-white active:bg-white/10 transition-all flex-shrink-0"
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* ═══ DESKTOP: 16:9 + Mobile side-by-side (lg+) ═══ */}
              <div className="hidden lg:flex items-stretch gap-3 md:gap-5">

                {/* Left arrow — minimal */}
                <button
                  onClick={goPrev}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex-shrink-0 self-center"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>

                {/* Desktop Preview — 16:9 — Glassmorphism */}
                <div className="relative flex-1 min-w-0">
                  <div
                    className="rounded-2xl overflow-hidden relative"
                    style={{
                      aspectRatio: '16 / 9',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none z-40"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                    />
                    {/* Loading spinner */}
                    {!iframeLoaded[activeIndex] && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#080808]">
                        <div className="w-8 h-8 border-2 border-white/10 border-t-[#61F6FD] rounded-full animate-spin mb-3"></div>
                        <span className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em]">Laden...</span>
                      </div>
                    )}

                    {/* Desktop iframes */}
                    {webShowcaseProjects.map((project, idx) => renderDesktopPreview(project, idx))}

                    {/* Subtle bottom gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-30 rounded-b-2xl" />
                  </div>
                </div>

                {/* Desktop: Mobile Preview — iPhone ratio — Glassmorphism — same height as desktop */}
                <div className="flex flex-shrink-0 items-stretch" style={{ width: 'clamp(120px, 11vw, 180px)' }}>
                  <div
                    ref={mobileContainerRef}
                    className="rounded-[1.2rem] xl:rounded-[1.5rem] overflow-hidden relative w-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-[15%] right-[15%] h-[1px] pointer-events-none z-40"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                    />
                    {/* Mobile iframes — dynamically scaled, only load nearby */}
                    {webShowcaseProjects.map((project, idx) => {
                      const isActive = idx === activeIndex && !isTransitioning;
                      const isNearby = Math.abs(idx - activeIndex) <= 1;

                      if (shouldUseUnlock(project)) {
                        return (
                          <div
                            key={`mob-${project.id}`}
                            className={`absolute inset-0 transition-opacity duration-400 flex items-center justify-center ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                            style={{ background: 'radial-gradient(ellipse at center, rgba(37,211,102,0.06) 0%, rgba(0,0,0,0.95) 70%)' }}
                          >
                            <div className="flex flex-col items-center gap-2 text-center px-2">
                              <span className="text-base">🔒</span>
                              <p className="text-white/30 text-[7px] font-bold uppercase tracking-widest">Inception</p>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={`mob-wrap-${project.id}`}
                          className={`absolute inset-0 overflow-hidden transition-opacity duration-400 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                        >
                          {isNearby ? (
                            <iframe
                              src={project.url}
                              title={`${project.title} - Mobile`}
                              className="border-0 origin-top-left absolute top-0 left-0"
                              style={{
                                width: '375px',
                                height: '812px',
                                transform: `scale(${mobileScale})`,
                                colorScheme: 'normal',
                              }}
                              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                              loading="lazy"
                            />
                          ) : (
                            <img
                              src={project.fullPageScreenshot || project.image}
                              alt={project.title}
                              className="w-full h-full object-cover object-top"
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-[2.5%] bg-black rounded-b-lg z-30" />

                    {/* Bottom home indicator */}
                    <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[30%] h-[0.5%] bg-white/20 rounded-full z-30" />
                  </div>
                </div>

                {/* Right arrow — minimal */}
                <button
                  onClick={goNext}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex-shrink-0 self-center"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Bottom bar: thumbnails + mobile arrows */}
              <div className="mt-4 md:mt-6 flex items-center justify-center gap-3">
                {/* Mobile arrows */}
                <button
                  onClick={goPrev}
                  className="md:hidden w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white transition-all flex-shrink-0"
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>

                <div
                  ref={thumbTrackRef}
                  className="flex gap-1.5 overflow-x-auto scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {webShowcaseProjects.map((project, idx) => (
                    <button
                      key={project.id}
                      onClick={() => goToIndex(idx)}
                      className={`relative rounded-md overflow-hidden transition-all duration-300 flex-shrink-0 ${
                        idx === activeIndex
                          ? 'ring-1 ring-[#61F6FD]/60 shadow-[0_0_10px_rgba(97,246,253,0.2)] scale-110 opacity-100'
                          : 'opacity-30 hover:opacity-60'
                      }`}
                      style={{ width: idx === activeIndex ? '52px' : '44px', height: idx === activeIndex ? '32px' : '28px' }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Mobile arrows */}
                <button
                  onClick={goNext}
                  className="md:hidden w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white transition-all flex-shrink-0"
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Subtle project details */}
              <div className="mt-3 text-center">
                <p className="text-white/15 text-[9px] font-bold uppercase tracking-[0.5em]">
                  {activeProject.client} — {activeProject.year}
                </p>
              </div>
            </div>

            {/* Scroll indicator — bounce arrow */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${isSticky ? 'opacity-40' : 'opacity-0'}`}>
              <div className="flex flex-col items-center gap-1 animate-bounce">
                <ChevronDown size={16} className="text-white/30" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for scroll distance after sticky releases (desktop only) */}
        <div className="hidden lg:block" style={{ height: '60vh' }} />
      </section>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          {/* Fullscreen top bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-[#0a0a0a] border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
                <span className="text-white font-black uppercase tracking-tight text-sm">{activeProject.title}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#61F6FD]">{activeProject.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                {activeIndex + 1} / {webShowcaseProjects.length}
              </span>
              <button
                onClick={goNext}
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronRight size={16} />
              </button>
              <a
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 transition-all ml-2"
              >
                <ExternalLink size={10} />
                Open
              </a>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all ml-2"
              >
                ESC
              </button>
            </div>
          </div>

          {/* Fullscreen previews */}
          <div className="flex-1 relative overflow-hidden">
            {webShowcaseProjects.map((project, idx) => renderFullscreenPreview(project, idx))}
          </div>
        </div>
      )}
    </>
  );
};

export default WebShowcase;
