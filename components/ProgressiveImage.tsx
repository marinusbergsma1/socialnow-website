
import React, { useState } from 'react';

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
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#0a0a0a] ${className}`} style={{ width, height }}>
      {hasError ? (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Laden mislukt</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full transition-opacity duration-700 ease-out ${
            objectFit === 'cover' ? 'object-cover' : 'object-contain'
          } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
