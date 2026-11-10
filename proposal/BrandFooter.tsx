import React from "react";
import { Link, useLocation } from "react-router-dom";
import { heeftWhatsApp, whatsappLink } from "./aanvragen";
import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { DIENSTEN } from "./Producten";
import ContactSlot from "./ContactSlot";
export default function BrandFooter() {
  const { pathname } = useLocation();
  const home = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/?)?$/.test(pathname);
  // Ook op /producten: de knop Neem contact op in die header springt naar dezelfde tegels.
  const metContact = home || /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?producten\/?$/.test(pathname);
  return (
    <footer className="h-brand-footer">
      <div className="h-wrap">
        {/* 4 november 2026 (Marinus): op de homepage het slot met contactpersonen in plaats van Start gratis met jouw systeem. Het
            grote slot op de andere pagina's (Milo's, One operation and management system) mocht ook weg: "Deze mag ook weg." */}
        {metContact && <ContactSlot />}
      </div>
      {/* 4 november 2026 (Marinus): Groei en cybersecurity stond hier even, op elke pagina. Later die dag: "Dit uit de footer en
          hier meer een geheel." Het blok staat nu op /het-os, onder de header met OS en Connect (paginas.tsx). */}
      <div className="h-wrap">
        <div className="h-footer-links">
          <div>
            <p className="h-eyebrow">Expertise</p>
            {DIENSTEN.map((service) => (
              <Link key={service.soort} to={service.naar}>
                {service.titel}
              </Link>
            ))}
          </div>
          <div>
            <p className="h-eyebrow">Het OS</p>
            <a href="https://app.socialnow.nl/login/">Log in op je OS</a>
            <Link to="/het-os">Ontdek hoe het werkt</Link>
            <Link to="/het-os#website">Website</Link>
            <Link to="/het-os#crm">CRM</Link>
            <Link to="/het-os#content">Studio</Link>
            <Link to="/het-os#ads">Advertenties</Link>
            <Link to="/diensten#prijs-os-titel">OS-abonnementen</Link>
          </div>
          <div>
            <p className="h-eyebrow">SocialNow</p>
            <Link to="/team">Ons team</Link>
            <Link to="/vacatures">Vacatures</Link>
            <Link to="/investeerders">Investeerders</Link>
            <Link to="/projecten">Ons werk</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/veiligheid">Veiligheid en sleutelbelofte</Link>
            {/* 4 november 2026: de securityscan staat niet meer in het menu, wel hier ("Nadruk op veiligheidsscan kan misschien wel veel kleiner"). */}
            <Link to="/security">Gratis securityscan</Link>
            <Link to="/#uitgelicht-werk">Uitgelicht werk</Link>
          </div>
          <div>
            <p className="h-eyebrow">Amsterdam</p>
            <p>
              Amstelstraat 43G
              <br />
              1017 DA Amsterdam
              <br />
              Nederland
            </p>
            <div className="h-footer-socials">
              <a
                href="https://www.instagram.com/socialnow.nl/"
                aria-label="SocialNow op Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/socialnow-nl/"
                aria-label="SocialNow op LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
              </a>
              {heeftWhatsApp && (
                <a
                  href={whatsappLink()}
                  aria-label="Contact via WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="h-footer-company">
          {/* 5 oktober 2026 stond hier Gecertificeerd & erkend (Google Partner, Meta, Google Developers); op 31 oktober kwamen de
              keurmerken via Uncanny en Indexworld erbij. 4 november 2026 (Marinus): "Dit uit de footer en hier meer een geheel.",
              "Met kleur" en over Google, Meta en Google Developers: "Deze mogen weg". Dus één rij partnerlogo's in eigen kleur, zoals
              onder de titel in de homepage-header. Proef: scripts/proef-footer-partnerkeurmerken.mjs. */}
          <div className="h-footer-erkend">
            <span>Partners en specialiteiten</span>
            <div>
              <img src="/images/partners/samen/odoo.svg" alt="Odoo Silver Partner" loading="lazy" />
              <img src="/images/partners/samen/shopify.svg" alt="Shopify Partners" loading="lazy" />
              <img src="/images/partners/samen/salesforce.svg" alt="Salesforce-partner" loading="lazy" />
              <img src="/images/partners/samen/adobe.svg" alt="Adobe-partner" loading="lazy" />
            </div>
          </div>
          <p>SocialNow · Software, creatie en marketing. Amsterdam · KVK 77146301.</p>
          {/* 19 september 2026: er zijn zeven juridische documenten in plaats van twee. Ze staan
              bij elkaar op /juridisch; twee losse links in de voettekst suggereerden dat er
              niet meer was, en juist de verwerkersovereenkomst is degene waar klanten om vragen. */}
          <p>Genoemde prijzen zijn exclusief btw. Onze <Link to="/voorwaarden">algemene voorwaarden</Link>, <Link to="/privacy">privacyverklaring</Link> en <Link to="/verwerkersovereenkomst">verwerkersovereenkomst</Link> staan met alle andere documenten op <Link to="/juridisch">juridisch en compliance</Link>.</p>
        </div>
        <div className="h-footer-end">
          <span>
            © {new Date().getFullYear()} SocialNow. All rights reserved.
          </span>
          <Link to="/voorwaarden">Algemene voorwaarden</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/juridisch">Juridisch</Link>
          <Link to="/veiligheid">Veiligheid</Link>
          <span>KVK 77146301 · Sinds 2021</span>
        </div>

      </div>
    </footer>
  );
}
