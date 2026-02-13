import React, { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Activity, Database, Heart, Volume2, VolumeX } from 'lucide-react';

// Global audio context: only one video can be unmuted at a time across the entire page
let globalUnmutedVideo: HTMLVideoElement | null = null;
let globalUnmuteListener: (() => void) | null = null;

export function muteGlobalVideo() {
  if (globalUnmutedVideo) {
    globalUnmutedVideo.muted = true;
    globalUnmutedVideo = null;
  }
  if (globalUnmuteListener) {
    globalUnmuteListener();
    globalUnmuteListener = null;
  }
}

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

// ─── Infinite Loop Video Slider ───────────────────────────────────────────
const InfiniteVideoSlider: React.FC<{ videos: { src: string }[] }> = ({ videos }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const positionRef = useRef(0);
  const isDragging = useRef(false);
  const isPaused = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const velocityRef = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null);
  const dragDistRef = useRef(0);

  // Use refs for screen dimensions to avoid re-renders that kill video playback
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const screenWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 375);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onResize = () => {
      const wasMobile = isMobileRef.current;
      isMobileRef.current = window.innerWidth < 768;
      screenWidthRef.current = window.innerWidth;
      // Only re-render if mobile breakpoint actually changed
      if (wasMobile !== isMobileRef.current) {
        forceUpdate(n => n + 1);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = isMobileRef.current;
  const screenWidth = screenWidthRef.current;

  // Desktop: responsive card width showing ~3.5 cards in viewport
  const cardWidth = isMobile
    ? Math.round(screenWidth * 0.56)
    : Math.min(480, Math.max(380, Math.round(screenWidth * 0.27)));
  const cardHeight = Math.round(cardWidth * (16 / 9));
  const gap = isMobile ? 14 : 32;
  const totalItemWidth = cardWidth + gap;
  const setLength = videos.length;
  const totalSetWidth = totalItemWidth * setLength;

  const autoSpeed = isMobile ? 0.5 : 0.6;

  // Refs for animation values to prevent rAF loop restarts (= frame-skip = stutter)
  const totalSetWidthRef = useRef(totalSetWidth);
  const autoSpeedRef = useRef(autoSpeed);
  useEffect(() => { totalSetWidthRef.current = totalSetWidth; }, [totalSetWidth]);
  useEffect(() => { autoSpeedRef.current = autoSpeed; }, [autoSpeed]);

  // Memoize allVideos to prevent React from recreating video DOM elements on re-render
  const allVideos = useMemo(() => [...videos, ...videos, ...videos], [videos]);

  // Start in the middle set
  useEffect(() => {
    positionRef.current = totalSetWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
    }
  }, [totalSetWidth]);

  // Ensure all slider videos are playing — keep retrying continuously
  useEffect(() => {
    let cancelled = false;
    const playAll = () => {
      if (cancelled) return;
      videoRefs.current.forEach((vid) => {
        // Skip the intentionally unmuted video to prevent race conditions
        if (vid && vid.paused && vid !== globalUnmutedVideo) {
          vid.muted = true;
          vid.play().catch(() => {});
        }
      });
      if (!cancelled) {
        setTimeout(playAll, 2000);
      }
    };
    const timer = setTimeout(playAll, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable animate callback — reads all changing values via refs, no dependencies
  const animate = useCallback(() => {
    const tsw = totalSetWidthRef.current;
    const speed = autoSpeedRef.current;

    if (!isDragging.current && !isPaused.current) {
      if (Math.abs(velocityRef.current) > 0.3) {
        positionRef.current += velocityRef.current;
        velocityRef.current *= 0.95;
      } else {
        positionRef.current += speed;
        velocityRef.current = 0;
      }
    }

    // Seamless wrap
    if (positionRef.current >= tsw * 2) {
      positionRef.current -= tsw;
    }
    if (positionRef.current <= 0) {
      positionRef.current += tsw;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPos.current = positionRef.current;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = Date.now();
    dragDistRef.current = 0;
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = Date.now();
    const dt = now - lastPointerTime.current;
    const moveDx = e.clientX - lastPointerX.current;
    dragDistRef.current += Math.abs(moveDx);
    if (dt > 0) velocityRef.current = (-moveDx / dt) * 16;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;
    const totalDx = e.clientX - dragStartX.current;
    positionRef.current = dragStartPos.current - totalDx;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Tap/click to toggle sound — works on both mobile and desktop
  const handleTap = useCallback((idx: number) => {
    if (dragDistRef.current > 10) return;

    const vid = videoRefs.current[idx];
    if (!vid) return;

    if (unmutedIndex === idx) {
      // Already unmuted → mute it
      vid.muted = true;
      globalUnmutedVideo = null;
      globalUnmuteListener = null;
      setUnmutedIndex(null);
    } else {
      // Mute any globally unmuted video first
      muteGlobalVideo();
      // Mute all slider videos
      videoRefs.current.forEach((v) => { if (v) v.muted = true; });
      // Unmute this one and play with sound
      vid.muted = false;
      vid.volume = 0.5;
      // Robust play: reload if stalled
      if (vid.readyState < 3) {
        vid.load();
      }
      vid.play().catch(() => {});
      globalUnmutedVideo = vid;
      globalUnmuteListener = () => setUnmutedIndex(null);
      setUnmutedIndex(idx);
    }
  }, [unmutedIndex]);

  // Desktop hover handlers — only pause/resume slider animation, don't control mute
  const handleMouseEnter = useCallback((idx: number) => {
    if (window.innerWidth < 768) return;
    isPaused.current = true;
    velocityRef.current = 0;
    setHoveredIndex(idx);
  }, []);

  const handleMouseLeave = useCallback((_idx: number) => {
    if (window.innerWidth < 768) return;
    isPaused.current = false;
    setHoveredIndex(null);
  }, []);

  return (
    <div
      className="relative w-full cursor-grab active:cursor-grabbing select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: 'pan-y', overflow: 'clip', padding: `${isMobile ? 16 : 40}px 0` }}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: `${gap}px` }}
      >
        {allVideos.map((video, i) => {
          const isHovered = !isMobile && hoveredIndex === i;
          const isUnmuted = unmutedIndex === i;
          return (
            <div
              key={i}
              className="flex-shrink-0 relative"
              style={{
                width: `${cardWidth}px`,
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isHovered || isUnmuted ? 10 : 1,
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => handleTap(i)}
            >
              <div className="w-full bg-black relative"
                style={{
                  height: `${cardHeight}px`,
                  borderRadius: isMobile ? '1rem' : '1.25rem',
                  overflow: 'hidden',
                  border: isHovered
                    ? '1px solid rgba(37, 211, 102, 0.3)'
                    : isUnmuted
                      ? '1px solid rgba(37, 211, 102, 0.15)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isHovered
                    ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(37, 211, 102, 0.15)'
                    : '0 8px 32px rgba(0, 0, 0, 0.4)',
                  transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                }}
              >
                <video
                  ref={el => { videoRefs.current[i] = el; }}
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover pointer-events-none"
                />
                {/* Gradient overlay for depth */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
                    opacity: isHovered ? 0.6 : 0.3,
                    transition: 'opacity 0.4s ease',
                  }}
                />
              </div>
              {/* Sound indicator — pill with label */}
              <div
                className={`absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-300 ${
                  isUnmuted
                    ? 'bg-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.3)]'
                    : 'bg-black/70 backdrop-blur-md border border-white/10'
                }`}
              >
                {isUnmuted
                  ? <Volume2 size={14} className="text-black" />
                  : <VolumeX size={14} className="text-white/50" />
                }
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    isUnmuted ? 'text-black' : 'text-white/40'
                  }`}
                >
                  {isUnmuted ? 'ON' : 'TAP'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────
const ShortContent: React.FC = () => {
  const base = import.meta.env.BASE_URL;
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const [isMobileMain, setIsMobileMain] = useState(false);
  useEffect(() => {
    const check = () => setIsMobileMain(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const allVideos = [
    { src: `${base}videos/raveg-dyadium.mp4` },
    { src: `${base}videos/viral-cho.mp4` },
    { src: `${base}videos/muse-mode.mp4` },
    { src: `${base}videos/bakboord.mp4` },
    { src: "https://storage.googleapis.com/video-slider/CHIN%20CHIN%20CLUB%20-%20DINE%26DANCE.mp4" },
    { src: "https://storage.googleapis.com/video-slider/CHIN%20CHIN%20CLUB%20FREAKY.mp4" },
    { src: "https://storage.googleapis.com/video-slider/VIRAL%20BRYAN%20MG.mp4" },
    { src: "https://storage.googleapis.com/video-slider/viral_chiq-edition_v1.mp4" },
    { src: "https://storage.googleapis.com/video-slider/viral_pretty-girls-edition_v1.mp4" },
    { src: "https://storage.googleapis.com/video-slider/newyear_supperclub_countdown_1day.mp4" },
    { src: "https://storage.googleapis.com/video-slider/VIRAL_17-02_PROMO-VID.mp4" },
    { src: "https://storage.googleapis.com/video-slider/WEEK%2046%20-%20Friday%20-%20FRIDAY%20FRESHNESS.mp4" },
    { src: "https://storage.googleapis.com/video-slider/jobdex_vid_oranjebloesem_personeel.mp4" },
  ];

  // Mobile: 6 videos for smooth infinite loop (18 DOM nodes with 3x duplication). Desktop: all videos.
  const videos = isMobileMain ? allVideos.slice(0, 6) : allVideos;

  // Stats observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.1 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-10 md:py-28 bg-transparent overflow-hidden relative border-t border-white/5">
      {/* Background watermark — desktop only */}
      <div className="hidden md:block absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
        <h2 className="text-[25vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">MOTION</h2>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 relative z-10 text-center mb-4 md:mb-14">
        <h2 className="text-2xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-none mb-3 md:mb-4">
          CONTENT DIE VIRAL GAAT
        </h2>
        <p className="text-gray-500 text-xs md:text-base font-medium max-w-lg mx-auto">
          Van 0 naar 2 miljoen volgers. Wij creëren de reels waarover jouw doelgroep praat, deelt en koopt.
        </p>
      </div>

      {/* Infinite Loop Video Slider */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
        <InfiniteVideoSlider videos={videos} />
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 mt-8 md:mt-24 z-10" ref={statsRef}>
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          {[
            { label: "Volgers gegenereerd", end: 2, id: "01", color: "#F7E644", icon: Activity },
            { label: "Totaal engagement", end: 500, id: "02", color: "#00A3E0", icon: Database },
            { label: "Views bereikt", end: 800, id: "03", color: "#F62961", icon: Heart }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="relative p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-700 group hover:border-white/[0.12]">
                {/* Metric label */}
                <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-6">
                  <Icon size={12} style={{ color: stat.color }} className="opacity-60" />
                  <span className="text-white/20 uppercase font-mono font-bold tracking-[0.3em] text-[7px] md:text-[10px]">METRIC_OS_{stat.id}</span>
                </div>
                {/* Big number */}
                <h4 className="text-3xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none" style={{ color: stat.color }}>
                  <CountUp end={stat.end} start={statsVisible} suffix="m+" />
                </h4>
                {/* Label */}
                <span className="block text-white/25 uppercase font-bold tracking-[0.3em] text-[7px] md:text-[10px] mt-1 md:mt-3">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShortContent;
