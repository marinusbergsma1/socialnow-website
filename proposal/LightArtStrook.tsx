import React from "react";
import { useInBeeld } from "./Bento";
import "./bereikt.css";

// 30 september 2026 (Marinus): "Hier wil ik een werkbalk met alles wat ik voor Light Art Collection heb gedaan. De Artist
// Impressions." Onder de reactie van Albert Deltour in Mijn waarom. Een doorlopende strook die stilstaat bij hover of focus;
// Eternal Sundown veegt van het oorspronkelijke beeld naar de impressie. Beelden uit public/images (al eerder op de site).
const IMPRESSIES = [
  { src: "/images/Light-Art-Collection.webp", titel: "Light Art Collection", breed: 1920, hoog: 1170 },
  { src: "/images/Infinita-Light-Art-Collection.webp", titel: "Infinita", breed: 1292, hoog: 1588 },
  { src: "/images/Butterfly-Effect-Light-Art-Collection.webp", titel: "Butterfly Effect", breed: 1391, hoog: 1592 },
  { src: "/images/Light-Art-Collection-Artwork.webp", titel: "Artwork aan het water", breed: 1920, hoog: 1200 },
];

function VoorNa({ kopie }: { kopie: boolean }) {
  return (
    <figure className="h-lac-kaart is-voor-na" aria-hidden={kopie || undefined}>
      <span className="h-lac-beeld">
        <img src="/images/Eternal-Sundown-Afbeelding-Before-geconverteerd-van-png-1.webp" alt={kopie ? "" : "Eternal Sundown, de plek zonder kunstwerk"} width="1920" height="1200" loading="lazy" />
        <img className="h-lac-na" src="/images/Eternal-Sundown-Afbeelding-After.webp" alt={kopie ? "" : "Eternal Sundown, artist impression"} width="1920" height="1200" loading="lazy" />
        <i className="h-lac-veeg" aria-hidden="true" />
      </span>
      <figcaption>Eternal Sundown · voor en na</figcaption>
    </figure>
  );
}

export default function LightArtStrook() {
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  const kaarten = (kopie: boolean) => (
    <>
      {IMPRESSIES.map((beeld) => (
        <figure key={`${beeld.titel}${kopie ? "-2" : ""}`} className="h-lac-kaart" aria-hidden={kopie || undefined}>
          <span className="h-lac-beeld">
            <img src={beeld.src} alt={kopie ? "" : `${beeld.titel}, artist impression`} width={beeld.breed} height={beeld.hoog} loading="lazy" />
          </span>
          <figcaption>{beeld.titel}</figcaption>
        </figure>
      ))}
      <VoorNa kopie={kopie} />
    </>
  );
  return (
    <div ref={ref} className={`h-lac${aan ? " is-in-beeld" : ""}`}>
      <p className="h-lac-kop">
        <span>Artist Impressions</span> <span translate="no">Light Art Collection</span>
      </p>
      <div className="h-lac-venster" tabIndex={0} role="region" aria-label="Artist Impressions voor Light Art Collection">
        <div className="h-lac-band">
          {kaarten(false)}
          <span className="h-lac-kopie" aria-hidden="true">{kaarten(true)}</span>
        </div>
      </div>
    </div>
  );
}
