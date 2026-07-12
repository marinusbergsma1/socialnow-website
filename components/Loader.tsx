
import React, { useEffect, useState, useRef, useCallback } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const VIDEO_SRC = `${import.meta.env.BASE_URL}video/header-intro.mp4?v=5`;

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMounted = useRef(true);
  const hasCompleted = useRef(false);

  // Single exit function to prevent double-fires: fade out, then onComplete
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

    // Kick off playback explicitly so we can catch autoplay-block rejections
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked: skip the opener almost immediately
          triggerExit(300);
        });
      }
    }

    // Safety net: if onEnded never fires (e.g. stalled playback), exit after 6s
    const safetyTimer = setTimeout(() => {
      triggerExit(400);
    }, 6000);

    return () => {
      isMounted.current = false;
      clearTimeout(safetyTimer);
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
    triggerExit(400);
  };

  const handleVideoError = () => {
    triggerExit(200);
  };

  // Allow clicking/tapping anywhere to skip the opener
  const handleSkip = () => {
    triggerExit(400);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[10001] bg-black flex items-center justify-center cursor-pointer transition-opacity duration-[400ms] ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Mobile: 16:9 band vertically centered on black. Desktop (md+): fullscreen cover. */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        className="w-full object-contain pointer-events-none md:absolute md:inset-0 md:h-full md:object-cover"
      />

      {/* Skip hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">Tik om over te slaan</p>
      </div>
    </div>
  );
};

export default Loader;
