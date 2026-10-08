import React from "react";
import { Link } from "react-router-dom";
import { people } from "./content";
import { klein } from "./licht";

const OS_MENSEN: Record<string, string[]> = {
  website: ["Sid van Kalken", "Antony Soosaipillaj"],
  crm: ["Steef Komen", "Michelle Yang"],
  content: ["Carmel Boon", "Sam van der Sluis", "Emma Peperkamp"],
  ads: ["Jos Hollenberg", "Sergio Jovovic", "Nick van Keulen"],
};

// Dezelfde echte mensen bij een onderdeel op de homepage en op de OS-pagina.
export default function OsPeople({ role }: { role: string }) {
  const team = (OS_MENSEN[role] ?? []).flatMap(name => {
    const person = people.find(p => p.name === name);
    return person ? [person] : [];
  });
  return <Link to="/team" className="h-os-mensen">
    <span className="h-os-mensen-fotos" aria-hidden="true">
      {team.map(person => <img key={person.name} {...klein(person.image, 32)} alt="" width="32" height="32" loading="lazy" />)}
    </span>
    <span className="h-os-mensen-namen">Met <span translate="no">{team.map(p => p.name.split(" ")[0]).join(", ")}</span></span>
  </Link>;
}
