import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// 26 september 2026 (Marinus): wie er vandaag klaarstaat, met daaronder klein de link naar het hele team.
// De foto's staan hier los van de teamlijst. Steef en Marinus blijven het grootst.
// zoom snijdt de foto bij (object-view-box), zodat Sergio dichterbij staat.
const VANDAAG = [
  { naam: "Steef", foto: "Steef-Komen.webp", groot: true },
  { naam: "Sergio", foto: "Sergio-Jovovic.webp", zoom: "inset(6% 20% 30% 20%)" },
  { naam: "Marinus", foto: "Marinus-Bergsma-V2.webp", groot: true },
  { naam: "Elian", foto: "Elian-Coellar.webp" },
];

export default function TeamTrust() {
  return <Link to="/team" className="h-team-trust">
    <span className="h-team-portraits" aria-hidden="true">
      {VANDAAG.map(p => <img key={p.naam} className={p.groot ? "is-groot" : undefined} src={`/images/${p.foto}`} alt="" width="56" height="56" loading="lazy" style={{ objectPosition: p.positie, objectViewBox: p.zoom } as React.CSSProperties} />)}
    </span>
    <span>
      <em className="h-team-vandaag"><i aria-hidden="true" />Vandaag klaar om te helpen</em>
      <strong>Steef, Sergio, Marinus en Elian</strong>
      <span>Bekijk het hele team <ArrowUpRight size={13} aria-hidden="true" /></span>
    </span>
  </Link>;
}
