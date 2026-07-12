import React, { useCallback, useEffect, useRef, useState } from 'react';
import GenerateButton from './GenerateButton';

/**
 * MiloHeaderShow — de interactieve header-intro (volgt de HEADER VOORBEELDEN):
 * 1. Grote Genereer-knop gecentreerd, slapende Milo daaronder.
 * 2. Klik → 6s master-video (met geluid) en de headline bouwt woord-voor-woord
 *    mee op de fase-beats: JE WEBSITE → , CRM, (geel) → CONTENT (blauw) →
 *    & ADS (roze) → IN ÉÉN AI CHAT. (blijft groen).
 * 3. Daarna fadet de overlay weg en animeert de bestaande hero in.
 * 1× per sessie; reduced-motion of video-fout → direct hero.
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

// Woord-beats gekoppeld aan de video-fases (RUN9-timeline)
const WORDS = [
  { text: 'JE WEBSITE,', t: 0.95, accent: '#FFFFFF', br: false },
  { text: 'CRM,', t: 1.85, accent: '#F7E644', br: true },
  { text: 'CONTENT', t: 2.85, accent: '#00A3E0', br: false },
  { text: '& ADS', t: 3.85, accent: '#F62961', br: true },
  { text: 'IN ÉÉN AI CHAT.', t: 4.85, accent: '#25D366', br: false, keep: true },
];

interface MiloHeaderShowProps {
  phase: Phase;
  onStart: () => void;
  onFinish: () => void;
}

const MiloHeaderShow: React.FC<MiloHeaderShowProps> = ({ phase, onStart, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [videoTime, setVideoTime] = useState(0);

  const handleEnded = useCallback(() => {
    setLeaving(true);
    setTimeout(onFinish, 500);
  }, [onFinish]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => handleEnded());
  }, [phase, handleEnded]);

  if (phase === 'done') return null;

  const revealed = WORDS.filter((w) => videoTime >= w.t);
  const latestIdx = revealed.length - 1;

  return (
    <div
      className={`absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* LIVE-badge — blijft zichtbaar zoals in de voorbeelden */}
      <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0e0e12] border border-white/10">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute h-full w-full rounded-full bg-[#25D366] opacity-75" aria-hidden="true"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">LIVE · SINDS 2021</span>
        </div>
      </div>

      {/* Headline die woord-voor-woord meebouwt op de video-beats */}
      <div className={`px-6 text-center transition-opacity duration-300 ${phase === 'playing' ? 'opacity-100' : 'opacity-0'} min-h-[8rem] md:min-h-[13rem] flex items-end justify-center pb-2 md:pb-4`}>
        <h1 className="sn-vhs font-black uppercase tracking-tighter leading-[0.95] text-4xl md:text-7xl">
          {WORDS.map((w, i) => {
            const shown = videoTime >= w.t;
            const isLatest = i === latestIdx;
            const color = !shown ? 'transparent' : (w.keep || isLatest) ? w.accent : '#FFFFFF';
            return (
              <React.Fragment key={w.text}>
                <span
                  className="inline-block transition-all duration-300"
                  style={{
                    color,
                    opacity: shown ? 1 : 0,
                    transform: shown ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.96)',
                  }}
                >
                  {w.text}
                </span>
                {w.br ? <br /> : ' '}
              </React.Fragment>
            );
          })}
        </h1>
      </div>

      {/* GROTE Genereer-knop — gecentreerd boven Milo, zoals voorbeeld stap 1 */}
      <div className={`relative z-10 my-6 md:my-8 scale-125 md:scale-150 origin-center transition-all duration-300 ${phase === 'playing' ? 'opacity-0 scale-100 pointer-events-none' : 'opacity-100'}`}>
        <GenerateButton onClick={onStart} />
      </div>

      {/* Milo — poster (slaap) of de master-video, onderin het beeld */}
      <div className="relative w-full max-w-[1100px] px-4 flex-shrink min-h-0">
        <img
          src={`${import.meta.env.BASE_URL}images/milo-header-poster.webp`}
          alt="Milo, de SocialNow AI-assistent, slaapt"
          className={`w-full h-auto max-h-[46svh] object-contain object-bottom transition-opacity duration-300 ${phase === 'playing' ? 'opacity-0' : 'opacity-100'}`}
          decoding="async"
        />
        <video
          ref={videoRef}
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onError={handleEnded}
          onTimeUpdate={(e) => setVideoTime((e.target as HTMLVideoElement).currentTime)}
          className={`absolute inset-x-4 bottom-0 w-[calc(100%-2rem)] h-full max-h-[46svh] object-contain object-bottom transition-opacity duration-300 ${phase === 'playing' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <source src={`${import.meta.env.BASE_URL}video/milo-header-6s.webm?v=1`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}video/milo-header-6s.mp4?v=1`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default MiloHeaderShow;
