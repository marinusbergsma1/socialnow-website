import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { services } from "./content";
import { Closing } from "./ui";
import Keurmerken from "./Keurmerken";
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
            <Link to="/projecten">Ons werk</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
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
              <a
                href="https://wa.me/31637404577"
                aria-label="Contact via WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="h-footer-company">
          <Keurmerken />
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
          <span>KVK 90877179 · Sinds 2021</span>
        </div>

      </div>
    </footer>
  );
}
