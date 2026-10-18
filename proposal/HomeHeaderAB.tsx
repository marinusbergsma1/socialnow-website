import React, { Suspense, lazy, useEffect, useState } from "react";
import HomeHeader from "./HomeHeader";
// Variant B pas laden als hij nodig is, zodat de eerste bundel niet groeit.
const HeaderBestaand = lazy(() => import("./HeaderBestaand"));
import { useLanguage } from "./i18n/context";

// A/B-test van de homepage-header, 17 oktober 2026. Uitleg: server/ab.mjs.
// Alleen op de Nederlandse homepage (/nl). Zonder antwoord van /api/ab (lokaal, of niet ingesteld)
// blijft het variant A en wordt er niets gemeten. Er wordt niets in de browser opgeslagen.

type Variant = "a" | "b";
type Antwoord = { variant: Variant; reden: string } | null;

let vraag: Promise<Antwoord> | null = null;
function haalVariant(taal: string) {
  if (!vraag) {
    const utm = new URLSearchParams(window.location.search).get("utm_campaign") || "";
    vraag = fetch(`/api/ab?taal=${encodeURIComponent(taal)}&utm=${encodeURIComponent(utm)}`, { cache: "no-store" })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return vraag;
}

function meet(gebeurtenis: "header_getoond" | "header_klik", variant: Variant, doel?: string) {
  const body = JSON.stringify({ gebeurtenis, variant, doel });
  if (navigator.sendBeacon?.("/api/ab", new Blob([body], { type: "application/json" }))) return;
  fetch("/api/ab", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

// Welke klik in variant A telt als welk doel.
// 18 oktober 2026 (integrator batch 2): de knoppen "Plan een call voor custom OS" zijn <button>s die een
// boekingspaneel openen (aria-haspopup="dialog"); die tellen als custom_os, anders vergelijkt de test scheef.
function doelA(el: HTMLElement): string | null {
  if (el instanceof HTMLButtonElement) return el.getAttribute("aria-haspopup") === "dialog" ? "custom_os" : null;
  const link = el as HTMLAnchorElement;
  if (link.href.includes("app.socialnow.nl")) return "gratis_os";
  if (link.href.includes("/connect")) return "connect";
  if (link.closest("#os-explainer")) return "explainer";
  return null;
}

export default function HomeHeaderAB() {
  const { language } = useLanguage();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [meten, setMeten] = useState(false);
  useEffect(() => {
    if (language !== "nl") return;
    // socialnow.nl/nl/?ab=b toont een variant om te bekijken; dat telt niet mee in de test.
    const bekijk = new URLSearchParams(window.location.search).get("ab");
    if (bekijk === "a" || bekijk === "b") return setVariant(bekijk);
    let weg = false;
    haalVariant(language).then(antwoord => {
      if (weg || !antwoord) return;
      const v: Variant = antwoord.variant === "b" ? "b" : "a";
      setVariant(v);
      setMeten(true);
      meet("header_getoond", v);
    });
    return () => { weg = true; };
  }, [language]);

  if (variant === "b") return <Suspense fallback={<HomeHeader />}><HeaderBestaand meet={doel => { if (meten) meet("header_klik", "b", doel); }} /></Suspense>;
  return (
    <div
      style={{ display: "contents" }}
      onClickCapture={e => {
        if (variant !== "a" || !meten) return;
        const el = (e.target as Element).closest<HTMLElement>('a, button[aria-haspopup="dialog"]');
        const doel = el && doelA(el);
        if (doel) meet("header_klik", "a", doel);
      }}
    >
      <HomeHeader />
    </div>
  );
}
