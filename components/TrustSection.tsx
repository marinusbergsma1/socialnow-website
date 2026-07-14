import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ChatTile, SecureTile, GrowthTile } from './TrustTilesLive';

/**
 * TrustSection — Revolut-stijl: rustige centrale kop + trust-copy, daaronder
 * drie afgeronde tiles (middelste iets hoger). De visuals zijn nu code-
 * geanimeerd (Remotion-stijl, live CSS/SVG) i.p.v. statische afbeeldingen —
 * ze herstarten bij wegscrollen.
 */

const TrustSection: React.FC = () => {
  return (
    <section id="vertrouwen" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">

        {/* Kop + trust-copy */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <ShieldCheck size={13} className="text-[#25D366]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Veilig & Betrouwbaar
            </span>
          </div>
          <h2 className="font-black uppercase tracking-tighter text-white leading-none text-4xl md:text-6xl mb-5">
            JOUW GROEI, <span className="text-[#25D366]">ALTIJD VEILIG</span>
          </h2>
          <p className="text-neutral-400">
            Gecertificeerd Google- en Meta-partner. Jouw website, data en campagnes staan
            op eigen infrastructuur, AVG-proof en dagelijks geback-upt, met één vast
            aanspreekpunt dat altijd weet hoe jouw systeem in elkaar zit.
          </p>
        </div>

        {/* Code-geanimeerde tiles (Remotion-stijl) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto md:items-start">
          <div className="md:mt-8"><ChatTile /></div>
          <div className="md:-mt-8"><SecureTile /></div>
          <div className="md:mt-8"><GrowthTile /></div>
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
