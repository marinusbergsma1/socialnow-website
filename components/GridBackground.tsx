
import React, { useState, useEffect, useRef } from 'react';
import { PixelGlobe } from './PixelGlobe';

interface GridBackgroundProps {
  hide?: boolean;
  startAnimation?: boolean;
}

/**
 * Globe-achtergrond die 1:1 met de pagina meescrollt.
 *
 * BEWUST GEEN fixed, sticky of per-frame verplaatsing: viewport-verankerde of
 * continu bewegende backdrop-providers worden door Chromium in een eigen
 * compositor-laag gezet, en backdrop-filter van geneste tiles kan die laag
 * niet capteren — het glas lijkt dan dood. Statische in-flow lagen zijn
 * empirisch bewezen werkend (tiles frosten de globe correct).
 *
 * Meerdere instanties verspreid over de paginahoogte zodat er door de hele
 * site heen ambient globes zijn; alleen instanties nabij de viewport mounten
 * hun canvas (IntersectionObserver) om CPU te sparen.
 */

const LazyGlobe: React.FC<{ visible: boolean; entrance: boolean }> = ({ visible, entrance }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: '80% 0px 80% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {near && (
        <div className={`absolute inset-0 transition-opacity duration-[2500ms] ease-out ${visible ? 'opacity-60' : 'opacity-0'}`}>
          <PixelGlobe
            scaleMultiplier={0.55}
            type="all"
            opacity={0.85}
            entranceAnimation={entrance}
            glowEnabled={true}
            largeParticles={true}
            scrollReactive={false}
          />
        </div>
      )}
    </div>
  );
};

/** Documenthoogtes (in vh) waar een globe-instantie leeft */
const GLOBE_SPOTS = [0];

const GridBackground: React.FC<GridBackgroundProps> = ({ hide = false, startAnimation = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);

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

  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${hide ? 'opacity-0' : 'opacity-100'}`}
      style={{ overflow: 'clip' }}
    >
      {/* Globes only — desktop for performance */}
      {!isMobile && startAnimation &&
        GLOBE_SPOTS.map((vh, i) => (
          <div key={vh} className="absolute left-0 w-full h-screen" style={{ top: `${vh}vh` }}>
            <LazyGlobe visible={globeVisible} entrance={i === 0} />
          </div>
        ))}
    </div>
  );
};

export default GridBackground;
