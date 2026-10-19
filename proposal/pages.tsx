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
import { HomeConnectBand } from "./HomeHeader";
// 18 oktober 2026: partners en veiligheidsdocumenten direct onder de header, zie SamenEnVeilig.tsx.
import SamenEnVeilig from "./SamenEnVeilig";
// 18 oktober 2026 (Marinus): "1 VERSIE DIE IK AANGAF WACHT MET AB TESTEN". Dus geen A/B-test meer: variant B
// (HeaderBestaand) is de header in elke taal. De test zelf (HomeHeaderAB.tsx, server/ab.mjs) blijft staan voor later.
import HeaderBestaand from "./HeaderBestaand";
import FreeWebsite from "./FreeWebsite";
import { Bento, Tegel } from "./Bento";
import { TextLink } from "./ui";
import { ArrowUpRight, Download } from "lucide-react";
import ConnectExperts from "./ConnectExperts";
import { DATA_DOCUMENT, Marks, next } from "./PixelInfrastructure";
import "./pixel-infrastructure.css";
import { useLanguage } from "./i18n/context";
import "./home-simple.css";
const Bereikt = later(() => import("./Bereikt").then(m => m.default));

// 19 oktober 2026, avond (Marinus): "websites Technologie met een duidelijke rol en plug and play gedeelte in 1 bentogrid zodat
// ie korter is". Dus het blok PixelInfrastructure en de bento "Software as a tool" samen in vijf tegels, met hun eigen teksten.
// "Ons netwerk groeit" (verkennende gesprekken) valt weg om het kort te houden; PixelInfrastructure staat nog op zijn eigen pagina.
function HomeTechniek() {
  return <Bento id="techniek" label="Technologie met een duidelijke rol" titel={<>Een sterke basis.<br /><span>Plug and play.</span></>} className="sn-home-techniek">
    <Tegel kop="SocialNow OS" breed={6}>
      <img className="sn-techniek-os" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" loading="lazy" width="170" />
      <h3 className="sn-tegel-titel">Samen laten werken.</h3>
      <p className="sn-tegel-tekst">Odoo, Zernio en je OS komen samen. Je OS, Studio, Ads en Sales. Met persoonlijke ondersteuning.</p>
      <div className="sn-tegel-onder"><TextLink to="/het-os">Ontdek je OS</TextLink></div>
    </Tegel>
    <Tegel kop="Plug and play." breed={6}>
      <p className="sn-tegel-tekst">Meer automatisering en overzicht in al je bedrijfssoftware. Maak je eigen koppelingen. Je data blijft van jou.</p>
      <Marks items={next} />
    </Tegel>
    <Tegel kop="Jouw data. Jouw connecties." breed={4}>
      <h3 className="sn-tegel-titel" translate="no">We are the service layer.</h3>
      <p className="sn-tegel-tekst">Jouw gegevens blijven van jou. Jij houdt de regie over je eigen verbindingen en je systeem. De software verbindt jouw tools tot een persoonlijk of op maat gemaakt systeem. Wij zijn de persoonlijke servicelaag daaromheen.</p>
    </Tegel>
    <Tegel kop="Veiligheid. Zwart op wit." breed={4}>
      <p className="sn-tegel-tekst">Versleutelde sleutels, toegang per werkruimte en jouw akkoord voor acties. Lees uitgebreid hoe wij je data beschermen en wat jouw eigen rol is.</p>
      <div className="sn-tegel-onder sn-techniek-links"><a href={DATA_DOCUMENT} download><Download size={16} aria-hidden="true" />Uitgebreide documentatie (PDF · NL)</a><Link to="/veiligheid">Alles over veiligheid <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </Tegel>
    <Tegel kop="Eerst waarde bieden." breed={4}>
      <p className="sn-tegel-tekst">We volgen je gedrag niet. Feedback komt uit persoonlijk contact. We begonnen met Odoo en Zernio omdat hun aanpak aansluit bij die van ons: eerst waarde bieden en jezelf bewijzen. Daarom maken we gratis websites voor iedereen.</p>
    </Tegel>
  </Bento>;
}

export function Home() {
  useLanguage();
  return <div className="sn-simple-home">
    <section className="h-hero sn-approved-hero" id="home">
      <HeaderBestaand meet={() => {}} />
      <SamenEnVeilig />
      <HomeConnectBand />
    </section>
    <ConnectExperts />
    <FreeWebsite />
    {/* 19 oktober 2026, avond (Marinus): na Connect de websites, dan technologie en plug and play in één bentogrid, dan resultaten. */}
    <HomeTechniek />

    <OnderDeVouw ruimte={false}><Bereikt /></OnderDeVouw>
    {/* Het blok met de vier Milo-tegels is weg (Marinus, 19 oktober 2026: "dit gedeelte kan denk ik wel weg"); de onderdelen staan op /het-os. */}
  </div>;
}
