import React from "react";
import { Link } from "react-router-dom";
import { people, expertGroepen, vindMensen } from "./content";
import { klein } from "./licht";
import LinkedInMark from "./LinkedInMark";
import InstagramMark from "./InstagramMark";
import "./home-team.css";

const groups = expertGroepen;
const findPeople = vindMensen;

export default function HomeTeam() {
  const [filter, setFilter] = React.useState("");
  const id = React.useId();
  const team = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = team.current;
    if (!el || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = el.querySelectorAll<HTMLElement>(".sn-home-team-person");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.teamVisible = "true";
        observer.unobserve(entry.target);
      }
    }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
    el.classList.add("is-reveal-ready");
    cards.forEach(card => observer.observe(card));
    return () => { observer.disconnect(); el.classList.remove("is-reveal-ready"); };
  }, [filter]);
  const shown = groups.filter(group => !filter || group.name === filter);
  return <section ref={team} className="sn-home-team" id="team" aria-labelledby={id}>
    <header className="sn-home-team-intro">
      <div><h2 id={id}>De experts van Connect.</h2></div>
      <div className="sn-home-team-count">{people.length}<small>mensen · één netwerk</small></div>
    </header>
    <div className="sn-home-team-filters" role="group" aria-label="Filter team by expertise">
      <button type="button" aria-pressed={!filter} onClick={() => setFilter("")}>All <small>{people.length}</small></button>
      {groups.map(group => <button key={group.name} type="button" aria-pressed={filter === group.name} onClick={() => setFilter(group.name)}>{group.name} <small>{findPeople(group.members).length}</small></button>)}
    </div>
    <div className="sn-home-team-groups">
      {shown.map(group => <section className="sn-home-team-group" key={group.name} aria-label={group.name}>
        <h3>{group.name}<small>{findPeople(group.members).length}</small></h3>
        <div className="sn-home-team-members">
          {findPeople(group.members).map((person, index) => {
            const url = person.linkedin || person.instagram;
            return <article className="sn-home-team-person" key={person.name} style={{ "--team-delay": `${Math.min(index % 6, 4) * 60}ms` } as React.CSSProperties}>
              <img {...klein(person.image, "(max-width: 650px) 45vw, (max-width: 1100px) 22vw, 12vw", [160, 320, 480], undefined, "20261015-team")} alt={person.name} width="320" height="400" loading="lazy" className={person.name === "Jelle Ursem" ? "is-jelle" : undefined} />
              <div className="sn-home-team-info">
                <strong><span translate="no">{person.name}</span></strong>
                <span>{person.name === "Ruben Spyckerelle" ? "B2B Cold Calling & Appointment Setting" : person.role}</span>
                {person.description ? <details><summary>Focus & aanpak ↗</summary><p>{person.description}<br />Benelux &amp; DACH<br />{person.quote}</p></details> : null}
              </div>
              {url && <span className="sn-home-team-social" aria-hidden="true">{person.linkedin ? <LinkedInMark /> : <InstagramMark />}</span>}
              {url ? <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} op ${person.linkedin ? "LinkedIn" : "Instagram"}`} /> : null}
            </article>;
          })}
        </div>
      </section>)}
    </div>
    <footer><span>Independent entrepreneurs. Samen voor jouw bedrijf.</span><Link to="/team">Maak kennis met het team ↗</Link><Link to="/vacatures">Jouw plek in het netwerk? ↗</Link></footer>
  </section>;
}
