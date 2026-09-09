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

export function installationLabel(ua: string, platform: string, touchPoints: number): string {
  if (/iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && touchPoints > 1)) return "Installeer op iPhone of iPad";
  if (/Macintosh|Mac OS X/.test(ua)) return "Installeer op Mac";
  if (/Windows/.test(ua)) return "Installeer op Windows";
  if (/Android/.test(ua)) return "Installeer op Android";
  return "Installeer het OS";
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

function AppleLogo() {
  return (
    <svg className="os-install-apple" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function OsProof({ stand }: { stand: OsStand | null }) {
  return (
    <div className="os-proof">
      {stand?.mode === "live" && <p className="os-count"><span><strong>{stand.total.toLocaleString("nl-NL")}</strong>{" "}OS-werkruimten aangemaakt</span></p>}
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

export default function OsEntry({showProof = true}:{showProof?:boolean}) {
  const [stand, setStand] = useState<OsStand | null>(null);
  const [installOpen, setInstallOpen] = useState(false);
  const [hint, setHint] = useState("");
  const helpId = useId();
  const [installLabel, setInstallLabel] = useState("Installeer het OS");
  useEffect(() => {
    setInstallLabel(installationLabel(navigator.userAgent, navigator.platform, navigator.maxTouchPoints));
  }, []);

  useEffect(() => {
    if (!showProof) return;
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
  }, [showProof]);

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
      <div className="os-actions">
        <a className="os-claim sn-btn3d h-button" href={CLAIM_URL}>
          <span className="sn-btn3d-sheen" />
          <span>Probeer het OS</span>
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
          <span>{installLabel}</span>
          {installLabel === "Installeer op Mac" && <AppleLogo />}
        </button>
      </div>
      <p className="os-product-note">In je browser of als app. Hetzelfde OS.</p>
      {showProof && <OsProof stand={stand} />}
      <div className="install-help" id={helpId} hidden={!installOpen}>
        <p>{hint}</p>
        <a href={INSTALL_URL}>
          Open SocialNow OS <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
