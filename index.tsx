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
import { detectVisitorLanguage, needsCountryLookup } from "./proposal/i18n/detect";

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
// hydrateert React die HTML en is er niets opnieuw te tekenen. Een bezoeker op een pad zonder taal en
// zonder bewaarde keuze ziet meteen de Engelse pagina; zegt de landopzoeking daarna een andere taal,
// dan wisselt de pagina alsnog, zoals vroeger. Zonder prerender (404) bouwt React de pagina zelf op.
// 30 september 2026: een Duitse of Franse pagina haalt eerst de kern van haar woordenboek op, vóór het tekenen en vóór het
// hydrateren (zie scripts/woordenboek-split.mjs); Engels en Nederlands gaan meteen door.
async function start() {
  const prerendered = rootElement!.dataset.prerender;
  const lookup = needsCountryLookup();
  if (!lookup) await detectVisitorLanguage();
  const language = pageLanguage();
  if (prerendered === language) {
    await laadWoordenboek(language, "kern");
    const root = ReactDOM.hydrateRoot(rootElement!, site(language));
    if (!lookup) return;
    await detectVisitorLanguage();
    const detected = pageLanguage();
    await laadWoordenboek(detected, "kern");
    // 11 oktober 2026: als transition, zodat React eerst de voorgerenderde HTML hydrateert. Direct renderen gaf bij een
    // Nederlandse browser op / React-fout #424 (update vóór de hydratie klaar was; daarna alles opnieuw getekend).
    if (detected !== language) React.startTransition(() => root.render(site(detected)));
    return;
  }
  await detectVisitorLanguage();
  await laadWoordenboek(pageLanguage(), "kern");
  ReactDOM.createRoot(rootElement!).render(site(pageLanguage()));
}
void start();
// Het lichtgevende stippenveld (golven bij hover en klik) laadt pas als de browser even vrij is: niet in het eerste script.
const stippenLater = () => import("./proposal/stippen").then((m) => m.siteVeld());
if ("requestIdleCallback" in window) requestIdleCallback(() => void stippenLater(), { timeout: 2500 });
else setTimeout(() => void stippenLater(), 1200);
