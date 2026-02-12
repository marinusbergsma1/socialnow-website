import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Activity, Database, Shield, Network } from 'lucide-react';

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

// ─── Infinite Loop Slider ───────────────────────────────────────────────
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

  // Responsive card dimensions
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cardWidth = isMobile ? 160 : 280;
  const cardHeight = isMobile ? 320 : 530;
  const gap = isMobile ? 10 : 20;
  const totalItemWidth = cardWidth + gap;
  const setLength = videos.length;
  const totalSetWidth = totalItemWidth * setLength;

  // Auto-scroll speed — consistent visual speed regardless of card size
  const autoSpeed = isMobile ? 0.5 : 0.8;

  // We render 5 copies for seamless wrapping
  const allVideos = [...videos, ...videos, ...videos, ...videos, ...videos];

  // Start in the middle
  useEffect(() => {
    positionRef.current = totalSetWidth * 2;
  }, [totalSetWidth]);

  // Animation loop - smooth with translate3d
  const animate = useCallback(() => {
    if (!isDragging.current && !isPaused.current) {
      if (Math.abs(velocityRef.current) > 0.3) {
        // Momentum from drag
        positionRef.current += velocityRef.current;
        velocityRef.current *= 0.96;
      } else {
        // Auto scroll
        positionRef.current += autoSpeed;
        velocityRef.current = 0;
      }
    }

    // Seamless wrap
    if (positionRef.current >= totalSetWidth * 3) {
      positionRef.current -= totalSetWidth;
    }
    if (positionRef.current <= totalSetWidth) {
      positionRef.current += totalSetWidth;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [totalSetWidth, autoSpeed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  // Pointer events for drag/slide
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
    const dx = e.clientX - lastPointerX.current;

    if (dt > 0) {
      velocityRef.current = (-dx / dt) * 16; // normalize to ~60fps
    }

    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;

    const totalDx = e.clientX - dragStartX.current;
    positionRef.current = dragStartPos.current - totalDx;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Hover: pause slider + enable audio
  const handleMouseEnter = useCallback((idx: number) => {
    isPaused.current = true;
    velocityRef.current = 0;
    setHoveredIndex(idx);
    const video = videoRefs.current[idx];
    if (video) {
      video.muted = false;
      video.volume = 0.4;
    }
  }, []);

  const handleMouseLeave = useCallback((idx: number) => {
    isPaused.current = false;
    setHoveredIndex(null);
    const video = videoRefs.current[idx];
    if (video) {
      video.muted = true;
    }
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: 'pan-y' }}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: `${gap}px` }}
      >
        {allVideos.map((video, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
              className="flex-shrink-0 transition-transform duration-300 ease-out origin-center"
              style={{
                width: `${cardWidth}px`,
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <div className="w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-black relative transition-all duration-300"
                style={{
                  height: `${cardHeight}px`,
                  boxShadow: isHovered ? '0 0 40px rgba(37,211,102,0.4), inset 0 0 30px rgba(37,211,102,0.05)' : 'none',
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

  const videos = [
    { src: `${base}videos/raveg-dyadium.mp4` },
    { src: `${base}videos/viral-cho.mp4` },
    { src: `${base}videos/muse-mode.mp4` },
    { src: `${base}videos/bakboord.mp4` },
    { src: "https://storage.googleapis.com/video-slider/909%20Festival_Aftermovie%20in%20Reverse.mp4" },
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

  // Stats observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.1 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-36 bg-black overflow-hidden relative border-t border-white/5">
      {/* Header */}
      <div className="container mx-auto px-6 relative z-10 text-center mb-12 md:mb-20">
        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-white/10 bg-white/5 mb-10 backdrop-blur-xl">
          <Network size={16} className="text-[#61F6FD]" />
          <span className="text-white font-black uppercase tracking-[0.4em] text-[10px]">CONTENT_OS_SYNC // V3.2</span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tighter leading-none mb-10">
          SHORT FORM <br/> <span className="text-[#F7E644]">&ldquo;</span>CONTENT<span className="text-[#F7E644]">&rdquo;</span>
        </h2>
      </div>

      {/* Infinite Loop Video Slider */}
      <div className="relative">
        <InfiniteVideoSlider videos={videos} />
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 mt-24 md:mt-32 z-10" ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center">
          {[
            { label: "Followers", end: 2, icon: Activity, color: "#F7E644", id: "01" },
            { label: "Likes", end: 500, icon: Database, color: "#61F6FD", id: "02" },
            { label: "Reach", end: 800, icon: Shield, color: "#F62961", id: "03" }
          ].map((stat, i) => (
            <div key={i} className="relative p-8 md:p-10 rounded-[2.5rem] bg-[#050505] border border-white/10 transition-all duration-700 flex flex-col items-center group">
              <div className="absolute top-0 right-0 w-40 h-40 blur-[100px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundColor: stat.color }} />
              <div className="flex items-center gap-3 mb-6 opacity-30 group-hover:opacity-50 transition-opacity">
                <stat.icon size={16} style={{ color: stat.color }} />
                <span className="text-[10px] font-bold tracking-[0.4em] text-white/60 uppercase">METRIC_OS_{stat.id}</span>
              </div>
              <h4 className="text-6xl md:text-7xl font-black mb-3 tracking-tighter" style={{ color: stat.color }}>
                <CountUp end={stat.end} start={statsVisible} suffix="m+" />
              </h4>
              <span className="block text-white uppercase font-bold tracking-[0.3em] text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortContent;
