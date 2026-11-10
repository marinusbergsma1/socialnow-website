import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { people } from "./content";
import { CONTACTEN } from "./contacten";
import { useLanguage } from "./i18n/context";
import { klein } from "./licht";
import { boekingsPlannerUrl } from "./PlanCall";
import "./team-call-tile.css";

const marinus = "Marinus Bergsma";
const gesprekspartners = CONTACTEN
  .map(({ naam }) => people.find((lid) => lid.name === naam))
  .filter((lid) => lid !== undefined);

export default function TeamCallTile({ toonTeamlink = false }: { toonTeamlink?: boolean }) {
  const titelId = useId();
  const keuzeId = useId();
  const [naam, zetNaam] = useState(marinus);
  const { t } = useLanguage();
  const persoon = gesprekspartners.find((lid) => lid.name === naam)!;
  const direct = naam === marinus;
  const adres = CONTACTEN.find((lid) => lid.naam === naam)?.mail ?? "info@socialnow.nl";
  const onderwerp = encodeURIComponent(`${t("Kennismaking met")} ${naam}`);
  const actie = direct ? boekingsPlannerUrl : `mailto:${adres}?subject=${onderwerp}`;

  return (
    <section className="sn-team-call" id="kennismaken" aria-labelledby={titelId}>
      <div className="sn-team-call-intro">
        <p className="sn-team-call-label"><CalendarDays size={16} aria-hidden="true" />Kennismaking</p>
        <h2 id={titelId}>Kies met wie je wilt praten</h2>
        <p>Vertel ons waar je aan werkt en kies de persoon die bij jouw vraag past.</p>
        {toonTeamlink && <Link className="sn-team-call-meer" to="/team">Ontmoet het hele team <ArrowUpRight size={16} aria-hidden="true" /></Link>}
      </div>
      <div className="sn-team-call-kaart">
        <label htmlFor={keuzeId}>Jouw gesprekspartner</label>
        <select id={keuzeId} value={naam} onChange={(event) => zetNaam(event.target.value)} translate="no">
          {gesprekspartners.map((lid) => <option key={lid.name} value={lid.name}>{lid.name}</option>)}
        </select>
        <div className="sn-team-call-profiel" key={naam} aria-live="polite">
          <img {...klein(persoon.image, "56px", [96, 160])} width="56" height="56" alt="" loading="lazy" />
          <span><strong translate="no">{persoon.name}</strong><small>{persoon.role}</small></span>
        </div>
        <a className="sn-team-call-knop" href={actie}>
          {direct ? <><CalendarDays size={17} aria-hidden="true" />Bekijk vrije tijden</> : <><Mail size={17} aria-hidden="true" />Vraag een call aan</>}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <p className="sn-team-call-status">{direct ? "30 minuten via Google Meet" : "We stemmen het moment samen af."}</p>
      </div>
    </section>
  );
}
