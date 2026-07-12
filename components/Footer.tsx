
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Linkedin, ArrowUpRight, MessageCircle } from 'lucide-react';

interface FooterProps {
  onOpenBooking?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo(0, 0);
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-black text-white relative overflow-hidden">
      {/* Top accent line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ─── MAIN FOOTER ─── */}
      <div className="container mx-auto px-6 max-w-7xl">

        {/* ─── KIES JE PLAN — Revolut-stijl plan-kaarten ─── */}
        <div className="pt-16 md:pt-24">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25 mb-6">
            Kies je plan
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: 'One-Pager', price: '€1.500 eenmalig', text: 'Voor de snelle start: professionele one-page website, AI-gebouwd en SEO-klaar, live binnen 2 weken.' },
              { name: 'Full Stack', price: '€2.500 eenmalig', text: 'Voor groeiende bedrijven: volwaardig platform met custom design, CMS, koppelingen en 90+ performance.' },
              { name: 'Alles-in-1 AI Pakket', price: '€3.000', text: 'Voor wie alles geregeld wil: software, website, CRM, content en ads als één systeem, aangestuurd via één AI chat.' },
            ].map((plan) => (
              <button
                key={plan.name}
                onClick={(e) => handleNavClick(e as unknown as React.MouseEvent, '/prijzen')}
                className="group text-left p-6 md:p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#25D366]/30 transition-all duration-300"
              >
                <h3 className="text-white font-black uppercase tracking-tight text-base mb-1">{plan.name}</h3>
                <p className="text-[#25D366] text-xs font-black uppercase tracking-widest mb-3">{plan.price}</p>
                <p className="text-white/35 text-sm leading-relaxed mb-4">{plan.text}</p>
                <span className="inline-flex items-center gap-2 text-white/40 group-hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                  Kom meer te weten
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Large brand statement */}
        <div className="pt-20 md:pt-32 pb-16 md:pb-24 border-b border-white/[0.06]">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
            <div className="lg:max-w-2xl">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-6">
                Eén systeem.<br />
                Eén <span className="text-[#25D366]">team</span>.<br />
                Alles geregeld.
              </h2>
              <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed max-w-md">
                Website, CRM, content, advertenties én analytics: allemaal geautomatiseerd en op elkaar afgestemd. Eén AI-gedreven partner voor al je groei, vanuit Amsterdam.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <a
                href="mailto:info@socialnow.nl"
                className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              >
                <span className="text-sm md:text-lg font-bold">info@socialnow.nl</span>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="tel:+31637404577"
                className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              >
                <span className="text-sm md:text-lg font-bold">+31 6 37 40 45 77</span>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://wa.me/31637404577"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[#25D366]/60 hover:text-[#25D366] transition-colors mt-2"
              >
                <MessageCircle size={16} />
                <span className="text-sm font-bold">WhatsApp</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* ─── GRID: Diensten, Werk, Bedrijf, Vestiging ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 py-16 md:py-20">

          {/* Diensten */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-6">Diensten</h4>
            <ul className="space-y-3">
              {[
                'AI Website Systemen',
                'Content Automation',
                'CRM & Analytics',
                'Branding',
                'Advertentie Optimalisatie',
                'AI Chatbot',
                'Social Media Automation',
                'Brand Strategy',
                'Motion Design',
                'Video Production'
              ].map((s) => (
                <li key={s}>
                  <span className="text-white/40 text-xs font-medium hover:text-white transition-colors cursor-default">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Werk */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-6">Werk</h4>
            <ul className="space-y-3">
              {[
                { label: 'Alle Projecten', href: '/projecten' },
                { label: 'Websites', href: '/projecten' },
                { label: 'Branding', href: '/projecten' },
                { label: 'Campagnes', href: '/projecten' },
                { label: 'Motion & Video', href: '/projecten' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-white/40 text-xs font-medium hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bedrijf */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-6">Bedrijf</h4>
            <ul className="space-y-3">
              {[
                { label: 'Over Ons', href: '#home' },
                { label: 'Team', href: '/team' },
                { label: 'Diensten', href: '/diensten' },
                { label: 'Werkwijze', href: '/diensten' },
                { label: 'Contact', action: 'booking' as const },
              ].map((item) => (
                <li key={item.label}>
                  {'action' in item ? (
                    <button
                      onClick={onOpenBooking}
                      className="text-white/40 text-xs font-medium hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-white/40 text-xs font-medium hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Vestiging & Social */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-6">Vestiging</h4>
            <p className="text-white/40 text-xs font-medium leading-relaxed mb-1">
              Amstelstraat 43G
            </p>
            <p className="text-white/40 text-xs font-medium leading-relaxed mb-1">
              1017DA Amsterdam
            </p>
            <p className="text-white/40 text-xs font-medium leading-relaxed mb-6">
              Nederland
            </p>

            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-4">Social</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/socialnow.nl/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SocialNow op Instagram"
                className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://www.linkedin.com/company/socialnow-nl/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SocialNow op LinkedIn"
                className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://wa.me/31637404577"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stuur ons een WhatsApp bericht"
                className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* ─── GECERTIFICEERD & ERKEND ─── */}
        <div className="border-t border-white/[0.06] py-10 md:py-14">
          <p className="text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/15 mb-6 md:mb-8">
            Gecertificeerd & Erkend
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-30 hover:opacity-50 transition-opacity duration-500">
            <img src={`${import.meta.env.BASE_URL}google-logo.svg`} alt="Google Partner" className="h-6 md:h-7 w-auto brightness-0 invert" loading="lazy" decoding="async" />
            <img src={`${import.meta.env.BASE_URL}meta-logo.svg`} alt="Meta Business Partner" className="h-5 md:h-6 w-auto brightness-0 invert" loading="lazy" decoding="async" />
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 md:h-6 w-5 md:w-6" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-white text-[10px] md:text-xs font-bold tracking-wide">Google Developers</span>
            </div>
          </div>
        </div>

        {/* ─── JURIDISCH & BEDRIJFSINFORMATIE — Revolut-stijl ─── */}
        <div className="border-t border-white/[0.06] py-10 md:py-12">
          <div className="max-w-4xl text-white/25 text-[11px] leading-relaxed space-y-3">
            <p>© {new Date().getFullYear()} SocialNow</p>
            <p>
              SocialNow is een software- en marketingbureau gevestigd aan de Amstelstraat 43G,
              1017 DA Amsterdam, Nederland, en staat ingeschreven bij de Kamer van Koophandel
              onder nummer 90877179. Voor vragen over onze diensten kun je contact opnemen via{' '}
              <a href="mailto:info@socialnow.nl" className="text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors">info@socialnow.nl</a>{' '}
              of via de chat op deze website.
            </p>
            <p>
              Wij werken als gecertificeerd partner met de advertentieplatformen van Google en Meta.
              Alle websites en software worden geleverd met SSL-versleuteling, dagelijkse back-ups en
              hosting binnen de EU. Persoonsgegevens verwerken wij conform de AVG. Zie onze{' '}
              <a href="/privacy" onClick={(e) => handleNavClick(e, '/privacy')} className="text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors">privacyverklaring</a>.
            </p>
            <p>
              Genoemde prijzen zijn exclusief btw. Op al onze offertes en overeenkomsten zijn onze{' '}
              <a href="https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors">algemene voorwaarden</a>{' '}
              van toepassing.
            </p>
          </div>
        </div>

        {/* ─── BOTTOM BAR ─── */}
        <div className="border-t border-white/[0.06] py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <a href="#" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <img
                src={`${import.meta.env.BASE_URL}beeldmerk-2026.webp`}
                alt="SocialNow"
                className="w-8 h-8 object-contain"
              />
              <span className="font-black text-white tracking-tight text-lg">SocialNow</span>
            </a>
            <span className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} SocialNow &mdash; All Rights Reserved
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white/40 transition-colors"
            >
              Algemene Voorwaarden
            </a>
            <span className="text-white/10">|</span>
            <a
              href="/privacy"
              onClick={(e) => handleNavClick(e, '/privacy')}
              className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white/40 transition-colors"
            >
              Privacy
            </a>
            <span className="text-white/10">|</span>
            <span className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
              KVK 90877179
            </span>
            <span className="text-white/10">|</span>
            <span className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
              Sinds 2021
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
