import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";
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

// 19 oktober 2026 (Marinus): "Verder is het meer zoeken naar expert dan dat je het aan ons over laat." en "Het moet een losstaand
// bedrijf zijn." Daarna koos hij ontwerp 1, "zoeken op zwart": eigen merk, zoekveld, vakgebieden als knoppen en een raster met
// profielen. Wie in een vakgebied zit komt uit expertGroepen; zonder groep valt iemand alleen onder Alles.
// 19 oktober 2026 (Marinus): "dat onderdeel met mensen altijd met een witte achtergrond." Zelfde ontwerp, op wit.
// Later die avond: "Connect gedeelte moet blauw zijn en expertlaag 1 laag die je kan sliden en logo niet 2x staat daarboven
// al." Dus Connect-blauw in plaats van groen, alle experts in één rij die schuift (met pijlen voor de muis), en geen eigen
// woordmerk meer boven de kop: de Connect-band erboven toont het logo al.

export default function ConnectExperts() {
  const { t } = useLanguage();
  const [zoek, zetZoek] = useState("");
  const rij = useRef<HTMLUListElement>(null);
  const schuif = (richting: number) => rij.current?.scrollBy({ left: richting * rij.current.clientWidth * 0.8, behavior: "smooth" });
  const groepVan = (naam: string) => expertGroepen.find((g) => g.members.includes(naam))?.name ?? "";
  const q = zoek.trim().toLowerCase();
  const lijst = people.filter((p) => !q || `${p.name} ${p.role} ${t(groepVan(p.name))}`.toLowerCase().includes(q));
  return <div className="cx-connect">
    <section id="team" className="sn-cx h-wrap" aria-labelledby="team-titel">
      <div className="cx-boven">
        <p className="cx-label">Ons team</p>
        <h2 id="team-titel">Vind je expert.</h2>
        {/* 19 oktober 2026, avond (Marinus): "verbeterd SocialNow/Connect met meer praten over ons als team". 21 oktober 2026: tweede zin volgt de
            Connect-film (82-connect-film-v1/werk/02-webtekst.md 1.10): experts zien alleen wat je per opdracht deelt. */}
        <p className="cx-team">Wij zijn het team achter SocialNow en Connect: strategen, developers, designers, ad-specialisten en financiële experts. Echte mensen die je bij naam kent, en die alleen zien wat jij per opdracht deelt.</p>
        <p className="cx-zin"><strong>{people.length}</strong> experts in <strong>{expertGroepen.length}</strong> vakgebieden. Zoek, vergelijk en kies zelf.</p>
        {/* 21 oktober 2026 (Marinus): "Dan moet nog even video eronder eruit ... die moet met switch te changen zijn." De Connect-film
            staat alleen nog in de header, achter de schakelaar SocialNow OS / SocialNow Connect (HeaderBestaand.tsx). */}
        <label className="cx-zoek">
          <Search size={18} aria-hidden="true" />
          <input type="search" value={zoek} onChange={(e) => zetZoek(e.target.value)} placeholder="Zoek op naam of vak, bijvoorbeeld Meta Ads" aria-label="Zoek een expert" />
        </label>
        {/* 20 oktober 2026 (Marinus): "Ik wil nooit meer dan 1 regel met expertises altijd 1 balk en misschien al die vlakjes wel
            gewoon weg is voor later. Haal maar weg." De vakgebiedknoppen (cx-chips) zijn weg; zoeken op vak kan nog via het zoekveld.
            Terugzetten kan met ALLES, expertGroepen en de opmaak .cx-chips in connect-experts.css, dan als één schuifbalk. */}
      </div>
      <div className="cx-pijlen">
        <button type="button" aria-label="Vorige experts" onClick={() => schuif(-1)}><ArrowLeft size={18} aria-hidden="true" /></button>
        <button type="button" aria-label="Volgende experts" onClick={() => schuif(1)}><ArrowRight size={18} aria-hidden="true" /></button>
      </div>
      <ul className="cx-raster" ref={rij}>
        {lijst.map((persoon) => {
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
      {/* 20 oktober 2026 (Marinus): "Vulling hier blauw met witte tekst. Verder moet er ook een gedeelte komen met vraag een
          opdracht aan." Twee vakken naast elkaar: opdracht aanvragen en aanmelden als expert, elk met een blauwe knop. */}
      <div className="cx-onder">
        <div className="cx-onder-vak">
          <p>Heb je een opdracht? Vraag hem aan bij Connect.</p>
          <a className="sn-pill sn-btn3d h-button h-button-secondary cx-blauw-knop" href={mailLink(t("Opdracht aanvragen bij Connect"))}>
            <span>Vraag een opdracht aan</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
          </a>
        </div>
        <div className="cx-onder-vak">
          <p>Ben je expert met een eigen bedrijf? Meld je aan bij Connect.</p>
          <a className="sn-pill sn-btn3d h-button h-button-secondary cx-blauw-knop" href={mailLink(t("Aanmelden als expert bij Connect"))}>
            <span>Meld je aan als expert</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
          </a>
        </div>
      </div>
    </section>
  </div>;
}
