
import React from 'react';

// Updated client logos to webp, removed AZ logo as requested
// Echte merknamen als alt-tekst: beter voor SEO (alt is een ranking-signaal)
// én voor screenreaders dan het oude generieke "Client Logo 1".
const clientLogos = [
  { src: `${import.meta.env.BASE_URL}images/AMSTERDAM-LIGHT-FESTIVAL-LOGO.webp`, name: 'Amsterdam Light Festival' },
  { src: `${import.meta.env.BASE_URL}images/CHIN-CHIN-CLUB-LOGO.webp`, name: 'Chin Chin Club' },
  { src: `${import.meta.env.BASE_URL}images/MOJO-LOGO.webp`, name: 'Mojo' },
  { src: `${import.meta.env.BASE_URL}images/SUPPERCLUB-LOGO.webp`, name: 'Supperclub' },
  { src: `${import.meta.env.BASE_URL}images/UNDER-ARMOUR-LOGO-1.webp`, name: 'Under Armour' },
];

const Clients: React.FC = () => {
  return (
    <section className="bg-transparent pt-4 pb-10 md:pt-12 md:pb-24 overflow-hidden relative">
      <p className="text-center text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-4 md:mb-8">
        VERTROUWD DOOR MARKTLEIDERS
      </p>
      <style>{`
        .client-scroll {
          --scroll-duration: 60s;
        }
        @media (max-width: 768px) {
          .client-scroll {
            --scroll-duration: 30s;
          }
        }
      `}</style>
      <div 
        className="flex whitespace-nowrap animate-scroll items-center relative z-10 w-max gap-12 md:gap-32 px-4 md:px-12 client-scroll"
        style={{ 
            // Mask to fade out the edges and highlight the center
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        {/* Repeat logos for seamless loop. De scroll-keyframe transleert -50%,
            dus het aantal kopieën MOET even zijn — anders landt -50% midden in
            een set en springt de marquee zichtbaar (viel eerder op mobiel met 3x).
            Vast op 4 (even) op alle schermen: naadloos + resize-proof. */}
        {Array.from({ length: 4 }, () => clientLogos).flat().map((logo, index) => (
          <div key={index} className="flex items-center justify-center h-20 md:h-32 min-w-[140px] md:min-w-[240px] relative group cursor-pointer">
             <img
               src={logo.src}
               alt={`${logo.name} — klant van SocialNow`}
               className="h-full w-auto max-w-[120px] md:max-w-[200px] object-contain transition-all duration-500 opacity-80 hover:opacity-100 hover:scale-110 grayscale brightness-[2]"
               loading="lazy"
               decoding="async"
               style={{ aspectRatio: '3 / 1' }}
             />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clients;
