
import React from 'react';

const imagesRow1 = [
  { src: "https://i.ibb.co/VcsQ9tLr/1400-Mark-Johnson-LUV-YOU-STILL-1.webp", title: "LUV YOU STILL" },
  { src: "https://i.ibb.co/WWZCxsb2/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp", title: "FAST X CAMPAIGN" },
  { src: "https://i.ibb.co/993HhMHM/C4-FEED-30-korting.webp", title: "C4 PERFORMANCE" },
  { src: "https://i.ibb.co/356nWH7t/header-Bouadu-v2-1.webp", title: "BOADU ARTWORK" },
  { src: "https://i.ibb.co/wZwdpDnY/666f15bbb49442553d264e6d-PRINT-BIND.webp", title: "PRINT & BIND OFFICE" }
];

const imagesRow2 = [
  { src: "https://i.ibb.co/BHRWPBQD/Light-Art-Collection.webp", title: "LIGHT ART COLLECTION" },
  { src: "https://i.ibb.co/rRvDwPcZ/Logo-s-AZ-Media-Voorbeeld-1.webp", title: "AZ MEDIA SYSTEMS" },
  { src: "https://i.ibb.co/VYkkWJbf/Soulful-Special-Event-Header-1.webp", title: "SOULFUL SPECIALS" },
  { src: "https://i.ibb.co/gMXD7pDW/THE-HEALTH-HOUSE-CONCEPT-1.webp", title: "THE HEALTH HOUSE" },
  { src: "https://i.ibb.co/67P1fyDT/THH-VALENTINE-SALE-STORY-2024-1200x1200-1200x1200-1.webp", title: "VALENTINE SPECIAL" }
];

const ImageSlider: React.FC = () => {
  return (
    <section className="py-12 md:py-32 bg-transparent overflow-hidden relative flex flex-col gap-6 md:gap-10 min-h-[300px] md:min-h-[400px] z-20 touch-pan-y">
      
      {/* Background Technical Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <div className="w-full h-full border-y border-white/5 flex items-center justify-around">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-full w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
            ))}
        </div>
      </div>

      {/* Row 1 Header Info */}
      <div className="container mx-auto px-6 relative z-30 mb-2">
         <div className="flex items-center gap-4 opacity-30">
            <div className="h-[1px] w-8 md:w-12 bg-[#61F6FD]"></div>
            <span className="text-[8px] md:text-[9px] font-mono tracking-[0.4em] text-white uppercase">VISUAL_ASSET_STREAM_01 // MULTI_NODE_SYNC</span>
         </div>
      </div>

      {/* Fade Edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-80 bg-gradient-to-r from-black via-black/90 to-transparent z-30 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-80 bg-gradient-to-l from-black via-black/90 to-transparent z-30 pointer-events-none"></div>
      
      {/* Row 1: Right to Left */}
      <div className="flex relative z-10 overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="flex w-max animate-marquee-fixed will-change-transform transform-gpu">
          {[1, 2].map((block) => (
            <div key={block} className="flex items-center gap-4 md:gap-10 pr-4 md:pr-10">
              {imagesRow1.map((img, index) => (
                <div
                  key={`${block}-${index}`}
                  className="flex-none h-[100px] md:h-[280px] w-auto rounded-[1.2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 flex items-center justify-center transition-all duration-500 hover:border-white/30"
                >
                   <img
                     src={img.src}
                     alt={img.title}
                     className="h-full w-auto block max-w-none"
                     loading={block === 1 ? "eager" : "lazy"}
                   />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Divider / Technical Diagram */}
      <div className="relative z-20 py-2 md:py-4 flex justify-center overflow-hidden pointer-events-none">
          <div className="flex items-center gap-6 md:gap-24 opacity-20">
              {[
                { label: "BITRATE", val: "48.2 GB/S" },
                { label: "LATENCY", val: "0.002MS" },
                { label: "SYNC", val: "ENCRYPTED" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-3">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#F62961] animate-pulse"></div>
                    <span className="text-[7px] md:text-[10px] font-mono text-white tracking-widest">{stat.label}: {stat.val}</span>
                </div>
              ))}
          </div>
      </div>

      {/* Row 2: Left to Right */}
      <div className="flex relative z-10 overflow-hidden cursor-grab active:cursor-grabbing">
        <div
          className="flex w-max animate-marquee-fixed-slow will-change-transform transform-gpu"
          style={{ animationDirection: 'reverse' }}
        >
          {[1, 2].map((block) => (
            <div key={block} className="flex items-center gap-4 md:gap-10 pr-4 md:pr-10">
              {imagesRow2.map((img, index) => (
                <div
                  key={`${block}-${index}`}
                  className="flex-none h-[100px] md:h-[280px] w-auto rounded-[1.2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 flex items-center justify-center transition-all duration-500 hover:border-white/30"
                >
                   <img
                     src={img.src}
                     alt={img.title}
                     className="h-full w-auto block max-w-none"
                     loading={block === 1 ? "eager" : "lazy"}
                   />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-fixed {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-fixed {
          animation: marquee-fixed 35s linear infinite;
        }
        .animate-marquee-fixed-slow {
          animation: marquee-fixed 45s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee-fixed {
            animation-duration: 25s;
          }
          .animate-marquee-fixed-slow {
            animation-duration: 30s;
          }
        }
      `}</style>
    </section>
  );
};

export default ImageSlider;
