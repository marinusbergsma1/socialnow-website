import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import TeamTrust from "./TeamTrust";
import "./home-header.css";

// 12 oktober 2026: gekozen header 1, met bedrijfsvoering en de menselijke verbinding centraal.
export default function HomeHeader() {
  return <div className="sn-home-copy">
    <TeamTrust />
    <div className="sn-home-pain">
      <strong>Vier bedrijven. Vier facturen. Elke maand opnieuw.</strong>
      <span>Marketingbureau · Webdesigner · Ads-bureau · Softwarelicenties</span>
    </div>
    <h1 className="sn-home-title">Wij doen het anders.</h1>
    <p className="sn-home-human" translate="no">Human connection,<br />powered by AI technology.</p>
    <p className="sn-home-lead">Eén Operation &amp; Management-systeem voor je website, CRM, content en advertenties.</p>
    <p className="sn-home-connect">Onze experts denken met je mee over je bedrijf.</p>
    <div className="sn-home-offer">
      <img src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" width="600" height="140" />
      <p><strong>Start GRATIS tot 10 GB.</strong><span>Daarna €20,- per maand.</span></p>
    </div>
    <div className="sn-home-actions">
      <a href="https://app.socialnow.nl/login/" className="sn-home-cta">Start gratis <ArrowUpRight size={23} aria-hidden="true" /></a>
      <Link to="/audit" className="sn-home-cta sn-home-secondary"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285f4" d="M13.3 2.8a3.3 3.3 0 0 1 4.5 1.2l5.1 8.8a3.3 3.3 0 0 1-5.7 3.3L12.1 7.3a3.3 3.3 0 0 1 1.2-4.5Z"/><path fill="#fbbc04" d="M12.1 4a3.3 3.3 0 0 1 5.7 3.3L8.7 23a3.3 3.3 0 0 1-5.7-3.3Z"/><circle fill="#34a853" cx="5.9" cy="21.3" r="3.3"/></svg>Gratis Google Ads-scan <ArrowUpRight size={23} aria-hidden="true" /></Link>
    </div>
    <div className="sn-home-extras">
      <a href="https://website.socialnow.nl">Gratis website <ArrowUpRight size={16} aria-hidden="true" /></a>
      <a href="#os-explainer"><Play size={15} aria-hidden="true" />Bekijk de explainer</a>
    </div>
  </div>;
}

export function HomeExplainer() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  return <section className="sn-home-explainer" id="os-explainer" aria-labelledby="sn-explainer-title">
    <div className="sn-home-explainer-intro">
      <img className="sn-home-explainer-logo" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" width="600" height="140" />
      <h2 id="sn-explainer-title">Je bedrijfsvoering.<br />Alles verbonden.</h2>
      <p>Ontdek hoe mensen, je bedrijfsvoering en AI samenkomen.</p>
    </div>
    <div className="sn-home-player">
    <video ref={video} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} controls playsInline preload="metadata" poster="/video/os/socialnow-os-explainer-poster.jpg" aria-label="SocialNow OS explainer (Engels)">
      <source src="/video/os/socialnow-os-explainer.mp4" type="video/mp4" />
      <a href="/video/os/socialnow-os-explainer.mp4">Bekijk de SocialNow OS explainer</a>
    </video>
    {!playing && <button className="sn-home-play" type="button" onClick={() => { setFailed(false); video.current?.play().catch(() => setFailed(true)); }}><Play size={20} aria-hidden="true" />Speel de explainer af</button>}
    </div>
    {failed && <p role="status"><a href="/video/os/socialnow-os-explainer.mp4">Open de video om af te spelen ↗</a></p>}
  </section>;
}
