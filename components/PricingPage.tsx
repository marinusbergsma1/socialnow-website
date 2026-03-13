import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Sparkles, MessageCircle, Globe, Instagram, Camera, Palette } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import Button from './Button';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  color: string;
  popular?: boolean;
  features: string[];
  cta: string;
}

interface PricingCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
  tiers: PricingTier[];
}

const categories: PricingCategory[] = [
  {
    id: 'webdesign',
    label: 'Webdesign',
    icon: <Globe size={16} />,
    color: '#00A3E0',
    subtitle: 'Van one-pager tot volledige web apps — gebouwd met AI voor maximale snelheid en kwaliteit.',
    tiers: [
      {
        name: 'One-Pager',
        price: '€1.500,-',
        period: 'eenmalig',
        description: 'Perfect voor startups en ondernemers die snel online willen met een professionele website.',
        color: '#00A3E0',
        features: [
          'Responsive one-page website',
          'AI-gestuurde development',
          'SEO-geoptimaliseerd',
          'Contact formulier',
          'Live binnen 2 weken',
          'Google Analytics setup',
        ],
        cta: 'Start je project',
      },
      {
        name: 'Business Website',
        price: '€2.500,-',
        period: 'eenmalig',
        description: 'Voor groeiende bedrijven die een volwaardig online platform nodig hebben.',
        color: '#25D366',
        popular: true,
        features: [
          'Multi-page website (5-10 pagina\'s)',
          'AI-gestuurde development',
          'Custom UX/UI design',
          'CMS integratie (zelf content beheren)',
          'Animaties & micro-interacties',
          'Performance optimalisatie (90+ score)',
          'SEO & analytics setup',
          'Hosting & SSL inbegrepen',
          'WhatsApp integratie',
          'Live binnen 3-4 weken',
        ],
        cta: 'Meest gekozen',
      },
      {
        name: 'Custom Project',
        price: 'Op maat',
        period: 'offerte',
        description: 'Complexe projecten, web apps, e-commerce platforms en volledige digitale ecosystemen.',
        color: '#F7E644',
        features: [
          'Alles uit Business Website',
          'Web applicatie / SaaS',
          'E-commerce integratie',
          'AI automation workflows',
          'API koppelingen',
          'Branding & visual identity',
          'Doorlopende ondersteuning',
          'Dedicated project team',
        ],
        cta: 'Vraag offerte aan',
      },
    ],
  },
  {
    id: 'social-media',
    label: 'Social Media',
    icon: <Instagram size={16} />,
    color: '#F62961',
    subtitle: 'Consistent content, strategie en groei voor jouw socials — volledig uit handen.',
    tiers: [
      {
        name: 'Starter',
        price: 'Vanaf €750',
        period: 'per maand',
        description: 'Ideaal om te starten met een consistente social media aanwezigheid.',
        color: '#00A3E0',
        features: [
          '8 posts per maand',
          'Content kalender',
          '1 platform (Instagram of TikTok)',
          'Basis design templates',
          'Maandelijkse rapportage',
          'Hashtag strategie',
        ],
        cta: 'Start met social',
      },
      {
        name: 'Groei',
        price: 'Vanaf €1.500',
        period: 'per maand',
        description: 'Voor merken die serieus willen groeien op social media met premium content.',
        color: '#25D366',
        popular: true,
        features: [
          '16 posts per maand',
          '2 platforms naar keuze',
          'Reels & Stories strategie',
          'Community management',
          'Influencer outreach',
          'A/B testing & optimalisatie',
          'Wekelijkse performance calls',
          'Branded content templates',
        ],
        cta: 'Meest gekozen',
      },
      {
        name: 'Premium',
        price: 'Vanaf €3.000',
        period: 'per maand',
        description: 'Full-service social media management voor maximum bereik en engagement.',
        color: '#F7E644',
        features: [
          'Onbeperkt posts',
          'Alle platforms',
          'Dagelijkse Stories & Reels',
          'Paid ads management',
          'UGC & influencer campagnes',
          'Dedicated social media manager',
          'Real-time crisis management',
          'Maandelijkse strategie sessies',
        ],
        cta: 'Ga premium',
      },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    icon: <Camera size={16} />,
    color: '#F7E644',
    subtitle: 'Professionele video, fotografie en motion design die jouw merk laten opvallen.',
    tiers: [
      {
        name: 'Video Pakket',
        price: 'Vanaf €1.200',
        period: 'per project',
        description: 'Professionele videoproductie voor social media, website of campagnes.',
        color: '#00A3E0',
        features: [
          '1 korte video (30-60 sec)',
          'Concept & scriptwriting',
          'Professionele opname',
          'Editing & color grading',
          'Muziek & sound design',
          '3 formaten (9:16, 1:1, 16:9)',
        ],
        cta: 'Boek een shoot',
      },
      {
        name: 'Content Dag',
        price: 'Vanaf €2.500',
        period: 'per dag',
        description: 'Een volledige dag content creatie — foto, video en behind-the-scenes.',
        color: '#25D366',
        popular: true,
        features: [
          'Halve of hele dag op locatie',
          '3-5 korte video\'s',
          '15+ professionele foto\'s',
          'Behind-the-scenes content',
          'Alle bewerkingen inbegrepen',
          'Geschikt voor 1 maand content',
          'Props & styling advies',
          'Direct bruikbaar voor socials',
        ],
        cta: 'Meest gekozen',
      },
      {
        name: 'Motion Design',
        price: 'Op maat',
        period: 'offerte',
        description: 'Branded animaties, bumpers en visuele content die blijft hangen.',
        color: '#F7E644',
        features: [
          'Alles uit Content Dag',
          '2D & 3D animaties',
          'Logo animaties & bumpers',
          'Campagne visuals',
          'Event teasers & aftermovies',
          'Social media ad creatives',
          'Branded templates',
          'Doorlopend partnership',
        ],
        cta: 'Vraag offerte aan',
      },
    ],
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: <Palette size={16} />,
    color: '#25D366',
    subtitle: 'Van logo tot complete merkidentiteit — wij bouwen merken die de status quo uitdagen.',
    tiers: [
      {
        name: 'Visual Identity',
        price: 'Vanaf €2.000',
        period: 'eenmalig',
        description: 'De visuele basis van je merk: logo, kleuren, typografie en huisstijl.',
        color: '#00A3E0',
        features: [
          'Logo design (3 concepten)',
          'Kleurenpalet & typografie',
          'Huisstijl handboek (PDF)',
          'Visitekaartje design',
          'Social media templates',
          'Bestandsformaten (AI, PNG, SVG)',
        ],
        cta: 'Start je branding',
      },
      {
        name: 'Full Branding',
        price: 'Vanaf €5.000',
        period: 'eenmalig',
        description: 'Complete merkidentiteit inclusief strategie, tone-of-voice en alle touchpoints.',
        color: '#25D366',
        popular: true,
        features: [
          'Alles uit Visual Identity',
          'Brand strategie & positionering',
          'Tone of voice guide',
          'Presentatie templates',
          'Drukwerk design (flyers, folders)',
          'Signing & environmental design',
          'Brand video / motion logo',
          'Onbeperkte revisies',
        ],
        cta: 'Meest gekozen',
      },
      {
        name: 'Rebrand',
        price: 'Op maat',
        period: 'offerte',
        description: 'Volledige herpositionering en redesign van een bestaand merk.',
        color: '#F7E644',
        features: [
          'Alles uit Full Branding',
          'Concurrentieanalyse',
          'Doelgroep onderzoek',
          'Merkarchitectuur',
          'Migratie bestaande touchpoints',
          'Interne brand training',
          'Launch campagne',
          '6 maanden brand support',
        ],
        cta: 'Vraag offerte aan',
      },
    ],
  },
];

const PricingPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('webdesign');

  useSEO({
    title: 'Prijzen',
    description: 'Transparante prijzen voor AI website development, social media management, content creatie en branding. Vanaf €750 per maand.',
    path: '/prijzen',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div className="min-h-screen bg-black text-white pt-28 md:pt-36 pb-20">
      {/* Back button */}
      <div className="container mx-auto px-6 max-w-6xl mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={14} />
          Terug
        </button>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 max-w-6xl mb-12 md:mb-16 text-center scroll-reveal">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#25D366]/5 border border-[#25D366]/20 mb-8">
          <Sparkles size={14} className="text-[#25D366]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#25D366]">Transparante Prijzen</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
          Investeer in<br /><span className="text-[#25D366]">resultaat</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Geen verborgen kosten. Geen verrassingen. Kies je dienst en ontdek direct wat je kunt verwachten.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-6 max-w-6xl mb-12 md:mb-16">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2.5 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'text-white shadow-lg'
                  : 'bg-white/5 text-white/40 border border-white/10 hover:text-white hover:border-white/20'
              }`}
              style={activeCategory === cat.id ? {
                backgroundColor: cat.color,
                boxShadow: `0 0 25px ${cat.color}30`,
              } : {}}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category subtitle */}
      <div className="container mx-auto px-6 max-w-3xl mb-12 md:mb-16 text-center">
        <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed transition-all duration-300">
          {currentCategory.subtitle}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {currentCategory.tiers.map((tier, i) => (
            <div
              key={`${activeCategory}-${i}`}
              className={`relative rounded-2xl md:rounded-3xl flex flex-col transition-all duration-500 scroll-reveal border ${
                tier.popular ? '' : 'hover:border-white/20'
              }`}
              style={{
                transitionDelay: `${i * 120}ms`,
                background: tier.popular ? `${tier.color}08` : 'rgba(255, 255, 255, 0.02)',
                borderColor: tier.popular ? `${tier.color}40` : 'rgba(255, 255, 255, 0.06)',
                padding: tier.popular ? '0' : '',
              }}
            >
              {tier.popular && (
                <div className="flex justify-center pt-5">
                  <span className="px-6 py-2 block rounded-full bg-[#25D366] text-white text-[11px] font-black uppercase tracking-widest shadow-[0_0_24px_rgba(37,211,102,0.5)]">
                    Populairst
                  </span>
                </div>
              )}

              <div className={tier.popular ? 'p-8 md:p-10 pt-5 md:pt-5 flex flex-col flex-1' : 'p-8 md:p-10 flex flex-col flex-1'}>
              {/* Tier header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  <h3 className="text-sm font-black uppercase text-white tracking-tight">{tier.name}</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl md:text-4xl font-black text-white tracking-tight">{tier.price}</span>
                  <span className="text-xs text-white/30 font-bold uppercase tracking-widest">{tier.period}</span>
                </div>
                <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{tier.description}</p>
              </div>

              {/* Features */}
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: tier.color }} />
                      <span className="text-gray-300 text-xs md:text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Button
                variant={tier.popular ? 'green' : 'glass'}
                icon
                onClick={onOpenBooking}
                className="w-full justify-center !h-[48px]"
              >
                {tier.cta}
              </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle CTA */}
      <div className="container mx-auto px-6 max-w-4xl mb-20 scroll-reveal">
        <div className="rounded-2xl md:rounded-3xl p-8 md:p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.05) 0%, rgba(0,163,224,0.05) 100%)', border: '1px solid rgba(37,211,102,0.15)' }}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#F7E644]/10 border border-[#F7E644]/20 mb-6">
            <Sparkles size={14} className="text-[#F7E644]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F7E644]">Bundel & Bespaar</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
            Combineer diensten,<br /><span className="text-[#F7E644]">bespaar tot 20%</span>
          </h3>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto mb-8 leading-relaxed">
            Neem meerdere diensten af en ontvang automatisch een bundel-korting.
            Website + Social Media? Branding + Content? Wij maken een pakket op maat.
          </p>
          <Button variant="green" icon onClick={onOpenBooking} className="!h-[48px]">
            Stel je bundel samen
          </Button>
        </div>
      </div>

      {/* FAQ / Extra info */}
      <div className="container mx-auto px-6 max-w-4xl mb-20 scroll-reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base font-black uppercase text-white tracking-tight mb-3">Wat zit er altijd inbegrepen?</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm font-medium">
              <li>- Persoonlijk aanspreekpunt</li>
              <li>- Strategisch advies</li>
              <li>- Transparante communicatie</li>
              <li>- 30 dagen gratis nazorg na oplevering</li>
              <li>- Alle bronbestanden worden opgeleverd</li>
            </ul>
          </div>
          <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base font-black uppercase text-white tracking-tight mb-3">Hoe werkt betaling?</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm font-medium">
              <li>- 50% aanbetaling bij start project</li>
              <li>- 50% bij oplevering</li>
              <li>- Maandelijkse facturatie bij doorlopende diensten</li>
              <li>- Geen verborgen kosten of lange contracten</li>
              <li>- Offerte altijd vrijblijvend</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-6 max-w-4xl scroll-reveal">
        <div className="rounded-2xl md:rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">
              Twijfel je nog?
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              Plan een gratis en vrijblijvend kennismakingsgesprek. Wij denken graag mee over de beste aanpak.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="green" icon onClick={onOpenBooking} className="!h-[48px]">
              Kennismaken
            </Button>
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
