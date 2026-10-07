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
      <strong>SocialNow<span>/OS</span></strong>
      <span lang="en">a SocialNow product</span>
    </div>
    <div className="sn-product-offer">
      <p><strong>GRATIS tot 10 GB opslag</strong><span>Daarna €20 per maand</span></p>
      <Link to="/contact?onderwerp=Een%20persoonlijk%20systeem">Een persoonlijk systeem</Link>
    </div>
    </>
  );
}
