import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "./i18n/context";
import { LEGAL_VERSION } from "../components/legal";

// 16 september 2026 (Marinus): bij het landen op de site één keer akkoord vragen op de
// voorwaarden en het privacybeleid. Onthouden in de browser per versie van de tekst; een nieuwe
// versie vraagt opnieuw. Niet op de voorwaarden- en privacypagina zelf: daar leest iemand eerst.
const SLEUTEL = "sn-akkoord";
function bewaard(): boolean { try { return localStorage.getItem(SLEUTEL) === LEGAL_VERSION; } catch { return false; } }

export default function ConsentPopup() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(!bewaard()); }, []);
  const leest = location.pathname === "/voorwaarden" || location.pathname === "/privacy";
  if (!open || leest) return null;
  const akkoord = () => { try { localStorage.setItem(SLEUTEL, LEGAL_VERSION); } catch {} setOpen(false); };
  const nl = language === "nl";
  return (
    <div className="sn-consent" role="dialog" aria-modal="false" aria-labelledby="sn-consent-kop" translate="no">
      <div className="sn-consent-card">
        <p className="sn-consent-eyebrow">SocialNow</p>
        <p id="sn-consent-kop" className="sn-consent-kop">{nl ? "Welkom." : "Welcome."}</p>
        <p className="sn-consent-tekst">
          {nl ? "Door verder te gaan ga je akkoord met onze " : "By continuing you agree to our "}
          <Link to="/voorwaarden">{nl ? "algemene voorwaarden" : "terms of service"}</Link>
          {nl ? " en ons " : " and "}
          <Link to="/privacy">{nl ? "privacybeleid" : "privacy policy"}</Link>
          {nl ? ". Geen trackingcookies, geen analytics." : ". No tracking cookies, no analytics."}
        </p>
        <button type="button" className="sn-consent-knop" onClick={akkoord}>{nl ? "Akkoord" : "Agree"}</button>
      </div>
    </div>
  );
}
