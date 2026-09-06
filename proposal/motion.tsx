import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pause, Play } from "lucide-react";

const MotionContext = createContext({
  enabled: false,
  paused: false,
  reduced: true,
  toggle: () => {},
});
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return (
    <MotionContext.Provider
      value={{
        enabled: !paused && !reduced,
        paused,
        reduced,
        toggle: () => setPaused((value) => !value),
      }}
    >
      <div data-motion={paused || reduced ? "paused" : "playing"}>
        {children}
      </div>
    </MotionContext.Provider>
  );
}
export const useMotion = () => useContext(MotionContext);
export function MotionControl() {
  const { enabled, reduced, toggle } = useMotion();
  if (reduced)
    return <span className="h-motion-note">Minder beweging ingeschakeld</span>;
  return (
    <button
      className="h-motion-control"
      type="button"
      onClick={toggle}
      aria-pressed={!enabled}
    >
      {enabled ? <Pause size={13} /> : <Play size={13} />}
      {enabled ? "Animaties pauzeren" : "Animaties afspelen"}
    </button>
  );
}
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}
export function AmbientVideo({
  src,
  sources,
  poster,
  label,
  className = "",
  suspended = false,
  hoverSound = false,
}: {
  src?: string;
  sources?: { src: string; type: string }[];
  poster?: string;
  label: string;
  className?: string;
  suspended?: boolean;
  hoverSound?: boolean;
}) {
  const { enabled } = useMotion();
  const { ref, visible } = useInView<HTMLSpanElement>();
  const video = useRef<HTMLVideoElement>(null);
  const shouldPlay = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (visible) setLoaded(true);
  }, [visible]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const sync = () => {
      shouldPlay.current = enabled && visible && !suspended && !document.hidden;
      if (shouldPlay.current) {
        void element
          .play()
          .then(() => {
            if (!shouldPlay.current) element.pause();
          })
          .catch(() => {});
      } else { element.muted = true; element.pause(); }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      shouldPlay.current = false;
      element.pause();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled, visible, loaded, suspended]);
  return (
    <span
      ref={ref}
      className={`h-ambient-video ${className}`}
      role="img"
      data-playing={playing}
      onPointerEnter={(event) => {
        if (!hoverSound || event.pointerType !== "mouse" || !video.current || !enabled || suspended) return;
        video.current.muted = false;
        void video.current.play().catch(() => { if (video.current) { video.current.muted = true; void video.current.play().catch(() => {}); } });
      }}
      onPointerLeave={() => { if (video.current) video.current.muted = true; }}
      aria-label={label}
    >
      {poster && (
        <img src={poster} alt="" width="512" height="512" loading="lazy" />
      )}
      {!poster && (
        <span className="h-video-placeholder" aria-hidden="true">
          <span>{label}</span>
        </span>
      )}
      {loaded && (
        <video
          ref={video}
          src={src}
          poster={poster}
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={() => setPlaying(true)}
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
          style={{ opacity: playing ? 1 : 0 }}
        >
          {sources?.map((source) => (
            <source key={source.src} {...source} />
          ))}
        </video>
      )}
    </span>
  );
}
export function MiloMotion({ role, name }: { role: string; name: string }) {
  const [safari, setSafari] = useState<boolean | null>(null);
  useEffect(() => { setSafari(/^((?!chrome|crios|fxios|edg|android).)*safari/i.test(navigator.userAgent)); }, []);
  return (
    <AmbientVideo
      poster={`/proposal/milo/${role}.webp`}
      key={safari === null ? "poster" : String(safari)}
      sources={safari === null ? [] : safari
        ? [{ src: `/proposal/milo/${role}-alpha.mov`, type: 'video/mp4; codecs="hvc1"' }]
        : [{ src: `/proposal/milo/${role}-alpha.webm`, type: "video/webm" }]}

      label={name}
      className="h-milo-animated"
    />
  );
}
