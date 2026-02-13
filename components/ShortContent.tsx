import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Activity, Database, Heart } from 'lucide-react';

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cardWidth = isMobile ? 80 : 340;
  const cardHeight = isMobile ? 142 : 604;
  const gap = isMobile ? 8 : 24;
  const totalItemWidth = cardWidth + gap;
  const setLength = videos.length;
  const totalSetWidth = totalItemWidth * setLength;

  const autoSpeed = isMobile ? 0.5 : 0.8;

  const allVideos = isMobile
    ? [...videos, ...videos]
    : [...videos, ...videos, ...videos];

  const numSets = isMobile ? 2 : 3;

  useEffect(() => {
    positionRef.current = totalSetWidth * Math.floor(numSets / 2);
  }, [totalSetWidth, numSets]);

  const animate = useCallback(() => {
    if (!isDragging.current && !isPaused.current) {
      if (Math.abs(velocityRef.current) > 0.3) {
        positionRef.current += velocityRef.current;
        velocityRef.current *= 0.96;
      } else {
        positionRef.current += autoSpeed;
        velocityRef.current = 0;
      }
    }

    if (positionRef.current >= totalSetWidth * (numSets - 1)) positionRef.current -= totalSetWidth;
    if (positionRef.current <= totalSetWidth) positionRef.current += totalSetWidth;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [totalSetWidth, autoSpeed, numSets]);

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
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = Date.now();
    const dt = now - lastPointerTime.current;
    const moveDx = e.clientX - lastPointerX.current;
    if (dt > 0) velocityRef.current = (-moveDx / dt) * 16;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;
    const totalDx = e.clientX - dragStartX.current;
    positionRef.current = dragStartPos.current - totalDx;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Desktop-only hover handlers
  const handleMouseEnter = useCallback((idx: number) => {
    if (window.innerWidth < 768) return;
    isPaused.current = true;
    velocityRef.current = 0;
    setHoveredIndex(idx);
    const vid = videoRefs.current[idx];
    if (vid) { vid.muted = false; vid.volume = 0.3; }
  }, []);

  const handleMouseLeave = useCallback((idx: number) => {
    if (window.innerWidth < 768) return;
    isPaused.current = false;
    setHoveredIndex(null);
    const vid = videoRefs.current[idx];
    if (vid) vid.muted = true;
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
          return (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                width: `${cardWidth}px`,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: isHovered ? 'transform 0.3s ease-out' : 'none',
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <div className="w-full bg-black"
                style={{
                  height: `${cardHeight}px`,
                  borderRadius: isMobile ? '0.6rem' : '1.5rem',
                  overflow: 'hidden',
                  boxShadow: isHovered ? '0 0 30px rgba(37,211,102,0.3)' : 'none',
                }}
              >
                <video
                  ref={el => { videoRefs.current[i] = el; }}
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover pointer-events-none"
                />
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

  // Mobile: max 4 videos for performance. Desktop: all videos.
  const videos = isMobileMain ? allVideos.slice(0, 4) : allVideos;

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
          SHORT FORM CONTENT
        </h2>
        <p className="text-gray-500 text-xs md:text-base font-medium max-w-lg mx-auto">
          Van virale reels tot branded content. Wij maken scroll-stopping video's die converteren.
        </p>
      </div>

      {/* Infinite Loop Video Slider */}
      <div className="relative">
        <InfiniteVideoSlider videos={videos} />
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 mt-8 md:mt-24 z-10" ref={statsRef}>
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          {[
            { label: "Followers", end: 2, id: "01", color: "#F7E644", icon: Activity },
            { label: "Likes", end: 500, id: "02", color: "#5BA4F5", icon: Database },
            { label: "Reach", end: 800, id: "03", color: "#F62961", icon: Heart }
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
