
import React, { useState, useEffect } from 'react';
import { PixelGlobe } from './PixelGlobe';

interface GridBackgroundProps {
  hide?: boolean;
  startAnimation?: boolean;
}

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
    // NIET position:fixed: een fixed backdrop-provider leeft in een eigen
    // compositor-laag en Chromium's backdrop-filter capteert die vanuit een
    // gescrollde context onbetrouwbaar (glas "sterft" op sommige scroll-
    // posities). absolute + sticky geeft exact hetzelfde beeld, maar in
    // dezelfde scroll-laag als de tiles → capture werkt overal.
    <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${hide ? 'opacity-0' : 'opacity-100'}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Globes only — desktop for performance */}
        {!isMobile && startAnimation && (
          <div className={`absolute inset-0 z-[5] transition-opacity duration-[2500ms] ease-out ${globeVisible ? 'opacity-60' : 'opacity-0'}`}>
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
    </div>
  );
};

export default GridBackground;
