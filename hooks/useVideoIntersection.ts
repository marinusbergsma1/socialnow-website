import { useEffect, useRef, useState } from 'react';

interface UseVideoIntersectionOptions {
  rootMargin?: string;
  threshold?: number;
  autoPlay?: boolean;
}

/**
 * Hook that manages video playback based on viewport visibility.
 * - Video src is set directly via the HTML attribute (not via JS)
 * - Plays video when visible, pauses when not
 * - Returns refs and state for the consumer to use
 */
export function useVideoIntersection(
  src: string,
  options: UseVideoIntersectionOptions = {}
) {
  const {
    rootMargin = '200px',
    threshold = 0.1,
    autoPlay = true,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Intersection Observer: track visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  // Play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible && autoPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setHasLoadedOnce(true))
          .catch(() => {
            video.muted = true;
            video.play()
              .then(() => setHasLoadedOnce(true))
              .catch(() => {});
          });
      }
    } else if (!isVisible && hasLoadedOnce) {
      video.pause();
    }
  }, [isVisible, hasLoadedOnce, autoPlay]);

  // Mark loaded once when video can play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setHasLoadedOnce(true);
    video.addEventListener('canplay', handleCanPlay);
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, []);

  return {
    containerRef,
    videoRef,
    isVisible,
    hasLoadedOnce,
    src, // Pass this as the src attribute on the video element
  };
}
