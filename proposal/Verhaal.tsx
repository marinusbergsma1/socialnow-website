import React from "react";
import { people } from "./content";
import { Bento, BentoFilm, Tegel } from "./Bento";
import { useLanguage } from "./i18n/context";

// 28 september 2026 (Marinus): "wat belangrijk was bij de beurs van Odoo is dat ik merkte dat het persoonlijke
// verhaal en waarom het OS gratis kan zijn". Later die nacht: "waar het om gaat is mijn verhaal hier gelijk verteld
// te hebben met HyperFrames en kleine tekst over mijn waarom en onze achtergrond", en daarna: "alle onderdelen als kleine
// bentogrids, net zoals de homepage wanneer je daarop landt". Bovenaan portret, waarom en film; daaronder het verhaal in
// acht tegels die op de telefoon zijwaarts swipen. Brontekst en bronnen: ~/Downloads/website-verhaal-2026-09-28/VERHAAL.md.

// De verhaalfilm uit HyperFrames. Zolang die er nog niet is, staat het waarom groot op zijn plek.
const VERHAALFILM: { en: string; nl: string; poster: { en: string; nl: string } } | null = null;

export function OdooLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="140 146 640 250" role="img" aria-label="Odoo">
      <path fill="#8f8f8f" d="M695,346a75,75,0,1,1,75-75A75,75,0,0,1,695,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,695,315ZM538,346a75,75,0,1,1,75-75A75,75,0,0,1,538,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,538,315Zm-82-45c0,41.9-33.6,76-75,76s-75-34-75-75.9S336.5,196,381,196c16.4,0,31.6,3.5,44,12.6V165.1c0-8.3,7.3-15.1,15.5-15.1s15.5,6.8,15.5,15.1Zm-75,45a44,44,0,1,0-44-44A44,44,0,0,0,381,315Z" />
      <path fill="#714b67" d="M224,346a75,75,0,1,1,75-75A75,75,0,0,1,224,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,224,315Z" />
    </svg>
  );
}

type Hoofdstuk = { wanneer: string; titel: string; tekst: string; breed: 3 | 4 | 6; soort?: "vlak" | "roze"; beeld?: React.ReactNode };

const HOOFDSTUKKEN: Hoofdstuk[] = [
  {
    wanneer: "2019",
    titel: "Afgestudeerd als grafisch vormgever.",
    tekst: "Stage en eerste contract bij Amsterdam Light Festival.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-logos" translate="no">
        <img src="/images/AMSTERDAM-LIGHT-FESTIVAL-LOGO.webp" alt="Amsterdam Light Festival" loading="lazy" />
      </span>
    ),
  },
  {
    wanneer: "2019 tot 2021",
    titel: "Werken voor mooie merken.",
    tekst: "Media en design voor Day & Nite, merkvernieuwing en social advertising voor AZ, motion design voor Supperclub.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-logos" translate="no">
        <img className="is-eigen" src="/images/AZ-LOGO-FLYER.webp" alt="AZ" loading="lazy" />
        <img src="/images/SUPPERCLUB-LOGO.webp" alt="Supperclub" loading="lazy" />
      </span>
    ),
  },
  {
    wanneer: "November 2021",
    titel: "SocialNow.",
    tekst: "Na succes als freelancer begon ik mijn eigen bedrijf, met een team van specialisten om me heen.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-team" translate="no">
        {people.map((persoon) => (
          <img key={persoon.name} src={`/images/${persoon.image}`} alt={persoon.name} title={persoon.name} loading="lazy" />
        ))}
      </span>
    ),
  },
  {
    wanneer: "De omslag",
    titel: "Toen AI beelden kon maken, gooide ik mijn plan om.",
    tekst: "Ik verdiepte me in AI en development. Het persoonlijke bleef de kern.",
    breed: 3,
    soort: "roze",
    beeld: (
      <p className="h-hoofdstuk-motto" translate="no">
        Human creativity.
        <span>Powered by AI technology.</span>
      </p>
    ),
  },
  {
    wanneer: "Het afgelopen jaar",
    titel: "Van niets naar winstgevend en geautomatiseerd.",
    tekst: "We schaalden bedrijven vanaf nul op, met branding en advertenties op zelflerende systemen.",
    breed: 3,
    beeld: (
      <ul className="h-hoofdstuk-pillen">
        <li>Branding</li>
        <li>Advertenties</li>
        <li>Zelflerende systemen</li>
      </ul>
    ),
  },
  {
    wanneer: "Het OS",
    titel: "Alle data van je bedrijf in één systeem.",
    tekst: "Website en social media gekoppeld, met Odoo als laatste sleutel. Totale ontzorging, volledig inzicht.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-odoo" translate="no">
        <OdooLogo />
        <span>PRODUCT</span>
      </span>
    ),
  },
  {
    wanneer: "De partner",
    titel: "Met Steef Komen maakten we het schaalbaar.",
    tekst: "Mijn accountant, Odoo-expert en datascientist. Samen bouwen we ook VASTIQ, een dataplatform voor vastgoed.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-partner" translate="no">
        <img className="h-hoofdstuk-steef" src="/images/Steef-Komen.webp" alt="Steef Komen" loading="lazy" />
        <img className="h-hoofdstuk-komen" src="/images/komen-consultancy-logo.webp" alt="Komen Consultancy" loading="lazy" />
      </span>
    ),
  },
  {
    wanneer: "Nu",
    titel: "Van Brussel naar Odoo-partners wereldwijd.",
    tekst: "Het systeem van de Odoo-beurs brengen partners nu naar hun klanten. Het team en ik zijn ontzettend dankbaar.",
    breed: 3,
    beeld: (
      <img className="h-hoofdstuk-foto" src="/images/verhaal/team-atomium.webp" alt="Het SocialNow-team bij het Atomium in Brussel" width="900" height="1200" loading="lazy" />
    ),
  },
];

function Waarom({ groot }: { groot?: boolean }) {
  return (
    <figure className={`h-verhaal-waarom${groot ? " is-groot" : ""}`}>
      <blockquote>
        <p>Ik wil ondernemers helemaal ontzorgen met de nieuwste technologie, zonder dat het persoonlijke verdwijnt.</p>
      </blockquote>
      <figcaption>
        <img src="/images/marinus-profiel-blauw.webp" alt="" width="56" height="56" loading="lazy" />
        <span><strong>Marinus Bergsma</strong><span>Founder & CEO</span></span>
      </figcaption>
    </figure>
  );
}

export default function Verhaal() {
  const { language } = useLanguage();
  const film = VERHAALFILM;
  return (
    <>
      <Bento
        id="verhaal"
        className="h-verhaal"
        label="Het verhaal achter SocialNow"
        titel={<>Van grafisch vormgever<br /><span>tot jouw OS.</span></>}
      >
        <Tegel kop="Marinus Bergsma" breed={4} soort="foto" className="h-verhaal-portret">
          <img src="/images/marinus-profiel-blauw.webp" alt="Marinus Bergsma, oprichter van SocialNow" width="640" height="680" loading="lazy" />
          <span className="h-verhaal-jaren"><b>5</b>jaar in november</span>
        </Tegel>
        {film ? (
          <Tegel kop="Mijn verhaal in één minuut" breed={8} soort="film">
            <BentoFilm src={language === "nl" ? film.nl : film.en} poster={language === "nl" ? film.poster.nl : film.poster.en} label="Het verhaal van Marinus Bergsma" />
          </Tegel>
        ) : (
          <Tegel kop="Mijn waarom" breed={8}>
            <Waarom groot />
          </Tegel>
        )}
        {film && (
          <Tegel kop="Mijn waarom" breed={12}>
            <Waarom />
          </Tegel>
        )}
      </Bento>
      <Bento className="h-verhaal-hoofdstukken">
        {HOOFDSTUKKEN.map((hoofdstuk) => (
          <Tegel key={hoofdstuk.titel} kop={hoofdstuk.wanneer} breed={hoofdstuk.breed} soort={hoofdstuk.soort ?? "vlak"} className="h-hoofdstuk">
            <h3 className="sn-tegel-titel">{hoofdstuk.titel}</h3>
            <p className="sn-tegel-tekst">{hoofdstuk.tekst}</p>
            {hoofdstuk.beeld && <div className="h-hoofdstuk-beeld">{hoofdstuk.beeld}</div>}
          </Tegel>
        ))}
      </Bento>
    </>
  );
}
