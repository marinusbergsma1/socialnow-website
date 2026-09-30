import React from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { CONTACT_MAIL, heeftWhatsApp, whatsappLink } from "./aanvragen";
import { useLanguage } from "./i18n/context";
import { OdooLogo } from "./Verhaal";
import { Bento, Tegel } from "./Bento";

// 28 september 2026 (Marinus): "Bent u een Odoo-gebruiker en wilt u het ook proberen, dan kan dat hier. En bent u een
// implementatiepartner die het gesprek aan wil gaan over wat die voor uw klanten kan betekenen, net als deze bedrijven die u
// voorgingen (logo's die ook in de winnervideo komen te staan), neem dan contact op met Michelle Yang."
// Twee deuren direct na het verhaal. De logo's zijn de vijf finalisten van de winactie (bron: oxp26-eindvideo/montage/assets/logos/BRON.md).
// 28 september 2026 (Marinus): "laat al het contact eerst via Steef gaan". De mail gaat naar het contactadres uit aanvragen.ts,
// met Michelle in het onderwerp; de WhatsApp-knop verschijnt pas als Steefs nummer daar staat.

const PARTNERS = [
  { naam: "KoderXpert Technologies", logo: "/images/partners/koderxpert.webp", breed: 242, hoog: 70 },
  { naam: "Envertis", logo: "/images/partners/envertis.webp", breed: 533, hoog: 80 },
  { naam: "AlphaDezine", logo: "/images/partners/alphadezine.svg", breed: 1753, hoog: 280 },
  { naam: "Jantra", logo: "/images/partners/jantra.webp", breed: 240, hoog: 240 },
  { naam: "Eusol", logo: "/images/partners/eusol.png", breed: 338, hoog: 98 },
];

const MAIL = `mailto:${CONTACT_MAIL}?subject=`;

// 29 september 2026 (Marinus): "bij Salesforce stukje wel écht even hun logo ook." Het officiële logo (wolk met
// woordmerk, bron Wikimedia Commons, Salesforce.com_logo.svg) in plaats van alleen de kale wolk.
function SalesforceLogo() {
  return <img className="h-deur-salesforce" src="/images/partners/salesforce.svg" alt="Salesforce" width="273" height="191" loading="lazy" />;
}

export default function Deuren() {
  const { t } = useLanguage();
  const bericht = t("Hoi Michelle, ik ben Odoo-implementatiepartner en wil graag bespreken wat SocialNow OS voor onze klanten kan betekenen.");
  const onderwerp = t("Odoo-implementatiepartner, t.a.v. Michelle Yang");
  return (
    <Bento
      id="probeer"
      className="h-deuren"
      label="Voor Odoo-gebruikers en partners"
      titel={<>Probeer het zelf.<br /><span>Of breng het naar je klanten.</span></>}
    >
      <Tegel kop="Gebruik je Odoo?" breed={6} soort="groen" className="h-deur">
        <h3 className="sn-tegel-titel">Probeer het OS gratis.</h3>
        <p className="sn-tegel-tekst">Koppel je Odoo en zie je verkoop, klanten, merk en social op één scherm. Altijd gratis te gebruiken, met ons team erachter.</p>
        <p className="h-deur-waarom"><b>Waarom gratis?</b> Partners helpen ons het OS schaalbaar te houden. Wij verdienen aan het OS op maat, vanaf €10.000, en aan pakketten van ons team.</p>
        <div className="sn-tegel-onder">
          <a className="os-claim sn-btn3d h-button h-deur-knop" href="https://app.socialnow.nl/login/">
            <span className="sn-btn3d-sheen" />
            <span>Log in op je gratis OS</span>
            <span className="h-button-icon"><ArrowUpRight size={16} aria-hidden="true" /></span>
          </a>
        </div>
      </Tegel>
      <Tegel kop="Ben je Odoo-implementatiepartner?" breed={6} soort="blauw" className="h-deur">
        <h3 className="sn-tegel-titel">Praat met Michelle.</h3>
        <p className="sn-tegel-tekst">Bespreek wat het OS voor jouw klanten kan betekenen, net als de partners die je voorgingen.</p>
        <div className="h-deur-persoon">
          <img src="/images/Michelle-Yang-HD.webp" alt="" width="64" height="64" loading="lazy" />
          <p><strong translate="no">Michelle Yang</strong><span translate="no">Head of Implementation Partnerships</span></p>
        </div>
        <div className="sn-tegel-onder">
          {heeftWhatsApp && (
            <a className="sn-btn3d h-button h-deur-knop is-partner" href={whatsappLink(bericht)} target="_blank" rel="noopener noreferrer">
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
      </Tegel>
      <Tegel kop="Odoo" breed={4} className="h-deur-status is-live">
        <span className="h-deur-merk" translate="no"><OdooLogo /><span>PRODUCT</span></span>
        <b><i aria-hidden="true" />Live</b>
      </Tegel>
      <Tegel kop="Salesforce" breed={4} className="h-deur-status is-bouw">
        <span className="h-deur-merk" translate="no"><SalesforceLogo /></span>
        <b><i aria-hidden="true" />Nu in aanbouw</b>
      </Tegel>
      <Tegel kop="Zij melden zich al aan." breed={4} className="h-deur-logos">
        <ul translate="no">
          {PARTNERS.map((partner) => (
            <li key={partner.naam}>
              <img src={partner.logo} alt={partner.naam} width={partner.breed} height={partner.hoog} loading="lazy" />
            </li>
          ))}
        </ul>
      </Tegel>
    </Bento>
  );
}
