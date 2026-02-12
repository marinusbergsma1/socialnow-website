
import React from 'react';

// Updated client logos to webp, removed AZ logo as requested
const clientLogos = [
  "https://i.ibb.co/zhbN3MHJ/AMSTERDAM-LIGHT-FESTIVAL-LOGO.webp",
  "https://i.ibb.co/wZzBQThQ/CHIN-CHIN-CLUB-LOGO.webp",
  "https://i.ibb.co/LdGrn7GN/MOJO-LOGO.webp",
  "https://i.ibb.co/JWX4gwhw/SUPPERCLUB-LOGO.webp",
  "https://i.ibb.co/yFy07Gxw/UNDER-ARMOUR-LOGO-1.webp"
];

const Clients: React.FC = () => {
  return (
    <section className="bg-transparent pt-4 pb-10 md:pt-12 md:pb-24 overflow-hidden relative">
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
        {/* Repeating the logos 4 times to ensure seamless loop on wide screens with smaller logos */}
        {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((logo, index) => (
          <div key={index} className="flex items-center justify-center h-20 md:h-32 min-w-[140px] md:min-w-[240px] relative group cursor-pointer">
             <img
               src={logo}
               alt={`Client Logo ${(index % clientLogos.length) + 1}`}
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
