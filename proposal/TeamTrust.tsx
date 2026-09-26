import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { people } from "./content";

// 26 september 2026 (Marinus): "vervangen met de normale teambalk". Weer de gewone strook met vijf foto's.
export default function TeamTrust() {
  return <Link to="/team" className="h-team-trust">
    <span className="h-team-portraits" aria-hidden="true">
      {/* 25 september 2026 (Marinus): Marinus en Steef het grootst, daarna Sergio, Elian en Nick. */}
      {["Marinus Bergsma","Steef Komen","Sergio Jovovic","Elian Coellar","Nick van Keulen"].map((naam,i)=>people.find(p=>p.name===naam)).filter(Boolean).map((person,i)=><img key={person!.name} className={i<2?"is-groot":undefined} src={`/images/${person!.image}`} alt="" width="56" height="56" loading="lazy" />)}
    </span>
    <span><strong>Technologie met mensen erachter.</strong><span>Maak kennis met ons team <ArrowUpRight size={13} aria-hidden="true" /></span></span>
  </Link>;
}
