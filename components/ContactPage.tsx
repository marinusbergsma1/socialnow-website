
import React, { useEffect, useState } from 'react';
import {
  X, Mail, Phone, MessageCircle, MapPin,
  ArrowRight, ArrowUpRight, Clock, Calendar,
  Instagram, Linkedin
} from 'lucide-react';
import Button from './Button';

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

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

  return (
    <div className={`fixed inset-0 z-[200] bg-black overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>

      {/* Background map */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15 overflow-hidden">
        <div
          className="absolute inset-0 w-[200%] h-[200%] -left-1/2 -top-1/2 animate-[slow-map-move_120s_linear_infinite]"
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

      {/* Top bar */}
      <div className="sticky top-0 z-[210] w-full px-6 py-5 md:px-12 md:py-6 flex items-center justify-between backdrop-blur-2xl border-b border-white/[0.06] bg-black/80">
        <img src="https://i.ibb.co/RTsSXFm8/Logo-Social-Now-Lengte.webp" alt="Logo" className="w-28 md:w-36" />
        <button
          onClick={handleClose}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-24">

        {/* Hero heading */}
        <div className="mb-16 md:mb-24">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-6">
            Neem <span className="text-[#25D366]">contact</span><br />
            met ons op
          </h1>
          <p className="text-white/40 text-sm md:text-lg font-medium max-w-xl leading-relaxed">
            Klaar om samen te bouwen aan iets uitzonderlijks? Neem contact op
            via het kanaal dat jou het beste uitkomt.
          </p>
        </div>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-16 md:mb-24">

          {/* Left column: Contact kanalen (3 cols) */}
          <div className="lg:col-span-3 space-y-4">

            {/* WhatsApp — prominent */}
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-6 md:p-8 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/[0.03] hover:bg-[#25D366]/[0.08] transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#25D366] text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-lg md:text-xl tracking-tight">WhatsApp</h3>
                  <p className="text-[#25D366]/60 text-[10px] font-bold uppercase tracking-[0.3em]">Snelste reactie &mdash; Direct antwoord</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/20 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>

            {/* Email */}
            <a
              href="mailto:info@socialnow.nl"
              className="group flex items-center justify-between p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] text-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-lg md:text-xl tracking-tight">E-mail</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">info@socialnow.nl</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>

            {/* Telefoon */}
            <a
              href="tel:+31637404577"
              className="group flex items-center justify-between p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] text-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-lg md:text-xl tracking-tight">Bellen</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">+31 6 37 40 45 77</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
            </a>

            {/* Plan een gesprek */}
            <div
              className="group flex items-center justify-between p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
              onClick={() => {
                handleClose();
                // Small delay to let close animation finish, then the booking popup is opened via parent
              }}
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] text-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase text-lg md:text-xl tracking-tight">Plan een gesprek</h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Gratis kennismakingsgesprek</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </div>

          {/* Right column: Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">

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

        {/* ─── FAQ-style veelgestelde vragen ─── */}
        <div className="border-t border-white/[0.06] pt-16 md:pt-20">
          <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tighter mb-10">
            Wat je kunt verwachten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Kennismaken',
                desc: 'In een vrijblijvend gesprek bespreken we jouw doelen, uitdagingen en ambities. Wij luisteren en stellen de juiste vragen.'
              },
              {
                step: '02',
                title: 'Voorstel',
                desc: 'Na het gesprek ontvang je een helder voorstel op maat. Inclusief scope, tijdlijn en investering. Geen verborgen kosten.'
              },
              {
                step: '03',
                title: 'Aan de slag',
                desc: 'Na akkoord starten we direct. Je krijgt een vast aanspreekpunt en wekelijkse updates over de voortgang van je project.'
              }
            ].map((item) => (
              <div key={item.step} className="p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <span className="text-[#25D366] text-[10px] font-black tracking-[0.3em] mb-3 block">{item.step}</span>
                <h4 className="text-white font-black uppercase text-base tracking-tight mb-3">{item.title}</h4>
                <p className="text-white/35 text-xs font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
            KVK 90877179 &mdash; Amsterdam, Nederland
          </p>
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
