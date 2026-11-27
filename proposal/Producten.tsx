import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useMatch } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useLanguage } from "./i18n/context";
import "./hoofdmenu.css";

// 18 oktober 2026 (Marinus, via de coordinator): hoofdnavigatie Producten, Diensten, Resultaten, Prijzen, Team, met rechts
// Plan een call en Inloggen gratis OS. Producten opent een klein menu met de twee producten; Blog en Contact staan in de
// voettekst. Alle oude routes blijven bestaan. Sinds 22 oktober 2026 opent ook Diensten zo'n menu (DienstenMenu).
// 4 november 2026 (Marinus): "verder wil ik producten diensten en website actie". Het menu is Producten, Diensten en Website-actie;
// Resultaten en Team staan in de footer (Ons werk, Ons team).
// 12 november 2026 (Marinus): "Hier wil ik graag nog even team". Team staat in het menu na Website-actie.
// 25 november 2026 (Marinus): "liever gewoon even alleen client cases en contact en website actie zien. Diensten mag dus wel als
// mooie hover en duidelijk de verschillende onderdelen maar zowel in de footer als header kom je bij contact". Het menu is nu
// Client Cases, Diensten (uitklapmenu), Website-actie, Team en Contact. Het team staat ook groot op /contact.
// Later die dag (Marinus, bij het menu): "Ik mis hier team." Team staat weer tussen Website-actie en Contact.
export const NAV_LINKS: Array<[string, string]> = [
  ["/diensten", "Diensten"],
  ["/team", "Team"],
  ["/contact", "Contact"],
];
// href in plaats van to: Connect is een eigen pagina buiten de app.
export const PRODUCTEN = [
  { naar: "/het-os", naam: "OS", regel: "AI-powered management & operations.", soort: "os" },
  { href: "/connect/", naam: "Connect", regel: "De juiste experts voor jouw bedrijf.", soort: "connect" },
] as const;

// Eén bron voor het Diensten-menu, de footer en de inhoudsopgave op /diensten.
// `naar` is het anker op /diensten (inhoudsopgave daar); menu en footer gebruiken sinds 25 november 2026 `contact`: alles is
// maatwerk, dus elke dienst opent /contact met dat onderwerp al gekozen (ContactNieuw.tsx).
export const DIENSTEN = [
  { naar: "/diensten#management-operations", contact: "/contact?onderwerp=management-operations", titel: "Management & Operations", regel: "Meer grip op je processen, systemen en cijfers.", soort: "management-operations" },
  { naar: "/diensten#groei", contact: "/contact?onderwerp=groei", titel: "Groei", regel: "Persoonlijk advies en marketing die leads oplevert.", soort: "groei" },
  { naar: "/diensten#websites", contact: "/contact?onderwerp=websites", titel: "Websites", regel: "Een website die past bij je merk en aanvragen oplevert.", soort: "websites" },
  { naar: "/diensten#cybersecurity", contact: "/contact?onderwerp=cybersecurity", titel: "Cybersecurity", regel: "Vind kwetsbaarheden en pak de belangrijkste aan.", soort: "cybersecurity" },
] as const;

export function Kleurwoord({ tekst }: { tekst: string }) {
  const { t } = useLanguage();
  return <>{t(tekst).split(/\b(OS|Connect)\b/).map((deel, i) => (deel === "OS" || deel === "Connect" ? <i key={i} className={deel.toLowerCase()}>{deel}</i> : deel))}</>;
}

// Eén uitklapmenu voor Producten en Diensten: zelfde opmaak (de klassen h-producten*), animatie, toetsen en focus.
function Uitklapmenu({ naam, label, actief, children }: { naam: string; label: string; actief: boolean; children: (sluit: () => void) => React.ReactNode }) {
  const [open, zetOpen] = useState(false);
  const plek = useRef<HTMLDivElement>(null);
  const knop = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => zetOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const buiten = (e: PointerEvent) => { if (!plek.current?.contains(e.target as Node)) zetOpen(false); };
    const toets = (e: KeyboardEvent) => { if (e.key === "Escape") { zetOpen(false); knop.current?.focus(); } };
    document.addEventListener("pointerdown", buiten);
    window.addEventListener("keydown", toets);
    return () => { document.removeEventListener("pointerdown", buiten); window.removeEventListener("keydown", toets); };
  }, [open]);
  // Met de muis opent het menu al bij aanwijzen; de klik die daarop volgt mag het dan niet meteen weer sluiten.
  const viaMuis = useRef(false);
  const muis = (waarde: boolean) => (e: React.PointerEvent) => { if (e.pointerType === "mouse") { viaMuis.current = waarde; zetOpen(waarde); } };
  const menuId = `h-${naam}-menu`;
  return <div className={`h-producten h-uitklap-${naam}${open ? " open" : ""}`} ref={plek} onPointerEnter={muis(true)} onPointerLeave={muis(false)}>
    <button ref={knop} type="button" className={`h-producten-knop${actief ? " active" : ""}`} aria-expanded={open} aria-controls={menuId} onClick={() => zetOpen((v) => (viaMuis.current ? true : !v))}>
      <span>{label}</span><ChevronDown size={14} aria-hidden="true" />
    </button>
    <div id={menuId} className="h-producten-menu" hidden={!open}>
      {children(() => zetOpen(false))}
    </div>
  </div>;
}

export function ProductenMenu() {
  const actief = Boolean(useMatch("/het-os/*"));
  return <Uitklapmenu naam="producten" label="Producten" actief={actief}>
    {(sluit) => PRODUCTEN.map((p) => {
      const inhoud = <><b translate="no">SocialNow <i className={p.soort}>{p.naam}</i></b><span>{p.regel}</span><ArrowUpRight size={16} aria-hidden="true" /></>;
      return "naar" in p
        ? <Link key={p.soort} to={p.naar} onClick={sluit}>{inhoud}</Link>
        : <a key={p.soort} href={p.href}>{inhoud}</a>;
    })}
  </Uitklapmenu>;
}

export function DienstenMenu() {
  const actief = Boolean(useMatch("/diensten/*"));
  return <Uitklapmenu naam="diensten" label="Diensten" actief={actief}>
    {(sluit) => <>
      {DIENSTEN.map((d) => <Link key={d.soort} to={d.contact} onClick={sluit}>
        <b>{d.titel}</b><span>{d.regel}</span><ArrowUpRight size={16} aria-hidden="true" />
      </Link>)}
      <p className="h-diensten-maatwerk"><span>Alles is maatwerk. Je krijgt vooraf een voorstel met een vaste prijs.</span><Link to="/contact" onClick={sluit}>Neem contact op</Link></p>
    </>}
  </Uitklapmenu>;
}

// 22 oktober 2026 (Marinus, via de regie): Security wordt een hoofdpunt in het menu, rustig: een klein groen schildje,
// geen pil. In elke taal "Security". De pagina /security bouwt de sessie check-fix; /check gaat er met 308 naartoe.
// 27 oktober 2026 (Marinus): het menu-item heet "Demo & Scan": websitedemo en securityscan staan samen op /security.
export const SECURITY_PAD = "/security";
// 4 november 2026 (Marinus): "producten diensten en website actie", "meer focus op die websites" en "Nadruk op veiligheidsscan kan
// misschien wel veel kleiner." Het menu-item heet Website-actie en gaat naar de gratis website (/gratis-website), zonder schildje;
// /security blijft bereikbaar via de footer en de pagina zelf.
// 26 november 2026 (Black Friday campagne, BRIEF.md): het menu-item Website-actie heet nu Black Friday Deal, zelfde pagina.
export const WEBSITE_ACTIE_PAD = "/black-friday";   // 27 nov (Marinus): het adres heet nu /black-friday
export function SecurityLink({ mobiel = false, onClick }: { mobiel?: boolean; onClick?: () => void }) {
  return <NavLink to={WEBSITE_ACTIE_PAD} className={mobiel ? "h-security h-security-mobiel" : "h-security"} onClick={onClick}>
    <span>Black Friday Deal</span>{mobiel && <ArrowUpRight size={17} aria-hidden="true" />}
  </NavLink>;
}

