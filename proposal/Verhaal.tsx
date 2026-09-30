import React from "react";
import CharacterAccent from "./CharacterAccent";
import { HeroReview } from "./CustomerReviews";
import LightArtStrook from "./LightArtStrook";
import { people } from "./content";
import { TextLink } from "./ui";
import { Bento, BentoFilm, Tegel } from "./Bento";
import { useLanguage } from "./i18n/context";
import { klein } from "./licht";

// 28 september 2026 (Marinus): "wat belangrijk was bij de beurs van Odoo is dat ik merkte dat het persoonlijke
// verhaal en waarom het OS gratis kan zijn". Later die nacht: "waar het om gaat is mijn verhaal hier gelijk verteld
// te hebben met HyperFrames en kleine tekst over mijn waarom en onze achtergrond", en daarna: "alle onderdelen als kleine
// bentogrids, net zoals de homepage wanneer je daarop landt". Bovenaan portret, waarom en film; daaronder het verhaal in
// acht tegels die op de telefoon zijwaarts swipen. Brontekst en bronnen: ~/Downloads/website-verhaal-2026-09-28/VERHAAL.md.

// De verhaalfilm uit HyperFrames. Zolang die er nog niet is, staat het waarom groot op zijn plek.
const VERHAALFILM: { en: string; nl: string; poster: { en: string; nl: string } } | null = {
  en: "/video/verhaal/verhaal-en.mp4", nl: "/video/verhaal/verhaal-nl.mp4",
  poster: { en: "/video/verhaal/verhaal-en-poster.webp", nl: "/video/verhaal/verhaal-nl-poster.webp" },
};

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
        <img className="is-horizon" src="/images/HORIZON-COLLEGE-LOGO.jpg" alt="Horizon College" loading="lazy" />
      </span>
    ),
  },
  {
    // 28 september 2026 (Marinus): zijn loopbaan begon als media manager bij Day & Nite, met hun logo als beeld.
    wanneer: "2019 tot 2020",
    titel: "Media manager bij Day & Nite.",
    tekst: "Mijn loopbaan begon bij evenementenbureau Day & Nite: social content, campagnes en drukwerk.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-logos" translate="no">
        <img className="is-daynite" src="/images/DAY-NITE-LOGO.svg" alt="Day & Nite" loading="lazy" />
      </span>
    ),
  },
  {
    wanneer: "2020",
    titel: "Corona stopte de evenementen.",
    tekst: "Toen begon ik voor mezelf, met opdrachten voor onder meer AZ en Supperclub.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-logos" translate="no">
        <img className="is-eigen" src="/images/merken/AZ-LOGO-KLEUR.svg" alt="AZ" loading="lazy" />
        <img src="/images/SUPPERCLUB-LOGO.webp" alt="Supperclub" loading="lazy" />
      </span>
    ),
  },
  {
    wanneer: "November 2021",
    titel: "SocialNow.",
    tekst: "In november 2026 bestaat SocialNow vijf jaar. Wat begon met mijn eigen bedrijf, groeide uit tot een team van specialisten.",
    breed: 3,
  },
  {
    wanneer: "De omslag",
    titel: "Toen AI beelden kon maken, gooide ik mijn plan om.",
    tekst: "Ik verdiepte me in AI en development. Het persoonlijke bleef de kern.",
    breed: 3,
    soort: "roze",
    beeld: <CharacterAccent kind="coder" />,
  },
  {
    // 30 september 2026 (Marinus): "Dat VASTIQ project is ook iets wat in mijn verhaal moet: hoe we een
    // vastgoedwaarderingsplatform hebben opgezet, ik en Steef samen, en toen vanaf daar het SocialNow OS."
    wanneer: "VASTIQ",
    titel: "Met Steef Komen zetten we VASTIQ op.",
    tekst: "Een waarderingsplatform voor vastgoed, van data tot merk. Steef is mijn accountant, Odoo-expert en datascientist. Vanuit VASTIQ ontstond SocialNow OS.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-vastiq">
        <img src="/images/cases/vastiq-waarde-640.webp" alt="VASTIQ: waardebepaling van een grachtenpand" width="640" height="360" loading="lazy" decoding="async" />
      </span>
    ),
  },
  {
    wanneer: "Het OS",
    titel: "Alle data van je bedrijf in één systeem.",
    tekst: "Wat we voor VASTIQ bouwden, werd SocialNow OS: branding, advertenties en Odoo als laatste sleutel.",
    breed: 3,
    beeld: (
      <span className="h-hoofdstuk-odoo" translate="no">
        <OdooLogo />
        <span>PRODUCT</span>
      </span>
    ),
  },
  {
    wanneer: "Nu",
    titel: "Van Brussel naar Odoo-partners wereldwijd.",
    tekst: "Het systeem van de Odoo-beurs brengen partners nu naar hun klanten. Het team en ik zijn ontzettend dankbaar.",
    breed: 3,
  },
];

function Waarom({ groot }: { groot?: boolean }) {
  return (
    <figure className={`h-verhaal-waarom${groot ? " is-groot" : ""}`}>
      <blockquote>
        <p>Ik wil ondernemers helemaal ontzorgen met de nieuwste technologie, zonder dat het persoonlijke verdwijnt.</p>
      </blockquote>
      <figcaption>
        <img {...klein("marinus-profiel-blauw.webp", 56)} alt="" width="56" height="56" loading="lazy" />
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
            <BentoFilm src={language === "nl" ? film.nl : film.en} poster={language === "nl" ? film.poster.nl : film.poster.en} label="Het verhaal van Marinus Bergsma" geluid={false} />
          </Tegel>
        ) : (
          <Tegel kop="Mijn waarom" breed={8}>
            <Waarom groot />
          </Tegel>
        )}
        {film && (
          <Tegel kop="Mijn waarom" breed={12}>
            <Waarom />
            <HeroReview />
            <LightArtStrook />
            <div className="sn-tegel-onder"><TextLink to="/projecten">Bekijk het werk achter mijn verhaal</TextLink></div>
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
