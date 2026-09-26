import React, { useEffect, useId, useState } from "react";
import { ArrowRight, Download, Star } from "lucide-react";
import { useLanguage } from "./i18n/context";

const taalPad = typeof window === "undefined" ? "" : (window.location.pathname.match(/^\/(nl|de|fr)(?=\/|$)/)?.[0] || "");
export const CLAIM_URL = `${taalPad}/gratis-os-demo/`;
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

// 26 september 2026 (Marinus): "downloaden als webapp, zoals eerst met Apple-logo" en "zet gewoon wat andere
// iconen erop". Grote knop voor dit apparaat, daarnaast kleine ronde knoppen voor de andere platformen.
const HINT_IPHONE = "Open het OS in Safari. Tik op Deel en kies ‘Zet op beginscherm’.";
const HINT_MAC = "Open het OS in Safari. Kies Archief en ‘Voeg toe aan Dock’, als je Safari-versie dat ondersteunt.";
const HINT_ALGEMEEN = "Open het OS. Kies ‘App installeren’ in het browsermenu als die optie beschikbaar is. Je kunt het OS ook gewoon in je browser gebruiken.";

function AndroidLogo() {
  return (
    <svg className="os-install-android" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.87 3.23a11.4 11.4 0 0 0-9.82 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
    </svg>
  );
}

export function InstallKnop() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [label, setLabel] = useState("Installeer het OS");
  const helpId = useId();
  useEffect(() => {
    setLabel(installationLabel(navigator.userAgent, navigator.platform, navigator.maxTouchPoints));
  }, []);
  const kies = (sleutel: string, tekst: string) => {
    if (open === sleutel) { setOpen(null); return; }
    setHint(tekst);
    setOpen(sleutel);
  };
  const eigen = () => kies("eigen", installationHint(navigator.userAgent, navigator.platform, navigator.maxTouchPoints));
  const andere = [
    { sleutel: "Installeer op Mac", icoon: <AppleLogo />, hint: HINT_MAC },
    { sleutel: "Installeer op iPhone of iPad", icoon: <svg className="os-install-telefoon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6.5" y="2" width="11" height="20" rx="2.6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>, hint: HINT_IPHONE },
    { sleutel: "Installeer op Windows", icoon: <WindowsLogo />, hint: HINT_ALGEMEEN },
    { sleutel: "Installeer op Android", icoon: <AndroidLogo />, hint: HINT_ALGEMEEN },
  ].filter((p) => p.sleutel !== label);
  return (
    <>
      <button type="button" className="os-install sn-btn3d h-button h-button-secondary h-install-knop" onClick={eigen} aria-expanded={open === "eigen"} aria-controls={helpId}>
        <span className="sn-btn3d-sheen" />
        {/Mac|iPhone/.test(label) ? <AppleLogo /> : /Windows/.test(label) ? <WindowsLogo /> : /Android/.test(label) ? <AndroidLogo /> : <Download size={16} aria-hidden="true" />}
        <span>{t(label)}</span>
      </button>
      <span className="h-install-andere">
        {andere.map((p) => (
          <button key={p.sleutel} type="button" className="h-install-icoon" onClick={() => kies(p.sleutel, p.hint)} aria-expanded={open === p.sleutel} aria-controls={helpId} aria-label={t(p.sleutel)} title={t(p.sleutel)}>
            {p.icoon}
          </button>
        ))}
      </span>
      <div className="install-help h-install-hulp" id={helpId} hidden={!open}>
        <p>{t(hint)}</p>
        <a href={INSTALL_URL}>
          {t("Open SocialNow OS")} <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

function WindowsLogo() {
  return (
    <svg className="os-install-windows" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M1 3.5 10 2.3v8.7H1zm10-1.3L23 .5V11H11zM1 12h9v8.7L1 19.5zm10 0h12v11.5l-12-1.7z" />
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
  const { t } = useLanguage();
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
          <span>{t("Vraag gratis OS-demo aan")}</span>
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
