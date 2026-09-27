import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "./ui";
import { vacatures } from "./vacatures";
import { useLanguage } from "./i18n/context";
import "./mens-en-ai.css";

// 28 september 2026 (Marinus): de vacatures voor de verbindende laag en het team dat we nu nodig hebben.
// Solliciteren gaat per mail naar info@; de functie staat al in het onderwerp.

function mailLink(titel: string) {
  return `mailto:info@socialnow.nl?subject=${encodeURIComponent(`Sollicitatie: ${titel}`)}`;
}

export function VacaturesPage() {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState<string | null>(() =>
    typeof window !== "undefined" ? window.location.hash.slice(1) || null : null,
  );
  return (
    <>
      <PageHeading
        label="Werken bij SocialNow"
        title={
          <>
            Duizenden bedrijven.
            <br />
            <span>Elk met een mens erachter.</span>
          </>
        }
        text="AI doet het werk, mensen maken het verschil. Nu duizenden bedrijven het OS gaan gebruiken, bouwen we het team dat altijd voor ze klaarstaat."
      />
      <section className="h-wrap h-vac">
        <ul className="h-vac-lijst">
          {vacatures.map((v) => {
            const isOpen = open === v.slug;
            return (
              <li key={v.slug} id={v.slug} className={`h-vac-item${v.uitgelicht ? " is-uitgelicht" : ""}${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="h-vac-kop"
                  aria-expanded={isOpen}
                  aria-controls={`${v.slug}-inhoud`}
                  onClick={() => setOpen(isOpen ? null : v.slug)}
                >
                  <span className="h-vac-titel">
                    {v.uitgelicht && <span className="h-vac-badge">Uitgelicht</span>}
                    <b>{v.titel}</b>
                    <span>{v.kort}</span>
                  </span>
                  <span className="h-vac-meta">
                    <span>{v.soort}</span>
                    <span>{v.uren}</span>
                  </span>
                  <span className="h-vac-plus" aria-hidden="true" />
                </button>
                <div className="h-vac-inhoud" id={`${v.slug}-inhoud`} hidden={!isOpen}>
                  <div>
                    <h3>Wat je doet</h3>
                    <ul>{v.wat.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <div>
                    <h3>Wie je bent</h3>
                    <ul>{v.wie.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <a className="sn-btn3d h-button h-vac-knop" href={mailLink(t(v.titel))}>
                    <span className="sn-btn3d-sheen" />
                    <span>Solliciteer</span>
                    <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="h-vac-open">
          <h2>Staat jouw functie er niet tussen?</h2>
          <p>Vertel ons wat je kunt en waarom je gelooft in mens en AI samen. We lezen elke mail zelf.</p>
          <a className="h-text-link" href={mailLink("Open sollicitatie")}>
            Open sollicitatie
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
