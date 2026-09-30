import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { people } from "./content";

// 28 september 2026 (Marinus): meer mensen uit het team laten zien, de tekst mag kleiner. Het hele team, even groot.
export default function TeamTrust() {
  return <Link to="/team" className="h-team-trust">
    <span className="h-team-portraits" aria-hidden="true">
      {["Marinus Bergsma", "Michelle Yang", "Steef Komen", "Sergio Jovovic", "Elian Coellar", "Nick van Keulen", "Jos Hollenberg", "Carmel Boon", "Emma Peperkamp", "Sam van der Sluis", "Sid van Kalken", "Tristan Slobbe"]
        .map(naam => people.find(person => person.name === naam))
        .filter((person): person is NonNullable<typeof person> => Boolean(person))
        .map(person => <img key={person.name} src={`/images/${person.image}`} alt="" width="56" height="56" loading="lazy" />)}
    </span>
    <span><strong>Technologie met mensen erachter.</strong><span>Maak kennis met ons team <ArrowUpRight size={13} aria-hidden="true" /></span></span>
  </Link>;
}
