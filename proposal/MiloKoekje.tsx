import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./milo-koekje.css";

// Cookiemelding met Milo die een koekje eet — 30 september 2026.
//
// Dit is geen toestemmingsvraag. Socialnow.nl plaatst geen trackingcookies en laadt geen
// PostHog (dat draait alleen in het OS op app.socialnow.nl, met een eigen toestemmingsregel;
// zie Cookiebot.tsx en de cookieverklaring). Er valt hier dus niets te weigeren. De melding
// zegt dat eerlijk en met een knipoog, en verdwijnt na één klik. Die klik wordt onthouden in
// localStorage onder sn-koekje; dat is noodzakelijke opslag (anders komt de melding elke pagina
// terug) en staat in de cookieverklaring.
//
// Milo is een bewegend WebP-beeld en geen <video>: de video bleef in de browser zwart, een
// beeld heeft dat probleem niet.
const SLEUTEL = "sn-koekje";

function gezien(): boolean {
  try { return window.localStorage.getItem(SLEUTEL) === "1"; } catch { return false; }
}

export default function MiloKoekje() {
  const [open, setOpen] = useState(false);
  const [weg, setWeg] = useState(false);
  const [rustig, setRustig] = useState(false);

  useEffect(() => {
    if (gezien()) return;
    try { setRustig(window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch { /* oude browser */ }
    const t = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  if (!open) return null;

  const sluit = () => {
    try { window.localStorage.setItem(SLEUTEL, "1"); } catch { /* privévenster: dan komt hij volgende keer terug */ }
    setWeg(true);
    window.setTimeout(() => setOpen(false), 420);
  };

  return (
    <aside className={`h-koekje${weg ? " is-weg" : ""}`} role="region" aria-labelledby="h-koekje-titel">
      <div className="h-koekje-milo" aria-hidden="true">
        <img src={rustig ? "/proposal/milo/milo-koekje.webp" : "/proposal/milo/milo-koekje-anim.webp"} alt="" width={240} height={240} decoding="async" />
      </div>
      <p className="h-koekje-titel" id="h-koekje-titel">Geen trackingcookies<span>.</span></p>
      <p className="h-koekje-uitleg">Milo heeft ze allemaal opgegeten.</p>
      <div className="h-koekje-acties">
        <button type="button" className="h-koekje-knop" onClick={sluit}>Smakelijk</button>
        <Link className="h-koekje-link" to="/cookies">Cookieverklaring</Link>
      </div>
    </aside>
  );
}
