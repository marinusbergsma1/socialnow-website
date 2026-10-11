import React from "react";
import "./free-website.css";

// 11 oktober 2026 (Marinus): "Ik wil de onboarding gewoon als onderdeel van de site: FREE WEBSITE, groen vlak. En dan
// uitleg over beide, plus de onboarding, en dat we dan een mail krijgen."
// Een groen vlak direct onder de hero, anker #free-website (de onboardinglink in het gratis aanbod wijst hierheen).
// - Route 1: zelf bouwen in Odoo met One App Free. De kern komt uit het gecontroleerde stappenplan (Odoo 19, odoo.com/pricing)
//   in 02-SOCIALNOW/01_WEBSITE/onboarding-algemeen-20261009/bouw/bewaard-odoo-stappenplan.html.
// - Route 2: een gratis demo door onze experts.
// - De onboarding zelf draait op https://website.socialnow.nl (PHP op Hostinger, mail naar info@socialnow.nl). Een iframe
//   kan niet: die site stuurt X-Frame-Options SAMEORIGIN en de anti-spamsessie leunt op een PHP-sessiecookie, dat in een
//   iframe een cookie van derden zou zijn. Daarom een grote knop die de onboarding in een nieuw tabblad opent.
// Koppen op groen: de afsluitende punt is zwart, want een groene punt is op groen onzichtbaar.
// Proef: scripts/proef-free-website.mjs.
export const ONBOARDING_URL = "https://website.socialnow.nl";

export default function FreeWebsite() {
  return (
    <section id="free-website" className="sn-free-website" aria-labelledby="free-website-titel">
      <div className="h-wrap sn-fw-binnen">
        <div className="sn-fw-kop">
          <p className="sn-fw-label">Website-onboarding</p>
          <h2 id="free-website-titel"><span>GRATIS WEBSITE</span><span className="sn-fw-punt" translate="no">.</span></h2>
          <p className="sn-fw-intro">Twee gratis routes naar je nieuwe website. Bouw hem zelf in Odoo, of laat onze experts een demo voor je maken.</p>
        </div>

        <div className="sn-fw-routes">
          <article className="sn-fw-route" aria-labelledby="free-website-route-odoo">
            <p className="sn-fw-route-label">Route 1 · zelf bouwen</p>
            <h3 id="free-website-route-odoo"><span>Zelf bouwen in Odoo, gratis</span><span className="sn-fw-punt" translate="no">.</span></h3>
            <p>Met het abonnement One App Free bouw je je site gratis in de Website-app van Odoo: slepen, typen, publiceren.</p>
            <ul>
              <li>Eén app is gratis, met onbeperkt gebruikers. Je site staat eerst op een adres als jouwbedrijf.odoo.com.</li>
              <li>Je eigen domein koppel je met een CNAME-record, of je registreert bij Odoo een domein dat het eerste jaar gratis is.</li>
              <li>Let op: een tweede app, zoals boekhouding, is een betaald Odoo-abonnement.</li>
              <li>De koppeling met het SocialNow/OS loopt via de externe API van Odoo. Die zit bij Odoo Online alleen in het Custom-abonnement.</li>
            </ul>
            <p className="sn-fw-links">
              <a href="https://www.odoo.com/trial" target="_blank" rel="noopener noreferrer">Begin op odoo.com</a>
              <a href="https://www.odoo.com/pricing" target="_blank" rel="noopener noreferrer">Abonnementen bij Odoo</a>
            </p>
          </article>

          <article className="sn-fw-route is-demo" aria-labelledby="free-website-route-demo">
            <p className="sn-fw-route-label">Route 2 · wij bouwen</p>
            <h3 id="free-website-route-demo"><span>Gratis demo via SocialNow</span><span className="sn-fw-punt" translate="no">.</span></h3>
            <p>Onze experts bouwen gratis een demo van je nieuwe website, op basis van jouw antwoorden, teksten en beelden. Een team van designers en AI-developers, met de beste AI-modellen.</p>
            <ul>
              <li>Demo op basis van jouw teksten en beeld</li>
              <li>Persoonlijk besproken met een van onze experts</li>
              <li>Pas daarna kies je of je verder wilt</li>
            </ul>
          </article>
        </div>

        <div className="sn-fw-onboarding">
          <h3><span>Zo werkt de onboarding</span><span className="sn-fw-punt" translate="no">.</span></h3>
          <ol className="sn-fw-stappen">
            <li><b translate="no">1</b><span>Je vult de korte website-onboarding in, met je logo en beelden.</span></li>
            <li><b translate="no">2</b><span>Wij krijgen meteen een mail met je antwoorden.</span></li>
            <li><b translate="no">3</b><span>Wij nemen persoonlijk contact op en bouwen je demo.</span></li>
          </ol>
          <a className="sn-fw-knop" href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer">
            <span>Start je gratis website-onboarding</span><span className="sn-fw-pijl" aria-hidden="true" translate="no">→</span>
          </a>
          <p className="sn-fw-prijs">Gratis tot 10 GB opslag, daarna €20 per maand, of custom OS op aanvraag.</p>
        </div>
      </div>
    </section>
  );
}
