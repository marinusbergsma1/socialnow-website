import React from "react";
import { Action, TextLink } from "./ui";
import { people } from "./content";
import "./mens-en-ai.css";

// 28 september 2026 (Marinus): AI wordt vaak verkeerd begrepen en mensen zijn er bang voor, terwijl wij vinden
// dat elke vorm van intelligentie goed is. Het verschil: een verbindende laag van mensen die altijd voor je
// klaarstaan. Iedereen kan nu gratis een bedrijf opzetten; onze pakketten en het OS op maat met onze experts
// maken het verschil. Altijd eerst gratis bewijzen, echt menselijk contact, plus een vacature voor een partij
// die die verbindende factor mee komt brengen nu duizenden bedrijven het OS gaan gebruiken.

const LAGEN = [
  {
    soort: "is-ai",
    label: "AI",
    titel: "Doet het werk",
    tekst: "Website, content, advertenties en je CRM. Snel, dag en nacht, zonder dat je er verstand van hoeft te hebben.",
  },
  {
    soort: "is-mens",
    label: "Mensen",
    titel: "De verbindende laag",
    tekst: "Ons team kijkt mee, denkt mee en staat altijd voor je klaar. Eén bericht en je hebt iemand aan de lijn.",
  },
  {
    soort: "is-jij",
    label: "Jij",
    titel: "Houdt de regie",
    tekst: "Jij beslist wat er gebeurt. Niets gaat live zonder jouw akkoord.",
  },
];

const OVERTUIGINGEN = [
  {
    titel: "Altijd eerst gratis bewijzen",
    tekst: "Je begint gratis met je eigen OS. Pas als je ziet dat het werkt, praten we over meer.",
  },
  {
    titel: "Echt contact, geen ticketnummer",
    tekst: "Bij de grote techbedrijven ben je een nummer. Bij ons ken je de mensen die aan je bedrijf werken.",
  },
  {
    titel: "Op maat, met onze experts",
    tekst: "Onze pakketten en het OS op maat zijn persoonlijke systemen, gebouwd en begeleid door ons team.",
  },
];

export default function MensEnAI() {
  const gezichten = people.filter((p) => p.image).slice(0, 7);
  return (
    <section className="h-mens h-wrap" id="mens-en-ai" aria-labelledby="mens-titel">
      <p className="h-eyebrow"><i />Mens en AI</p>
      <h2 id="mens-titel">
        Elke vorm van intelligentie is goed.
        <br />
        <span>Mensen maken het verschil.</span>
      </h2>

      <div className="h-mens-grid">
        <div className="h-mens-intro">
          <p className="h-mens-lead">
            AI wordt vaak verkeerd begrepen. In bijna elk gesprek merken we het: mensen zijn er bang voor.
          </p>
          <p>
            Wij zien het anders. AI maakt het voor iedereen mogelijk om gratis een bedrijf op te zetten en het
            binnen drie maanden winstgevend te maken. Maar technologie alleen is niet genoeg.
          </p>
          <p>
            Daarom zetten wij er een laag bovenop die de grote techbedrijven missen: mensen. Een team dat je kent,
            dat meedenkt en dat altijd voor je klaarstaat.
          </p>
        </div>

        <ol className="h-mens-lagen" aria-label="Hoe het OS werkt: drie lagen">
          {LAGEN.map((laag) => (
            <li key={laag.label} className={laag.soort}>
              <span className="h-mens-laag-label">{laag.label}</span>
              <span className="h-mens-laag-tekst">
                <b>{laag.titel}</b>
                <span>{laag.tekst}</span>
              </span>
              {laag.soort === "is-mens" && (
                <span className="h-mens-gezichten" aria-hidden="true">
                  {gezichten.map((p) => (
                    <img key={p.name} src={`/images/${p.image}`} alt="" width="40" height="40" loading="lazy" />
                  ))}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <ul className="h-mens-overtuigingen">
        {OVERTUIGINGEN.map((o, i) => (
          <li key={o.titel}>
            <span className="h-mens-nr" aria-hidden="true">0{i + 1}</span>
            <b>{o.titel}</b>
            <span>{o.tekst}</span>
          </li>
        ))}
      </ul>

      <div className="h-mens-belofte">
        <p className="h-mens-belofte-kop">
          Gratis starten.
          <br />
          <span>Winstgevend in drie maanden.</span>
        </p>
        <p className="h-mens-belofte-tekst">
          Daar zijn we zo van overtuigd dat we het eerst gratis bewijzen. Wil je sneller, dan bouwen onze experts
          een persoonlijk systeem op maat met je mee.
        </p>
        <div className="h-mens-belofte-knoppen">
          <Action href="https://app.socialnow.nl/login/">Start gratis</Action>
          <TextLink to="/prijzen">Pakketten en OS op maat</TextLink>
        </div>
      </div>

      <div className="h-mens-vacature">
        <div>
          <p className="h-mens-vacature-label"><i aria-hidden="true" />Vacature</p>
          <h3>Word de verbindende factor.</h3>
          <p>
            Duizenden bedrijven gaan het OS gebruiken. Achter elk van die bedrijven hoort een mens die meedenkt en
            klaarstaat. Daarvoor bouwen we een enorm team.
          </p>
          <p>
            We zoeken een partij, een bureau of een groep mensen, die die verbindende laag samen met ons brengt:
            persoonlijk contact, begeleiding en echte aandacht voor ondernemers.
          </p>
        </div>
        <div className="h-mens-vacature-actie">
          <ul>
            <li>Je houdt van mensen en van ondernemers</li>
            <li>Je ziet AI als hulp, niet als bedreiging</li>
            <li>Je wilt meegroeien met duizenden bedrijven</li>
          </ul>
          <TextLink to="/vacatures">Bekijk alle vacatures</TextLink>
        </div>
      </div>
    </section>
  );
}
