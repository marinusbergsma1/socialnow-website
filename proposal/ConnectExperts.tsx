import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import { people, expertGroepen } from "./content";
import { klein } from "./licht";
import { useLanguage } from "./i18n/context";
import "./connect-experts.css";

// SocialNow Connect op de homepage, 18 oktober 2026.
// Marinus vroeg eerst om "stel je team samen" in vijf tegels, daarna om drie versies voor de telefoon ("de verschillende
// functies niet op elkaar maar naast elkaar"), en koos toen: "Juist VEEL MEER TERUG NAAR DE BASIS." en "Moet wel heel
// duidelijk zijn dat mensen zich kunnen aanmelden en opdrachten kunnen aanvragen etc." en "maar wel graag de witte
// achtergrond." Dus: kop, één rij experts die opzij schuift, één zin en twee keuzes naast elkaar, op wit.
// Alleen echte mensen uit content.ts. De volledige lijst per vakgebied staat op /team.
const VERSIE = "20261015-team";

// 19 oktober 2026 (Marinus): "Verder is het meer zoeken naar expert dan dat je het aan ons over laat." en "Het moet een losstaand
// bedrijf zijn." Daarna koos hij ontwerp 1, "zoeken op zwart": eigen merk, zoekveld, vakgebieden als knoppen en een raster met
// profielen. Wie in een vakgebied zit komt uit expertGroepen; zonder groep valt iemand alleen onder Alles.
const ALLES = "Alles";
// 19 oktober 2026 (Marinus): "dat onderdeel met mensen altijd met een witte achtergrond." Zelfde ontwerp, op wit.

export default function ConnectExperts() {
  const { t } = useLanguage();
  const [vak, zetVak] = useState(ALLES);
  const [zoek, zetZoek] = useState("");
  const [allesTonen, zetAllesTonen] = useState(false);
  const groepVan = (naam: string) => expertGroepen.find((g) => g.members.includes(naam))?.name ?? "";
  const q = zoek.trim().toLowerCase();
  const lijst = people.filter((p) => (vak === ALLES || groepVan(p.name) === vak)
    && (!q || `${p.name} ${p.role} ${t(groepVan(p.name))}`.toLowerCase().includes(q)));
  // Eerst acht gezichten; zoeken, een vakgebied of de knop toont alles wat past.
  const ingekort = vak === ALLES && !q && !allesTonen && lijst.length > 8;
  const zichtbaar = ingekort ? lijst.slice(0, 8) : lijst;
  return <div className="cx-connect">
    <section id="team" className="sn-cx h-wrap" aria-labelledby="team-titel">
      <div className="cx-boven">
        <p className="cx-merk" translate="no">SocialNow <b>Connect</b></p>
        {/* 19 oktober 2026 (Marinus): "En bij SocialNow Connect graag our team of experts. Met de details daar allemaal blauw niet groen." */}
        <h2 id="team-titel">Ons team van experts.</h2>
        <p className="cx-zin"><strong>{people.length}</strong> experts in <strong>{expertGroepen.length}</strong> vakgebieden. Zoek, vergelijk en kies zelf.</p>
        <label className="cx-zoek">
          <Search size={18} aria-hidden="true" />
          <input type="search" value={zoek} onChange={(e) => zetZoek(e.target.value)} placeholder="Zoek op naam of vak, bijvoorbeeld Meta Ads" aria-label="Zoek een expert" />
        </label>
        <div className="cx-chips" role="group" aria-label="Vakgebied">
          {[ALLES, ...expertGroepen.map((g) => g.name)].map((naam) => (
            <button key={naam} type="button" aria-pressed={vak === naam} onClick={() => zetVak(naam)}>{naam}</button>
          ))}
        </div>
      </div>
      <ul className="cx-raster">
        {zichtbaar.map((persoon) => {
          const profiel = persoon.linkedin ?? persoon.instagram;
          return <li key={persoon.name}>
            <img {...klein(persoon.image, "260px", [160, 320], undefined, VERSIE)} alt="" width="260" height="260" loading="lazy" className={persoon.name === "Jelle Ursem" ? "is-jelle" : undefined} />
            <div>
              <strong translate="no">{persoon.name}</strong>
              <span>{persoon.name === "Ruben Spyckerelle" ? "B2B Cold Calling & Appointment Setting" : persoon.role}</span>
              {profiel
                ? <a className="cx-profiel" href={profiel} target="_blank" rel="noopener noreferrer">Bekijk profiel <ArrowUpRight size={14} aria-hidden="true" /></a>
                : <Link className="cx-profiel" to="/team">Bekijk profiel <ArrowUpRight size={14} aria-hidden="true" /></Link>}
            </div>
          </li>;
        })}
      </ul>
      {lijst.length === 0 && <p className="cx-leeg">Geen expert gevonden. Probeer een ander woord.</p>}
      {ingekort && <button type="button" className="sn-pill sn-btn3d h-button h-button-secondary cx-wit-knop cx-meer" onClick={() => zetAllesTonen(true)}>
        <span>Toon alle experts</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
      </button>}
      <div className="cx-onder">
        <p>Ben je expert met een eigen bedrijf? Meld je aan bij Connect. Of kom bij ons team werken.</p>
        {/* 19 oktober 2026 (Marinus): aanmelden met uitleg en de vacatures staan samen op /vacatures. */}
        <div className="cx-onder-knoppen">
        <Link className="sn-pill sn-btn3d h-button h-button-secondary cx-wit-knop" to="/vacatures#connect">
          <span>Meld je aan als expert</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
        </Link>
        <Link className="sn-pill sn-btn3d h-button h-button-secondary cx-wit-knop" to="/vacatures#functies">
          <span>Bekijk vacatures</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
        </Link>
        </div>
      </div>
    </section>
  </div>;
}
