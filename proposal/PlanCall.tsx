import React, { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { later } from "./later";
import "./plan-call.css";

// 18 oktober 2026 (Marinus): "Plan een call voor custom OS" in de hero. De knop en de host zitten in het eerste script;
// het paneel zelf (PlanCallPaneel.tsx) laadt pas bij de eerste klik, samen met de rest van het woordenboek.
// Openen kan ook van buitenaf, bijvoorbeeld vanuit de custom OS configurator in het OS:
//   https://socialnow.nl/?call=custom-os&onderdelen=website,crm&budget=10-20&bedrijf=Naam#plan-een-call
// onderdelen: website, crm, content, ads, studio, agents, koppelingen, dashboard, app; budget: 10-20, 20-50, 50-plus, onbekend.
// Vanuit de custom OS configurator (18 oktober 2026, sessie os-custom): /?bron=os&onderwerp=custom-os&ref=<uuid>#plan-een-call.
// bron=os en een geldige uuid in ref gaan mee in het bericht aan het team; onbekende waarden vallen weg. Het paneel staat
// sitebreed (WebsiteProposal.tsx), dus #plan-een-call werkt op elke pagina.
export type CallVoorinvulling = { bedrijf?: string; onderdelen?: string[]; budget?: string; bron?: "os"; ref?: string };
export const PLAN_CALL_ANKER = "plan-een-call";
const OPEN = "sn-plan-call";
export function openPlanCall(voor: CallVoorinvulling = {}) { window.dispatchEvent(new CustomEvent<CallVoorinvulling>(OPEN, { detail: voor })); }

const Paneel = later(() => import("./PlanCallPaneel").then((m) => m.default));

function uitAdres(zoek: URLSearchParams): CallVoorinvulling {
  const lijst = (zoek.get("onderdelen") || "").split(",").map((d) => d.trim()).filter(Boolean);
  const ref = zoek.get("ref") || "";
  return {
    bedrijf: zoek.get("bedrijf")?.slice(0, 120) || undefined,
    onderdelen: lijst.length ? lijst : undefined,
    budget: zoek.get("budget") || undefined,
    bron: zoek.get("bron") === "os" ? "os" : undefined,
    ref: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ref) ? ref.toLowerCase() : undefined,
  };
}
const vanuitAdres = (zoek: URLSearchParams, hash: string) =>
  hash === `#${PLAN_CALL_ANKER}` || zoek.get("call") === "custom-os" || zoek.get("onderwerp") === "custom-os";

export function PlanCallKnop({ className = "pill", label = "Plan een call voor custom OS" }: { className?: string; label?: string }) {
  return <button type="button" className={className} aria-haspopup="dialog" onClick={() => openPlanCall()}><span>{label}</span><span className="arrow"><ArrowUpRight size={17} /></span></button>;
}

export function PlanCallHost() {
  const [voor, zetVoor] = useState<CallVoorinvulling | null>(null);
  const { search, hash } = useLocation();
  useEffect(() => {
    const open = (e: Event) => zetVoor((e as CustomEvent<CallVoorinvulling>).detail || {});
    window.addEventListener(OPEN, open);
    return () => window.removeEventListener(OPEN, open);
  }, []);
  useEffect(() => {
    const zoek = new URLSearchParams(search);
    if (vanuitAdres(zoek, hash)) zetVoor((oud) => oud ?? uitAdres(zoek));
  }, [search, hash]);
  if (!voor) return null;
  const sluit = () => {
    zetVoor(null);
    if (window.location.hash === `#${PLAN_CALL_ANKER}`) history.replaceState(history.state, "", window.location.pathname + window.location.search);
  };
  return <Suspense fallback={null}><Paneel voor={voor} sluit={sluit} /></Suspense>;
}
