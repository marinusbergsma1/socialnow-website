
import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface PixelGlobeProps {
  scaleMultiplier?: number;
  type?: 'cyan' | 'pink' | 'yellow' | 'all';
  opacity?: number;
  entranceAnimation?: boolean;
  glowEnabled?: boolean;
  largeParticles?: boolean;
  scrollReactive?: boolean;
}

export const PixelGlobe: React.FC<PixelGlobeProps> = ({
  scaleMultiplier = 0.36,
  type = 'all',
  opacity = 1,
  entranceAnimation = false,
  glowEnabled = false,
  largeParticles = false,
  scrollReactive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Mobile performance: detect and reduce particle count significantly
    const isMobile = window.innerWidth < 768;
    const mobileFactor = isMobile ? 0.15 : 1; // 15% particles on mobile for performance

    let width = 0;
    let height = 0;
    const points: Point[] = [];

    const generateSphere = (count: number, radius: number, offsetX: number, offsetY: number, offsetZ: number, color: string) => {
      const adjustedCount = Math.round(count * mobileFactor);
      for (let i = 0; i < adjustedCount; i++) {
        const y = 1 - (i / (adjustedCount - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = 2.399963229728653 * i;
        points.push({
          x: (Math.cos(theta) * radiusAtY * radius) + offsetX,
          y: (y * radius) + offsetY,
          z: (Math.sin(theta) * radiusAtY * radius) + offsetZ,
          color
        });
      }
    };

    // Particle counts (reduced on mobile via mobileFactor)
    if (type === 'all' || type === 'cyan') {
      const count = largeParticles ? 2000 : (type === 'cyan' ? 2400 : 1200);
      generateSphere(count, 0.7, 0, 0, 0, '#00A3E0');
    }
    if (type === 'all' || type === 'pink') {
      const pOff = type === 'pink' ? 0 : 0.60;
      const pyOff = type === 'pink' ? 0 : -0.55;
      const count = largeParticles ? 1000 : (type === 'pink' ? 1600 : 700);
      generateSphere(count, type === 'pink' ? 0.7 : 0.40, pOff, pyOff, 0.2, '#F62961');
    }
    if (type === 'all' || type === 'yellow') {
      const yOff = type === 'yellow' ? 0 : -0.75;
      const yyOff = type === 'yellow' ? 0 : 0.45;
      const count = largeParticles ? 1200 : (type === 'yellow' ? 1200 : 700);
      generateSphere(count, type === 'yellow' ? 0.7 : 0.40, yOff, yyOff, -0.1, '#F7E644');
    }

    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    // Entrance animation state
    let entranceProgress = entranceAnimation ? 0 : 1;
    const entranceDuration = 2.5; // seconds
    let startTime: number | null = null;

    const resize = (entries: ResizeObserverEntry[]) => {
      window.requestAnimationFrame(() => {
        if (!entries.length) return;

        for (let entry of entries) {
          const { width: newWidth, height: newHeight } = entry.contentRect;
          width = Math.floor(newWidth);
          height = Math.floor(newHeight);

          if (!canvas || !ctx) return;

          const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      });
    };

    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);

    // Scroll-reactive rotation
    let scrollRotY = 0;
    let scrollRotX = 0;
    const handleScroll = () => {
      if (!scrollReactive) return;
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = pageHeight > 0 ? scrollY / pageHeight : 0;
      // Full 360° rotation over the page scroll + extra tilt
      scrollRotY = scrollProgress * Math.PI * 4;
      scrollRotX = Math.sin(scrollProgress * Math.PI * 2) * 0.4;
    };

    if (scrollReactive) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial position
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 1.5;
      targetRotX = -y * 1.5;
    };

    // Only track mouse on desktop — no hover on mobile
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    let time = 0;
    const sortedPoints = [...points];

    const render = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      // Update entrance progress
      if (entranceAnimation && entranceProgress < 1) {
        const elapsed = (timestamp - startTime) / 1000;
        entranceProgress = Math.min(1, elapsed / entranceDuration);
        // Ease out cubic
        entranceProgress = 1 - Math.pow(1 - entranceProgress, 3);
      }

      time += 0.007;
      ctx.clearRect(0, 0, width, height);

      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const autoRot = time * (type === 'all' ? 0.22 : 0.3);
      const effectiveRotX = rotX + (scrollReactive ? scrollRotX : 0);
      const effectiveRotY = rotY + autoRot + (scrollReactive ? scrollRotY : 0);

      const containerMin = Math.min(width, height);
      // Scale grows from 0 to full during entrance
      const entranceScale = entranceAnimation ? entranceProgress : 1;
      const baseRadius = containerMin * scaleMultiplier * 0.75 * entranceScale;
      const centerX = width / 2;
      const centerY = height / 2;
      const breatheScale = 1 + Math.sin(time * 1.1) * 0.03;

      // Skip sorting on mobile — massive perf gain, barely noticeable
      if (!isMobile) {
        sortedPoints.sort((a, b) => {
          const az = a.x * Math.sin(effectiveRotY) + a.z * Math.cos(effectiveRotY);
          const bz = b.x * Math.sin(effectiveRotY) + b.z * Math.cos(effectiveRotY);
          return bz - az;
        });
      }

      // Set glow if enabled (disabled on mobile for performance)
      if (glowEnabled && !isMobile) {
        ctx.shadowBlur = 4;
      }

      for (let i = 0; i < sortedPoints.length; i++) {
        const p = sortedPoints[i];
        const cosY = Math.cos(effectiveRotY);
        const sinY = Math.sin(effectiveRotY);
        const cosX = Math.cos(effectiveRotX);
        const sinX = Math.sin(effectiveRotX);

        let rx = p.x * cosY - p.z * sinY;
        let rz = p.x * sinY + p.z * cosY;
        let ry = p.y;

        const ryTemp = ry * cosX - rz * sinX;
        const rzTemp = ry * sinX + rz * cosX;
        ry = ryTemp;
        rz = rzTemp;

        if (rz > -2.5) {
          const perspectiveScale = (rz + 2.5) / 3.5;
          const px = centerX + rx * baseRadius * breatheScale;
          const py = centerY + ry * baseRadius * breatheScale;

          const pointAlpha = Math.min(1, Math.max(0.1, (rz + 1.8) / 2.5)) * opacity * entranceScale;
          // Larger particles when largeParticles is enabled
          const size = largeParticles
            ? Math.max(1.5, 3.5 * perspectiveScale)
            : Math.max(0.8, 2 * perspectiveScale);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = pointAlpha;

          if (glowEnabled && !isMobile) {
            ctx.shadowColor = p.color;
          }

          ctx.fillRect(px - size/2, py - size/2, size, size);
        }
      }

      // Reset
      ctx.globalAlpha = 1;
      if (glowEnabled) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }
      animationFrameId.current = requestAnimationFrame(renderWithTimestamp);
    };

    const renderWithTimestamp = (timestamp: number) => {
      if (!isVisible) {
        animationFrameId.current = null;
        return;
      }
      render(timestamp);
    };

    let isVisible = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
      if (isVisible && !animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(renderWithTimestamp);
      }
    }, { threshold: 0 });
    if (containerRef.current) visibilityObserver.observe(containerRef.current);

    animationFrameId.current = requestAnimationFrame(renderWithTimestamp);

    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollReactive) window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [scaleMultiplier, type, opacity, entranceAnimation, glowEnabled, largeParticles, scrollReactive]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center overflow-visible">
       <canvas ref={canvasRef} className="block pointer-events-none" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
};
