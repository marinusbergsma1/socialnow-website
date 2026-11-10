import React from "react";
import { Mail, Phone } from "lucide-react";
import { CONTACTEN } from "./contacten";
import TeamCallTile from "./TeamCallTile";
import { people } from "./content";
import { klein } from "./licht";
import "./contact-slot.css";

// Slot van de homepage, 4 november 2026. MARINUS over het oude slot (Start gratis met jouw systeem): "Hier focussen op een formulier
// of contactgegevens van Steef en Michelle en Ben." en daarna "Doe maar contactgegevens met functies dat ziet er wel zakelijk uit."
// Naam en functie komen uit content.ts. Later die dag: "Doe maar gewoon de contactile van mij met info@socialnow.nl met 06 nummer dan
// Steef met Finance@socialnow.nl, Michelle mag Partners@socialnow.nl zijn en Ben Odoo@socialnow.nl. Zonder gesprek inplannen, ze
// kunnen wel gewoon een mail sturen of bellen." en "Zoek op whatsapp even hun 06 nummer op." Het nummer van Marinus staat in zijn
// mailhandtekening (MAIL.html, 28 oktober), dat van Steef in WhatsApp. Van Michelle en Ben toont WhatsApp geen nummer, dus nog niet.
export default function ContactSlot() {
  return <section className="sn-contactslot" id="contact" tabIndex={-1} aria-labelledby="contactslot-kop">
    <p className="sn-contactslot-label"><i />Contact</p>
    <h2 id="contactslot-kop">Neem contact met ons op.</h2>
    <ul>
      {CONTACTEN.map((c) => {
        const p = people.find((x) => x.name === c.naam);
        if (!p) return null;
        return <li key={c.naam}>
          <img {...klein(p.image, "96px", [160, 320])} alt="" width="96" height="96" loading="lazy" />
          <div>
            <strong translate="no">{p.name}</strong>
            <span>{p.role}</span>
            <a href={`mailto:${c.mail}`}><Mail size={15} aria-hidden="true" /><span translate="no">{c.mail}</span></a>
            {c.tel && <a href={`tel:${c.tel}`}><Phone size={15} aria-hidden="true" /><span translate="no">{c.telTekst}</span></a>}
          </div>
        </li>;
      })}
    </ul>
    <TeamCallTile toonTeamlink />
  </section>;
}
