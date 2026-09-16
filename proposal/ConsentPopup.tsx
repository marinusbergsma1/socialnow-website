import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, type Language } from "./i18n/context";
import { LEGAL_VERSION } from "../components/legal";

// 16 september 2026 (Marinus): bij het landen op de site één keer akkoord vragen op de
// voorwaarden en het privacybeleid. Onthouden in de browser per versie van de tekst; een nieuwe
// versie vraagt opnieuw. Niet op de voorwaarden- en privacypagina zelf: daar leest iemand eerst.
const SLEUTEL = "sn-akkoord";
function bewaard(): boolean { try { return localStorage.getItem(SLEUTEL) === LEGAL_VERSION; } catch { return false; } }

const TEKST: Record<Language, { kop: string; voor: string; voorwaarden: string; en: string; privacy: string; na: string; knop: string }> = {
  nl: { kop: "Welkom.", voor: "Door verder te gaan ga je akkoord met onze ", voorwaarden: "algemene voorwaarden", en: " en ons ", privacy: "privacybeleid", na: ". Geen trackingcookies, geen analytics.", knop: "Akkoord" },
  en: { kop: "Welcome.", voor: "By continuing you agree to our ", voorwaarden: "terms of service", en: " and ", privacy: "privacy policy", na: ". No tracking cookies, no analytics.", knop: "Agree" },
  de: { kop: "Willkommen.", voor: "Wenn Sie fortfahren, stimmen Sie unseren ", voorwaarden: "Nutzungsbedingungen", en: " und unserer ", privacy: "Datenschutzerklärung", na: " zu. Keine Tracking-Cookies, keine Analytics.", knop: "Einverstanden" },
  fr: { kop: "Bienvenue.", voor: "En poursuivant, vous acceptez nos ", voorwaarden: "conditions générales", en: " et notre ", privacy: "politique de confidentialité", na: ". Pas de cookies de suivi, pas d’analytics.", knop: "J’accepte" },
  it: { kop: "Benvenuto.", voor: "Proseguendo accetti i nostri ", voorwaarden: "termini di servizio", en: " e la nostra ", privacy: "informativa sulla privacy", na: ". Nessun cookie di tracciamento, nessuna analitica.", knop: "Accetto" },
  es: { kop: "Bienvenido.", voor: "Al continuar aceptas nuestros ", voorwaarden: "términos de servicio", en: " y nuestra ", privacy: "política de privacidad", na: ". Sin cookies de seguimiento, sin analítica.", knop: "Acepto" },
};

export default function ConsentPopup() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(!bewaard()); }, []);
  const leest = location.pathname === "/voorwaarden" || location.pathname === "/privacy";
  if (!open || leest) return null;
  const akkoord = () => { try { localStorage.setItem(SLEUTEL, LEGAL_VERSION); } catch {} setOpen(false); };
  const s = TEKST[language] || TEKST.en;
  return (
    <div className="sn-consent" role="dialog" aria-modal="false" aria-labelledby="sn-consent-kop" translate="no">
      <div className="sn-consent-card">
        <p className="sn-consent-eyebrow">SocialNow</p>
        <p id="sn-consent-kop" className="sn-consent-kop">{s.kop}</p>
        <p className="sn-consent-tekst">
          {s.voor}<Link to="/voorwaarden">{s.voorwaarden}</Link>{s.en}<Link to="/privacy">{s.privacy}</Link>{s.na}
        </p>
        <button type="button" className="sn-consent-knop" onClick={akkoord}>{s.knop}</button>
      </div>
    </div>
  );
}
