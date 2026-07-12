import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * TrustSection — Revolut-stijl: rustige centrale kop + trust-copy,
 * daaronder drie statische afgeronde tiles naast elkaar (middelste iets
 * hoger), elk met een titel bovenin en een visual die onderin uitloopt.
 */

interface Tile {
  img: string;
  title: string;
  offset?: boolean;
}

const tiles: Tile[] = [
  {
    img: 'images/trust-service.webp',
    title: 'We zijn er om je te helpen, elke dag',
  },
  {
    img: 'images/trust-secure.webp',
    title: 'Veilig gebouwd: moderne code, SSL en dagelijkse back-ups',
    offset: true,
  },
  {
    img: 'images/trust-growth.webp',
    title: 'Meetbare groei, transparant gerapporteerd',
  },
];

const TrustSection: React.FC = () => {
  return (
    <section id="vertrouwen" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">

        {/* Kop + trust-copy */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
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
            op eigen infrastructuur, AVG-proof en dagelijks geback-upt, met één vast
            aanspreekpunt dat altijd weet hoe jouw systeem in elkaar zit.
          </p>
        </div>

        {/* Revolut-stijl tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto md:items-start">
          {tiles.map((tile) => (
            <div
              key={tile.img}
              className={`relative rounded-[28px] overflow-hidden border border-white/[0.06] bg-[#0a0a0a] aspect-[0.72] group transition-all duration-500 hover:border-white/[0.14] ${tile.offset ? 'md:-mt-8' : 'md:mt-8'}`}
            >
              {/* Visual vult de hele tile, Revolut-stijl */}
              <img
                src={`${import.meta.env.BASE_URL}${tile.img}`}
                alt={tile.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Leesbaarheids-gradient bovenin */}
              <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />
              {/* Titel eroverheen, Revolut-stijl */}
              <h3 className="relative z-10 p-6 md:p-7 text-white font-bold tracking-tight leading-snug text-lg md:text-xl max-w-[22ch]">
                {tile.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
