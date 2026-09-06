import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

// Dezelfde drie bollen, kleuren en Fibonacci-punten als de bestaande
// PixelGlobe. Deze rustige uitvoering hoort alleen bij het websitevoorstel.
const spheres = [
  { radius: .4, x: -.75, y: .45, z: -.1, color: '#F7E644', count: 250 },
  { radius: .7, x: 0, y: 0, z: 0, color: '#00A3E0', count: 750 },
  { radius: .4, x: .60, y: -.55, z: .2, color: '#F62961', count: 350 },
];

export function createGlobePoints(density = 1) {
  return spheres.flatMap(sphere => {
    const count = Math.max(2, Math.round(sphere.count * density));
    return Array.from({ length: count }, (_, index) => {
      const y = 1 - (index / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const angle = 2.399963229728653 * index;
      return {
        x: Math.cos(angle) * radiusAtY * sphere.radius,
        y: y * sphere.radius,
        z: Math.sin(angle) * radiusAtY * sphere.radius,
        sphere,
      };
    });
  });
}

export default function BrandGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pose = useRef({ time: 0, tiltX: 0, tiltY: 0 });
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return; // Het echte bestaande beeldmerk blijft zichtbaar.

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const mobile = window.innerWidth <= 600;
    const points = createGlobePoints(mobile ? .55 : 1);
    const frameInterval = 1000 / (mobile ? 24 : 30);
    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let lastTimestamp = 0;
    let time = pose.current.time;
    let visible = true;
    let disposed = false;
    let pointerX = 0;
    let pointerY = 0;
    let tiltX = pose.current.tiltX;
    let tiltY = pose.current.tiltY;
    let announced = false;

    const canAnimate = () => !paused && !motionPreference.matches && visible && !document.hidden;

    const draw = () => {
      if (width <= 0 || height <= 0) return;
      const radius = Math.min(width * .34, height * .49);
      const angleY = .3 + time * .085 + tiltX;
      const angleX = -.10 + tiltY;
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      context.clearRect(0, 0, width, height);

      // Rotatie per bol houdt de vertrouwde merkcompositie herkenbaar.
      const projected = points.map(point => {
        const x = point.x * cosY - point.z * sinY;
        const z = point.x * sinY + point.z * cosY;
        const y = point.y * cosX - z * sinX;
        const depth = point.y * sinX + z * cosX;
        return { x: x + point.sphere.x, y: y + point.sphere.y, depth, point };
      }).sort((a, b) => (a.depth + a.point.sphere.z) - (b.depth + b.point.sphere.z));

      for (const dot of projected) {
        const front = (dot.depth / dot.point.sphere.radius + 1) / 2;
        const size = (mobile ? 1.35 : 1.5) + front * 1.1;
        context.globalAlpha = .18 + front * .78;
        context.fillStyle = dot.point.sphere.color;
        context.fillRect(width / 2 + dot.x * radius - size / 2, height / 2 + dot.y * radius - size / 2, size, size);
      }
      context.globalAlpha = 1;
      if (!disposed && !announced) { announced = true; setReady(true); }
    };

    const tick = (timestamp: number) => {
      frame = null;
      if (!canAnimate() || disposed) return;
      const elapsed = lastTimestamp ? timestamp - lastTimestamp : frameInterval;
      if (elapsed >= frameInterval - 1) {
        const delta = Math.min(elapsed / 1000, .06);
        time += delta;
        const follow = 1 - Math.exp(-delta * 3);
        tiltX += (pointerX - tiltX) * follow;
        tiltY += (pointerY - tiltY) * follow;
        draw();
        lastTimestamp = timestamp;
      }
      frame = requestAnimationFrame(tick);
    };

    const syncAnimation = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTimestamp = 0;
      if (canAnimate()) frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = Math.round(bounds.width);
      height = Math.round(bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const move = (event: PointerEvent) => {
      if (!finePointer || !canAnimate()) return;
      const bounds = stage.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * .25;
      pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * .16;
    };
    const leave = () => { pointerX = 0; pointerY = 0; };
    const observer = new ResizeObserver(resize);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      syncAnimation();
    }, { threshold: .05 });
    observer.observe(stage);
    visibility.observe(stage);
    document.addEventListener('visibilitychange', syncAnimation);
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', leave);
    resize();
    syncAnimation();

    return () => {
      disposed = true;
      pose.current = { time, tiltX, tiltY };
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', syncAnimation);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', leave);
    };
  }, [paused, reducedMotion]);

  return (
    <div className="brand-globe" data-ready={ready}>
      <div ref={stageRef} className="brand-globe-stage" aria-hidden="true">
        <img className="brand-globe-fallback" src="/beeldmerk-2026.webp" alt="" width="240" height="240" />
        <canvas ref={canvasRef} className="brand-globe-canvas" />
      </div>
      {ready && !reducedMotion && <button className="globe-motion" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Globe laten bewegen' : 'Globe pauzeren'}>
        {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}<span>{paused ? 'Afspelen' : 'Pauze'}</span>
      </button>}
    </div>
  );
}
