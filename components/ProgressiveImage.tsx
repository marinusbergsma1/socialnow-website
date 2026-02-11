
import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'cover' | 'contain';
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  width, 
  height,
  objectFit = 'cover'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRealImage, setShowRealImage] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      setTimeout(() => setShowRealImage(true), 50);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-transparent ${className}`} style={{ width, height }}>
      {/* Lage kwaliteit / Blur laag */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${showRealImage ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: objectFit,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: 'blur(20px) saturate(1.5)',
          transform: 'scale(1.05)',
          willChange: 'filter, opacity'
        }}
      />
      
      {/* De echte afbeelding */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none will-change-[opacity,transform] ${
          objectFit === 'cover' ? 'object-cover' : 'object-contain'
        } ${
          showRealImage ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        }`}
        loading="lazy"
        decoding="async"
      />
      
      {/* Scanline / Loading effect */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-[#25D366]/5 to-transparent animate-[scan-move_2s_infinite] will-change-transform"></div>
        </div>
      )}
      
      <style>{`
        @keyframes scan-move {
          0% { transform: translate3d(0, -100%, 0); }
          100% { transform: translate3d(0, 100%, 0); }
        }
      `}</style>
    </div>
  );
};

export default ProgressiveImage;
