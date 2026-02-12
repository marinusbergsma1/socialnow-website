
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, ExternalLink, Code, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { webShowcaseProjects } from '../data/projects';

// Detect if we're inside an iframe (to prevent recursive loading)
const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

const WebShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState<boolean[]>(
    webShowcaseProjects.map(() => false)
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const thumbTrackRef = useRef<HTMLDivElement>(null);

  const activeProject = webShowcaseProjects[activeIndex];

  // Mark iframe as loaded
  const handleIframeLoad = useCallback((idx: number) => {
    setIframeLoaded(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  // Navigation
  const goNext = () => setActiveIndex((prev) => (prev + 1) % webShowcaseProjects.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + webShowcaseProjects.length) % webShowcaseProjects.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

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

  // Helper: should this project use screenshot fallback?
  // Only use screenshot for SocialNow when we're already inside an iframe (prevents infinite recursion)
  const shouldUseScreenshot = (project: typeof activeProject) => {
    const isSelf = project.url?.includes('socialnow-website');
    return isSelf && isInIframe;
  };

  const renderPreview = (project: typeof activeProject, idx: number, isFS: boolean) => {
    if (shouldUseScreenshot(project)) {
      // Screenshot fallback — only when nested in iframe
      return (
        <div
          key={isFS ? `fs-${project.id}` : project.id}
          className={isFS
            ? `w-full h-full overflow-y-auto ${idx === activeIndex ? 'block' : 'hidden'}`
            : `w-full h-full overflow-y-auto transition-opacity duration-500 ${idx === activeIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'}`
          }
        >
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={project.fullPageScreenshot}
              alt={`${project.title} website`}
              className="w-full h-auto block"
              loading="lazy"
              onLoad={() => !isFS && handleIframeLoad(idx)}
            />
          </a>
        </div>
      );
    }

    // Live iframe — default for all projects
    return (
      <iframe
        key={isFS ? `fs-${project.id}` : project.id}
        src={project.url}
        title={`${project.title} - ${isFS ? 'Fullscreen' : 'Live'} Preview`}
        className={isFS
          ? `w-full h-full border-0 ${idx === activeIndex ? 'block' : 'hidden'}`
          : `w-full h-full border-0 transition-opacity duration-500 ${idx === activeIndex ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'}`
        }
        style={{ colorScheme: 'normal' }}
        onLoad={!isFS ? () => handleIframeLoad(idx) : undefined}
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading={idx === 0 ? 'eager' : 'lazy'}
      />
    );
  };

  return (
    <>
      <section className="py-20 md:py-32 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-12 md:mb-20 text-center">
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
          </div>

          {/* Main showcase area */}
          <div className="max-w-6xl mx-auto">
            {/* Live website iframe preview */}
            <div className="relative mb-8" ref={iframeContainerRef}>
              {/* Top action bar */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  <Maximize2 size={12} />
                  Fullscreen
                </button>
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 hover:border-[#25D366]/40 hover:text-[#25D366] transition-all"
                >
                  <Globe size={12} />
                  Bekijk live
                  <ExternalLink size={10} />
                </a>
              </div>

              {/* Iframe container */}
              <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl relative"
                style={{ height: '70vh', minHeight: '400px' }}
              >
                {/* Loading state */}
                {!iframeLoaded[activeIndex] && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0a0a0a]">
                    <div className="w-10 h-10 border-2 border-white/10 border-t-[#61F6FD] rounded-full animate-spin mb-4"></div>
                    <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Website laden...</span>
                  </div>
                )}

                {/* Render previews */}
                {webShowcaseProjects.map((project, idx) => renderPreview(project, idx, false))}
              </div>

              {/* Subtle gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-b-3xl"></div>
            </div>

            {/* Project info + navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: project info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#61F6FD]">{activeProject.category}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-2">
                  {activeProject.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  {activeProject.client} — {activeProject.year}
                </p>
              </div>

              {/* Right: thumbnail navigation with arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 hover:border-[#61F6FD]/40 hover:text-[#61F6FD] transition-all flex-shrink-0"
                >
                  <ChevronLeft size={20} />
                </button>

                <div
                  ref={thumbTrackRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {webShowcaseProjects.map((project, idx) => (
                    <button
                      key={project.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                        idx === activeIndex
                          ? 'border-[#61F6FD] shadow-[0_0_15px_rgba(97,246,253,0.3)] scale-110'
                          : 'border-white/10 opacity-40 hover:opacity-70 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={goNext}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 hover:border-[#61F6FD]/40 hover:text-[#61F6FD] transition-all flex-shrink-0"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Counter */}
            <div className="flex justify-center mt-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
                {activeIndex + 1} / {webShowcaseProjects.length}
              </span>
            </div>
          </div>
        </div>
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
            {webShowcaseProjects.map((project, idx) => renderPreview(project, idx, true))}
          </div>
        </div>
      )}
    </>
  );
};

export default WebShowcase;
