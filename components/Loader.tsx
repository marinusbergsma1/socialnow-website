
import React, { useEffect, useState, useRef } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    // Responsive source selection
    const isPC = window.innerWidth > 1024;
    const src = isPC 
      ? "https://storage.googleapis.com/video-slider/SocialNow%20Logo%20animatie%20PC.mp4" 
      : "https://storage.googleapis.com/video-slider/Logo%20Animatie/SocialNow%20Logo%20Animatie%202026.mp4";
    
    setVideoSrc(src);

    // Safety fallback: if the video doesn't fire onEnded within 9 seconds, proceed to site.
    const fallbackTimer = setTimeout(() => {
      if (!isExiting && isMounted.current) {
        setIsExiting(true);
        setTimeout(onComplete, 800);
      }
    }, 9000);

    return () => {
      isMounted.current = false;
      clearTimeout(fallbackTimer);
    };
  }, [isExiting, onComplete]);

  // Attempt to play automatically
  useEffect(() => {
    if (videoSrc && videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay with sound was blocked. 
          // We must mute to at least show the animation, as requested "Zonder de knop".
          if (videoRef.current && isMounted.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [videoSrc]);

  // If the user clicks anywhere on the black loading screen, try to unmute.
  // This is a subtle way to get audio if autoplay was blocked.
  const handleOverlayClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoEnd = () => {
    if (!isMounted.current) return;
    setIsExiting(true);
    // Smooth transition to reveal the site
    setTimeout(() => {
      if (isMounted.current) onComplete();
    }, 800);
  };

  return (
    <div 
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-[10001] bg-black flex items-center justify-center cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? 'opacity-0 scale-110 blur-2xl pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
        {videoSrc && (
          <video 
            ref={videoRef}
            src={videoSrc}
            playsInline
            autoPlay
            onEnded={handleVideoEnd}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
          />
        )}
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
