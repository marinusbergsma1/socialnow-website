
import React, { useState, useEffect } from 'react';
import { PixelGlobe } from './PixelGlobe';

interface GridBackgroundProps {
  hide?: boolean;
  startAnimation?: boolean;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ hide = false, startAnimation = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black transition-opacity duration-1000 ${hide ? 'opacity-0' : 'opacity-100'}`}>
      {/* Globes only — desktop for performance */}
      {!isMobile && startAnimation && (
        <div className="absolute inset-0 z-[5] opacity-40">
          <PixelGlobe
            scaleMultiplier={0.5}
            type="all"
            opacity={0.7}
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
