import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "./motion";
import { Bento, Tegel } from "./Bento";
import "./media-bento.css";
import { people } from "./content";
import { klein } from "./licht";

const steef = people.find((p) => p.name === "Steef Komen");
const marinus = people.find((p) => p.name === "Marinus Bergsma");

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
      {/* 5 oktober 2026 (Marinus): "Beetje verouderde animaties." en "Zelfde". De grijze balkjes zijn echte inhoud geworden:
          een gesprek met Steef, een dashboard met cijfers en een stappenplan met Marinus. Rustig, tech, mensen erbij. */}
      <Tegel kop="Direct contact" breed={4}>
        <p className="sn-tegel-titel">Een mens, geen ticket.</p>
        <Beeld>
          <div className="tr-chat">
            <div className="tr-chat-kop">
              {steef && <img {...klein(steef.image, 36)} alt="" width="36" height="36" loading="lazy" />}
              <span><b>Steef Komen</b><small>Partner · Finance &amp; Data</small></span>
              <em><i />online</em>
            </div>
            <p className="tr-bericht is-klant">Kunnen de offertes direct in Odoo komen?</p>
            <p className="tr-bericht is-team">Staat klaar. Net getest in jouw OS.<Check size={14} /></p>
            <p className="tr-typt"><i /><i /><i /></p>
          </div>
        </Beeld>
        <Pil to="/contact">Praat met ons</Pil>
      </Tegel>
      <Tegel kop="Overzicht" breed={4} soort="blauw">
        <p className="sn-tegel-titel">Van gegevens naar overzicht.</p>
        <Beeld>
          <div className="tr-dash">
            <div className="tr-dash-kop"><span><i />Jouw OS · deze maand</span><small>live</small></div>
            <dl className="tr-dash-cijfers">
              <div><dt>Leads</dt><dd>126</dd></div>
              <div><dt>Offertes</dt><dd>38</dd></div>
              <div><dt>Gewonnen</dt><dd>+18%</dd></div>
            </dl>
            <svg viewBox="0 0 240 70" preserveAspectRatio="none">
              <path className="tr-dash-vlak" d="M0 62L24 55L48 58L72 46L96 49L120 36L144 31L168 22L192 17L216 12L240 4V70H0Z" />
              <path className="tr-dash-lijn" pathLength="1" d="M0 62L24 55L48 58L72 46L96 49L120 36L144 31L168 22L192 17L216 12L240 4" />
            </svg>
            <p className="tr-dash-bron" translate="no">odoo · meta · website</p>
          </div>
        </Beeld>
        <Pil to="/het-os">Ontdek je OS</Pil>
      </Tegel>
      <Tegel kop="Jouw richting" breed={4} soort="groen">
        <p className="sn-tegel-titel">Jouw volgende stap.</p>
        <Beeld>
          <ol className="tr-stappen">
            <li className="is-klaar"><span>01</span>Gratis OS en website<Check size={14} /></li>
            <li className="is-klaar"><span>02</span>Odoo en je kanalen gekoppeld<Check size={14} /></li>
            <li className="is-nu"><span>03</span>Jouw OS op maat<em>gesprek</em></li>
          </ol>
          <div className="tr-met">
            {marinus && <img {...klein(marinus.image, 36)} alt="" width="36" height="36" loading="lazy" />}
            <span>Met Marinus, founder</span>
          </div>
        </Beeld>
        <Pil to="/contact?onderwerp=Custom%20OS">Bespreek jouw inrichting</Pil>
      </Tegel>
    </Bento>
  );
}
