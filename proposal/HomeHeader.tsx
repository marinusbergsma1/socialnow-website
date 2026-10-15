import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
function Product({ connect = false }: { connect?: boolean }) {
  return <article className={`rx-product${connect ? " rx-product-connect" : ""}`}>
    <ProductLogo connect={connect}/>
    <p className="rx-desc">{connect ? "De juiste experts voor jouw bedrijf." : "Eén plek om je website, CRM, content en advertenties te runnen."}</p>
    {!connect && <p className="rx-price"><b>Gratis tot 10 GB.</b><br/>Daarna €20,- per maand.</p>}
    <a className="rx-button" href={connect ? "/connect/" : GRATIS_OS_URL} translate="no"><span>{connect ? "Find out more" : "Login"}</span><span className="rx-arrow"><ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true"/></span></a>
  </article>;
}
export function HomeExplainer() {
  return <section className="rx-media" id="os-explainer" aria-labelledby="rx-explainer-title">
    <h2 id="rx-explainer-title">Bekijk hoe het OS werkt.</h2>
    <ExplainerPlayer/>
    <div className="rx-downloads"><div className="sn-header-download"><InstallKnop dock compact/></div></div>
  </section>;
}
function DevelopmentPartners() {
  return <section className="rx-partners" aria-label="Doorontwikkeling">
    <div className="rx-partner"><ProductLogo/><div className="rx-built"><span>Doorontwikkeling door</span><a href="https://indexworld.net" aria-label="Indexworld" target="_blank" rel="noopener noreferrer"><img src="/images/home-header/indexworld.png" alt="Indexworld" width="725" height="176" loading="lazy"/></a></div></div>
    <div className="rx-partner"><ProductLogo connect/><div className="rx-built"><span>Doorontwikkeling door</span><a className="rx-uncanny" href="https://uncannycs.com" aria-label="Uncanny" target="_blank" rel="noopener noreferrer"><img src="/images/home-header/uncanny.svg" alt="Uncanny" width="1365" height="300" loading="lazy"/></a></div></div>
  </section>;
}
export default function HomeHeader() {
  return <div className="rx rx-3">
    <ConnectColor/>
    <div className="rx-grid">
      <div className="rx-heading"><p className="rx-pain">Te veel losse tools om je bedrijf te runnen?</p><h1>Jij onderneemt. Wij verbinden.</h1></div>
      <HomeExplainer/>
      <div className="rx-details"><div className="rx-products"><Product/><Product connect/></div>
        <nav className="rx-free" aria-label="Start gratis" translate="no">
          <a href="https://website.socialnow.nl/" title="Website-demo, tijdelijk inclusief rebranding">Free website demo <span aria-hidden="true">↗</span></a>
          <Link to="/audit#aanvragen">Free Google Ads scan <span aria-hidden="true">↗</span></Link>
          <a href={GRATIS_OS_URL}>Free SocialNow/OS <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </div>
    <DevelopmentPartners/>
  </div>;
}
