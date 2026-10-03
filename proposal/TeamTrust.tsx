import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { people } from "./content";
import { klein } from "./licht";

// 28 september 2026 (Marinus): meer mensen uit het team laten zien, de tekst mag kleiner. Het hele team, even groot.
export default function TeamTrust() {
  return <Link to="/team" className="h-team-trust">
    <span className="h-team-portraits" aria-hidden="true">
      {["Marinus Bergsma", "Michelle Yang", "Steef Komen", "Sergio Jovovic", "Elian Coellar", "Nick van Keulen", "Jos Hollenberg", "Carmel Boon", "Emma Peperkamp", "Sam van der Sluis", "Sid van Kalken", "Tristan Slobbe"]
        .map(naam => people.find(person => person.name === naam))
        .filter((person): person is NonNullable<typeof person> => Boolean(person))
        .map(person => <img key={person.name} {...klein(person.image, 48)} alt="" width="56" height="56" loading="lazy" />)}
    </span>
    <span><strong>Technologie met mensen erachter.</strong><span>Maak kennis met ons team <ArrowUpRight size={13} aria-hidden="true" /></span></span>
  </Link>;
}

// 30 september 2026 (Marinus): "Daarnaast nog een keer het team met Let's make a difference together and join SocialNow!"
// Rechts naast het statement, onder Trusted by: het hele team groter, met de uitnodiging en een link naar de vacatures.
export function TeamJoin() {
  // 30 september 2026 (Marinus): midden in de ruimte, iets minder dik, wit met alleen bij hover een lichte witte glow van
  // links naar rechts. De raket gaat bij hover een klein stukje recht omhoog, zonder vuur; bij een klik schiet hij verder
  // omhoog en daarna ga je naar de vacatures. Zonder hover komt hij terug.
  // 3 oktober 2026 (Marinus): "Geen glow, geen jump en gwn een groene balk." Gewone link naar de vacatures, geen lancering.
  // 1 oktober 2026 (Marinus): versie 3, de gezichtenmuur, "maar het team in kleur". Twaalf portretten met naam en rol bij
  // hover, daaronder de uitnodiging als balk met Open positions.
  // 3 oktober 2026 (Marinus): "TEAM ER HELEMAAL OP". Iedereen uit people, Marinus voorop; de rest in de volgorde van de muur.
  const voorop = ["Marinus Bergsma", "Michelle Yang", "Steef Komen", "Sergio Jovovic", "Elian Coellar", "Nick van Keulen", "Jos Hollenberg", "Carmel Boon", "Emma Peperkamp", "Sam van der Sluis", "Sid van Kalken", "Tristan Slobbe"];
  const team = [...people].sort((a, b) => (voorop.indexOf(a.name) + 1 || 99) - (voorop.indexOf(b.name) + 1 || 99));
  return <div className="h-team-sectie" translate="no">
    <Link to="/team" className="h-team-muur" aria-label="Meet the SocialNow team">
      {team.map(person => <figure key={person.name}>
        <img {...klein(person.image, "(max-width: 900px) 25vw, 160px", [160, 320])} alt="" width="160" height="160" loading="lazy" />
        <figcaption>{person.name}<i>{person.role}</i></figcaption>
      </figure>)}
      <figure className="h-team-jij"><span>Jij?</span></figure>
    </Link>
    <Link to="/vacatures" className="h-team-join h-team-join-balk">
      <span className="h-team-join-zin">
        {/* 3 oktober 2026 (Marinus): "dat raketje etc liefst er gwn naast". "SocialNow!" en de raket breken nooit los. */}
        <span className="h-team-join-tekst">Let&rsquo;s make a difference together and join <span className="h-team-join-slot">SocialNow!<span className="h-raket" aria-hidden="true">🚀</span></span></span>
      </span>
      <span className="h-team-join-open">Open positions &rarr;</span>
    </Link>
  </div>;
}
