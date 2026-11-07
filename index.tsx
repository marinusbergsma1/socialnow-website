import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./proposal/WebsiteProposal";
import { isLanguage, laadWoordenboek, type Language } from "./proposal/i18n/context";
import "./proposal/website.css";
import "./proposal/experience.css";
// Concept zakelijk (5 oktober 2026): als laatste, zodat de overrides winnen.
import "./proposal/concept.css";
import "./proposal/concept-tech.css";
import "./proposal/partner-colors.css";
import "./proposal/language-menu.css";
// 11 oktober 2026: stippenraster over de hele site, als laatste zodat het wint.
import "./proposal/stippen.css";
import "./proposal/knopgroen.css";
import "./proposal/button-design.css";
import { detectVisitorLanguage } from "./proposal/i18n/detect";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

function pageLanguage(): Language {
  const match = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match && isLanguage(match[1]) ? match[1] : "en";
}
function site(language: Language) {
  return (
    <React.StrictMode>
      <BrowserRouter key={language} basename={language === "en" ? "/" : `/${language}`}>
        <App language={language} />
      </BrowserRouter>
    </React.StrictMode>
  );
}
// 30 september 2026 (Marinus: "WIL ECHT INSTANT LOADING"): scripts/prerender.mjs zet de pagina al als
// echte HTML in #root, met de taal in data-prerender. Klopt die taal met de taal van deze bezoeker, dan
// hydrateert React die HTML en is er niets opnieuw te tekenen. Wijst de taal van de bezoeker naar een andere taal dan de
// voorgerenderde, dan tekent React de pagina in die taal. Zonder prerender (404) bouwt React de pagina zelf op.
// 30 september 2026: een Duitse of Franse pagina haalt eerst de kern van haar woordenboek op, vóór het tekenen en vóór het
// hydrateren (zie scripts/woordenboek-split.mjs); Engels en Nederlands gaan meteen door.
async function start() {
  // 6 november 2026 (Indexworld M8): de taal volgt zonder netwerk uit pad, bewaarde keuze en browser (proposal/i18n/detect.ts).
  detectVisitorLanguage();
  const prerendered = rootElement!.dataset.prerender;
  const language = pageLanguage();
  await laadWoordenboek(language, "kern");
  if (prerendered === language) {
    ReactDOM.hydrateRoot(rootElement!, site(language));
    return;
  }
  ReactDOM.createRoot(rootElement!).render(site(language));
}
void start();
// Het lichtgevende stippenveld (golven bij hover en klik) laadt pas als de browser even vrij is: niet in het eerste script.
const stippenLater = () => import("./proposal/stippen").then((m) => m.siteVeld());
if ("requestIdleCallback" in window) requestIdleCallback(() => void stippenLater(), { timeout: 2500 });
else setTimeout(() => void stippenLater(), 1200);
