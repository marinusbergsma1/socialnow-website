
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Milo help-launcher — links onderin (spiegelt de WhatsApp-knop rechts).
 * Volledige kop (object-contain, geen harde crop). Twee Higgsfield-clips:
 *   • milo-blink : rustige idle/knipper-loop (altijd, onderop).
 *   • milo-wave  : vrolijke begroeting-zwaai (eenmalig, bovenop).
 *
 * Choreografie (eenmalig bij binnenkomst):
 *   slide-up van onder → 3 stippen 1·2·3 (denkt) → zwaai, en tijdens de zwaai
 *   verschijnt de PLATTE tekst "HERE TO HELP!" (geen balkje) → daarna blink-loop.
 * Klikken opent de hulp (/contact).
 */
const D1 = 900, D2 = 1350, D3 = 1800, DOTS_END = 2500; // ms na entrance
const WAVE_AT = 2500;                                   // ms — zwaai + tekst

const MiloHelpLauncher: React.FC = () => {
  const navigate = useNavigate();
  const waveRef = useRef<HTMLVideoElement>(null);
  const [entered, setEntered] = useState(false);
  const [dotCount, setDotCount] = useState(0);
  const [waving, setWaving] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [ringOn, setRingOn] = useState(true);   // glow-ring alleen de eerste 5s

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setEntered(true), 500));
    timers.push(setTimeout(() => setRingOn(false), 5000)); // daarna alleen knipperen
    const base = 500;
    timers.push(setTimeout(() => setDotCount(1), base + D1));
    timers.push(setTimeout(() => setDotCount(2), base + D2));
    timers.push(setTimeout(() => setDotCount(3), base + D3));
    timers.push(setTimeout(() => setDotCount(0), base + DOTS_END));
    timers.push(setTimeout(() => {
      setWaving(true);
      setShowHelp(true);
      const w = waveRef.current;
      if (w) { w.currentTime = 0; w.play().catch(() => {}); }
    }, base + WAVE_AT));
    return () => timers.forEach(clearTimeout);
  }, []);

  const onWaveEnded = useCallback(() => {
    setWaving(false);
    setShowHelp(false);
  }, []);

  const openHelp = () => navigate('/contact');

  return (
    <div
      className="fixed bottom-6 left-6 z-[90] flex items-end gap-2.5 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{ transform: entered ? 'translateY(0)' : 'translateY(160px)', opacity: entered ? 1 : 0 }}
    >
      <style>{`
        @keyframes milo-glow-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.45); }
          70%  { box-shadow: 0 0 0 13px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        @keyframes milo-dot-in { 0% { opacity:0; transform:scale(0.3); } 100% { opacity:1; transform:scale(1); } }
        @keyframes milo-text-in {
          0% { opacity:0; transform:translateX(-10px) scale(0.9); }
          60% { opacity:1; transform:translateX(0) scale(1.04); }
          100% { opacity:1; transform:translateX(0) scale(1); }
        }
        .milo-ring { animation: milo-glow-pulse 2.6s ease-out infinite; }
        .milo-dot  { animation: milo-dot-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
        .milo-text { animation: milo-text-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        @media (prefers-reduced-motion: reduce) { .milo-ring,.milo-dot,.milo-text { animation:none !important; } }
      `}</style>

      <button
        onClick={openHelp}
        aria-label="Persoonlijke hulp — Milo"
        className={`relative shrink-0 rounded-full w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]
          transition-transform duration-300 hover:scale-110 active:scale-95 ${ringOn ? 'milo-ring' : ''}`}
      >
        {/* idle/knipper-loop — altijd onderop (echte alpha, geen screen-blend → normale kleur) */}
        <video
          autoPlay muted loop playsInline preload="auto" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        >
          <source src={`${import.meta.env.BASE_URL}video/milo-blink.webm?v=2`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}video/milo-blink.mp4?v=2`} type="video/mp4" />
        </video>

        {/* begroeting-zwaai — bovenop, alleen tijdens het zwaaien */}
        <video
          ref={waveRef}
          muted playsInline preload="auto" aria-hidden="true"
          onEnded={onWaveEnded}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200"
          style={{ opacity: waving ? 1 : 0 }}
        >
          <source src={`${import.meta.env.BASE_URL}video/milo-wave.webm?v=2`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}video/milo-wave.mp4?v=2`} type="video/mp4" />
        </video>

        {/* 3 losse stippen — verschijnen één voor één (1 · 2 · 3), rechtsboven */}
        {dotCount > 0 && (
          <span className="absolute -top-1.5 left-full ml-1 flex items-center gap-1.5">
            {[0, 1, 2].map((i) =>
              i < dotCount ? (
                <span key={i} className="milo-dot block w-2 h-2 rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.6)]" />
              ) : (
                <span key={i} className="block w-2 h-2" />
              )
            )}
          </span>
        )}

        {/* PLATTE tekst "HERE TO HELP!" — OP DEZELFDE PLEK als de puntjes (rechtsboven) */}
        {showHelp && (
          <span
            className="milo-text absolute -top-2.5 left-full ml-1 font-black uppercase tracking-tight text-sm md:text-base text-white whitespace-nowrap select-none pointer-events-none"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 18px rgba(37,211,102,0.55)' }}
          >
            HERE TO HELP!
          </span>
        )}
      </button>
    </div>
  );
};

export default MiloHelpLauncher;
