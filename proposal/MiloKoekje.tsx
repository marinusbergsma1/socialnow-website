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
  const gesloten = React.useRef(false);

  // Eén keer sluiten, of dat nu via Smakelijk, de lopende lijn of de timer gaat.
  const sluit = () => {
    if (gesloten.current) return;
    gesloten.current = true;
    try { window.localStorage.setItem(SLEUTEL, "1"); } catch { /* privévenster: dan komt hij volgende keer terug */ }
    setWeg(true);
    window.setTimeout(() => setOpen(false), 760);
  };

  useEffect(() => {
    if (gezien()) return;
    try { setRustig(window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch { /* oude browser */ }
    const t = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  // Minder beweging: geen lopende lijn, dan sluit een gewone timer na 5 seconden.
  useEffect(() => {
    if (!open || !rustig || weg) return;
    const t = window.setTimeout(sluit, 5000);
    return () => window.clearTimeout(t);
  }, [open, rustig, weg]);

  if (!open) return null;

  return (
    <aside className={`h-koekje${weg ? " is-weg" : ""}`} role="region" aria-labelledby="h-koekje-titel">
      <div className="h-koekje-milo" aria-hidden="true">
        <img src={rustig ? "/proposal/milo/milo-koekje.webp" : "/proposal/milo/milo-koekje-anim.webp"} alt="" width={240} height={240} decoding="async" />
      </div>
      <p className="h-koekje-titel" id="h-koekje-titel">Geen trackingcookies<span>.</span></p>
      {/* 30 september 2026 (Marinus): "Milo ate them all. Mag er altijd in elke taal wel staan." en daarna "En Milo ate them all.
          But we don't need them. Our results speak for themself!" (hier als "themselves"). In elke taal Engels. */}
      <p className="h-koekje-uitleg" translate="no">Milo ate them all. But we don&rsquo;t need them. Our results speak for themselves!</p>
      {/* 30 september 2026 (Marinus): "laat ook met een mooie outro weggaan automatisch na 5 seconden". De lijn loopt in 5 s leeg
          en sluit dan; hij pauzeert zolang je erop staat of er met het toetsenbord in zit. */}
      {!rustig && <i className="h-koekje-tijd" aria-hidden="true" onAnimationEnd={sluit} />}
      <div className="h-koekje-acties">
        <button type="button" className="h-koekje-knop" onClick={sluit}>Smakelijk</button>
        <Link className="h-koekje-link" to="/cookies">Cookieverklaring</Link>
      </div>
    </aside>
  );
}
