import React, { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Activity, Database, Heart } from 'lucide-react';

// Global audio context: only one video can be unmuted at a time across the entire page
let globalUnmutedVideo: HTMLVideoElement | null = null;
let globalUnmuteListener: (() => void) | null = null;

// Audio unlock: browsers require a user gesture (click/tap) before allowing programmatic unmute.
// Once unlocked, hover-based unmuting works for the rest of the session.
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  // Create + resume an AudioContext to signal to the browser that audio is user-initiated
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    // Also play+pause a silent video to warm up the media pipeline
    const silentVideo = document.createElement('video');
    silentVideo.muted = false;
    silentVideo.volume = 0.01;
    silentVideo.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA';
    silentVideo.play().catch(() => {});
    setTimeout(() => { silentVideo.pause(); silentVideo.remove(); }, 100);
  } catch (_) { /* ignore */ }
  document.removeEventListener('click', unlockAudio, true);
  document.removeEventListener('touchstart', unlockAudio, true);
  document.removeEventListener('pointerdown', unlockAudio, true);
}
// Register unlock listeners globally (once)
if (typeof document !== 'undefined') {
  document.addEventListener('click', unlockAudio, true);
  document.addEventListener('touchstart', unlockAudio, true);
  document.addEventListener('pointerdown', unlockAudio, true);
}

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

// ─── Lazy Slider Video — only loads src when near viewport (mobile) ──────
const LazySliderVideo = React.forwardRef<HTMLVideoElement, { src: string; isMobile: boolean }>(
  ({ src, isMobile }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(!isMobile);

    useEffect(() => {
      if (!isMobile || shouldLoad) return;
      const el = containerRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); obs.disconnect(); } },
        { rootMargin: '200px', threshold: 0 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, [isMobile, shouldLoad]);

    return (
      <div ref={containerRef} className="w-full h-full">
        <video
          ref={ref}
          src={shouldLoad ? src : undefined}
          autoPlay={shouldLoad}
          loop
          muted
          playsInline
          preload={isMobile ? "none" : "metadata"}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    );
  }
);

// ─── Infinite Loop Video Slider ───────────────────────────────────────────
const InfiniteVideoSlider: React.FC<{ videos: { src: string; hdSrc?: string }[] }> = ({ videos }) => {
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
  // Track which videos have been upgraded to HD
  const hdLoadedRef = useRef<Set<number>>(new Set());
  const hdLoadingRef = useRef<Set<number>>(new Set());

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
    window.addEventListener('resize', onResize, { passive: true });
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

  // Upgrade a video to HD when the user interacts with it
  const upgradeToHD = useCallback((idx: number) => {
    const originalIdx = idx % videos.length;
    const video = videos[originalIdx];
    if (!video.hdSrc || hdLoadedRef.current.has(originalIdx) || hdLoadingRef.current.has(originalIdx)) return;

    hdLoadingRef.current.add(originalIdx);

    // Preload HD video in background
    const preloader = document.createElement('video');
    preloader.preload = 'auto';
    preloader.src = video.hdSrc;

    const onCanPlay = () => {
      hdLoadedRef.current.add(originalIdx);
      hdLoadingRef.current.delete(originalIdx);
      // Swap all duplicates of this video to HD
      videoRefs.current.forEach((vid, i) => {
        if (vid && (i % videos.length) === originalIdx) {
          const currentTime = vid.currentTime;
          const wasMuted = vid.muted;
          const wasVolume = vid.volume;
          vid.src = video.hdSrc!;
          vid.currentTime = currentTime;
          vid.muted = wasMuted;
          vid.volume = wasVolume;
          vid.play().catch(() => {});
        }
      });
      preloader.removeEventListener('canplaythrough', onCanPlay);
      preloader.remove();
    };

    preloader.addEventListener('canplaythrough', onCanPlay, { once: true });
    // Timeout: don't wait forever for HD
    setTimeout(() => {
      if (!hdLoadedRef.current.has(originalIdx)) {
        hdLoadingRef.current.delete(originalIdx);
        preloader.removeEventListener('canplaythrough', onCanPlay);
        preloader.remove();
      }
    }, 15000);
  }, [videos]);

  // Refs for animation values to prevent rAF loop restarts (= frame-skip = stutter)
  const totalSetWidthRef = useRef(totalSetWidth);
  const autoSpeedRef = useRef(autoSpeed);
  useEffect(() => { totalSetWidthRef.current = totalSetWidth; }, [totalSetWidth]);
  useEffect(() => { autoSpeedRef.current = autoSpeed; }, [autoSpeed]);

  // Duplicate videos for seamless infinite loop (2x instead of 3x to reduce DOM elements)
  const allVideos = useMemo(() => [...videos, ...videos], [videos]);

  // Start at beginning of first set
  useEffect(() => {
    positionRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(0px, 0, 0)`;
    }
  }, [totalSetWidth]);

  // Ensure all slider videos are playing — retry with longer interval for performance
  useEffect(() => {
    let cancelled = false;
    const retryInterval = isMobile ? 8000 : 4000;
    const playAll = () => {
      if (cancelled) return;
      videoRefs.current.forEach((vid) => {
        if (vid && vid.paused && vid !== globalUnmutedVideo) {
          vid.muted = true;
          vid.play().catch(() => {});
        }
      });
      if (!cancelled) {
        setTimeout(playAll, retryInterval);
      }
    };
    const timer = setTimeout(playAll, isMobile ? 1000 : 500);
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

    // Seamless wrap (2x duplication)
    if (positionRef.current >= tsw) {
      positionRef.current -= tsw;
    }
    if (positionRef.current < 0) {
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
    if (dragDistRef.current > 20) return;

    const vid = videoRefs.current[idx];
    if (!vid) return;

    // Start loading HD version when user taps
    upgradeToHD(idx);

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
      vid.play().catch(() => {
        // If play fails, try muted first then unmute
        vid.muted = true;
        vid.play().then(() => {
          vid.muted = false;
          vid.volume = 0.5;
        }).catch(() => {});
      });
      globalUnmutedVideo = vid;
      globalUnmuteListener = () => setUnmutedIndex(null);
      setUnmutedIndex(idx);
    }
  }, [unmutedIndex, upgradeToHD]);

  // Desktop hover handlers — pause slider + unmute audio on hover
  const handleMouseEnter = (idx: number) => {
    if (window.innerWidth < 768) return;
    isPaused.current = true;
    velocityRef.current = 0;
    setHoveredIndex(idx);
    upgradeToHD(idx);

    // Unmute on hover
    const vid = videoRefs.current[idx];
    if (!vid) return;
    muteGlobalVideo();
    videoRefs.current.forEach((v) => { if (v && v !== vid) v.muted = true; });
    vid.muted = false;
    vid.volume = 0.3;
    vid.play().catch(() => {});
    globalUnmutedVideo = vid;
    globalUnmuteListener = () => setUnmutedIndex(null);
    setUnmutedIndex(idx);
  };

  const handleMouseLeave = (_idx: number) => {
    if (window.innerWidth < 768) return;
    isPaused.current = false;
    setHoveredIndex(null);

    // Mute on leave
    videoRefs.current.forEach((v) => { if (v) v.muted = true; });
    globalUnmutedVideo = null;
    globalUnmuteListener = null;
    setUnmutedIndex(null);
  };

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
                <LazySliderVideo
                  ref={el => { videoRefs.current[i] = el; }}
                  src={video.src}
                  isMobile={isMobile}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────
const ShortContent: React.FC = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const allVideos = [
    { src: "https://storage.googleapis.com/video-slider/CHIN%20CHIN%20CLUB%20FREAKY.mp4", hdSrc: "https://storage.googleapis.com/video-slider/HD/freaky_2_years.mp4" },
    { src: "https://storage.googleapis.com/video-slider/newyear_supperclub_countdown_1day.mp4", hdSrc: "https://storage.googleapis.com/video-slider/HD/newyear_supperclub_countdown_1day_v1%20(1080p).mp4" },
    { src: "https://storage.googleapis.com/video-slider/VIRAL_17-02_PROMO-VID.mp4", hdSrc: "https://storage.googleapis.com/video-slider/HD/VIRAL_17-02_PROMO-VID.mp4" },
    { src: "https://storage.googleapis.com/video-slider/VIRAL%20-%20kleine_john_%26_chavante_viral.mp4", hdSrc: "https://storage.googleapis.com/video-slider/HD/kleine_john_%26_chavante_viral_v1%20(1080p).mp4" },
    { src: "https://storage.googleapis.com/video-slider/Bakboord%20x%20Supperclub%20Cruise%20promotievideo.mp4", hdSrc: "https://storage.googleapis.com/video-slider/HD/Bakboord%20x%20Supperclub%20Cruise%20promotievideo.mp4" },
    { src: "https://storage.googleapis.com/video-slider/jobdex_vid_oranjebloesem_personeel.mp4", hdSrc: "https://storage.googleapis.com/video-slider/HD/jobdex_vid_oranjebloesem_personeel_v1%20(1080p).mp4" },
    { src: "https://storage.googleapis.com/video-slider/RAVEG_HYPERPOWER_VID_EN_2_STORY.mp4" },
  ];

  const videos = allVideos;

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
