import React from "react";

export default function FounderProfile() {
  return <figure className="sn-founder-profile">
          <img src="/images/marinus-profiel-blauw.webp" alt="Marinus Bergsma, oprichter van SocialNow" width="640" height="680" loading="lazy" />
          {/* 5 oktober 2026 (Marinus): "Ik ben verder ook geen 5 jaar in November maar SocialNow." */}
          <figcaption className="sn-founder-experience">
            <div><strong translate="no">Marinus Bergsma</strong><span>Grafische vormgeving</span></div>
            <div className="sn-founder-tenure">
              <div className="sn-founder-role"><span className="sn-founder-company-logo"><img src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="600" height="140" loading="lazy" /></span><span><b>5 jaar</b><span>SocialNow · in november</span></span></div>
              <div className="sn-founder-role"><img className="sn-founder-personal-logo" src="/images/marinus-bergsma-vormgeving-logo.png" alt="Marinus Bergsma Grafische Vormgeving" width="512" height="512" loading="lazy" /><span><b>7 jaar</b><span>eigen bedrijf</span></span></div>
            </div>
          </figcaption>
          </figure>;
}
