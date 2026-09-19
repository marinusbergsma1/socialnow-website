import React from "react";
import LegalPage from "./LegalPage";
import { documentVoorSlug } from "./legal-index";

// Eén pagina voor elk juridisch document — 19 september 2026.
//
// Voorwaarden en privacy hadden elk een eigen bestandje van vier regels. Met zeven documenten
// worden dat zeven van die bestandjes die alleen in een naam verschillen. Hier staat het één keer;
// de route geeft mee welk document het is.
export default function DocumentPage({ slug }: { slug: string }) {
  const d = documentVoorSlug(slug);
  // Een onbekende slug kan alleen ontstaan door een route die naar een verwijderd document wijst.
  // Dan liever niets tonen dan een leeg geraamte met een kop erboven.
  if (!d) return null;
  return <LegalPage doc={d.doc} path={d.path} slug={d.slug} />;
}
