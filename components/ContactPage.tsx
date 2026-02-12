
import React, { useEffect, useState, useRef } from 'react';
import {
  X, Mail, Phone, MessageCircle, MapPin,
  ArrowRight, ArrowUpRight, Clock, Calendar,
  Instagram, Linkedin, Sparkles, Zap, Shield,
  Globe, Users, Rocket, Star, CheckCircle2,
  Send, ChevronRight
} from 'lucide-react';

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Animated Counter ─── */
const AnimCounter: React.FC<{ end: number; suffix?: string; start: boolean }> = ({ end, suffix = '', start }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / 1800, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * end));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end]);
  return <span>{val}{suffix}</span>;
};

/* ─── Scroll Reveal Hook ─── */
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: '50px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const ContactPage: React.FC<ContactPageProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const statsReveal = useScrollReveal();
  const processReveal = useScrollReveal();
  const whyReveal = useScrollReveal();
  const teamReveal = useScrollReveal();
  const faqReveal = useScrollReveal();

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
    setTimeout(() => {
      onClose();
    }, 600);
  };

  if (!isOpen && !isClosing) return null;

  const contactChannels = [
    {
      href: 'https://wa.me/31637404577',
      external: true,
      icon: <MessageCircle size={22} />,
      iconBg: 'bg-[#25D366]',
      iconText: 'text-black',
      title: 'WhatsApp',
      subtitle: 'Snelste reactie — Direct antwoord',
      subtitleColor: 'text-[#25D366]/60',
      borderColor: 'border-[#25D366]/20',
      bgColor: 'bg-[#25D366]/[0.03]',
      hoverBg: 'hover:bg-[#25D366]/[0.08]',
      hoverArrow: 'group-hover:text-[#25D366]',
      badge: 'AANBEVOLEN',
      badgeBg: 'bg-[#25D366]',
      badgeText: 'text-black',
    },
    {
      href: 'mailto:info@socialnow.nl',
      external: false,
      icon: <Mail size={22} />,
      iconBg: 'border border-[#F7E644]/20 bg-[#F7E644]/[0.05]',
      iconText: 'text-[#F7E644]',
      title: 'E-mail',
      subtitle: 'info@socialnow.nl',
      subtitleColor: 'text-white/30',
      borderColor: 'border-white/[0.06]',
      bgColor: 'bg-white/[0.02]',
      hoverBg: 'hover:bg-[#F7E644]/[0.05]',
      hoverArrow: 'group-hover:text-[#F7E644]',
    },
    {
      href: 'tel:+31637404577',
      external: false,
      icon: <Phone size={22} />,
      iconBg: 'border border-[#0071BC]/20 bg-[#0071BC]/[0.05]',
      iconText: 'text-[#0071BC]',
      title: 'Bellen',
      subtitle: '+31 6 37 40 45 77',
      subtitleColor: 'text-white/30',
      borderColor: 'border-white/[0.06]',
      bgColor: 'bg-white/[0.02]',
      hoverBg: 'hover:bg-[#0071BC]/[0.05]',
      hoverArrow: 'group-hover:text-[#0071BC]',
    },
  ];

  const processSteps = [
    {
      step: '01',
      icon: <MessageCircle size={20} />,
      title: 'Contact',
      desc: 'Neem vrijblijvend contact op via WhatsApp, e-mail of telefoon. We reageren altijd binnen 1 uur.',
      color: '#25D366',
    },
    {
      step: '02',
      icon: <Users size={20} />,
      title: 'Kennismaken',
      desc: 'In een gratis gesprek bespreken we jouw doelen, uitdagingen en ambities. Wij luisteren en stellen de juiste vragen.',
      color: '#5BA4F5',
    },
    {
      step: '03',
      icon: <Send size={20} />,
      title: 'Voorstel op maat',
      desc: 'Je ontvangt een helder voorstel inclusief scope, tijdlijn en investering. Geen verborgen kosten, geen verrassingen.',
      color: '#F7E644',
    },
    {
      step: '04',
      icon: <Rocket size={20} />,
      title: 'Aan de slag',
      desc: 'Na akkoord starten we direct. Vast aanspreekpunt, wekelijkse updates en een transparant proces van A tot Z.',
      color: '#F62961',
    },
  ];

  const whyUsItems = [
    {
      icon: <Zap size={20} />,
      title: 'Razendsnelle oplevering',
      desc: 'Dankzij AI-workflows leveren wij projecten 3x sneller op dan traditionele bureaus.',
    },
    {
      icon: <Shield size={20} />,
      title: 'Transparante prijzen',
      desc: 'Geen verborgen kosten. Je weet exact waar je aan toe bent voordat we beginnen.',
    },
    {
      icon: <Globe size={20} />,
      title: 'Altijd bereikbaar',
      desc: 'WhatsApp reactie binnen 1 uur. Persoonlijk contact, geen helpdesk of wachtlijst.',
    },
    {
      icon: <Star size={20} />,
      title: 'Bewezen resultaten',
      desc: '50+ tevreden klanten. Van startup tot enterprise — wij leveren altijd kwaliteit.',
    },
  ];

  const faqs = [
    {
      q: 'Wat kost een website bij SocialNow?',
      a: 'Onze projecten starten vanaf €1.500. De exacte investering hangt af van de scope en complexiteit. We maken altijd een transparant voorstel op maat.',
    },
    {
      q: 'Hoe lang duurt een gemiddeld project?',
      a: 'Een standaard website is binnen 2-4 weken live. Complexere projecten met maatwerk functionaliteit kunnen 4-8 weken duren.',
    },
    {
      q: 'Gebruiken jullie AI in het ontwikkelproces?',
      a: 'Ja! Wij zetten AI in als versneller — niet als vervanging. Hierdoor bouwen we sneller, slimmer en voordeliger zonder in te leveren op kwaliteit.',
    },
    {
      q: 'Kan ik de website zelf beheren na oplevering?',
      a: 'Absoluut. We bouwen met gebruiksvriendelijke systemen en bieden een uitgebreide handleiding en support na oplevering.',
    },
  ];

  return (
    <div className={`fixed inset-0 z-[200] bg-black overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>

      {/* Background — animated map texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </div>

      {/* Glow accents */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#25D366]/[0.04] rounded-full blur-[200px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#5BA4F5]/[0.03] rounded-full blur-[200px] pointer-events-none z-0" />

      {/* Top bar */}
      <div className="sticky top-0 z-[210] w-full px-6 py-5 md:px-12 md:py-6 flex items-center justify-between backdrop-blur-2xl border-b border-white/[0.06] bg-black/80">
        <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="Logo" className="w-28 md:w-36" />
        <button
          onClick={handleClose}
          aria-label="Sluiten"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-[#F62961] transition-all group"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-24">

        {/* ─── HERO SECTION ─── */}
        <div className="mb-20 md:mb-28 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#25D366]/20 bg-[#25D366]/[0.05] text-[#25D366] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Sparkles size={12} />
            Direct beschikbaar
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-[5.5rem] font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
            Laten we iets<br />
            <span className="text-[#25D366]">uitzonderlijks</span><br />
            bouwen.
          </h1>
          <p className="text-white/40 text-sm md:text-lg font-medium max-w-xl leading-relaxed mb-10">
            Van idee tot lancering — wij zijn je creatieve en technische partner.
            Neem contact op en ontdek wat we voor jou kunnen betekenen.
          </p>

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#25D366] text-black font-black uppercase text-xs tracking-widest hover:scale-105 hover:shadow-[0_0_40px_rgba(37,211,102,0.4)] transition-all duration-300"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              Start gesprek
            </a>
            <a
              href="mailto:info@socialnow.nl"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/10 bg-white/[0.03] text-white font-bold uppercase text-xs tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
            >
              <Mail size={16} />
              Stuur een mail
            </a>
          </div>
        </div>


        {/* ─── MAIN GRID: Contact + Info ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-20 md:mb-28">

          {/* Left column: Contact kanalen (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 pl-1">
              Contactkanalen
            </h3>

            {contactChannels.map((ch, i) => (
              <a
                key={i}
                href={ch.href}
                target={ch.external ? '_blank' : undefined}
                rel={ch.external ? 'noopener noreferrer' : undefined}
                className={`group flex items-center justify-between p-6 md:p-8 rounded-2xl border ${ch.borderColor} ${ch.bgColor} ${ch.hoverBg} transition-all duration-500 relative overflow-hidden`}
              >
                {ch.badge && (
                  <div className={`absolute top-3 right-3 ${ch.badgeBg} ${ch.badgeText} text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full`}>
                    {ch.badge}
                  </div>
                )}
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl ${ch.iconBg} ${ch.iconText} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    {ch.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase text-lg md:text-xl tracking-tight">{ch.title}</h3>
                    <p className={`${ch.subtitleColor} text-[10px] font-bold uppercase tracking-[0.3em]`}>{ch.subtitle}</p>
                  </div>
                </div>
                <ArrowRight size={20} className={`text-white/20 ${ch.hoverArrow} group-hover:translate-x-1 transition-all flex-shrink-0`} />
              </a>
            ))}

            {/* Plan een gesprek */}
            <div
              className="group flex items-center justify-between p-6 md:p-8 rounded-2xl border border-[#F62961]/20 bg-[#F62961]/[0.03] hover:bg-[#F62961]/[0.08] transition-all duration-500 cursor-pointer relative overflow-hidden"
              onClick={handleClose}
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl border border-[#F62961]/20 bg-[#F62961]/[0.08] text-[#F62961] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-lg md:text-xl tracking-tight">Plan een gesprek</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Gratis kennismakingsgesprek</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/20 group-hover:text-[#F62961] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </div>

          {/* Right column: Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">

            {/* Founder Card */}
            <div className="p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/[0.05] rounded-full blur-[80px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#25D366]/30 shadow-lg flex-shrink-0">
                  <img src="https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp" alt="Marinus Bergsma" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <h4 className="text-white font-black text-sm tracking-tight">Marinus Bergsma</h4>
                  <p className="text-[#25D366] text-[9px] font-black uppercase tracking-[0.2em]">Founder & Creative Director</p>
                </div>
              </div>
              <p className="text-white/35 text-xs font-medium leading-relaxed mb-4">
                "Ik geloof in directe communicatie. Geen formulieren of wachtrijen — stuur me een bericht en ik antwoord persoonlijk."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-[#25D366]/60 text-[9px] font-bold uppercase tracking-[0.2em]">Online — reageert binnen 1 uur</span>
              </div>
            </div>

            {/* Vestiging */}
            <div className="p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <MapPin size={18} className="text-white/25 mb-4" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-4">Vestiging</h4>
              <p className="text-white font-bold text-sm leading-relaxed mb-1">Amstelstraat 43G</p>
              <p className="text-white font-bold text-sm leading-relaxed mb-1">1017DA Amsterdam</p>
              <p className="text-white/40 text-sm font-medium">Nederland</p>
              <a
                href="https://maps.google.com/?q=Amstelstraat+43G+Amsterdam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
              >
                Bekijk op kaart
                <ArrowUpRight size={12} />
              </a>
            </div>

            {/* Bereikbaarheid */}
            <div className="p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <Clock size={18} className="text-white/25 mb-4" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-4">Bereikbaarheid</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/40 text-xs font-medium">Maandag - Vrijdag</span>
                  <span className="text-white text-xs font-bold">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-xs font-medium">Zaterdag</span>
                  <span className="text-white text-xs font-bold">Op afspraak</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-xs font-medium">Zondag</span>
                  <span className="text-white/30 text-xs font-medium">Gesloten</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em]">
                  WhatsApp reactie binnen 1 uur
                </p>
              </div>
            </div>

            {/* Social */}
            <div className="p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-4">Volg ons</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/socialnow.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-white/20 transition-all"
                >
                  <Instagram size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Instagram</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/socialnow-nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-white/20 transition-all"
                >
                  <Linkedin size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* ─── STATS BAR ─── */}
        <div ref={statsReveal.ref} className={`mb-20 md:mb-28 transition-all duration-1000 ${statsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Projecten', end: 50, suffix: '+', color: '#25D366' },
              { label: 'Tevreden klanten', end: 40, suffix: '+', color: '#5BA4F5' },
              { label: 'Jaar ervaring', end: 8, suffix: '+', color: '#F7E644' },
              { label: 'Reactietijd', end: 1, suffix: ' uur', color: '#F62961' },
            ].map((stat, i) => (
              <div key={i} className="p-5 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center relative overflow-hidden group hover:border-white/[0.12] transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at center, ${stat.color}08, transparent 70%)` }} />
                <h4 className="text-3xl md:text-5xl font-black tracking-tighter mb-1 relative" style={{ color: stat.color }}>
                  <AnimCounter end={stat.end} suffix={stat.suffix} start={statsReveal.visible} />
                </h4>
                <span className="text-white/25 uppercase font-bold tracking-[0.25em] text-[8px] md:text-[10px] relative">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>


        {/* ─── PROCESS SECTION ─── */}
        <div ref={processReveal.ref} className={`mb-20 md:mb-28 transition-all duration-1000 delay-100 ${processReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Werkwijze</h3>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              Van eerste contact<br />
              tot <span className="text-[#25D366]">lancering</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((item, i) => (
              <div key={item.step} className="relative p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] group hover:border-white/[0.12] transition-all duration-500">
                {/* Step connector line (desktop only) */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 border-t border-dashed border-white/10 z-20" />
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-500" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] mb-3 block" style={{ color: item.color }}>{item.step}</span>
                <h4 className="text-white font-black uppercase text-base tracking-tight mb-3">{item.title}</h4>
                <p className="text-white/30 text-xs font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>


        {/* ─── WHY SOCIALNOW ─── */}
        <div ref={whyReveal.ref} className={`mb-20 md:mb-28 transition-all duration-1000 delay-200 ${whyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: heading */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Waarom SocialNow</h3>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-6">
                Geen excuses,<br />
                alleen <span className="text-[#5BA4F5]">resultaat</span>.
              </h2>
              <p className="text-white/35 text-sm font-medium leading-relaxed max-w-md">
                Wij zijn geen doorsnee bureau. Met de kracht van AI en een obsessie voor kwaliteit bouwen we merken die opvallen.
              </p>
            </div>

            {/* Right: USP grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUsItems.map((item, i) => (
                <div key={i} className="p-5 md:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] group hover:border-white/[0.12] transition-all duration-500">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.05] text-white/40 flex items-center justify-center mb-4 group-hover:text-[#25D366] group-hover:bg-[#25D366]/10 transition-all duration-500">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-black text-sm tracking-tight mb-2">{item.title}</h4>
                  <p className="text-white/25 text-[11px] font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ─── TEAM / PERSONAL TOUCH ─── */}
        <div ref={teamReveal.ref} className={`mb-20 md:mb-28 transition-all duration-1000 delay-100 ${teamReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/[0.03] via-transparent to-[#5BA4F5]/[0.03] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative h-64 md:h-auto md:min-h-[400px] overflow-hidden">
                <img
                  src="https://i.ibb.co/Z65DDRMG/Marinus-Bergsma-V2.webp"
                  alt="Marinus Bergsma — Founder SocialNow"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/90" />
              </div>

              {/* Text side */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#25D366]/20 bg-[#25D366]/[0.05] text-[#25D366] text-[9px] font-black uppercase tracking-[0.2em] mb-6 w-fit">
                  <CheckCircle2 size={10} />
                  Persoonlijk & Direct
                </div>

                <h3 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-6">
                  Jouw project,<br />mijn missie.
                </h3>

                <p className="text-white/35 text-sm font-medium leading-relaxed mb-6">
                  Als founder van SocialNow ben ik persoonlijk betrokken bij elk project.
                  Geen account managers of tussenpersonen — je communiceert altijd direct met mij.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    'Direct contact via WhatsApp',
                    'Persoonlijke betrokkenheid van A-Z',
                    'Transparant over voortgang en kosten',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-[#25D366] flex-shrink-0" />
                      <span className="text-white/50 text-xs font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://wa.me/31637404577"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#25D366] text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all duration-300 w-fit"
                >
                  <MessageCircle size={14} strokeWidth={2.5} />
                  Stuur mij een bericht
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* ─── FAQ SECTION ─── */}
        <div ref={faqReveal.ref} className={`mb-20 md:mb-28 transition-all duration-1000 delay-100 ${faqReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Veelgestelde vragen</h3>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-[0.9]">
              Alle antwoorden<br />
              op één <span className="text-[#F7E644]">plek</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] group hover:border-white/[0.12] transition-all duration-500">
                <h4 className="text-white font-black text-sm md:text-base tracking-tight mb-3 flex items-start gap-3">
                  <ChevronRight size={16} className="text-[#F7E644] mt-0.5 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-white/30 text-xs md:text-sm font-medium leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>


        {/* ─── CTA SECTION ─── */}
        <div className="mb-20 md:mb-28">
          <div className="rounded-3xl border border-[#25D366]/20 bg-[#25D366]/[0.03] p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/[0.05] via-transparent to-[#25D366]/[0.02] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#25D366]/[0.08] rounded-full blur-[150px] pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
                Klaar om te<br /><span className="text-[#25D366]">starten</span>?
              </h2>
              <p className="text-white/40 text-sm md:text-base font-medium max-w-lg mx-auto mb-10 leading-relaxed">
                Stuur een bericht en we plannen binnen 24 uur een gratis kennismakingsgesprek.
                Geen verplichtingen, gewoon een goed gesprek.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://wa.me/31637404577"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-black font-black uppercase text-xs tracking-widest hover:scale-105 hover:shadow-[0_0_50px_rgba(37,211,102,0.5)] transition-all duration-300"
                >
                  <MessageCircle size={18} strokeWidth={2.5} />
                  WhatsApp ons
                </a>
                <a
                  href="tel:+31637404577"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] text-white font-bold uppercase text-xs tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                >
                  <Phone size={18} />
                  Bel direct
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* ─── BOTTOM BAR ─── */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <p className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
              KVK 90877179 &mdash; Amsterdam, Nederland
            </p>
            <span className="hidden md:inline text-white/10">|</span>
            <p className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} SocialNow
            </p>
          </div>
          <a
            href="https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white/40 transition-colors"
          >
            Algemene Voorwaarden
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slow-map-move {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-30px, -30px); }
          100% { transform: scale(1) translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
