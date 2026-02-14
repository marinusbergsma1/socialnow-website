
import React, { useEffect, useRef } from 'react';

interface Pixel {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

const GREENS = [
  '#25D366',   // brand green
  '#1EB954',   // spotify green
  '#34D399',   // emerald
  '#22C55E',   // green-500
  '#4ADE80',   // green-400
  '#86EFAC',   // green-300 (lighter)
];

// Skip entirely on touch/mobile devices — no canvas, no RAF loop, no memory
const isPointerCoarse = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches;

const PixelCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const isTouchRef = useRef(false);

  useEffect(() => {
    if (isPointerCoarse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect touch device — disable effect on mobile
    const onTouchStart = () => { isTouchRef.current = true; };
    window.addEventListener('touchstart', onTouchStart, { once: true, passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const spawnPixel = (x: number, y: number, burst = false) => {
      const count = burst ? 12 + Math.floor(Math.random() * 8) : 1;
      for (let i = 0; i < count; i++) {
        const angle = burst ? Math.random() * Math.PI * 2 : Math.random() * Math.PI * 2;
        const speed = burst ? 1.5 + Math.random() * 4 : 0.3 + Math.random() * 1.5;
        pixelsRef.current.push({
          x: x + (burst ? (Math.random() - 0.5) * 8 : 0),
          y: y + (burst ? (Math.random() - 0.5) * 8 : 0),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + (burst ? -1 : -0.5),
          size: burst ? 2 + Math.random() * 4 : 1.5 + Math.random() * 3,
          alpha: burst ? 0.9 + Math.random() * 0.1 : 0.5 + Math.random() * 0.4,
          decay: burst ? 0.012 + Math.random() * 0.015 : 0.015 + Math.random() * 0.02,
          color: GREENS[Math.floor(Math.random() * GREENS.length)],
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };

      const now = performance.now();
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn pixels based on movement speed — more pixels when moving faster
      if (dist > 4 && now - lastSpawnRef.current > 16) {
        const count = Math.min(Math.floor(dist / 8), 4);
        for (let i = 0; i < count; i++) {
          const t = i / count;
          spawnPixel(
            prevMouseRef.current.x + dx * t + (Math.random() - 0.5) * 10,
            prevMouseRef.current.y + dy * t + (Math.random() - 0.5) * 10,
          );
        }
        lastSpawnRef.current = now;
      }
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      spawnPixel(e.clientX, e.clientY, true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pixels = pixelsRef.current;

      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gentle gravity
        p.vx *= 0.99;  // air resistance
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          pixels.splice(i, 1);
          continue;
        }

        // Draw pixel (crisp square — no anti-aliasing)
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Snap to pixel grid for that crisp retro pixel feel
        const sx = Math.round(p.x);
        const sy = Math.round(p.y);
        const ss = Math.round(p.size);
        ctx.fillRect(sx, sy, ss, ss);

        // Subtle glow on brighter pixels
        if (p.alpha > 0.5) {
          ctx.globalAlpha = p.alpha * 0.15;
          ctx.fillRect(sx - 1, sy - 1, ss + 2, ss + 2);
        }
      }

      ctx.globalAlpha = 1;

      // Cap pixel count for performance
      if (pixels.length > 300) {
        pixels.splice(0, pixels.length - 300);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  if (isPointerCoarse) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
};

export default PixelCursor;
