import React, { useRef, useState, useEffect, memo, useMemo, useCallback, TouchEvent as ReactTouchEvent } from 'react';
import { Activity, Volume2, VolumeX, Database, Network, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── CountUp ────────────────────────────────────────────────────────────
const CountUp = memo(({ end, duration = 2000, start, suffix = "m+" }: { end: number; duration?: number; start: boolean; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration]);
  return <span>{Math.floor(count)}{suffix}</span>;
});

// ─── Video Slide ────────────────────────────────────────────────────────
interface VideoSlideProps {
  src: string;
  isActive: boolean;
  isAdjacent: boolean;
  offset: number;
}

const VideoSlide = memo(({ src, isActive, isAdjacent, offset }: VideoSlideProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hasLoadedOnce = useRef(false);

  // Play/pause based on active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    if (isActive) {
      if (!hasLoadedOnce.current) {
        video.src = src;
        video.load();
        hasLoadedOnce.current = true;
      }
      video.currentTime = 0;
      const p = video.play();
      if (p) p.catch(() => { video.muted = true; video.play().catch(() => {}); });
    } else if (isAdjacent && !hasLoadedOnce.current) {
      video.src = src;
      video.load();
      hasLoadedOnce.current = true;
      video.pause();
    } else {
      video.pause();
    }
  }, [isActive, isAdjacent, src, hasError]);

  // Mute control
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Reset mute when inactive
  useEffect(() => {
    if (!isActive) setIsMuted(true);
  }, [isActive]);

  const absOffset = Math.abs(offset);
  if (absOffset > 2) return null;

  const scale = isActive ? 1 : 0.82;
  const opacity = isActive ? 1 : absOffset === 1 ? 0.45 : 0.15;
  const zIndex = 20 - absOffset;

  return (
    <div
      className="absolute top-1/2 left-1/2 w-[220px] md:w-[340px] h-[380px] md:h-[600px]"
      style={{
        '--slide-offset': offset,
        transform: `translate(-50%, -50%) translateX(calc(var(--slide-offset) * var(--slide-gap))) scale(${scale})`,
        opacity,
        zIndex,
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      } as React.CSSProperties}
    >
      <div
        className={`
          w-full h-full rounded-[2rem] md:rounded-[3rem] relative bg-black border-2 overflow-hidden
          transition-shadow duration-600
          ${isActive
            ? 'border-[#25D366] shadow-[0_0_80px_rgba(37,211,102,0.15)]'
            : 'border-white/5'}
        `}
      >
        {/* Loading */}
        <div className={`absolute inset-0 z-10 bg-black flex items-center justify-center transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {!hasError && (isActive || isAdjacent) && (
            <div className="w-6 h-6 border-2 border-white/5 border-t-[#25D366] rounded-full animate-spin" />
          )}
        </div>

        {/* Video */}
        {!hasError && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            onError={() => setHasError(true)}
            onPlaying={() => setIsLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Error fallback */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
            Video niet beschikbaar
          </div>
        )}

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 transition-opacity duration-500 ${isActive ? 'opacity-0' : 'opacity-100'}`} />

        {/* Sound toggle */}
        {isActive && isLoaded && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsMuted(m => !m); }}
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 p-2.5 md:p-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 z-30 transition-all duration-300 hover:bg-black/80 hover:border-white/20"
          >
            {isMuted
              ? <VolumeX className="w-4 h-4 md:w-[18px] md:h-[18px] text-white/60" />
              : <Volume2 className="w-4 h-4 md:w-[18px] md:h-[18px] text-[#25D366]" />
            }
          </button>
        )}
      </div>
    </div>
  );
});

// ─── Main Component ─────────────────────────────────────────────────────
const ShortContent: React.FC = () => {
  const base = import.meta.env.BASE_URL;

  const videoSources = useMemo(() => [
    `${base}videos/raveg-dyadium.mp4`,
    `${base}videos/viral-cho.mp4`,
    `${base}videos/muse-mode.mp4`,
    `${base}videos/bakboord.mp4`,
  ], [base]);

  const total = videoSources.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Drag state
  const startX = useRef(0);
  const dragging = useRef(false);
  const delta = useRef(0);

  // Stats observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.1 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const goNext = useCallback(() => setActiveIndex(p => (p + 1) % total), [total]);
  const goPrev = useCallback(() => setActiveIndex(p => (p - 1 + total) % total), [total]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') goNext(); if (e.key === 'ArrowLeft') goPrev(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev]);

  // Touch
  const onTouchStart = useCallback((e: ReactTouchEvent) => {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
    delta.current = 0;
  }, []);

  const onTouchMove = useCallback((e: ReactTouchEvent) => {
    if (dragging.current) delta.current = e.touches[0].clientX - startX.current;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (delta.current < -50) goNext();
    else if (delta.current > 50) goPrev();
    delta.current = 0;
  }, [goNext, goPrev]);

  // Mouse drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    startX.current = e.clientX;
    dragging.current = true;
    delta.current = 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging.current) delta.current = e.clientX - startX.current;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (delta.current < -50) goNext();
    else if (delta.current > 50) goPrev();
    delta.current = 0;
  }, [goNext, goPrev]);

  // Auto-advance (resets on user interaction)
  useEffect(() => {
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext, activeIndex]);

  // Calculate offset for each slide (with wrap-around)
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section className="py-24 md:py-48 bg-black overflow-hidden relative border-t border-white/5">
      {/* Header */}
      <div className="container mx-auto px-6 relative z-10 text-center mb-12 md:mb-24">
        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-xl">
          <Network size={16} className="text-[#61F6FD]" />
          <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">CONTENT_OS_SYNC // V3.2</span>
        </div>
        <h2 className="text-5xl md:text-[10rem] font-black uppercase text-white tracking-tighter leading-none mb-10">
          SHORT FORM <br/> <span className="text-[#F7E644]">&ldquo;</span>CONTENT<span className="text-[#F7E644]">&rdquo;</span>
        </h2>
      </div>

      {/* Carousel */}
      <div
        className="video-carousel relative w-full h-[440px] md:h-[680px] select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {videoSources.map((src, i) => {
          const off = getOffset(i);
          const isAdj = Math.abs(off) === 1;
          return (
            <VideoSlide
              key={src}
              src={src}
              offset={off}
              isActive={i === activeIndex}
              isAdjacent={isAdj}
            />
          );
        })}

        {/* Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-black/60 hover:border-white/20 hover:scale-110 group"
          aria-label="Vorige video"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white transition-colors" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 p-3 md:p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-black/60 hover:border-white/20 hover:scale-110 group"
          aria-label="Volgende video"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white transition-colors" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {videoSources.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? 'w-8 h-2.5 bg-[#25D366]'
                  : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Video ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 mt-32 md:mt-40 z-10" ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {[
            { label: "Followers", end: 2, icon: Activity, color: "#F7E644", id: "01" },
            { label: "Likes", end: 500, icon: Database, color: "#61F6FD", id: "02" },
            { label: "Reach", end: 800, icon: Shield, color: "#F62961", id: "03" }
          ].map((stat, i) => (
            <div key={i} className="relative p-8 md:p-14 rounded-[3rem] bg-[#050505] border border-white/10 transition-all duration-700 flex flex-col items-center group">
              <div className="absolute top-0 right-0 w-40 h-40 blur-[100px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundColor: stat.color }} />
              <div className="flex items-center gap-3 mb-8 opacity-30 group-hover:opacity-50 transition-opacity">
                <stat.icon size={16} style={{ color: stat.color }} />
                <span className="text-[10px] font-bold tracking-[0.4em] text-white/60 uppercase">METRIC_OS_{stat.id}</span>
              </div>
              <h4 className="text-7xl md:text-[8rem] font-black mb-4 tracking-tighter" style={{ color: stat.color }}>
                <CountUp end={stat.end} start={statsVisible} suffix="m+" />
              </h4>
              <span className="block text-white uppercase font-bold tracking-[0.3em] text-base">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortContent;
