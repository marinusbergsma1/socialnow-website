import React, { useCallback, useEffect, useRef, useState } from 'react';
import GenerateButton from './GenerateButton';

/**
 * MiloHeaderShow — de interactieve header-intro.
 * Overlay over de hero: slapende Milo (poster) + Genereer-knop.
 * Klik → 6s master-video (met geluid, want user gesture) → hero fade-in.
 * 1× per sessie (sessionStorage); reduced-motion of video-fout → direct hero.
 */

type Phase = 'sleep' | 'playing' | 'done';

const KEY = 'milo-show';

const initialPhase = (): Phase => {
  try {
    if (sessionStorage.getItem(KEY) === 'done') return 'done';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'done';
  } catch { /* SSR/privacy mode */ }
  return 'sleep';
};

export const useMiloShow = () => {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const finish = useCallback(() => {
    try { sessionStorage.setItem(KEY, 'done'); } catch { /* noop */ }
    setPhase('done');
  }, []);
  return { phase, setPhase, finish };
};

interface MiloHeaderShowProps {
  phase: Phase;
  onStart: () => void;
  onFinish: () => void;
}

const MiloHeaderShow: React.FC<MiloHeaderShowProps> = ({ phase, onStart, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);

  // Zachte fade-out van de overlay zodra de video klaar is
  const handleEnded = useCallback(() => {
    setLeaving(true);
    setTimeout(onFinish, 450);
  }, [onFinish]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => handleEnded()); // autoplay-block of fout → gewoon door
  }, [phase, handleEnded]);

  if (phase === 'done') return null;

  return (
    <div
      className={`absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Slapende Milo (poster) — blijft staan tot de video het eerste frame toont */}
      <div className="relative w-full max-w-[1200px] px-4">
        <img
          src={`${import.meta.env.BASE_URL}images/milo-header-poster.webp`}
          alt="Milo, de SocialNow AI-assistent, slaapt"
          className={`w-full h-auto max-h-[62svh] object-contain transition-opacity duration-300 ${phase === 'playing' ? 'opacity-0' : 'opacity-100'}`}
          decoding="async"
        />
        <video
          ref={videoRef}
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onError={handleEnded}
          className={`absolute inset-0 w-full h-full max-h-[62svh] object-contain px-4 transition-opacity duration-300 ${phase === 'playing' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <source src={`${import.meta.env.BASE_URL}video/milo-header-6s.webm?v=1`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}video/milo-header-6s.mp4?v=1`} type="video/mp4" />
        </video>
      </div>

      {/* Genereer-knop — verdwijnt zodra de show draait */}
      <div className={`mt-8 md:mt-10 transition-all duration-300 ${phase === 'playing' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
        <GenerateButton onClick={onStart} />
        <p className="text-white/25 text-[10px] font-black uppercase tracking-[0.35em] text-center mt-5">
          Klik en zie wat wij bouwen
        </p>
      </div>
    </div>
  );
};

export default MiloHeaderShow;
