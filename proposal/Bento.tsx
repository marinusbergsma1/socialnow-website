import React from "react";
import "./bento.css";

// 28 september 2026 (Marinus): "alle onderdelen als kleine bentogrids, net zoals de homepage wanneer je daarop landt" en
// "zoals hier meer". Eén tegeltaal voor elke sectie onder de hero, met het landingsscherm als maatstaf: een kort kopje met
// groene stip boven elke tegel, donkere tegels met ronde hoeken en een dunne rand, films met een Sound on-pil, een
// citaattegel met foto en naam, pilknoppen, tegels in wisselende maten en veel zwart ertussen.
//
// Gebruik:
//   <Bento id="mijn-sectie" label="Klein label" titel={<>Korte kop.<br /><span>Tweede regel.</span></>} swipe>
//     <Tegel kop="Kopje met groene stip" breed={8}>...</Tegel>
//     <Tegel kop="Film" breed={4} soort="film"><BentoFilm src="/video/x.mp4" poster="/video/x.jpg" label="..." /></Tegel>
//   </Bento>
// breed telt in twaalfden (3, 4, 5, 6, 7, 8 of 12), hoog is 1 of 2 rijen. soort: vlak (standaard), film, foto,
// groen, blauw, roze of geel. swipe maakt op de telefoon een zijwaartse strook met streepjes; zonder swipe stapelen de tegels.

export function useInBeeld<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [aan, setAan] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") { setAan(true); return; }
    const kijker = new IntersectionObserver(([ingang]) => {
      if (ingang.isIntersecting) { setAan(true); kijker.disconnect(); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    kijker.observe(element);
    return () => kijker.disconnect();
  }, []);
  return { ref, aan };
}

type BentoProps = {
  id?: string;
  label?: string;
  titel?: React.ReactNode;
  swipe?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Bento({ id, label, titel, swipe = false, className, children }: BentoProps) {
  const rooster = React.useRef<HTMLDivElement>(null);
  const [klaar, setKlaar] = React.useState(false);
  const [actief, setActief] = React.useState(0);
  const aantal = React.Children.toArray(children).length;
  React.useEffect(() => setKlaar(true), []);
  React.useEffect(() => {
    const strook = rooster.current;
    if (!swipe || !strook || typeof IntersectionObserver === "undefined") return;
    const tegels = Array.from(strook.children) as HTMLElement[];
    const kijker = new IntersectionObserver((ingangen) => {
      for (const ingang of ingangen) if (ingang.isIntersecting) setActief(tegels.indexOf(ingang.target as HTMLElement));
    }, { root: strook, threshold: 0.6 });
    tegels.forEach((tegel) => kijker.observe(tegel));
    return () => kijker.disconnect();
  }, [swipe, aantal]);
  const ga = (index: number) => {
    const strook = rooster.current;
    const tegel = strook?.children[index] as HTMLElement | undefined;
    if (strook && tegel) strook.scrollTo({ left: tegel.offsetLeft - strook.offsetLeft, behavior: "smooth" });
  };
  const kopId = id ? `${id}-titel` : undefined;
  return (
    <section id={id} className={`sn-bento h-wrap${className ? ` ${className}` : ""}`} aria-labelledby={titel ? kopId : undefined}>
      {(label || titel) && (
        <div className="sn-bento-kop">
          {label && <p className="h-eyebrow"><i />{label}</p>}
          {titel && <h2 id={kopId}>{titel}</h2>}
        </div>
      )}
      <div ref={rooster} className={`sn-bento-rooster${swipe ? " is-swipe" : ""}${klaar ? " is-klaar" : ""}`}>
        {children}
      </div>
      {swipe && aantal > 1 && (
        <div className="sn-bento-streepjes" translate="no">
          {Array.from({ length: aantal }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1} / ${aantal}`}
              aria-current={index === actief ? "true" : undefined}
              onClick={() => ga(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type TegelProps = {
  id?: string;
  kop?: React.ReactNode;
  breed?: 3 | 4 | 5 | 6 | 7 | 8 | 12;
  hoog?: 1 | 2;
  soort?: "vlak" | "film" | "foto" | "groen" | "blauw" | "roze" | "geel";
  className?: string;
  children: React.ReactNode;
};

export function Tegel({ id, kop, breed = 6, hoog = 1, soort = "vlak", className, children }: TegelProps) {
  const { ref, aan } = useInBeeld<HTMLDivElement>();
  const maat = breed <= 4 ? " is-klein" : breed <= 6 ? " is-half" : "";
  return (
    <div
      id={id}
      ref={ref}
      className={`sn-tegel is-${soort}${maat}${hoog === 2 ? " is-hoog" : ""}${aan ? " is-in-beeld" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--breed": breed, "--hoog": hoog } as React.CSSProperties}
    >
      {kop && <p className="sn-tegel-kop">{kop}</p>}
      <div className="sn-tegel-vlak">{children}</div>
    </div>
  );
}

// Een film in een tegel speelt stil in een lus, met dezelfde Sound on-pil als op het landingsscherm. De film laadt pas als
// hij bijna in beeld is en pauzeert buiten beeld, zodat de homepage met veel films licht blijft.
export function BentoFilm({ src, poster, label, geluid = true }: { src: string; poster?: string; label: string; geluid?: boolean }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [aan, setAan] = React.useState(false);
  const [laden, setLaden] = React.useState(false);
  // 30 september 2026 (Marinus): "WIL ECHT INSTANT LOADING". Ook de poster laadt pas als de film dichtbij komt (900 px).
  const [posterAan, setPosterAan] = React.useState(false);
  React.useEffect(() => {
    const film = ref.current;
    if (!film) return;
    if (typeof IntersectionObserver === "undefined") { setPosterAan(true); return; }
    const kijker = new IntersectionObserver(([ingang]) => {
      if (ingang.isIntersecting) { setPosterAan(true); kijker.disconnect(); }
    }, { rootMargin: "900px 0px" });
    kijker.observe(film);
    return () => kijker.disconnect();
  }, []);
  React.useEffect(() => {
    const film = ref.current;
    if (!film) return;
    if (typeof IntersectionObserver === "undefined") { setLaden(true); return; }
    const kijker = new IntersectionObserver(([ingang]) => {
      if (ingang.isIntersecting) { setLaden(true); void film.play().catch(() => {}); }
      else film.pause();
    }, { rootMargin: "240px 0px" });
    kijker.observe(film);
    return () => kijker.disconnect();
  }, []);
  const wissel = () => {
    const film = ref.current;
    if (!film) return;
    if (!aan) { film.currentTime = 0; void film.play().catch(() => {}); }
    film.muted = aan;
    setAan(!aan);
  };
  return (
    <>
      <video ref={ref} className="sn-tegel-film" src={laden ? src : undefined} poster={posterAan ? poster : undefined} autoPlay muted loop playsInline preload="none" aria-label={label} />
      {geluid && (
        <button type="button" className="h-hero-film-geluid" onClick={wissel} aria-pressed={aan}>
          {aan ? "Geluid uit" : "Geluid aan"}
        </button>
      )}
    </>
  );
}
