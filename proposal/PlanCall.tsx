import React, { Suspense, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { later } from "./later";
import "./plan-call.css";

// 18 oktober 2026 (Marinus): "Plan een call voor custom OS" in de hero. De knop en de host zitten in het eerste script;
// het paneel zelf (PlanCallPaneel.tsx) laadt pas bij de eerste klik, samen met de rest van het woordenboek.
// Openen kan ook van buitenaf, bijvoorbeeld vanuit de custom OS configurator in het OS:
//   https://socialnow.nl/?call=custom-os&onderdelen=website,crm&budget=10-20&bedrijf=Naam#plan-een-call
// onderdelen: website, crm, content, ads, studio, agents, koppelingen, dashboard, app; budget: 10-20, 20-50, 50-plus, onbekend.
export type CallVoorinvulling = { bedrijf?: string; onderdelen?: string[]; budget?: string };
export const PLAN_CALL_ANKER = "plan-een-call";
const OPEN = "sn-plan-call";
export function openPlanCall(voor: CallVoorinvulling = {}) { window.dispatchEvent(new CustomEvent<CallVoorinvulling>(OPEN, { detail: voor })); }

const Paneel = later(() => import("./PlanCallPaneel").then((m) => m.default));

function uitAdres(zoek: URLSearchParams): CallVoorinvulling {
  const lijst = (zoek.get("onderdelen") || "").split(",").map((d) => d.trim()).filter(Boolean);
  return { bedrijf: zoek.get("bedrijf")?.slice(0, 120) || undefined, onderdelen: lijst.length ? lijst : undefined, budget: zoek.get("budget") || undefined };
}

export function PlanCallKnop({ className = "pill", label = "Plan een call voor custom OS" }: { className?: string; label?: string }) {
  return <button type="button" className={className} aria-haspopup="dialog" onClick={() => openPlanCall()}><span>{label}</span><span className="arrow"><ArrowUpRight size={17} /></span></button>;
}

export function PlanCallHost() {
  const [voor, zetVoor] = useState<CallVoorinvulling | null>(null);
  useEffect(() => {
    const open = (e: Event) => zetVoor((e as CustomEvent<CallVoorinvulling>).detail || {});
    window.addEventListener(OPEN, open);
    const zoek = new URLSearchParams(window.location.search);
    if (window.location.hash === `#${PLAN_CALL_ANKER}` || zoek.get("call") === "custom-os") zetVoor(uitAdres(zoek));
    return () => window.removeEventListener(OPEN, open);
  }, []);
  if (!voor) return null;
  const sluit = () => {
    zetVoor(null);
    if (window.location.hash === `#${PLAN_CALL_ANKER}`) history.replaceState(history.state, "", window.location.pathname + window.location.search);
  };
  return <Suspense fallback={null}><Paneel voor={voor} sluit={sluit} /></Suspense>;
}
