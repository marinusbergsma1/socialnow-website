import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "./i18n/context";
import { REVIEWS_URL } from "./os-entry";
import { ArrowUpRight, Quote } from "lucide-react";

// Klantreacties uit BlijeKlanten. De projectteksten volgen de kennismakingsmail.
const customerReviews = [
  {
    name: "Ellen Sluijs",
    company: "kWh Garant",
    slug: "kwh-garant-website",
    caseImage: "/images/cases/kwhgarant-desktop.webp",
    work: "Voor kWh Garant maakten we Odoo overzichtelijker, verzorgden we de volledige branding en contentstrategie en bouwden we vanuit een gratis websitedemo een nieuwe website.",
    result: "Dat leverde in de eerste week 100 leads op.",
    website: "https://kwhgarant.nl/",
    image: "/images/Ellen-Sluijs.webp",
    text: "Wij zijn heel erg blij met Marinus. Denkt goed mee en levert op tijd. Topper!",
  },
  {
    name: "Mike Bregman",
    company: "VDZ Brigade",
    slug: "vdz-brigade-website",
    caseImage: "/screenshots/vdz-brigade-hero.webp",
    work: "Samen met Mike bouwden we de online zichtbaarheid van VDZ Brigade vanaf nul op, met een nieuwe website, een herkenbare huisstijl en een duidelijke groeistrategie.",
    result: "VDZ Brigade behaalde € 100.000 omzet in één maand.",
    website: "https://vdz-brigade.nl/",
    image: "/images/klantlogos/vdz-beeldmerk-donker.png",
    logo: true,
    text: "Zeer tevreden over dit bedrijf. Wat deze mannen neerzetten in zo’n korte tijd ongelofelijk. Wij gaan zomaar niet weg. Echt een aanrader. Inmiddels al zakenrelaties doorgestuurd. Ga zo door!!",
  },
  {
    name: "Hussein Awqati",
    company: "Divine Machines",
    slug: "divine-machines-website",
    caseImage: "/screenshots/divine-machines-hero.webp",
    work: "Samen met Jacinto en Hussein bouwden we voor Divine Machines een website die laat zien wat hun eiwitautomaten kunnen en hoe ze werken.",
    website: "https://divinemachines.nl/",
    image: "/images/Hussein.webp",
    text: "Erg tevreden met de ervaring en kennis van de team van socialnow. Via via zijn wij in contact gekomen en sindsdien is socialnow de designer van Divine Machines. Ga zo door!",
  },
  {
    name: "Albert Deltour",
    company: "Light Art Collection",
    slug: "light-art-collection",
    caseImage: "/images/Light-Art-Collection.webp",
    work: "Wat begon tijdens Marinus’ stage groeide uit tot een jarenlange samenwerking met Albert. We maken internationale presentaties en laten met artist impressions zien hoe lichtkunst op locatie tot leven komt.",
    website: "https://lightart-collection.com/",
    image: "/images/klein/Albert-Deltour-160.webp",
    text: "Van ambitieuze en talentvolle stagiair tot een betrouwbare partner. Zo zou ik Marinus omschrijven.",
  },
];
export default function CustomerReviews({ resultaten = false }: { resultaten?: boolean }) {
  const { language } = useLanguage();
  const Heading = resultaten ? "h1" : "h2";

  return (
    <section className="h-wrap h-customer-reviews" id="ervaring" aria-labelledby="customer-reviews-title">
      <header className="h-reviews-heading">
        <div>
          <p className="h-review-label">Uit de praktijk</p>
          <Heading id="customer-reviews-title">Ons werk en wat klanten zeggen</Heading>
        </div>
        <a className="h-review-link" href={REVIEWS_URL} target="_blank" rel="noopener noreferrer">
          Bekijk de reviews op Google <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>
      <div className="h-review-cases" id="klantcases">
        {customerReviews.map(review => (
          <article key={review.slug} className="sn-cta-web h-review-case" aria-labelledby={`case-${review.slug}`}>
            <div className="h-review-case-copy">
              <p className="sn-cta-web-label"><i aria-hidden="true" />Case</p>
              <h3 id={`case-${review.slug}`} translate="no">{review.company}</h3>
              <p className="sn-cta-web-tekst">{review.work}{review.result && <> <strong>{review.result}</strong></>}</p>
              <figure>
                <Quote size={18} aria-hidden="true" />
                <blockquote lang={language}>{review.text}</blockquote>
                <figcaption>
                  <img
                    src={review.image}
                    alt=""
                    className={review.logo ? "h-review-logo" : ""}
                    width="40"
                    height="40"
                    loading="lazy"
                  />
                  <strong translate="no">{review.name}</strong>
                </figcaption>
              </figure>
              <Link className="sn-pill" to={`/project/${review.slug}`} aria-labelledby={`open-case-${review.slug} case-${review.slug}`}>
                <span id={`open-case-${review.slug}`}>Bekijk de case</span><ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="h-review-case-media">
              <a className="h-review-link" href={review.website} aria-labelledby={`website-${review.slug} case-${review.slug}`}>
                <span id={`website-${review.slug}`}>Website</span> <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <img src={review.caseImage} alt="" width="1440" height="900" loading="lazy" decoding="async" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
