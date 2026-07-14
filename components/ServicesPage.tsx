
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MessageCircle, CheckCircle2, Check,
  BarChart3, Globe, Target, Layers,
} from 'lucide-react';
import Button from './Button';
import { useSEO } from '../hooks/useSEO';

// ─── WEBDESIGN PRICING DATA ─────────────────────────────────────────────

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

const webdesignTiers: PricingTier[] = [
  {
    name: 'One-Pager',
    price: '€1.500,-',
    period: 'eenmalig',
    description: 'Perfect voor startups en ondernemers die snel online willen.',
    color: '#00A3E0',
    features: [
      'Responsive one-page website', 'AI-gestuurde development', 'SEO-geoptimaliseerd',
      'Contact formulier', 'Google Analytics setup', 'Live binnen 2 weken',
    ],
    cta: 'Start je project',
  },
  {
    name: 'Business Website',
    price: '€2.500,-',
    period: 'eenmalig',
    description: 'Voor groeiende bedrijven die een volwaardig platform nodig hebben.',
    color: '#25D366',
    popular: true,
    features: [
      'Multi-page website (5-10 pagina\'s)', 'Custom UX/UI design', 'CMS & WhatsApp integratie',
      'Performance optimalisatie (90+ score)', 'Hosting, SSL & SEO inbegrepen', 'Live binnen 3-4 weken',
    ],
    cta: 'Meest gekozen',
  },
  {
    name: 'Custom Project',
    price: 'Op maat',
    period: 'offerte',
    description: 'Complexe projecten, web apps, e-commerce platforms.',
    color: '#F7E644',
    features: [
      'Alles uit Business Website', 'Web applicatie / SaaS', 'E-commerce integratie',
      'AI automation workflows', 'API koppelingen', 'Doorlopende ondersteuning',
    ],
    cta: 'Vraag offerte aan',
  },
];

// ─── COMPONENT ──────────────────────────────────────────────────────────

const ServicesPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  useSEO({
    title: 'Diensten & Prijzen | Software Development, Content Automation & AI Systemen',
    description: 'Maatwerk software, webapps, website, CRM, content en advertenties, allemaal samen in 1 overzichtelijke AI chat. Custom AI Solutions & software development. Start met een gratis proof of concept.',
    path: '/diensten',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white pt-28 md:pt-36 pb-20">
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

      {/* ─── HERO ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32 text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-6">
          Je website, CRM, content & ads<br /><span className="text-[#25D366]">in één AI chat.</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto">
          Start met een gratis proof of concept: een complete website demo én rebranding.
        </p>
      </div>

      {/* ─── HET PROBLEEM ─── */}
      <div className="max-w-4xl mx-auto px-6 mb-20 md:mb-32">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.85]">
            Stop met jongleren<br />tussen <span className="text-[#F62961]">6 partijen</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              label: 'Zonder automation', color: '#F62961', positive: false,
              items: ['Losse freelancers die niet samenwerken', 'Content die niet aansluit op je advertenties', 'Geen inzicht in wat écht werkt', 'Duizenden euro\'s aan losse facturen'],
            },
            {
              label: 'Met SocialNow', color: '#25D366', positive: true,
              items: ['Eén team dat alles afstemt en uitvoert', 'AI analyseert ad-data en maakt content die converteert', 'Website die werkt als je beste verkoper, 24/7', 'Eén factuur, alles onder controle'],
            },
          ].map((col) => (
            <div key={col.label} className="sn-warp-tile rounded-2xl md:rounded-3xl p-8 md:p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6" style={{ color: col.color }}>{col.label}</p>
              <ul className="space-y-4">
                {col.items.map((item, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm font-medium ${col.positive ? 'text-gray-300' : 'text-gray-400'}`}>
                    {col.positive
                      ? <CheckCircle2 size={16} className="text-[#25D366] mt-0.5 shrink-0" />
                      : <span className="text-[#F62961] mt-0.5 shrink-0">✕</span>}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WAT JE KRIJGT ─── */}
      <div className="max-w-5xl mx-auto px-6 mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
            Wat je <span className="text-[#25D366]">krijgt</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-xl mx-auto">
            Website, CRM, content, advertenties én analytics: volledig geïntegreerd en geautomatiseerd door AI.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            { icon: Globe, title: 'AI Website Systeem', desc: 'Complete website die overtuigt, vragen beantwoordt via AI-chat en afspraken regelt, dag en nacht.', color: '#00A3E0' },
            { icon: Layers, title: 'Content Automation', desc: 'AI leest dagelijks je ad-resultaten, analyseert wat werkt en vertaalt dat naar je contentplanner.', color: '#25D366' },
            { icon: Target, title: 'Advertentie Optimalisatie', desc: 'AI-gedreven campagnes die zichzelf optimaliseren. Budget gaat naar wat werkt.', color: '#F62961' },
            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time inzicht in al je kanalen. Conversies, bereik, engagement: alles op één plek.', color: '#F7E644' },
          ].map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="sn-warp-tile rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${service.color}10`, border: `1px solid ${service.color}20` }}>
                  <Icon size={22} style={{ color: service.color }} />
                </div>
                <h3 className="text-sm md:text-base font-black uppercase text-white tracking-tight leading-tight mb-3">{service.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── CONTENT AUTOMATION PAKKET ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
            Content Automation
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-xl mx-auto">
            Eén partij die alles doet. Geen losse freelancers, geen dure bureaus meer.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="sn-warp-tile rounded-2xl md:rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#25D366] text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl">
              Meest gekozen
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366] mb-4">Content Automation Pakket</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">€3.000</span>
              <span className="text-gray-500 text-sm font-bold">/maand</span>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 max-w-lg">
              Alles wat je nodig hebt om consistent te groeien. Branded content, automatische planning, advertentie-optimalisatie en analytics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
              {[
                '60+ stuks branded content/maand', 'AI-gedreven contentplanner', 'Advertentie optimalisatie',
                'Analytics dashboard', 'Story\'s, posts & reels', 'Maandelijkse rapportage',
                'Dedicated account manager', 'Onbeperkt revisies',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-gray-300 text-sm font-medium">
                  <CheckCircle2 size={14} className="text-[#25D366] shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
            <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="w-full justify-center">
              PLAN JE GRATIS CALL
            </Button>
          </div>
        </div>
      </div>

      {/* ─── ALLE PRIJZEN ─── */}
      <div id="prijzen" className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
            Investeer in <span className="text-[#25D366]">resultaat</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Van one-pager tot volledige web apps, gebouwd met AI voor maximale snelheid en kwaliteit. Geen verborgen kosten.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {webdesignTiers.map((tier, i) => (
            <div key={i} className="sn-warp-tile relative rounded-2xl md:rounded-3xl flex flex-col">
              {tier.popular && (
                <div className="flex justify-center pt-5">
                  <span className="px-6 py-2 block rounded-full bg-[#25D366] text-white text-[11px] font-black uppercase tracking-widest shadow-[0_0_24px_rgba(37,211,102,0.5)]">
                    Populairst
                  </span>
                </div>
              )}
              <div className={`p-8 md:p-10 flex flex-col flex-1 ${tier.popular ? 'pt-5 md:pt-5' : ''}`}>
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
                <Button
                  variant={tier.popular ? 'green' : 'outline'}
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

      {/* ─── RESULTAAT ─── */}
      <div className="max-w-2xl mx-auto px-6 mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
            Bewezen <span className="text-[#F7E644]">resultaat</span>
          </h2>
        </div>
        <div className="sn-warp-tile rounded-2xl md:rounded-3xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00A3E0]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A3E0]">CASE STUDY: VDZ-BRIGADE</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-3">
            10+ leads<span className="text-[#00A3E0]">/dag</span>
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">
            Van nul online aanwezigheid naar 10+ gekwalificeerde leads per dag, in slechts 2 maanden. Branding vanaf 0 opgebouwd, AI-content ingezet, analytics continu gemonitord.
          </p>
          <p className="text-gray-400 text-xs font-bold leading-relaxed mb-6">
            De eerste 3 opdrachten: tussen <span className="text-white">€10.000 en €30.000</span>. Totale investering? <span className="text-[#25D366] font-black">10x terugverdiend.</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Leads/dag', value: '10+' },
              { label: 'Doorlooptijd', value: '2 mnd' },
              { label: 'ROI', value: '10x' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                <span className="text-white font-black text-sm block">{stat.value}</span>
                <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="container mx-auto px-6 max-w-4xl mb-20 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {[
            {
              q: 'Wat zit er altijd inbegrepen?',
              a: ['Persoonlijk aanspreekpunt', 'Strategisch advies', 'Transparante communicatie', '30 dagen gratis nazorg na oplevering', 'Alle bronbestanden worden opgeleverd'],
            },
            {
              q: 'Hoe werkt betaling?',
              a: ['50% aanbetaling bij start project', '50% bij oplevering', 'Maandelijkse facturatie bij doorlopende diensten', 'Geen verborgen kosten of lange contracten', 'Offerte altijd vrijblijvend'],
            },
          ].map((faq) => (
            <div key={faq.q} className="sn-warp-tile rounded-2xl p-6 md:p-8">
              <h3 className="text-base font-black uppercase text-white tracking-tight mb-3">{faq.q}</h3>
              <ul className="space-y-2 text-gray-400 text-xs md:text-sm font-medium">
                {faq.a.map((item) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WERKWIJZE ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-10 md:mb-14 text-center">
          Zo simpel is het
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          {[
            { step: '01', title: 'Discovery Call', desc: '30 minuten om jouw situatie te begrijpen. We analyseren je huidige setup en laten zien waar de grootste kansen liggen. Gratis en vrijblijvend.', color: '#25D366' },
            { step: '02', title: 'Wij Leveren', desc: 'Binnen 1 week ontvang je je gratis proof of concept: een complete website demo én rebranding.', color: '#00A3E0' },
          ].map((phase, i) => (
            <div key={i} className="sn-warp-tile rounded-2xl md:rounded-3xl p-8 md:p-10">
              <span className="text-3xl font-black tracking-tighter mb-4 block" style={{ color: phase.color }}>{phase.step}</span>
              <h4 className="text-base md:text-lg font-black uppercase text-white tracking-tight mb-3">{phase.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── AFSLUIT CTA ─── */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="!h-[52px] !text-sm !px-8">
            PLAN JE GRATIS CALL
          </Button>
          <a
            href="https://wa.me/31637404577"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
