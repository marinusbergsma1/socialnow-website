import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Sparkles, MessageCircle } from 'lucide-react';
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

const tiers: PricingTier[] = [
  {
    name: 'One-Pager',
    price: 'Vanaf €1.500',
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
    price: 'Vanaf €3.500',
    period: 'eenmalig',
    description: 'Voor groeiende bedrijven die een volwaardig online platform nodig hebben.',
    color: '#25D366',
    popular: true,
    features: [
      'Multi-page website (5-10 pagina\'s)',
      'AI-gestuurde development',
      'Custom UX/UI design',
      'CMS integratie',
      'Animaties & micro-interacties',
      'Performance optimalisatie',
      'SEO & analytics setup',
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
];

const PricingPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  useSEO({
    title: 'Prijzen',
    description: 'Transparante prijzen voor AI website development, branding en digitale projecten. Vanaf €1.500 voor een one-pager.',
    path: '/prijzen',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <div className="container mx-auto px-6 max-w-6xl mb-16 md:mb-24 text-center scroll-reveal">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#25D366]/5 border border-[#25D366]/20 mb-8">
          <Sparkles size={14} className="text-[#25D366]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#25D366]">Transparante Prijzen</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
          Investeer in<br /><span className="text-[#25D366]">resultaat</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Geen verborgen kosten. Geen verrassingen. Transparante prijzen voor elk type project.
          Alle projecten worden gebouwd met AI voor maximale snelheid en kwaliteit.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative rounded-2xl md:rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-500 hover:border-white/20 scroll-reveal ${
                tier.popular ? 'border-2' : 'border'
              }`}
              style={{
                transitionDelay: `${i * 120}ms`,
                background: tier.popular ? `rgba(37, 211, 102, 0.03)` : 'rgba(255, 255, 255, 0.02)',
                borderColor: tier.popular ? `${tier.color}40` : 'rgba(255, 255, 255, 0.06)',
              }}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-[#25D366] text-black text-[10px] font-black uppercase tracking-widest">
                    Populairst
                  </span>
                </div>
              )}

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
          ))}
        </div>
      </div>

      {/* FAQ / Extra info */}
      <div className="container mx-auto px-6 max-w-4xl mb-20 scroll-reveal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base font-black uppercase text-white tracking-tight mb-3">Wat zit er altijd inbegrepen?</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm font-medium">
              <li>- Responsief design (mobiel, tablet, desktop)</li>
              <li>- SSL certificaat & hosting advies</li>
              <li>- Basis SEO optimalisatie</li>
              <li>- 30 dagen gratis nazorg na oplevering</li>
              <li>- Alle bronbestanden worden opgeleverd</li>
            </ul>
          </div>
          <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base font-black uppercase text-white tracking-tight mb-3">Hoe werkt betaling?</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm font-medium">
              <li>- 50% aanbetaling bij start project</li>
              <li>- 50% bij oplevering</li>
              <li>- Betaling op factuur (14 dagen)</li>
              <li>- Geen abonnementen of doorlopende kosten</li>
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
