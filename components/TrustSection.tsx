import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TrustSection — geïnspireerd op Revolut's "Jouw geld, altijd veilig":
 * rustige centrale kop + trust-copy, daaronder een center-focus carrousel
 * met drie kaarten. Middelste kaart vol, zijkaarten geschaald en gedimd.
 * Auto-rotatie elke 5s, pijlen + klik op zijkaart om te wisselen.
 */

interface TrustCard {
  img: string;
  alt: string;
  caption: string;
}

const cards: TrustCard[] = [
  {
    img: 'images/milo-trust-dev.webp',
    alt: 'Veilig gebouwd met moderne code',
    caption: 'Veilig gebouwd: moderne code, SSL en dagelijkse back-ups',
  },
  {
    img: 'images/milo-trust-hub.webp',
    alt: 'Alles in één systeem, data in eigen beheer',
    caption: 'Alles in één systeem — jouw data blijft jouw eigendom',
  },
  {
    img: 'images/milo-trust-crm.webp',
    alt: 'Persoonlijke service en meetbare resultaten',
    caption: 'Persoonlijke service met meetbare, transparante resultaten',
  },
];

const AUTO_MS = 5000;

const TrustSection: React.FC = () => {
  const [active, setActive] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setActive((a) => (a + 1) % cards.length), []);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const goTo = (i: number) => {
    setActive(i);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = setInterval(next, AUTO_MS); }
  };

  return (
    <section id="vertrouwen" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">

        {/* Kop + trust-copy */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <ShieldCheck size={13} className="text-[#25D366]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Veilig & Betrouwbaar
            </span>
          </div>
          <h2 className="font-black uppercase tracking-tighter text-white leading-none text-4xl md:text-6xl mb-5">
            JOUW GROEI, <span className="text-[#25D366]">ALTIJD VEILIG</span>
          </h2>
          <p className="text-neutral-400">
            Gecertificeerd Google- en Meta-partner. Jouw website, data en campagnes staan
            op eigen infrastructuur, AVG-proof en dagelijks geback-upt — met één vast
            aanspreekpunt dat altijd weet hoe jouw systeem in elkaar zit.
          </p>
        </div>

        {/* Center-focus carrousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-[420px] md:h-[520px] flex items-center justify-center">
            {cards.map((card, i) => {
              const offset = ((i - active) + cards.length + 1) % cards.length - 1; // -1 | 0 | 1
              const isCenter = offset === 0;
              return (
                <button
                  key={card.img}
                  onClick={() => !isCenter && goTo(i)}
                  aria-label={card.alt}
                  className="absolute top-1/2 left-1/2 rounded-3xl overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0.35,1)] cursor-pointer"
                  style={{
                    width: 'min(72vw, 340px)',
                    aspectRatio: '0.78',
                    transform: `translate(-50%, -50%) translateX(${offset * 62}%) scale(${isCenter ? 1 : 0.82})`,
                    zIndex: isCenter ? 20 : 10,
                    opacity: isCenter ? 1 : 0.35,
                    borderColor: isCenter ? 'rgba(37,211,102,0.25)' : 'rgba(255,255,255,0.08)',
                    background: 'linear-gradient(180deg, #101010 0%, #060606 100%)',
                    boxShadow: isCenter ? '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(37,211,102,0.07)' : 'none',
                    pointerEvents: isCenter ? 'none' : 'auto',
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${card.img}`}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-x-0 top-0 w-full h-[78%] object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
                  <p className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-left text-white font-black uppercase tracking-tight leading-snug text-sm md:text-base">
                    {card.caption}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Pijlen */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => goTo((active - 1 + cards.length) % cards.length)} aria-label="Vorige"
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-[#25D366]/50 transition-all">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {cards.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Kaart ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-[#25D366]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />
              ))}
            </div>
            <button onClick={() => goTo((active + 1) % cards.length)} aria-label="Volgende"
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-[#25D366]/50 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
