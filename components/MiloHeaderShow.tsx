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

// Woord-beats gekoppeld aan de fases van HEADER FINALDEF (8s → getrimd 7.3s):
//   ~1.8s CRM/laptop-stap · ~3.4s content/schilder-stap · ~4.6s ads/megafoon-stap
//   ~5.6s hub-finale (groene circuit-chat = "in één AI chat").
// Elk gekleurd woord licht op precies wanneer zijn stap in beeld is.
const LINES: { words: { text: string; t: number; accent: string }[]; green?: boolean }[] = [
  { words: [{ text: 'JE WEBSITE,', t: 1.8, accent: '#FFFFFF' }, { text: 'CRM,', t: 2.4, accent: '#F7E644' }] },
  { words: [{ text: 'CONTENT', t: 3.4, accent: '#00A3E0' }, { text: '& ADS', t: 4.6, accent: '#F62961' }] },
  { words: [{ text: 'IN ÉÉN AI CHAT.', t: 5.6, accent: '#25D366' }], green: true },
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
  // Slaap-loop blijft in beeld tot de master-video ÉCHT frames rendert (naadloze wissel op frame 1)
  const [videoStarted, setVideoStarted] = useState(false);
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
    // rAF in plaats van timeupdate (~4Hz): frame-precieze, soepele woord-reveals
    let raf = 0;
    const tick = () => {
      setVideoTime(v.currentTime);
      if (v.currentTime > 0.04) setVideoStarted(true); // eerste échte frame is er → wissel
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, handleEnded]);

  if (phase === 'done' && !leaving) return null;

  const latestTime = ALL_TIMES.filter((t) => videoTime >= t).pop();

  return (
    <div
      ref={rootRef}
      className={`absolute inset-x-0 top-0 h-[100svh] z-[60] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      onTransitionEnd={() => { /* overlay is weg zodra opacity-transitie klaar is */ }}
    >
      {/* Headline — exacte kloon van de hero-h1, op de gemeten h1-positie */}
      {headlineRect && (
        <div
          className={`absolute transition-opacity duration-300 ${phase === 'playing' ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: headlineRect.top, left: headlineRect.left, width: headlineRect.width }}
        >
          <h1 className="sn-vhs font-black uppercase tracking-tighter text-white leading-[1.08] text-center" aria-hidden="true">
            {LINES.map((line) => (
              <div key={line.words[0].text} className={`${LINE_CLASS} ${line.green ? 'text-[#25D366]' : ''}`}>
                {line.words.map((w, wi) => {
                  const shown = videoTime >= w.t;
                  const isLatest = w.t === latestTime;
                  const color = line.green ? undefined : (shown && isLatest ? w.accent : '#FFFFFF');
                  return (
                    <React.Fragment key={w.text}>
                      <span
                        className="inline-block will-change-transform"
                        style={{
                          color,
                          opacity: shown ? 1 : 0,
                          transform: shown ? 'translateY(0)' : 'translateY(0.35em)',
                          transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1), color 0.4s ease',
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

      {/* Milo — slaap-loop of de master-video, vast onderin het beeld verankerd */}
      <div className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1100px] px-4 transition-opacity duration-400 ${miloGone ? 'opacity-0' : 'opacity-100'}`}>
        <video
          autoPlay muted loop playsInline preload="auto" aria-hidden="true"
          poster={`${import.meta.env.BASE_URL}images/milo-header-poster.webp`}
          className={`w-full h-auto max-h-[46svh] object-contain object-bottom ${videoStarted ? 'opacity-0' : 'opacity-100'}`}
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
          onTimeUpdate={(e) => { const v = e.target as HTMLVideoElement; setVideoTime(v.currentTime); if (v.currentTime > 0.04) setVideoStarted(true); }}
          className={`absolute inset-x-4 bottom-0 w-[calc(100%-2rem)] h-full max-h-[46svh] object-contain object-bottom ${videoStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <source src={`${import.meta.env.BASE_URL}video/milo-header-6s.webm?v=3`} type="video/webm" />
          <source src={`${import.meta.env.BASE_URL}video/milo-header-6s.mp4?v=3`} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default MiloHeaderShow;
