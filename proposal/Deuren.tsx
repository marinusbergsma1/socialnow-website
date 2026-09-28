import React from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { CONTACT_MAIL, heeftWhatsApp, whatsappLink } from "./aanvragen";
import { useLanguage } from "./i18n/context";
import { OdooLogo } from "./Verhaal";

// 28 september 2026 (Marinus): "Bent u een Odoo-gebruiker en wilt u het ook proberen, dan kan dat hier. En bent u een
// implementatiepartner die het gesprek aan wil gaan over wat die voor uw klanten kan betekenen, net als deze bedrijven die u
// voorgingen (logo's die ook in de winnervideo komen te staan), neem dan contact op met Michelle Yang."
// Twee deuren direct na het verhaal. De logo's zijn de vijf finalisten van de winactie (bron: oxp26-eindvideo/montage/assets/logos/BRON.md).
// michelle@socialnow.nl bestaat nog niet (het mailpakket heeft één plek, info@); tot die er is gaat de mail naar info@ t.a.v. Michelle.

const PARTNERS = [
  { naam: "KoderXpert Technologies", logo: "/images/partners/koderxpert.webp", breed: 242, hoog: 70 },
  { naam: "Envertis", logo: "/images/partners/envertis.webp", breed: 533, hoog: 80 },
  { naam: "AlphaDezine", logo: "/images/partners/alphadezine.svg", breed: 1753, hoog: 280 },
  { naam: "Jantra", logo: "/images/partners/jantra.webp", breed: 240, hoog: 240 },
  { naam: "Eusol", logo: "/images/partners/eusol.png", breed: 338, hoog: 98 },
];

const MAIL = `mailto:${CONTACT_MAIL}?subject=`;

function SalesforceLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#00A1E0" d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8" />
    </svg>
  );
}

export default function Deuren() {
  const { t } = useLanguage();
  const bericht = t("Hoi Michelle, ik ben Odoo-implementatiepartner en wil graag bespreken wat SocialNow OS voor onze klanten kan betekenen.");
  const onderwerp = t("Odoo-implementatiepartner, t.a.v. Michelle Yang");
  return (
    <section className="h-deuren h-wrap" id="probeer" aria-labelledby="deuren-titel">
      <p className="h-eyebrow"><i />Voor Odoo-gebruikers en partners</p>
      <h2 id="deuren-titel">
        Probeer het zelf.
        <br />
        <span>Of breng het naar je klanten.</span>
      </h2>
      <div className="h-deuren-grid">
        <article className="h-deur is-gebruiker">
          <p className="h-deur-label">Gebruik je Odoo?</p>
          <h3>Probeer het OS gratis.</h3>
          <p className="h-deur-tekst">Koppel je Odoo en zie je verkoop, klanten, merk en social op één scherm. Altijd gratis te gebruiken, met ons team erachter.</p>
          <p className="h-deur-waarom"><b>Waarom gratis?</b> Partners helpen ons het OS schaalbaar te houden. Wij verdienen aan het OS op maat, vanaf €10.000, en aan pakketten van ons team.</p>
          <ul className="h-deur-koppelingen">
            <li className="is-live">
              <span className="h-deur-merk" translate="no"><OdooLogo /><span>PRODUCT</span></span>
              <b><i aria-hidden="true" />Live</b>
            </li>
            <li className="is-bouw">
              <span className="h-deur-merk" translate="no"><SalesforceLogo /><span>Salesforce</span></span>
              <b><i aria-hidden="true" />Nu in aanbouw</b>
            </li>
          </ul>
          <a className="os-claim sn-btn3d h-button h-deur-knop" href="https://app.socialnow.nl/login/">
            <span className="sn-btn3d-sheen" />
            <span>Log in op je gratis OS</span>
            <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
          </a>
        </article>
        <article className="h-deur is-partner">
          <p className="h-deur-label">Ben je Odoo-implementatiepartner?</p>
          <h3>Praat met Michelle.</h3>
          <p className="h-deur-tekst">Bespreek wat het OS voor jouw klanten kan betekenen, net als de partners die je voorgingen.</p>
          <div className="h-deur-persoon">
            <img src="/images/Michelle-Yang-HD.webp" alt="" width="64" height="64" loading="lazy" />
            <p><strong translate="no">Michelle Yang</strong><span translate="no">Head of Implementation Partnerships</span></p>
          </div>
          <div className="h-deur-acties">
            {heeftWhatsApp && (
              <a className="sn-btn3d h-button h-deur-knop" href={whatsappLink(bericht)} target="_blank" rel="noopener noreferrer">
                <span className="sn-btn3d-sheen" />
                <MessageCircle size={17} aria-hidden="true" />
                <span>Stuur een WhatsApp</span>
              </a>
            )}
            <a className="h-text-link h-deur-mail" href={MAIL + encodeURIComponent(onderwerp)}>
              <Mail size={16} aria-hidden="true" />
              Mail Michelle
            </a>
          </div>
          <div className="h-deur-logos">
            <p>Zij gingen je voor</p>
            <ul translate="no">
              {PARTNERS.map((partner) => (
                <li key={partner.naam}>
                  <img src={partner.logo} alt={partner.naam} width={partner.breed} height={partner.hoog} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
