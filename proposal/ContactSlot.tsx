import React from "react";
import { Linkedin, Mail } from "lucide-react";
import { people } from "./content";
import { klein } from "./licht";
import "./contact-slot.css";

// Slot van de homepage, 4 november 2026. MARINUS over het oude slot (Start gratis met jouw systeem): "Hier focussen op een formulier
// of contactgegevens van Steef en Michelle en Ben." en daarna "Doe maar contactgegevens met functies dat ziet er wel zakelijk uit."
// Naam, functie en rol komen uit content.ts. Alleen adressen die echt bestaan: steef@ is het algemene contactadres (aanvragen.ts),
// michelle@ staat in de mailfooter (MAIL.html, 28 oktober). Voor Ben is nog geen adres bekend, dus bij hem LinkedIn.
// Daarna: "Misschien mij nog erbij". Marinus voorop, met info@, het adres dat hij zelf leest.
export const CONTACTEN: readonly { naam: string; mail?: string }[] = [
  { naam: "Marinus Bergsma", mail: "info@socialnow.nl" },
  { naam: "Steef Komen", mail: "steef@socialnow.nl" },
  { naam: "Michelle Yang", mail: "michelle@socialnow.nl" },
  { naam: "Ben Sterckx" },
];

export default function ContactSlot() {
  return <section className="sn-contactslot" aria-labelledby="contactslot-kop">
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
            {c.mail
              ? <a href={`mailto:${c.mail}`}><Mail size={15} aria-hidden="true" /><span translate="no">{c.mail}</span></a>
              : p.linkedin && <a href={p.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15} aria-hidden="true" /><span>LinkedIn</span></a>}
          </div>
        </li>;
      })}
    </ul>
  </section>;
}
