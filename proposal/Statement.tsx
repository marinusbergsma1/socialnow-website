import React from "react";
import { Bento, Tegel } from "./Bento";
import { mailLink } from "./aanvragen";
import "./statement.css";

// 30 september 2026 (Marinus): "PROVEN BRANDED END TO END HIGHLY PROFITABLE PERSONAL FULLY AUTOMATED SYSTEMS. That's why
// we offer it for free. En klein eronder: if SaaS can't be free, it's not good enough!" Direct onder de hero, in elke taal
// in het Engels (translate="no"), net als de Odoo-regel in de hero.
// Ronde 2, 30 september 2026: Marinus vond de kapitalenlijst met stippen niet mooi en koos uit vier opties optie A: één
// rustige zin, komma's en "and" gedempt, "automated systems." helemaal groen, daaronder een lijn met de gratisregel links
// en de SaaS-regel rechts.

export function Statement() {
  return (
    <div translate="no">
      <Bento id="waarom-gratis" className="sn-statement" label="Why the OS is free">
        <Tegel breed={12} kop="Our statement">
          <p className="sn-statement-zin">Proven<span>,</span> branded<span>,</span> end to end<span>,</span> highly profitable<span>,</span> personal <span>and</span> fully <em>automated systems.</em></p>
          <div className="sn-statement-voet">
            <p className="sn-statement-daarom">That&rsquo;s why we offer it for free.</p>
            <p className="sn-statement-klein">If SaaS can&rsquo;t be free, it&rsquo;s not good enough!</p>
          </div>
        </Tegel>
        {/* 30 september 2026 (Marinus): "als FOUNDER graag in aanmerking kom om een GRATIS DEMO END TO END TE GEVEN. DE
            ANIMATIES LATEN MIJN PRODUCT ZIEN. IK PRESENTEER HET LIVE OVERAL TER WERELD." */}
        <Tegel breed={12} kop="Founder demo" soort="groen" className="sn-statement-founder">
          <div className="sn-founder-rij">
            <img src="/images/marinus-profiel-blauw.webp" alt="Marinus Bergsma" width="96" height="96" loading="lazy" />
            <div>
              <p className="sn-founder-kop">As founder, I&rsquo;d love to give you a free end to end demo.</p>
              <p className="sn-founder-tekst">The animations show my product. I present it live, anywhere in the world.</p>
              <p className="sn-founder-naam"><strong>Marinus Bergsma</strong> Founder, SocialNow</p>
            </div>
          </div>
          <a className="sn-founder-knop" href={mailLink("Free end to end demo with Marinus")}>Book your free live demo</a>
        </Tegel>
      </Bento>
    </div>
  );
}
