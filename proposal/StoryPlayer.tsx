import { useRef, useState } from "react";
import { useLanguage } from "./i18n/context";

export default function StoryPlayer() {
  const { t } = useLanguage();
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const play = async () => {
    const player = video.current;
    if (!player) return;
    setFailed(false);
    setLoading(true);
    try {
      if (player.error) player.load();
      await player.play();
      setStarted(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  return <div className="h-story-video-wrap">
    <video ref={video} controls={started} playsInline preload="metadata"
      poster="/video/verhaal/story-presentatie-poster.jpg" aria-label="The story of Marinus Bergsma"
      onPlaying={() => { setStarted(true); setLoading(false); setFailed(false); }}
      onError={() => { setFailed(true); setLoading(false); setStarted(false); }}>
      <source src="/video/verhaal/story-presentatie.mp4?v=connect-20261012" type="video/mp4" />
    </video>
    {!started && <div className="h-story-start">
      <button type="button" className="h-story-play" onClick={play} disabled={loading}>
        <span aria-hidden="true">▶</span><span>{t(loading ? "Video laden…" : failed ? "Probeer opnieuw" : "Bekijk mijn verhaal")}</span>
      </button>
      {failed && <p role="alert">{t("De video kon niet starten.")} <a href="/video/verhaal/story-presentatie.mp4?v=connect-20261012" target="_blank" rel="noopener noreferrer">{t("Open de video")}</a></p>}
    </div>}
  </div>;
}
