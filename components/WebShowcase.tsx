
import React, { useRef, useState, useEffect } from 'react';
import { Globe, ExternalLink, Code, ChevronLeft, ChevronRight } from 'lucide-react';
import { webShowcaseProjects } from '../data/projects';

const WebShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [autoScrollStates, setAutoScrollStates] = useState<boolean[]>(
    webShowcaseProjects.map(() => true)
  );

  const activeProject = webShowcaseProjects[activeIndex];

  // Auto-scroll animation for active card
  useEffect(() => {
    const container = scrollRefs.current[activeIndex];
    if (!container || !autoScrollStates[activeIndex]) return;

    let animationId: number;
    let startTime: number | null = null;
    const duration = 12000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (container) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTop = eased * maxScroll * 0.4;
      }

      if (progress < 1 && autoScrollStates[activeIndex]) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);
    };
  }, [activeIndex, autoScrollStates]);

  // Reset auto-scroll when switching cards
  useEffect(() => {
    setAutoScrollStates(prev => {
      const next = [...prev];
      next[activeIndex] = true;
      return next;
    });
    // Reset scroll position
    const container = scrollRefs.current[activeIndex];
    if (container) container.scrollTop = 0;
  }, [activeIndex]);

  const stopAutoScroll = (idx: number) => {
    setAutoScrollStates(prev => {
      const next = [...prev];
      next[idx] = false;
      return next;
    });
  };

  const goNext = () => setActiveIndex((prev) => (prev + 1) % webShowcaseProjects.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + webShowcaseProjects.length) % webShowcaseProjects.length);

  return (
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
              <span className="text-[#F7E644] mr-2 md:mr-6">"</span>
              WEBSITES
            </span>
            <span className="mx-2 md:mx-4">WE</span>
            <span className="inline-flex items-center whitespace-nowrap">
              BUILT
              <span className="text-[#F7E644] ml-2 md:ml-6">"</span>
            </span>
          </h2>
        </div>

        {/* Main showcase area */}
        <div className="max-w-6xl mx-auto">
          {/* Active website preview - scrollable screenshot */}
          <div className="relative mb-8">
            <a
              href={activeProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#25D366]/20 hover:border-[#25D366]/40 hover:text-[#25D366] transition-all"
            >
              <Globe size={12} />
              Bekijk live
              <ExternalLink size={10} />
            </a>

            <div
              ref={(el) => { scrollRefs.current[activeIndex] = el; }}
              onMouseEnter={() => stopAutoScroll(activeIndex)}
              onTouchStart={() => stopAutoScroll(activeIndex)}
              className="rounded-2xl md:rounded-3xl overflow-hidden overflow-y-auto border border-white/10 bg-[#0a0a0a] shadow-2xl cursor-grab active:cursor-grabbing"
              style={{ maxHeight: '65vh' }}
            >
              <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={activeProject.fullPageScreenshot}
                  alt={`${activeProject.title} website`}
                  className="w-full h-auto block"
                  loading="eager"
                  decoding="async"
                />
              </a>
            </div>

            {/* Fade out bottom hint */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none rounded-b-3xl"></div>
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

            {/* Right: thumbnail navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-2">
                {webShowcaseProjects.map((project, idx) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
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
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronRight size={18} />
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
  );
};

export default WebShowcase;
