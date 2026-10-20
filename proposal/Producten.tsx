import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { openPlanCall } from "./PlanCall";
import "./hoofdmenu.css";

// 18 oktober 2026 (Marinus, via de coordinator): hoofdnavigatie Producten, Diensten, Resultaten, Prijzen, Team, met rechts
// Plan een call en Inloggen gratis OS. Producten opent een klein menu met de twee producten; Blog en Contact staan in de
// voettekst. Alle oude routes blijven bestaan.
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

export function ProductenMenu() {
  const [open, zetOpen] = useState(false);
  const plek = useRef<HTMLDivElement>(null);
  const knop = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const actief = Boolean(useMatch("/het-os/*"));
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
  return <div className={`h-producten${open ? " open" : ""}`} ref={plek} onPointerEnter={muis(true)} onPointerLeave={muis(false)}>
    <button ref={knop} type="button" className={`h-producten-knop${actief ? " active" : ""}`} aria-expanded={open} aria-controls="h-producten-menu" onClick={() => zetOpen((v) => (viaMuis.current ? true : !v))}>
      <span>Producten</span><ChevronDown size={14} aria-hidden="true" />
    </button>
    <div id="h-producten-menu" className="h-producten-menu" hidden={!open}>
      {PRODUCTEN.map((p) => {
        const inhoud = <><b translate="no">SocialNow <i className={p.soort}>{p.naam}</i></b><span>{p.regel}</span><ArrowUpRight size={16} aria-hidden="true" /></>;
        return "naar" in p
          ? <Link key={p.soort} to={p.naar} onClick={() => zetOpen(false)}>{inhoud}</Link>
          : <a key={p.soort} href={p.href}>{inhoud}</a>;
      })}
    </div>
  </div>;
}

export function HeaderCall() {
  return <button type="button" className="h-header-call" aria-haspopup="dialog" onClick={() => openPlanCall()}>
    <span>Plan een call</span><ArrowUpRight size={15} aria-hidden="true" />
  </button>;
}
