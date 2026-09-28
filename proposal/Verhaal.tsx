import React from "react";
import { people } from "./content";

// 28 september 2026 (Marinus): "wat belangrijk was bij de beurs van Odoo is dat ik merkte dat het persoonlijke
// verhaal en waarom het OS gratis kan zijn". Later die nacht: "waar het om gaat is mijn verhaal hier gelijk verteld
// te hebben met HyperFrames en kleine tekst over mijn waarom en onze achtergrond".
// Links staat zijn waarom vast in beeld, rechts loopt de tijdlijn die per hoofdstuk in beeld schuift. De film uit
// HyperFrames komt boven de tijdlijn zodra hij klaar is. Brontekst en bronnen: ~/Downloads/website-verhaal-2026-09-28/VERHAAL.md.

export function OdooLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="140 146 640 250" role="img" aria-label="Odoo">
      <path fill="#8f8f8f" d="M695,346a75,75,0,1,1,75-75A75,75,0,0,1,695,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,695,315ZM538,346a75,75,0,1,1,75-75A75,75,0,0,1,538,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,538,315Zm-82-45c0,41.9-33.6,76-75,76s-75-34-75-75.9S336.5,196,381,196c16.4,0,31.6,3.5,44,12.6V165.1c0-8.3,7.3-15.1,15.5-15.1s15.5,6.8,15.5,15.1Zm-75,45a44,44,0,1,0-44-44A44,44,0,0,0,381,315Z" />
      <path fill="#714b67" d="M224,346a75,75,0,1,1,75-75A75,75,0,0,1,224,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,224,315Z" />
    </svg>
  );
}

type Hoofdstuk = { wanneer: string; titel: string; tekst: string; kleur: string; beeld?: React.ReactNode };

const HOOFDSTUKKEN: Hoofdstuk[] = [
  {
    wanneer: "2019",
    titel: "Afgestudeerd als grafisch vormgever.",
    tekst: "Na mijn stage bij Amsterdam Light Festival maakte ik daar artist impressions en boekjes over de kunstwerken.",
    kleur: "#25D366",
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
    kleur: "#00A3E0",
    beeld: (
      <span className="h-hoofdstuk-logos" translate="no">
        <img className="is-eigen" src="/images/AZ-LOGO-FLYER.webp" alt="AZ" loading="lazy" />
        <img src="/images/SUPPERCLUB-LOGO.webp" alt="Supperclub" loading="lazy" />
        <b translate="no">Day & Nite</b>
      </span>
    ),
  },
  {
    wanneer: "November 2021",
    titel: "SocialNow.",
    tekst: "Na succes met freelance opdrachten begon ik mijn eigen bedrijf en bouwde ik een team van specialisten om me heen. In november vieren we ons vijfjarig bestaan.",
    kleur: "#F7E644",
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
    tekst: "Van grafisch vormgever was ik branding specialist en eigenaar geworden, altijd bezig met het nieuwste. Ik zag de kansen en verdiepte me in AI en development. Het persoonlijke bleef de kern.",
    kleur: "#F62961",
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
    tekst: "We schaalden bedrijven vanaf nul op tot winstgevende, geautomatiseerde bedrijven, met branding en advertenties op zelflerende systemen.",
    kleur: "#25D366",
  },
  {
    wanneer: "Het OS",
    titel: "Alle data van je bedrijf in één systeem.",
    tekst: "Daarna zag ik wat er nog meer kon: een operating system waarin je zelf alle data van je website en social media koppelt. Odoo bleek de laatste sleutel. Totale ontzorging, volledig inzicht.",
    kleur: "#00A3E0",
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
    tekst: "Ik besprak het systeem met mijn accountant en Odoo-expert Steef Komen. We gingen een partnership aan om het schaalbaar te maken. Met Steef, ook datascientist, bouwen we ook VASTIQ, een dataplatform voor vastgoed.",
    kleur: "#F7E644",
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
    tekst: "Het is gelukt. Dit is het systeem dat jullie op de Odoo-beurs mochten gebruiken, en dat Odoo-implementatiepartners en data- en securitybedrijven nu naar hun klanten brengen. Het team en ik zijn daar ontzettend dankbaar voor.",
    kleur: "#F62961",
    beeld: (
      <img className="h-hoofdstuk-foto" src="/images/verhaal/team-atomium.webp" alt="Het SocialNow-team bij het Atomium in Brussel" width="900" height="1200" loading="lazy" />
    ),
  },
];

// Een hoofdstuk schuift één keer in beeld. Zonder JavaScript of zonder IntersectionObserver staat alles gewoon zichtbaar.
function useInBeeld<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [aan, setAan] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") { setAan(true); return; }
    const kijker = new IntersectionObserver(([ingang]) => {
      if (ingang.isIntersecting) { setAan(true); kijker.disconnect(); }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.2 });
    kijker.observe(element);
    return () => kijker.disconnect();
  }, []);
  return { ref, aan };
}

function Stap({ hoofdstuk, nummer }: { hoofdstuk: Hoofdstuk; nummer: number }) {
  const { ref, aan } = useInBeeld<HTMLLIElement>();
  return (
    <li ref={ref} className={`h-hoofdstuk${aan ? " is-in-beeld" : ""}`} style={{ "--hoofdstuk-kleur": hoofdstuk.kleur } as React.CSSProperties}>
      <span className="h-hoofdstuk-punt" aria-hidden="true" />
      <p className="h-hoofdstuk-wanneer"><span aria-hidden="true">{String(nummer).padStart(2, "0")}</span>{hoofdstuk.wanneer}</p>
      <h3>{hoofdstuk.titel}</h3>
      <p className="h-hoofdstuk-tekst">{hoofdstuk.tekst}</p>
      {hoofdstuk.beeld && <div className="h-hoofdstuk-beeld">{hoofdstuk.beeld}</div>}
    </li>
  );
}

export default function Verhaal() {
  const [klaar, setKlaar] = React.useState(false);
  React.useEffect(() => setKlaar(true), []);
  return (
    <section className="h-verhaal h-wrap" id="verhaal" aria-labelledby="verhaal-titel">
      <div className="h-verhaal-kop">
        <p className="h-eyebrow"><i />Het verhaal achter SocialNow</p>
        <h2 id="verhaal-titel">
          Van grafisch vormgever
          <br />
          <span>tot jouw OS.</span>
        </h2>
      </div>
      <div className="h-verhaal-grid">
        <aside className="h-verhaal-waarom" aria-label="Mijn waarom">
          <figure className="h-verhaal-portret">
            <img src="/images/marinus-profiel-blauw.webp" alt="Marinus Bergsma, oprichter van SocialNow" width="640" height="680" loading="lazy" />
            <span className="h-verhaal-jaren" aria-hidden="true"><b>5</b>jaar in november</span>
          </figure>
          <p className="h-verhaal-label">Mijn waarom</p>
          <p className="h-verhaal-waarom-tekst">Ik wil ondernemers helemaal ontzorgen met de nieuwste technologie, zonder dat het persoonlijke verdwijnt.</p>
          <p className="h-verhaal-naam"><strong>Marinus Bergsma</strong><span>Founder & CEO</span></p>
        </aside>
        <ol className={`h-verhaal-tijdlijn${klaar ? " is-klaar" : ""}`}>
          {HOOFDSTUKKEN.map((hoofdstuk, index) => (
            <Stap key={hoofdstuk.titel} hoofdstuk={hoofdstuk} nummer={index + 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}
