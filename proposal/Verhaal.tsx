import React from "react";
import { TextLink } from "./ui";

// 28 september 2026 (Marinus): "wat belangrijk was bij de beurs van Odoo is dat ik merkte dat het persoonlijke
// verhaal en waarom het OS gratis kan zijn". Direct onder de header: het verhaal als brief, drie redenen
// waarom het gratis kan, Odoo als product en Salesforce als koppeling waar we nu aan bouwen.
// Bronnen: de teampagina (campagnes en 2021), de missie op de homepage en de vier statements uit de eindvideo
// van Odoo Experience (ODOO EINDVIDEO/COPY.md). Geen nieuwe claims.

const REDENEN = [
  {
    titel: "Partners bouwen mee",
    tekst: "Development- en cybersecuritybedrijven helpen ons het OS beter en schaalbaar te maken. Zo blijft het altijd gratis te gebruiken.",
  },
  {
    titel: "Odoo-partners brengen het verder",
    tekst: "Implementatiepartners die met ons samenwerken, brengen onze systemen naar al hun klanten.",
  },
  {
    titel: "We verdienen aan maatwerk",
    tekst: "Ons verdienmodel is het OS op maat, vanaf €10.000, en pakketten van ons team bovenop je gratis OS.",
  },
];

export function OdooLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="140 146 640 250" role="img" aria-label="Odoo">
      <path fill="#8f8f8f" d="M695,346a75,75,0,1,1,75-75A75,75,0,0,1,695,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,695,315ZM538,346a75,75,0,1,1,75-75A75,75,0,0,1,538,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,538,315Zm-82-45c0,41.9-33.6,76-75,76s-75-34-75-75.9S336.5,196,381,196c16.4,0,31.6,3.5,44,12.6V165.1c0-8.3,7.3-15.1,15.5-15.1s15.5,6.8,15.5,15.1Zm-75,45a44,44,0,1,0-44-44A44,44,0,0,0,381,315Z" />
      <path fill="#714b67" d="M224,346a75,75,0,1,1,75-75A75,75,0,0,1,224,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,224,315Z" />
    </svg>
  );
}

function SalesforceLogo() {
  return (
    <svg className="h-verhaal-salesforce" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#00A1E0" d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8" />
    </svg>
  );
}

export default function Verhaal() {
  return (
    <section className="h-verhaal h-wrap" id="verhaal" aria-labelledby="verhaal-titel">
      <p className="h-eyebrow"><i />Wat we leerden in Brussel</p>
      <h2 id="verhaal-titel">
        Ons verhaal.
        <br />
        <span>En waarom het OS gratis is.</span>
      </h2>
      <div className="h-verhaal-grid">
        <figure className="h-verhaal-brief">
          <blockquote>
            <p>Voordat ik in 2021 SocialNow begon, maakte ik campagnes voor Amsterdam Light Festival, AZ en Universal.</p>
            <p>Mijn overtuiging is simpel: software moet voor mensen werken. Daarom bouwden we één OS waarin je website, CRM, content en advertenties samenwerken, met ons team erachter.</p>
            <p>In Brussel merkte ik dat twee dingen mensen raakten: dit verhaal, en waarom het OS gratis kan zijn.</p>
          </blockquote>
          <figcaption>
            <img src="/images/marinus-profiel-blauw.webp" alt="" width="56" height="56" loading="lazy" />
            <span><strong>Marinus Bergsma</strong><span>Founder & CEO</span></span>
          </figcaption>
        </figure>
        <div className="h-verhaal-gratis">
          <h3>Waarom kan het gratis?</h3>
          <ol>
            {REDENEN.map((reden, i) => (
              <li key={reden.titel}>
                <span className="h-verhaal-nr" aria-hidden="true">0{i + 1}</span>
                <span>
                  <b>{reden.titel}</b>
                  <span>{reden.tekst}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="h-verhaal-koppelingen">
        <div className="h-verhaal-koppeling is-odoo">
          <p className="h-verhaal-product" translate="no">
            <OdooLogo />
            <span>PRODUCT</span>
          </p>
          <p className="h-verhaal-status is-live"><i aria-hidden="true" />Live</p>
          <p className="h-verhaal-uitleg">De menselijke laag bovenop Odoo. Advertenties, content en persoonlijk contact in één systeem.</p>
        </div>
        <div className="h-verhaal-koppeling is-salesforce">
          <p className="h-verhaal-product" translate="no">
            <SalesforceLogo />
            <span>Salesforce</span>
          </p>
          <p className="h-verhaal-status is-bouw"><i aria-hidden="true" />Nu in aanbouw</p>
          <p className="h-verhaal-uitleg">We zijn nu bezig met de integratie van Salesforce. Werk je met Salesforce?</p>
          <TextLink to="/contact">Laat het ons weten</TextLink>
        </div>
      </div>
    </section>
  );
}
