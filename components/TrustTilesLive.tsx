import React, { useEffect, useRef, useState } from 'react';

/**
 * TrustTilesLive — code-geanimeerde (Remotion-stijl) versies van de drie
 * trust-tiles: WhatsApp-chat, secure-dashboard en groei-ring. Elke tile
 * herstart zijn animatie wanneer hij uit beeld scrolt en weer terugkomt
 * (IntersectionObserver → key-bump → verse CSS-animaties).
 */

// Herstart-hook: runId bumpt telkens wanneer de tile opnieuw in beeld komt
const useRestartOnView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);
  const wasOut = useRef(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && wasOut.current) {
        wasOut.current = false;
        setRunId((n) => n + 1); // verse key → animaties beginnen opnieuw
      } else if (!e.isIntersecting) {
        wasOut.current = true;
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, runId };
};

const TILE_CLASS = 'relative rounded-[28px] overflow-hidden border border-white/[0.06] bg-[#0a0a0a] aspect-[0.72]';
const TITLE_CLASS = 'relative z-10 p-6 md:p-7 text-white font-bold tracking-tight leading-snug text-lg md:text-xl max-w-[22ch]';

// ─── Tile 1: WhatsApp-chat ──────────────────────────────────────────────
export const ChatTile: React.FC = () => {
  const { ref, runId } = useRestartOnView();
  return (
    <div ref={ref} className={TILE_CLASS}>
      <style>{`
        @keyframes sn-tt-bubble { 0% { opacity: 0; transform: translateY(14px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes sn-tt-dot { 0%, 60%, 100% { opacity: 0.35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        @keyframes sn-tt-checks { 0%, 55% { opacity: 0; } 65%, 100% { opacity: 1; } }
        @keyframes sn-tt-glow { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.8; } }
        @media (prefers-reduced-motion: reduce) { .sn-tt-anim { animation: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>
      <div key={runId} className="absolute inset-0 flex flex-col justify-center px-7 gap-3">
        {/* contact-pill */}
        <div className="sn-tt-anim self-center mb-2 w-28 h-7 rounded-full bg-[#1c1c1c] flex items-center gap-2 px-3" style={{ animation: 'sn-tt-bubble 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both' }}>
          <span className="w-3.5 h-3.5 rounded-full bg-[#2a2a2a]" />
          <span className="flex-1 h-1.5 rounded-full bg-[#333]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
        </div>
        {/* inkomend bericht */}
        <div className="sn-tt-anim w-[72%] rounded-2xl rounded-bl-md bg-[#1e1e1e] p-4 space-y-2" style={{ animation: 'sn-tt-bubble 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.7s both' }}>
          <div className="h-2 w-4/5 rounded-full bg-[#3a3a3a]" />
          <div className="h-2 w-3/5 rounded-full bg-[#333]" />
        </div>
        {/* uitgaand groen bericht + checkmarks */}
        <div className="sn-tt-anim self-end w-[68%] rounded-2xl rounded-br-md bg-[#25D366] p-4 flex items-center gap-2 shadow-[0_8px_24px_rgba(37,211,102,0.35)]" style={{ animation: 'sn-tt-bubble 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.5s both' }}>
          <div className="h-2 flex-1 rounded-full bg-white" />
          <svg viewBox="0 0 24 12" className="w-5 h-3 shrink-0" style={{ animation: 'sn-tt-checks 3s linear 1.5s both' }} aria-hidden="true">
            <path d="M1 6l3.5 3.5L11 3M9 8l2.5 1.5L18 3" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* typing-indicator */}
        <div className="sn-tt-anim w-[46%] rounded-2xl rounded-bl-md bg-[#1e1e1e] px-4 py-3.5 flex items-center gap-2" style={{ animation: 'sn-tt-bubble 0.5s cubic-bezier(0.34,1.56,0.64,1) 2.3s both' }}>
          <div className="h-2 w-1/2 rounded-full bg-[#333]" />
          <span className="flex gap-1 ml-auto">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#25D366]" style={{ animation: `sn-tt-dot 1.1s ease-in-out ${2.6 + i * 0.18}s infinite` }} />
            ))}
          </span>
        </div>
        {/* ambient glow */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-10 rounded-full bg-[#25D366]/30 blur-2xl" style={{ animation: 'sn-tt-glow 3.2s ease-in-out infinite' }} />
      </div>
      <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />
      <h3 className={TITLE_CLASS}>Direct contact via WhatsApp</h3>
    </div>
  );
};

// ─── Tile 2: Secure dashboard ───────────────────────────────────────────
export const SecureTile: React.FC = () => {
  const { ref, runId } = useRestartOnView();
  return (
    <div ref={ref} className={TILE_CLASS}>
      <style>{`
        @keyframes sn-tt-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes sn-tt-draw { 0% { stroke-dashoffset: 260; } 100% { stroke-dashoffset: 0; } }
        @keyframes sn-tt-dotpop { 0%, 70% { opacity: 0; } 80%, 100% { opacity: 1; } }
        @keyframes sn-tt-status { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes sn-tt-pool { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        @media (prefers-reduced-motion: reduce) { .sn-tt-anim2 { animation: none !important; stroke-dashoffset: 0 !important; opacity: 1 !important; } }
      `}</style>
      <div key={runId} className="absolute inset-0 flex items-center justify-center">
        <div className="sn-tt-anim2 relative w-[72%] aspect-square rounded-xl border border-white/[0.14] bg-white/[0.05] backdrop-blur-sm p-4" style={{ animation: 'sn-tt-float 5s ease-in-out infinite' }}>
          {/* window-header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" style={{ animation: 'sn-tt-status 2.4s ease-in-out infinite' }} />
            <span className="h-1.5 w-1/3 rounded-full bg-white/25" />
          </div>
          <div className="h-1.5 w-1/4 rounded-full bg-white/15 mb-3" />
          {/* chart */}
          <svg viewBox="0 0 100 60" className="w-full h-[52%]" aria-hidden="true">
            {[12, 24, 36, 48].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />
            ))}
            <path
              className="sn-tt-anim2"
              d="M2 54 L14 48 L26 50 L38 40 L50 42 L62 30 L74 24 L86 14 L98 6"
              fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="260" strokeDashoffset="260"
              style={{ animation: 'sn-tt-draw 2.6s cubic-bezier(0.4,0,0.2,1) 0.5s forwards', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.6))' }}
            />
            <circle className="sn-tt-anim2" cx="98" cy="6" r="2" fill="#fff" style={{ animation: 'sn-tt-dotpop 3.2s linear 0.5s both', filter: 'drop-shadow(0 0 4px #fff)' }} />
          </svg>
          {/* onderste UI-balkjes */}
          <div className="mt-3 space-y-2">
            <div className="flex gap-2"><span className="h-1.5 w-2/5 rounded-full bg-white/20" /><span className="h-1.5 w-1/6 rounded-full bg-white/12" /><span className="h-1.5 w-1/4 rounded-full bg-white/20" /></div>
            <div className="flex gap-2"><span className="h-1.5 w-1/4 rounded-full bg-white/12" /><span className="h-1.5 w-1/6 rounded-full bg-white/20" /></div>
          </div>
        </div>
        {/* lichtpoel onder het venster */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/5 h-14 rounded-[100%] bg-white/25 blur-3xl" style={{ animation: 'sn-tt-pool 4.5s ease-in-out infinite' }} />
      </div>
      <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />
      <h3 className={TITLE_CLASS}>Veilig gebouwd &amp; geback-upt</h3>
    </div>
  );
};

// ─── Tile 3: Groei-ring + count-up ──────────────────────────────────────
const RING_LEN = 2 * Math.PI * 42; // r=42 in 100-viewBox

export const GrowthTile: React.FC = () => {
  const { ref, runId } = useRestartOnView();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (runId === 0) return;
    setValue(0);
    const t0 = performance.now();
    const DUR = 2200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(312 * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runId]);
  return (
    <div ref={ref} className={TILE_CLASS}>
      <style>{`
        @keyframes sn-tt-ring { 0% { stroke-dashoffset: ${RING_LEN}; } 100% { stroke-dashoffset: ${RING_LEN * 0.14}; } }
        @keyframes sn-tt-ringglow { 0%, 100% { filter: drop-shadow(0 0 6px rgba(37,211,102,0.5)); } 50% { filter: drop-shadow(0 0 14px rgba(37,211,102,0.9)); } }
        @keyframes sn-tt-toggle { 0%, 100% { box-shadow: 0 0 6px rgba(37,211,102,0.4); } 50% { box-shadow: 0 0 14px rgba(37,211,102,0.9); } }
        @media (prefers-reduced-motion: reduce) { .sn-tt-anim3 { animation: none !important; stroke-dashoffset: ${RING_LEN * 0.14} !important; } }
      `}</style>
      <div key={runId} className="absolute inset-0 flex flex-col items-center justify-center">
        {/* toggle rechtsboven */}
        <div className="absolute top-[30%] right-7 w-14 h-7 rounded-full bg-[#1c1c1c] flex items-center px-1 justify-end">
          <span className="w-5 h-5 rounded-full bg-[#25D366]" style={{ animation: 'sn-tt-toggle 2.6s ease-in-out infinite' }} />
        </div>
        <div className="relative w-[68%] aspect-square">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="7" />
            <circle
              className="sn-tt-anim3"
              cx="50" cy="50" r="42" fill="none" stroke="#25D366" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={RING_LEN} strokeDashoffset={RING_LEN}
              style={{ animation: `sn-tt-ring 2.2s cubic-bezier(0.4,0,0.2,1) 0.3s forwards, sn-tt-ringglow 3s ease-in-out 2.5s infinite` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white font-black text-4xl md:text-5xl tracking-tight tabular-nums">+{value}%</span>
            <span className="text-white/40 text-[10px] md:text-xs mt-1">groei dit kwartaal</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />
      <h3 className={TITLE_CLASS}>Meetbare groei</h3>
    </div>
  );
};
