import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./proposal/WebsiteProposal";
import { isLanguage, type Language } from "./proposal/i18n/context";
import "./proposal/website.css";
import "./proposal/experience.css";
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
async function start() {
  const prerendered = rootElement!.dataset.prerender;
  const lookup = needsCountryLookup();
  if (!lookup) await detectVisitorLanguage();
  const language = pageLanguage();
  if (prerendered === language) {
    const root = ReactDOM.hydrateRoot(rootElement!, site(language));
    if (!lookup) return;
    await detectVisitorLanguage();
    const detected = pageLanguage();
    if (detected !== language) root.render(site(detected));
    return;
  }
  await detectVisitorLanguage();
  ReactDOM.createRoot(rootElement!).render(site(pageLanguage()));
}
void start();
