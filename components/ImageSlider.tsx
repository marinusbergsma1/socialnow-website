
import React, { useEffect, useRef, useState, useCallback } from 'react';

const allImages = [
  { src: "https://i.ibb.co/VcsQ9tLr/1400-Mark-Johnson-LUV-YOU-STILL-1.webp", title: "LUV YOU STILL" },
  { src: "https://i.ibb.co/WWZCxsb2/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp", title: "FAST X CAMPAIGN" },
  { src: "https://i.ibb.co/993HhMHM/C4-FEED-30-korting.webp", title: "C4 PERFORMANCE" },
  { src: "https://i.ibb.co/356nWH7t/header-Bouadu-v2-1.webp", title: "BOADU ARTWORK" },
  { src: "https://i.ibb.co/wZwdpDnY/666f15bbb49442553d264e6d-PRINT-BIND.webp", title: "PRINT & BIND OFFICE" },
  { src: "https://i.ibb.co/BHRWPBQD/Light-Art-Collection.webp", title: "LIGHT ART COLLECTION" },
  { src: "https://i.ibb.co/VYkkWJbf/Soulful-Special-Event-Header-1.webp", title: "SOULFUL SPECIALS" },
  { src: "https://i.ibb.co/gMXD7pDW/THE-HEALTH-HOUSE-CONCEPT-1.webp", title: "THE HEALTH HOUSE" },
  { src: "https://i.ibb.co/67P1fyDT/THH-VALENTINE-SALE-STORY-2024-1200x1200-1200x1200-1.webp", title: "VALENTINE SPECIAL" }
];

// Split for mobile marquee rows
const imagesRow1 = allImages.slice(0, 5);
const imagesRow2 = allImages.slice(5);

// Lazy image component — only loads when near viewport
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (hasError) {
    return <div className="h-full w-full bg-zinc-900" />;
  }

  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      alt={alt}
      className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setLoaded(true)}
      onError={() => setHasError(true)}
      decoding="async"
    />
  );
};

// Mobile marquee row — continuous auto-scroll
const MarqueeRow: React.FC<{ images: typeof imagesRow1; speed: number; reverse?: boolean }> = ({ images, speed, reverse = false }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef<number>(0);
  const singleSetWidthRef = useRef(0);

  const cardHeight = 100;
  const gap = 12;
  const numSets = 2;
  const allImgs = Array.from({ length: numSets }, () => images).flat();

  const speedRef = useRef(speed);
  const reverseRef = useRef(reverse);

  useEffect(() => {
    if (!trackRef.current) return;
    singleSetWidthRef.current = trackRef.current.scrollWidth / numSets;
    posRef.current = singleSetWidthRef.current;
  }, [images.length]);

  const animate = useCallback(() => {
    const singleSetWidth = singleSetWidthRef.current;
    if (singleSetWidth === 0) {
      animRef.current = requestAnimationFrame(animate);
      return;
    }
    posRef.current += reverseRef.current ? -speedRef.current : speedRef.current;
    if (posRef.current >= singleSetWidth * 2) posRef.current -= singleSetWidth;
    if (posRef.current <= 0) posRef.current += singleSetWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
    }
    animRef.current = requestAnimationFrame(animate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  return (
    <div className="overflow-hidden relative">
      <div ref={trackRef} className="flex will-change-transform" style={{ gap: `${gap}px` }}>
        {allImgs.map((img, i) => (
          <div
            key={i}
            className="flex-none overflow-hidden relative"
            style={{
              height: `${cardHeight}px`,
              borderRadius: '0.8rem',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              background: '#0a0a0a',
            }}
          >
            <LazyImage src={img.src} alt={img.title} className="h-full w-auto block max-w-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══ Desktop: Horizontal scroll pinned gallery ═══
const PinnedGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!containerRef.current) { ticking = false; return; }
        const rect = containerRef.current.getBoundingClientRect();
        const containerHeight = containerRef.current.offsetHeight;
        const viewportH = window.innerHeight;
        // scrollable distance = container height minus one viewport
        const scrollDistance = containerHeight - viewportH;
        if (scrollDistance <= 0) { ticking = false; return; }
        // How far through the pinned section have we scrolled?
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
        setScrollProgress(progress);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate track translate based on scroll progress
  const cardW = 504; // 360 * 1.4
  const cardGap = 28;
  const totalTrackWidth = allImages.length * (cardW + cardGap) - cardGap;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;
  const maxTranslate = Math.max(0, totalTrackWidth - viewportWidth + 200);
  const translateX = -scrollProgress * maxTranslate;

  return (
    <div
      ref={containerRef}
      className="relative"
      // Extra height creates the scroll distance for horizontal movement
      style={{ height: `${Math.max(200, maxTranslate * 0.8 + window.innerHeight)}px` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-black to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-56 bg-gradient-to-l from-black to-transparent z-30 pointer-events-none" />

        {/* Counter */}
        <div className="absolute top-8 left-8 z-40">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
            {String(Math.min(allImages.length, Math.floor(scrollProgress * allImages.length) + 1)).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/[0.06] rounded-full z-40 overflow-hidden">
          <div
            className="h-full bg-[#25D366] rounded-full transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex will-change-transform pl-24"
          style={{
            gap: `${cardGap}px`,
            transform: `translate3d(${translateX}px, 0, 0)`,
          }}
        >
          {allImages.map((img, i) => {
            const isHovered = hoveredIdx === i;
            // Parallax: each card gets slightly offset based on scroll
            const cardOffset = Math.sin((scrollProgress * Math.PI * 2) + i * 0.5) * 8;

            return (
              <div
                key={i}
                className="flex-none overflow-hidden relative cursor-default"
                style={{
                  height: '360px',
                  width: `${cardW}px`,
                  borderRadius: '1.25rem',
                  border: isHovered
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'border-color 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: `scale(${isHovered ? 1.03 : 1}) translateY(${cardOffset}px)`,
                  background: '#0a0a0a',
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <LazyImage
                  src={img.src}
                  alt={img.title}
                  className="h-full w-full block object-cover"
                />
                {/* Title overlay on hover */}
                <div
                  className="absolute inset-0 flex items-end p-5 pointer-events-none"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 30%)',
                    transition: 'background 0.4s ease',
                  }}
                >
                  <span
                    className="text-white font-black uppercase tracking-tight text-xs"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                    }}
                  >
                    {img.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ImageSlider: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { rootMargin: '100px', threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mobile: keep the marquee rows
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="py-12 bg-transparent overflow-hidden relative flex flex-col gap-4 z-20 touch-pan-y"
      >
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent z-30 pointer-events-none" />
        {isVisible && <MarqueeRow images={imagesRow1} speed={0.4} />}
        {isVisible && <MarqueeRow images={imagesRow2} speed={0.3} reverse />}
      </section>
    );
  }

  // Desktop: horizontal scroll pinned gallery
  return (
    <section ref={sectionRef} className="bg-transparent relative z-20" style={{ minHeight: isVisible ? undefined : '100px' }}>
      {isVisible && <PinnedGallery />}
    </section>
  );
};

export default ImageSlider;
