
import React, { useEffect, useRef, useState, useCallback } from 'react';

const imagesRow1 = [
  { src: "https://i.ibb.co/VcsQ9tLr/1400-Mark-Johnson-LUV-YOU-STILL-1.webp", title: "LUV YOU STILL" },
  { src: "https://i.ibb.co/WWZCxsb2/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp", title: "FAST X CAMPAIGN" },
  { src: "https://i.ibb.co/993HhMHM/C4-FEED-30-korting.webp", title: "C4 PERFORMANCE" },
  { src: "https://i.ibb.co/356nWH7t/header-Bouadu-v2-1.webp", title: "BOADU ARTWORK" },
  { src: "https://i.ibb.co/wZwdpDnY/666f15bbb49442553d264e6d-PRINT-BIND.webp", title: "PRINT & BIND OFFICE" }
];

const imagesRow2 = [
  { src: "https://i.ibb.co/BHRWPBQD/Light-Art-Collection.webp", title: "LIGHT ART COLLECTION" },
  { src: "https://i.ibb.co/VYkkWJbf/Soulful-Special-Event-Header-1.webp", title: "SOULFUL SPECIALS" },
  { src: "https://i.ibb.co/gMXD7pDW/THE-HEALTH-HOUSE-CONCEPT-1.webp", title: "THE HEALTH HOUSE" },
  { src: "https://i.ibb.co/67P1fyDT/THH-VALENTINE-SALE-STORY-2024-1200x1200-1200x1200-1.webp", title: "VALENTINE SPECIAL" }
];

// Lazy image component - only loads when near viewport
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

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

  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      alt={alt}
      className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setLoaded(true)}
      decoding="async"
    />
  );
};

// Marquee row using requestAnimationFrame for smooth GPU-accelerated scrolling
const MarqueeRow: React.FC<{ images: typeof imagesRow1; speed: number; reverse?: boolean }> = ({ images, speed, reverse = false }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const cardHeight = isMobile ? 100 : 260;
  const gap = isMobile ? 12 : 24;

  const animate = useCallback(() => {
    posRef.current += reverse ? -speed : speed;
    if (trackRef.current) {
      const halfWidth = trackRef.current.scrollWidth / 2;
      if (!reverse && posRef.current >= halfWidth) posRef.current -= halfWidth;
      if (reverse && Math.abs(posRef.current) >= halfWidth) posRef.current += halfWidth;
      trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
    }
    animRef.current = requestAnimationFrame(animate);
  }, [speed, reverse]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  // Duplicate images for seamless loop
  const allImages = [...images, ...images];

  return (
    <div className="overflow-hidden relative">
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: `${gap}px` }}
      >
        {allImages.map((img, i) => (
          <div
            key={i}
            className="flex-none overflow-hidden border border-white/8 bg-[#0a0a0a] flex items-center justify-center hover:border-white/20 transition-colors duration-300"
            style={{ height: `${cardHeight}px`, borderRadius: isMobile ? '0.8rem' : '1.5rem' }}
          >
            <LazyImage
              src={img.src}
              alt={img.title}
              className="h-full w-auto block max-w-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageSlider: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-24 bg-transparent overflow-hidden relative flex flex-col gap-4 md:gap-8 z-20 touch-pan-y"
    >
      {/* Fade Edges */}
      <div className="absolute inset-y-0 left-0 w-12 md:w-48 bg-gradient-to-r from-black to-transparent z-30 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-12 md:w-48 bg-gradient-to-l from-black to-transparent z-30 pointer-events-none"></div>

      {/* Row 1 */}
      {isVisible && <MarqueeRow images={imagesRow1} speed={0.5} />}

      {/* Row 2 — reverse direction */}
      {isVisible && <MarqueeRow images={imagesRow2} speed={0.4} reverse />}
    </section>
  );
};

export default ImageSlider;
