import { MessageCircle, Phone } from "lucide-react";
import { appLink, belLink } from "./aanvragen";
import "./bel-app.css";

// 27 oktober 2026 (Marinus): "PLAN EEN CALL mag hier weg. Net als bij FNDR STUDIO rechtsonder iets zodat je lekker snel
// en zakelijk mij kan bellen of appen." Eén vaste pil rechtsonder, twee helften, rechtstreeks naar Marinus.
export function BelApp() {
  return <nav className="sn-bel-app" aria-label="Bel of app Marinus">
    <a href={belLink}><Phone size={15} aria-hidden="true" /><span>Bellen</span></a>
    <a href={appLink()} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} aria-hidden="true" /><span translate="no">WhatsApp</span></a>
  </nav>;
}
