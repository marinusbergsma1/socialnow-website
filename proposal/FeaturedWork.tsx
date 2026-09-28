import React, { useState } from "react";

import { projects } from "./content";
import { customerReviews } from "./CustomerReviews";
import { AmbientVideo } from "./motion";
import { MediaDialog, type MediaItem } from "./MediaSliders";
import { TextLink } from "./ui";
import { Bento, Tegel } from "./Bento";

import "./cases.css";


// De toelichting en onderbouwde resultaten blijven beschikbaar in het uitklapbare overzicht.
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

export default function FeaturedWork() {
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const raveg = projects.find((item) => item.slug === "raveg-branding")!;
  const albert = customerReviews.find((item) => item.name === "Albert Deltour")!;
  const media: MediaItem[] = [
    ...raveg.gallery!.slice(0, 3).map((src, index) => ({
      src, title: `RAVEG · ${["Dyadium", "Hyperpower / 01", "Hyperpower / 02"][index]}`,
      kind: "video" as const, slug: raveg.slug,
    })),
    { src: raveg.image, title: "RAVEG · Hyperpower packaging", kind: "image", slug: raveg.slug },
  ];
  return (
    <>
      <Bento id="uitgelicht-werk" className="h-featured-work h-cases h-work-compact"
        label="Uitgelicht werk / Gemaakt door SocialNow"
        titel={<>Werk dat je <span>bijblijft.</span></>} swipe>
        {media.map((item) => (
          <Tegel key={item.src} kop={item.title} breed={3} soort="foto" className="h-work-preview">
            <button type="button" className="h-case-beeldknop"
              aria-label={item.title} onClick={() => setSelected(item)}>
              {item.kind === "video"
                ? <AmbientVideo src={item.src} poster={raveg.image} label={item.title} suspended={!!selected} hoverSound />
                : <img src={item.src} alt={item.title} loading="lazy" width="600" height="600" />}
            </button>
          </Tegel>
        ))}
      </Bento>
      <div className="h-wrap h-work-extra">
        <details className="h-work-details">
          <summary>Meer over dit werk</summary>
          <div className="h-work-stories">
            {selections.map((selection) => {
              const project = projects.find((item) => item.slug === selection.slug)!;
              return (
                <article key={project.slug} className="h-work-story">
                  <h3>{selection.label || selection.kop}</h3>
                  <p>{selection.description}</p>
                  {!selection.tiles && !selection.motion && (
                    <div className="h-work-gallery">
                      {[project.image, ...project.gallery!].map((src, index) => (
                        <button key={src} type="button" aria-label={selection.captions[index]}
                          onClick={() => setSelected({src, title: selection.captions[index], kind: "image", slug: project.slug})}>
                          <img src={src} alt={selection.captions[index]} loading="lazy" width="200" height="150" />
                        </button>
                      ))}
                    </div>
                  )}
                  {selection.measured && <p className="h-work-evidence">
                    {selection.measured.cells.map((cell) => `${cell.label}: ${cell.value}`).join(" · ")}
                    <small>{selection.measured.source}</small>
                  </p>}
                  {selection.integration && <ul>{selection.integration.map((line) => <li key={line}>{line}</li>)}</ul>}
                  <TextLink to={`/project/${project.slug}`}>Ontdek het verhaal</TextLink>
                </article>
              );
            })}
            <figure className="h-case-review h-work-story">
              <blockquote lang="en" translate="no">“{albert.text}”</blockquote>
              <figcaption className="h-case-wie">
                <img src={albert.image} alt="" width="40" height="40" loading="lazy" />
                <span><strong translate="no">{albert.name}</strong><a href={albert.website} target="_blank" rel="noopener noreferrer" translate="no">{albert.company}</a></span>
              </figcaption>
            </figure>
          </div>
        </details>
      </div>
      <MediaDialog item={selected} close={() => setSelected(null)} />
    </>
  );
}
