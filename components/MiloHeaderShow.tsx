import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import GenerateButton from './GenerateButton';

/**
 * MiloHeaderShow — de interactieve header-intro (volgt de HEADER VOORBEELDEN):
 * 1. Grote Genereer-knop gecentreerd, slapende Milo-loop daaronder.
 * 2. Klik → 6s master-video en de headline bouwt woord-voor-woord mee op de
 *    fase-beats — als exacte kloon van de hero-h1, pixel-precies op dezelfde
 *    plek, zodat de tekst aan het einde gewoon kan BLIJVEN STAAN.
 * 3. Milo (video) verdwijnt eerst, daarna cascadet de rest van de hero in
 *    terwijl de headline stil blijft staan; als laatste de launcher-Milo.
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
    window.dispatchEvent(new Event('milo-show-done'));
  }, []);
  return { phase, setPhase, finish };
};

// Woord-beats gekoppeld aan de video-fases (RUN9), verdeeld over de h1-regels
const LINES: { words: { text: string; t: number; accent: string }[]; green?: boolean }[] = [
  { words: [{ text: 'JE WEBSITE,', t: 0.95, accent: '#FFFFFF' }, { text: 'CRM,', t: 1.85, accent: '#F7E644' }] },
  { words: [{ text: 'CONTENT', t: 2.85, accent: '#00A3E0' }, { text: '& ADS', t: 3.85, accent: '#F62961' }] },
  { words: [{ text: 'IN ÉÉN AI CHAT.', t: 4.85, accent: '#25D366' }], green: true },
];
const ALL_TIMES = LINES.flatMap((l) => l.words.map((w) => w.t)).sort((a, b) => a - b);

const LINE_CLASS = 'block text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5.5rem]';

interface MiloHeaderShowProps {
  phase: Phase;
  onStart: () => void;
  onFinish: () => void;
}

const MiloHeaderShow: React.FC<MiloHeaderShowProps> = ({ phase, onStart, onFinish }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [miloGone, setMiloGone] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [headlineRect, setHeadlineRect] = useState<{ top: number; left: number; width: number } | null>(null);

  // Meet de positie van de echte hero-h1 (ligt onder de overlay, met layout)
  const measure = useCallback(() => {
    const root = rootRef.current;
    const target = document.getElementById('hero-headline');
    if (!root || !target) return;
    const rr = root.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    setHeadlineRect({ top: tr.top - rr.top, left: tr.left - rr.left, width: tr.width });
  }, []);

  useLayoutEffect(() => {
    if (phase === 'done') return;
    measure();
    window.addEventListener('resize', measure);
    // Hermeten zodra fonts/layout binnen zijn
    const t = setTimeout(measure, 600);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, [phase, measure]);

  // Einde: eerst Milo (video) weg, headline blijft staan, dan de hero-cascade
  const handleEnded = useCallback(() => {
    setMiloGone(true);
    setTimeout(() => {
      onFinish();          // hero cascadet in; h1 staat identiek onder de overlay-headline
      setLeaving(true);    // overlay (incl. kloon-headline) fadet weg over de echte h1 heen
      setTimeout(() => setLeaving(false), 800); // daarna volledig unmounten
    }, 450);
  }, [onFinish]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => handleEnded());
  }, [phase, handleEnded]);

  if (phase === 'done' && !leaving) return null;

  const latestTime = ALL_TIMES.filter((t) => videoTime >= t).pop();

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      onTransitionEnd={() => { /* overlay is weg zodra opacity-transitie klaar is */ }}
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

      {/* Headline — exacte kloon van de hero-h1, op de gemeten h1-positie */}
      {headlineRect && (
        <div
          className={`absolute transition-opacity duration-300 ${phase === 'playing' ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: headlineRect.top, left: headlineRect.left, width: headlineRect.width }}
        >
          <h1 className="sn-vhs font-black uppercase tracking-tighter text-white leading-[0.9] text-center" aria-hidden="true">
            {LINES.map((line) => (
              <div key={line.words[0].text} className={`${LINE_CLASS} ${line.green ? 'text-[#25D366]' : ''}`}>
                {line.words.map((w, wi) => {
                  const shown = videoTime >= w.t;
                  const isLatest = w.t === latestTime;
                  const color = line.green ? undefined : (shown && isLatest ? w.accent : '#FFFFFF');
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
                      {wi < line.words.length - 1 ? ' ' : null}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </h1>
        </div>
      )}

      {/* GROTE Genereer-knop — gecentreerd boven Milo, zoals voorbeeld stap 1 */}
      <div className={`relative z-10 my-6 md:my-8 scale-125 md:scale-150 origin-center transition-all duration-300 ${phase === 'playing' ? 'opacity-0 scale-100 pointer-events-none' : 'opacity-100'}`}>
        <GenerateButton onClick={onStart} />
      </div>

      {/* Milo — slaap-loop of de master-video, onderin; verdwijnt vóór de hero-cascade */}
      <div className={`relative w-full max-w-[1100px] px-4 flex-shrink min-h-0 transition-opacity duration-400 ${miloGone ? 'opacity-0' : 'opacity-100'}`}>
        <video
          autoPlay muted loop playsInline preload="auto" aria-hidden="true"
          poster={`${import.meta.env.BASE_URL}images/milo-header-poster.webp`}
          className={`w-full h-auto max-h-[46svh] object-contain object-bottom transition-opacity duration-300 ${phase === 'playing' ? 'opacity-0' : 'opacity-100'}`}
        >
          <source src={`${import.meta.env.BASE_URL}video/milo-sleep-loop.webm?v=1`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}video/milo-sleep-loop.mp4?v=1`} type="video/mp4" />
        </video>
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
