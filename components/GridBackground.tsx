
import React, { useState, useEffect, useRef } from 'react';
import { PixelGlobe } from './PixelGlobe';

interface GridBackgroundProps {
  hide?: boolean;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ hide = false }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);
  
  const scrollYRef = useRef(0);
  const lerpScrollY = useRef(0);
  const requestRef = useRef<number>(null);

  const animate = (t: number) => {
    setTime(t / 1000);
    lerpScrollY.current += (scrollYRef.current - lerpScrollY.current) * 0.1;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Slight delay to ensure elements don't pop in too abruptly once hide is false
    const timer = setTimeout(() => setStartAnimation(true), 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      clearTimeout(timer);
    };
  }, []);

  // Increased core size from 95 to 110 for "Larger" request
  const coreSize = 110;
  const coreRadius = coreSize / 2;
  const scrollInfluence = lerpScrollY.current * 0.0015; 
  const totalPhase = scrollInfluence;

  const floatY = Math.sin(time * 0.5) * 1.5;
  const cyanX = Math.cos(totalPhase * 0.04) * 1.2;

  // Standardization: All planets now use coreRadius as a base to be "Equal in Size"
  const pinkBaseRadiusX = coreRadius * 0.72; 
  const pinkAngle = totalPhase;
  const pinkDepth = Math.sin(pinkAngle + Math.PI/2);
  const pinkXMult = Math.cos(pinkAngle) * pinkBaseRadiusX;
  const pinkYMult = Math.sin(pinkAngle) * 8; 
  const pinkZIndex = pinkDepth > 0 ? 'z-30' : 'z-[5]';

  const yellowBaseRadiusX = coreRadius * 0.45; // Adjusted distance
  const yellowAngle = totalPhase + Math.PI;
  const yellowDepth = Math.sin(yellowAngle + Math.PI/2);
  const yellowXMult = Math.cos(yellowAngle) * yellowBaseRadiusX;
  const yellowYMult = Math.sin(yellowAngle) * 6;
  const yellowZIndex = yellowDepth > 0 ? 'z-30' : 'z-[5]';

  // CRITICAL: Ensure 0 opacity if hide is true OR animation hasn't started
  const globeOpacity = (hide || !startAnimation) ? 0 : 1;
  const mouseXEffect = mousePos.x * 20; 
  const mouseYEffect = mousePos.y * 20;

  const globeContainerClasses = "fixed top-1/2 left-1/2 flex items-center justify-center transition-opacity duration-[1500ms] ease-out will-change-transform overflow-visible";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* NEW: Modern Grid Background Container */}
      <div className="background-container">
          <div className="bg-grid">
              <div className="glow-1"></div>
              <div className="glow-2"></div>
          </div>
      </div>
      
      {/* 1. CYAN CORE - Large and Darker */}
      <div 
        className={`${globeContainerClasses} z-10`}
        style={{
          width: `${coreSize}vmin`,
          height: `${coreSize}vmin`,
          opacity: globeOpacity,
          transform: `translate(
            calc(-50% + (${cyanX}vmin) + (${mouseXEffect * 0.15}px)), 
            calc(-50% + (${mouseYEffect * 0.15}px) + (${floatY * 0.3}vmin))
          ) scale(${startAnimation ? 1.1 : 0.8})`
        }}
      >
        <div className="w-[140%] h-[140%]">
          <PixelGlobe type="cyan" scaleMultiplier={0.5} opacity={0.3} />
        </div>
      </div>

      {/* 2. PINK PLANET - Now same scale as Core, slightly darker */}
      <div 
        className={`${globeContainerClasses} ${pinkZIndex}`}
        style={{
          width: `${coreSize}vmin`,
          height: `${coreSize}vmin`,
          opacity: globeOpacity,
          transform: `translate(
            calc(-50% + (${pinkXMult}vmin) + (${mouseXEffect * 0.9}px)), 
            calc(-50% + (${pinkYMult}vmin) + (${mouseYEffect * 0.9}px) + (${floatY}vmin))
          ) scale(${startAnimation ? (1.0 + (pinkDepth * 0.15)) : 0.5})`
        }}
      >
        <div className="w-[140%] h-[140%]">
          <PixelGlobe type="pink" scaleMultiplier={0.5} opacity={0.4} />
        </div>
      </div>

      {/* 3. YELLOW PLANET - Now same scale as Core, slightly darker */}
      <div 
        className={`${globeContainerClasses} ${yellowZIndex}`}
        style={{
          width: `${coreSize}vmin`, 
          height: `${coreSize}vmin`, 
          opacity: globeOpacity,
          transform: `translate(
            calc(-50% + (${yellowXMult}vmin) + (${mouseXEffect * 0.7}px)), 
            calc(-50% + (${yellowYMult}vmin) + (${mouseYEffect * 0.7}px) + (${floatY * 1.2}vmin))
          ) scale(${startAnimation ? (0.9 + (yellowDepth * 0.12)) : 0.5})`
        }}
      >
        <div className="w-[140%] h-[140%]">
          <PixelGlobe type="yellow" scaleMultiplier={0.5} opacity={0.5} />
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-[15]"></div>
    </div>
  );
};

export default GridBackground;
