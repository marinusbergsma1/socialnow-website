import React, { useEffect, useRef, useState } from "react";
import { useMotion } from "./motion";

// Dezelfde drie bollen, kleuren en Fibonacci-punten als de bestaande
// PixelGlobe. Deze rustige uitvoering hoort alleen bij het websitevoorstel.
const spheres = [
  { radius: 0.4, x: -0.75, y: 0.45, z: -0.1, color: "#F7E644", count: 250 },
  { radius: 0.7, x: 0, y: 0, z: 0, color: "#00A3E0", count: 750 },
  { radius: 0.4, x: 0.6, y: -0.55, z: 0.2, color: "#F62961", count: 350 },
];

export function createGlobePoints(density = 1) {
  return spheres.flatMap((sphere) => {
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
  const { enabled } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pose = useRef({ time: 0, tiltX: 0, tiltY: 0 });
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return; // Het echte bestaande beeldmerk blijft zichtbaar.

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const interaction = (stage.closest(".h-hero") || stage) as HTMLElement;
    const mobile = window.innerWidth <= 600;
    const frameInterval = 1000 / (mobile ? 24 : 30);
    let width = 0;
    let height = 0;
    // Raster van de pagina: stippen op 16 + 32k in documentcoördinaten. gridX/gridY = eerste stip in het canvas.
    const GRID = 32;
    let gridX = 16;
    let gridY = 16;
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
    const cellen = new Map<number, { front: number; color: string }>();

    const canAnimate = () =>
      enabled &&
      !motionPreference.matches &&
      visible &&
      !document.hidden;

    const draw = () => {
      if (width <= 0 || height <= 0) return;
      const radius = Math.min(width * 0.34, height * 0.49);
      const angleY = 0.3 + time * 0.22 + tiltX;
      const angleX = -0.1 + tiltY;
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      context.clearRect(0, 0, width, height);

      // Sample the rotating surface at the existing page-grid dots. Meridians and
      // latitude bands make rotation visible without moving or adding any dots.
      cellen.clear();
      for (const sphere of spheres) {
        const R = sphere.radius * radius;
        const cx = width / 2 + sphere.x * radius;
        const cy = height / 2 + sphere.y * radius;
        const i0 = Math.max(0, Math.ceil((cx - R - gridX) / GRID));
        const i1 = Math.floor((cx + R - gridX) / GRID);
        const j0 = Math.max(0, Math.ceil((cy - R - gridY) / GRID));
        const j1 = Math.floor((cy + R - gridY) / GRID);
        for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
          const x = (gridX + i * GRID - cx) / R;
          const y = (gridY + j * GRID - cy) / R;
          const distance = x * x + y * y;
          if (distance >= 1) continue;
          const z = Math.sqrt(1 - distance);
          // Inverse rotation maps a screen dot onto the spinning sphere.
          const sy = y * cosX + z * sinX;
          const sz = z * cosX - y * sinX;
          const sx = x * cosY + sz * sinY;
          const depth = sz * cosY - x * sinY;
          const longitude = Math.atan2(sx, depth);
          const latitude = Math.asin(Math.max(-1, Math.min(1, sy)));
          const meridian = Math.exp(-Math.pow(Math.sin(longitude * 6) / .19, 2));
          const parallel = Math.exp(-Math.pow(Math.sin(latitude * 5) / .2, 2));
          const surface = .5 + .5 * Math.sin(longitude * 3 + Math.sin(latitude * 4));
          const front = Math.min(1, (.3 + surface * .25 + Math.max(meridian, parallel) * .45) * (.55 + z * .45));
          const key = j * 4096 + i;
          const old = cellen.get(key);
          if (!old || front > old.front) cellen.set(key, { front, color: sphere.color });
        }
      }
      for (const [key, cel] of cellen) {
        const i = key % 4096, j = (key - i) / 4096;
        context.globalAlpha = 0.4 + cel.front * 0.6;
        context.fillStyle = cel.color;
        context.beginPath();
        context.arc(gridX + i * GRID, gridY + j * GRID, 1 + cel.front * 0.6, 0, 7);
        context.fill();
      }
      context.globalAlpha = 1;
      if (!disposed && !announced) {
        announced = true;
        setReady(true);
      }
    };

    const tick = (timestamp: number) => {
      frame = null;
      if (!canAnimate() || disposed) return;
      const elapsed = lastTimestamp ? timestamp - lastTimestamp : frameInterval;
      if (elapsed >= frameInterval - 1) {
        const delta = Math.min(elapsed / 1000, 0.06);
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
      const docX = bounds.left + window.scrollX, docY = bounds.top + window.scrollY;
      gridX = (((16 - docX) % GRID) + GRID) % GRID;
      gridY = (((16 - docY) % GRID) + GRID) % GRID;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const move = (event: PointerEvent) => {
      if (!canAnimate()) return;
      const bounds = interaction.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.5;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.9;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const observer = new ResizeObserver(resize);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        syncAnimation();
      },
      { threshold: 0.05 },
    );
    observer.observe(stage);
    visibility.observe(stage);
    document.addEventListener("visibilitychange", syncAnimation);
    interaction.addEventListener("pointermove", move, { passive: true });
    interaction.addEventListener("pointerleave", leave);
    resize();
    syncAnimation();

    return () => {
      disposed = true;
      pose.current = { time, tiltX, tiltY };
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      interaction.removeEventListener("pointermove", move);
      interaction.removeEventListener("pointerleave", leave);
    };
  }, [reducedMotion, enabled]);

  return (
    <div className="brand-globe" data-ready={ready}>
      <div ref={stageRef} className="brand-globe-stage" aria-hidden="true">
        <img
          className="brand-globe-fallback"
          src="/beeldmerk-2026.webp"
          alt=""
          width="240"
          height="240"
        />
        <canvas ref={canvasRef} className="brand-globe-canvas" />
      </div>

    </div>
  );
}
