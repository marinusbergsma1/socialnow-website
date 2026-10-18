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
import "./resultaten-cijfers.css";
import React from "react";
import { Link } from "react-router-dom";
import { OnderDeVouw, later } from "./later";
import HomeHeader, { HomeDevelopmentPartners, HomeConnectBand } from "./HomeHeader";
import FreeWebsite from "./FreeWebsite";
import { Bento, Tegel } from "./Bento";
import { MiloPortrait, TextLink } from "./ui";
import OsPeople from "./OsPeople";
import { agents } from "./content";
import ConnectExperts from "./ConnectExperts";
import PixelInfrastructure from "./PixelInfrastructure";
import { useLanguage } from "./i18n/context";
import "./home-simple.css";
const Bereikt = later(() => import("./Bereikt").then(m => m.default));

export function Home() {
  useLanguage();
  return <div className="sn-simple-home">
    <section className="h-hero sn-approved-hero" id="home">
      <HomeHeader />
      <HomeConnectBand />
    </section>
    <ConnectExperts />
    <FreeWebsite />
    <div className="h-wrap sn-platform-foundation"><PixelInfrastructure /></div>
    <HomeDevelopmentPartners />
    <Bento id="jouw-systeem" label="Jouw data. Jouw connecties." titel={<>Software as a tool.<br /><span>Not a service.</span></>}>
      <Tegel kop="Jouw data. Jouw connecties." breed={6}>
        <h3 className="sn-tegel-titel" translate="no">We are the service layer.</h3>
        <p className="sn-tegel-tekst">Jouw gegevens blijven van jou. Jij houdt de regie over je eigen verbindingen en je systeem. De software verbindt jouw tools tot een persoonlijk of op maat gemaakt systeem. Wij zijn de persoonlijke servicelaag daaromheen.</p>
      </Tegel>
      <Tegel kop="Eerst waarde bieden." breed={6}>
        <p className="sn-tegel-tekst">We volgen je gedrag niet. Feedback komt uit persoonlijk contact. We begonnen met Odoo en Zernio omdat hun aanpak aansluit bij die van ons: eerst waarde bieden en jezelf bewijzen. Daarom maken we gratis websites voor iedereen.</p>
      </Tegel>
    </Bento>

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
