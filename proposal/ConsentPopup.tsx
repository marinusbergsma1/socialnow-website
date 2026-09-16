import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, languagePrefix, type Language } from "./i18n/context";
import { LEGAL_VERSION } from "../components/legal";

// 16 september 2026 (Marinus): de landingspopup. Eén keer bij binnenkomst: kom je voor de demo of
// wil je de website bekijken, kies je land, en met die keuze ga je akkoord met de voorwaarden en het
// privacybeleid. Onthouden in de browser per versie van de tekst; een nieuwe versie vraagt opnieuw.
// Het land bepaalt de taal van de site én reist mee naar het OS (cookies sn-taal en sn-land op
// .socialnow.nl), zodat het aanmeldformulier, de welkomstboodschap en Milo in de juiste taal staan.
// Niet op de voorwaarden- en privacypagina zelf: daar leest iemand eerst.
//
// TEKSTEN: alles wat een bezoeker leest staat hieronder per taal; pas het hier aan.
const SLEUTEL = "sn-akkoord";
const DEMO_URL = "https://app.socialnow.nl/start/";

export const LANDEN: { code: string; naam: string; vlag: string; taal: Language }[] = [
  { code: "NL", naam: "Nederland", vlag: "🇳🇱", taal: "nl" },
  { code: "BE", naam: "België", vlag: "🇧🇪", taal: "nl" },
  { code: "DE", naam: "Deutschland", vlag: "🇩🇪", taal: "de" },
  { code: "AT", naam: "Österreich", vlag: "🇦🇹", taal: "de" },
  { code: "CH", naam: "Schweiz", vlag: "🇨🇭", taal: "de" },
  { code: "FR", naam: "France", vlag: "🇫🇷", taal: "fr" },
  { code: "IT", naam: "Italia", vlag: "🇮🇹", taal: "it" },
  { code: "ES", naam: "España", vlag: "🇪🇸", taal: "es" },
  { code: "GB", naam: "United Kingdom", vlag: "🇬🇧", taal: "en" },
  { code: "IE", naam: "Ireland", vlag: "🇮🇪", taal: "en" },
  { code: "US", naam: "United States", vlag: "🇺🇸", taal: "en" },
  { code: "XX", naam: "Other", vlag: "🌍", taal: "en" },
];

const TEKST: Record<Language, { kop: string; vraag: string; land: string; demo: string; site: string; voor: string; voorwaarden: string; en: string; privacy: string; na: string }> = {
  nl: { kop: "Welkom bij SocialNow.", vraag: "Kom je voor de demo, of wil je eerst de website bekijken?", land: "Je land", demo: "Naar de demo", site: "Website bekijken", voor: "Met je keuze ga je akkoord met onze ", voorwaarden: "algemene voorwaarden", en: " en ons ", privacy: "privacybeleid", na: ". Geen trackingcookies, geen analytics." },
  en: { kop: "Welcome to SocialNow.", vraag: "Are you here for the demo, or do you want to explore the website first?", land: "Your country", demo: "Go to the demo", site: "Explore the website", voor: "With your choice you agree to our ", voorwaarden: "terms of service", en: " and ", privacy: "privacy policy", na: ". No tracking cookies, no analytics." },
  de: { kop: "Willkommen bei SocialNow.", vraag: "Kommen Sie für die Demo, oder möchten Sie zuerst die Website ansehen?", land: "Ihr Land", demo: "Zur Demo", site: "Website ansehen", voor: "Mit Ihrer Wahl stimmen Sie unseren ", voorwaarden: "Nutzungsbedingungen", en: " und unserer ", privacy: "Datenschutzerklärung", na: " zu. Keine Tracking-Cookies, keine Analytics." },
  fr: { kop: "Bienvenue chez SocialNow.", vraag: "Vous venez pour la démo, ou vous voulez d’abord découvrir le site ?", land: "Votre pays", demo: "Voir la démo", site: "Découvrir le site", voor: "Par votre choix, vous acceptez nos ", voorwaarden: "conditions générales", en: " et notre ", privacy: "politique de confidentialité", na: ". Pas de cookies de suivi, pas d’analytics." },
  it: { kop: "Benvenuto in SocialNow.", vraag: "Sei qui per la demo, o vuoi prima esplorare il sito?", land: "Il tuo paese", demo: "Vai alla demo", site: "Esplora il sito", voor: "Con la tua scelta accetti i nostri ", voorwaarden: "termini di servizio", en: " e la nostra ", privacy: "informativa sulla privacy", na: ". Nessun cookie di tracciamento, nessuna analitica." },
  es: { kop: "Bienvenido a SocialNow.", vraag: "¿Vienes por la demo, o quieres ver primero la web?", land: "Tu país", demo: "Ir a la demo", site: "Ver la web", voor: "Con tu elección aceptas nuestros ", voorwaarden: "términos de servicio", en: " y nuestra ", privacy: "política de privacidad", na: ". Sin cookies de seguimiento, sin analítica." },
};

function bewaard(): boolean { try { return localStorage.getItem(SLEUTEL) === LEGAL_VERSION; } catch { return false; } }
function landUitBrowser(): string {
  try { const m = document.cookie.match(/(?:^|;\s*)sn-land=([A-Z]{2})/); if (m && LANDEN.some(l => l.code === m[1])) return m[1]; } catch {}
  const regio = (navigator.language || "").split("-")[1]?.toUpperCase() || "";
  return LANDEN.some(l => l.code === regio) ? regio : "NL";
}
// Cookies voor het hele domein, zodat app.socialnow.nl dezelfde taal en hetzelfde land ziet.
function zetCookies(land: string, taal: Language) {
  try {
    const domein = location.hostname.endsWith("socialnow.nl") ? "; Domain=.socialnow.nl" : "";
    const veilig = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `sn-taal=${taal}; Path=/; Max-Age=31536000; SameSite=Lax${domein}${veilig}`;
    document.cookie = `sn-land=${land}; Path=/; Max-Age=31536000; SameSite=Lax${domein}${veilig}`;
  } catch {}
}

export default function ConsentPopup() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [land, setLand] = useState("NL");
  useEffect(() => { setOpen(!bewaard()); setLand(landUitBrowser()); }, []);
  const leest = location.pathname === "/voorwaarden" || location.pathname === "/privacy";
  if (!open || leest) return null;
  const gekozen = LANDEN.find(l => l.code === land) || LANDEN[0];
  const s = TEKST[language] || TEKST.en;
  const kiesLand = (code: string) => {
    const l = LANDEN.find(x => x.code === code) || LANDEN[0]; setLand(l.code); zetCookies(l.code, l.taal);
    // De taal van de site hangt aan de route; een volledige herlading zet alles (kop, menu, popup) in de nieuwe taal.
    if (l.taal !== language) { const rest = location.pathname.replace(/^\/(nl|de|fr|it|es)(?=\/|$)/, ""); window.location.assign(`${languagePrefix(l.taal)}${rest || "/"}${location.search}`); }
  };
  const akkoord = () => { try { localStorage.setItem(SLEUTEL, LEGAL_VERSION); } catch {} zetCookies(gekozen.code, gekozen.taal); setOpen(false); };
  const demo = () => { akkoord(); location.href = `${DEMO_URL}?taal=${gekozen.taal}&land=${gekozen.code}`; };
  return (
    <div className="sn-consent" role="dialog" aria-modal="true" aria-labelledby="sn-consent-kop" translate="no">
      <div className="sn-consent-card">
        <img className="sn-consent-logo" src="/beeldmerk-2026.webp" alt="" width="48" height="48" />
        <p className="sn-consent-eyebrow">SocialNow</p>
        <p id="sn-consent-kop" className="sn-consent-kop">{s.kop}</p>
        <p className="sn-consent-vraag">{s.vraag}</p>
        <label className="sn-consent-land">
          <span>{s.land}</span>
          <select value={land} onChange={e => kiesLand(e.target.value)} aria-label={s.land}>
            {LANDEN.map(l => <option key={l.code} value={l.code}>{l.vlag} {l.naam}</option>)}
          </select>
        </label>
        <div className="sn-consent-knoppen">
          <button type="button" className="sn-consent-knop" onClick={demo}>{s.demo}</button>
          <button type="button" className="sn-consent-knop sn-consent-knop-stil" onClick={akkoord}>{s.site}</button>
        </div>
        <p className="sn-consent-tekst">
          {s.voor}<Link to="/voorwaarden">{s.voorwaarden}</Link>{s.en}<Link to="/privacy">{s.privacy}</Link>{s.na}
        </p>
      </div>
    </div>
  );
}
