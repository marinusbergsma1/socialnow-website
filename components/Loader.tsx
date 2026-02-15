
import React, { useEffect, useState, useRef } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

// Compute video src immediately (no useState waterfall)
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth <= 1024;
const getLoaderSrc = () => {
  return isMobileDevice
    ? "https://storage.googleapis.com/video-slider/Logo%20Animatie/SocialNow%20Logo%20Animatie%202026.mp4"
    : "https://storage.googleapis.com/video-slider/SocialNow%20Logo%20animatie%20PC.mp4";
};

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const videoSrc = getLoaderSrc();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // Safety fallback: if the video doesn't fire onEnded, proceed to site.
    // Give enough time for the logo animation to finish before showing the site.
    const fallbackMs = isMobileDevice ? 3000 : 6000;
    const exitMs = isMobileDevice ? 300 : 600;
    const fallbackTimer = setTimeout(() => {
      if (isMounted.current) {
        setIsExiting(true);
        setTimeout(onComplete, exitMs);
      }
    }, fallbackMs);

    return () => {
      isMounted.current = false;
      clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up video on unmount so it doesn't keep playing in the background
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOverlayClick = () => {
    // Clicking the loader doesn't do anything — video is always muted for fast autoplay
  };

  const handleVideoEnd = () => {
    if (!isMounted.current) return;
    setIsExiting(true);
    setTimeout(() => {
      if (isMounted.current) onComplete();
    }, 600);
  };

  // Handle video load errors — skip loader immediately
  const handleVideoError = () => {
    if (!isMounted.current || isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (isMounted.current) onComplete();
    }, 400);
  };

  return (
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-[10001] bg-black flex items-center justify-center cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? 'opacity-0 scale-110 blur-2xl pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          autoPlay
          muted
          preload="auto"
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
      
      {/* Subtle indicator that sound is coming/available */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
          <div className="flex gap-1 items-end h-4">
              {[0.4, 0.7, 0.5, 0.9, 0.3].map((h, i) => (
                  <div key={i} className="w-1 bg-white rounded-full animate-pulse" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Loader;
