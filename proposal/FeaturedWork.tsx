import React, { useState } from "react";
import { Check } from "lucide-react";
import { projects } from "./content";
import { customerReviews } from "./CustomerReviews";
import { AmbientVideo } from "./motion";
import { MediaDialog, type MediaItem } from "./MediaSliders";
import { Action, Heading } from "./ui";
import { useLanguage } from "./i18n/context";
import "./cases.css";

const CASES = `${import.meta.env.BASE_URL}images/cases/`;

// Een case-kaart. `motion` speelt de galerij als video's af (RAVEG); de andere kaarten tonen
// één groot beeld en drie kleine. `tiles` vervangt het projectbeeld en de galerij: voor de
// websites zijn dat echte schermafdrukken van de live site (desktop 16:9, mobiel 2:3).
// `wide` beslaat de hele rij. `measured`, `integration` en `review` zijn het bewijs op de
// kaart; alles daarin is gemeten of letterlijk overgenomen, zie de bron erbij.
type Selection = {
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
    color: "#F5940D",
    title: "Een merk.\nVol beweging.",
    description:
      "Van identiteit en website tot video en motion design. Voor RAVEG brachten we één herkenbare merkstijl tot leven in alle uitingen.",
    captions: ["Dyadium", "Hyperpower / 01", "Hyperpower / 02"],
    motion: true,
  },
  {
    slug: "universal-sony-banners",
    color: "#00A3E0",
    title: "Groot beeld.\nTot in de details.",
    description:
      "Campagnebeelden voor filmreleases van Universal en Sony Pictures. Van social content tot groot formaat: een visuele wereld die op ieder scherm herkenbaar blijft.",
    captions: ["Fast X", "The Flash", "Oppenheimer", "No Hard Feelings"],
  },
  {
    slug: "az-alkmaar-socials",
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
  return (
    <section
      className="h-section h-wrap h-featured-work"
      id="uitgelicht-werk"
      aria-labelledby="featured-work-title"
    >
      <Heading
        id="featured-work-title"
        label="Uitgelicht werk / Gemaakt door SocialNow"
        title={
          <>
            Werk dat je
            <br />
            <span>bijblijft.</span>
          </>
        }
        text="Websites en platforms. Bewegend beeld. Sterke merken. Ontdek het werk achter onze ervaring."
      >

      </Heading>
      <div className="h-featured-cases">
        {selections.map((selection, index) => {
          const project = projects.find(
            (item) => item.slug === selection.slug,
          )!;
          const motion = !!selection.motion;
          const website = !!selection.tiles;
          const label = selection.label || project.category;
          const sources = selection.tiles
            ? selection.tiles.map((name) => `${CASES}${name}.webp`)
            : motion
              ? project.gallery!
              : [project.image, ...project.gallery!];
          const review = reviewFor(selection.review);
          return (
            <article
              key={project.slug}
              className={`h-featured-case ${motion ? "h-featured-motion" : "h-featured-collage"}${selection.wide ? " is-wide" : ""}${website ? " is-website" : ""}`}
              style={
                { "--case-accent": selection.color } as React.CSSProperties
              }
            >
              <div className="h-featured-copy">
                <span className="h-featured-number">
                  0{index + 1} / SELECTED WORK
                </span>
                <p className="h-eyebrow">
                  <i />
                  {label}
                </p>
                <h3>
                  {selection.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p>{selection.description}</p>
                {selection.measured && (
                  <div className="h-case-measured">
                    <dl>
                      {selection.measured.cells.map((cell) => (
                        <div key={cell.label}>
                          <dt>{cell.label}</dt>
                          <dd translate="no">{cell.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p>{selection.measured.source}</p>
                  </div>
                )}
                {selection.integration && (
                  <ul className="h-case-integration" aria-label="Gekoppeld aan het OS">
                    {selection.integration.map((line) => (
                      <li key={line}>
                        <Check size={15} aria-hidden="true" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {review && (
                  <figure className="h-case-review">
                    <blockquote lang="nl" translate="no">
                      “{review.text}”
                    </blockquote>
                    <figcaption>
                      <img
                        src={review.image}
                        alt=""
                        className={review.logo ? "is-logo" : ""}
                        width="32"
                        height="32"
                        loading="lazy"
                      />
                      <span>
                        <strong translate="no">{review.name}</strong>
                        <span>{review.company}</span>
                      </span>
                    </figcaption>
                  </figure>
                )}
                <ul aria-label="Werkzaamheden">
                  {project.services!.slice(0, 4).map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
                <Action to={`/project/${project.slug}`}>
                  Ontdek het verhaal
                </Action>
              </div>
              <div className="h-featured-media">
                {motion && <button type="button" className="h-featured-tile h-featured-cover"
                  onClick={() => setSelected({src:project.image,title:"RAVEG · Hyperpower packaging",kind:"image",slug:project.slug})}
                  aria-label="RAVEG · Hyperpower packaging">
                  <img src={project.image} alt="RAVEG · Hyperpower packaging" width="1920" height="1091" loading="lazy" />
                </button>}
                {sources.map((src, tile) => {
                  const item: MediaItem = {
                    src,
                    // De websitetitels vertalen hier al: een samengestelde zin staat niet als
                    // geheel in het woordenboek.
                    title: website
                      ? `${project.title} · ${t(selection.captions[tile])}`
                      : `${project.category} · ${selection.captions[tile]}`,
                    kind: motion ? "video" : "image",
                    slug: project.slug,
                  };
                  return (
                    <button
                      type="button"
                      key={src}
                      className="h-featured-tile"
                      onClick={() => setSelected(item)}
                      aria-label={website ? `${t("Vergroot beeld")}: ${item.title}` : `${motion ? "Speel video af" : "Vergroot beeld"}: ${item.title}`}
                    >
                      {motion ? (
                        <AmbientVideo
                          src={src}
                          poster={project.image}
                          label={item.title}
                          suspended={!!selected}
                          hoverSound
                        />
                      ) : (
                        <img
                          src={src}
                          alt={item.title}
                          loading="lazy"
                          width={tile ? (website ? 600 : 400) : website ? 1200 : 1000}
                          height={tile ? (website ? 900 : 600) : website ? 675 : 560}
                        />
                      )}
                    </button>
                  );
                })}
                <span className="h-featured-media-note">
                  {motion
                    ? "Motion design · Tik voor de volledige video"
                    : website
                      ? "Live website · Desktop en mobiel"
                      : "Campaign design · Bekijk de details"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="h-featured-end">
        <p>Van dit oog voor detail naar jouw eigen OS.</p>
        <Action to="/projecten" secondary>
          Bekijk al ons werk
        </Action>
      </div>
      <MediaDialog item={selected} close={() => setSelected(null)} />
    </section>
  );
}
