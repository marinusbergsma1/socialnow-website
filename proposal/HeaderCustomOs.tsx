import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./header-custom-os.css";

// Variant B van de homepage-header — 17 oktober 2026.
// MARINUS: "nieuwe explainer gefocust op custom os ipv beginnende ondernemers". Voor bestaande
// bedrijven; variant A (HomeHeader) blijft voor starters met het gratis OS.
// 18 oktober 2026 (Marinus): voor wie al een bedrijf heeft, "met focus meer op reden dat verouderde
// systemen zorgen dat je gehackt word en wij het overzicht verbeteren. Echte experts je helpen". Wie welke variant ziet
// en hoe de verdeling zichzelf bijstelt: server/ab.mjs. Voorbeeld en regels:
// 01_WEBSITE/socialnow-ab-custom-os-20261017/index.html.
//
// profiel komt later uit Stairoids (bedrijfsnaam, branche, teamgrootte); zonder profiel de
// algemene tekst. Alleen Nederlands, daarom geen vertalingen in i18n.

export type Profiel = { bedrijf: string; branche?: string; mensen?: number };
type Doel = "custom_os" | "veiligheid" | "explainer";

const CONTACT = "/contact?onderwerp=Systeemcheck%20Custom%20OS";
// Waar het bij bestaande bedrijven meestal lekt. Bewust geen percentages: die hebben we niet zelf gemeten.
const RISICOS = ["Software en plug-ins zonder updates", "Wachtwoorden en sleutels in mail en WhatsApp", "Klantdata in losse lijsten, zonder rechten per persoon", "Niemand die het geheel overziet"];
const BRANCHE: Record<string, string> = {
  retail: "winkels, voorraad en online verkoop",
  bouw: "projecten, planning en offertes",
  zakelijk: "klanten, uren en facturen",
  horeca: "reserveringen, personeel en social",
  zorg: "cliënten, roosters en communicatie",
  logistiek: "orders, ritten en klantcontact",
  energie: "aanvragen, installaties en service",
};
const LOS = [
  { naam: "Excel-lijsten", x: -29, y: -30, r: -6, k: "#21a366" },
  { naam: "Mail", x: 28, y: -33, r: 5, k: "#ea4335" },
  { naam: "WhatsApp", x: -33, y: 0, r: 3, k: "#25d366" },
  { naam: "Odoo", x: 33, y: 4, r: -4, k: "#a24689" },
  { naam: "Meta Ads", x: -22, y: 31, r: 5, k: "#1877f2" },
  { naam: "Analytics", x: 23, y: 34, r: -3, k: "#f9ab00" },
  { naam: "Planning", x: 0, y: -41, r: 2, k: "#00a3e0" },
  { naam: "Offertes", x: 0, y: 41, r: -2, k: "#f62961" },
];
const LIJNEN = ["M18 22 Q35 40 50 50", "M82 20 Q66 38 50 50", "M12 55 Q30 52 50 50", "M88 58 Q70 54 50 50", "M26 84 Q38 64 50 50", "M74 86 Q62 66 50 50", "M50 10 Q50 30 50 50", "M50 92 Q50 70 50 50"];
const MODULES = [["Dashboard", "var(--cos-groen)"], ["Website", "#00a3e0"], ["CRM", "#f5c518"], ["Studio", "#f62961"], ["Advertenties", "#a78bfa"]];
const MILOS = [
  { rol: "crm", naam: "Milo CRM", k: "#f5c518", tekst: "3 offertes wachten al 5 dagen op opvolging. Zal ik een herinnering sturen?" },
  { rol: "ads-magenta", naam: "Milo Ads", k: "#a78bfa", tekst: "Campagne B levert twee keer zoveel aanvragen. Budget verschuiven?" },
  { rol: "content", naam: "Milo Studio", k: "#f62961", tekst: "Vier posts voor volgende week staan klaar in je huisstijl." },
];
const BALKEN = [38, 52, 45, 61, 58, 72, 69, 84, 80, 93];

function Teller({ doel, actief }: { doel: number; actief: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!actief) return setN(0);
    let raf = 0; const t0 = performance.now();
    const stap = (t: number) => { const f = Math.min(1, (t - t0) / 900); setN(Math.round(doel * (1 - Math.pow(1 - f, 3)))); if (f < 1) raf = requestAnimationFrame(stap); };
    raf = requestAnimationFrame(stap);
    return () => cancelAnimationFrame(raf);
  }, [actief, doel]);
  return <>{n}</>;
}

function Explainer({ osNaam, meet }: { osNaam: string; meet: (doel: Doel) => void }) {
  const scenes = [
    { kort: "Nu", tijd: 3400, tekst: "Vandaag: acht losse systemen, oude software en niemand die het geheel ziet." },
    { kort: "Check", tijd: 3200, tekst: "Onze experts brengen alles in kaart, sluiten de gaten en koppelen wat er al is." },
    { kort: "Overzicht", tijd: 3600, tekst: `Eén OS met rechten per persoon. ${osNaam === "Jouw OS" ? "Je cijfers live op één scherm." : `${osNaam}, live op één scherm.`}` },
    { kort: "Milo", tijd: 4600, tekst: "Milo-agents werken op jullie eigen data en stellen voor wat er nu moet gebeuren." },
  ];
  const [nu, setNu] = useState(0);
  const vul = useRef<(HTMLSpanElement | null)[]>([]);
  const start = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setNu(2); return; }
    let raf = 0, vorige = performance.now();
    start.current = vorige;
    const lus = (t: number) => {
      // Op een verborgen tabblad staat de klok stil.
      if (document.hidden) start.current += t - vorige;
      vorige = t;
      const f = (t - start.current) / scenes[nu].tijd;
      const el = vul.current[nu]; if (el) el.style.width = `${Math.min(100, f * 100)}%`;
      if (f >= 1) { setNu((nu + 1) % scenes.length); return; }
      raf = requestAnimationFrame(lus);
    };
    raf = requestAnimationFrame(lus);
    return () => cancelAnimationFrame(raf);
  }, [nu]);
  const fase = `s${nu + 1}`;
  return (
    <div className={`cos-speler ${fase}`} aria-roledescription="animatie" aria-label="Van losse, verouderde systemen naar één veilig OS">
      <div className="cos-speler-kop"><span className="cos-live"><i />Systeemcheck · Custom OS</span><span>0{nu + 1} / 04</span></div>
      <div className="cos-podium">
        <svg className="cos-lijnen" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{LIJNEN.map(d => <path key={d} d={d} />)}</svg>
        <div className="cos-kern"><img src="/images/SocialNow-OS-Logo-transparant.webp" alt="" /></div>
        {LOS.map((l, i) => <span key={l.naam} className="cos-los" style={{ "--x": l.x, "--y": l.y, "--r": `${l.r}deg`, "--k": l.k, "--d": `${(i * 0.3) % 0.8}s` } as React.CSSProperties}><b />{l.naam}</span>)}
        <div className="cos-os" aria-hidden="true">
          <div className="cos-zij">
            <span className="cos-naam"><i />{osNaam}</span>
            {MODULES.map(([m, k], i) => <span key={m} className={i === 0 ? "actief" : ""} style={{ "--k": k } as React.CSSProperties}><b />{m}</span>)}
          </div>
          <div className="cos-dash">
            <div className="cos-kaart"><small>Aanvragen</small><strong><Teller doel={128} actief={nu === 2} /></strong><em>deze maand</em></div>
            <div className="cos-kaart"><small>Open offertes</small><strong><Teller doel={23} actief={nu === 2} /></strong><em>€ 84k in de pijplijn</em></div>
            <div className="cos-kaart"><small>Advertenties</small><strong><Teller doel={4} actief={nu === 2} /></strong><em>campagnes live</em></div>
            <div className="cos-kaart cos-grafiek"><small>Omzet per week</small>{BALKEN.map((h, i) => <i key={i} style={{ "--h": h } as React.CSSProperties} />)}</div>
          </div>
        </div>
        <div className="cos-milos" aria-hidden="true">
          {MILOS.map(m => <div key={m.rol} className="cos-milo" style={{ "--k": m.k } as React.CSSProperties}><img src={`/proposal/milo/${m.rol}-128.webp`} alt="" width="34" height="34" /><p><b>{m.naam}</b>{m.tekst}</p></div>)}
        </div>
      </div>
      <div className="cos-speler-voet">
        <p className="cos-ondertitel" aria-live="polite">{scenes[nu].tekst}</p>
        <div className="cos-balk" role="tablist" aria-label="Scènes">
          {scenes.map((s, i) => (
            <button key={s.kort} type="button" role="tab" aria-selected={i === nu} className={i === nu ? "nu" : ""} aria-label={`Scène ${i + 1}: ${s.kort}`} onClick={() => { setNu(i); meet("explainer"); }}>
              <span className="cos-spoor"><span ref={el => { vul.current[i] = el; }} style={{ width: i < nu ? "100%" : 0 }} /></span>{s.kort}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeaderCustomOs({ profiel, meet }: { profiel?: Profiel | null; meet: (doel: Doel) => void }) {
  const naam = profiel?.bedrijf?.slice(0, 40);
  const osNaam = naam ? `${naam} OS` : "Jouw OS";
  const regels = [profiel?.branche && BRANCHE[profiel.branche] && `ingericht op ${BRANCHE[profiel.branche]}`, profiel?.mensen && `voor een team van ongeveer ${profiel.mensen} mensen`].filter(Boolean);
  return (
    <div className="sn-cos">
      <section className="cos-hero" data-variant="custom-os" id="diensten">
        <div>
          <p className="cos-eyebrow"><i />{naam ? `Custom OS / Voorbereid voor ${naam}` : "Voor bestaande bedrijven / Systeemcheck en Custom OS"}</p>
          <h1>{naam ? <>Zo zou het OS van {naam} <span>eruit kunnen zien.</span></> : <>Verouderde systemen zijn een open deur voor hackers. <span>Wij brengen weer overzicht.</span></>}</h1>
          <p className="cos-lead">Software zonder updates, wachtwoorden in de mail en klantdata verspreid over vijf tools. Daar komen inbrekers binnen. Onze experts brengen in kaart wat je hebt, sluiten de gaten en zetten alles in één OS dat je zelf overziet.</p>
          <ul className="cos-risicos" aria-label="Waar het vaak misgaat">{RISICOS.map(r => <li key={r}><i aria-hidden="true" />{r}</li>)}</ul>
          {naam && <p className="cos-voor-jou"><b>Voor {naam}: </b>{regels.length ? regels.join(", ") : "op maat van jullie processen"}. In een eerste gesprek van 30 minuten laten we zien wat er al te koppelen is.</p>}
          <div className="cos-acties">
            <a className="sn-pill sn-home-cta" href={CONTACT} onClick={() => meet("custom_os")}><span>Plan een systeemcheck</span><ArrowUpRight size={18} /></a>
            <Link className="sn-pill cos-stil" to="/veiligheid" onClick={() => meet("veiligheid")}><span>Zo beveiligen wij</span><ArrowUpRight size={18} /></Link>
          </div>
          <p className="cos-prijs">Custom OS <b>vanaf €10.000</b> · scope en kosten vooraf vastgelegd</p>
          <div className="cos-bouwers">
            <div className="cos-fotos">
              <img src="/images/klein/marinus-profiel-blauw-800.webp" alt="Marinus Bergsma" width="40" height="40" />
              <img src="/images/klein/Steef-Komen-160.webp" alt="Steef Komen" width="40" height="40" />
              <img src="/images/klein/sid-attesso-96.webp" alt="Sid van Kalken" width="40" height="40" />
            </div>
            <p><strong>Echte experts, geen chatbot of ticketsysteem.</strong>Marinus, Steef en Sid kijken zelf mee: developers en dataspecialisten.</p>
          </div>
          <ol className="cos-stappen" aria-label="Zo gaat het">
            <li><span>01</span>Systeemcheck</li><li><span>02</span>Gaten dichten en koppelen</li><li><span>03</span>Eén OS met overzicht</li>
          </ol>
        </div>
        <Explainer osNaam={osNaam} meet={meet} />
      </section>
    </div>
  );
}
