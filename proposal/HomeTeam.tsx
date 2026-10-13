import React from "react";
import { Link } from "react-router-dom";
import { people } from "./content";
import { klein } from "./licht";
import LinkedInMark from "./LinkedInMark";
import InstagramMark from "./InstagramMark";
import "./home-team.css";

const groups = [
  { name: "Strategy & guidance", members: ["Albert Deltour"] },
  { name: "AI development", members: ["Douwe Kramer"] },
  { name: "Web development", members: ["Sid van Kalken", "Antony Soosaipillaj"] },
  { name: "Finance & operations", members: ["Steef Komen", "Michelle Yang", "Steven Goudsblom"] },
  { name: "Ads & search", members: ["Jos Hollenberg", "Nick van Keulen", "Sergio Jovovic"] },
  { name: "Video, photo & design", members: ["Carmel Boon", "Jelle Ursem", "Sam van der Sluis", "Emma Peperkamp", "Femke Oostendorp", "Pepijn Bos", "Armando van Bruggen"] },
  { name: "UGC & social media", members: ["Isa Zoer", "Daniel Schotman"] },
  { name: "Sales & partnerships", members: ["Marinus Bergsma", "Elian Coellar", "Aron", "Youri van der Donk", "Pieter Bergsma", "Isaak Munster", "Ruben Spyckerelle"] },
];
const findPeople = (names: string[]) => names.flatMap(name => {
  const person = people.find(p => p.name === name);
  return person ? [person] : [];
});

export default function HomeTeam() {
  const [filter, setFilter] = React.useState("");
  const id = React.useId();
  const team = React.useRef<HTMLElement>(null);
  const [glowPulse, setGlowPulse] = React.useState(0);
  React.useEffect(() => {
    const el = team.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(el);
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--team-mouse-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--team-mouse-y", `${event.clientY - rect.top}px`);
      el.dataset.mouseGlow = "true";
    };
    const leave = () => { delete el.dataset.mouseGlow; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden && !el.closest("[data-motion-pauze]")) setGlowPulse(value => value + 1);
    }, 9000);
    return () => { observer.disconnect(); window.clearInterval(timer); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
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
    <div className="sn-team-glow-layer" aria-hidden="true">
      <div className="sn-team-mouse-glow" />
      {glowPulse > 0 && <div key={glowPulse} className="sn-team-glow-pulse" style={{ "--team-pulse-color": ["59,130,246", "250,204,21", "236,72,153"][(glowPulse - 1) % 3] } as React.CSSProperties} />}
    </div>
    <header className="sn-home-team-intro">
      <div><span>OUR PEOPLE · INDEPENDENT EXPERTS</span><h2 id={id}>Human connection.<br /><em>Per expertise.</em></h2></div>
      <p>De juiste mensen voor jouw bedrijf.<br />Creatie, marketing, sales, data en techniek.</p>
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
              <img {...klein(person.image, "(max-width: 650px) 45vw, (max-width: 1100px) 22vw, 12vw", [160, 320, 480])} alt={person.name} width="320" height="400" loading="lazy" className={person.name === "Jelle Ursem" ? "is-jelle" : undefined} />
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
