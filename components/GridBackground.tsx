
import React from 'react';
import { PixelGlobe } from './PixelGlobe';

interface GridBackgroundProps {
  hide?: boolean;
  startAnimation?: boolean;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ hide = false, startAnimation = false }) => {
  return (
    <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${hide ? 'opacity-0' : 'opacity-100'}`}>
      {/* Modern Grid Background */}
      <div className="background-container">
          <div className="bg-grid">
              <div className="glow-1"></div>
              <div className="glow-2"></div>
          </div>
      </div>

      {/* PixelGlobe Beeldmerk - 3 gekleurde bollen */}
      {startAnimation && (
        <div className="absolute inset-0 z-[5] opacity-30">
          <PixelGlobe
            scaleMultiplier={0.5}
            type="all"
            opacity={0.6}
            entranceAnimation={true}
            glowEnabled={true}
            largeParticles={true}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-[15]"></div>
    </div>
  );
};

export default GridBackground;
