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
import { MotionControl } from "./motion";
import { Closing } from "./ui";
const TERMS =
  "https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf";
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
          <p>SocialNow · Software, creatie en marketing. Amsterdam · KVK 90877179.</p>
          <p>Genoemde prijzen zijn exclusief btw. Onze <a href={TERMS} target="_blank" rel="noopener noreferrer">algemene voorwaarden</a> en <Link to="/privacy">privacyverklaring</Link> zijn hier te vinden.</p>
        </div>
        <div className="h-footer-end">
          <span>
            © {new Date().getFullYear()} SocialNow. All rights reserved.
          </span>
          <a href={TERMS} target="_blank" rel="noopener noreferrer">
            Algemene voorwaarden
          </a>
          <Link to="/privacy">Privacy</Link>
          <span>KVK 90877179 · Sinds 2021</span>
        </div>
        <div className="h-footer-motion">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("sn-preview-logo-replay"))
            }
          >
            <RotateCcw size={13} />
            Logo-animatie opnieuw
          </button>
          <MotionControl />
        </div>
      </div>
    </footer>
  );
}
