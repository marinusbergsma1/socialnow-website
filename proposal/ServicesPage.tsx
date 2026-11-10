import React from "react";
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Globe2, Layers3, ShieldCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { DIENSTEN } from "./Producten";
import { GroeiPakketten, OsPakketten } from "./Pricing";
import { boekingsPlannerUrl } from "./PlanCall";
import { Action, ProjectCard, TextLink } from "./ui";
import { projects } from "./projecten";

type Pakket = {
  naam: string;
  punten: readonly string[];
};

const cybersecurity: Pakket[] = [
  {
    naam: "Odoo Veiligheidscheck",
    punten: ["Controle van toegang, koppelingen en back-upafspraken", "Kort rapport met prioriteiten"],
  },
  {
    naam: "Odoo Basisbeveiliging",
    punten: ["Afgesproken verbeteringen doorvoeren", "Herstel testen in een afgescheiden omgeving"],
  },
  {
    naam: "Odoo Veiligheidsbeheer",
    punten: ["Periodieke controle van je Odoo-omgeving", "Overzicht van nieuwe risico’s en acties"],
  },
];

const iconen = [TrendingUp, ShieldCheck, Globe2, Layers3] as const;
const caseSlugs = ["kwh-garant-website", "divine-machines-website"];
const cases = caseSlugs.flatMap((slug) => projects.find((project) => project.slug === slug) ?? []);

function SectieKop({ nr, titel, uitleg }: { nr: number; titel: string; uitleg: string }) {
  const dienst = DIENSTEN[nr];
  const Icon = iconen[nr];
  return <header className="svc-section-head">
    <div className="svc-section-mark">
      <Icon size={20} aria-hidden="true" />
      <span aria-hidden="true">{String(nr + 1).padStart(2, "0")} /</span>
      <span>{dienst.titel}</span>
    </div>
    <h2 id={`${dienst.soort}-kop`}>{titel}</h2>
    <p>{uitleg}</p>
  </header>;
}

function Punten({ punten }: { punten: readonly string[] }) {
  return <ul className="svc-checklist">{punten.map((punt) => (
    <li key={punt}><Check size={16} aria-hidden="true" /><span>{punt}</span></li>
  ))}</ul>;
}

function Bedrag({ prijs, grondslag, vanaf = true }: { prijs: string; grondslag: string; vanaf?: boolean }) {
  return <p className="svc-price">
    {vanaf && <span className="svc-from">Vanaf</span>}
    <strong>{prijs}</strong>
    <span className="svc-unit">{grondslag}</span>
  </p>;
}

function Pakketten({ pakketten }: { pakketten: readonly Pakket[] }) {
  return <div className="svc-package-grid">{pakketten.map((pakket) => (
    <article key={pakket.naam} className="svc-package">
      <h3>{pakket.naam}</h3>
      <p className="svc-unit">Prijs op aanvraag</p>
      <Punten punten={pakket.punten} />
    </article>
  ))}</div>;
}

// Oude links blijven landen bij het overeenkomstige aanbod.
function Ankers({ ids }: { ids: string[] }) {
  return <>{ids.map((id) => <span className="svc-alias" id={id} key={id} aria-hidden="true" />)}</>;
}

export default function ServicesPage() {
  return (
    <div className="svc">
      <section className="svc-hero" aria-labelledby="diensten-kop">
        <div className="h-wrap svc-hero-inner">
          <div className="svc-hero-copy">
            <p className="svc-kicker"><span aria-hidden="true" /> Diensten</p>
            <h1 id="diensten-kop">Samen bouwen aan <em>je volgende stap.</em></h1>
            <p className="svc-intro">Van meer klanten tot een bedrijf dat beter draait. Kies waar je aan wilt werken en zie wat je krijgt en wat het kost.</p>
            <div className="svc-actions">
              <Action href={boekingsPlannerUrl}>Plan een kennismaking</Action>
              <TextLink to="/projecten">Bekijk klantcases</TextLink>
            </div>
          </div>
          <nav className="svc-index" aria-label="Kies een dienst">
            <p className="svc-index-label"><span>Kies je startpunt</span><span aria-hidden="true">01–04</span></p>
            {DIENSTEN.map((dienst, i) => {
              const Icon = iconen[i];
              return <Link key={dienst.soort} to={dienst.naar} data-dienst={dienst.soort}>
                <span className="svc-index-icon"><Icon size={20} aria-hidden="true" /></span>
                <span><b>{dienst.titel}</b><span className="svc-index-detail">{dienst.regel}</span></span>
                <ArrowDown size={17} aria-hidden="true" />
              </Link>;
            })}
          </nav>
        </div>
      </section>

      <div id="prijzen" className="h-wrap svc-content">
        <div className="svc-price-note">
          <p>Hier vind je de prijsindicaties. We spreken vooraf af wat er binnen je offerte valt.</p>
        </div>

        <section className="svc-section" id="groei" aria-labelledby="groei-kop">
          <Ankers ids={["prijs-growth", "seo", "advertising", "content", "branding"]} />
          <SectieKop nr={0} titel="Van groeivraag naar uitvoering." uitleg="Werk één op één met Marinus aan je koers, of kies een marketingpakket voor de uitvoering." />
          <article className="svc-feature svc-personal">
            <img src="/images/marinus-profiel-blauw.webp" alt="Marinus Bergsma" width="1254" height="1254" loading="lazy" decoding="async" />
            <div className="svc-feature-copy">
              <p className="svc-kicker">Uitsluitend met Marinus</p>
              <h3>Persoonlijke groei</h3>
              <p>Marinus werkt zelf met je aan je aanbod, verkoop en groeikeuzes. Je eindigt met een plan voor de komende 90 dagen en weet welke acties eerst komen.</p>
              <Bedrag prijs="€3.000,-" grondslag="per maandelijks traject" />
              <a className="svc-link" href={boekingsPlannerUrl}>Bespreek je groeivraag <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </article>

          <h3 className="svc-subheading">Marketingpakketten</h3>
          <GroeiPakketten />
          <div className="svc-section-foot">
            <p>Mediabudget, betaalde tools en extra producties vallen buiten de pakketprijs. De omvang en looptijd spreken we vooraf af.</p>
            <a className="svc-link" href={boekingsPlannerUrl}>Bespreek je marketing <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="svc-section" id="cybersecurity" aria-labelledby="cybersecurity-kop">
          <Ankers ids={["prijs-cybersecurity"]} />
          <SectieKop nr={1} titel="Weet waar je kwetsbaar bent." uitleg="Controleer wie bij je Odoo-data kan, verbeter je instellingen en houd zicht op nieuwe risico’s." />
          <Pakketten pakketten={cybersecurity} />
          <div className="svc-section-foot">
            <p>De gratis websitecheck bekijkt de buitenkant van je site. Deze pakketten gaan over je Odoo-omgeving. We spreken vooraf af wat we mogen controleren of wijzigen. Licenties, penetratietests en incidentrespons vallen buiten de pakketten.</p>
            <div className="svc-section-links">
              <a className="svc-link" href={boekingsPlannerUrl}>Bespreek je beveiliging <ArrowUpRight size={17} aria-hidden="true" /></a>
              <TextLink to="/security">Bekijk de gratis websitecheck</TextLink>
            </div>
          </div>
        </section>

        <section className="svc-section" id="websites" aria-labelledby="websites-kop">
          <Ankers ids={["development"]} />
          <SectieKop nr={2} titel="Een website die aanvragen oplevert." uitleg="Van een compacte bedrijfssite tot een uitgebreider ontwerp met meer pagina’s en koppelingen." />
          <article className="svc-feature svc-website">
            <div className="svc-feature-copy">
              <h3>Website op maat</h3>
              <Bedrag prijs="€2.000–€5.000" grondslag="per project" vanaf={false} />
              <Punten punten={["Ontwerp en bouw voor desktop en mobiel", "Contactformulier en technische SEO-basis", "Oplevering met uitleg voor je team"]} />
              <p>Het aantal pagina’s en de gewenste koppelingen bepalen waar je in de bandbreedte uitkomt. Hosting, onderhoud en licenties spreken we apart af.</p>
              <a className="svc-link" href={boekingsPlannerUrl}>Bespreek je website <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <figure>
              <div className="svc-live-preview">
                <iframe
                  title="Live website van kWh Garant"
                  src="https://kwhgarant.nl/"
                  loading="lazy"
                  tabIndex={-1}
                  aria-hidden="true"
                  sandbox="allow-scripts allow-same-origin"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <figcaption><a className="svc-link" href="https://kwhgarant.nl/" target="_blank" rel="noopener noreferrer">Bekijk kWh Garant live <ArrowUpRight size={17} aria-hidden="true" /></a></figcaption>
            </figure>
          </article>
        </section>

        <section className="svc-section" id="management-operations" aria-labelledby="management-operations-kop">
          <Ankers ids={["prijs-erp-crm", "ai"]} />
          <SectieKop nr={3} titel="Meer grip op je dagelijkse operatie." uitleg="Breng processen, verantwoordelijkheden en cijfers bij elkaar, zodat je team weet wie wat doet en waar het kan bijsturen." />
          <article className="svc-feature svc-operations">
            <div className="svc-feature-copy">
              <p className="svc-kicker">Persoonlijk traject</p>
              <h3>Management &amp; Operations</h3>
              <Bedrag prijs="€10.000" grondslag="per traject" />
              <a className="svc-link" href={boekingsPlannerUrl}>Bespreek je operatie <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <div className="svc-feature-copy">
              <Punten punten={["Doorlichting van processen, rollen en knelpunten", "Werkafspraken en een overzicht van de belangrijkste cijfers", "Begeleiding bij invoering, bijvoorbeeld met Odoo, CRM of een eigen OS"]} />
              <p>Het aantal teams, processen en koppelingen bepaalt de offerte. Softwarelicenties en aanvullend maatwerk begroten we apart.</p>
            </div>
          </article>
        </section>

        <section className="svc-section svc-cases" aria-labelledby="diensten-cases-kop">
          <header className="svc-section-head">
            <p className="svc-kicker">Klantcases</p>
            <h2 id="diensten-cases-kop">Zo ziet ons werk eruit.</h2>
          </header>
          <div className="svc-case-grid">{cases.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
          <TextLink to="/projecten">Bekijk alle klantcases</TextLink>
        </section>

        <section className="svc-close" aria-labelledby="diensten-afspraak-kop">
          <Ankers ids={["connect", "team", "prijs-maat-titel"]} />
          <div>
            <p className="svc-kicker">Kennismaken</p>
            <h2 id="diensten-afspraak-kop">Waar wil je mee beginnen?</h2>
            <p>Vertel ons wat je wilt bereiken. Samen bepalen we wat past en welke kosten je kunt verwachten.</p>
            <TextLink to="/team#team">Ontmoet het team</TextLink>
          </div>
          <Action href={boekingsPlannerUrl}>Plan een kennismaking</Action>
        </section>

        <details className="svc-os" id="prijs-os-titel">
          <summary>SocialNow OS-abonnementen <ChevronDown size={17} aria-hidden="true" /></summary>
          <OsPakketten />
        </details>
      </div>
    </div>
  );
}
