
import React from 'react';

const certifications = [
  {
    name: 'Meta Business Partner',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 md:w-8 md:h-8">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 20c0-2.5 1.8-4.5 4-4.5 1.5 0 2.8.8 3.5 2l.5.8.5-.8c.7-1.2 2-2 3.5-2 2.2 0 4 2 4 4.5 0 4.5-8 9.5-8 9.5s-8-5-8-9.5z" fill="currentColor" opacity="0.2" />
        <text x="20" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor">META</text>
        <text x="20" y="30" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.7">PARTNER</text>
      </svg>
    ),
    label: 'Meta Business Partner',
    sublabel: 'Certified',
  },
  {
    name: 'Google Developer',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 md:w-8 md:h-8">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="20" y="16" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="currentColor">GOOGLE</text>
        <text x="20" y="24" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.7">DEVELOPER</text>
        <path d="M14 30l6-4 6 4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
    ),
    label: 'Google Developer',
    sublabel: 'Verified',
  },
  {
    name: 'Shopify Partner',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 md:w-8 md:h-8">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M22 10l-2 8h-4l-2-3c0 0 2 15 2 15h4l6-20h-4z" fill="currentColor" opacity="0.15" />
        <text x="20" y="24" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="currentColor">SHOPIFY</text>
        <text x="20" y="31" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.7">PARTNER</text>
      </svg>
    ),
    label: 'Shopify Partner',
    sublabel: 'Official',
  },
  {
    name: 'Webflow Expert',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 md:w-8 md:h-8">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="20" y="17" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="currentColor">WEBFLOW</text>
        <text x="20" y="25" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.7">EXPERT</text>
        <rect x="13" y="28" width="14" height="2" rx="1" fill="currentColor" opacity="0.2" />
      </svg>
    ),
    label: 'Webflow Expert',
    sublabel: 'Certified',
  },
  {
    name: 'Google Ads',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 md:w-8 md:h-8">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="20" y="16" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="currentColor">GOOGLE</text>
        <text x="20" y="24" textAnchor="middle" fontSize="5.5" fill="currentColor" opacity="0.7">ADS</text>
        <circle cx="20" cy="30" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    label: 'Google Ads',
    sublabel: 'Certified',
  },
  {
    name: 'OpenAI',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 md:w-8 md:h-8">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <text x="20" y="17" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="currentColor">OPENAI</text>
        <text x="20" y="25" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.7">INTEGRATED</text>
        <path d="M16 29h8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
    label: 'OpenAI',
    sublabel: 'API Partner',
  },
];

const CertificationBadges: React.FC = () => {
  return (
    <section className="bg-transparent py-8 md:py-14 overflow-hidden relative">
      {/* Section label */}
      <p className="text-center text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-6 md:mb-10">
        GECERTIFICEERD & ERKEND
      </p>

      {/* Badges grid */}
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {certifications.map((cert, index) => (
            <div
              key={cert.name}
              className="group flex flex-col items-center justify-center py-4 px-2 md:py-5 md:px-3 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500 cursor-default"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Icon */}
              <div className="text-white/40 group-hover:text-[#25D366] transition-colors duration-500 mb-2">
                {cert.icon}
              </div>

              {/* Label */}
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover:text-white/70 transition-colors duration-500 text-center leading-tight">
                {cert.label}
              </p>

              {/* Sublabel */}
              <p className="text-[8px] md:text-[9px] font-medium uppercase tracking-wider text-white/20 group-hover:text-[#25D366]/60 transition-colors duration-500 mt-0.5">
                {cert.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle divider */}
      <div className="mt-8 md:mt-12 flex justify-center">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
};

export default CertificationBadges;
