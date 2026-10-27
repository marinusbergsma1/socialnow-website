import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import ExplainerPlayer from "./ExplainerPlayer";
import { openPlanCall } from "./PlanCall";
import { CONTACT_MAIL, mailLink } from "./aanvragen";
import "./home-business.css";

export default function HomeIntro() {
  const [film, setFilm] = useState<"os" | "connect">("connect");
  return <>
    <section className="hb-intro" id="home" aria-labelledby="hb-title">
      <div className="hb-wrap hb-hero-grid">
        <div className="hb-copy">
          <p className="hb-eyebrow">Strategie. Creativiteit. Technologie.</p>
          <h1 id="hb-title">Haal meer uit<br />je bedrijf.</h1>
          <p className="hb-lead">De juiste mensen, slimme software en een helder plan. We helpen je met marketing, websites, AI en bedrijfsvoering.</p>
          <div className="hb-actions"><button type="button" className="hb-button" aria-haspopup="dialog" onClick={() => openPlanCall()}>Laten we kennismaken <ArrowUpRight size={19} aria-hidden="true" /></button><Link className="hb-link" to="/projecten">Bekijk ons werk <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          <a className="hb-email" href={mailLink()}>Liever direct mailen? <span translate="no">{CONTACT_MAIL}</span><Mail size={15} aria-hidden="true" /></a>
        </div>
        <div className="hb-film">
          <div className="hb-film-tabs" role="group" aria-label="Kies een film"><button type="button" aria-pressed={film === "connect"} onClick={() => setFilm("connect")}>De mensen</button><button type="button" aria-pressed={film === "os"} onClick={() => setFilm("os")}>De software</button></div>
          <ExplainerPlayer key={film} kind={film === "os" ? "explainer" : "connect"} ctaLabel={film === "connect" ? "Maak kennis met Connect" : "Ontdek SocialNow OS"} />
        </div>
      </div>
      <div className="hb-wrap hb-principles"><span>Persoonlijk contact</span><span>Van strategie tot uitvoering</span><Link to="/veiligheid">Zorgvuldig met je data <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </section>
    <section className="hb-services" aria-labelledby="hb-services-title"><div className="hb-wrap">
      <div className="hb-section-head"><p className="hb-eyebrow">Wat heb jij nodig?</p><h2 id="hb-services-title">Begin bij je bedrijf.<br />Wij denken met je mee.</h2></div>
      <div className="hb-service-grid">
        {[
          ["01", "Een sterker merk. Meer bereik.", "Van branding en content tot advertenties en een website. Experts die meedenken én het werk uitvoeren.", "/diensten", "Marketing en creatie"],
          ["02", "AI die je werk verder helpt.", "Training, automatisering en software die aansluit op je werk. We kijken eerst waar je tijd en overzicht kunt winnen.", "/het-os", "AI en software"],
          ["03", "De juiste expertise aan tafel.", "Van finance en data tot development. Vind de specialist die past bij je vraag, voor een project of langere samenwerking.", "/connect/", "Vind je expert"],
        ].map(([number, title, text, href, label]) => <article key={number}><span className="hb-number">{number}</span><h3>{title}</h3><p>{text}</p>{href === "/connect/" ? <a className="hb-link" href={href}>{label}<ArrowUpRight size={18} aria-hidden="true" /></a> : <Link className="hb-link" to={href}>{label}<ArrowUpRight size={18} aria-hidden="true" /></Link>}</article>)}
      </div>
    </div></section>
  </>;
}

export function HomeContact() {
  return <section className="hb-contact" id="neem-contact-op" aria-labelledby="hb-contact-title"><div className="hb-wrap hb-contact-grid"><div><p className="hb-eyebrow">Een vraag is genoeg om te beginnen.</p><h2 id="hb-contact-title">Waar wil jij<br />mee vooruit?</h2></div><div><p>Je hoeft nog geen uitgewerkt plan te hebben. Vertel waar je tegenaan loopt of wat je wilt bereiken. Steef denkt persoonlijk met je mee.</p><div className="hb-actions"><button className="hb-button" type="button" aria-haspopup="dialog" onClick={() => openPlanCall()}>Plan een kennismaking <ArrowUpRight size={19} aria-hidden="true" /></button><a className="hb-link" href={mailLink()}><span translate="no">{CONTACT_MAIL}</span><ArrowUpRight size={18} aria-hidden="true" /></a></div></div></div></section>;
}
