import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, LockKeyhole, Sparkles, X } from "lucide-react";

const QR_KEY = "sn-qr-os-welcome-v1";
const LOGIN_URL = "https://app.socialnow.nl/login/?bron=beurs-qr";

function isQrVisit() {
  return new URLSearchParams(window.location.search).get("qr") === "os";
}

export default function QrOsWelcome({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"welcome" | "details">("welcome");
  const dialog = useRef<HTMLDialogElement>(null);
  const firstName = useId();
  const lastName = useId();
  const email = useId();
  const phone = useId();

  useEffect(() => {
    if (!ready || !isQrVisit()) return;
    setOpen(true);
  }, [ready]);
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem(QR_KEY, "seen"); } catch { /* no storage */ }
  };
  const continueToLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    /* The OS receives the actual workspace data only after authenticated sign-in.
       Never put contact data in a public URL. */
    try {
      sessionStorage.setItem(QR_KEY, "started");
      sessionStorage.setItem("sn-qr-os-name", `${values.get("firstName") || ""} ${values.get("lastName") || ""}`.trim());
    } catch { /* private mode */ }
    window.location.assign(LOGIN_URL);
  };
  return (
    <dialog className="qr-os-dialog" ref={dialog} onCancel={close} aria-labelledby="qr-os-title">
      <div className="qr-os-card">
        <button className="qr-os-close" type="button" onClick={close} aria-label="Close welcome"><X size={18} /></button>
        {step === "welcome" ? <>
          <div className="qr-os-orbits" aria-hidden="true"><i /><i /><i /></div>
          <div className="qr-os-kicker"><Sparkles size={14} /> SOCIALNOW OS</div>
          <h1 id="qr-os-title">Welcome to SocialNow.</h1>
          <p className="qr-os-lead">Are you here to explore the OS?</p>
          <div className="qr-os-actions">
            <button className="qr-os-primary" type="button" onClick={() => setStep("details")}>Yes, show me <ArrowRight size={17} /></button>
            <a className="qr-os-secondary" href="/">No, visit the website</a>
          </div>
        </> : <>
          <div className="qr-os-kicker"><Sparkles size={14} /> YOUR PERSONAL OS</div>
          <h1 id="qr-os-title">Nice to meet you.</h1>
          <p className="qr-os-lead">We will prepare your starting point. Sign in securely to continue.</p>
          <ul className="qr-os-list"><li><Check size={15} /> Your Odoo data, ready when you connect it</li><li><Check size={15} /> A brand and Studio made for your business</li><li><Check size={15} /> Your team, work and next steps in one place</li></ul>
          <form onSubmit={continueToLogin} className="qr-os-form">
            <div className="qr-os-grid"><label htmlFor={firstName}>First name<input id={firstName} name="firstName" autoComplete="given-name" required /></label><label htmlFor={lastName}>Last name<input id={lastName} name="lastName" autoComplete="family-name" required /></label></div>
            <label htmlFor={email}>Email address<input id={email} type="email" name="email" autoComplete="email" required /></label>
            <label htmlFor={phone}>Phone number<input id={phone} type="tel" name="phone" autoComplete="tel" required /></label>
            <label className="qr-os-consent"><input type="checkbox" required /><span>I agree that SocialNow may process my Odoo data after I connect it, to prepare and improve my personal OS environment. <a href="/privacy" target="_blank" rel="noreferrer">Privacy</a></span></label>
            <button className="qr-os-primary qr-os-try" type="submit">Try the OS <ArrowRight size={17} /></button>
            <p className="qr-os-secure"><LockKeyhole size={13} /> Your details stay private. You choose what to connect.</p>
          </form>
        </>}
      </div>
    </dialog>
  );
}
