import React, { useEffect, useId, useState } from "react";
import { ArrowRight, Download, Star } from "lucide-react";

export const CLAIM_URL = "https://app.socialnow.nl/login/?bron=site";
export const INSTALL_URL = "https://app.socialnow.nl/?bron=installatie";
export const REVIEWS_URL = "https://maps.google.com/?cid=1427063718057754123";
export type OsStand =
  | { mode: "demo"; customOs: number; demos: number }
  | { mode: "live"; total: number };

export function parseOsStand(value: unknown): OsStand | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const count = (n: unknown): n is number =>
    typeof n === "number" && Number.isSafeInteger(n) && n >= 0;
  if (data.ok !== true) return null;
  if (
    data.demo === true &&
    data.live !== true &&
    count(data.customOs) &&
    count(data.demos)
  ) {
    return { mode: "demo", customOs: data.customOs, demos: data.demos };
  }
  if (data.live === true && data.demo !== true && count(data.total)) {
    return { mode: "live", total: data.total };
  }
  return null;
}

export function installationHint(
  ua: string,
  platform: string,
  touchPoints: number,
): string {
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (platform === "MacIntel" && touchPoints > 1)
  ) {
    return "Open het OS in Safari. Tik op Deel en kies ‘Zet op beginscherm’.";
  }
  if (
    /Macintosh/.test(ua) &&
    /Safari/.test(ua) &&
    !/Chrome|Chromium|Edg|OPR/.test(ua)
  ) {
    return "Open het OS in Safari. Kies Archief en ‘Voeg toe aan Dock’, als je Safari-versie dat ondersteunt.";
  }
  return "Open het OS. Kies ‘App installeren’ in het browsermenu als die optie beschikbaar is. Je kunt het OS ook gewoon in je browser gebruiken.";
}

export function OsProof({ stand }: { stand: OsStand | null }) {
  return (
    <div className="os-proof">
      {stand ? (
        <>
          <p className="os-count">
            {stand.mode === "demo" ? (
              <>
                <strong>Demostand</strong>
                <span>{stand.customOs.toLocaleString("nl-NL")} Custom OS</span>
                <span>{stand.demos.toLocaleString("nl-NL")} OS in demo</span>
              </>
            ) : (
              <span>
                <strong>{stand.total.toLocaleString("nl-NL")}</strong>{" "}
                OS-werkruimten aangemaakt
              </span>
            )}
          </p>
          {stand.mode === "demo" && (
            <p className="os-demo-note">Democijfers, geen klantgroei.</p>
          )}
        </>
      ) : (
        <p className="os-demo-note">OS-teller tijdelijk niet beschikbaar.</p>
      )}
      <a
        className="os-reviews"
        href={REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Star size={14} aria-hidden="true" /> Klantreacties op Google{" "}
        <span className="sr-only">(opent een nieuw tabblad)</span>
      </a>
    </div>
  );
}

export default function OsEntry() {
  const [stand, setStand] = useState<OsStand | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [hint, setHint] = useState("");
  const helpId = useId();

  useEffect(() => {
    const controller = new AbortController();
    let busy = false;
    const load = async () => {
      if (document.hidden || busy) return;
      busy = true;
      try {
        const response = await fetch("https://app.socialnow.nl/api/os-aantal", {
          signal: controller.signal,
          credentials: "omit",
        });
        const next = response.ok ? parseOsStand(await response.json()) : null;
        if (!controller.signal.aborted) setStand(next);
      } catch {
        if (!controller.signal.aborted) setStand(null);
      } finally {
        busy = false;
        if (!controller.signal.aborted) setLoaded(true);
      }
    };
    void load();
    const timer = window.setInterval(load, 30000);
    document.addEventListener("visibilitychange", load);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  const toggle = () => {
    setHint(
      installationHint(
        navigator.userAgent,
        navigator.platform,
        navigator.maxTouchPoints,
      ),
    );
    setInstallOpen((value) => !value);
  };

  return (
    <div className="os-entry">
      {loaded ? (
        <OsProof stand={stand} />
      ) : (
        <div className="os-proof">
          <p className="os-demo-note">OS-teller laden…</p>
        </div>
      )}
      <div className="os-actions">
        <a className="os-claim sn-btn3d h-button" href={CLAIM_URL}>
          <span className="sn-btn3d-sheen" />
          <span>Probeer de POC</span>
          <span className="h-button-icon">
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </a>
        <button
          type="button"
          className="os-install sn-btn3d h-button h-button-secondary"
          onClick={toggle}
          aria-expanded={installOpen}
          aria-controls={helpId}
        >
          <span className="sn-btn3d-sheen" />
          <Download size={16} aria-hidden="true" />
          <span>Installeer OS</span>
        </button>
      </div>
      <div className="install-help" id={helpId} hidden={!installOpen}>
        <p>{hint}</p>
        <a href={INSTALL_URL}>
          Open SocialNow OS <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
