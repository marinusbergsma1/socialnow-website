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
import { HomeConnectBand } from "./HomeHeader";
// 18 oktober 2026: partners en veiligheidsdocumenten stonden direct onder de header; sinds 4 november 2026 in BrandFooter.
// 18 oktober 2026 (Marinus): "1 VERSIE DIE IK AANGAF WACHT MET AB TESTEN". Dus geen A/B-test meer.
// Sinds 4 november 2026 is HomeEnthousiast de homepage; HeaderBestaand (de header van daarvoor) staat op /producten en /het-os; de A/B-test (HomeHeaderAB.tsx, server/ab.mjs) blijft staan voor later.
import HeaderBestaand from "./HeaderBestaand";
import SamenEnVeilig from "./SamenEnVeilig";
import FreeWebsite from "./FreeWebsite";
import { VideoSlider, ImageSliders } from "./MediaSliders";
import HomeEnthousiast, { WebsiteCTA } from "./HomeEnthousiast";
import ExpertsGeloof from "./ExpertsGeloof";
import { Bento, Tegel } from "./Bento";
import { TextLink } from "./ui";
import { ArrowUpRight, Download } from "lucide-react";
import ConnectExperts from "./ConnectExperts";
import { DATA_DOCUMENT, Marks, next } from "./PixelInfrastructure";
import "./pixel-infrastructure.css";
import { useLanguage } from "./i18n/context";
import "./home-simple.css";

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

// 4 november 2026 (Marinus): "die technische data en huidige landingspagina mag naar producten gaan dan is dit meer enthousiasmering
// en rest inhoudelijk en technisch." De homepage is HomeEnthousiast; wat hier tot dan toe stond, is de pagina /producten.
export function Home() {
  useLanguage();
  return <div className="sn-simple-home">
    <section className="h-hero sn-approved-hero" id="home">
      <HomeEnthousiast />
      {/* 4 november 2026 (avond, Marinus): "De landingspagina is wie wij zijn [...] hier moet de connect weer komen met daarna mooi
          de websites, daarna de mooie sliders en mobiele slider etc daarna mag wel die deze en nog beter gemaakt". */}
      <HomeConnectBand />
    </section>
    <ConnectExperts />
    <FreeWebsite />
    <ImageSliders kort />
    <VideoSlider kort />
    <WebsiteCTA tweede />
  </div>;
}

export function ProductenPagina() {
  useLanguage();
  return <div className="sn-simple-home">
    <section className="h-hero sn-approved-hero" id="producten-pagina">
      {/* 4 november 2026 (Marinus): "Verder al die partnerinfo die nu weg is en deze Header mag weer terug bij producten daar is dat
          technische juist heel goed." Dus de homepage-header van vóór #201 (HeaderBestaand: OS met Milo's en downloads, Connect,
          software partners en Trusted by) en daaronder Groei en cybersecurity met de partners (SamenEnVeilig), net als toen. */}
      {/* 4 november 2026 (avond, Marinus): "Met deze header alleen een andere titel aangezien deze titel al is gebruikt meer op het doel
          van wat wij doen gefocust". Daaronder ons geloof: experts blijven altijd nodig, met de partners die meebouwen. */}
      <HeaderBestaand meet={() => {}} kop="Jouw doelen halen, met echte experts en AI." />
      <ExpertsGeloof />
      <SamenEnVeilig />
      <HomeConnectBand />
    </section>
    <ConnectExperts />
    <FreeWebsite />
    {/* 4 november 2026 (Marinus): "Vanuit onder de websites zelf mag er meer content komen vanuit de branding en voorbeelden." en
        "Net als hier maar kortere titels." Dezelfde rijen als op /projecten, met korte koppen. */}
    {/* Branding en campagnes staat sinds 4 november 2026 op de homepage (HomeEnthousiast); hier de video's. */}
    <VideoSlider kort />
    {/* 4 november 2026 (Marinus): eerst één grote slider met klantwerk-animaties, daarna "voeg anders die video's hier ook maar aan
        toe": de films lopen nu mee in de rijen van Branding en campagnes (MediaSliders.tsx, klantwerkFilms). See it in motion staat
        alleen nog op /projecten. */}
    {/* 19 oktober 2026, avond (Marinus): na Connect de websites, dan technologie en plug and play in één bentogrid, dan resultaten. */}
    <HomeTechniek />

    {/* 4 november 2026 (Marinus) over Wat we bereikten (Bereikt.tsx): "Deze mag weg." */}
    {/* Het blok met de vier Milo-tegels is weg (Marinus, 19 oktober 2026: "dit gedeelte kan denk ik wel weg"); de onderdelen staan op /het-os. */}
    {/* "onderaan nog even een zelfde soort website actie blok als wie wij zijn zodat je daar elke keer op uitkomt" */}
    <WebsiteCTA tweede />
  </div>;
}
