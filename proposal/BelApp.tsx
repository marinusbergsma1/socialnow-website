import { CalendarDays, MessageCircle } from "lucide-react";
import { appLink } from "./aanvragen";
import { boekingsPlannerUrl } from "./PlanCall";
import "./bel-app.css";

// 27 oktober 2026 (Marinus): "PLAN EEN CALL mag hier weg. Net als bij FNDR STUDIO rechtsonder iets zodat je lekker snel
// en zakelijk mij kan bellen of appen." Eén vaste pil rechtsonder, twee helften, rechtstreeks naar Marinus.
export function BelApp() {
  return <nav className="sn-bel-app" aria-label="Bel of app Marinus">
    <a className="sn-bel-app-call" href={boekingsPlannerUrl}><CalendarDays size={15} aria-hidden="true" /><span>Plan een call</span></a>
    {/* 27 november 2026 (Marinus): "Bellen mag wel weg hier. Gewoon Plan een Call of Whatsapp." Ook op grote schermen geen Bellen meer. */}
    <a href={appLink()} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} aria-hidden="true" /><span translate="no">WhatsApp</span></a>
  </nav>;
}
