import "./milo-vragen.css";
import "./hero-c.css";
import "./partner-intro.css";
import "./bereikt.css";
import "./mens-en-ai.css";
import "./vacatures-bento.css";
import "./veiligheid.css";
import "./audit.css";
import "./cases.css";
import "./media-bento.css";
import "./pricing.css";
import "./site-visie.css";
import "./free-website.css";
import "./wereldkaart.css";
import React from "react";
import { Link } from "react-router-dom";
import { OnderDeVouw, later } from "./later";
import HomeHeader, { HomeExplainer } from "./HomeHeader";
import FreeWebsite from "./FreeWebsite";
import HomeTeam from "./HomeTeam";
import CharacterAccent from "./CharacterAccent";
import { useLanguage } from "./i18n/context";
import "./home-simple.css";
const Bereikt = later(() => import("./Bereikt").then(m => m.default));
const BrandGlobe = later(() => import("./BrandGlobe").then(m => m.default));

export function Home() {
  useLanguage();
  return <div className="sn-simple-home">
    <section className="h-hero" id="home">
      <div className="h-hero-background"><BrandGlobe /></div>
      <div className="h-wrap h-hero-content">
        <div className="h-hero-tekst"><HomeHeader /></div>
        <HomeExplainer />
        <HomeTeam />
      </div>
    </section>
    <div className="h-wrap sn-demo-agreement">
      <p><strong>Tevreden? Dan mag je de demo houden.</strong><br />Anders spreken we een eerlijke prijs af en maken we je website samen perfect.</p>
    </div>
    <FreeWebsite />
    <section className="h-section h-wrap sn-home-story" id="verhaal" aria-labelledby="sn-story-title">
      <div className="sn-home-story-card">
        <div><p className="h-eyebrow">Ons verhaal</p><h2 id="sn-story-title">Software is een tool.<br />Mensen maken het verschil.</h2><p>Van grafische vormgeving naar AI en development. De persoonlijke verbinding blijft de kern van SocialNow.</p><Link className="h-text-link" to="/team#verhaal">Ons verhaal ↗</Link></div>
        <CharacterAccent kind="coder" />
      </div>
    </section>
    <OnderDeVouw ruimte={false}><Bereikt /></OnderDeVouw>
    <section className="h-section h-wrap sn-home-operations" id="het-os" aria-labelledby="sn-operations-title">
      <div className="sn-home-planet" aria-hidden="true"><BrandGlobe /></div>
      <img className="sn-operations-logo" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" width="600" height="140" />
      <div className="sn-home-operations-copy"><p className="h-eyebrow">Operation &amp; Management</p><h2 id="sn-operations-title">Je website, CRM, content en advertenties. Samen in één systeem.</h2><p>SocialNow OS verbindt je dagelijkse bedrijfsvoering. Onze experts denken persoonlijk met je mee.</p><Link className="h-text-link" to="/het-os">Ontdek het systeem ↗</Link></div>
    </section>
  </div>;
}
