import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { aanvraagWhatsApp } from "./aanvragen";

const QR_KEY = "sn-qr-os-welcome-v1";

function isQrVisit() {
  return new URLSearchParams(window.location.search).get("qr") === "os";
}

export default function QrOsWelcome({ ready }: { ready: boolean }) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"welcome" | "details">("welcome");
  const dialog = useRef<HTMLDialogElement>(null);
  const firstName = useId();
  const lastName = useId();
  const email = useId();

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
  const continueToWhatsApp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    window.location.assign(aanvraagWhatsApp("os", language, {
      voornaam: String(values.get("firstName") || ""),
      achternaam: String(values.get("lastName") || ""),
      email: String(values.get("email") || ""),
    }));
  };
  return (
    <dialog className="qr-os-dialog" ref={dialog} onCancel={close} aria-labelledby="qr-os-title">
      <div className="qr-os-card">
        <button className="qr-os-close" type="button" onClick={close} aria-label="Close welcome"><X size={18} /></button>
        {step === "welcome" ? <>
          <img className="qr-os-logo" src="/images/SocialNow-OS-Logo.webp" alt="SocialNow OS" width="900" height="136" />
          <h1 id="qr-os-title">Welcome to SocialNow.</h1>
          <p className="qr-os-lead">Are you here to explore the OS?</p>
          <div className="qr-os-actions">
            <button className="qr-os-primary" type="button" onClick={() => setStep("details")}>Yes, show me <ArrowRight size={17} /></button>
            <a className="qr-os-secondary" href="/">No, visit the website</a>
          </div>
        </> : <>
          <img className="qr-os-logo" src="/images/SocialNow-OS-Logo.webp" alt="SocialNow OS" width="900" height="136" />
          <p className="qr-os-eyebrow">YOUR PERSONAL OS</p>
          <h1 id="qr-os-title">Nice to meet you.</h1>
          <p className="qr-os-lead">Request your free OS demo directly through WhatsApp.</p>
          <ul className="qr-os-list"><li><Check size={15} /> Your Odoo data, ready when you connect it</li><li><Check size={15} /> A brand and Studio made for your business</li><li><Check size={15} /> Your team, work and next steps in one place</li></ul>
          <form onSubmit={continueToWhatsApp} className="qr-os-form">
            <div className="qr-os-grid"><label htmlFor={firstName}>First name<input id={firstName} name="firstName" autoComplete="given-name" required /></label><label htmlFor={lastName}>Last name<input id={lastName} name="lastName" autoComplete="family-name" required /></label></div>
            <label htmlFor={email}>Email address<input id={email} type="email" name="email" autoComplete="email" required /></label>
            <button className="qr-os-primary qr-os-try" type="submit">Request via WhatsApp <ArrowRight size={17} /></button>
            <p className="qr-os-secure">You can edit the message before sending it.</p>
          </form>
        </>}
      </div>
    </dialog>
  );
}
