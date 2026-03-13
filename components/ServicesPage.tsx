
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MessageCircle, ArrowRight,
  Bot, TrendingUp, Code2, CheckCircle2,
  BarChart3, Sparkles, Globe, Zap,
  Calendar, Target, Layers, Shield
} from 'lucide-react';
import Button from './Button';
import { useSEO } from '../hooks/useSEO';

const ServicesPage: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  useSEO({
    title: 'Diensten — Content Automation & AI Website Systemen',
    description: 'Website, CRM, content, advertenties én analytics — allemaal geautomatiseerd onder één dak. Content Automation vanaf €3.000/maand. Ontvang gratis 10 story\'s + 10 posts of een website demo ter waarde van €10.000.',
    path: '/diensten',
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

      {/* ─── HERO ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#25D366]/5 border border-[#25D366]/20 mb-6">
          <Sparkles size={14} className="text-[#25D366]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#25D366]">AI-GEDREVEN AUTOMATION</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
          Stop met jongleren<br />
          tussen <span className="text-[#F62961]">6 partijen</span>.
        </h1>
        <p className="text-gray-400 text-base md:text-xl font-medium max-w-2xl leading-relaxed mb-10">
          Website laten bouwen bij bureau A, content bij freelancer B, ads bij C, CRM bij D... En dan hopen dat het allemaal op elkaar aansluit? Wij pakken het anders aan.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="green" icon onClick={onOpenBooking} triggerOnHover>
            PLAN JE GRATIS CALL
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

      {/* ─── HET PROBLEEM ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Zonder SocialNow */}
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

          {/* Met SocialNow */}
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
            {
              icon: Globe,
              title: 'AI Website Systeem',
              desc: 'Complete website die overtuigt, vragen beantwoordt via AI-chat en afspraken regelt — dag en nacht. Inclusief CRM en analytics.',
              color: '#00A3E0',
            },
            {
              icon: Layers,
              title: 'Content Automation',
              desc: 'AI leest dagelijks je ad-resultaten, analyseert wat werkt en vertaalt dat naar je contentplanner. Elke maand automatisch ingepland.',
              color: '#25D366',
            },
            {
              icon: Target,
              title: 'Advertentie Optimalisatie',
              desc: 'AI-gedreven campagnes die zichzelf optimaliseren. Budget gaat naar wat werkt, niet naar gokken.',
              color: '#F62961',
            },
            {
              icon: BarChart3,
              title: 'Analytics Dashboard',
              desc: 'Real-time inzicht in al je kanalen. Conversies, bereik, engagement — alles op één plek.',
              color: '#F7E644',
            },
            {
              icon: Bot,
              title: 'AI Chatbot',
              desc: 'Beantwoordt klantvragen 24/7 in jouw tone-of-voice. Plant afspraken en kwalificeert leads automatisch.',
              color: '#00A3E0',
            },
            {
              icon: Calendar,
              title: 'Branded Content',
              desc: '60+ stuks content per maand in jouw huisstijl. Story\'s, posts, reels — allemaal automatisch ingepland.',
              color: '#25D366',
            },
          ].map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-500 hover:border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${service.color}10`, border: `1px solid ${service.color}20` }}>
                  <Icon size={22} style={{ color: service.color }} />
                </div>
                <h3 className="text-sm md:text-base font-black uppercase text-white tracking-tight leading-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
                  {service.desc}
                </p>
              </div>
            );
          })}
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
          <div className="rounded-2xl md:rounded-3xl p-8 md:p-10 border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#00A3E0]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A3E0]">VDZ-BRIGADE</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-3">
              0 → 14 afspraken<span className="text-[#00A3E0]">/week</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
              Van nul online aanwezigheid naar 14 gekwalificeerde afspraken per week. Binnen 1 maand na lancering van het complete systeem.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Afspraken', value: '14/week' },
                { label: 'Conversie', value: '+340%' },
                { label: 'Doorlooptijd', value: '4 weken' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-white font-black text-sm block">{stat.value}</span>
                  <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl md:rounded-3xl p-8 md:p-10 border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366]">RAVEG</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-3">
              Volledig <span className="text-[#25D366]">geautomatiseerd</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
              Van content tot ads — alles draait automatisch. Branding, website en social media onder één dak. Een samenwerking die nooit stopt.
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

      {/* ─── WERKWIJZE ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter mb-10 md:mb-14">
          Zo simpel is het
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl">
          {[
            { step: '01', title: 'Discovery Call', desc: '30 minuten om jouw situatie te begrijpen. We analyseren je huidige setup en laten zien waar de grootste kansen liggen. Gratis en vrijblijvend.', color: '#25D366' },
            { step: '02', title: 'Wij Leveren', desc: 'Binnen 1 week ontvang je 10 branded story\'s + 10 posts in jouw huisstijl, of een complete website demo met AI-systeem ter waarde van €10.000. Gratis.', color: '#00A3E0' },
          ].map((phase, i) => (
            <div
              key={i}
              className="rounded-2xl md:rounded-3xl p-8 md:p-10 relative"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <span className="text-3xl font-black tracking-tighter mb-4 block" style={{ color: phase.color }}>{phase.step}</span>
              <h4 className="text-base md:text-lg font-black uppercase text-white tracking-tight mb-3">{phase.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRICING / UPSELL ─── */}
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
          <div className="rounded-2xl md:rounded-3xl p-8 md:p-12 border border-[#25D366]/30 bg-[#25D366]/[0.02] relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-[#25D366] text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl">
              Meest gekozen
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366] mb-4">Content Automation Pakket</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">€3.000</span>
              <span className="text-gray-500 text-sm font-bold">/maand</span>
            </div>

            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 max-w-lg">
              Alles wat je nodig hebt om consistent te groeien. Branded content, automatische planning, advertentie-optimalisatie en analytics — volledig gedekt.
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

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="flex-1">
                PLAN JE GRATIS CALL
              </Button>
            </div>
          </div>

          {/* Add-ons */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-6 border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-3">
                <Globe size={16} className="text-[#00A3E0]" />
                <span className="text-xs font-black uppercase text-white tracking-tight">Website + AI Systeem</span>
              </div>
              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-3">
                Complete website met AI-chatbot, CRM en analytics. Eenmalige investering, daarna onderhoud.
              </p>
              <span className="text-[#00A3E0] text-xs font-black uppercase tracking-wider">Vraag offerte aan</span>
            </div>
            <div className="rounded-2xl p-6 border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={16} className="text-[#F7E644]" />
                <span className="text-xs font-black uppercase text-white tracking-tight">Brand Strategy</span>
              </div>
              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-3">
                Huisstijl, merkpositionering en brand guidelines. Eén keer goed neerzetten, altijd consistent.
              </p>
              <span className="text-[#F7E644] text-xs font-black uppercase tracking-wider">Vraag offerte aan</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── GRATIS AANBIEDINGEN ─── */}
      <div className="container mx-auto px-6 max-w-6xl mb-20 md:mb-32">
        <div className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F7E644] mb-3">ACTIE LOOPT TOT EIND MAART 2026</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.85]">
            Start gratis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="p-6 md:p-8 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#25D366] mb-3">GRATIS CONTENT PAKKET</p>
            <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tight mb-2">10 Story's + 10 Posts</h3>
            <p className="text-gray-400 text-sm mb-4">Compleet in jouw huisstijl of een verbeterde versie daarvan. Binnen 1 week geleverd.</p>
            <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="!text-sm">
              CLAIM JE CONTENT
            </Button>
          </div>
          <div className="p-6 md:p-8 rounded-2xl border border-[#00A3E0]/20 bg-[#00A3E0]/5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A3E0] mb-3">GRATIS WEBSITE DEMO</p>
            <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tight mb-2">Ter waarde van €10.000</h3>
            <p className="text-gray-400 text-sm mb-4">Complete website met AI-systeem, CRM en analytics. Gratis en vrijblijvend als live demo.</p>
            <Button variant="outline" icon onClick={onOpenBooking} className="!text-sm !border-[#00A3E0]/50 hover:!border-[#00A3E0] !text-[#00A3E0]">
              VRAAG JE DEMO AAN
            </Button>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM CTA ─── */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div
          className="rounded-2xl md:rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">
              Klaar om alles te automatiseren?
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              Plan een gratis discovery call en ontdek wat ons AI-systeem voor jouw bedrijf kan betekenen.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="green" icon onClick={onOpenBooking} triggerOnHover className="!h-[48px]">
              Plan je Call
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

export default ServicesPage;
