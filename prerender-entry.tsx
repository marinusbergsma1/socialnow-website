// 30 september 2026 (Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING"): de serverkant van de
// prerender. scripts/prerender.mjs bouwt dit bestand als SSR-bundel en rendert er bij het bouwen elke
// route per taal mee naar echte HTML; index.tsx hydrateert die HTML daarna in de browser.
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./proposal/WebsiteProposal";
import type { Language } from "./proposal/i18n/context";
// 30 september 2026: secties en pagina's laden in de browser later (proposal/later.tsx); scripts/prerender.mjs laadt ze
// hier eerst allemaal, zodat elke pagina volledig in de HTML staat.
export { allesVooraf } from "./proposal/later";

export function render(url: string, language: Language): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url} basename={language === "en" ? "/" : `/${language}`}>
        <App language={language} />
      </StaticRouter>
    </React.StrictMode>,
  );
}
