import React, { useState } from "react";
import { Expand } from "lucide-react";
import { projects } from "./content";
import { AmbientVideo } from "./motion";
import { MediaDialog, type MediaItem } from "./MediaSliders";
import { Action, Heading } from "./ui";

const selections = [
  {
    slug: "raveg-branding",
    color: "#F5940D",
    title: "Een merk.\nVol beweging.",
    description:
      "Van identiteit en website tot video en motion design. Voor RAVEG brachten we één herkenbare merkstijl tot leven in alle uitingen.",
    captions: ["Dyadium", "Hyperpower / 01", "Hyperpower / 02"],
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
];

export default function FeaturedWork() {
  const [selected, setSelected] = useState<MediaItem | null>(null);
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
        text="Bewegend beeld. Sterke merken. Oog voor ieder detail. Ontdek het werk achter onze ervaring."
      >

      </Heading>
      <div className="h-featured-cases">
        {selections.map((selection, index) => {
          const project = projects.find(
            (item) => item.slug === selection.slug,
          )!;
          const motion = index === 0;
          const sources = motion
            ? project.gallery!
            : [project.image, ...project.gallery!];
          return (
            <article
              key={project.slug}
              className={`h-featured-case ${motion ? "h-featured-motion" : "h-featured-collage"}`}
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
                  {project.category}
                </p>
                <h3>
                  {selection.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p>{selection.description}</p>
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
                    title: `${project.category} · ${selection.captions[tile]}`,
                    kind: motion ? "video" : "image",
                    slug: project.slug,
                  };
                  return (
                    <button
                      type="button"
                      key={src}
                      className="h-featured-tile"
                      onClick={() => setSelected(item)}
                      aria-label={`${motion ? "Speel video af" : "Vergroot beeld"}: ${item.title}`}
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
                          width={tile ? 400 : 1000}
                          height={tile ? 600 : 560}
                        />
                      )}
                      <span className="h-featured-caption">
                        <span>{selection.captions[tile]}</span>
                        <span className="h-featured-open">
                          {!motion && <Expand size={16} />}
                        </span>
                      </span>
                    </button>
                  );
                })}
                <span className="h-featured-media-note">
                  {motion
                    ? "Motion design · Tik voor de volledige video"
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
