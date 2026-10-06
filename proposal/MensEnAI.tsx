import React from "react";
import { TextLink } from "./ui";
import { people } from "./content";
import { Bento, Tegel } from "./Bento";
import "./mens-en-ai.css";
import { klein } from "./licht";

// 28 september 2026 (Marinus): AI wordt vaak verkeerd begrepen en mensen zijn er bang voor, terwijl wij vinden
// dat elke vorm van intelligentie goed is. Het verschil: een verbindende laag van mensen die altijd voor je
// klaarstaan. Iedereen kan nu gratis een bedrijf opzetten; onze pakketten en het OS op maat met onze experts
// maken het verschil. Altijd eerst gratis bewijzen en echt menselijk contact. De vacatures staan direct
// hieronder (VacaturesBento). Opgebouwd met de gedeelde tegeltaal uit Bento.tsx.

const LAGEN = [
  { soort: "is-ai", label: "AI", titel: "Doet het werk", tekst: "Website, content, advertenties en je CRM. Dag en nacht. De AI die je al gebruikt, koppel je er gewoon aan." },
  { soort: "is-mens", label: "Mensen", titel: "De verbindende laag", tekst: "Ons team denkt mee en staat altijd voor je klaar." },
  { soort: "is-jij", label: "Jij", titel: "Houdt de regie", tekst: "Niets gaat live zonder jouw akkoord." },
];

export default function MensEnAI() {
  const gezichten = people.filter((p) => p.image).slice(0, 7);
  return (
    <Bento
      id="mens-en-ai"
      label="Mens en AI"
      className="h-mens"
      titel={
        <>
          Elke vorm van intelligentie is goed.
          <br />
          <span>Mensen maken het verschil.</span>
        </>
      }
    >
      <Tegel kop="Waarom mensen bang zijn" breed={5}>
        <p className="sn-tegel-titel">AI wordt vaak verkeerd begrepen.</p>
        <p className="sn-tegel-tekst">
          In bijna elk gesprek merken we het. Wij zien het anders: met AI kan iedereen nu gratis een bedrijf
          opzetten. Maar technologie alleen is niet genoeg.
        </p>
      </Tegel>

      <Tegel kop="Wat wij erbovenop zetten" breed={7}>
        <ol className="h-mens-lagen" aria-label="Hoe het OS werkt: drie lagen">
          {LAGEN.map((laag) => (
            <li key={laag.label} className={laag.soort}>
              <span className="h-mens-laag-label">{laag.label}</span>
              <span className="h-mens-laag-tekst">
                <b>{laag.titel}</b>
                <span>{laag.tekst}</span>
              </span>
              {/* 5 oktober 2026 (Marinus): "Hier moet nog duidelijk die verbinding tussen ook alle AI's die ze al gebruiken."
                  Zonder modelnamen (vaste regel voor sitecopy): de assistent, editor en app die je al hebt, via één connector. */}
              {laag.soort === "is-ai" && (
                <span className="h-mens-ai-koppel">
                  <span>Jouw AI-assistent</span>
                  <span>Jouw code-editor</span>
                  <span>Jouw AI-app</span>
                  <i aria-hidden="true" />
                  <b translate="no">SocialNow OS · connector</b>
                </span>
              )}
              {laag.soort === "is-mens" && (
                <span className="h-mens-gezichten" aria-hidden="true">
                  {gezichten.map((p) => (
                    <img key={p.name} {...klein(p.image, 36)} alt="" width="36" height="36" loading="lazy" />
                  ))}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Tegel>

      <Tegel kop="Altijd eerst gratis bewijzen" breed={4}>
        <p className="sn-tegel-tekst">Je begint gratis met je eigen OS. Pas als het werkt, praten we over meer.</p>
      </Tegel>
      <Tegel kop="Echt contact, geen ticketnummer" breed={4}>
        <p className="sn-tegel-tekst">Bij de grote techbedrijven ben je een nummer. Bij ons ken je de mensen.</p>
      </Tegel>
      <Tegel kop="Op maat, met onze experts" breed={4}>
        <p className="sn-tegel-tekst">Onze pakketten en het OS op maat bouwen en begeleiden we persoonlijk.</p>
      </Tegel>

      <Tegel kop="Onze belofte" breed={12} soort="groen">
        <div className="h-mens-belofte">
          <p className="h-mens-belofte-kop">
            Gratis starten.
            <br />
            <span>Winstgevend in drie maanden.</span>
          </p>
          <p className="sn-tegel-tekst">
            Daar zijn we zo van overtuigd dat we het eerst gratis bewijzen. Wil je sneller, dan bouwen onze experts
            een persoonlijk systeem op maat met je mee.
          </p>
          <div className="sn-tegel-onder">
            <a className="os-claim sn-btn3d h-button" href="https://app.socialnow.nl/login/">
              <span className="sn-btn3d-sheen" />
              <span>Start gratis</span>
            </a>
            <TextLink to="/prijzen">Pakketten en OS op maat</TextLink>
          </div>
        </div>
      </Tegel>
    </Bento>
  );
}
