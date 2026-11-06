import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { TrustedBy, PartnerLogos } from "./HeaderAlgemeen";
import VijfJaarFilm from "./VijfJaarFilm";
import OdooFilm from "./OdooFilm";
import "./header-algemeen.css";
import "./home-enthousiast.css";

// Homepage, 4 november 2026. MARINUS: "zoals die nu staat is goed zet maar even live op socialnow.nl en die technische data en huidige
// landingspagina mag naar producten gaan dan is dit meer enthousiasmering en rest inhoudelijk en technisch. verder wil ik producten
// diensten en website actie". Dus de homepage enthousiasmeert: één kop, de film van Odoo Experience, drie deuren (Producten,
// Diensten, Website-actie), de merken en het werk. Alle inhoud en techniek staat op /producten (ProductenPagina in pages.tsx).
// Alleen teksten die Marinus eerder goedkeurde of die al op de site staan.
// Daarna: "verder producten diensten en website actie oid heel simpel meer focus op die websites" en "Nadruk op veiligheidsscan
// kan misschien wel veel kleiner." Dus de website-actie voorop en breed, de websites zelf eronder, en geen scan in de deuren.

// 4 november 2026 (Marinus): "Als CTA ook in de homepage voorkomen is heel belangrijk want daar gaat het nu het meest om nieuwe
// website maken gratis voor klanten." Een opvallende band direct onder de hero en nog een keer verderop. Een ?ref= in het adres van
// de homepage gaat mee naar de onboarding, zodat ieder een eigen deellink kan gebruiken (socialnow.nl/?ref=ben).
export function WebsiteCTA({ tweede = false }: { tweede?: boolean }) {
  const ref = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("ref") || "";
  const naar = ref ? `/gratis-website?ref=${encodeURIComponent(ref)}` : "/gratis-website";
  // 4 november 2026 (avond, Marinus): "Deze mobiele vind ik niks je mag daar nog een website tile van maken misschien is 2 wel vet en
  // focus meer op Gratis veiligheidupdates en websitedemo". Twee echte, live klantwebsites als tegels (geen concepten, geen kWh).
  return <section className={`sn-cta-web h-wrap${tweede ? " is-tweede" : ""}`} aria-label="Gratis veiligheidsupdates en websitedemo">
    <div>
      <p className="sn-cta-web-label"><i />Website-actie</p>
      <h2>Gratis veiligheidsupdates en websitedemo<span className="sn-alg-punt">.</span></h2>
      <p className="sn-cta-web-tekst">Wij houden je website veilig met gratis veiligheidsupdates en maken een demo van je nieuwe website op maat. Zes korte vragen, zonder verplichting.</p>
    </div>
    <Link className="sn-pill" to={naar}><span>Vraag je gratis website aan</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
    <span className="sn-cta-web-beeld" aria-hidden="true">
      <img className="is-een" src="/images/cases/vastiq-desktop.webp" alt="" loading="lazy" decoding="async" />
      <img className="is-twee" src="/images/cases/ilgordo-desktop.webp" alt="" loading="lazy" decoding="async" />
    </span>
  </section>;
}

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
            {/* 4 november 2026 (avond, Marinus): "2e knop hier graag blauw maken ook en eerste knop mag zijn website actie". */}
            <Link className="sn-pill" to="/gratis-website"><span>Website-actie</span><ArrowUpRight size={17} aria-hidden="true" /></Link>
            <a className="sn-pill sn-pill-blauw" href="#contact" onClick={naarContact}><span>Neem contact op</span><ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          {/* 4 november 2026 (Marinus, bij de lege ruimte onder de knoppen): "Hier moeten weer de shopify logo's etc komen." */}
          <PartnerLogos />
        </div>
        {/* 6 november 2026 (Marinus): de 5-jaarfilm als hoofdvideo, op de plek waar de teamfoto stond (VijfJaarFilm.tsx). De teamfoto
            (AtomiumFoto in HeaderAlgemeen.tsx) blijft bestaan; terugzetten = hier weer AtomiumFoto plaatsen, of tag bewaard/2026-11-06/voor-5years-video. */}
        {/* 6 november 2026 (Marinus): "Doe daarnaast maar de Odoo video nog op de website." De Odoo Experience-film staat naast de
            5-jaarfilm (OdooFilm.tsx); terugzetten met tag bewaard/2026-11-06/voor-odoo-film. */}
        <div className="sn-hero-films">
          <VijfJaarFilm />
          <OdooFilm />
        </div>
      </div>
      <TrustedBy />
    </section>
    {/* 4 november 2026 (avond, Marinus): "De landingspagina is wie wij zijn niet dit en hier moet de connect weer komen met daarna
        mooi de websites, daarna de mooie sliders en mobiele slider etc daarna mag wel die deze". De drie deuren en
        de band direct onder de hero zijn weg; de rest van de homepage staat in Home() in pages.tsx. */}
  </>;
}
