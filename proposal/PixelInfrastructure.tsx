import { Link } from "react-router-dom";
import { ArrowUpRight, Download, ShieldCheck, Database } from "lucide-react";
import "./pixel-infrastructure.css";
const next = [["salesforce", "Salesforce", "/images/partners/salesforce.svg"], ["afas", "AFAS", "/images/partners/integraties/afas.png"], ["exact", "Exact", "/images/partners/integraties/exact.svg"], ["hubspot", "HubSpot", "/images/partners/integraties/hubspot.svg"], ["dynamics", "Microsoft Dynamics 365", "/images/partners/integraties/dynamics-365.svg"]];
const talks = [["visa", "Visa", "/images/partners/betalen/visa.svg"], ["mastercard", "Mastercard", "/images/partners/betalen/mastercard.svg"], ["airwallex", "Airwallex", "/images/partners/betalen/airwallex.webp"], ["adyen", "Adyen", "/images/partners/betalen/adyen.svg"], ["rabobank", "Rabobank", "/images/partners/betalen/rabobank.svg"], ["xxl", "XXL Nutrition", "/images/merken/xxl-nutrition.svg"]];
export const DATA_DOCUMENT = "/documenten/socialnow-veiligheid-en-data-nl.pdf";
function Marks({ items }: { items: string[][] }) { return <div className="sn-infra-marks">{items.map(([id, name, src]) => <div key={id}><img src={src} alt={name} loading="lazy" /></div>)}</div>; }
export default function PixelInfrastructure() { return <section className="sn-infrastructure" aria-labelledby="sn-infra-title">
  <header className="sn-infra-intro"><div><span className="sn-infra-eyebrow">Technologie met een duidelijke rol</span><h2 id="sn-infra-title">Een sterke basis.<br />Ruimte om te verbinden.</h2></div><p>Odoo, Zernio en je OS komen samen. Hieronder zie je hoe je data, veiligheid en koppelingen zijn geregeld.</p></header>
  <div className="sn-infra-trust">
    <article className="sn-infra-regie"><img src="/images/SocialNow-OS-Logo-transparant.webp" alt="SocialNow OS" loading="lazy" /><div><h3>Samen laten werken.</h3><p>Je OS, Studio, Ads en Sales. Met persoonlijke ondersteuning.</p><Link to="/het-os">Ontdek je OS <ArrowUpRight size={16} aria-hidden="true" /></Link></div></article>
    <article><Database size={22} aria-hidden="true" /><div><h3>Jouw data. 100% jouw eigendom.</h3><p>Jij houdt de regie over je bedrijfsgegevens en bepaalt welke bronnen je koppelt. Gegevens terugvragen, exporteren of laten verwijderen is vastgelegd in onze afspraken.</p><Link to="/voorwaarden">Lees de afspraken over jouw data <ArrowUpRight size={16} aria-hidden="true" /></Link></div></article>
    <article><ShieldCheck size={22} aria-hidden="true" /><div><h3>Veiligheid. Zwart op wit.</h3><p>Versleutelde sleutels, toegang per werkruimte en jouw akkoord voor acties. Lees uitgebreid hoe wij je data beschermen en wat jouw eigen rol is.</p><a href={DATA_DOCUMENT} download><Download size={17} aria-hidden="true" />Uitgebreide documentatie (PDF · NL)</a><Link to="/veiligheid">Alles over veiligheid <ArrowUpRight size={16} aria-hidden="true" /></Link></div></article>
  </div>
  <div className="sn-infra-integrations">
  <div className="sn-infra-strip"><div className="sn-infra-strip-head"><div><h3>ERP &amp; CRM</h3><p>Meer automatisering en overzicht in al je bedrijfssoftware. Maak je eigen koppelingen. Je data blijft van jou.</p></div><span>Mogelijke koppelingen</span></div><Marks items={next} /></div>
  <div className="sn-infra-strip"><div className="sn-infra-strip-head"><h3>Ons netwerk groeit.</h3><span>In gesprek</span></div><Marks items={talks} /><p className="sn-infra-note">Verkennende gesprekken · Geen bevestigde partnerschappen. Ook in gesprek met TrainMore.</p></div>
  </div>
</section>; }
