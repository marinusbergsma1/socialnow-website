
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MessageCircle, ArrowRight,
  Bot, TrendingUp, Code2, CheckCircle2, Check,
  BarChart3, Sparkles, Globe, Zap,
  Calendar, Target, Layers, Shield,
  Instagram, Camera, Palette, Gift, Star
} from 'lucide-react';
import Button from './Button';
import { useSEO } from '../hooks/useSEO';

// ─── PRICING DATA ─────────────────────────────────────────────────────────

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
        description: 'Perfect voor startups en ondernemers die snel online willen.',
        color: '#00A3E0',
        features: [
          'Responsive one-page website',
          'AI-gestuurde development',
          'SEO-geoptimaliseerd',
          'Contact formulier',
          'Live binnen 2 weken',
          'Google Analytics setup',
          '🎁 AI Agent Chatbot t.w.v. €500 — tijdelijk GRATIS',
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
          'Multi-page website (5-10 pagina\'s)',
          'AI-gestuurde development',
          'Custom UX/UI design',
          'CMS integratie',
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
        description: 'Complexe projecten, web apps, e-commerce platforms.',
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
    subtitle: 'Consistent content, strategie en groei — volledig uit handen.',
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
        description: 'Voor merken die serieus willen groeien met premium content.',
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
        description: 'Full-service social media management.',
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
    subtitle: 'Professionele video, fotografie en motion design.',
    tiers: [
      {
        name: 'Video Pakket',
        price: 'Vanaf €1.200',
        period: 'per project',
        description: 'Professionele videoproductie voor social media of campagnes.',
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
        description: 'Volledige dag content creatie — foto, video en BTS.',
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
        description: 'Branded animaties, bumpers en visuele content.',
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
    subtitle: 'Van logo tot complete merkidentiteit — wij bouwen merken die opvallen.',
    tiers: [
      {
        name: 'Visual Identity',
        price: 'Vanaf €2.000',
        period: 'eenmalig',
        description: 'De visuele basis: logo, kleuren, typografie en huisstijl.',
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
        description: 'Complete merkidentiteit inclusief strategie en tone-of-voice.',
        color: '#25D366',
        popular: true,
        features: [
          'Alles uit Visual Identity',
          'Brand strategie & positionering',
          'Tone of voice guide',
          'Presentatie templates',
          'Drukwerk design',
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
        description: 'Volledige herpositionering en redesign.',
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

// ─── COMPONENT ──────────────────────────────────────────────────────────

const ServicesPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('webdesign');

  useSEO({
    title: 'Diensten & Prijzen — Content Automation & AI Website Systemen',
    description: 'Website, CRM, content, advertenties én analytics — allemaal geautomatiseerd onder één dak. Ontvang gratis 10 story\'s + 10 posts of een website demo ter waarde van €10.000.',
    path: '/diensten',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];

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

      {/* ════════════════════════════════════════════════════════════════════
          ★★★  GRATIS ACTIES — KNALLENDE HERO  ★★★
          ════════════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem]"
          style={{
            background: 'linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(0,163,224,0.08) 50%, rgba(247,230,68,0.05) 100%)',
            border: '2px solid rgba(37,211,102,0.3)',
          }}
        >
          {/* Animated glow ring */}
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-30 animate-pulse"
            style={{ background: 'radial-gradient(circle, #25D366 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-20 animate-pulse"
            style={{ background: 'radial-gradient(circle, #00A3E0 0%, transparent 70%)', animationDelay: '1s' }} />

          <div className="relative z-10 p-8 md:p-14 lg:p-20">
            {/* Urgency badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7E644]/15 border border-[#F7E644]/30 animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7E644] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F7E644]"></span>
                </span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#F7E644]">ACTIE LOOPT TOT EIND MAART 2026</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F62961]/15 border border-[#F62961]/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F62961] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F62961]"></span>
                </span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#F62961]">5 BEDRIJVEN PER KWARTAAL — NOG 2 PLEKKEN OVER</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4 md:mb-6">
              DUBBELDEAL:<br /><span className="text-[#25D366]">100% GRATIS</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed mb-8 md:mb-12">
              Ontvang gratis content én een website demo t.w.v. €11.500. Plan een call en ontdek of je in aanmerking komt — zonder verplichtingen.
            </p>

            {/* DUBBELDEAL — One big combined card */}
            <div className="mb-8 md:mb-12">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-[#25D366]/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-2xl md:rounded-3xl p-6 md:p-10 border-2 border-[#25D366]/40 hover:border-[#25D366]/80 transition-all duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(0,163,224,0.06) 50%, rgba(37,211,102,0.03) 100%)' }}>

                  {/* Dubbeldeal badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7E644]/15 border border-[#F7E644]/30 mb-6">
                    <Star size={12} className="text-[#F7E644]" fill="currentColor" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#F7E644]">DUBBELDEAL — WAARDE: €11.500+</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8">
                    {/* Left: Content */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center">
                          <Gift size={20} className="text-[#25D366]" />
                        </div>
                        <div>
                          <span className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366]">GRATIS CONTENT</span>
                          <span className="block text-white/30 text-[9px] font-bold uppercase tracking-wider">Waarde: €1.500+</span>
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none mb-2">
                        10 Story's + 10 Posts
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
                        Compleet in jouw huisstijl. Binnen 1 week geleverd.
                      </p>
                    </div>

                    {/* Right: Website */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#00A3E0]/20 border border-[#00A3E0]/30 flex items-center justify-center">
                          <Globe size={20} className="text-[#00A3E0]" />
                        </div>
                        <div>
                          <span className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#00A3E0]">GRATIS WEBSITE DEMO</span>
                          <span className="block text-white/30 text-[9px] font-bold uppercase tracking-wider">Waarde: €10.000</span>
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none mb-2">
                        Complete Website + AI
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
                        Website met AI-chatbot, CRM en analytics. Volledig werkend.
                      </p>
                    </div>
                  </div>

                  {/* Combined CTA */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="flex-1 justify-center">
                      CLAIM JE DUBBELDEAL
                    </Button>
                    <button
                      onClick={onOpenBooking}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/10 text-white/60 text-xs font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                      OF KIES ER ÉÉN <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust line */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#25D366]" />
                <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-wider">Beide 100% gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#25D366]" />
                <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-wider">Geen verplichtingen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#25D366]" />
                <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-wider">Geleverd binnen 1 week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HET PROBLEEM ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.85]">
            Stop met jongleren<br />tussen <span className="text-[#F62961]">6 partijen</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="rounded-2xl md:rounded-3xl p-8 md:p-10 border border-[#F62961]/20 bg-[#F62961]/[0.02]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F62961] mb-6">Zonder automation</p>
            <ul className="space-y-4">
              {[
                'Losse freelancers die niet samenwerken',
                'Content die niet aansluit op je advertenties',
                'Geen inzicht in wat écht werkt',
                'Elke maand handmatig plannen en posten',
                'Website die er mooi uitziet maar niet verkoopt',
                'Duizenden euro\'s aan losse facturen',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm font-medium">
                  <span className="text-[#F62961] mt-0.5 shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl md:rounded-3xl p-8 md:p-10 border border-[#25D366]/20 bg-[#25D366]/[0.02]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366] mb-6">Met SocialNow</p>
            <ul className="space-y-4">
              {[
                'Eén team dat alles afstemt en uitvoert',
                'AI analyseert ad-data en maakt content die converteert',
                'Real-time dashboard met alle metrics',
                'Automatisch ingepland — elke maand, elke week',
                'Website die werkt als je beste verkoper, 24/7',
                'Eén factuur, alles onder controle',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-[#25D366] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─── WAT JE KRIJGT ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
            Eén systeem.<br /><span className="text-[#25D366]">Alles geregeld.</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-xl mx-auto">
            Website, CRM, content, advertenties én analytics — volledig geïntegreerd en geautomatiseerd door AI.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[
            { icon: Globe, title: 'AI Website Systeem', desc: 'Complete website die overtuigt, vragen beantwoordt via AI-chat en afspraken regelt — dag en nacht.', color: '#00A3E0' },
            { icon: Layers, title: 'Content Automation', desc: 'AI leest dagelijks je ad-resultaten, analyseert wat werkt en vertaalt dat naar je contentplanner.', color: '#25D366' },
            { icon: Target, title: 'Advertentie Optimalisatie', desc: 'AI-gedreven campagnes die zichzelf optimaliseren. Budget gaat naar wat werkt.', color: '#F62961' },
            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time inzicht in al je kanalen. Conversies, bereik, engagement — alles op één plek.', color: '#F7E644' },
            { icon: Bot, title: 'AI Chatbot', desc: 'Beantwoordt klantvragen 24/7 in jouw tone-of-voice. Plant afspraken automatisch.', color: '#00A3E0' },
            { icon: Palette, title: 'Branding', desc: 'Huisstijl, merkpositionering en brand guidelines. Eén keer goed neerzetten, altijd consistent.', color: '#25D366' },
          ].map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="group rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-500 hover:border-white/20"
                style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
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
          <div className="rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#25D366]/30 relative overflow-hidden" style={{ background: 'rgba(10, 10, 10, 0.85)' }}>
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
                '60+ stuks branded content/maand',
                'AI-gedreven contentplanner',
                'Advertentie optimalisatie',
                'Analytics dashboard',
                'Story\'s, posts & reels',
                'Maandelijkse rapportage',
                'Dedicated account manager',
                'Onbeperkt revisies',
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

          {/* Add-ons */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-6 border border-white/[0.06]" style={{ background: 'rgba(10, 10, 10, 0.85)' }}>
              <div className="flex items-center gap-3 mb-3">
                <Globe size={16} className="text-[#00A3E0]" />
                <span className="text-xs font-black uppercase text-white tracking-tight">Website + AI Systeem</span>
              </div>
              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-3">
                Complete website met AI-chatbot, CRM en analytics. Eenmalige investering.
              </p>
              <span className="text-[#00A3E0] text-xs font-black uppercase tracking-wider">Vraag offerte aan</span>
            </div>
            <div className="rounded-2xl p-6 border border-white/[0.06]" style={{ background: 'rgba(10, 10, 10, 0.85)' }}>
              <div className="flex items-center gap-3 mb-3">
                <Shield size={16} className="text-[#F7E644]" />
                <span className="text-xs font-black uppercase text-white tracking-tight">Brand Strategy</span>
              </div>
              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-3">
                Huisstijl, merkpositionering en brand guidelines.
              </p>
              <span className="text-[#F7E644] text-xs font-black uppercase tracking-wider">Vraag offerte aan</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RESULTATEN ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
            Bewezen <span className="text-[#F7E644]">resultaten</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* VDZ-Brigade Case */}
          <div className="rounded-2xl md:rounded-3xl p-8 md:p-10 border border-[#00A3E0]/20 bg-[#00A3E0]/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#00A3E0]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A3E0]">CASE STUDY — VDZ-BRIGADE</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-3">
              0 → 6 leads<span className="text-[#00A3E0]">/dag</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">
              Van nul online aanwezigheid naar 6 gekwalificeerde leads per dag — in slechts 2 maanden. Branding vanaf 0 opgebouwd, AI-content ingezet, analytics continu gemonitord.
            </p>
            <p className="text-gray-400 text-xs font-bold leading-relaxed mb-6">
              De eerste 3 opdrachten: tussen <span className="text-white">€10.000 en €30.000</span>. Totale investering? <span className="text-[#25D366] font-black">10x terugverdiend.</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Leads/dag', value: '6' },
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
          {/* Automation Case */}
          <div className="rounded-2xl md:rounded-3xl p-8 md:p-10 border border-[#25D366]/20 bg-[#25D366]/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366]">CASE STUDY</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-3">
              Volledig <span className="text-[#25D366]">geautomatiseerd</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
              Content, ads en analytics — alles draait automatisch. Website, branding en social media vanuit één systeem.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Content/maand', value: '60+' },
                { label: 'Engagement', value: '+300%' },
                { label: 'Tijd bespaard', value: '120u/m' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-white font-black text-sm block">{stat.value}</span>
                  <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ★★★  ALLE PRIJZEN  ★★★
          ════════════════════════════════════════════════════════════════════ */}
      <div id="prijzen" className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#25D366]/5 border border-[#25D366]/20 mb-8">
            <Sparkles size={14} className="text-[#25D366]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#25D366]">Transparante Prijzen</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
            Investeer in <span className="text-[#25D366]">resultaat</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Geen verborgen kosten. Geen verrassingen. Kies je dienst en ontdek direct wat je kunt verwachten.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14">
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

        {/* Category subtitle */}
        <p className="text-center text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-3xl mx-auto mb-10 md:mb-14">
          {currentCategory.subtitle}
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {currentCategory.tiers.map((tier, i) => (
            <div
              key={`${activeCategory}-${i}`}
              className={`relative rounded-2xl md:rounded-3xl flex flex-col transition-all duration-500 border ${
                tier.popular ? '' : 'hover:border-white/20'
              }`}
              style={{
                background: tier.popular ? `${tier.color}08` : 'rgba(0, 0, 0, 0.6)',
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

      {/* ─── BUNDEL & BESPAAR ─── */}
      <div className="container mx-auto px-6 max-w-4xl mb-20 md:mb-32">
        <div className="rounded-2xl md:rounded-3xl p-8 md:p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.05) 0%, rgba(0,163,224,0.05) 100%)', border: '1px solid rgba(37,211,102,0.15)' }}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#F7E644]/10 border border-[#F7E644]/20 mb-6">
            <Sparkles size={14} className="text-[#F7E644]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F7E644]">Bundel & Bespaar</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
            Combineer diensten,<br /><span className="text-[#F7E644]">bespaar tot 20%</span>
          </h3>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto mb-8 leading-relaxed">
            Neem meerdere diensten af en ontvang automatisch een bundel-korting. Website + Social Media? Branding + Content? Wij maken een pakket op maat.
          </p>
          <div className="flex justify-center">
            <Button variant="green" icon onClick={onOpenBooking} className="!h-[48px]">
              Stel je bundel samen
            </Button>
          </div>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="container mx-auto px-6 max-w-4xl mb-20 md:mb-32">
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

      {/* ─── WERKWIJZE ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-10 md:mb-14 text-center">
          Zo simpel is het
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          {[
            { step: '01', title: 'Discovery Call', desc: '30 minuten om jouw situatie te begrijpen. We analyseren je huidige setup en laten zien waar de grootste kansen liggen. Gratis en vrijblijvend.', color: '#25D366' },
            { step: '02', title: 'Wij Leveren', desc: 'Binnen 1 week ontvang je 10 branded story\'s + 10 posts in jouw huisstijl, of een complete website demo met AI-systeem ter waarde van €10.000. Gratis.', color: '#00A3E0' },
          ].map((phase, i) => (
            <div key={i} className="rounded-2xl md:rounded-3xl p-8 md:p-10 relative"
              style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span className="text-3xl font-black tracking-tighter mb-4 block" style={{ color: phase.color }}>{phase.step}</span>
              <h4 className="text-base md:text-lg font-black uppercase text-white tracking-tight mb-3">{phase.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ★★★  BOTTOM CTA — GRATIS ACTIES HERHALING  ★★★
          ════════════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="rounded-2xl md:rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(37,211,102,0.06) 0%, rgba(0,0,0,0) 50%, rgba(0,163,224,0.06) 100%)',
            border: '1px solid rgba(37,211,102,0.2)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7E644]/15 border border-[#F7E644]/30 mb-6">
            <Gift size={14} className="text-[#F7E644]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F7E644]">GRATIS AANBIEDINGEN</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-3">
            Klaar om gratis te starten?
          </h3>
          <p className="text-gray-400 text-sm font-medium max-w-xl mx-auto mb-8">
            Plan een gratis call en ontdek of je in aanmerking komt voor ons gratis content pakket of een website demo t.w.v. €10.000.
          </p>
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
    </div>
  );
};

export default ServicesPage;
