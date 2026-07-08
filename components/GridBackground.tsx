
import React, { useState, useEffect, useRef } from 'react';
import { PixelGlobe } from './PixelGlobe';

interface GridBackgroundProps {
  hide?: boolean;
  startAnimation?: boolean;
}

/**
 * Globe-achtergrond die soepel met het scrollen meeglijdt (trage volg-parallax).
 *
 * BEWUST GEEN position:fixed of sticky: een viewport-verankerde backdrop-
 * provider (fixed, of geplakte sticky) leeft in Chromium in een eigen
 * compositor-laag, en backdrop-filter van geneste tiles kan die laag niet
 * capteren — het glas lijkt dan dood. Een in-flow absolute laag waarvan de
 * `top` per frame naar scrollY lerpt blijft in dezelfde scroll-laag als de
 * tiles → frost/warp werkt overal, en de globe "beweegt mee".
 */
const GridBackground: React.FC<GridBackgroundProps> = ({ hide = false, startAnimation = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);
  const followRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fade in the globe after startAnimation triggers
  useEffect(() => {
    if (startAnimation && !isMobile) {
      const timer = setTimeout(() => setGlobeVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [startAnimation, isMobile]);

  // Volg-parallax: glijd traag richting de scrollpositie
  useEffect(() => {
    if (isMobile || !startAnimation) return;
    const el = followRef.current;
    if (!el) return;
    let raf = 0;
    let current = window.scrollY;
    const tick = () => {
      const target = window.scrollY;
      current += (target - current) * 0.08;
      if (Math.abs(target - current) < 0.5) current = target;
      el.style.top = `${Math.round(current)}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobile, startAnimation]);

  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${hide ? 'opacity-0' : 'opacity-100'}`}
      style={{ overflow: 'clip' }}
    >
      {/* Globes only — desktop for performance */}
      {!isMobile && startAnimation && (
        <div ref={followRef} className="absolute left-0 w-full h-screen" style={{ top: 0 }}>
          <div className={`absolute inset-0 transition-opacity duration-[2500ms] ease-out ${globeVisible ? 'opacity-60' : 'opacity-0'}`}>
            <PixelGlobe
              scaleMultiplier={0.55}
              type="all"
              opacity={0.85}
              entranceAnimation={true}
              glowEnabled={true}
              largeParticles={true}
              scrollReactive={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GridBackground;
