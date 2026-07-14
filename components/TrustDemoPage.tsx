import React from 'react';
import { ChatTile, SecureTile, GrowthTile } from './TrustTilesLive';
import { useSEO } from '../hooks/useSEO';

/**
 * /trust-demo — interne vergelijkingspagina (noindex): code-geanimeerde
 * trust-tiles (Remotion-stijl, live CSS/SVG) naast de huidige statics.
 * Seedance/Omni-videovarianten worden hier toegevoegd zodra gegenereerd.
 */
const TrustDemoPage: React.FC = () => {
  useSEO({ title: 'Trust tiles demo (intern)', description: 'Interne demo' });
  // noindex: interne pagina, niet voor zoekmachines
  React.useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => { document.head.removeChild(m); };
  }, []);

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <p className="text-[#25D366] text-xs font-bold tracking-[0.3em] uppercase mb-3">Interne demo</p>
        <h1 className="text-white font-black uppercase tracking-tighter text-3xl md:text-5xl mb-2">Trust-tiles: varianten</h1>
        <p className="text-neutral-400 mb-10">Variant A — code-animatie (Remotion-stijl, herstart bij wegscrollen). Scroll weg en terug om de herstart te zien.</p>

        <h2 className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4">A · Code-animatie</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:items-start mb-16">
          <div className="md:mt-8"><ChatTile /></div>
          <div className="md:-mt-8"><SecureTile /></div>
          <div className="md:mt-8"><GrowthTile /></div>
        </div>

        <h2 className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4">Huidig · Statisch (ter vergelijking)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:items-start">
          {['trust-service.webp', 'trust-secure.webp', 'trust-growth.webp'].map((img, i) => (
            <div key={img} className={`relative rounded-[28px] overflow-hidden border border-white/[0.06] bg-[#0a0a0a] aspect-[0.72] ${i === 1 ? 'md:-mt-8' : 'md:mt-8'}`}>
              <img src={`${import.meta.env.BASE_URL}images/${img}`} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TrustDemoPage;
