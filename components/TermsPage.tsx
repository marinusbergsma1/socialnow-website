import React from "react";
import DocumentPage from "./DocumentPage";

// 19 september 2026: dit scherm haalt zijn tekst nu uit components/legal-index.ts, zoals de vijf
// andere juridische documenten. Zo staat er op elke pagina dezelfde pdf-knop en dezelfde
// verwijzing naar de hub, zonder dat dat per pagina onderhouden moet worden.
const Pagina: React.FC = () => <DocumentPage slug="voorwaarden" />;
export default Pagina;
