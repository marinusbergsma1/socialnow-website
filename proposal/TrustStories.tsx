import React from "react";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView, MotionControl } from "./motion";

export default function TrustStories() {
  const { ref, visible } = useInView<HTMLElement>();
  return (
    <section
      className="h-section h-wrap h-trust-stories"
      ref={ref}
      data-visible={visible}
      aria-labelledby="trust-title"
    >
      <div className="h-trust-heading">
        <p className="h-trust-badge">
          <ShieldCheck size={15} />
          Software met mensen erachter
        </p>
        <h2 id="trust-title">
          Jouw bedrijf.
          <br />
          <span>Met aandacht gebouwd.</span>
        </h2>
        <p>
          Persoonlijk contact, overzicht in je gegevens en heldere afspraken
          over de volgende stap. Van het eerste gebruik tot jouw Custom OS.
        </p>
        <MotionControl />
      </div>
      <div className="h-trust-grid">
        <article className="h-trust-card">
          <h3>
            Direct contact
            <br />
            via WhatsApp.
          </h3>
          <div className="h-chat-visual" aria-hidden="true">
            <div className="h-chat-person">
              <i />
              <span />
              <i />
            </div>
            <div className="h-chat-message">
              <span />
              <span />
            </div>
            <div className="h-chat-message is-response">
              <span />
              <Check size={19} />
            </div>
            <div className="h-chat-typing">
              <span />
              <i />
              <i />
              <i />
            </div>
          </div>
          <a
            href="https://wa.me/31637404577"
            target="_blank"
            rel="noopener noreferrer"
          >
            Praat met ons
            <ArrowUpRight size={16} />
          </a>
        </article>
        <article className="h-trust-card">
          <h3>
            Van gegevens
            <br />
            naar overzicht.
          </h3>
          <div className="h-dashboard-visual" aria-hidden="true">
            <div className="h-chart-top">
              <i />
              <span />
            </div>
            <div className="h-chart-label" />
            <svg viewBox="0 0 240 155">
              <path
                className="h-chart-grid"
                d="M0 25H240 M0 60H240 M0 95H240 M0 130H240"
              />
              <path
                className="h-chart-line"
                pathLength="1"
                d="M6 139L31 121L55 128L82 103L109 108L136 78L159 68L185 47L213 31L234 10"
              />
              <circle cx="234" cy="10" r="4" />
            </svg>
            <div className="h-chart-bottom">
              <span />
              <span />
              <span />
            </div>
          </div>
          <Link to="/het-os">
            Ontdek je OS
            <ArrowUpRight size={16} />
          </Link>
        </article>
        <article className="h-trust-card">
          <h3>
            Jouw richting.
            <br />
            Jouw volgende stap.
          </h3>
          <div className="h-ring-visual" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle className="h-ring-track" cx="60" cy="60" r="48" />
              <circle
                className="h-ring-progress"
                cx="60"
                cy="60"
                r="48"
                pathLength="1"
              />
            </svg>
            <div>
              <strong>Jouw OS</strong>
              <span>op jouw manier</span>
            </div>
            <i />
          </div>
          <Link to="/contact?onderwerp=Custom%20OS">
            Bespreek jouw inrichting
            <ArrowUpRight size={16} />
          </Link>
        </article>
      </div>
    </section>
  );
}
