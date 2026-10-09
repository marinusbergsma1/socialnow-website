import React from "react";
import { Link } from "react-router-dom";
import "./product-start.css";

// Dezelfde instap en opslagafspraak in hero, OS-uitleg en aanbod.
export function ProductRoute() {
  return (
    <nav className="sn-product-route" aria-label="Je route door SocialNow OS">
      <Link to="/het-os#route-website">WEBSITE</Link>
      <span aria-hidden="true">→</span>
      <Link to="/het-os#route-content">CONTENT</Link>
      <span aria-hidden="true">→</span>
      <Link to="/het-os#route-studio">STUDIO</Link>
    </nav>
  );
}

export function ProductOffer() {
  return (
    <>
    <div className="sn-product-brand" translate="no">
      <img src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" width="600" height="92" />
    </div>
    <div className="sn-product-offer">
      <p><strong>GRATIS tot 10 GB opslag</strong><span>Daarna €20 per maand</span><span className="sn-product-attribution" lang="en" translate="no">a SocialNow product</span></p>
      <Link to="/contact?onderwerp=Een%20persoonlijk%20systeem">Bouw samen met ons team</Link>
      {/* 8 oktober 2026 (Marinus): "Vermeld dan nog op de site dat wij nu groepen van 500 toelaten door grote vraag en
          kwaliteitswaarborging. Noem het Feedback-groepen." Staat overal waar het gratis aanbod staat. */}
      <p className="sn-product-groepen"><strong>Nu in Feedback-groepen van 500</strong><span>Door de grote vraag en om de kwaliteit te bewaken laten we per groep 500 mensen toe.</span></p>
    </div>
    </>
  );
}
