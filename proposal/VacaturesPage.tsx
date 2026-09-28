import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "./ui";
import { people } from "./content";
import { vacatures, vacatureMail, VACATURE_MAIL, type Vacature } from "./vacatures";
import { useLanguage } from "./i18n/context";
import "./mens-en-ai.css";

// 28 september 2026 (Marinus): de vacatures voor de verbindende laag en het team dat we nu nodig hebben.
// Solliciteren gaat per mail naar offer@ (VACATURE_MAIL); Steef Komen beheert de vacatures. De functie staat al in het onderwerp.

function soortNaarSchema(soort: string) {
  const s = soort.toLowerCase();
  const uit: string[] = [];
  if (s.includes("loondienst")) uit.push("FULL_TIME");
  if (s.includes("parttime")) uit.push("PART_TIME");
  if (s.includes("freelance")) uit.push("CONTRACTOR");
  return uit.length ? uit : ["OTHER"];
}

// Google for Jobs leest deze gegevens; Indeed gebruikt dezelfde teksten uit vacatures.ts.
function JobPostings() {
  const data = vacatures.map((v: Vacature) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.titel,
    description: [v.kort, v.samen, ...v.wat, ...v.wie].filter(Boolean).map((regel) => `<p>${regel}</p>`).join(""),
    datePosted: "2026-09-28",
    validThrough: "2026-12-31",
    employmentType: soortNaarSchema(v.soort),
    hiringOrganization: { "@type": "Organization", name: "SocialNow", sameAs: "https://socialnow.nl", logo: "https://socialnow.nl/favicon.png", email: VACATURE_MAIL },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: "Amstelstraat 43G", addressLocality: "Amsterdam", postalCode: "1017 DA", addressCountry: "NL" } },
    ...(v.salarisMin && v.salarisMax
      ? { baseSalary: { "@type": "MonetaryAmount", currency: "EUR", value: { "@type": "QuantitativeValue", minValue: v.salarisMin, maxValue: v.salarisMax, unitText: "MONTH" } } }
      : {}),
    directApply: true,
    url: `https://socialnow.nl/vacatures#${v.slug}`,
  }));
  return <script type="application/ld+json" translate="no" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function VacaturesPage() {
  const steef = people.find((p) => p.name === "Steef Komen");
  const { t } = useLanguage();
  const [open, setOpen] = React.useState<string | null>(() =>
    typeof window !== "undefined" ? window.location.hash.slice(1) || null : null,
  );
  return (
    <>
      <JobPostings />
      <PageHeading
        label="Werken bij SocialNow"
        title={
          <>
            Klaar voor duizenden bedrijven.
            <br />
            <span>Elk met een mens erachter.</span>
          </>
        }
        text="AI doet het werk, mensen maken het verschil. Nu duizenden bedrijven het OS gaan gebruiken, bouwen we het team dat altijd voor ze klaarstaat."
      />
      <section className="h-wrap h-vac">
        {steef && (
          <aside className="h-vac-contact">
            <img src={`/images/${steef.image}`} alt="" width="72" height="72" loading="lazy" />
            <div>
              <p className="h-vac-contact-naam"><strong>{steef.name}</strong><span>{steef.role}</span></p>
              <p>Steef beheert onze vacatures en leest elke sollicitatie zelf. Vragen over een functie? Mail hem gerust.</p>
              <a className="h-text-link" href={`mailto:${VACATURE_MAIL}`}>
                {VACATURE_MAIL}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </aside>
        )}
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
                    {v.salaris && <span className="h-vac-salaris">{v.salaris}</span>}
                  </span>
                  <span className="h-vac-plus" aria-hidden="true" />
                </button>
                <div className="h-vac-inhoud" id={`${v.slug}-inhoud`} hidden={!isOpen}>
                  {(v.samen || v.plek) && (
                    <p className="h-vac-samen">{[v.plek, v.samen].filter(Boolean).map((r) => t(r!)).join(". ")}</p>
                  )}
                  <div>
                    <h3>Wat je doet</h3>
                    <ul>{v.wat.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <div>
                    <h3>Wie je bent</h3>
                    <ul>{v.wie.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <a className="sn-btn3d h-button h-vac-knop" href={vacatureMail(t(v.titel))}>
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
          <a className="h-text-link" href={vacatureMail("Open sollicitatie")}>
            Open sollicitatie
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
