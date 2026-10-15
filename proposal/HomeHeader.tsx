import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { MiloMotion } from "./motion";
import { people, logos } from "./content";
import { klein } from "./licht";
import ExplainerPlayer from "./ExplainerPlayer";
import { InstallKnop, GRATIS_OS_URL } from "./os-entry";
import "./home-header-approved.css";

function ConnectColor() {
  return <svg className="rx-color-filters" aria-hidden="true" focusable="false"><defs><filter id="sn-connect-blue" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="0.6" intercept="0.02"/><feFuncG type="linear" slope="0.55" intercept="0.43"/><feFuncB type="linear" slope="0.45" intercept="0.5"/></feComponentTransfer></filter></defs></svg>;
}
function ProductLogo({ connect = false }: { connect?: boolean }) {
  const src = "/images/home-header/socialnow-connect.png";
  return <div className="rx-logo" translate="no">{connect
    ? <span className="rx-connect-tint"><img className="rx-connect" src={src} alt="SocialNow Connect" width="1362" height="171"/><img className="rx-connect rx-connect-overlay" src={src} alt="" aria-hidden="true" width="1362" height="171"/></span>
    : <img className="rx-os" src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" width="600" height="92"/>}</div>;
}
const connectFaces = ["Marinus Bergsma", "Sid van Kalken", "Douwe Kramer", "Steef Komen", "Emma Peperkamp", "Isa Zoer"]
  .flatMap(name => { const person = people.find(person => person.name === name); return person ? [person] : []; });
const connectPeople = [...connectFaces, ...people.filter(person => !connectFaces.some(face => face.name === person.name))];
function ConnectPeople() {
  const row = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(6);
  React.useEffect(() => {
    const element = row.current;
    if (!element) return;
    const update = () => {
      const width = element.clientWidth;
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const size = mobile ? 48 : 58, overlap = 18, gap = mobile ? 6 : 8;
      const allWidth = connectPeople.length * (size - overlap) + overlap;
      setShown(width >= allWidth ? connectPeople.length : Math.max(1, Math.min(connectPeople.length - 1, Math.floor((width - overlap - size - gap) / (size - overlap)))));
    };
    const observer = new ResizeObserver(update);
    observer.observe(element); update(); window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, []);
  const remaining = connectPeople.length - shown;
  return <div ref={row} className="rx-product-visuals rx-people">
    {connectPeople.slice(0, shown).map(person => <Link key={person.name} to="/team" title={person.name} aria-label={person.name}>
      <img {...klein(person.image, 58, [96, 160], undefined, "20261015-team")} alt={person.name} width="58" height="58" />
    </Link>)}
    {remaining > 0 && <Link className="rx-more-people" to="/team" title="Maak kennis met het team ↗"><b translate="no">+{remaining}</b></Link>}
  </div>;
}
function ProductVisuals({ connect }: { connect: boolean }) {
  return connect ? <ConnectPeople/> : <div className="rx-product-visuals rx-milos">
    {[{ role: "website", name: "Website" }, { role: "crm", name: "CRM" }, { role: "content", name: "Content" }, { role: "ads", name: "Ads" }].map(milo =>
      <div key={milo.role} title={milo.name}><MiloMotion role={milo.role} name={milo.name} maat={128} /></div>)}
  </div>;
}
function Product({ connect = false }: { connect?: boolean }) {
  return <article className={`rx-product${connect ? " rx-product-connect" : ""}`}>
    <ProductVisuals connect={connect}/>
    <div className="rx-product-heading"><ProductLogo connect={connect}/>{!connect && <div className="rx-downloads"><div className="sn-header-download"><InstallKnop dock compact/></div></div>}</div>
    <p className="rx-service-label">{connect ? "Ons verbindende platform." : "AI management & operations."}</p>
    {connect && <p className="rx-desc"><b>De juiste experts voor jouw bedrijf.</b><br/><span>Van strategie en creatie tot marketing en techniek.</span><br/><span>Eén netwerk. Samen aan jouw groei.</span></p>}
    {!connect && <p className="rx-price"><b>Gratis tot 10 GB aan opslag.</b><br/>Of vraag een eigen systeem op maat aan.</p>}
    <a className="rx-button" href={connect ? "/connect/" : GRATIS_OS_URL} translate="no"><span>{connect ? "Find out more" : "Login"}</span><span className="rx-arrow"><ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true"/></span></a>
  </article>;
}
const trustedBrands = [
  ["merken/BETCITY-LOGO.svg", "BetCity"],
  ...["Universal", "MOJO"].flatMap(name => {
    const logo = logos.find(logo => logo[1] === name); return logo ? [[logo[0], logo[1]]] : [];
  }),
  ...logos.filter(logo => !["Universal", "MOJO", "AZ", "Light Art Collection", "Chin Chin Club", "kWh Garant", "DIVINE", "PrimeFone"].includes(logo[1])).map(logo => [logo[0], logo[1]]),
];
function TrustedBy() {
  return <div className="rx-trusted" translate="no">
    <div className="rx-trusted-heading"><img src="/images/SocialNow-Logo-2026.webp" alt="SocialNow" width="126" height="24"/><span>is trusted by</span></div>
    <div className="rx-trusted-brands"><div className="rx-trusted-track">{[0, 1].map(copy => <div key={copy} className="rx-trusted-group" aria-hidden={copy ? true : undefined}>{trustedBrands.map(([src, name]) => <div key={name} data-brand={name}><img src={`/images/${src}`} alt={copy ? "" : name} width="180" height="64" decoding="async" /></div>)}</div>)}</div></div>
  </div>;
}
export function HomeExplainer() {
  return <section className="rx-media" id="os-explainer" aria-labelledby="rx-explainer-title">
    <div className="rx-explainer-main">
    <h2 id="rx-explainer-title">Met twee connecties alles op één plek.</h2>
    <p className="rx-explainer-intro">Waar je nu anderen voor betaalt, beheer je bij ons gratis.</p>
    <ExplainerPlayer ctaLabel="Bekijk het gemak"/>
    </div>
    <TrustedBy/>
  </section>;
}
function DevelopmentPartners() {
  return <section className="rx-partners rx-partners-opening" aria-label="Doorontwikkeling">
    <h2 className="rx-partners-title" translate="no">Working together to improve daily with…</h2>
    <div className="rx-partner"><ProductLogo/><div className="rx-built"><span>Doorontwikkeling door</span><a href="https://indexworld.net" aria-label="Indexworld" target="_blank" rel="noopener noreferrer"><img src="/images/home-header/indexworld.png" alt="Indexworld" width="725" height="176" loading="lazy"/></a></div></div>
    <div className="rx-partner"><ProductLogo connect/><div className="rx-built"><span>Doorontwikkeling door</span><a className="rx-uncanny" href="https://uncannycs.com" aria-label="Uncanny" target="_blank" rel="noopener noreferrer"><img src="/images/home-header/uncanny.svg" alt="Uncanny" width="1365" height="300" loading="lazy"/></a></div></div>
  </section>;
}
export function HomeDevelopmentPartners() {
  return <div className="rx rx-development-partners"><DevelopmentPartners/></div>;
}
export default function HomeHeader() {
  return <div className="rx rx-3">
    <ConnectColor/>
    <div className="rx-grid">
      <div className="rx-heading"><p className="rx-pain">Te veel losse tools om je bedrijf te runnen?</p><h1>Jij onderneemt. Wij verbinden.</h1><p className="rx-intro">Eén plek om je website, CRM, content en advertenties te runnen.</p></div>
      <HomeExplainer/>
      <div className="rx-details"><h2 className="rx-services-title">Twee diensten. Eén geheel.</h2><div className="rx-products"><Product/><Product connect/></div>
        <nav className="rx-free" aria-label="Start gratis" translate="no">
          <a href="https://website.socialnow.nl/" title="Website-demo, tijdelijk inclusief rebranding">Free website demo <span aria-hidden="true">↗</span></a>
          <Link to="/audit#aanvragen">Free Google Ads scan <span aria-hidden="true">↗</span></Link>
          <a href={GRATIS_OS_URL}>Free SocialNow/OS <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </div>
  </div>;
}
