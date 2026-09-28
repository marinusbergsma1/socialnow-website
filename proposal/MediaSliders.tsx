import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AmbientVideo, MotionControl, useInView, useMotion } from "./motion";
import { Bento, BentoFilm, Tegel } from "./Bento";
import "./media-bento.css";

export type MediaItem = {
  src: string;
  title: string;
  kind: "image" | "video";
  slug?: string;
};
export const portfolioImages: MediaItem[] = [
  {
    src: "/images/1400-Mark-Johnson-LUV-YOU-STILL-1.webp",
    title: "Mark Johnson · LUV YOU STILL",
    kind: "image",
  },
  {
    src: "/images/CRAFTURE-FASTX-PERSWAND-400x2200-1.webp",
    title: "FAST X · Campagne",
    kind: "image",
    slug: "universal-sony-banners",
  },
  {
    src: "/images/C4-FEED-30-korting.webp",
    title: "C4 · Social content",
    kind: "image",
  },
  {
    src: "/images/header-Bouadu-v2-1.webp",
    title: "AZ · Boadu artwork",
    kind: "image",
    slug: "az-alkmaar-socials",
  },
  {
    src: "/images/666f15bbb49442553d264e6d-PRINT-BIND.webp",
    title: "Print & Bind · Interieur",
    kind: "image",
    slug: "print-bind-interieur",
  },
  {
    src: "/images/Light-Art-Collection.webp",
    title: "Light Art Collection",
    kind: "image",
  },
  {
    src: "/images/Soulful-Special-Event-Header-1.webp",
    title: "Soulful · House Special",
    kind: "image",
  },
  {
    src: "/images/THE-HEALTH-HOUSE-CONCEPT-1.webp",
    title: "The Health House · Branding",
    kind: "image",
  },
  {
    src: "/images/THH-VALENTINE-SALE-STORY-2024-1200x1200-1200x1200-1.webp",
    title: "C4 · Valentine-campagne",
    kind: "image",
  },
];
// De oorspronkelijke collectie uit ShortContent.tsx; geen vervangende stockvideo's.
export const portfolioVideos: MediaItem[] = [
  ["HD/freaky_2_years.mp4", "Freaky · 2 Years"],
  [
    "HD/newyear_supperclub_countdown_1day_v1%20(1080p).mp4",
    "Supperclub · New Year",
  ],
  ["HD/VIRAL_17-02_PROMO-VID.mp4", "Viral · Promo"],
  [
    "HD/kleine_john_%26_chavante_viral_v1%20(1080p).mp4",
    "Kleine John & Chavante",
  ],
  [
    "HD/Bakboord%20x%20Supperclub%20Cruise%20promotievideo.mp4",
    "Bakboord × Supperclub Cruise",
  ],
  [
    "HD/jobdex_vid_oranjebloesem_personeel_v1%20(1080p).mp4",
    "Jobdex · Oranjebloesem",
  ],
  ["RAVEG_HYPERPOWER_VID_EN_2_STORY.mp4", "RAVEG · Hyperpower"],
  [
    "HD/909%20Festival_Aftermovie%20in%20Reverse%203.mp4",
    "909 Festival · Aftermovie",
  ],
  ["HD/DINE%26DANCE%20VB_2.mp4", "Dine & Dance"],
  ["HD/VIRAL%20BRYAN%20MG%20-%20V2%202.mp4", "Viral · Bryan MG"],
  ["HD/VIRAL_CHIQ-EDITION%202.mp4", "Viral · Chiq Edition"],
  ["HD/VIRAL_PRETTY-GIRLS-EDITION%202.mp4", "Viral · Pretty Girls"],
  [
    "HD/WEEK%2046%20-%20Friday%20-%20FRIDAY%20FRESHNESS.mp4",
    "Friday Freshness",
  ],
  ["HD/MUSE%20MODE%20TEAM%20VIDEO.mp4", "Muse Mode · Team"],
].map(([file, title]) => ({
  src: `https://storage.googleapis.com/video-slider/${file}`,
  title,
  kind: "video",
}));

export function MediaDialog({
  item,
  close,
}: {
  item: MediaItem | null;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const title = useId();
  useEffect(() => {
    if (!item) {
      dialog.current?.close();
      return;
    }
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      video.current?.pause();
      document.body.style.overflow = overflow;
    };
  }, [item]);
  return (
    <dialog
      className="h-media-dialog"
      ref={dialog}
      onCancel={close}
      onClose={close}
      aria-labelledby={title}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      <div className="h-media-dialog-top">
        <h2 id={title}>{item?.title || "Werk van SocialNow"}</h2>
        <button type="button" onClick={close} aria-label="Media sluiten">
          <X size={21} />
        </button>
      </div>
      {item?.kind === "video" ? (
        <video
          key={item.src}
          ref={video}
          src={item.src}
          controls
          autoPlay
          playsInline
          preload="metadata"
          aria-label={item.title}
        />
      ) : (
        item && <img src={item.src} alt={item.title} />
      )}
      {item?.slug && (
        <Link
          className="h-text-link"
          to={`/project/${item.slug}`}
          onClick={close}
        >
          Bekijk de volledige case
        </Link>
      )}
    </dialog>
  );
}
function MediaRail({
  items,
  reverse = false,
  label,
}: {
  items: MediaItem[];
  reverse?: boolean;
  label: string;
}) {
  const { enabled } = useMotion();
  const { ref, visible } = useInView<HTMLDivElement>();
  const group = useRef<HTMLDivElement>(null);
  const width = useRef(0);
  const position = useRef(0);
  const interaction = useRef(0);
  const drag = useRef({ active: false, startX: 0, scroll: 0, distance: 0 });
  const [copies, setCopies] = useState(3);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [item, setItem] = useState<MediaItem | null>(null);
  const id = useId();
  const videoRail = items[0].kind === "video";
  useEffect(() => {
    const viewport = ref.current;
    const set = group.current;
    if (!viewport || !set) return;
    const observer = new ResizeObserver(() => {
      const next = set.getBoundingClientRect().width;
      if (next > 0)
        setCopies(Math.max(3, Math.ceil(viewport.clientWidth / next) + 2));
      if (next > 0 && Math.abs(width.current - next) > 1) {
        const ratio = width.current ? viewport.scrollLeft / width.current : 1;
        width.current = next;
        position.current = next * ratio;
        viewport.scrollLeft = position.current;
      }
    });
    observer.observe(set);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!enabled || !visible || hover || focused || item) return;
    const viewport = ref.current;
    if (!viewport) return;
    let frame = 0;
    let last = 0;
    position.current = viewport.scrollLeft;
    const tick = (time: number) => {
      if (
        !document.hidden &&
        !drag.current.active &&
        time > interaction.current &&
        width.current
      ) {
        const step =
          Math.min(last ? (time - last) / 1000 : 0, 0.05) *
          (videoRail ? 22 : 18);
        position.current += reverse ? -step : step;
        if (position.current >= width.current * 2)
          position.current -= width.current;
        if (position.current < width.current * 0.5)
          position.current += width.current;
        viewport.scrollLeft = position.current;
      } else position.current = viewport.scrollLeft;
      last = time;
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled, visible, hover, focused, item, reverse, videoRail]);
  const move = (direction: number) => {
    interaction.current = performance.now() + 6000;
    const step =
      group.current?.firstElementChild?.getBoundingClientRect().width || 300;
    ref.current?.scrollBy({
      left: direction * (step + 20),
      behavior: enabled ? "smooth" : "instant",
    });
  };
  return (
    <div
      className={`h-media-rail${videoRail ? " is-video" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setFocused(false);
      }}
    >
      <div
        ref={ref}
        id={id}
        className="h-media-viewport"
        role="region"
        aria-label={label}
        tabIndex={0}
        onWheel={() => {
          interaction.current = performance.now() + 6000;
        }}
        onPointerDown={(event) => {
          interaction.current = performance.now() + 7000;
          drag.current.distance = 0;
          if (event.pointerType === "mouse")
            drag.current = {
              active: true,
              startX: event.clientX,
              scroll: event.currentTarget.scrollLeft,
              distance: 0,
            };
        }}
        onPointerMove={(event) => {
          if (!drag.current.active) return;
          const distance = event.clientX - drag.current.startX;
          drag.current.distance = Math.abs(distance);
          if (Math.abs(distance) > 5) {
            event.preventDefault();
            if (!event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.scrollLeft = drag.current.scroll - distance;
          }
        }}
        onPointerUp={(event) => {
          drag.current.active = false;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          drag.current.active = false;
        }}
        onPointerLeave={() => {
          drag.current.active = false;
        }}
        onClickCapture={(event) => {
          if (drag.current.distance > 5) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.distance = 0;
          }
        }}
      >
        {Array.from({ length: copies }, (_, copy) => copy).map((copy) => (
          <div
            ref={copy === 1 ? group : undefined}
            className="h-media-group"
            key={copy}
            aria-hidden={copy !== 1 ? true : undefined}
          >
            {items.map((media) => (
              <button
                key={media.src}
                type="button"
                className="h-media-card"
                tabIndex={copy === 1 ? 0 : -1}
                onClick={() => setItem(media)}
                aria-label={`Bekijk ${media.title}`}
              >
                {media.kind === "video" ? (
                  <AmbientVideo
                    src={media.src}
                    label={media.title}
                    suspended={!!item}
                    hoverSound
                  />
                ) : (
                  <img
                    src={media.src}
                    alt={media.title}
                    width="720"
                    height="450"
                    loading="lazy"
                    draggable={false}
                  />
                )}
                <span className="h-media-caption">
                  {media.title}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="h-rail-controls h-wrap">
        <span>Sleep of veeg om te ontdekken</span>
        <div className="h-rail-arrows">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={`Vorige beelden: ${label}`}
            aria-controls={id}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={`Volgende beelden: ${label}`}
            aria-controls={id}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <MediaDialog item={item} close={() => setItem(null)} />
    </div>
  );
}
// 28 september 2026 (Marinus): content en portfolio als bentotegels zoals het landingsscherm. Een uitgelichte film of
// foto groot, een korte tegel ernaast, en de volledige strook als tegel over de breedte. Klik op een tegel opent de MediaDialog.
function Vergroot({ item, open }: { item: MediaItem; open: (item: MediaItem) => void }) {
  return (
    <button type="button" className="mb-vergroot" onClick={() => open(item)} aria-label={`Bekijk ${item.title}`}>
      <span>{item.title}</span>
    </button>
  );
}
export function VideoSlider() {
  const [item, setItem] = useState<MediaItem | null>(null);
  const uitgelicht = portfolioVideos[4];
  const staand = portfolioVideos[6];
  return (
    <>
    <Bento id="content-motion" className="mb-bento" label="Content & motion" titel={<>Ideeën in beweging.<br /><span>Merken die je bijblijven.</span></>}>
      <Tegel kop="Uitgelicht" breed={8} soort="film" className="mb-film">
        <BentoFilm src={uitgelicht.src} label={uitgelicht.title} />
        <Vergroot item={uitgelicht} open={setItem} />
      </Tegel>
      <Tegel kop="Short-form" breed={4} soort="film" className="mb-film mb-staand">
        <BentoFilm src={staand.src} label={staand.title} />
        <Vergroot item={staand} open={setItem} />
      </Tegel>
      <Tegel kop="Alle producties" breed={12} className="mb-strook">
        <MediaRail items={portfolioVideos} label="Videoportfolio" />
      </Tegel>
    </Bento>
    <MediaDialog item={item} close={() => setItem(null)} />
    </>
  );
}
export function ImageSliders() {
  const [item, setItem] = useState<MediaItem | null>(null);
  const [groot, rechts, onder] = [portfolioImages[3], portfolioImages[4], portfolioImages[1]];
  const foto = (media: MediaItem, breed: 5 | 7, hoog: 1 | 2, kop: string) => (
    <Tegel kop={kop} breed={breed} hoog={hoog} soort="foto" className="mb-foto">
      <img src={media.src} alt={media.title} loading="lazy" draggable={false} />
      <Vergroot item={media} open={setItem} />
    </Tegel>
  );
  return (
    <>
    <Bento id="portfolio" className="mb-bento" label="Portfolio" titel={<>Recent werk.<br /><span>Een eigen gezicht.</span></>}>
      {foto(groot, 7, 2, "Artwork")}
      {foto(rechts, 5, 1, "Interieur")}
      {foto(onder, 5, 1, "Campagne")}
      <Tegel kop="Meer werk" breed={12} className="mb-strook">
        <MediaRail items={portfolioImages} label="Portfolio" />
      </Tegel>
    </Bento>
    <MediaDialog item={item} close={() => setItem(null)} />
    </>
  );
}
