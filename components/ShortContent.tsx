import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { X, ChevronUp, ChevronDown, Volume2, VolumeX, Activity, Database, Heart } from 'lucide-react';

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

// ─── Reels Fullscreen Overlay ────────────────────────────────────────────
const ReelsOverlay: React.FC<{
  videos: { src: string }[];
  startIndex: number;
  onClose: () => void;
}> = ({ videos, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowUp' && currentIndex > 0) goTo(currentIndex - 1);
      if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) goTo(currentIndex + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, videos.length]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = 0.5;
    }
  }, [isMuted, currentIndex]);

  const goTo = (idx: number) => {
    if (isTransitioning || idx < 0 || idx >= videos.length) return;
    setIsTransitioning(true);
    const direction = idx > currentIndex ? -1 : 1;
    setSwipeOffset(direction * 100);
    setTimeout(() => {
      setCurrentIndex(idx);
      setSwipeOffset(direction * -100);
      setTimeout(() => {
        setSwipeOffset(0);
        setIsTransitioning(false);
      }, 50);
    }, 250);
  };

  // Touch handling for vertical swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
    // Show partial swipe feedback
    const pct = (touchDeltaY.current / window.innerHeight) * 100;
    setSwipeOffset(Math.max(-30, Math.min(30, pct)));
  };

  const onTouchEnd = () => {
    const threshold = 60;
    if (touchDeltaY.current < -threshold && currentIndex < videos.length - 1) {
      goTo(currentIndex + 1);
    } else if (touchDeltaY.current > threshold && currentIndex > 0) {
      goTo(currentIndex - 1);
    } else {
      setSwipeOffset(0);
    }
    touchDeltaY.current = 0;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Video */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateY(${swipeOffset}%)`,
          transition: isTransitioning ? 'none' : swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        <video
          ref={videoRef}
          key={videos[currentIndex].src}
          src={videos[currentIndex].src}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-contain"
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
            {currentIndex + 1} / {videos.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation arrows (desktop) */}
      <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronUp size={20} />
        </button>
        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === videos.length - 1}
          className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Progress dots (right side) */}
      <div className="absolute right-3 md:hidden top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {videos.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'h-6 bg-white' : 'h-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Bottom spacer for safe area */}
      <div className="h-6" />
    </div>
  );
};

// ─── Infinite Loop Slider ───────────────────────────────────────────────
const InfiniteVideoSlider: React.FC<{
  videos: { src: string }[];
  onVideoClick: (index: number) => void;
}> = ({ videos, onVideoClick }) => {
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
  const hasDragged = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Responsive card dimensions
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

  // Fewer duplicates = less DOM nodes & memory (2x mobile, 3x desktop)
  const allVideos = isMobile
    ? [...videos, ...videos]
    : [...videos, ...videos, ...videos];

  const numSets = isMobile ? 2 : 3;

  useEffect(() => {
    // Start in the middle set
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

    // Seamless wrap within middle sets
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
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    dragStartPos.current = positionRef.current;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = Date.now();
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 5) hasDragged.current = true;

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

  const handleVideoClick = useCallback((globalIndex: number) => {
    if (hasDragged.current) return;
    // Map the global duplicated index back to the original video index
    const originalIndex = globalIndex % setLength;
    onVideoClick(originalIndex);
  }, [setLength, onVideoClick]);

  const handleMouseEnter = useCallback((idx: number) => {
    isPaused.current = true;
    velocityRef.current = 0;
    setHoveredIndex(idx);
    // Unmute hovered video
    const vid = videoRefs.current[idx];
    if (vid) {
      vid.muted = false;
      vid.volume = 0.3;
    }
  }, []);

  const handleMouseLeave = useCallback((_idx: number) => {
    isPaused.current = false;
    setHoveredIndex(null);
    // Mute the video again
    const vid = videoRefs.current[_idx];
    if (vid) {
      vid.muted = true;
    }
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
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
              className="flex-shrink-0 transition-transform duration-300 ease-out origin-center"
              style={{
                width: `${cardWidth}px`,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => handleVideoClick(i)}
            >
              <div className="w-full bg-black relative group"
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
  const [reelsOpen, setReelsOpen] = useState(false);
  const [reelsStartIndex, setReelsStartIndex] = useState(0);
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

  // Mobile: max 5 videos for performance. Desktop: all videos.
  const videos = isMobileMain ? allVideos.slice(0, 5) : allVideos;

  const handleVideoClick = useCallback((index: number) => {
    setReelsStartIndex(index);
    setReelsOpen(true);
  }, []);

  // Stats observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.1 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="py-10 md:py-28 bg-transparent overflow-hidden relative border-t border-white/5">
        {/* Background watermark */}
        <div className="absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
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
          <InfiniteVideoSlider videos={videos} onVideoClick={handleVideoClick} />
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
                <div key={i} className="relative p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-700 group hover:border-white/[0.12]">
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

      {/* Reels Fullscreen Overlay */}
      {reelsOpen && (
        <ReelsOverlay
          videos={videos}
          startIndex={reelsStartIndex}
          onClose={() => setReelsOpen(false)}
        />
      )}
    </>
  );
};

export default ShortContent;
