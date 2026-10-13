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
import { Bento, Tegel } from "./Bento";
import { MiloPortrait, TextLink } from "./ui";
import OsPeople from "./OsPeople";
import { agents } from "./content";
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
    <Bento id="het-os" label="Vier onderdelen / Eén verbonden bedrijf" titel={<>Vier gezichten.<br /><span>Eén geheel.</span></>} className="sn-home-milos" swipe>
      {agents.map(agent => <Tegel key={agent.id} kop={agent.title} breed={3} className="h-os-agent">
        <MiloPortrait role={agent.id} name={agent.name} maat={256} />
        <strong className="h-os-belofte" style={{ color: agent.color }}>{agent.promise}</strong>
        <p className="sn-tegel-tekst">{agent.text}</p>
        <OsPeople role={agent.id} />
        <div className="sn-tegel-onder"><TextLink to={`/het-os#${agent.id}`}>Ontdek dit onderdeel</TextLink></div>
      </Tegel>)}
    </Bento>
  </div>;
}
