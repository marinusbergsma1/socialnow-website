
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
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${hide ? 'opacity-0' : 'opacity-100'}`}>
      {/* Grid + Glows + PixelGlobe — desktop only for mobile performance */}
      {!isMobile && (
        <>
          <div className="background-container">
            <div className="bg-grid">
              <div className="glow-1"></div>
              <div className="glow-2"></div>
            </div>
          </div>

          {startAnimation && (
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

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-[15]"></div>
        </>
      )}
    </div>
  );
};

export default GridBackground;
