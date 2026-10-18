import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { Bento, Tegel } from "./Bento";
import { people, expertGroepen, vindMensen, partnerReferences } from "./content";
import { klein } from "./licht";
import { openPlanCall } from "./PlanCall";
import { useLanguage, LOCALES } from "./i18n/context";
import "./connect-experts.css";

// 18 oktober 2026 (Marinus): "Ik vind dit nog niet heel sterk, kan je daar een oplossing voor maken." De lijst per
// vakgebied wordt "stel je team samen": de bezoeker kiest vakgebieden, ziet wie er aanschuift en plant meteen een call
// of meldt zich aan bij Connect. Alleen echte mensen en hun eigen bedrijven uit content.ts, geen verzonnen resultaten.
// De volledige lijst per vakgebied blijft op /team (HomeTeam).

// Standaard het team achter een OS op maat: strategie, AI, web en finance.
const START = ["Strategy & guidance", "AI development", "Web development", "Finance & operations"];
const VERSIE = "20261015-team";

// Ieder expert is zelfstandig ondernemer; dit zijn hun eigen bedrijven (rol of partnerReferences in content.ts).
const bedrijven = [
  { naam: "Attesso", mensen: ["Sid van Kalken", "Douwe Kramer"] },
  { naam: "Komen Consultancy", mensen: ["Steef Komen", "Michelle Yang"] },
  { naam: "Fincer", mensen: ["Steven Goudsblom"] },
  { naam: "Bruggn Design", mensen: ["Armando van Bruggen"] },
  { naam: "Bos Design", mensen: ["Pepijn Bos"] },
  { naam: "Femke’s Fotografie", mensen: ["Femke Oostendorp"] },
  { naam: "Creator Code", mensen: ["Daniel Schotman"] },
].map(bedrijf => ({ ...bedrijf, url: bedrijf.mensen.flatMap(naam => partnerReferences[naam] || []).find(ref => ref.name === bedrijf.naam && !ref.url.includes("linkedin"))?.url }));

const nieuwste = people.filter(p => p.sinds).sort((a, b) => (b.sinds || "").localeCompare(a.sinds || "")).slice(0, 5);

function Gezicht({ naam, beeld, maat = 48 }: { naam: string; beeld: string; maat?: number }) {
  return <img {...klein(beeld, maat, [96, 160], undefined, VERSIE)} alt="" width={maat} height={maat} loading="lazy" title={naam} translate="no" />;
}

export default function ConnectExperts() {
  const { language, t } = useLanguage();
  const [gekozen, setGekozen] = React.useState<string[]>(START);
  const wissel = (naam: string) => setGekozen(lijst => lijst.includes(naam) ? lijst.filter(n => n !== naam) : [...lijst, naam]);
  const groepen = expertGroepen.filter(groep => gekozen.includes(groep.name));
  const team = groepen.flatMap(groep => vindMensen(groep.members));
  const alles = gekozen.length === expertGroepen.length;
  const onderwerp = `${t("Team via Connect")}: ${groepen.map(groep => t(groep.name)).join(", ")}`;
  const datum = new Intl.DateTimeFormat(LOCALES[language].replace("_", "-"), { day: "numeric", month: "short" });

  return <Bento id="team" label="SocialNow Connect" titel={<>De experts van Connect.<br /><span>Stel je eigen team samen.</span></>} className="sn-cx">
    <Tegel kop="Kies wat je nodig hebt" breed={5} className="sn-cx-kies">
      <div className="sn-cx-vakken" role="group" aria-label="Vakgebieden">
        {expertGroepen.map(groep => {
          const mensen = vindMensen(groep.members);
          const aan = gekozen.includes(groep.name);
          return <button key={groep.name} type="button" className="sn-cx-vak" aria-pressed={aan} onClick={() => wissel(groep.name)}>
            <span className="sn-cx-vink" aria-hidden="true">{aan && <Check size={14} strokeWidth={3} />}</span>
            <span className="sn-cx-vaknaam">{groep.name}</span>
            <span className="sn-cx-stapel" aria-hidden="true">{mensen.slice(0, 3).map(p => <Gezicht key={p.name} naam={p.name} beeld={p.image} maat={28} />)}</span>
            <span className="sn-cx-aantal">{mensen.length}</span>
          </button>;
        })}
      </div>
      <div className="sn-cx-snel">
        <button type="button" onClick={() => setGekozen(alles ? [] : expertGroepen.map(groep => groep.name))}>{alles ? "Alles wissen" : "Kies alles"}</button>
      </div>
    </Tegel>

    <Tegel kop="Jouw team" breed={7} soort="blauw" className="sn-cx-team">
      <p className="sn-cx-telling" aria-live="polite">
        <strong>{team.length}</strong>
        <span>{team.length === 1 ? "expert" : "experts"}</span>
        <small>{groepen.length}{groepen.length === 1 ? " vakgebied" : " vakgebieden"}</small>
      </p>
      {team.length ? <ul className={`sn-cx-gezichten${team.length > 10 ? " is-vol" : ""}`}>
        {team.map(persoon => {
          const url = persoon.linkedin || persoon.instagram;
          const inhoud = <>
            <img {...klein(persoon.image, "(max-width: 760px) 30vw, 140px", [160, 320], undefined, VERSIE)} alt="" width="160" height="200" loading="lazy" className={persoon.name === "Jelle Ursem" ? "is-jelle" : undefined} />
            <strong translate="no">{persoon.name}</strong>
            <span>{persoon.name === "Ruben Spyckerelle" ? "B2B Cold Calling & Appointment Setting" : persoon.role}</span>
          </>;
          return <li key={persoon.name}>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{inhoud}</a> : <div>{inhoud}</div>}</li>;
        })}
      </ul> : <p className="sn-cx-leeg">Kies een vakgebied en zie wie er aanschuift.</p>}
      <div className="sn-tegel-onder">
        <button type="button" className="sn-pill os-claim sn-btn3d h-button" aria-haspopup="dialog" onClick={() => openPlanCall({ toelichting: groepen.length ? onderwerp : t("Team via Connect") })}>
          <span>Plan een call met dit team</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
        </button>
        <a className="sn-pill sn-btn3d h-button h-button-secondary" href="/connect/">
          <span>Word lid van Connect</span><span className="h-button-icon"><ArrowUpRight size={18} aria-hidden="true" /></span>
        </a>
      </div>
    </Tegel>

    <Tegel kop="Ieder een eigen bedrijf" breed={4} className="sn-cx-bedrijven">
      <ul>
        {bedrijven.map(bedrijf => {
          const mensen = vindMensen(bedrijf.mensen);
          const naam = <span translate="no">{bedrijf.naam}</span>;
          return <li key={bedrijf.naam}>
            {bedrijf.url ? <a href={bedrijf.url} target="_blank" rel="noopener noreferrer">{naam}</a> : naam}
            <span className="sn-cx-stapel" translate="no" aria-label={mensen.map(p => p.name).join(", ")}>{mensen.map(p => <Gezicht key={p.name} naam={p.name} beeld={p.image} maat={28} />)}</span>
          </li>;
        })}
      </ul>
    </Tegel>

    <Tegel kop="Nieuw in het netwerk" breed={4} className="sn-cx-nieuw">
      <ul>
        {nieuwste.map(persoon => <li key={persoon.name}>
          <Gezicht naam={persoon.name} beeld={persoon.image} maat={48} />
          <span><strong translate="no">{persoon.name}</strong><span className="sn-cx-rol">{persoon.role}</span></span>
          <time dateTime={persoon.sinds} translate="no">{datum.format(new Date(`${persoon.sinds}T12:00:00`))}</time>
        </li>)}
      </ul>
    </Tegel>

    <Tegel kop="Het hele netwerk" breed={4} className="sn-cx-net">
      <div className="sn-cx-muur" aria-hidden="true">{people.map(persoon => <Gezicht key={persoon.name} naam={persoon.name} beeld={persoon.image} maat={40} />)}</div>
      <p className="sn-tegel-tekst"><strong>{people.length}</strong> experts in <strong>{expertGroepen.length}</strong> vakgebieden.</p>
      <div className="sn-cx-links">
        <Link to="/team">Maak kennis met het team ↗</Link>
        <Link to="/vacatures">Jouw plek in het netwerk? ↗</Link>
      </div>
    </Tegel>
  </Bento>;
}
