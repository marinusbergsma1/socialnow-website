import { useEffect, RefObject } from 'react';

/**
 * Updates CSS custom properties on an element based on scroll position.
 * Uses requestAnimationFrame throttling to avoid React re-renders.
 *
 * @param ref - Element ref to set CSS vars on
 * @param callback - Receives the element's BoundingClientRect, should call
 *                   ref.current.style.setProperty() to set CSS vars directly
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  callback: (rect: DOMRect, viewportHeight: number) => void
) {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          callback(rect, window.innerHeight);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, callback]);
}
