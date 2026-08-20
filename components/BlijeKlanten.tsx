import React from 'react';
import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';

/**
 * BlijeKlanten — de mensen en merken die met het systeem werken.
 *
 * De reactie van een klant komt alleen uit hun eigen mond. Staat er nog geen
 * quote, dan toont de kaart gewoon het logo, de naam en wat we gebouwd hebben.
 * Nooit een verzonnen citaat onder een echte naam.
 */

const BASE = import.meta.env.BASE_URL;

type Klant = {
  merk: string;
  logo?: string;
  logoHoogte?: number;      // logo's verschillen sterk van vorm, dus per merk instellen
  persoon?: string;
  foto?: string;
  werk: string;             // wat we voor ze gebouwd hebben, zoals het in de projecten staat
  slug?: string;
  quote?: string;           // alleen vullen met wat de klant zelf gezegd heeft
};

const KLANTEN: Klant[] = [
  {
    merk: 'kWh Garant',
    logo: `${BASE}images/klantlogos/kwh-garant.svg`,
    logoHoogte: 20,
    persoon: 'Ellen Sluijs',
    foto: `${BASE}images/Ellen-Sluijs.webp`,
    werk: 'Website, conversie en contentsysteem',
    slug: 'kwh-garant-website',
  },
  {
    merk: 'Divine Machines',
    logo: `${BASE}images/klantlogos/divine-machines.webp`,
    logoHoogte: 14,
    persoon: 'Hussein Awqati',
    foto: `${BASE}images/Hussein.webp`,
    werk: 'Website en development',
    slug: 'divine-machines-website',
  },
  {
    merk: 'PrimeFone',
    logo: `${BASE}images/klantlogos/primefone.svg`,
    logoHoogte: 22,
    werk: 'Merk en website',
    slug: 'primefone-website',
  },
  {
    merk: 'VDZ Brigade',
    logo: `${BASE}images/klantlogos/vdz-brigade.svg`,
    logoHoogte: 20,
    werk: 'Website en huisstijl',
    slug: 'vdz-brigade-website',
  },
  {
    merk: 'Light Art Collection',
    persoon: 'Albert Deltour',
    foto: `${BASE}images/66ed2e6a48aae627d6698e31-Albert-Deltour.webp`,
    werk: 'Content en socials',
  },
];

const Kaart: React.FC<{ k: Klant }> = ({ k }) => {
  const binnen = (
    <div className="flex items-center gap-4">
      <div className="min-w-0 flex-1">
        {k.quote ? (
          <p className="mb-4 text-white/80 text-[13px] md:text-sm leading-relaxed">
            <Quote size={14} className="inline-block mr-1.5 -mt-1 text-[#25D366]" />
            {k.quote}
          </p>
        ) : null}

        {k.persoon && k.foto ? (
          <div className="flex items-center gap-3">
            <img
              src={k.foto}
              alt={k.persoon}
              loading="lazy"
              decoding="async"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-white/15 flex-shrink-0"
            />
            <span className="min-w-0 leading-tight">
              <span className="block text-white text-[13px] font-bold truncate">{k.persoon}</span>
              <span className="block text-white/40 text-[11px] font-medium truncate">
                {`${k.merk} · ${k.werk}`}
              </span>
            </span>
          </div>
        ) : (
          <span className="block leading-tight">
            <span className="block text-white text-[13px] font-bold">{k.merk}</span>
            <span className="block text-white/40 text-[11px] font-medium">{k.werk}</span>
          </span>
        )}
      </div>

      {/* Het merk staat aan de zijkant, klein en in de schaduw. De mensen zijn
          waar het om gaat, het logo hoeft alleen maar te bevestigen wie het is. */}
      <span className="flex items-center justify-end w-[84px] md:w-[96px] flex-shrink-0">
        {k.logo ? (
          <img
            src={k.logo}
            alt={k.merk}
            loading="lazy"
            decoding="async"
            style={{ height: k.logoHoogte ?? 18 }}
            className="w-auto max-w-full object-contain opacity-[0.28] group-hover:opacity-50 transition-opacity duration-300"
          />
        ) : (
          <span className="text-white/20 group-hover:text-white/35 font-black uppercase tracking-[0.16em] text-[9px] text-right leading-tight transition-colors duration-300">
            {k.merk}
          </span>
        )}
      </span>
    </div>
  );

  const stijl =
    'group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 md:px-6 md:py-5 transition-all duration-300 hover:border-[#25D366]/40 hover:bg-white/[0.04]';

  return k.slug ? (
    <Link to={`/project/${k.slug}`} className={`${stijl} block`}>{binnen}</Link>
  ) : (
    <div className={stijl}>{binnen}</div>
  );
};

const BlijeKlanten: React.FC = () => (
  <section className="relative py-14 md:py-24 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
            Klanten die ermee werken
          </span>
        </div>
        <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-none mb-3">
          ZIJ WERKEN <span className="text-[#25D366]">AL ZO</span>
        </h2>
        <p className="text-gray-500 text-xs md:text-base font-medium max-w-xl mx-auto">
          Van thuisbatterijen tot lichtkunst. Klik op een merk en je ziet wat we gebouwd hebben.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {KLANTEN.map((k) => (
          <Kaart key={k.merk} k={k} />
        ))}
      </div>
    </div>
  </section>
);

export default BlijeKlanten;
