import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { prices, services } from "./content";
import { MotionControl } from "./motion";
import { Action } from "./ui";
import { CLAIM_URL } from "./os-entry";
const TERMS =
  "https://storage.googleapis.com/video-slider/Algemene%20Voorwaarden%20SocialNow.pdf";
export default function BrandFooter() {
  return (
    <footer className="h-brand-footer">
      <div className="h-wrap">
        <div className="h-footer-plans">
          <p className="h-eyebrow">Jouw volgende stap</p>
          <div>
            {prices.map((plan) => {
              const body = (
                <>
                  <h3>{plan.name}</h3>
                  <span>{plan.period}</span>
                  <p>{plan.description}</p>
                  <b>
                    {plan.action}
                    <ArrowUpRight size={14} />
                  </b>
                </>
              );
              return plan.href ? (
                <a key={plan.name} href={plan.href}>
                  {body}
                </a>
              ) : (
                <Link key={plan.name} to={plan.to!}>
                  {body}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="h-footer-statement">
          <div>
            <h2>
              Eén OS.
              <br />
              Vier Milo’s.
              <br />
              <span>Ons team.</span>
            </h2>
            <p>
              Creatie, technologie en mensen. Verbonden rond jouw bedrijf, met
              de POC als eerste kennismaking en een Custom OS als volgende stap.
            </p>
          </div>
          <div>
            <a href="mailto:info@socialnow.nl">
              info@socialnow.nl
              <ArrowUpRight size={17} />
            </a>
            <a href="tel:+31637404577">
              +31 6 37 40 45 77
              <ArrowUpRight size={17} />
            </a>
            <a
              href="https://wa.me/31637404577"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
            <Action href={CLAIM_URL}>Probeer de POC</Action>
            <Link to="/contact?onderwerp=Custom%20OS">
              Daarna: jouw Custom OS <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
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
            <Link to="/het-os">Ontdek de POC</Link>
            <Link to="/het-os#website">Milo Website</Link>
            <Link to="/het-os#crm">Milo CRM</Link>
            <Link to="/het-os#content">Milo Studio</Link>
            <Link to="/het-os#ads">Milo Advertenties</Link>
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
        <div className="h-footer-partner">
          <p className="h-eyebrow">Samen met</p>
          <img
            src="/images/SocialNow-OS-Komen-Consultancy.webp"
            alt="SocialNow OS in samenwerking met Komen Consultancy"
            width="640"
            height="180"
            loading="lazy"
          />
        </div>
        <div className="h-footer-platforms">
          <p className="h-eyebrow">Technologie & platforms</p>
          <div>
            <img
              src="/google-logo.svg"
              alt="Google"
              width="110"
              height="36"
              loading="lazy"
            />
            <img
              src="/meta-logo.svg"
              alt="Meta"
              width="110"
              height="36"
              loading="lazy"
            />
            <span>
              <img
                src="/google-logo.svg"
                alt="Google"
                width="70"
                height="28"
                loading="lazy"
              />
              Developers
            </span>
          </div>
        </div>
        <div className="h-footer-company">
          <p>© {new Date().getFullYear()} SocialNow</p>
          <p>
            SocialNow is een software- en marketingbureau gevestigd aan de
            Amstelstraat 43G, 1017 DA Amsterdam, Nederland, en staat
            ingeschreven bij de Kamer van Koophandel onder nummer 90877179. Voor
            vragen over onze diensten kun je contact opnemen via{" "}
            <a href="mailto:info@socialnow.nl">info@socialnow.nl</a>.
          </p>
          <p>
            De inrichting, koppelingen en begeleiding van jouw Custom OS leggen
            we vast in een persoonlijk voorstel. Informatie over de verwerking
            van persoonsgegevens vind je in onze{" "}
            <Link to="/privacy">privacyverklaring</Link>.
          </p>
          <p>
            Genoemde prijzen zijn exclusief btw. Op onze offertes en
            overeenkomsten zijn onze{" "}
            <a href={TERMS} target="_blank" rel="noopener noreferrer">
              algemene voorwaarden
            </a>{" "}
            van toepassing.
          </p>
        </div>
        <div className="h-footer-end">
          <Link to="/" className="h-brand">
            <img
              src="/images/SocialNow-Logo-2026.webp"
              alt="SocialNow"
              width="200"
              height="38"
              loading="lazy"
            />
          </Link>
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
