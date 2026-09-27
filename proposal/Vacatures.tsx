import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { vacatures, sollicitatieMail, type Vacature } from "./vacaturelijst";
import "./vacatures.css";

// 28 september 2026 (Marinus): vacatures als bentotegels, in dezelfde taal als het landingsscherm:
// kopje met groene stip, donkere tegels met ronde hoek en dunne rand, pilknoppen.

function Solliciteer({ vacature }: { vacature: Vacature }) {
  return vacature.indeed ? (
    <a className="h-vac-knop" href={vacature.indeed} target="_blank" rel="noopener noreferrer">
      Solliciteer via Indeed
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  ) : (
    <a className="h-vac-knop" href={sollicitatieMail(vacature.titel)}>
      Solliciteer direct
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

function Tegel({ vacature, groot }: { vacature: Vacature; groot?: boolean }) {
  return (
    <article className={groot ? "h-vac-tegel h-vac-groot" : "h-vac-tegel"}>
      <p className="h-vac-plek">{vacature.plek}</p>
      <h3>{vacature.titel}</h3>
      <p className="h-vac-kort">{vacature.kort}</p>
      <ul className="h-vac-feiten">
        <li>{vacature.uren}</li>
        <li>{vacature.salaris}</li>
      </ul>
      {groot && (
        <>
          <ul className="h-vac-lijst">
            {vacature.taken.slice(0, 3).map((regel) => (
              <li key={regel}>{regel}</li>
            ))}
          </ul>
          <p className="h-vac-samen">{vacature.samen}</p>
        </>
      )}
      <div className="h-vac-acties">
        <Link className="h-vac-lees" to={`/vacatures#${vacature.slug}`}>
          Lees meer
        </Link>
        <Solliciteer vacature={vacature} />
      </div>
    </article>
  );
}

export function VacaturesBento() {
  const [eerste, ...rest] = vacatures;
  return (
    <section className="h-section h-wrap h-vac" id="vacatures">
      <p className="h-vac-kop">Wij zoeken</p>
      <div className="h-vac-bento">
        <Tegel vacature={eerste} groot />
        {rest.map((vacature) => (
          <Tegel key={vacature.slug} vacature={vacature} />
        ))}
        <Link className="h-vac-tegel h-vac-open" to="/vacatures">
          <span>Alle vacatures</span>
          <strong>Werk aan het OS dat bedrijven gratis gebruiken.</strong>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

// Google for Jobs leest deze gegevens; Indeed gebruikt dezelfde teksten uit vacatures.ts.
function JobPostings() {
  const data = vacatures.map((v) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.titel,
    description: [v.kort, v.samen, ...v.taken, ...v.jij].map((regel) => `<p>${regel}</p>`).join(""),
    datePosted: "2026-09-28",
    validThrough: "2026-12-31",
    employmentType: "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "SocialNow", sameAs: "https://socialnow.nl", logo: "https://socialnow.nl/favicon.png" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Amsterdam", postalCode: "1017 DA", addressCountry: "NL" } },
    baseSalary: { "@type": "MonetaryAmount", currency: "EUR", value: { "@type": "QuantitativeValue", minValue: v.salarisMin, maxValue: v.salarisMax, unitText: "MONTH" } },
    directApply: !v.indeed,
    url: `https://socialnow.nl/vacatures#${v.slug}`,
  }));
  return <script type="application/ld+json" translate="no" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function VacaturesPage() {
  return (
    <div className="h-vac-pagina">
      <JobPostings />
      <section className="h-section h-wrap h-vac">
        <p className="h-vac-kop">Vacatures</p>
        <h1 className="h-vac-titel">
          Bouw mee aan het OS.
          <br />
          <span>Met mensen die weten wat ze doen.</span>
        </h1>
        <div className="h-vac-bento">
          {vacatures.map((vacature, index) => (
            <Tegel key={vacature.slug} vacature={vacature} groot={index === 0} />
          ))}
        </div>
      </section>
      {vacatures.map((vacature) => (
        <section className="h-wrap h-vac h-vac-detail" id={vacature.slug} key={vacature.slug}>
          <p className="h-vac-kop">{vacature.titel}</p>
          <div className="h-vac-bento">
            <div className="h-vac-tegel h-vac-groot">
              <p className="h-vac-plek">{vacature.plek}</p>
              <h2>{vacature.titel}</h2>
              <p className="h-vac-kort">{vacature.kort}</p>
              <p className="h-vac-samen">{vacature.samen}</p>
              <ul className="h-vac-feiten">
                <li>{vacature.uren}</li>
                <li>{vacature.salaris}</li>
              </ul>
              <div className="h-vac-acties">
                <Solliciteer vacature={vacature} />
              </div>
            </div>
            <div className="h-vac-tegel">
              <h3>Wat je doet</h3>
              <ul className="h-vac-lijst">
                {vacature.taken.map((regel) => (
                  <li key={regel}>{regel}</li>
                ))}
              </ul>
            </div>
            <div className="h-vac-tegel">
              <h3>Wat je meebrengt</h3>
              <ul className="h-vac-lijst">
                {vacature.jij.map((regel) => (
                  <li key={regel}>{regel}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
