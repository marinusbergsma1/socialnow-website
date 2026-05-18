import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Instagram } from 'lucide-react';

const BEHOLD_FEED_URL = 'https://feeds.behold.so/7ZP2aZ0PgVpUEDi8BpHY';

type BeholdPost = {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  isReel?: boolean;
  prunedCaption?: string;
};

type BeholdFeed = {
  username: string;
  posts: BeholdPost[];
};

// ─── Lazy media: only loads when near viewport ──────────────────────────
const LazyMedia: React.FC<{ post: BeholdPost; isMobile: boolean }> = ({ post, isMobile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const el = containerRef.current;
    if (!el) return;
    const margin = isMobile ? '200px' : '600px';
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); obs.disconnect(); } },
      { rootMargin: margin, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isMobile, shouldLoad]);

  const isVideo = post.mediaType === 'VIDEO';
  const src = isVideo ? post.mediaUrl : post.mediaUrl;
  const poster = post.thumbnailUrl;

  return (
    <div ref={containerRef} className="w-full h-full bg-zinc-900">
      {shouldLoad && isVideo && (
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover pointer-events-none"
        />
      )}
      {shouldLoad && !isVideo && (
        <img
          src={src}
          alt={post.prunedCaption?.slice(0, 80) || 'Instagram post'}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover pointer-events-none"
        />
      )}
    </div>
  );
};

// ─── Infinite Loop Slider ───────────────────────────────────────────────
const InfiniteSocialSlider: React.FC<{ posts: BeholdPost[] }> = ({ posts }) => {
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
  const dragDistRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const screenWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 375);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onResize = () => {
      const wasMobile = isMobileRef.current;
      isMobileRef.current = window.innerWidth < 768;
      screenWidthRef.current = window.innerWidth;
      if (wasMobile !== isMobileRef.current) forceUpdate(n => n + 1);
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = isMobileRef.current;
  const screenWidth = screenWidthRef.current;

  const cardWidth = isMobile
    ? Math.round(screenWidth * 0.56)
    : Math.min(480, Math.max(380, Math.round(screenWidth * 0.27)));
  const cardHeight = Math.round(cardWidth * (16 / 9));
  const gap = isMobile ? 14 : 32;
  const totalItemWidth = cardWidth + gap;

  // Duplicate posts so the loop feels endless even with a small feed
  const repeatCount = posts.length < 6 ? 4 : 2;
  const allPosts = useMemo(() => Array.from({ length: repeatCount }, () => posts).flat(), [posts, repeatCount]);
  const setLength = posts.length;
  const totalSetWidth = totalItemWidth * setLength;

  const autoSpeed = isMobile ? 0.5 : 0.6;
  const totalSetWidthRef = useRef(totalSetWidth);
  const autoSpeedRef = useRef(autoSpeed);
  useEffect(() => { totalSetWidthRef.current = totalSetWidth; }, [totalSetWidth]);
  useEffect(() => { autoSpeedRef.current = autoSpeed; }, [autoSpeed]);

  useEffect(() => {
    positionRef.current = 0;
    if (trackRef.current) trackRef.current.style.transform = 'translate3d(0px, 0, 0)';
  }, [totalSetWidth]);

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

    if (positionRef.current >= tsw) positionRef.current -= tsw;
    if (positionRef.current < 0) positionRef.current += tsw;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

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

  const handleTap = useCallback((post: BeholdPost) => {
    if (dragDistRef.current > 20) return;
    window.open(post.permalink, '_blank', 'noopener,noreferrer');
  }, []);

  const handleMouseEnter = (idx: number) => {
    if (window.innerWidth < 768) return;
    isPaused.current = true;
    velocityRef.current = 0;
    setHoveredIndex(idx);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    isPaused.current = false;
    setHoveredIndex(null);
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
      <div ref={trackRef} className="flex will-change-transform" style={{ gap: `${gap}px` }}>
        {allPosts.map((post, i) => {
          const isHovered = !isMobile && hoveredIndex === i;
          return (
            <div
              key={`${post.id}-${i}`}
              className="flex-shrink-0 relative"
              style={{
                width: `${cardWidth}px`,
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleTap(post)}
            >
              <div
                className="w-full bg-black relative"
                style={{
                  height: `${cardHeight}px`,
                  borderRadius: isMobile ? '1rem' : '1.25rem',
                  overflow: 'hidden',
                  border: isHovered
                    ? '1px solid rgba(37, 211, 102, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isHovered
                    ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(37, 211, 102, 0.15)'
                    : '0 8px 32px rgba(0, 0, 0, 0.4)',
                  transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
                }}
              >
                <LazyMedia post={post} isMobile={isMobile} />
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                    opacity: isHovered ? 0.8 : 0.5,
                    transition: 'opacity 0.4s ease',
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 pointer-events-none"
                  style={{ opacity: isHovered ? 1 : 0.7, transition: 'opacity 0.4s ease' }}
                >
                  <Instagram size={14} className="text-white/80" />
                  <span className="text-white/80 text-[10px] md:text-[11px] font-bold uppercase tracking-widest">@socialnow.nl</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Skeleton placeholder while feed loads ──────────────────────────────
const SliderSkeleton: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const cardWidth = isMobile ? Math.round(window.innerWidth * 0.56) : 420;
  const cardHeight = Math.round(cardWidth * (16 / 9));
  return (
    <div className="relative w-full select-none" style={{ overflow: 'clip', padding: `${isMobile ? 16 : 40}px 0` }}>
      <div className="flex" style={{ gap: isMobile ? 14 : 32 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 bg-white/[0.03] animate-pulse"
            style={{
              width: cardWidth,
              height: cardHeight,
              borderRadius: isMobile ? '1rem' : '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Main exported component ────────────────────────────────────────────
const SocialMediaSlider: React.FC = () => {
  const [posts, setPosts] = useState<BeholdPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(BEHOLD_FEED_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<BeholdFeed>;
      })
      .then(data => {
        if (cancelled) return;
        // Sort newest first (Behold returns newest first by default, but be defensive)
        const sorted = [...data.posts].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setPosts(sorted);
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      });
    return () => { cancelled = true; };
  }, []);

  // If feed fails, hide the section entirely rather than show a broken UI
  if (error) return null;

  return (
    <section className="py-10 md:py-28 bg-transparent overflow-hidden relative border-t border-white/5">
      <div className="hidden md:block absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
        <h2 className="text-[25vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">SOCIAL</h2>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center mb-4 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 md:mb-6">
          <Instagram size={14} className="text-[#25D366]" />
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">@socialnow.nl</span>
        </div>
        <h2 className="text-2xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-none mb-3 md:mb-4">
          VOLG ONS OP SOCIALMEDIA
        </h2>
        <p className="text-gray-500 text-xs md:text-base font-medium max-w-lg mx-auto">
          Live updates van onze nieuwste werk, achter-de-schermen en AI-experimenten. Tik op een post om 'm op Instagram te bekijken.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
        {posts === null ? <SliderSkeleton /> : <InfiniteSocialSlider posts={posts} />}
      </div>

      <div className="container mx-auto px-6 mt-8 md:mt-14 text-center z-10 relative">
        <a
          href="https://www.instagram.com/socialnow.nl/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 transition-all"
        >
          <Instagram size={16} className="text-[#25D366]" />
          <span className="text-white text-[11px] md:text-xs font-bold uppercase tracking-[0.25em]">Bekijk volledig profiel</span>
        </a>
      </div>
    </section>
  );
};

export default SocialMediaSlider;
