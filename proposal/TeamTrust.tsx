import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  // 30 september 2026 (Marinus): midden in de ruimte, iets minder dik, kleine glans en groen van links naar rechts. De raket
  // krijgt vuur en gaat bij hover een stukje omhoog; bij een klik schiet hij verder omhoog en daarna ga je naar de vacatures.
  // Zonder hover komt hij terug.
  const navigate = useNavigate();
  const [lancering, setLancering] = React.useState(false);
  const klik = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setLancering(true);
    const minder = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => navigate("/vacatures"), minder ? 0 : 520);
  };
  return <Link to="/vacatures" onClick={klik} className={`h-team-join${lancering ? " is-lancering" : ""}`} translate="no">
    <span className="h-team-join-gezichten" aria-hidden="true">
      {["Marinus Bergsma", "Michelle Yang", "Steef Komen", "Sergio Jovovic", "Elian Coellar", "Nick van Keulen", "Jos Hollenberg", "Carmel Boon", "Emma Peperkamp", "Sam van der Sluis", "Sid van Kalken", "Tristan Slobbe"]
        .map(naam => people.find(person => person.name === naam))
        .filter((person): person is NonNullable<typeof person> => Boolean(person))
        .map(person => <img key={person.name} {...klein(person.image, 72)} alt="" width="72" height="72" loading="lazy" />)}
    </span>
    <span className="h-team-join-zin">
      <span className="h-team-join-tekst">Let&rsquo;s make a difference together and join SocialNow!</span>
      <span className="h-raket" aria-hidden="true"><span className="h-raket-vuur" />🚀</span>
    </span>
  </Link>;
}
