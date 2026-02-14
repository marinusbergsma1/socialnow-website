
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SliderImage {
  src: string;
  title: string;
  category: string;
  slug?: string;
}

const allImages: SliderImage[] = [
  { src: "https://i.ibb.co/VcsQ9tLr/1400-Mark-Johnson-LUV-YOU-STILL-1.webp", title: "LUV YOU STILL", category: "ARTWORK" },
  { src: "https://i.ibb.co/WWZCxsb2/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp", title: "FAST X CAMPAIGN", category: "CAMPAIGN", slug: "universal-sony-banners" },
  { src: "https://i.ibb.co/993HhMHM/C4-FEED-30-korting.webp", title: "C4 PERFORMANCE", category: "SOCIAL" },
  { src: "https://i.ibb.co/356nWH7t/header-Bouadu-v2-1.webp", title: "BOADU ARTWORK", category: "ARTWORK", slug: "az-alkmaar-socials" },
  { src: "https://i.ibb.co/wZwdpDnY/666f15bbb49442553d264e6d-PRINT-BIND.webp", title: "PRINT & BIND OFFICE", category: "BRANDING", slug: "print-bind-interieur" },
  { src: "https://i.ibb.co/BHRWPBQD/Light-Art-Collection.webp", title: "LIGHT ART COLLECTION", category: "ARTWORK" },
  { src: "https://i.ibb.co/VYkkWJbf/Soulful-Special-Event-Header-1.webp", title: "SOULFUL SPECIALS", category: "EVENT" },
  { src: "https://i.ibb.co/gMXD7pDW/THE-HEALTH-HOUSE-CONCEPT-1.webp", title: "THE HEALTH HOUSE", category: "BRANDING" },
  { src: "https://i.ibb.co/67P1fyDT/THH-VALENTINE-SALE-STORY-2024-1200x1200-1200x1200-1.webp", title: "VALENTINE SPECIAL", category: "CAMPAIGN" }
];

const imagesRow1 = allImages.slice(0, 5);
const imagesRow2 = allImages.slice(5);

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
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setLoaded(true)}
      onError={() => setHasError(true)}
      decoding="async"
    />
  );
};

const MarqueeRow: React.FC<{ images: SliderImage[]; speed: number; reverse?: boolean; cardHeight: number; gap: number; onCardClick: (img: SliderImage) => void }> = ({ images, speed, reverse = false, cardHeight, gap, onCardClick }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef<number>(0);
  const singleSetWidthRef = useRef(0);
  const isPausedRef = useRef(false);

  const numSets = 3;
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
    if (!isPausedRef.current) {
      posRef.current += reverseRef.current ? -speedRef.current : speedRef.current;
    }
    if (posRef.current >= singleSetWidth * 2) posRef.current -= singleSetWidth;
    if (posRef.current <= 0) posRef.current += singleSetWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
    }
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  const onTouchStart = useCallback(() => { isPausedRef.current = true; }, []);
  const onTouchEnd = useCallback(() => { isPausedRef.current = false; }, []);
  const onMouseEnter = useCallback(() => { isPausedRef.current = true; }, []);
  const onMouseLeave = useCallback(() => { isPausedRef.current = false; }, []);

  return (
    <div
      className="overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div ref={trackRef} className="flex will-change-transform" style={{ gap: `${gap}px` }}>
        {allImgs.map((img, i) => (
          <div
            key={i}
            className="flex-none overflow-hidden relative group cursor-pointer rounded-2xl bg-[#0a0a0a]"
            style={{ height: `${cardHeight}px` }}
            onClick={() => onCardClick(img)}
          >
            <LazyImage src={img.src} alt={img.title} className="h-full w-auto block max-w-none" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)' }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-1">{img.category}</span>
              <span className="text-white font-black uppercase tracking-tight text-xs md:text-sm">{img.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageSlider: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
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

  const handleCardClick = useCallback((img: SliderImage) => {
    if (img.slug) {
      navigate(`/project/${img.slug}`);
    } else {
      navigate('/projecten');
    }
  }, [navigate]);

  const cardHeight = isMobile ? 140 : 260;
  const gap = isMobile ? 12 : 20;

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-20 bg-transparent overflow-hidden relative flex flex-col gap-3 md:gap-5 z-20 touch-pan-y"
    >
      <div className="px-5 md:px-8 mb-4 md:mb-6">
        <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/40 mb-1 md:mb-2">Portfolio</p>
        <h2 className="text-lg md:text-3xl font-black text-white tracking-tight">Recente projecten</h2>
      </div>

      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-30 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-30 pointer-events-none" />
      {isVisible && <MarqueeRow images={imagesRow1} speed={isMobile ? 0.35 : 0.5} cardHeight={cardHeight} gap={gap} onCardClick={handleCardClick} />}
      {isVisible && <MarqueeRow images={imagesRow2} speed={isMobile ? 0.25 : 0.4} reverse cardHeight={cardHeight} gap={gap} onCardClick={handleCardClick} />}
    </section>
  );
};

export default ImageSlider;
