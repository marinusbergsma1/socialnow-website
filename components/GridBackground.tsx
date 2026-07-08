
import React, { useState, useEffect } from 'react';
import { PixelGlobe } from './PixelGlobe';

interface GridBackgroundProps {
  hide?: boolean;
  startAnimation?: boolean;
}

/**
 * Eén globe in de hero, bovenaan de pagina. Scrollt gewoon mee met de flow
 * (in-flow absolute laag) — géén fixed/sticky/lazy-mount: die maken de laag
 * een eigen compositor-context (glas dood) of laten de ResizeObserver van de
 * canvas racen waardoor de globe op default 300×150 blijft steken.
 * Daarna komt de globe niet meer terug: puur zwart, zoals gevraagd.
 */
const GridBackground: React.FC<GridBackgroundProps> = ({ hide = false, startAnimation = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [globeVisible, setGlobeVisible] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

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
      {/* Globe alleen in de hero (bovenste 100vh); desktop-only */}
      {!isMobile && startAnimation && (
        <div
          className={`absolute left-0 top-0 w-full h-screen transition-opacity duration-[2500ms] ease-out ${globeVisible ? 'opacity-60' : 'opacity-0'}`}
        >
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
      )}
    </div>
  );
};

export default GridBackground;
