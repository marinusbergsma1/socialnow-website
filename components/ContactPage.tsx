
import React, { useEffect, useState, useRef } from 'react';
import {
  X, Mail, Phone, MessageCircle, MapPin,
  ArrowRight, ArrowUpRight, Clock, Calendar,
  Instagram, Linkedin, Sparkles, Zap, Shield,
  Globe, Users, Rocket, Star, CheckCircle2,
  Send, ChevronRight, ChevronDown, Code2,
  Layers, Target, BarChart3, Cpu, Briefcase,
  Award, HeartHandshake, MousePointerClick
} from 'lucide-react';

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Animated Counter ─── */
const AnimCounter: React.FC<{ end: number; suffix?: string; prefix?: string; start: boolean }> = ({ end, suffix = '', prefix = '', start }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / 2000, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * end));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end]);
  return <span>{prefix}{val}{suffix}</span>;
};

/* ─── Scroll Reveal Hook ─── */
const useScrollReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.08, rootMargin: '60px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return { ref, visible };
};

/* ─── FAQ Accordion Item ─── */
const FAQItem: React.FC<{ q: string; a: string; index: number }> = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-500 ${open ? 'bg-white/[0.03] border-white/[0.12]' : 'bg-white/[0.015] hover:border-white/[0.1]'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 md:p-7 text-left group"
      >
        <div className="flex items-center gap-4 pr-4">
          <span className="text-[10px] font-black tracking-[0.3em] text-white/15 flex-shrink-0">0{index + 1}</span>
          <h4 className="text-white font-bold text-sm md:text-[15px] tracking-tight leading-snug">{q}</h4>
        </div>
        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${open ? 'bg-[#00A3E0] border-[#00A3E0] rotate-180' : 'bg-white/[0.03]'}`}>
          <ChevronDown size={14} className={`transition-colors ${open ? 'text-black' : 'text-white/40'}`} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 md:px-7 pb-6 md:pb-7 pt-0">
          <div className="pl-10 border-l-2 border-white/[0.06]">
            <p className="text-white/35 text-[13px] font-medium leading-relaxed">{a}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Marquee Logos Component ─── */
const TrustMarquee: React.FC = () => {
  const clients = [
    'DIVINE MACHINES', 'LIGHT ART COLLECTION', 'CRAFTURE', 'THE HEALTH HOUSE',
    'RAVEG', 'BOADU', 'C4 PERFORMANCE', 'SOULFUL SPECIALS'
  ];
  return (
    <div className="overflow-hidden relative py-4">
      <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
        {[...clients, ...clients].map((c, i) => (
          <span key={i} className="text-white/10 text-[11px] font-black uppercase tracking-[0.4em] mx-8 flex-shrink-0">{c}</span>
        ))}
      </div>
    </div>
  );
};

const ContactPage: React.FC<ContactPageProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const heroReveal = useScrollReveal(0);
  const statsReveal = useScrollReveal(100);
  const channelsReveal = useScrollReveal(0);
  const processReveal = useScrollReveal(100);
  const whyReveal = useScrollReveal(100);
  const servicesReveal = useScrollReveal(100);
  const teamReveal = useScrollReveal(100);
  const faqReveal = useScrollReveal(100);
  const ctaReveal = useScrollReveal(100);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 600);
  };

  if (!isOpen && !isClosing) return null;

  const contactChannels = [
    {
      href: 'https://wa.me/31637404577',
      external: true,
      icon: <MessageCircle size={24} />,
      iconBg: 'bg-[#25D366]',
      iconText: 'text-black',
      title: 'WhatsApp',
      subtitle: 'Snelste reactie — altijd binnen 1 uur',
      subtitleColor: 'text-[#25D366]/60',
      borderColor: 'border-[#25D366]/20',
      bgColor: 'bg-[#25D366]/[0.03]',
      hoverBg: 'hover:bg-[#25D366]/[0.08]',
      hoverBorder: 'hover:border-[#25D366]/40',
      hoverArrow: 'group-hover:text-[#25D366]',
      badge: 'AANBEVOLEN',
      badgeBg: 'bg-[#25D366]',
      badgeText: 'text-black',
      glow: 'group-hover:shadow-[0_0_60px_rgba(37,211,102,0.08)]',
    },
    {
      href: 'mailto:info@socialnow.nl',
      external: false,
      icon: <Mail size={24} />,
      iconBg: 'border border-[#F7E644]/20 bg-[#F7E644]/[0.05]',
      iconText: 'text-[#F7E644]',
      title: 'E-mail',
      subtitle: 'info@socialnow.nl',
      subtitleColor: 'text-white/30',
      borderColor: 'border-white/[0.06]',
      bgColor: 'bg-white/[0.02]',
      hoverBg: 'hover:bg-[#F7E644]/[0.04]',
      hoverBorder: 'hover:border-[#F7E644]/20',
      hoverArrow: 'group-hover:text-[#F7E644]',
      glow: '',
    },
    {
      href: 'tel:+31637404577',
      external: false,
      icon: <Phone size={24} />,
      iconBg: 'border border-[#00A3E0]/20 bg-[#00A3E0]/[0.05]',
      iconText: 'text-[#00A3E0]',
      title: 'Bellen',
      subtitle: '+31 6 37 40 45 77',
      subtitleColor: 'text-white/30',
      borderColor: 'border-white/[0.06]',
      bgColor: 'bg-white/[0.02]',
      hoverBg: 'hover:bg-[#00A3E0]/[0.04]',
      hoverBorder: 'hover:border-[#00A3E0]/20',
      hoverArrow: 'group-hover:text-[#00A3E0]',
      glow: '',
    },
    {
      href: '#',
      external: false,
      icon: <Calendar size={24} />,
      iconBg: 'border border-[#F62961]/20 bg-[#F62961]/[0.05]',
      iconText: 'text-[#F62961]',
      title: 'Plan een gesprek',
      subtitle: 'Gratis kennismakingsgesprek — 30 min',
      subtitleColor: 'text-white/30',
      borderColor: 'border-white/[0.06]',
      bgColor: 'bg-white/[0.02]',
      hoverBg: 'hover:bg-[#F62961]/[0.04]',
      hoverBorder: 'hover:border-[#F62961]/20',
      hoverArrow: 'group-hover:text-[#F62961]',
      glow: '',
      onClick: handleClose,
    },
  ];

  const processSteps = [
    { step: '01', icon: <MessageCircle size={22} />, title: 'Eerste Contact', desc: 'Neem vrijblijvend contact op. We reageren altijd binnen 1 uur op WhatsApp en dezelfde dag per e-mail.', color: '#25D366', status: 'LIVE' },
    { step: '02', icon: <Users size={22} />, title: 'Kennismaken', desc: 'Gratis intake van 30 minuten. We bespreken je doelen, ambities en hoe we daar samen komen.', color: '#00A3E0', status: 'DISCOVER' },
    { step: '03', icon: <Send size={22} />, title: 'Voorstel op maat', desc: 'Transparant voorstel met scope, tijdlijn en investering. Geen kleine lettertjes of verborgen kosten.', color: '#F7E644', status: 'PROPOSE' },
    { step: '04', icon: <Rocket size={22} />, title: 'Aan de slag', desc: 'Na akkoord starten we direct. Vast aanspreekpunt, wekelijkse updates en een transparant proces.', color: '#F62961', status: 'LAUNCH' },
  ];

  const services = [
    { icon: <Code2 size={20} />, title: 'AI Websites & Apps', desc: 'Next-gen websites en applicaties gebouwd met AI als fundament.', color: '#00A3E0' },
    { icon: <Layers size={20} />, title: 'Branding & Identiteit', desc: 'Visuele identiteiten die resoneren en je merk onvergetelijk maken.', color: '#F62961' },
    { icon: <Target size={20} />, title: 'Marketing & Strategie', desc: 'Data-gedreven campagnes die converteren en je bereik maximaliseren.', color: '#25D366' },
    { icon: <Cpu size={20} />, title: 'AI Automation', desc: 'Slimme workflows en automatisering die je bedrijf efficiënter maken.', color: '#F7E644' },
    { icon: <BarChart3 size={20} />, title: 'Growth & Performance', desc: 'Van SEO tot performance marketing — meetbare groei als doel.', color: '#00A3E0' },
    { icon: <Briefcase size={20} />, title: 'Consultancy', desc: 'Strategisch advies over digitale transformatie en AI-implementatie.', color: '#F62961' },
  ];

  const whyUsItems = [
    { icon: <Zap size={22} />, title: 'Razendsnelle oplevering', desc: 'Dankzij AI-workflows leveren wij projecten tot 3x sneller op dan traditionele bureaus.', color: '#F7E644' },
    { icon: <Shield size={22} />, title: 'Transparante prijzen', desc: 'Geen verborgen kosten. Je weet exact waar je aan toe bent voordat we starten.', color: '#25D366' },
    { icon: <Globe size={22} />, title: 'Altijd bereikbaar', desc: 'WhatsApp reactie binnen 1 uur. Persoonlijk contact, geen helpdesk of ticketsysteem.', color: '#00A3E0' },
    { icon: <Award size={22} />, title: 'Bewezen resultaten', desc: '50+ succesvolle projecten. Van startup tot enterprise — altijd top kwaliteit.', color: '#F62961' },
    { icon: <HeartHandshake size={22} />, title: 'Persoonlijke aanpak', desc: 'Geen account managers. Direct contact met de founder voor maximale betrokkenheid.', color: '#25D366' },
    { icon: <MousePointerClick size={22} />, title: 'AI-first aanpak', desc: 'We zetten AI in als versneller — sneller, slimmer en voordeliger zonder kwaliteitsverlies.', color: '#F7E644' },
  ];

  const faqs = [
    { q: 'Wat kost een website bij SocialNow?', a: 'Onze projecten starten vanaf €1.500 voor een one-pager. De exacte investering hangt af van de scope en complexiteit. We maken altijd een transparant voorstel op maat — geen verrassingen achteraf.' },
    { q: 'Hoe lang duurt een gemiddeld project?', a: 'Een standaard website is binnen 2-4 weken live. Complexere projecten met maatwerk functionaliteit duren 4-8 weken. Dankzij onze AI-workflows zijn we aanzienlijk sneller dan traditionele bureaus.' },
    { q: 'Gebruiken jullie AI in het ontwikkelproces?', a: 'Ja, absoluut. Wij zetten AI in als krachtige versneller — niet als vervanging voor creativiteit. Dit betekent sneller bouwen, slimmer itereren en voordeliger opleveren zonder in te leveren op kwaliteit.' },
    { q: 'Kan ik de website zelf beheren na oplevering?', a: 'Uiteraard. We bouwen met gebruiksvriendelijke systemen en voorzien je van een uitgebreide handleiding. Plus: je krijgt 30 dagen gratis support na oplevering.' },
    { q: 'Wat maakt SocialNow anders dan andere bureaus?', a: 'Drie dingen: directe communicatie met de founder, een AI-first werkwijze die alles versnelt, en een obsessie voor kwaliteit en detail. We denken mee als partner, niet als leverancier.' },
    { q: 'Werken jullie ook met bedrijven buiten Amsterdam?', a: 'Absoluut. Wij werken volledig remote-ready. Of je nu in Amsterdam, Rotterdam of Antwerpen zit — we werken net zo efficiënt samen via video calls en WhatsApp.' },
  ];

  return (
    <div data-lenis-prevent className={`fixed inset-0 z-[200] bg-[#030303] overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isClosing ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
    }`}>

      {/* Background — subtle animated map texture (desktop only — heavy filter + image) */}
      <div className="hidden md:block fixed inset-0 z-0 pointer-events-none opacity-10 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full md:w-[200%] md:h-[200%] md:-left-1/2 md:-top-1/2 md:animate-[slow-map-move_120s_linear_infinite]"
          style={{
            backgroundImage: `url('https://i.ibb.co/LdtFKCpG/BG-Social-Now-Scherm.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(1) contrast(1.2) invert(1)',
            mixBlendMode: 'screen'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#030303]/60 to-[#030303]" />
      </div>

      {/* Ambient glow accents — desktop only (GPU-heavy blur) */}
      <div className="hidden md:block fixed top-0 right-0 w-[700px] h-[700px] bg-[#25D366]/[0.03] rounded-full blur-[250px] pointer-events-none z-0" />
      <div className="hidden md:block fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#00A3E0]/[0.025] rounded-full blur-[250px] pointer-events-none z-0" />
      <div className="hidden md:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F62961]/[0.015] rounded-full blur-[300px] pointer-events-none z-0" />

      {/* ─── STICKY HEADER ─── */}
      <div className="sticky top-0 z-[210] w-full px-5 py-4 md:px-10 md:py-5 flex items-center justify-between md:backdrop-blur-2xl border-b border-white/[0.05] bg-[#030303]/95 md:bg-[#030303]/85">
        <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="SocialNow" className="w-24 md:w-32 opacity-80" />
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/31637404577"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#25D366] text-black font-black uppercase text-[10px] tracking-[0.15em] hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] transition-all duration-300"
          >
            <MessageCircle size={14} strokeWidth={2.5} />
            Direct contact
          </a>
          <button
            onClick={handleClose}
            aria-label="Sluiten"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-[#F62961] hover:border-[#F62961] transition-all group"
          >
            <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="relative z-10 container mx-auto max-w-6xl px-5 md:px-8 pt-12 md:pt-20 pb-20">

        {/* ═══════════════════════════════════════════ */}
        {/* ─── HERO SECTION ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={heroReveal.ref} className={`mb-16 md:mb-24 relative transition-all duration-1000 ${heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#25D366]/20 bg-[#25D366]/[0.04] mb-8">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </div>
            <span className="text-[#25D366] text-[10px] font-black uppercase tracking-[0.3em]">Direct beschikbaar voor Q1 2026</span>
          </div>

          <h1 className="text-[2.5rem] md:text-6xl lg:text-[5.5rem] font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
            Laten we<br />
            <span className="text-[#25D366]">samenwerken</span>.
          </h1>

          <p className="text-white/40 text-sm md:text-lg font-medium max-w-2xl leading-relaxed mb-10">
            Van het eerste idee tot een succesvolle lancering — wij zijn je creatieve en technische partner.
            Neem contact op en ontdek hoe we jouw ambities kunnen realiseren.
          </p>

          {/* Quick action row */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#25D366] text-black font-black uppercase text-[11px] tracking-[0.1em] hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(37,211,102,0.35)] transition-all duration-300"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              Start een gesprek
            </a>
            <a
              href="mailto:info@socialnow.nl"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/10 bg-white/[0.03] text-white font-bold uppercase text-[11px] tracking-[0.1em] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
            >
              <Mail size={16} />
              Stuur een e-mail
            </a>
          </div>

          {/* Decorative line */}
          <div className="absolute -right-8 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden lg:block" />
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── STATS BAR ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={statsReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${statsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Afgeronde projecten', end: 50, suffix: '+', color: '#25D366' },
              { label: 'Tevreden klanten', end: 40, suffix: '+', color: '#00A3E0' },
              { label: 'Jaar ervaring', end: 8, suffix: '+', color: '#F7E644' },
              { label: 'Max. reactietijd', end: 1, suffix: ' uur', prefix: '<', color: '#F62961' },
            ].map((stat, i) => (
              <div key={i} className="p-5 md:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center relative overflow-hidden group hover:border-white/[0.1] transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at center, ${stat.color}06, transparent 70%)` }} />
                <h4 className="text-2xl md:text-4xl font-black tracking-tighter mb-1 relative" style={{ color: stat.color }}>
                  <AnimCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} start={statsReveal.visible} />
                </h4>
                <span className="text-white/20 uppercase font-bold tracking-[0.2em] text-[8px] md:text-[9px] relative block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── CONTACT CHANNELS + INFO GRID ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={channelsReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${channelsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Neem contact op</h3>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              Kies jouw <span className="text-[#00A3E0]">kanaal</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

            {/* Left column: Contact channels (2 cols wide) */}
            <div className="lg:col-span-2 space-y-3">
              {contactChannels.map((ch, i) => (
                <a
                  key={i}
                  href={ch.href}
                  target={ch.external ? '_blank' : undefined}
                  rel={ch.external ? 'noopener noreferrer' : undefined}
                  onClick={ch.onClick ? (e) => { e.preventDefault(); ch.onClick?.(); } : undefined}
                  className={`group flex items-center justify-between p-5 md:p-7 rounded-2xl border ${ch.borderColor} ${ch.bgColor} ${ch.hoverBg} ${ch.hoverBorder || ''} ${ch.glow || ''} transition-all duration-500 relative overflow-hidden`}
                >
                  {ch.badge && (
                    <div className={`absolute top-3 right-3 md:top-4 md:right-4 ${ch.badgeBg} ${ch.badgeText} text-[7px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full`}>
                      {ch.badge}
                    </div>
                  )}
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className={`w-12 h-12 rounded-xl ${ch.iconBg} ${ch.iconText} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                      {ch.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-black uppercase text-base md:text-lg tracking-tight leading-none mb-1">{ch.title}</h3>
                      <p className={`${ch.subtitleColor} text-[10px] font-bold uppercase tracking-[0.2em]`}>{ch.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className={`text-white/15 ${ch.hoverArrow} group-hover:translate-x-1 transition-all flex-shrink-0`} />
                </a>
              ))}
            </div>

            {/* Right column: Info cards */}
            <div className="space-y-3">

              {/* Founder Card */}
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#25D366]/[0.04] rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#25D366]/30 shadow-lg flex-shrink-0 relative">
                    <img src="https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp" alt="Marinus Bergsma" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-[#030303]" />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm tracking-tight leading-none mb-1">Marinus Bergsma</h4>
                    <p className="text-[#25D366] text-[8px] font-black uppercase tracking-[0.2em]">Founder & Creative Director</p>
                  </div>
                </div>
                <p className="text-white/30 text-[12px] font-medium leading-relaxed italic mb-3">
                  "Ik geloof in directe communicatie. Geen formulieren of wachtrijen — stuur me een bericht en ik antwoord persoonlijk."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="text-[#25D366]/50 text-[8px] font-bold uppercase tracking-[0.15em]">Online — reageert binnen 1 uur</span>
                </div>
              </div>

              {/* Vestiging */}
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={14} className="text-white/20" />
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Vestiging</h4>
                </div>
                <p className="text-white font-bold text-sm leading-relaxed mb-0.5">Amstelstraat 43G</p>
                <p className="text-white font-bold text-sm leading-relaxed mb-0.5">1017DA Amsterdam</p>
                <p className="text-white/35 text-sm font-medium mb-3">Nederland</p>
                <a
                  href="https://maps.google.com/?q=Amstelstraat+43G+Amsterdam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/25 text-[9px] font-bold uppercase tracking-[0.15em] hover:text-white/50 transition-colors"
                >
                  Bekijk op kaart <ArrowUpRight size={10} />
                </a>
              </div>

              {/* Bereikbaarheid */}
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={14} className="text-white/20" />
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Bereikbaarheid</h4>
                </div>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-white/35 font-medium">Ma — Vr</span>
                    <span className="text-white font-bold">09:00 — 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/35 font-medium">Zaterdag</span>
                    <span className="text-white/60 font-bold">Op afspraak</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/35 font-medium">Zondag</span>
                    <span className="text-white/25 font-medium">Gesloten</span>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Volg ons</h4>
                <div className="flex gap-2">
                  <a href="https://www.instagram.com/socialnow.nl/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all text-[9px] font-bold uppercase tracking-widest">
                    <Instagram size={14} /> Instagram
                  </a>
                  <a href="https://www.linkedin.com/company/socialnow-nl/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/30 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all text-[9px] font-bold uppercase tracking-widest">
                    <Linkedin size={14} /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── DIENSTEN OVERZICHT ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={servicesReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${servicesReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Wat we doen</h3>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              Onze <span className="text-[#F62961]">expertise</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((service, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at top left, ${service.color}06, transparent 60%)` }} />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 border border-white/[0.06] group-hover:border-transparent" style={{ backgroundColor: `${service.color}10`, color: service.color }}>
                    {service.icon}
                  </div>
                  <h4 className="text-white font-black text-sm tracking-tight mb-2">{service.title}</h4>
                  <p className="text-white/25 text-[12px] font-medium leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── WERKWIJZE / PROCESS ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={processReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${processReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Werkwijze</h3>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              Van eerste contact<br />tot <span className="text-[#25D366]">lancering</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {processSteps.map((item, i) => (
              <div key={item.step} className="relative p-6 md:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] group hover:border-white/[0.1] transition-all duration-500 overflow-hidden">
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${item.color}30, transparent)` }} />

                {/* Step number watermark */}
                <div className="absolute -bottom-3 -right-2 text-[5rem] font-black text-white/[0.02] pointer-events-none select-none leading-none">{item.step}</div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500" style={{ backgroundColor: `${item.color}12`, color: item.color }}>
                      {item.icon}
                    </div>
                    <span className="text-[8px] font-mono font-bold tracking-[0.3em] uppercase px-2 py-0.5 rounded-full border" style={{ color: `${item.color}80`, borderColor: `${item.color}20`, backgroundColor: `${item.color}08` }}>
                      {item.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-black tracking-[0.3em] mb-2 block" style={{ color: item.color }}>{item.step}</span>
                  <h4 className="text-white font-black uppercase text-sm tracking-tight mb-2.5">{item.title}</h4>
                  <p className="text-white/25 text-[12px] font-medium leading-relaxed">{item.desc}</p>
                </div>

                {/* Step connector (desktop) */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 z-20">
                    <ChevronRight size={14} className="text-white/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── WAAROM SOCIALNOW ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={whyReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${whyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Waarom wij</h3>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              Geen excuses,<br />alleen <span className="text-[#00A3E0]">resultaat</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {whyUsItems.map((item, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at top left, ${item.color}06, transparent 60%)` }} />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                    {item.icon}
                  </div>
                  <h4 className="text-white font-black text-sm tracking-tight mb-2">{item.title}</h4>
                  <p className="text-white/25 text-[12px] font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── PERSOONLIJKE TOUCH / TEAM SECTION ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={teamReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${teamReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/[0.02] via-transparent to-[#00A3E0]/[0.02] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 md:h-auto md:min-h-[440px] overflow-hidden">
                <img
                  src="https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp"
                  alt="Marinus Bergsma — Founder SocialNow"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/90 via-[#030303]/30 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#030303]" />

                {/* Name overlay on mobile */}
                <div className="absolute bottom-4 left-5 md:hidden">
                  <h3 className="text-white font-black text-lg">Marinus Bergsma</h3>
                  <p className="text-[#25D366] text-[9px] font-black uppercase tracking-[0.2em]">Founder & Creative Director</p>
                </div>
              </div>

              {/* Text */}
              <div className="p-7 md:p-10 lg:p-14 flex flex-col justify-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#25D366]/20 bg-[#25D366]/[0.04] text-[#25D366] text-[8px] font-black uppercase tracking-[0.15em] mb-6 w-fit">
                  <CheckCircle2 size={10} />
                  Persoonlijk & Direct
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-5">
                  Jouw project,<br />mijn missie.
                </h3>

                <p className="text-white/30 text-[13px] font-medium leading-relaxed mb-6">
                  Als founder van SocialNow ben ik persoonlijk betrokken bij elk project.
                  Geen account managers of tussenpersonen — je communiceert altijd direct met mij.
                  Dat betekent snelle beslissingen, heldere communicatie en een partner die net zo veel om jouw project geeft als jij.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    'Direct contact via WhatsApp — altijd binnen 1 uur',
                    'Persoonlijke betrokkenheid van A tot Z',
                    'Transparant over voortgang, kosten en resultaten',
                    '8+ jaar ervaring in design, development en AI',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={14} className="text-[#25D366] flex-shrink-0 mt-0.5" />
                      <span className="text-white/40 text-[12px] font-medium leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://wa.me/31637404577"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#25D366] text-black font-black uppercase text-[10px] tracking-[0.1em] hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(37,211,102,0.35)] transition-all duration-300 w-fit"
                >
                  <MessageCircle size={14} strokeWidth={2.5} />
                  Stuur mij een bericht
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── TRUST MARQUEE ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-16 md:mb-24">
          <div className="border-y border-white/[0.04] py-2">
            <TrustMarquee />
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── FAQ SECTION ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={faqReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${faqReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
            {/* Left: heading */}
            <div className="lg:col-span-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">FAQ</h3>
              <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-4">
                Veelgestelde<br /><span className="text-[#F7E644]">vragen</span>
              </h2>
              <p className="text-white/30 text-[13px] font-medium leading-relaxed max-w-sm">
                Alles wat je wilt weten over samenwerken met SocialNow. Staat je vraag er niet bij? Neem gerust contact op.
              </p>
            </div>

            {/* Right: FAQ accordion */}
            <div className="lg:col-span-3 space-y-2.5">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── CTA SECTION ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div ref={ctaReveal.ref} className={`mb-16 md:mb-24 transition-all duration-1000 ${ctaReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="rounded-3xl border border-[#25D366]/15 bg-[#25D366]/[0.02] p-8 md:p-14 lg:p-16 relative overflow-hidden">
            {/* Glows */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/[0.04] via-transparent to-[#25D366]/[0.02] pointer-events-none" />
            <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#25D366]/[0.06] rounded-full blur-[150px] pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-5">
                  Klaar om te<br /><span className="text-[#25D366]">starten</span>?
                </h2>
                <p className="text-white/35 text-sm md:text-[15px] font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Stuur een bericht en we plannen binnen 24 uur een gratis kennismakingsgesprek.
                  Geen verplichtingen, gewoon een goed gesprek over jouw ambities.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a
                  href="https://wa.me/31637404577"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-black font-black uppercase text-xs tracking-[0.1em] hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(37,211,102,0.4)] transition-all duration-300"
                >
                  <MessageCircle size={18} strokeWidth={2.5} />
                  WhatsApp ons
                </a>
                <a
                  href="tel:+31637404577"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] text-white font-bold uppercase text-xs tracking-[0.1em] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
                >
                  <Phone size={18} />
                  Bel direct
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════ */}
        {/* ─── BOTTOM BAR ─── */}
        {/* ═══════════════════════════════════════════ */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
            <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="SocialNow" className="w-24 opacity-30" />
            <span className="text-white/10 text-[9px] font-bold uppercase tracking-[0.15em]">
              © {new Date().getFullYear()} SocialNow — All Rights Reserved
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/10 text-[9px] font-bold uppercase tracking-[0.15em] hover:text-white/30 transition-colors"
            >
              Algemene Voorwaarden
            </a>
            <span className="text-white/[0.06]">|</span>
            <span className="text-white/10 text-[9px] font-bold uppercase tracking-[0.15em]">KVK 90877179</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slow-map-move {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(-25px, -25px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
