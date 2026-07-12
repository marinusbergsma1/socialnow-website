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
    img: 'images/milo-trust-dev.webp',
    title: 'Veilig gebouwd: moderne code, SSL en dagelijkse back-ups',
  },
  {
    img: 'images/milo-trust-hub.webp',
    title: 'Alles in één systeem — jouw data blijft jouw eigendom',
    offset: true,
  },
  {
    img: 'images/milo-trust-crm.webp',
    title: 'Persoonlijke service met meetbare, transparante resultaten',
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
            op eigen infrastructuur, AVG-proof en dagelijks geback-upt — met één vast
            aanspreekpunt dat altijd weet hoe jouw systeem in elkaar zit.
          </p>
        </div>

        {/* Revolut-stijl tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto md:items-start">
          {tiles.map((tile) => (
            <div
              key={tile.img}
              className={`relative rounded-[28px] overflow-hidden border border-white/[0.07] bg-gradient-to-b from-[#111] to-[#050505] aspect-[0.72] group transition-all duration-500 hover:border-[#25D366]/25 ${tile.offset ? 'md:-mt-8' : 'md:mt-8'}`}
            >
              {/* Titel bovenin, Revolut-stijl */}
              <h3 className="relative z-10 p-6 md:p-7 text-white font-bold tracking-tight leading-snug text-lg md:text-xl">
                {tile.title}
              </h3>

              {/* Visual onderin */}
              <img
                src={`${import.meta.env.BASE_URL}${tile.img}`}
                alt={tile.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-x-0 bottom-0 w-full h-[68%] object-cover object-bottom transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {/* Zachte overloop tussen titel en visual */}
              <div className="absolute inset-x-0 top-[26%] h-[18%] bg-gradient-to-b from-[#0c0c0c] to-transparent pointer-events-none z-[5]" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
