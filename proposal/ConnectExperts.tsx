import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
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

// 27 oktober 2026 (Marinus): "het connect onderdeel meer de structuur krijgt van het laatste plan en architecture. Dus met developers
// en weer naar beneden zoals het was dus meer een soort bedrijfsstructuur dan slider. Wel alle foto's lekker klein houden."
// Dus een organogram: bovenaan de vier eindverantwoordelijken uit het plan (plan-site structure.json, 27 oktober), daaronder de
// developers, daaronder de vakgebieden naast elkaar. Iedereen staat er precies één keer, met een kleine vierkante foto.
// Proef: scripts/check-connect-structuur.mjs.
const EINDVERANTWOORDELIJK = ["Marinus Bergsma", "Gijsbert Westeneng", "Douwe Kramer", "Steef Komen"];
const DEVELOPERS = expertGroepen.filter((g) => g.name === "AI development" || g.name === "Web development").flatMap((g) => g.members).filter((n) => !EINDVERANTWOORDELIJK.includes(n));
const VAKGEBIEDEN = expertGroepen
  .filter((g) => g.name !== "AI development" && g.name !== "Web development")
  .map((g) => ({ naam: g.name, leden: g.members.filter((n) => !EINDVERANTWOORDELIJK.includes(n)) }));

function Persoon({ naam }: { naam: string }) {
  const persoon = people.find((p) => p.name === naam);
  if (!persoon) return null;
  const profiel = persoon.linkedin ?? persoon.instagram;
  const binnen = <>
    <img {...klein(persoon.image, "64px", [96, 160], undefined, VERSIE)} alt="" width="64" height="64" loading="lazy" className={persoon.name === "Jelle Ursem" ? "is-jelle" : undefined} />
    <span className="cx-org-tekst">
      <strong translate="no">{persoon.name}</strong>
      <span>{persoon.name === "Ruben Spyckerelle" ? "B2B Cold Calling & Appointment Setting" : persoon.role}</span>
    </span>
    <ArrowUpRight className="cx-org-pijl" size={14} aria-hidden="true" />
  </>;
  return <li className="cx-org-persoon">
    {profiel
      ? <a href={profiel} target="_blank" rel="noopener noreferrer">{binnen}</a>
      : <Link to="/team">{binnen}</Link>}
  </li>;
}

export default function ConnectExperts() {
  const { t } = useLanguage();
  const [zoek, zetZoek] = useState("");
  const groepVan = (naam: string) => expertGroepen.find((g) => g.members.includes(naam))?.name ?? "";
  const q = zoek.trim().toLowerCase();
  const past = (naam: string) => {
    if (!q) return true;
    const p = people.find((x) => x.name === naam);
    return !!p && `${p.name} ${p.role} ${t(groepVan(p.name))}`.toLowerCase().includes(q);
  };
  const top = EINDVERANTWOORDELIJK.filter(past);
  const devs = DEVELOPERS.filter(past);
  const vakken = VAKGEBIEDEN.map((v) => ({ ...v, leden: v.leden.filter(past) })).filter((v) => v.leden.length);
  const leeg = !top.length && !devs.length && !vakken.length;
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
      </div>
      <div className="cx-org">
        {top.length > 0 && <div className="cx-org-laag">
          <p className="cx-org-kop">Eindverantwoordelijk</p>
          <ul className="cx-org-rij">{top.map((n) => <Persoon key={n} naam={n} />)}</ul>
        </div>}
        {top.length > 0 && devs.length > 0 && <span className="cx-org-lijn" aria-hidden="true" />}
        {devs.length > 0 && <div className="cx-org-laag">
          <p className="cx-org-kop">Developers</p>
          <ul className="cx-org-rij">{devs.map((n) => <Persoon key={n} naam={n} />)}</ul>
        </div>}
        {(top.length > 0 || devs.length > 0) && vakken.length > 0 && <span className="cx-org-lijn" aria-hidden="true" />}
        {vakken.length > 0 && <div className="cx-org-laag">
          <p className="cx-org-kop">Vakgebieden</p>
          <div className="cx-org-vakken">
            {vakken.map((v) => <div key={v.naam} className="cx-org-vak">
              <p className="cx-org-vaknaam">{v.naam}</p>
              <ul>{v.leden.map((n) => <Persoon key={n} naam={n} />)}</ul>
            </div>)}
          </div>
        </div>}
      </div>
      {leeg && <p className="cx-leeg">Geen expert gevonden. Probeer een ander woord.</p>}
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
