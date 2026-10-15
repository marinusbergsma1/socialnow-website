import React from "react";
import { Link } from "react-router-dom";
import { people } from "./content";
import { klein } from "./licht";
import LinkedInMark from "./LinkedInMark";
import InstagramMark from "./InstagramMark";
import { Veld, minderBeweging } from "./stippen";
import "./home-team.css";

const groups = [
  { name: "Strategy & guidance", members: ["Albert Deltour", "Hossam Hassan"] },
  { name: "AI development", members: ["Douwe Kramer", "Thomas Huijsmans"] },
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
  const dots = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const el = team.current, canvas = dots.current;
    if (!el || !canvas || !canvas.getContext("2d")) return;
    const field = new Veld(canvas, { basis: "#cdd1d5", r: 1 });
    el.classList.add("has-team-dots");
    let visible = false, lastMove = -Infinity;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(el);
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || minderBeweging()) return;
      const now = performance.now();
      if (now - lastMove < 40) return;
      lastMove = now;
      const rect = el.getBoundingClientRect();
      field.golf(event.clientX - rect.left, event.clientY - rect.top, "groen", { straal: 96, duur: .45, breed: 64, sterkte: 1 });
    };
    el.addEventListener("pointermove", move, { passive: true });
    const timer = window.setInterval(() => {
      if (visible && !document.hidden && !minderBeweging()) {
        const rect = el.getBoundingClientRect();
        // Start in the visible part of the section, including on tall mobile layouts.
        const y = Math.max(0, -rect.top) + (Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top)) / 2;
        field.golfReeks(rect.width / 2, y, { straal: Math.hypot(rect.width, innerHeight), duur: 2.8, tussen: .4 });
      }
    }, 9000);
    return () => {
      observer.disconnect(); window.clearInterval(timer); el.removeEventListener("pointermove", move);
      field.stop(); el.classList.remove("has-team-dots");
    };
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
    <canvas ref={dots} className="sn-team-dot-layer" aria-hidden="true" />
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
