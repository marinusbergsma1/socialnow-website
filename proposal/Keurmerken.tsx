import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "./i18n/context";

// Keurmerken — 23 september 2026, voor de beurs van 24 september.
//
// Drie eigen badges, elk voor iets wat vandaag aantoonbaar klopt en waar de badge naartoe linkt:
// de verwerkersovereenkomst (AVG artikel 28), de beveiligingsmaatregelen (artikel 32) en de eigen
// sleutel per werkruimte. Bewust géén SOC 2, HIPAA of ISO: dat zijn certificaten van een externe
// auditor en die hebben we niet. De SOC 2-badge "in voorbereiding" bestaat, maar komt hier pas bij
// als er een traject getekend is. De tekst zit in het beeld, dus per taal een eigen bestand;
// talen zonder eigen versie krijgen het Engels. Link zet de taalmap er zelf voor.
const BADGES = [
  { id: "privacy", pad: "/verwerkersovereenkomst", nl: "AVG: gebouwd volgens de AVG, verwerkersovereenkomst standaard", en: "GDPR: built for the GDPR, data processing agreement included" },
  { id: "veiligheid", pad: "/beveiliging", nl: "Veilig: versleuteld verkeer en opslag, maatregelen openbaar", en: "Secure: encrypted in transit and at rest, safeguards published" },
  { id: "sleutels", pad: "/beveiliging", nl: "Eigen sleutels: eigen sleutel per werkruimte", en: "Your keys: own key per workspace" },
] as const;

export default function Keurmerken({ className = "" }: { className?: string }) {
  const { language } = useLanguage();
  const taal = language === "nl" ? "nl" : "en";
  return (
    <>
    <div className={`h-keurmerken ${className}`} translate="no">
      {BADGES.map((b) => (
        <Link key={b.id} to={b.pad} title={b[taal]}>
          <img src={`/images/keurmerk/${b.id}-${taal}.webp`} alt={b[taal]} width={120} height={120} loading="lazy" decoding="async" />
        </Link>
      ))}
    </div>
    {/* 28 september 2026: kleine vermelding van de sleutelbelofte bij de keurmerken, buiten translate="no" zodat hij vertaald wordt. */}
    <Link className="vh-keurmerk-link" to="/veiligheid">
      <ShieldCheck size={15} aria-hidden="true" />
      <span>Sleutelbelofte en veiligheidsfilm</span>
    </Link>
    </>
  );
}
