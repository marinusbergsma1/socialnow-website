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
      <p><strong>GRATIS voor jou en 2 teamleden</strong><span>Met 10 GB opslag. Groter team? Kies Business of Enterprise.</span><span className="sn-product-attribution" lang="en" translate="no">a SocialNow product</span></p>
      <Link to="/contact?onderwerp=Een%20persoonlijk%20systeem">Bouw samen met ons team</Link>
      {/* 11 oktober 2026 (Marinus): een duidelijke link naar de website-onboarding. Sinds "FREE WEBSITE, groen vlak" wijst
          hij naar de sectie #free-website op de homepage (FreeWebsite.tsx), met uitleg over beide routes en de knop naar
          website.socialnow.nl. Proeven: scripts/proef-website-onboarding.mjs en scripts/proef-free-website.mjs. */}
      <Link className="sn-product-website" to="/#free-website">
        <span>Gratis website builder via Odoo of een gratis demo via SocialNow</span>
        <b>Start je website-onboarding</b>
      </Link>
      {/* 8 oktober 2026 (Marinus): "Vermeld dan nog op de site dat wij nu groepen van 500 toelaten door grote vraag en
          kwaliteitswaarborging. Noem het Feedback-groepen." Staat overal waar het gratis aanbod staat. */}
      <p className="sn-product-groepen"><strong>Nu in Feedback-groepen van 500</strong><span>Door de grote vraag en om de kwaliteit te bewaken laten we per groep 500 mensen toe.</span></p>
    </div>
    </>
  );
}
