import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "./motion";
import { Bento, Tegel } from "./Bento";
import "./media-bento.css";

// 28 september 2026 (Marinus): drie kleine tegels zoals het landingsscherm. Contact loopt via /contact (Steef), nooit een hard wa.me-nummer.
function Beeld({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return <div ref={ref} className="h-trust-stories mb-beeld" data-visible={visible} aria-hidden="true">{children}</div>;
}
function Pil({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <div className="sn-tegel-onder">
      <Link className="sn-btn3d h-button h-button-secondary" to={to}>
        <span className="sn-btn3d-sheen" />
        <span>{children}</span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function TrustStories() {
  return (
    <Bento id="begeleiding" className="mb-bento mb-trust" label="Persoonlijke begeleiding" titel={<>Mensen achter je OS.<br /><span>Altijd één bericht verderop.</span></>} swipe>
      <Tegel kop="Direct contact" breed={4}>
        <p className="sn-tegel-titel">Een mens, geen ticket.</p>
        <Beeld>
          <div className="h-chat-visual">
            <div className="h-chat-person"><i /><span /><i /></div>
            <div className="h-chat-message"><span /><span /></div>
            <div className="h-chat-message is-response"><span /><Check size={19} /></div>
            <div className="h-chat-typing"><span /><i /><i /><i /></div>
          </div>
        </Beeld>
        <Pil to="/contact">Praat met ons</Pil>
      </Tegel>
      <Tegel kop="Overzicht" breed={4} soort="blauw">
        <p className="sn-tegel-titel">Van gegevens naar overzicht.</p>
        <Beeld>
          <div className="h-dashboard-visual">
            <div className="h-chart-top"><i /><span /></div>
            <div className="h-chart-label" />
            <svg viewBox="0 0 240 155">
              <path className="h-chart-grid" d="M0 25H240 M0 60H240 M0 95H240 M0 130H240" />
              <path className="h-chart-line" pathLength="1" d="M6 139L31 121L55 128L82 103L109 108L136 78L159 68L185 47L213 31L234 10" />
              <circle cx="234" cy="10" r="4" />
            </svg>
            <div className="h-chart-bottom"><span /><span /><span /></div>
          </div>
        </Beeld>
        <Pil to="/het-os">Ontdek je OS</Pil>
      </Tegel>
      <Tegel kop="Jouw richting" breed={4} soort="groen">
        <p className="sn-tegel-titel">Jouw volgende stap.</p>
        <Beeld>
          <div className="h-ring-visual">
            <svg viewBox="0 0 120 120">
              <circle className="h-ring-track" cx="60" cy="60" r="48" />
              <circle className="h-ring-progress" cx="60" cy="60" r="48" pathLength="1" />
            </svg>
            <div><strong>Jouw OS</strong><span>op jouw manier</span></div>
            <i />
          </div>
        </Beeld>
        <Pil to="/contact?onderwerp=Custom%20OS">Bespreek jouw inrichting</Pil>
      </Tegel>
    </Bento>
  );
}
