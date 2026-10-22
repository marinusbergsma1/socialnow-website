import React from "react";
import CharacterAccent from "./CharacterAccent";
import LinkedInMark from "./LinkedInMark";
import { TextLink } from "./ui";
import { Bento, BentoFilm, Tegel } from "./Bento";
import { klein } from "./licht";
import { SamenParen } from "./SamenEnVeilig";
import "./verhaal-story.css";


// 28 september 2026 (Marinus): "wat belangrijk was bij de beurs van Odoo is dat ik merkte dat het persoonlijke
// verhaal en waarom het OS gratis kan zijn". Later die nacht: "waar het om gaat is mijn verhaal hier gelijk verteld
// te hebben met HyperFrames en kleine tekst over mijn waarom en onze achtergrond", en daarna: "alle onderdelen als kleine
// bentogrids, net zoals de homepage wanneer je daarop landt". Bovenaan portret, waarom en film; daaronder het verhaal in
// acht tegels die op de telefoon zijwaarts swipen. Brontekst en bronnen: ~/Downloads/website-verhaal-2026-09-28/VERHAAL.md.

export function OdooLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="140 146 640 250" role="img" aria-label="Odoo">
      <path fill="#8f8f8f" d="M695,346a75,75,0,1,1,75-75A75,75,0,0,1,695,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,695,315ZM538,346a75,75,0,1,1,75-75A75,75,0,0,1,538,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,538,315Zm-82-45c0,41.9-33.6,76-75,76s-75-34-75-75.9S336.5,196,381,196c16.4,0,31.6,3.5,44,12.6V165.1c0-8.3,7.3-15.1,15.5-15.1s15.5,6.8,15.5,15.1Zm-75,45a44,44,0,1,0-44-44A44,44,0,0,0,381,315Z" />
      <path fill="#714b67" d="M224,346a75,75,0,1,1,75-75A75,75,0,0,1,224,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,224,315Z" />
    </svg>
  );
}

type Hoofdstuk = { wanneer: string; titel: string; tekst: string; breed: 3 | 4 | 6; soort?: "vlak" | "roze"; beeld?: React.ReactNode; linkedin?: { naam: string; url: string } };

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
    // 5 oktober 2026 (Marinus): "Deze tile gwn zwart houden." Niet meer roze; het zwarte vlak van Milo valt dan weg.
    beeld: <CharacterAccent kind="coder" />,
  },
  {
    // 30 september 2026 (Marinus): "Dat VASTIQ project is ook iets wat in mijn verhaal moet: hoe we een
    // vastgoedwaarderingsplatform hebben opgezet, ik en Steef samen, en toen vanaf daar het SocialNow OS."
    wanneer: "VASTIQ",
    titel: "Met Steef Komen zetten we VASTIQ op.",
    tekst: "Een waarderingsplatform voor vastgoed, van data tot merk. Steef is mijn accountant, Odoo-expert en datascientist. Vanuit VASTIQ ontstond SocialNow OS.",
    breed: 3,
    // 5 oktober 2026 (Marinus): "Hier mag nog wel Linkedin naar Steef Komen bij plus de oude video met dat huis dan heb je
    // ze alle 2." De oude inzoomfilm naar het grachtenpand (vastiq-zoom-v2, d61836d) hier; de uitzoomfilm staat bij Bereikt.
    linkedin: { naam: "Steef Komen", url: "https://www.linkedin.com/in/steef-komen-60632236/" },
    beeld: (
      <span className="h-hoofdstuk-vastiq">
        <BentoFilm src="/video/vastiq/vastiq-inzoom.mp4" poster="/video/vastiq/vastiq-inzoom-poster.webp" label="VASTIQ: inzoomen op een grachtenpand met zijn waarde" geluid={false} />
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

// 22 oktober 2026 (Marinus): "ik wil een compleet redesign van team en mijn story. Ook graag mijn story video wil ik erin niet
// alleen dit zo groot en totaal uit verhouding allemaal. [...] Ook moet hier juist die samenwerking staan met Uncanny en Indexworld."
// Dus bovenaan een rustig raster: portret in een vaste verhouding links, de storyfilm groot rechts met het waarom eronder.
// De Artist Impressions en de review staan op /projecten en hier niet meer. Daaronder de samenwerking met Indexworld en Uncanny.
const STORYFILM = "/video/verhaal/story-presentatie.mp4?v=story-short-20261013";
const STORYPOSTER = "/video/verhaal/story-presentatie-poster.jpg";

export default function Verhaal() {
  return (
    <>
      <section className="h-section h-wrap vs-story" id="verhaal" aria-labelledby="vs-story-titel">
        <p className="h-eyebrow">Het verhaal achter SocialNow</p>
        <h2 id="vs-story-titel">Van grafisch vormgever<br /><span>tot jouw OS.</span></h2>
        <div className="vs-raster">
          <figure className="vs-portret">
            <img {...klein("marinus-profiel-blauw.webp", "(max-width: 760px) 92vw, 420px", [320, 480, 800])} alt="Marinus Bergsma, oprichter van SocialNow" width="640" height="680" loading="lazy" decoding="async" />
            <figcaption>
              <strong translate="no">Marinus Bergsma</strong>
              <span>Founder & CEO</span>
              <a href="https://www.linkedin.com/in/marinus-bergsma-20b81a144/" target="_blank" rel="noopener" translate="no"><LinkedInMark />LinkedIn</a>
            </figcaption>
          </figure>
          <div className="vs-film">
            <p className="vs-label">Mijn verhaal in twee minuten</p>
            <video className="vs-video" src={STORYFILM} poster={STORYPOSTER} controls playsInline preload="none" width="1920" height="1080" />
            <Waarom />
            <div className="vs-onder"><TextLink to="/projecten">Bekijk het werk achter mijn verhaal</TextLink></div>
          </div>
        </div>
      </section>
      <section className="h-section h-wrap vs-samen" aria-labelledby="vs-samen-titel">
        <p className="h-eyebrow">Samen gebouwd</p>
        <h2 id="vs-samen-titel">Met Indexworld, Uncanny en Attesso.</h2>
        <div className="sn-samen sn-samen-los"><div className="sn-samen-partners"><SamenParen /></div></div>
      </section>
      <Bento className="h-verhaal-hoofdstukken">
        {HOOFDSTUKKEN.map((hoofdstuk) => (
          <Tegel key={hoofdstuk.titel} kop={hoofdstuk.wanneer} breed={hoofdstuk.breed} soort={hoofdstuk.soort ?? "vlak"} className="h-hoofdstuk">
            <h3 className="sn-tegel-titel">{hoofdstuk.titel}</h3>
            <p className="sn-tegel-tekst">{hoofdstuk.tekst}</p>
            {hoofdstuk.linkedin && (
              <a className="h-hoofdstuk-linkedin" href={hoofdstuk.linkedin.url} target="_blank" rel="noopener" translate="no">
                <LinkedInMark />{hoofdstuk.linkedin.naam}
              </a>
            )}
            {hoofdstuk.beeld && <div className="h-hoofdstuk-beeld">{hoofdstuk.beeld}</div>}
          </Tegel>
        ))}
      </Bento>

    </>
  );
}
