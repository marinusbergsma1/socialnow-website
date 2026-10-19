import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Bento, Tegel } from "./Bento";
import { people } from "./content";
import { klein } from "./licht";

// 18 oktober 2026 (Marinus): "Neem daarbij ook andere resultaten van mijn team mee." Er staan geen meetbare resultaten per
// teamlid in de repo, wel hun trackrecord: de merken waar ze voor werkten en hun eigen bedrijven. Bronnen, letterlijk:
// partnerReferences in content.ts en de door Marinus vastgelegde trackrecords (tak feat/trackrecords-20261007,
// docs/team-trackrecords-2026-10-07.md), Daniel via zijn rol in content.ts. Wie daar geen bron heeft, staat er niet in.
// Daarom heet de rij Trackrecord en niet Resultaten: een bedrijfsreferentie is geen klantresultaat.
// 19 oktober 2026 (Marinus): "haal de logo's weg. Doe maar gewoon Linkedin." Per persoon alleen nog een link naar het profiel
// uit content.ts (LinkedIn, anders Instagram); wie geen profiel heeft, krijgt geen link.
const NAMEN = [
  "Marinus Bergsma", "Jos Hollenberg", "Sergio Jovovic", "Nick van Keulen", "Steven Goudsblom", "Elian Coellar",
  "Sid van Kalken", "Douwe Kramer", "Steef Komen", "Michelle Yang", "Carmel Boon", "Sam van der Sluis",
  "Femke Oostendorp", "Armando van Bruggen", "Pepijn Bos", "Isaak Munster", "Daniel Schotman",
];

export default function TeamTrackrecord() {
  const rij = NAMEN.flatMap((naam) => people.filter((x) => x.name === naam));
  return (
    <Bento id="team-trackrecord" className="sn-team-trackrecord" label="Trackrecord van ons team" swipe>
      {rij.map((p) => (
        <Tegel key={p.name} breed={3} className="sn-trackrecord-tegel">
          <div className="sn-trackrecord-wie">
            <img {...klein(p.image, 56, [96, 160], undefined, "20261015-team")} alt={p.name} width="56" height="56" loading="lazy" />
            <p><b translate="no">{p.name}</b><span>{p.role}</span></p>
          </div>
          {(p.linkedin || p.instagram) && (
            <a className="sn-trackrecord-profiel" href={p.linkedin ?? p.instagram} target="_blank" rel="noopener noreferrer">
              <span translate="no">{p.linkedin ? "LinkedIn" : "Instagram"}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </Tegel>
      ))}
    </Bento>
  );
}
