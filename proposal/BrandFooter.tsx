import React from "react";
import { Link } from "react-router-dom";
import { heeftWhatsApp, whatsappLink } from "./aanvragen";
import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { services } from "./content";
import { Closing } from "./ui";
export default function BrandFooter() {
  return (
    <footer className="h-brand-footer">
      <div className="h-wrap">
        <Closing />
        <div className="h-footer-links">
          <div>
            <p className="h-eyebrow">Expertise</p>
            {services.map((service) => (
              <Link key={service.id} to={`/diensten#${service.id}`}>
                {service.title}
              </Link>
            ))}
          </div>
          <div>
            <p className="h-eyebrow">Het OS</p>
            <Link to="/het-os">Ontdek hoe het werkt</Link>
            <Link to="/het-os#website">Website</Link>
            <Link to="/het-os#crm">CRM</Link>
            <Link to="/het-os#content">Studio</Link>
            <Link to="/het-os#ads">Advertenties</Link>
            <Link to="/prijzen">Aanbod & inrichting</Link>
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
          {/* 5 oktober 2026 (Marinus): "Deze balken zijn toch niet zo netjes. Dan liever zoals ik lang geleden had met Google
              Developers en Meta etc vanuit onze creatives dat we dat gwn hebben." Dezelfde rij als in de oude footer
              (socialnow-website, components/Footer.tsx: Gecertificeerd & Erkend), rustig in wit. De keurmerken zelf staan nog op
              /juridisch. */}
          <div className="h-footer-erkend" translate="no">
            <span>Gecertificeerd &amp; erkend</span>
            <div>
              <img src="/google-logo.svg" alt="Google Partner" loading="lazy" />
              <img src="/meta-logo.svg" alt="Meta Business Partner" loading="lazy" />
              <b>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google Developers
              </b>
            </div>
          </div>
          <p>SocialNow · Software, creatie en marketing. Amsterdam · KVK 90877179.</p>
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
          <span>KVK 90877179 · Sinds 2021</span>
        </div>

      </div>
    </footer>
  );
}
