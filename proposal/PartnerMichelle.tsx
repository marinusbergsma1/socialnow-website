import React from "react";
import { Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "./i18n/context";
import "./site-visie.css";

// 28 september 2026 (Marinus, het verhaal): "Ben je Odoo-implementatiepartner? Bespreek met Michelle Yang wat het OS
// voor jouw klanten kan betekenen, net als de partners die je voorgingen." Dezelfde zinnen als de partnerdeur op de
// homepage (Deuren.tsx), zodat de site één verhaal vertelt. michelle@socialnow.nl bestaat nog niet; tot die er is gaat
// de mail naar info@ t.a.v. Michelle.
const WHATSAPP = "https://wa.me/31637404577?text=";
const MAIL = "mailto:info@socialnow.nl?subject=";

export default function PartnerMichelle() {
  const { t } = useLanguage();
  const bericht = t("Hoi Michelle, ik ben Odoo-implementatiepartner en wil graag bespreken wat SocialNow OS voor onze klanten kan betekenen.");
  const onderwerp = t("Odoo-implementatiepartner, t.a.v. Michelle Yang");
  return (
    <section className="h-section h-wrap h-partner-michelle" id="partners" aria-labelledby="partner-michelle-titel">
      <div className="h-partner-kaart">
        <img src="/images/Michelle-Yang-HD.webp" alt="Michelle Yang" width="120" height="120" loading="lazy" />
        <div>
          <p className="h-eyebrow">Ben je Odoo-implementatiepartner?</p>
          <h2 id="partner-michelle-titel">Praat met Michelle.</h2>
          <p className="h-partner-tekst">Bespreek wat het OS voor jouw klanten kan betekenen, net als de partners die je voorgingen.</p>
          <div className="h-partner-acties">
            <a className="sn-btn3d h-button h-try-button" href={WHATSAPP + encodeURIComponent(bericht)} target="_blank" rel="noopener noreferrer">
              <span className="sn-btn3d-sheen" />
              <MessageCircle size={17} aria-hidden="true" />
              <span>Stuur een WhatsApp</span>
            </a>
            <a className="h-text-link" href={MAIL + encodeURIComponent(onderwerp)}>
              <Mail size={16} aria-hidden="true" />
              Mail Michelle
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
