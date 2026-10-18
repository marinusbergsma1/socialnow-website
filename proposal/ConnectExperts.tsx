import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { people, expertGroepen } from "./content";
import { klein } from "./licht";
import { mailLink } from "./aanvragen";
import { useLanguage } from "./i18n/context";
import "./connect-experts.css";

// SocialNow Connect op de homepage, 18 oktober 2026.
// Marinus vroeg eerst om "stel je team samen" in vijf tegels, daarna om drie versies voor de telefoon ("de verschillende
// functies niet op elkaar maar naast elkaar"), en koos toen: "Juist VEEL MEER TERUG NAAR DE BASIS." en "Moet wel heel
// duidelijk zijn dat mensen zich kunnen aanmelden en opdrachten kunnen aanvragen etc." en "maar wel graag de witte
// achtergrond." Dus: kop, één rij experts die opzij schuift, één zin en twee keuzes naast elkaar, op wit.
// Alleen echte mensen uit content.ts. De volledige lijst per vakgebied staat op /team.
const VERSIE = "20261015-team";

export default function ConnectExperts() {
  const { t } = useLanguage();
  return <div className="cx-wit">
    <section id="team" className="sn-cx h-wrap" aria-labelledby="team-titel">
      <div className="sn-bento-kop">
        <p className="h-eyebrow"><i />SocialNow Connect</p>
        <h2 id="team-titel">De experts van Connect.<br /><span>Echte mensen, ieder met een eigen bedrijf.</span></h2>
      </div>
      <ul className="cx-rij">
        {people.map(persoon => <li key={persoon.name}>
          <img {...klein(persoon.image, "150px", [160, 320], undefined, VERSIE)} alt="" width="150" height="188" loading="lazy" className={persoon.name === "Jelle Ursem" ? "is-jelle" : undefined} />
          <strong translate="no">{persoon.name}</strong>
          <span>{persoon.name === "Ruben Spyckerelle" ? "B2B Cold Calling & Appointment Setting" : persoon.role}</span>
        </li>)}
      </ul>
      <p className="cx-zin"><strong>{people.length}</strong> experts in <strong>{expertGroepen.length}</strong> vakgebieden, per pakket of als losse opdracht. <Link to="/team">Bekijk het hele team ↗</Link></p>
      <div className="cx-keuzes">
        <div className="cx-keuze">
          <p className="cx-vraag">Heb je een klus?</p>
          <p>Vraag een opdracht aan. Wij koppelen je aan de juiste expert.</p>
          <a className="sn-pill os-claim sn-btn3d h-button" href={mailLink(t("Opdracht via Connect"))}>
            <span className="cx-lang">Vraag een opdracht aan</span><span className="cx-kort">Aanvragen</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
          </a>
        </div>
        <div className="cx-keuze">
          <p className="cx-vraag">Ben je expert?</p>
          <p>Meld je aan bij Connect en krijg opdrachten van bedrijven.</p>
          <a className="sn-pill sn-btn3d h-button h-button-secondary" href="/connect/">
            <span className="cx-lang">Meld je aan als expert</span><span className="cx-kort">Aanmelden</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
          </a>
        </div>
      </div>
    </section>
  </div>;
}
