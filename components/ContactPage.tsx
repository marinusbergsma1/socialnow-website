
import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, MessageCircle, Calendar, ArrowRight } from 'lucide-react';

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ isOpen, onClose, onOpenBooking }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 600);
  };

  // BookingPopup is z-[100], deze overlay z-[200]: eerst uitfaden, dan booking openen.
  const handleBooking = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      onOpenBooking?.();
    }, 600);
  };

  if (!isOpen && !isClosing) return null;

  const channels: {
    label: string;
    sub: string;
    icon: React.ReactNode;
    color: string;
    href?: string;
    external?: boolean;
    onClick?: () => void;
  }[] = [
    { label: 'Plan een gratis call', sub: '30 min, gratis proof of concept', icon: <Calendar size={22} />, color: '#F62961', onClick: handleBooking },
    { label: 'WhatsApp', sub: 'Reactie binnen 1 uur', icon: <MessageCircle size={22} />, color: '#25D366', href: 'https://wa.me/31637404577', external: true },
    { label: 'E-mail', sub: 'info@socialnow.nl', icon: <Mail size={22} />, color: '#F7E644', href: 'mailto:info@socialnow.nl' },
    { label: 'Bellen', sub: '+31 6 37 40 45 77', icon: <Phone size={22} />, color: '#00A3E0', href: 'tel:+31637404577' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
      className={`fixed inset-0 z-[200] bg-[#030303] overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isClosing ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      <button
        onClick={handleClose}
        aria-label="Sluiten"
        className="fixed top-5 right-5 md:top-8 md:right-8 z-10 w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-[#F62961] hover:border-[#F62961] transition-all group"
      >
        <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <div className="min-h-full flex flex-col justify-center max-w-xl mx-auto px-5 py-20">
        <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-[0.85] mb-4">
          Laten we <span className="text-[#25D366]">praten</span>.
        </h2>
        <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed mb-10">
          Plan een gratis call en claim je gratis proof of concept: website demo + rebranding.
        </p>

        <div className="space-y-3">
          {channels.map((ch) =>
            ch.onClick ? (
              <button
                key={ch.label}
                onClick={ch.onClick}
                className="sn-warp-tile group w-full flex items-center justify-between gap-4 p-5 md:p-6 rounded-2xl text-left transition-transform duration-300 hover:scale-[1.015]"
              >
                <ChannelContent label={ch.label} sub={ch.sub} icon={ch.icon} color={ch.color} />
              </button>
            ) : (
              <a
                key={ch.label}
                href={ch.href}
                target={ch.external ? '_blank' : undefined}
                rel={ch.external ? 'noopener noreferrer' : undefined}
                className="sn-warp-tile group flex items-center justify-between gap-4 p-5 md:p-6 rounded-2xl transition-transform duration-300 hover:scale-[1.015]"
              >
                <ChannelContent label={ch.label} sub={ch.sub} icon={ch.icon} color={ch.color} />
              </a>
            )
          )}
        </div>

        <p className="text-white/25 text-[11px] font-medium tracking-wide mt-10">
          Amstelstraat 43G, 1017DA Amsterdam
        </p>
      </div>
    </div>
  );
};

const ChannelContent: React.FC<{ label: string; sub: string; icon: React.ReactNode; color: string }> = ({ label, sub, icon, color }) => (
  <>
    <div className="flex items-center gap-4 min-w-0">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: `${color}14`, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block text-white font-black uppercase tracking-tighter text-base md:text-lg leading-none mb-1">{label}</span>
        <span className="block text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] truncate">{sub}</span>
      </div>
    </div>
    <ArrowRight size={18} className="text-white/15 group-hover:text-white/50 group-hover:translate-x-1 transition-all flex-shrink-0" />
  </>
);

export default ContactPage;
