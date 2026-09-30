import React from "react";
import { BadgeCheck, Globe, KeyRound, LayoutGrid, Lock, type LucideIcon } from "lucide-react";
import { FILMS } from "./veiligheid-beloftes";
import "./veiligheid-milo.css";

// Veiligheids-Milo, 30 september 2026 (Marinus, bij de homepage-sectie "Veiligheid en databescherming":
// "Hier nog een geanimeerde veiligheidsmilo voor maken."). Vult de lege ruimte onder de vijf genummerde stappen
// in VeiligheidSpeler (pages.tsx) en beweegt mee met de film die speelt.
//
// Zelfde beeldtaal als de cookie-Milo (MiloKoekje.tsx): Milo rond op zwart met een groene rand. Daaromheen een ring
// van vijf delen, één per film; het deel van de actieve film licht groen op. Een groen datapakketje loopt van Milo
// naar een schild met het teken van die stap (slot, werkruimtes, vinkje, versleuteld verkeer, sleutel).
// Geen tekst: de stappen staan er al naast, dus Milo is decoratief (aria-hidden) en hoeft niet vertaald.
// Minder beweging (prefers-reduced-motion): alles staat stil, alleen de actieve stap wisselt nog.
const TEKENS: Record<string, LucideIcon> = {
  versleuteling: Lock,
  toegang: LayoutGrid,
  goedkeuring: BadgeCheck,
  infrastructuur: Globe,
  koppelingen: KeyRound,
};

// Ring van vijf delen rond Milo (viewBox 100, straal 46): 72 graden per stap, met een kleine opening ertussen.
const STRAAL = 46;
const OMTREK = 2 * Math.PI * STRAAL;
const DEEL = OMTREK / FILMS.length;
const OPENING = 5;

export default function VeiligheidMilo({ stap }: { stap: number }) {
  const slug = FILMS[stap]?.slug ?? FILMS[0].slug;
  const Teken = TEKENS[slug] ?? Lock;
  return (
    <div className="vm-milo" data-stap={slug} aria-hidden="true">
      <div className="vm-kern">
        <svg className="vm-ring" viewBox="0 0 100 100">
          <circle className="vm-ring-spoor" cx="50" cy="50" r="49" />
          {FILMS.map((film, index) => (
            <circle
              key={film.slug}
              className={`vm-ring-deel${index === stap ? " is-nu" : index < stap ? " is-gedaan" : ""}`}
              cx="50"
              cy="50"
              r={STRAAL}
              strokeDasharray={`${DEEL - OPENING} ${OMTREK - DEEL + OPENING}`}
              transform={`rotate(${-90 + index * (360 / FILMS.length) + (OPENING / OMTREK) * 180} 50 50)`}
            />
          ))}
        </svg>
        <div className="vm-portret">
          <img src="/images/milo-avatar-2026.webp" alt="" width={320} height={320} decoding="async" loading="lazy" />
          <i className="vm-scan" />
        </div>
      </div>
      <div className="vm-lijn">
        <i className="vm-pakket" />
      </div>
      <div className="vm-schild">
        <svg className="vm-schild-vorm" viewBox="0 0 64 72">
          <path d="M32 3 58 13v21c0 17-11 29-26 35C17 63 6 51 6 34V13L32 3Z" />
        </svg>
        <span className="vm-teken" key={slug}>
          <Teken size={26} strokeWidth={2.1} />
        </span>
      </div>
    </div>
  );
}
