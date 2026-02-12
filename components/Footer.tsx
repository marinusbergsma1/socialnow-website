
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

        {/* Large brand statement */}
        <div className="pt-20 md:pt-32 pb-16 md:pb-24 border-b border-white/[0.06]">
          <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
            <div className="lg:max-w-2xl">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-6">
                Laten we samen<br />
                iets <span className="text-[#25D366]">uitzonderlijks</span><br />
                bouwen.
              </h2>
              <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed max-w-md">
                Van ambitieus idee tot onvergetelijk merk. Wij combineren strategie,
                design en technologie om merken te bouwen die domineren.
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
                'AI Website Development',
                'Brand Strategy',
                'UX/UI Design',
                'Motion Design',
                'Short Form Content',
                '3D & CGI',
                'Full-Stack Development',
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
                { label: 'Team', href: '#team' },
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
                className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://www.linkedin.com/company/socialnow-nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://wa.me/31637404577"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM BAR ─── */}
        <div className="border-t border-white/[0.06] py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <a href="#" className="block w-28 md:w-32 opacity-40 hover:opacity-70 transition-opacity">
              <img
                src="https://i.ibb.co/RkXjxKLb/Social-Now-Logo-Breed-Wit.webp"
                alt="SocialNow Logo"
                className="w-full h-auto"
              />
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
              href="#"
              className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white/40 transition-colors"
            >
              Privacy
            </a>
            <span className="text-white/10">|</span>
            <span className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">
              KVK 90877179
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
