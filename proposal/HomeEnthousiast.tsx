import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { TrustedBy } from "./HeaderAlgemeen";
import { ImageSliders } from "./MediaSliders";
import { WebsiteTegel } from "./FreeWebsite";
import "./header-algemeen.css";
import "./home-enthousiast.css";

// Homepage, 4 november 2026. MARINUS: "zoals die nu staat is goed zet maar even live op socialnow.nl en die technische data en huidige
// landingspagina mag naar producten gaan dan is dit meer enthousiasmering en rest inhoudelijk en technisch. verder wil ik producten
// diensten en website actie". Dus de homepage enthousiasmeert: één kop, de film van Odoo Experience, drie deuren (Producten,
// Diensten, Website-actie), de merken en het werk. Alle inhoud en techniek staat op /producten (ProductenPagina in pages.tsx).
// Alleen teksten die Marinus eerder goedkeurde of die al op de site staan.
// Daarna: "verder producten diensten en website actie oid heel simpel meer focus op die websites" en "Nadruk op veiligheidsscan
// kan misschien wel veel kleiner." Dus de website-actie voorop en breed, de websites zelf eronder, en geen scan in de deuren.
const DEUREN = [
  { naar: "/gratis-website", soort: "Website-actie", kop: "Wij maken jouw website, gratis", tekst: "Vertel ons over je bedrijf en wat je mooi vindt. Wij maken een demo die echt bij je past.", beeld: "/images/cases/kwhgarant-desktop.webp", breed: true },
  { naar: "/producten", soort: "Producten", kop: "SocialNow OS en Connect", tekst: "Hoe het werkt, wie het bouwt en welke techniek erachter zit.", beeld: "/video/os/os-master-en.webp" },
  { naar: "/diensten", soort: "Diensten", kop: "Van merk tot techniek", tekst: "Websites, branding, content, advertenties en development.", beeld: "/images/cases/vastiq-desktop.webp" },
];

export default function HomeEnthousiast() {
  const naarContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const doel = document.getElementById("contact");
    if (!doel) return;
    e.preventDefault();
    doel.scrollIntoView({ behavior: "smooth", block: "center" });
    doel.focus({ preventScroll: true });
  };
  return <>
    <section className="sn-alg sn-blij" aria-labelledby="sn-blij-kop">
      <div className="sn-alg-wrap">
        <div className="sn-alg-tekst">
          <p className="sn-alg-label"><i />Management · Operations · Odoo</p>
          <h1 id="sn-blij-kop">Een betrouwbare partner voor groei en cybersecurity<span className="sn-alg-punt">.</span></h1>
          <p className="sn-alg-uitleg"><strong>Wij helpen je met management, operations en Odoo.</strong> Doelgerichte totaaloplossingen, met experts en AI. Veilig, lokaal en in eigen beheer.</p>
          <div className="sn-alg-acties">
            <Link className="sn-pill" to="/gratis-website"><span>Start met een gratis websitedemo</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
            <a className="sn-pill" href="#contact" onClick={naarContact}><span>Neem contact op</span><ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="sn-blij-film">
          <video src="/video/odoo-experience/odoo-experience-kort.mp4" poster="/video/odoo-experience/odoo-experience-kort-poster.webp" autoPlay muted loop playsInline aria-label="Ons team op Odoo Experience 2026 in Brussel" />
        </figure>
      </div>
      <TrustedBy />
    </section>
    <section className="sn-deuren h-wrap" aria-labelledby="sn-deuren-kop">
      <h2 id="sn-deuren-kop">Waar wil je beginnen?</h2>
      <ul>
        {DEUREN.map((d) => <li key={d.naar} className={d.breed ? "sn-deur-breed" : undefined}>
          <Link to={d.naar}>
            <span className="sn-deur-beeld"><img src={d.beeld} alt="" loading="lazy" decoding="async" /></span>
            <span className="sn-deur-soort">{d.soort}</span>
            <strong>{d.kop}</strong>
            <span className="sn-deur-tekst">{d.tekst}</span>
            <span className="sn-deur-pijl" aria-hidden="true"><ArrowUpRight size={18} /></span>
          </Link>
        </li>)}
      </ul>
    </section>
    {/* De websites zelf, direct onder de deuren (FreeWebsite.tsx, dezelfde slider als op /producten). */}
    <WebsiteTegel />
    <ImageSliders kort />
  </>;
}
