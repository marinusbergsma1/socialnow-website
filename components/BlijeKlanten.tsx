import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';

/**
 * BlijeKlanten — de mensen en merken die met het systeem werken.
 *
 * De reactie van een klant komt alleen uit hun eigen mond. De teksten hieronder
 * staan letterlijk zo in het Google bedrijfsprofiel van SocialNow. Staat er nog
 * geen reactie, dan toont de kaart gewoon het logo, de naam en wat we gebouwd
 * hebben. Nooit een verzonnen citaat onder een echte naam.
 */

const BASE = import.meta.env.BASE_URL;

// Het profiel zelf, zodat iemand de reacties bij de bron kan nalezen.
const GOOGLE = 'https://maps.google.com/?cid=1427063718057754123';
const SCORE = '5,0';
const AANTAL = 13;

type Klant = {
  merk: string;
  logo?: string;
  logoHoogte?: number;      // logo's verschillen sterk van vorm, dus per merk instellen
  persoon?: string;
  foto?: string;
  werk: string;             // wat we voor ze gebouwd hebben, zoals het in de projecten staat
  slug?: string;
  quote?: string;           // letterlijk zoals het in de Google review staat
  wanneer?: string;         // hoe lang die reactie er al staat
};

const KLANTEN: Klant[] = [
  {
    merk: 'kWh Garant',
    logo: `${BASE}images/klantlogos/kwh-garant.svg`,
    logoHoogte: 20,
    persoon: 'Ellen Sluijs',
    foto: `${BASE}images/Ellen-Sluijs.webp`,
    werk: 'Website en conversie',
    slug: 'kwh-garant-website',
    quote: 'Wij zijn heel erg blij met Marinus. Denkt goed mee en levert op tijd. Topper!',
    wanneer: '5 maanden geleden',
  },
  {
    merk: 'VDZ Brigade',
    logo: `${BASE}images/klantlogos/vdz-brigade.svg`,
    logoHoogte: 20,
    werk: 'Website en huisstijl',
    slug: 'vdz-brigade-website',
    quote:
      'Zeer tevreden over dit bedrijf. Wat deze mannen neerzetten in zo’n korte tijd ongelofelijk. Wij gaan zomaar niet weg. Echt een aanrader. Inmiddels al zakenrelaties doorgestuurd. Ga zo door!!',
    wanneer: '6 maanden geleden',
  },
  {
    merk: 'Divine Machines',
    logo: `${BASE}images/klantlogos/divine-machines.webp`,
    logoHoogte: 14,
    persoon: 'Hussein Awqati',
    foto: `${BASE}images/Hussein.webp`,
    werk: 'Website en development',
    slug: 'divine-machines-website',
    quote:
      'Erg tevreden met de ervaring en kennis van de team van socialnow. Via via zijn wij in contact gekomen en sindsdien is socialnow de designer van Divine Machines. Ga zo door!',
    wanneer: '2 jaar geleden',
  },
  {
    merk: 'Light Art Collection',
    persoon: 'Albert Deltour',
    foto: `${BASE}images/66ed2e6a48aae627d6698e31-Albert-Deltour.webp`,
    werk: 'Content en socials',
    quote:
      'From ambitious and talented intern to a reliable partner is how I would describe Marinus.',
    wanneer: 'een jaar geleden',
  },
  {
    merk: 'PrimeFone',
    logo: `${BASE}images/klantlogos/primefone.svg`,
    logoHoogte: 22,
    werk: 'Merk en website',
    slug: 'primefone-website',
  },
];

const Sterren: React.FC = () => (
  <span className="flex items-center gap-[3px]" aria-label="Vijf sterren">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} size={11} className="text-[#FBBC04]" fill="#FBBC04" strokeWidth={0} />
    ))}
  </span>
);

const Kaart: React.FC<{ k: Klant }> = ({ k }) => {
  const binnen = (
    <div className="flex h-full flex-col">
      {k.quote ? (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Sterren />
            <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.18em]">
              Google
            </span>
            {k.wanneer ? (
              <span className="text-white/20 text-[10px] font-medium">{k.wanneer}</span>
            ) : null}
          </div>
          <p className="text-white/80 text-[13px] md:text-sm leading-relaxed">
            <Quote size={13} className="inline-block mr-1.5 -mt-1 text-[#25D366]" />
            {k.quote}
          </p>
        </div>
      ) : null}

      <div className="mt-auto flex items-center gap-4">
        <div className="min-w-0 flex-1">
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
    </div>
  );

  // Met reactie loopt de kaart mee met de rij, zonder reactie blijft hij kort.
  const stijl =
    `group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 md:px-6 md:py-5 transition-all duration-300 hover:border-[#25D366]/40 hover:bg-white/[0.04] ${k.quote ? 'h-full' : 'self-start'}`;

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
        <p className="text-gray-500 text-xs md:text-base font-medium max-w-xl mx-auto mb-5">
          Van thuisbatterijen tot lichtkunst. Klik op een merk en je ziet wat we gebouwd hebben.
        </p>

        {/* De reacties op de kaarten staan letterlijk in ons Google profiel. */}
        <a
          href={GOOGLE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.1] bg-white/[0.03] hover:border-[#25D366]/40 hover:bg-white/[0.06] transition-colors duration-300"
        >
          <Sterren />
          <span className="text-white text-[12px] font-bold">{SCORE}</span>
          <span className="text-white/40 text-[11px] font-medium">
            {`uit ${AANTAL} reviews op Google`}
          </span>
        </a>
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
