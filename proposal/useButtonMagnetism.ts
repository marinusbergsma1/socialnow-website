import { useEffect } from 'react';

export function useButtonMagnetism() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active: HTMLElement | null = null;
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      active?.style.removeProperty('--sn-pill-x');
      active?.style.removeProperty('--sn-pill-y');
      active = null;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || motion.matches) return;
      const button = event.target instanceof Element
        ? event.target.closest<HTMLElement>('.sn-site .sn-pill:not(:disabled)')
        : null;
      if (button !== active) reset();
      if (!button) return;
      active = button;
      const rect = button.getBoundingClientRect();
      const x = Math.max(-5, Math.min(5, (event.clientX - rect.left - rect.width / 2) * .08));
      const y = Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height / 2) * .12));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        button.style.setProperty('--sn-pill-x', `${x}px`);
        button.style.setProperty('--sn-pill-y', `${y}px`);
      });
    };
    const leave = (event: PointerEvent) => {
      if (active && (!(event.relatedTarget instanceof Node) || !active.contains(event.relatedTarget))) reset();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerout', leave);
    window.addEventListener('blur', reset);
    motion.addEventListener('change', reset);
    return () => {
      reset();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', reset);
      motion.removeEventListener('change', reset);
    };
  }, []);
}
