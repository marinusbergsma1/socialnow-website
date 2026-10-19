import React from "react";
import "./founder-profile.css";

// 19 oktober 2026 (Marinus): "Graag zoals Linkedin ziet er nog niet helemaal netjes uit zo." en "Verhoudingen etc".
// Ervaring zoals op LinkedIn: logo's van 48 px, functie vet, bedrijf eronder, periode en plaats in grijs, lijn ertussen.
// 5 oktober 2026 (Marinus): "Ik ben verder ook geen 5 jaar in November maar SocialNow." SocialNow bestaat in november 2026 vijf jaar.
// Daarna stuurde hij zijn LinkedIn-ervaring als voorbeeld; functies, periodes, plaats en omschrijving komen daaruit.
const ERVARING = [
  {
    logo: "/icon-512.png", logoAlt: "SocialNow", vlak: true,
    functie: "Founder & CEO", bedrijf: "SocialNow · Fulltime",
    duur: "nov. 2021 tot heden · 5 jr", plaats: "Amsterdam, Noord-Holland, Nederland",
    tekst: "SocialNow opgericht om mensen, creativiteit en technologie samen te brengen. We helpen bedrijven groeien met branding, digitale marketing, AI-gestuurde bedrijfssystemen en automatiseringen.",
  },
  {
    logo: "/images/marinus-bergsma-vormgeving-logo.png", logoAlt: "Marinus Bergsma Graphic Design",
    functie: "Founder & Art Director", bedrijf: "Marinus Bergsma Graphic Design · Zelfstandig / Eigenaar",
    duur: "jan. 2020 tot heden · 6 jr 10 mnd", plaats: "Amsterdam, Noord-Holland, Nederland · Op afstand",
    tekst: "Een eigen ontwerpstudio opgericht voor visuele identiteiten, branding en creatieve richting. De basis voor SocialNow.",
  },
];

export default function FounderProfile() {
  return <figure className="sn-founder-profile">
    <img src="/images/marinus-profiel-blauw.webp" alt="Marinus Bergsma, oprichter van SocialNow" width="640" height="680" loading="lazy" />
    <figcaption className="sn-founder-experience">
      <div className="sn-founder-kop">
        <strong translate="no">Marinus Bergsma</strong>
        <span>Founder & CEO bij SocialNow</span>
      </div>
      <p className="sn-founder-label">Ervaring</p>
      <ul className="sn-founder-lijst">
        {ERVARING.map((e) => (
          <li key={e.functie}>
            <span className={`sn-founder-logo${e.vlak ? " is-vlak" : ""}`}><img src={e.logo} alt={e.logoAlt} width="48" height="48" loading="lazy" /></span>
            <span className="sn-founder-regels">
              <b>{e.functie}</b>
              <span>{e.bedrijf}</span>
              <span className="sn-founder-duur">{e.duur}</span>
              <span className="sn-founder-duur">{e.plaats}</span>
              <span className="sn-founder-tekst">{e.tekst}</span>
            </span>
          </li>
        ))}
      </ul>
    </figcaption>
  </figure>;
}
