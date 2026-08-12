import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Instagram, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const BEHOLD_FEED_URL = 'https://feeds.behold.so/5Ku5iKM7N7Gpi9MgAN9X';

type BeholdSizes = {
  small?: { width: number; height: number; mediaUrl: string };
  medium?: { width: number; height: number; mediaUrl: string };
  large?: { width: number; height: number; mediaUrl: string };
  full?: { width: number; height: number; mediaUrl?: string };
};

type BeholdPost = {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  isReel?: boolean;
  caption?: string;
  prunedCaption?: string;
  sizes?: BeholdSizes;
  /** Fallback-verhouding (b/h) voor lokale posts zonder sizes. */
  ratio?: number;
};

// Native verhouding van een post (b/h) — posts worden NOOIT bijgesneden:
// 9:16 blijft 9:16, 1:1 blijft 1:1, 4:5 blijft 4:5.
const postRatio = (p: BeholdPost): number => {
  const f = p.sizes?.full;
  if (f && f.width > 0 && f.height > 0) return f.width / f.height;
  if (p.ratio) return p.ratio;
  return p.mediaType === 'VIDEO' || p.isReel ? 9 / 16 : 1;
};

type BeholdFeed = {
  username: string;
  profilePictureUrl?: string;
  posts: BeholdPost[];
};

type FeedMeta = { username: string; avatar?: string };

// ─── Fallback: eigen werk als de Behold-feed faalt (bv. source gepauzeerd).
// De sectie mag nooit onzichtbaar zijn; deze posts linken naar Instagram. ───
const IG = 'https://www.instagram.com/socialnow.nl/';
const FALLBACK_POSTS: BeholdPost[] = ([
  ['AZ-25-K-Volgers-Post.webp', 1327 / 1670],
  ['C4-FEED-30-korting.webp', 1],
  ['UNIVERSAL-OPENHEIMER-FRAMES.webp', 1323 / 2407],
  ['header-Bouadu-v2-1.webp', 1920 / 1169],
  ['1400-Mark-Johnson-LUV-YOU-STILL-1.webp', 1],
  ['Light-Art-Collection.webp', 1920 / 1170],
  ['Soulful-Special-Event-Header-1.webp', 1920 / 1004],
  ['THH-VALENTINE-SALE-STORY-2024-1200x1200-1200x1200-1.webp', 1],
] as [string, number][]).map(([file, ratio], i) => ({
  id: `fallback-${i}`,
  timestamp: '',
  permalink: IG,
  mediaType: 'IMAGE' as const,
  mediaUrl: `${import.meta.env.BASE_URL}images/${file}`,
  prunedCaption: 'Werk van SocialNow',
  ratio,
}));

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
  // In de slider ALTIJD een afbeelding (stabiele behold.pictures-rendition):
  // Instagram-video-URL's verlopen/falen geregeld → lege zwarte kaarten.
  // De video zelf speelt pas in de lightbox. Play-badge markeert reels.
  const src = post.sizes?.large?.mediaUrl || post.thumbnailUrl || post.mediaUrl;
  const fallback = post.thumbnailUrl && post.thumbnailUrl !== src ? post.thumbnailUrl : undefined;

  return (
    <div ref={containerRef} className="w-full h-full bg-zinc-900 relative">
      {shouldLoad && (
        <img
          src={src}
          alt={post.prunedCaption?.slice(0, 80) || 'Instagram post'}
          loading="lazy"
          decoding="async"
          onError={(e) => { if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }}
          className="w-full h-full object-cover pointer-events-none"
        />
      )}
      {shouldLoad && isVideo && (
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white ml-0.5" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </span>
      )}
    </div>
  );
};

// ─── Infinite Loop Slider ───────────────────────────────────────────────
const InfiniteSocialSlider: React.FC<{ posts: BeholdPost[]; onOpen: (index: number) => void }> = ({ posts, onOpen }) => {
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

  // Hero-3-marquee stijl: compacte kaarten. Vaste hoogte; de breedte volgt per
  // post uit zijn NATIVE verhouding — een reel (9:16) blijft smaller dan een
  // carousel (4:5) of een 1:1 post, nooit gecropt.
  const cardHeight = isMobile ? 230 : 320;
  const gap = isMobile ? 12 : 20;

  // Duplicate posts so the loop feels endless even with a small feed
  const repeatCount = posts.length < 6 ? 4 : 2;
  const allPosts = useMemo(() => Array.from({ length: repeatCount }, () => posts).flat(), [posts, repeatCount]);
  const setLength = posts.length;
  const cardWidths = useMemo(
    () => posts.map((p) => Math.round(cardHeight * postRatio(p))),
    [posts, cardHeight]
  );
  const totalSetWidth = cardWidths.reduce((a, w) => a + w + gap, 0);

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

  const handleTap = useCallback((originalIndex: number) => {
    if (dragDistRef.current > 20) return; // was een sleep, geen tik
    onOpen(originalIndex);
  }, [onOpen]);

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
      <div ref={trackRef} data-sn-work className="flex will-change-transform" style={{ gap: `${gap}px` }}>
        {allPosts.map((post, i) => {
          const isHovered = !isMobile && hoveredIndex === i;
          return (
            <div
              key={`${post.id}-${i}`}
              className="flex-shrink-0 relative"
              style={{
                width: `${cardWidths[i % setLength]}px`,
                // Hero-3-stijl: kaarten afwisselend licht gekanteld
                transform: `${isHovered ? 'translateY(-8px)' : 'translateY(0)'} rotate(${i % 2 === 0 ? -2 : 3}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleTap(i % setLength)}
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
// ─── Popup-gallery (lightbox) — Behold-stijl: media links in native ratio,
// caption rechts, pijlen + dots + "Bekijk op Instagram". ───────────────────
const MediaLightbox: React.FC<{
  posts: BeholdPost[];
  index: number;
  feed: FeedMeta;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}> = ({ posts, index, feed, onClose, onNav }) => {
  const post = posts[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose, onNav]);

  if (!post) return null;
  const isVideo = post.mediaType === 'VIDEO';
  const mediaSrc = isVideo ? post.mediaUrl : (post.sizes?.large?.mediaUrl || post.mediaUrl);
  const caption = post.caption || post.prunedCaption || '';

  // Portal naar body: ontsnapt aan voorouders met transform/filter/will-change
  // die anders het containing block voor position:fixed worden (lightbox zou
  // dan niet viewport-gecentreerd zijn maar ergens in de pagina staan).
  return createPortal((
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 md:p-8 animate-[sn-lb-fade_0.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <style>{`@keyframes sn-lb-fade { from { opacity: 0 } to { opacity: 1 } } @keyframes sn-lb-pop { from { opacity:0; transform: scale(0.97) } to { opacity:1; transform: scale(1) } }`}</style>

      {/* Sluiten */}
      <button onClick={onClose} aria-label="Sluiten" className="fixed top-4 right-4 z-[130] p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <X size={26} />
      </button>

      {/* Vorige / volgende */}
      {posts.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); onNav(-1); }} aria-label="Vorige" className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[130] p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors">
            <ChevronLeft size={28} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNav(1); }} aria-label="Volgende" className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[130] p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors">
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div
        className="relative flex flex-col md:flex-row w-full max-w-4xl max-h-full rounded-2xl overflow-hidden bg-[#0b0b0b] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.7)] animate-[sn-lb-pop_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media — native verhouding, nooit gecropt */}
        <div className="relative bg-black flex items-center justify-center md:w-[58%] max-h-[45vh] md:max-h-[85vh]">
          {isVideo ? (
            <video key={post.id} src={mediaSrc} poster={post.thumbnailUrl} autoPlay loop playsInline controls className="max-w-full max-h-[45vh] md:max-h-[85vh] w-auto h-auto object-contain" />
          ) : (
            <img key={post.id} src={mediaSrc} alt={caption.slice(0, 80) || 'Instagram post'} className="max-w-full max-h-[45vh] md:max-h-[85vh] w-auto h-auto object-contain" />
          )}
        </div>

        {/* Caption-paneel */}
        <div className="flex flex-col md:w-[42%] min-h-0 bg-[#0b0b0b]">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
            {feed.avatar
              ? <img src={feed.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#25D366]/40" />
              : <span className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center"><Instagram size={18} className="text-[#25D366]" /></span>}
            <span className="text-white font-bold text-sm">@{feed.username}</span>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 text-white/80 text-[13px] leading-relaxed whitespace-pre-line min-h-[80px] max-h-[30vh] md:max-h-none">
            {caption || 'Bekijk deze post op Instagram.'}
          </div>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-4 border-t border-white/[0.07] text-[#25D366] font-bold uppercase tracking-wider text-xs hover:bg-[#25D366] hover:text-white transition-colors"
          >
            <Instagram size={16} /> Bekijk op Instagram <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Dots */}
      {posts.length > 1 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[130] flex gap-2">
          {posts.map((_, i) => (
            <span key={i} className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[#25D366]' : 'w-1.5 bg-white/30'}`} />
          ))}
        </div>
      )}
    </div>
  ), document.body);
};

const SocialMediaSlider: React.FC = () => {
  const [posts, setPosts] = useState<BeholdPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feed, setFeed] = useState<FeedMeta>({ username: 'socialnow.nl' });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
        setFeed({ username: data.username || 'socialnow.nl', avatar: data.profilePictureUrl });
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      });
    return () => { cancelled = true; };
  }, []);

  // Feed stuk (bv. Behold-source gepauzeerd)? Toon eigen werk i.p.v. niets —
  // de sectie mag nooit stilletjes van de site verdwijnen.
  const effectivePosts = error ? FALLBACK_POSTS : posts;

  return (
    <section className="py-10 md:py-28 bg-transparent overflow-hidden relative border-t border-white/5">
      <div className="hidden md:block absolute top-0 left-0 w-full text-center pointer-events-none opacity-[0.12] select-none overflow-hidden">
        <h2 className="text-[25vw] font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none">SOCIAL</h2>
      </div>

      {/* Hero-3-compositie: content zweeft óver de marquee; kaarten komen er
          half achter vandaan met een fade bovenaan. */}
      <div className="container mx-auto px-6 relative z-30 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-4 md:mb-6 pointer-events-auto">
          <Instagram size={14} className="text-[#25D366]" />
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">@socialnow.nl</span>
        </div>
        <h2 className="text-2xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-none mb-3 md:mb-4">
          DAGELIJKS <span className="text-[#25D366]">NIEUW WERK</span>
        </h2>
        <p className="text-gray-500 text-xs md:text-base font-medium max-w-lg mx-auto pointer-events-auto">
          <a
            href="https://www.instagram.com/socialnow.nl/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:text-[#25D366] transition-colors"
          >
            Volg @socialnow.nl
          </a>
          {' '}en zie ons nieuwste werk, achter-de-schermen en AI-experimenten. Tik op een post om 'm groot te bekijken.
        </p>
        <a
          href="https://www.instagram.com/socialnow.nl/"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-2 px-6 py-3 mt-6 md:mt-8 rounded-full bg-[#25D366] text-white sn-btn3d hover:scale-105 transition-transform"
        >
          <Instagram size={16} />
          <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.25em]">Bekijk volledig profiel</span>
        </a>
      </div>

      {/* Marquee schuift onder de content door (negatieve top-marge) met een
          zachte fade aan de bovenkant, zoals de hero-3-referentie. */}
      <div
        className="relative z-10 -mt-8 md:-mt-16"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 26%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 26%)',
        }}
      >
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
        {effectivePosts === null ? <SliderSkeleton /> : <InfiniteSocialSlider posts={effectivePosts} onOpen={setLightboxIndex} />}
      </div>

      {/* Popup-gallery */}
      {lightboxIndex !== null && effectivePosts && (
        <MediaLightbox
          posts={effectivePosts}
          index={lightboxIndex}
          feed={feed}
          onClose={() => setLightboxIndex(null)}
          onNav={(dir) => setLightboxIndex((cur) => {
            if (cur === null) return cur;
            const n = effectivePosts.length;
            return (cur + dir + n) % n;
          })}
        />
      )}
    </section>
  );
};

export default SocialMediaSlider;
