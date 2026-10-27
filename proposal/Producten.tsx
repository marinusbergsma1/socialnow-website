import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useMatch } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react";
import { useLanguage } from "./i18n/context";
import "./hoofdmenu.css";

// 18 oktober 2026 (Marinus, via de coordinator): hoofdnavigatie Producten, Diensten, Resultaten, Prijzen, Team, met rechts
// Plan een call en Inloggen gratis OS. Producten opent een klein menu met de twee producten; Blog en Contact staan in de
// voettekst. Alle oude routes blijven bestaan. Sinds 22 oktober 2026 opent ook Diensten zo'n menu (DienstenMenu).
export const NAV_LINKS: Array<[string, string]> = [
  ["/diensten", "Diensten"],
  ["/projecten", "Resultaten"],
  ["/team", "Team"],
];
// href in plaats van to: Connect is een eigen pagina buiten de app.
export const PRODUCTEN = [
  { naar: "/het-os", naam: "OS", regel: "AI-powered management & operations.", soort: "os" },
  { href: "/connect/", naam: "Connect", regel: "De juiste experts voor jouw bedrijf.", soort: "connect" },
] as const;

// 22 oktober 2026 (Marinus): "Diensten" krijgt hetzelfde uitklapmenu als Producten, omdat dat het verhaal duidelijker maakt.
// Alleen wat /diensten al zegt (Pricing.tsx en ConnectExperts.tsx), en elke kaart wijst naar een anker dat daar al staat.
// Kleur alleen waar het over OS (groen) of Connect (blauw) gaat; Kleurwoord kleurt die woorden na het vertalen.
export const DIENSTEN = [
  { naar: "/diensten#prijs-os-titel", titel: "OS-pakketten", regel: "Begin gratis. Betaal pas als je team groeit.", soort: "os" },
  { naar: "/diensten#prijs-connect-titel", titel: "Connect-pakketten", regel: "Wij doen het werk, met échte mensen.", soort: "connect" },
  { naar: "/diensten#prijs-los-titel", titel: "Liever één ding?", regel: "Een website of alleen je eigen systeem, voor een vaste prijs vooraf.", soort: "los" },
  { naar: "/diensten#team", titel: "Vind je expert", regel: "Zoek, vergelijk en kies zelf.", soort: "team" },
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
    {(sluit) => DIENSTEN.map((d) => <Link key={d.soort} to={d.naar} onClick={sluit}>
      <b translate="no"><Kleurwoord tekst={d.titel} /></b><span>{d.regel}</span><ArrowUpRight size={16} aria-hidden="true" />
    </Link>)}
  </Uitklapmenu>;
}

// 22 oktober 2026 (Marinus, via de regie): Security wordt een hoofdpunt in het menu, rustig: een klein groen schildje,
// geen pil. In elke taal "Security". De pagina /security bouwt de sessie check-fix; /check gaat er met 308 naartoe.
export const SECURITY_PAD = "/security";
export function SecurityLink({ mobiel = false, onClick }: { mobiel?: boolean; onClick?: () => void }) {
  return <NavLink to={SECURITY_PAD} className={mobiel ? "h-security h-security-mobiel" : "h-security"} onClick={onClick}>
    <ShieldCheck size={mobiel ? 18 : 14} aria-hidden="true" /><span translate="no">Security</span>{mobiel && <ArrowUpRight size={17} aria-hidden="true" />}
  </NavLink>;
}

