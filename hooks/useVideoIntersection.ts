import { useEffect, useRef, useState } from 'react';

interface UseVideoIntersectionOptions {
  rootMargin?: string;
  threshold?: number;
  autoPlay?: boolean;
}

/**
 * Hook that manages video loading and playback based on viewport visibility.
 * - Only sets video src when element is near the viewport (lazy loading)
 * - Plays video when visible, pauses when not
 * - Never clears src to prevent re-downloads
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
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Load src once when first visible, play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      // First time visible: set src and load
      if (!hasLoadedOnce && src) {
        video.src = src;
        video.load();
        setHasLoadedOnce(true);
      }

      // Play when visible (if autoPlay enabled)
      if (autoPlay && hasLoadedOnce) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Retry muted (browser autoplay policy)
              video.muted = true;
              video.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
            });
        }
      }
    } else {
      // Not visible: just pause, DON'T clear src
      if (hasLoadedOnce) {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, [isVisible, hasLoadedOnce, src, autoPlay]);

  return {
    containerRef,
    videoRef,
    isVisible,
    hasLoadedOnce,
    isPlaying,
  };
}
