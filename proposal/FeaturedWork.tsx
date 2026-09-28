import React, { useState } from "react";
import { Check } from "lucide-react";
import { projects } from "./content";
import { customerReviews } from "./CustomerReviews";
import { AmbientVideo } from "./motion";
import { MediaDialog, type MediaItem } from "./MediaSliders";
import { Action } from "./ui";
import { Bento, Tegel } from "./Bento";
import { useLanguage } from "./i18n/context";
import "./cases.css";

const CASES = `${import.meta.env.BASE_URL}images/cases/`;

// Een case-kaart. `motion` speelt de galerij als video's af (RAVEG); de andere kaarten tonen
// één groot beeld en drie kleine. `tiles` vervangt het projectbeeld en de galerij: voor de
// websites zijn dat echte schermafdrukken van de live site (desktop 16:9, mobiel 2:3).
// `wide` beslaat de hele rij. `measured`, `integration` en `review` zijn het bewijs op de
// kaart; alles daarin is gemeten of letterlijk overgenomen, zie de bron erbij.
type Selection = {
  kop: string;
  slug: string;
  color: string;
  label?: string;
  title: string;
  description: string;
  captions: string[];
  motion?: boolean;
  wide?: boolean;
  tiles?: string[];
  note?: string;
  measured?: { cells: { value: string; label: string }[]; source: string };
  integration?: string[];
  review?: string;
};

// 22 september 2026 (Marinus): de namen en het vergrootteken staan niet meer over de beelden heen;
// het werk spreekt voor zich. De namen blijven in de captions staan, want ze vullen nog het
// aria-label en de titel in het vergrootvenster.
// 28 september 2026 (Marinus): Il Gordo, kWh Garant, VASTIQ en VDZ Brigade erbij, in dezelfde
// kaartstijl, met klantreacties in de kaart. De regie bepaalt de volgorde; de grid vult gaten
// zelf op (grid-auto-flow: dense), dus elke volgorde werkt.
const selections: Selection[] = [
  {
    // Lighthouse 12.8 desktop, mediaan van drie runs op 28 september 2026. Mobiel was dezelfde
    // dag: prestaties 65, toegankelijkheid 91, best practices 96, SEO 100.
    slug: "ilgordo-website",
    kop: "Il Gordo · live site",
    color: "#F7E644",
    label: "Il Gordo · Amsterdam",
    title: "Gebouwd met AI.\nGemeten, niet beloofd.",
    description:
      "Voor Il Gordo bouwden we met AI een website met de hele kaart en alle prijzen. Bestellen gaat via WhatsApp met een kant-en-klaar bericht, via Uber Eats of met één tik bellen.",
    captions: ["Desktop", "Mobiel / home", "Mobiel / menu", "Mobiel / bestellen"],
    wide: true,
    tiles: ["ilgordo-desktop", "ilgordo-mobiel-1", "ilgordo-mobiel-2", "ilgordo-mobiel-3"],
    measured: {
      cells: [
        { value: "100", label: "SEO" },
        { value: "100", label: "Best practices" },
        { value: "93", label: "Prestaties" },
        { value: "0 ms", label: "Blokkeertijd" },
      ],
      source: "Lighthouse desktop, mediaan van drie metingen, 28 september 2026.",
    },
  },
  {
    // Gemeten op kwhgarant.nl, 28 september 2026: het offerteformulier post naar
    // kwh-system.socialnow.nl/api/lead en de CMS-loader haalt teksten en aanbod uit
    // kwh-system.socialnow.nl/api/cms.
    slug: "kwh-garant-website",
    kop: "kWh Garant · live site",
    color: "#25D366",
    label: "kWh Garant · Veenendaal",
    title: "Website en OS.\nEén systeem.",
    description:
      "Een website die vooraf doorrekent wat een thuisbatterij oplevert. Daaronder draait hun eigen SocialNow OS.",
    captions: ["Desktop", "Mobiel / home", "Mobiel / rendement", "Mobiel / aanbod"],
    wide: true,
    tiles: ["kwhgarant-desktop", "kwhgarant-mobiel-1", "kwhgarant-mobiel-2", "kwhgarant-mobiel-3"],
    integration: [
      "Offerteaanvragen komen direct in hun OS binnen.",
      "Teksten en aanbod beheren ze vanuit hetzelfde OS.",
      "4,4 uit 9 reviews op Solvari, zichtbaar bovenaan de site.",
    ],
    review: "Ellen Sluijs",
  },
  {
    slug: "vastiq-website",
    kop: "VASTIQ · live platform",
    color: "#00A3E0",
    label: "VASTIQ · vastiq.ai",
    title: "Een dataplatform\nvoor vastgoed.",
    description:
      "Een marktconforme waarde-indicatie op actueel aanbod, woningkenmerken en buurtcontext. Gemaakt met Komen Consultancy van accountant en datascientist Steef Komen; SocialNow bouwde platform en merk.",
    captions: ["Desktop", "Mobiel / zoeken", "Mobiel / methode", "Mobiel / startpunten"],
    tiles: ["vastiq-desktop", "vastiq-mobiel-1", "vastiq-mobiel-2", "vastiq-mobiel-3"],
  },
  {
    slug: "vdz-brigade-website",
    kop: "VDZ Brigade · live site",
    color: "#F62961",
    label: "VDZ Brigade",
    title: "Verduurzamen.\nHelder uitgelegd.",
    description:
      "Website en huisstijl voor De Verduurzaming Brigade: isolatie, warmtepompen, thuisbatterijen en kozijnen, met gratis advies direct bereikbaar.",
    captions: ["Desktop", "Mobiel / home", "Mobiel / werkwijze", "Mobiel / specialismen"],
    tiles: ["vdz-brigade-desktop", "vdz-brigade-mobiel-1", "vdz-brigade-mobiel-2", "vdz-brigade-mobiel-3"],
    review: "VDZ Brigade",
  },
  {
    slug: "raveg-branding",
    kop: "RAVEG · motion",
    color: "#F5940D",
    title: "Een merk.\nVol beweging.",
    description:
      "Van identiteit en website tot video en motion design. Voor RAVEG brachten we één herkenbare merkstijl tot leven in alle uitingen.",
    captions: ["Dyadium", "Hyperpower / 01", "Hyperpower / 02"],
    motion: true,
  },
  {
    slug: "universal-sony-banners",
    kop: "Universal en Sony",
    color: "#00A3E0",
    title: "Groot beeld.\nTot in de details.",
    description:
      "Campagnebeelden voor filmreleases van Universal en Sony Pictures. Van social content tot groot formaat: een visuele wereld die op ieder scherm herkenbaar blijft.",
    captions: ["Fast X", "The Flash", "Oppenheimer", "No Hard Feelings"],
  },
  {
    slug: "az-alkmaar-socials",
    kop: "AZ · social artworks",
    color: "#F62961",
    title: "De energie\nvan AZ.",
    description:
      "Social artworks, spelersvisuals en campagnebeelden voor AZ. Ontworpen voor de momenten waarop de club en haar supporters samenkomen.",
    captions: [
      "Champions League",
      "Spelersvisual",
      "25K volgers",
      "Boadu / Bedankt",
    ],
  },
  {
    slug: "print-bind-interieur",
    kop: "Print & Bind · interieur",
    color: "#25D366",
    title: "Een merk.\nOok in de ruimte.",
    description: "Voor Print & Bind vertaalden we de merkidentiteit naar het interieur, met banners, stickers en bewegwijzering.",
    captions: ["Print & Bind", "Banners", "Meeting room", "Interieur"],
  },
];

// Een klantreactie komt letterlijk uit CustomerReviews; bij een lange reactie tonen we de
// eerste twee zinnen, zonder iets te veranderen.
function reviewFor(name?: string) {
  const review = customerReviews.find((item) => item.name === name);
  if (!review) return null;
  const sentences = review.text.match(/[^.!?]+[.!?]+/g) || [review.text];
  return { ...review, text: sentences.slice(0, 2).join("").trim() };
}

export default function FeaturedWork() {
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const { t } = useLanguage();
  // 28 september 2026 (Marinus): elke sectie als kleine bentogrid. Per case een beeldtegel (8) en een
  // teksttegel (4) die om en om van kant wisselen; bewijs (cijfers, koppeling, klantreactie) krijgt een
  // eigen kleine tegel. De grid vult zelf op (dense), dus de volgorde van `selections` is vrij.
  const tegels: React.ReactNode[] = [];
  selections.forEach((selection, index) => {
    const project = projects.find((item) => item.slug === selection.slug)!;
    const website = !!selection.tiles;
    const label = selection.label || project.category;
    const beeld = website ? `${CASES}${selection.tiles![0]}.webp` : project.image;
    const telefoon = website ? `${CASES}${selection.tiles![1]}.webp` : "";
    const film = selection.motion ? project.gallery![0] : "";
    const titel = `${website ? project.title : project.category} · ${website ? t(selection.captions[0]) : selection.captions[0]}`;
    const review = reviewFor(selection.review);
    const stijl = { "--case-accent": selection.color } as React.CSSProperties;
    const beeldTegel = (
      <Tegel key={`${project.slug}-beeld`} kop={selection.kop} breed={8} soort="foto" className="h-case-beeld">
        <button type="button" className="h-case-beeldknop" style={stijl}
          onClick={() => setSelected({ src: film || beeld, title: titel, kind: film ? "video" : "image", slug: project.slug })}
          aria-label={`${t(film ? "Speel video af" : "Vergroot beeld")}: ${titel}`}>
          {film ? (
            <AmbientVideo src={film} poster={project.image} label={titel} suspended={!!selected} hoverSound />
          ) : (
            <img src={beeld} alt={titel} loading="lazy" width="1200" height="675" />
          )}
          {telefoon && <img className="h-case-telefoon" src={telefoon} alt="" loading="lazy" width="600" height="900" />}
        </button>
      </Tegel>
    );
    const tekstTegel = (
      <Tegel key={`${project.slug}-tekst`} kop={label} breed={4} className="h-case-tekst">
        <p className="sn-tegel-titel">{selection.title.split("\n").map((line) => <span key={line}>{line}</span>)}</p>
        <p className="sn-tegel-tekst">{selection.description}</p>
        <ul className="h-case-pillen" aria-label="Werkzaamheden">
          {project.services!.slice(0, 4).map((service) => <li key={service}>{service}</li>)}
        </ul>
        {review && !selection.integration && (
          <figure className="h-case-kortcitaat">
            <blockquote lang="nl" translate="no">“{review.text}”</blockquote>
            <figcaption translate="no">{review.name}</figcaption>
          </figure>
        )}
        <div className="sn-tegel-onder">
          <Action to={`/project/${project.slug}`}>Ontdek het verhaal</Action>
        </div>
      </Tegel>
    );
    // Vaste rijen van 12, zodat beeld en tekst van één case bij elkaar blijven:
    // Il Gordo beeld 8 + tekst 4, dan cijfers 4 + kWh beeld 8, dan kWh tekst, koppeling en reactie (4+4+4).
    // Daarna wisselt beeld (8) en tekst (4) per case van kant. Een reactie bij een andere case staat in de teksttegel.
    const eigen = selection.integration && review;
    if (selection.measured) {
      tegels.push(beeldTegel, tekstTegel,
        <Tegel key={`${project.slug}-cijfers`} kop="Gemeten" breed={4} soort="geel" className="h-case-cijfers">
          <dl>{selection.measured.cells.map((cell) => <div key={cell.label}><dd translate="no">{cell.value}</dd><dt>{cell.label}</dt></div>)}</dl>
          <p className="h-case-bron">{selection.measured.source}</p>
        </Tegel>);
      return;
    }
    if (eigen) {
      tegels.push(beeldTegel, tekstTegel,
        <Tegel key={`${project.slug}-os`} kop="Gekoppeld aan het OS" breed={4} soort="groen" className="h-case-os">
          <ul>{selection.integration!.map((line) => <li key={line}><Check size={15} aria-hidden="true" /><span>{line}</span></li>)}</ul>
        </Tegel>,
        <Tegel key={`${project.slug}-review`} kop="Klantreactie" breed={4} className="h-case-review">
          <blockquote lang="nl" translate="no">“{review!.text}”</blockquote>
          <div className="h-case-wie">
            <img src={review!.image} alt="" className={review!.logo ? "is-logo" : ""} width="40" height="40" loading="lazy" />
            <span><strong translate="no">{review!.name}</strong><span>{review!.company}</span></span>
          </div>
        </Tegel>);
      return;
    }
    const links = tegels.length % 2 === 0 ? index % 2 === 0 : index % 2 === 1;
    tegels.push(...(links ? [tekstTegel, beeldTegel] : [beeldTegel, tekstTegel]));
  });
  return (
    <>
      <Bento id="uitgelicht-werk" className="h-featured-work h-cases" label="Uitgelicht werk / Gemaakt door SocialNow"
        titel={<>Werk dat je<br /><span>bijblijft.</span></>} swipe>
        {tegels}
      </Bento>
      <MediaDialog item={selected} close={() => setSelected(null)} />
    </>
  );
}
