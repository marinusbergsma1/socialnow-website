import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { klein } from "./licht";
import { people } from "./content";
import { GRATIS_OS_URL } from "./os-entry";
import ExplainerPlayer from "./ExplainerPlayer";
import { MiloMotion } from "./motion";
import { ConnectLogo, Downloads, Filters, faces } from "./HomeHeader";
import "./home-header-approved.css";
import "./home-header-choice.css";
import "./header-bestaand.css";

// Variant B van de homepage-header, voor wie al een bedrijf heeft — 18 oktober 2026.
// MARINUS: "Hoe wij je data niet alleen inzichtelijker maar ook veiliger maken mag je claimen. Verder wil ik dat
// het een aanvulling is op de huidige opzet en start for free niet gelijk dat bedrag noemen en pakketten benoemen
// waarin token pakketten zichtbaar worden. En menselijke hulppakketten. Verder moet je dus een pakket kiezen als je
// je aanmeld [...] en bij het gratis tot 10gb moeten mensen wel alvast hun rekening koppelen."
// Daarom dezelfde opzet als variant A (HomeHeader), met een pakketkeuze in plaats van de Milo's en de Connect-gezichten
// plus hulppakketten. Geen €10.000 meer in de header.
//
// Daarna: "Verder is alles maandelijks." en "liever de bewegende robots weer terug": tokens per maand, de vier Milo's
// als bewegende video (MiloMotion) zoals op de rest van de site.
// Daarna: "Die prijzen mag na het account aanmaken." Dus geen bedragen in de header: alleen de pakketten. De
// tokenpakketten zijn die uit de OS-code (Flyinghighscalingup/socialnow-app, api/_studio-tokens.js, TOKEN_BUNDLES:
// 1.000, 2.500 en 5.000 tokens). De hulppakketten zijn die van /prijzen (Pricing.tsx). Het gekozen pakket gaat als ?pakket= mee naar de aanmelding van het OS; het OS
// moet die keuze en het koppelen van de rekening nog zelf tonen.

type Doel = "gratis_os" | "connect" | "explainer" | "veiligheid";

const START = [
  { id: "gratis", naam: "Gratis", groot: "10 GB", sub: "opslag" },
  { id: "tokens-1000", naam: "Tokens", groot: "1.000", sub: "per maand" },
  { id: "tokens-2500", naam: "Tokens", groot: "2.500", sub: "per maand" },
  { id: "tokens-5000", naam: "Tokens", groot: "5.000", sub: "per maand" },
];
const MILOS = [{ rol: "website", naam: "Website" }, { rol: "crm", naam: "CRM" }, { rol: "content", naam: "Content" }, { rol: "ads", naam: "Ads" }];

// 18 oktober 2026 (Marinus): "het is van belang dat het duidelijk is dat je voor 3K een veilig persoonlijk
// management and operation systeem hebt. Custom is bij alle pakketten naast gratis website inbegrepen." Het bedrag
// zelf staat pas na het aanmaken van een account; hier alleen wat er in elk pakket zit.
// Ook een hulppakket kies je bij het aanmaken van je account; de prijs volgt daarna in het OS.
const HULP = [
  { id: "hulp-content", naam: "Content", wie: "Content in je merk, gepland en geplaatst" },
  { id: "hulp-meta", naam: "Content + Meta", wie: "Plus Meta Ads opgezet en beheerd" },
  { id: "hulp-google", naam: "Meta + Google", wie: "Plus Google Ads, één rapport" },
  { id: "hulp-compleet", naam: "Compleet", wie: "Plus boekhouding en finance" },
];

// Een keuzegroep zoals een radiogroep hoort te werken: Tab gaat naar de gekozen optie, de pijltjes wisselen.
function pijltjes(e: React.KeyboardEvent<HTMLElement>, ids: string[], nu: string, kies: (id: string) => void) {
  const stap = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!stap) return;
  e.preventDefault();
  const volgende = ids[(ids.indexOf(nu) + stap + ids.length) % ids.length];
  kies(volgende);
  (e.currentTarget.querySelector(`[data-id="${volgende}"]`) as HTMLElement | null)?.focus();
}

export default function HeaderBestaand({ meet }: { meet: (doel: Doel) => void }) {
  const [start, setStart] = useState("gratis");
  const [hulp, setHulp] = useState(HULP[0].id);
  const gekozen = START.find(s => s.id === start)!;
  const hulpPakket = HULP.find(h => h.id === hulp)!;
  return (
    <div className="sn-choice sn-bestaand" data-variant="bestaand">
      <Filters />
      <div className="showcase wrap">
        <section className="hero" id="diensten">
          <div className="wrap">
            <div className="intro"><p className="eyebrow">Twee producten. Eén geheel.</p></div>
            <div className="services">
              <article className="service os">
                <div className="logo-row"><img className="os-logo" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" /><Downloads /></div>
                <h2>AI management &amp; operations.</h2>
                <div className="visual milos bs-milos">{MILOS.map(m => <figure key={m.rol}><MiloMotion role={m.rol} name={`Milo ${m.naam}`} maat={128} /><figcaption>{m.naam}</figcaption></figure>)}</div>
                <p className="bs-kop-start">Kies hoe je start.</p>
                <div className="bs-keuze" role="radiogroup" aria-label="Kies je startpakket" onKeyDown={e => pijltjes(e, START.map(x => x.id), start, setStart)}>
                  {START.map(s => (
                    <button key={s.id} type="button" role="radio" aria-checked={start === s.id} tabIndex={start === s.id ? 0 : -1} data-id={s.id} className="bs-pakket" onClick={() => setStart(s.id)}>
                      <span className="bs-vink" aria-hidden="true">{start === s.id && <Check size={12} strokeWidth={3} />}</span>
                      <b>{s.naam}</b>
                      <strong>{s.groot}</strong>
                      <small>{s.sub}</small>
                    </button>
                  ))}
                </div>
                <p className="bs-uitleg">
                  {start === "gratis"
                    ? <><strong>Gratis tot 10 GB aan opslag.</strong> Bij je aanmelding koppel je alvast je rekening. Zolang je onder 10 GB blijft, schrijven we niets af.</>
                    : <><strong>Gratis tot 10 GB, plus {gekozen.groot} tokens per maand voor de Studio.</strong> De prijs zie je nadat je je account hebt aangemaakt.</>}
                </p>
                <div className="action os-account-actions">
                  <a className="pill" href={`${GRATIS_OS_URL}?pakket=${start}`} onClick={() => meet("gratis_os")}><span>Start for free</span><span className="arrow"><ArrowUpRight size={17} /></span></a>
                  <a className="pill os-login-secondary" href={GRATIS_OS_URL} onClick={() => meet("gratis_os")}><span>Log in</span><span className="arrow"><ArrowUpRight size={17} /></span></a>
                </div>
              </article>
              <article className="service connect">
                <div className="logo-row"><ConnectLogo /></div>
                <div className="visual faces">{faces.map(p => <span key={p.name} title={p.name}><img {...klein(p.image, 52, [96, 160], undefined, "20261015-team")} alt={p.name} width="52" height="52" /></span>)}<Link className="more" to="/team" aria-label="Bekijk het hele team"><span className="desktop-count">+{people.length - faces.length}</span><span className="mobile-count">+{people.length - 7}</span></Link></div>
                <p className="bs-kop-hulp"><strong>Echte experts, per pakket.</strong></p>
                <div className="bs-hulp" role="radiogroup" aria-label="Kies je hulppakket" onKeyDown={e => pijltjes(e, HULP.map(x => x.id), hulp, setHulp)}>
                  {HULP.map(h => (
                    <button key={h.id} type="button" role="radio" aria-checked={hulp === h.id} tabIndex={hulp === h.id ? 0 : -1} data-id={h.id} className="bs-chip" onClick={() => setHulp(h.id)} translate="no">{h.naam}</button>
                  ))}
                </div>
                <p className="bs-uitleg bs-uitleg-hulp"><strong>Bij elk pakket: je eigen veilige management &amp; operations systeem en een gratis website.</strong> {hulpPakket.wie}, met een persoonlijke call waarin we je systeem uitleggen. De prijs zie je na het aanmaken van je account.</p>
                <div className="action"><a className="pill" href={`${GRATIS_OS_URL}?pakket=${hulp}`} onClick={() => meet("connect")}><span>Start met {hulpPakket.naam}</span><span className="arrow"><ArrowUpRight size={17} /></span></a></div>
              </article>
            </div>
          </div>
        </section>
        <section className="video-section" id="os-explainer">
          <div className="wrap">
            <div className="section-head video-intro">
              <div className="video-title">
                <h1>Meer inzicht in je bedrijf. <span className="free-word">En veiliger.</span></h1>
                <p className="pay-line">Verouderde systemen zijn een open deur voor hackers. Wij maken je data inzichtelijker én veiliger, met echte experts en AI.</p>
                <ul className="bs-zeker">
                  <li><ShieldCheck size={15} aria-hidden="true" />Updates en toegang op orde</li>
                  <li><ShieldCheck size={15} aria-hidden="true" />Rechten per persoon</li>
                  <li><ShieldCheck size={15} aria-hidden="true" /><Link to="/veiligheid" onClick={() => meet("veiligheid")}>Zo beveiligen wij</Link></li>
                </ul>
              </div>
            </div>
            <div onClickCapture={() => meet("explainer")}><ExplainerPlayer ctaLabel="Ontdek SocialNow" /></div>
          </div>
        </section>
      </div>
    </div>
  );
}
