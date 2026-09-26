import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// 26 september 2026 (Marinus): wie er vandaag klaarstaat, met daaronder klein de link naar het hele team.
// Michel staat (nog) niet in de teamlijst, dus de foto's staan hier los. Zijn foto is ten voeten uit,
// daarom schuift zijn uitsnede naar het gezicht. Steef en Marinus blijven het grootst.
const VANDAAG = [
  { naam: "Steef", foto: "Steef-Komen.webp", groot: true },
  { naam: "Michel", foto: "Michel-Pluister.webp", positie: "50% 14%" },
  { naam: "Sergio", foto: "Sergio-Jovovic.webp" },
  { naam: "Marinus", foto: "Marinus-Bergsma-V2.webp", groot: true },
  { naam: "Elian", foto: "Elian-Coellar.webp" },
];

export default function TeamTrust() {
  return <Link to="/team" className="h-team-trust">
    <span className="h-team-portraits" aria-hidden="true">
      {VANDAAG.map(p => <img key={p.naam} className={p.groot ? "is-groot" : undefined} src={`/images/${p.foto}`} alt="" width="56" height="56" loading="lazy" style={p.positie ? { objectPosition: p.positie } : undefined} />)}
    </span>
    <span>
      <em className="h-team-vandaag"><i aria-hidden="true" />Vandaag klaar om te helpen</em>
      <strong>Steef, Michel, Sergio, Marinus en Elian</strong>
      <span>Bekijk het hele team <ArrowUpRight size={13} aria-hidden="true" /></span>
    </span>
  </Link>;
}
