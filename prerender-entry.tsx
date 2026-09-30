// 30 september 2026 (Marinus: "site VEEL SNELLER, WIL ECHT INSTANT LOADING"): de serverkant van de
// prerender. scripts/prerender.mjs bouwt dit bestand als SSR-bundel en rendert er bij het bouwen elke
// route per taal mee naar echte HTML; index.tsx hydrateert die HTML daarna in de browser.
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./proposal/WebsiteProposal";
import * as i18n from "./proposal/i18n/context";

export const LANGUAGES: readonly string[] = i18n.LANGUAGES;

// Laden de woordenboeken per taal (loadLanguage), dan moet dat vóór het renderen gebeuren, anders
// wordt elke taal Engels. Zonder loadLanguage zitten alle woordenboeken al in de bundel.
export async function prepare(language: string): Promise<void> {
  // Via de beschrijving, zodat de bouw niet waarschuwt zolang context.ts geen loadLanguage heeft.
  const load = Object.getOwnPropertyDescriptor(i18n, "loadLanguage")?.value;
  if (typeof load === "function") await load(language);
}

export function render(url: string, language: i18n.Language): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url} basename={language === "en" ? "/" : `/${language}`}>
        <App language={language} />
      </StaticRouter>
    </React.StrictMode>,
  );
}
