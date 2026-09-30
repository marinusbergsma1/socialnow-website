import React from "react";
import { useInBeeld } from "./Bento";
import "./bereikt.css";

// 30 september 2026 (Marinus): "Hier wil ik een werkbalk met alles wat ik voor Light Art Collection heb gedaan. De Artist
// Impressions." en daarna "Ik mis de before foto's met slider functie. Maak de before met image2.5 via Higgsfield."
// Onder de reactie van Albert Deltour in Mijn waarom: een zijwaartse strook waarin elke impressie een voor-en-na-schuif is.
// De voor-beelden in public/images/light-art zijn op 30 september gemaakt met GPT Image 2.5 op Higgsfield (de impressie
// als referentie, alleen het kunstwerk weggehaald); Eternal Sundown had al een eigen voor-beeld.
const IMPRESSIES = [
  { titel: "Eternal Sundown", voor: "/images/Eternal-Sundown-Afbeelding-Before-geconverteerd-van-png-1.webp", na: "/images/Eternal-Sundown-Afbeelding-After.webp", breed: 1920, hoog: 1200 },
  { titel: "Infinita", voor: "/images/light-art/infinita-voor.webp", na: "/images/Infinita-Light-Art-Collection.webp", breed: 1292, hoog: 1588 },
  { titel: "Butterfly Effect", voor: "/images/light-art/butterfly-effect-voor.webp", na: "/images/Butterfly-Effect-Light-Art-Collection.webp", breed: 1391, hoog: 1592 },
];
// 30 september 2026 (Marinus): "3 niet 5". Alleen de drie Artist Impressions. De beelden waren 1920 px en samen 2,7 MB voor
// kaarten van 400 px; op een trage lijn bleven de vakken leeg. Nu uit images/light-art/licht in 800 en 1400 px (q74).
const licht = (pad: string) => `/images/light-art/licht/${pad.split("/").pop()!.replace(/\.webp$/, "")}`;
const bronnen = (pad: string) => ({ src: `${licht(pad)}-800.webp`, srcSet: `${licht(pad)}-800.webp 800w, ${licht(pad)}-1400.webp 1400w`, sizes: "(min-width: 900px) 30vw, 82vw" });

type Impressie = (typeof IMPRESSIES)[number];

// Eén voor-en-na-schuif. Slepen of de pijltjestoetsen verschuiven de grens; bij binnenkomst in beeld zwaait hij één keer
// heen en weer zodat je ziet dat het kan, tenzij minder beweging is ingesteld of je al zelf hebt geschoven.
function VoorNaSchuif({ impressie }: { impressie: Impressie }) {
  const { ref, aan } = useInBeeld<HTMLElement>();
  const [grens, setGrens] = React.useState(50);
  const zelf = React.useRef(false);
  React.useEffect(() => {
    if (!aan || zelf.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const punten = [50, 88, 12, 50];
    const duur = 2600;
    const start = performance.now();
    let frame = 0;
    const stap = (nu: number) => {
      if (zelf.current) return;
      const t = Math.min(1, (nu - start) / duur) * (punten.length - 1);
      const i = Math.min(punten.length - 2, Math.floor(t));
      const f = t - i;
      const zacht = f * f * (3 - 2 * f);
      setGrens(punten[i] + (punten[i + 1] - punten[i]) * zacht);
      if (t < punten.length - 1) frame = requestAnimationFrame(stap);
    };
    frame = requestAnimationFrame(stap);
    return () => cancelAnimationFrame(frame);
  }, [aan]);
  return (
    <figure ref={ref} className="h-lac-kaart">
      <span className="h-lac-beeld" style={{ "--grens": `${grens}%` } as React.CSSProperties}>
        <img {...bronnen(impressie.voor)} alt={`${impressie.titel}, voor`} width={impressie.breed} height={impressie.hoog} loading="lazy" decoding="async" draggable={false} />
        <img className="h-lac-na" {...bronnen(impressie.na)} alt={`${impressie.titel}, artist impression`} width={impressie.breed} height={impressie.hoog} loading="lazy" decoding="async" draggable={false} />
        <span className="h-lac-label is-voor" aria-hidden="true">Voor</span>
        <span className="h-lac-label is-na" aria-hidden="true">Na</span>
        <i className="h-lac-greep" aria-hidden="true" />
        <input
          className="h-lac-schuif"
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(grens)}
          onChange={(event) => { zelf.current = true; setGrens(Number(event.target.value)); }}
          aria-label={`Voor en na: ${impressie.titel}`}
        />
      </span>
      <figcaption>{impressie.titel}</figcaption>
    </figure>
  );
}

export default function LightArtStrook() {
  return (
    <div className="h-lac">
      <p className="h-lac-kop">
        <span>Artist Impressions</span> <span translate="no">Light Art Collection</span> <span>Schuif voor en na</span>
      </p>
      <div className="h-lac-venster" role="region" aria-label="Artist Impressions voor Light Art Collection">
        {IMPRESSIES.map((impressie) => <VoorNaSchuif key={impressie.titel} impressie={impressie} />)}
      </div>
    </div>
  );
}
