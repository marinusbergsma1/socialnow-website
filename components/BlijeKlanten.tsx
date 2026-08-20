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
    logoHoogte: 30,
    persoon: 'Ellen Sluijs',
    foto: `${BASE}images/Ellen-Sluijs.webp`,
    werk: 'Website, conversie en contentsysteem',
    slug: 'kwh-garant-website',
  },
  {
    merk: 'Divine Machines',
    logo: `${BASE}images/klantlogos/divine-machines.webp`,
    logoHoogte: 22,
    persoon: 'Hussein Awqati',
    foto: `${BASE}images/Hussein.webp`,
    werk: 'Website en development',
    slug: 'divine-machines-website',
  },
  {
    merk: 'RAVEG',
    persoon: 'Niels Groen',
    foto: `${BASE}images/Niels-Groen.webp`,
    werk: 'Branding, website en content',
    slug: 'raveg-branding',
  },
  {
    merk: 'PrimeFone',
    logo: `${BASE}images/klantlogos/primefone.svg`,
    logoHoogte: 34,
    werk: 'Merk en website',
    slug: 'primefone-website',
  },
  {
    merk: 'VDZ Brigade',
    logo: `${BASE}images/klantlogos/vdz-brigade.svg`,
    logoHoogte: 30,
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
    <>
      {/* logo of, als dat er niet is, de merknaam als woordmerk */}
      <div className="h-9 flex items-center">
        {k.logo ? (
          <img
            src={k.logo}
            alt={k.merk}
            loading="lazy"
            decoding="async"
            style={{ height: k.logoHoogte ?? 28 }}
            className="w-auto max-w-[70%] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <span className="text-white/85 font-black uppercase tracking-[0.22em] text-sm">{k.merk}</span>
        )}
      </div>

      {k.quote ? (
        <p className="mt-5 text-white/80 text-[13px] md:text-sm leading-relaxed">
          <Quote size={14} className="inline-block mr-1.5 -mt-1 text-[#25D366]" />
          {k.quote}
        </p>
      ) : null}

      {/* Zonder gezicht geen leeg rondje: dan alleen de regel over het werk. */}
      {k.persoon && k.foto ? (
        <div className="mt-5 flex items-center gap-3">
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
        <p className="mt-4 text-white/40 text-[12px] font-medium">{k.werk}</p>
      )}
    </>
  );

  const stijl =
    'group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6 transition-all duration-300 hover:border-[#25D366]/40 hover:bg-white/[0.04]';

  return k.slug ? (
    <Link to={`/projecten/${k.slug}`} className={`${stijl} block`}>{binnen}</Link>
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
          Van thuisbatterijen tot hairstyling. Klik op een merk en je ziet wat we gebouwd hebben.
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
