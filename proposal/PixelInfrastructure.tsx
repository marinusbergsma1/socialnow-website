import "./pixel-infrastructure.css";
const next = [["salesforce","Salesforce"],["afas","AFAS"],["exact","Exact"],["hubspot","HubSpot"],["dynamics","Microsoft Dynamics 365"]];
const talks = [["visa","Visa"],["mastercard","Mastercard"],["airwallex","Airwallex"],["adyen","Adyen"],["rabobank","Rabobank"],["xxl","XXL Nutrition"],["trainmore","TrainMore"]];
function Marks({ items }: { items: string[][] }) { return <div className="sn-pixel-marks">{items.map(([id,name])=><div key={id}><img src={`/images/pixel-infra/${id}.svg`} alt={name} loading="lazy" />{id === "dynamics" && <span translate="no">Microsoft<br />Dynamics 365</span>}</div>)}</div>; }
export default function PixelInfrastructure() { return <section className="sn-pixel-infra" aria-label="Verbonden infrastructuur">
  <div className="sn-pixel-foundation">
    <div><img src="/images/pixel-infra/odoo.svg" alt="Odoo" loading="lazy" /><p>Website &amp; boekhouding</p></div>
    <div><img src="/images/pixel-infra/zernio.svg" alt="Zernio" loading="lazy" /><p>Social media · Ads · WhatsApp · bellen · SMS</p></div>
    <div><img src="/images/pixel-infra/socialnow-os.svg" alt="SocialNow OS" loading="lazy" /><p>Je OS · Studio · Ads · Sales</p></div>
  </div>
  <p className="sn-pixel-label">Volgende stap · ERP &amp; CRM koppelen</p><Marks items={next} />
  <p className="sn-pixel-label">Volgende gesprekken</p><Marks items={talks} />
</section>; }
