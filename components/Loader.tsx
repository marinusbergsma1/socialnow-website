
import React, { useEffect, useState, useRef, useCallback } from 'react';

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
  const hasCompleted = useRef(false);

  // Single exit function to prevent double-fires
  const triggerExit = useCallback((delayMs = 400) => {
    if (hasCompleted.current || !isMounted.current) return;
    hasCompleted.current = true;
    setIsExiting(true);
    setTimeout(() => {
      if (isMounted.current) onComplete();
    }, delayMs);
  }, [onComplete]);

  useEffect(() => {
    isMounted.current = true;
    hasCompleted.current = false;

    const video = videoRef.current;
    let canPlayFired = false;

    // Track if video actually starts playing
    const onCanPlay = () => { canPlayFired = true; };
    if (video) {
      video.addEventListener('canplay', onCanPlay, { once: true });
    }

    // If video hasn't even started loading after 4s, skip (broken network)
    const networkCheck = setTimeout(() => {
      if (!canPlayFired && !hasCompleted.current) {
        triggerExit(300);
      }
    }, 4000);

    // Safety fallback: absolute max wait of 15s to prevent infinite loader
    const safetyTimer = setTimeout(() => {
      triggerExit(300);
    }, 15000);

    return () => {
      isMounted.current = false;
      clearTimeout(networkCheck);
      clearTimeout(safetyTimer);
      if (video) {
        video.removeEventListener('canplay', onCanPlay);
      }
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

  const handleVideoEnd = () => {
    triggerExit(500);
  };

  const handleVideoError = () => {
    triggerExit(200);
  };

  // Allow clicking/tapping to skip the loader
  const handleSkip = () => {
    triggerExit(300);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[10001] bg-black flex items-center justify-center cursor-pointer transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
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
      </div>

      {/* Skip hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">Tik om over te slaan</p>
      </div>
    </div>
  );
};

export default Loader;
