import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

/**
 * AanbodUitleg — twee uitklapbare presentaties vlak onder de kop.
 *
 * De eerste legt uit hoe het OS met Odoo werkt, de tweede laat aan de hand van
 * kWh Garant zien hoe zo'n traject loopt. Ze staan dicht, zodat de pagina rustig
 * blijft, en schuiven open als je erop klikt. De video wordt pas opgehaald als
 * hij opengaat, dus dicht kost het niets.
 */

const BASE = import.meta.env.BASE_URL;

type Uitleg = {
  id: string;
  kop: string;
  onder: string;
  bestand: string;
  staand?: boolean;      // de klantcase is een staande video
  data: string;          // wat er in beeld echt is en wat voorbeeld
  logo?: string;         // het merk waar dit blok over gaat
  logoHoogte?: number;
  merk: string;          // valt terug op de naam als er geen logobestand is
};

const UITLEG: Uitleg[] = [
  {
    id: 'odoo',
    kop: 'Voor Odoo gebruikers',
    onder: 'Hoe het OS op je Odoo aansluit, in tweeëneenhalve minuut',
    bestand: 'os-odoo',
    merk: 'Odoo',
    logo: `${BASE}images/klantlogos/odoo.svg`,
    logoHoogte: 22,
    data: 'Voorbeeldweergave van het systeem, met verzonnen gegevens.',
  },
  {
    id: 'kwh',
    kop: 'Klantverhaal: kWh Garant',
    onder: 'Hetzelfde verhaal, maar dan hoe het bij een echte klant loopt',
    bestand: 'os-kwh-case',
    merk: 'kWh Garant',
    logo: `${BASE}images/klantlogos/kwh-garant.svg`,
    logoHoogte: 24,
    staand: true,
    data: 'Advertentieresultaten zijn echt. Overige gegevens zijn voorbeeld, ter bescherming van de klant.',
  },
];

const klok = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r < 10 ? '0' : ''}${r}`;
};

const Speler: React.FC<{ u: Uitleg }> = ({ u }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const baanRef = useRef<HTMLDivElement>(null);
  const [speelt, setSpeelt] = useState(false);
  const [stil, setStil] = useState(false);
  const [tijd, setTijd] = useState(0);
  const [duur, setDuur] = useState(0);
  const [sleept, setSleept] = useState(false);
  const deel = duur > 0 ? Math.min(tijd / duur, 1) : 0;

  const spelenOfPauze = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => { v.muted = true; setStil(true); v.play().catch(() => { /* geeft niet */ }); });
    else v.pause();
  }, []);

  const vanafBegin = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setTijd(0);
    v.play().catch(() => { /* geeft niet */ });
  }, []);

  const geluid = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setStil(v.muted);
  }, []);

  const naarPunt = useCallback((klientX: number) => {
    const baan = baanRef.current;
    const v = videoRef.current;
    if (!baan || !v || !v.duration) return;
    const r = baan.getBoundingClientRect();
    const f = Math.min(Math.max((klientX - r.left) / r.width, 0), 1);
    v.currentTime = f * v.duration;
    setTijd(v.currentTime);
  }, []);

  useEffect(() => {
    if (!sleept) return;
    const beweeg = (e: PointerEvent) => naarPunt(e.clientX);
    const los = () => setSleept(false);
    window.addEventListener('pointermove', beweeg);
    window.addEventListener('pointerup', los);
    return () => {
      window.removeEventListener('pointermove', beweeg);
      window.removeEventListener('pointerup', los);
    };
  }, [sleept, naarPunt]);

  const knop = 'w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.12] flex items-center justify-center transition-colors';

  return (
    <div className={`relative mx-auto w-full ${u.staand ? 'max-w-[280px]' : 'max-w-full'}`}>
      <div
        className="relative overflow-hidden rounded-2xl bg-black border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
        style={{ aspectRatio: u.staand ? '9 / 16' : '16 / 9' }}
      >
        <video
          ref={videoRef}
          src={`${BASE}video/os/${u.bestand}.mp4?v=1`}
          poster={`${BASE}video/os/${u.bestand}.webp?v=1`}
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => setDuur(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => { if (!sleept) setTijd(e.currentTarget.currentTime); }}
          onPlay={() => setSpeelt(true)}
          onPause={() => setSpeelt(false)}
          onClick={spelenOfPauze}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />

        {!speelt && (
          <button
            onClick={spelenOfPauze}
            aria-label={`${u.kop} afspelen`}
            className="absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity"
          >
            <span className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_10px_36px_rgba(37,211,102,0.45)]">
              <Play size={22} className="text-white ml-1" fill="white" />
            </span>
          </button>
        )}

        <div className="absolute left-0 right-0 bottom-0 px-3 pb-3 pt-9 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
          <div
            ref={baanRef}
            onPointerDown={(e) => { e.preventDefault(); setSleept(true); naarPunt(e.clientX); }}
            role="slider"
            tabIndex={0}
            aria-label="Positie in de video"
            aria-valuemin={0}
            aria-valuemax={Math.round(duur)}
            aria-valuenow={Math.round(tijd)}
            className="group relative h-4 flex items-center cursor-pointer select-none"
          >
            <span className="absolute left-0 right-0 h-[3px] rounded-full bg-white/20" />
            <span className="absolute left-0 h-[3px] rounded-full bg-[#25D366]" style={{ width: `${(deel * 100).toFixed(2)}%` }} />
            <span className="absolute w-3 h-3 rounded-full bg-white shadow" style={{ left: `calc(${(deel * 100).toFixed(2)}% - 6px)` }} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button onClick={spelenOfPauze} className={knop} aria-label={speelt ? 'Pauze' : 'Afspelen'}>
              {speelt ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
            </button>
            <button onClick={vanafBegin} className={knop} aria-label="Opnieuw vanaf het begin">
              <RotateCcw size={15} />
            </button>
            <button onClick={geluid} className={knop} aria-label={stil ? 'Geluid aan' : 'Geluid uit'}>
              {stil ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <span className="ml-1 text-white/55 text-[11px] font-bold tabular-nums">
              {klok(tijd)} <span className="text-white/25">/ {klok(duur)}</span>
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-white/25 text-[11px] font-medium mt-3">{u.data}</p>
    </div>
  );
};

const Blok: React.FC<{ u: Uitleg }> = ({ u }) => {
  const [open, setOpen] = useState(false);
  // Is er geen logobestand, dan valt hij terug op de merknaam als woordmerk.
  const [geenLogo, setGeenLogo] = useState(false);
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] overflow-hidden transition-colors duration-300 hover:border-white/[0.16]">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 md:px-5 py-4 md:py-5 text-left"
      >
        <span className="min-w-0 flex-1">
          {/* het merk waar dit blok over gaat */}
          <span className="flex items-center h-6 mb-2.5">
            {u.logo && !geenLogo ? (
              <img
                src={u.logo}
                alt={u.merk}
                loading="lazy"
                decoding="async"
                style={{ height: u.logoHoogte ?? 22 }}
                className="w-auto max-w-[60%] object-contain opacity-90"
                onError={() => setGeenLogo(true)}
              />
            ) : (
              <span className="text-white/70 font-black uppercase tracking-[0.24em] text-[11px]">{u.merk}</span>
            )}
          </span>
          <span className="block text-white font-black uppercase tracking-tight text-sm md:text-base leading-none">
            {u.kop}
          </span>
          <span className="block text-white/40 text-[11px] md:text-xs font-medium mt-1.5">{u.onder}</span>
        </span>
        <span
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            open ? 'bg-[#25D366] text-white rotate-180' : 'bg-white/[0.06] border border-white/12 text-white/70'
          }`}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      {/* Pas hier hangt de video in de pagina, dus dicht kost hij niets */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 md:px-6 pb-5 md:pb-6 pt-1">
            {open && <Speler u={u} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const AanbodUitleg: React.FC = () => (
  <section className="relative pt-2 pb-10 md:pt-4 md:pb-16">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-start">
        {UITLEG.map((u) => (
          <Blok key={u.id} u={u} />
        ))}
      </div>
    </div>
  </section>
);

export default AanbodUitleg;
