
import React, { useState, useEffect } from 'react';
import { Star, Activity, Terminal } from 'lucide-react';
import Button from './Button';

interface ReviewsProps {
  onOpenBooking?: () => void;
}

const reviewsData = [
  {
    id: "REV_01",
    name: "Niels Groen",
    handle: "RAVEG",
    role: "RAVEG",
    image: "https://i.ibb.co/mFGckZkS/Niels-Groen.webp",
    stars: 5,
    status: "CORE_CLIENT",
    meta: { CPU: "96%", SYNC: "100%" },
    text: "Wij werken sinds de start met SocialNow voor onze branding, website en social media. Een samenwerking die ik nooit zal opgeven!"
  },
  {
    id: "REV_02",
    name: "Albert Deltour",
    handle: "LIGHT ART COLLECTION",
    role: "Light Art Collection",
    image: "https://i.ibb.co/FbghZnyG/66ed2e6a48aae627d6698e31-Albert-Deltour.webp",
    stars: 5,
    status: "CORE_CLIENT",
    meta: { CPU: "92%", SYNC: "100%" },
    text: "From ambitious and talented intern to a reliable partner is how I would describe Marinus. We have been working together for quite a few years, and he still designs and creates our international presentations with his team."
  },
  {
    id: "REV_03",
    name: "Hussein Awqati",
    handle: "DIVINE MACHINES",
    role: "Divine Machines",
    image: "https://i.ibb.co/xKKZT9Fg/Hussein.webp",
    stars: 5,
    status: "VERIFIED_PARTNER",
    meta: { CPU: "88%", SYNC: "98%" },
    text: "Erg tevreden met de ervaring en kennis van het team van socialnow. Via via zijn wij in contact gekomen en sindsdien is socialnow die designer van Divine Machines."
  }
];

const Reviews: React.FC<ReviewsProps> = ({ onOpenBooking }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewsData.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews" className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`, 
          backgroundSize: '40px 40px', 
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)', 
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)' 
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tighter leading-none mb-6 flex flex-wrap justify-center items-center">
            <span className="inline-flex items-center whitespace-nowrap">
              <span className="text-[#F7E644] mr-2 md:mr-6 leading-none">"</span>
              DIT ZEGGEN
            </span>
            <span className="mx-2 md:mx-4">ONZE</span>
            <span className="inline-flex items-center whitespace-nowrap">
              KLANTEN
              <span className="text-[#F7E644] ml-2 md:ml-6 leading-none">"</span>
            </span>
          </h2>
        </div>

        {/* Detailed Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 w-full max-w-7xl">
          {reviewsData.map((review, index) => (
            <div 
              key={index} 
              className={`group relative backdrop-blur-3xl p-10 rounded-[2.5rem] border transition-all duration-700 flex flex-col hover:-translate-y-4 shadow-2xl ${activeIndex === index ? 'bg-black/90 border-[#61F6FD]/40 shadow-[0_20px_60px_rgba(97,246,253,0.15)]' : 'bg-zinc-950/80 border-white/10 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10">
                  <img alt={review.name} className="w-full h-full object-cover" src={review.image} />
                </div>
                <div>
                  <h4 className="font-black text-white text-lg leading-tight uppercase tracking-tighter">{review.name}</h4>
                  <p className="text-[#61F6FD] text-[10px] font-black uppercase tracking-widest">{review.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6 bg-white/[0.03] border border-white/5 p-3 rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
                  <span className="text-[9px] font-mono text-white/50 tracking-widest uppercase">{review.status}</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm font-bold flex-grow italic mb-10">
                "{review.text}"
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-auto">
                  {Object.entries(review.meta).map(([k, v]) => (
                    <div key={k} className="bg-white/5 border border-white/5 p-2 rounded-xl text-center">
                        <span className="text-[8px] text-white/30 block mb-0.5 uppercase font-mono tracking-tighter">{k}</span>
                        <span className="text-[10px] text-white font-black uppercase font-mono">{v}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 md:mt-12">
            <Button variant="green" icon onClick={onOpenBooking} triggerOnHover>KENNISMAKEN</Button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
