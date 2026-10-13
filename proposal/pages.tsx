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
import { HomeExplainer } from "./HomeHeader";
import LiveWebsites from "./LiveWebsites";
import FounderProfile from "./FounderProfile";
import StoryPlayer from "./StoryPlayer";
import { useLanguage } from "./i18n/context";
import "./home-simple.css";
const Bereikt = later(() => import("./Bereikt").then(m => m.default));
const BrandGlobe = later(() => import("./BrandGlobe").then(m => m.default));

export function Home() {
  useLanguage();
  return <div className="sn-simple-home">
    <LiveWebsites demo />
    <div className="h-wrap sn-demo-agreement">
      <p><strong>Tevreden? Dan mag je de demo houden.</strong><br />Anders spreken we een eerlijke prijs af en maken we je website samen perfect.</p>
    </div>
    <section className="h-section h-wrap sn-home-story" id="verhaal" aria-labelledby="sn-story-title">
      <header><p className="h-eyebrow">Ons verhaal</p><h2 id="sn-story-title">Mensen maken het verschil.</h2><p>Human connection, powered by AI technology.</p></header>
      <div className="sn-home-story-grid">
        <FounderProfile />
        <div><StoryPlayer /><p>Software is een tool. Wij verbinden mensen, ideeën en technologie om samen aan jouw bedrijf te bouwen.</p><Link className="h-text-link" to="/team">Ons verhaal en het team ↗</Link></div>
      </div>
    </section>
    <OnderDeVouw ruimte={false}><Bereikt /></OnderDeVouw>
    <section className="h-section h-wrap sn-home-operations" id="het-os" aria-labelledby="sn-operations-title">
      <div className="sn-home-planet" aria-hidden="true"><BrandGlobe /></div>
      <HomeExplainer />
      <div className="sn-home-operations-copy"><p className="h-eyebrow">Operation &amp; Management</p><h2 id="sn-operations-title">Je website, CRM, content en advertenties. Samen in één systeem.</h2><p>SocialNow OS verbindt je dagelijkse bedrijfsvoering. Onze experts denken persoonlijk met je mee.</p><Link className="h-text-link" to="/het-os">Ontdek het systeem ↗</Link></div>
    </section>
  </div>;
}
