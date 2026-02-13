
import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ 
  beforeImage, 
  afterImage, 
  className = "",
  beforeLabel = "REALITEIT",
  afterLabel = "IMPRESSIE"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);
  
  // Attach global event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches?.length > 0) {
        if (e.cancelable) e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };
    
    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging]);

  const handleLocalClick = (e: React.MouseEvent) => {
     handleMove(e.clientX);
  };

  return (
    <div 
        ref={containerRef}
        className={`relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group isolate touch-none ${className}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleLocalClick}
    >
      {/* AFTER Image (Background - Impression) */}
      <img 
        src={afterImage} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
      />

      {/* BEFORE Image (Foreground - Reality - clipped) */}
      <img 
        src={beforeImage} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} 
      />

      {/* Slider Handle Line */}
      <div 
        className="absolute top-0 bottom-0 w-[4px] bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
         {/* Handle Circle */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#050505] border-2 border-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-transform duration-300 ${isDragging ? 'scale-110 border-[#F7E644]' : 'scale-100 hover:scale-105'}`}>
            <MoveHorizontal size={24} className={`transition-colors duration-300 ${isDragging ? 'text-[#F7E644]' : 'text-white'}`} />
            
            {/* Pulsing ring when idle */}
            <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping"></div>
         </div>
      </div>
      
    </div>
  );
};

export default BeforeAfterSlider;
