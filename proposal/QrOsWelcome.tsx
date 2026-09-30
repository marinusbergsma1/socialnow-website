import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { type Language, useLanguage } from "./i18n/context";
import { aanvraagWhatsApp } from "./aanvragen";


const COPY: Record<Language, { close:string; welcome:string; explore:string; yes:string; no:string; eyebrow:string; nice:string; lead:string; items:[string,string,string]; first:string; last:string; email:string; submit:string; edit:string }> = {
 en:{close:"Close welcome",welcome:"Welcome to SocialNow.",explore:"Are you here to explore the OS?",yes:"Yes, show me",no:"No, visit the website",eyebrow:"YOUR PERSONAL OS",nice:"Nice to meet you.",lead:"Request your free OS demo directly through WhatsApp.",items:["Your Odoo data, ready when you connect it","A brand and Studio made for your business","Your team, work and next steps in one place"],first:"First name",last:"Last name",email:"Email address",submit:"Request via WhatsApp",edit:"You can edit the message before sending it."},
 nl:{close:"Welkom sluiten",welcome:"Welkom bij SocialNow.",explore:"Wil je het OS ontdekken?",yes:"Ja, laat zien",no:"Nee, bekijk de website",eyebrow:"JOUW PERSOONLIJKE OS",nice:"Leuk je te ontmoeten.",lead:"Vraag je gratis OS-demo direct aan via WhatsApp.",items:["Je Odoo-gegevens, klaar zodra je ze koppelt","Een merk en Studio voor jouw bedrijf","Je team, werk en volgende stappen op één plek"],first:"Voornaam",last:"Achternaam",email:"E-mailadres",submit:"Aanvragen via WhatsApp",edit:"Je kunt het bericht aanpassen voordat je het verstuurt."},
 de:{close:"Willkommen schließen",welcome:"Willkommen bei SocialNow.",explore:"Möchten Sie das OS entdecken?",yes:"Ja, zeigen",no:"Nein, Website besuchen",eyebrow:"IHR PERSÖNLICHES OS",nice:"Schön, Sie kennenzulernen.",lead:"Fragen Sie Ihre kostenlose OS-Demo direkt per WhatsApp an.",items:["Ihre Odoo-Daten, bereit nach der Verbindung","Marke und Studio für Ihr Unternehmen","Team, Arbeit und nächste Schritte an einem Ort"],first:"Vorname",last:"Nachname",email:"E-Mail-Adresse",submit:"Per WhatsApp anfragen",edit:"Sie können die Nachricht vor dem Senden bearbeiten."},
 fr:{close:"Fermer l’accueil",welcome:"Bienvenue chez SocialNow.",explore:"Vous souhaitez découvrir l’OS ?",yes:"Oui, montrez-moi",no:"Non, voir le site",eyebrow:"VOTRE OS PERSONNEL",nice:"Ravi de vous rencontrer.",lead:"Demandez votre démo OS gratuite directement via WhatsApp.",items:["Vos données Odoo, prêtes une fois connectées","Une marque et un Studio pour votre entreprise","Votre équipe, votre travail et vos prochaines étapes au même endroit"],first:"Prénom",last:"Nom",email:"Adresse e-mail",submit:"Demander via WhatsApp",edit:"Vous pouvez modifier le message avant de l’envoyer."},
 es:{close:"Cerrar bienvenida",welcome:"Bienvenido a SocialNow.",explore:"¿Vienes a descubrir el OS?",yes:"Sí, enséñamelo",no:"No, ver la web",eyebrow:"TU OS PERSONAL",nice:"Encantados de conocerte.",lead:"Solicita tu demo gratis del OS directamente por WhatsApp.",items:["Tus datos de Odoo, listos al conectarlos","Una marca y un Studio hechos para tu negocio","Tu equipo, tu trabajo y los próximos pasos en un solo lugar"],first:"Nombre",last:"Apellido",email:"Correo electrónico",submit:"Solicitar por WhatsApp",edit:"Puedes editar el mensaje antes de enviarlo."},
 it:{close:"Chiudi benvenuto",welcome:"Benvenuto in SocialNow.",explore:"Sei qui per scoprire l’OS?",yes:"Sì, mostramelo",no:"No, vai al sito",eyebrow:"IL TUO OS PERSONALE",nice:"Piacere di conoscerti.",lead:"Richiedi la tua demo gratuita dell’OS direttamente su WhatsApp.",items:["I tuoi dati Odoo, pronti appena li colleghi","Un brand e uno Studio fatti per la tua azienda","Il tuo team, il lavoro e i prossimi passi in un unico posto"],first:"Nome",last:"Cognome",email:"Indirizzo e-mail",submit:"Richiedi su WhatsApp",edit:"Puoi modificare il messaggio prima di inviarlo."},
 pt:{close:"Fechar boas-vindas",welcome:"Bem-vindo à SocialNow.",explore:"Vieste descobrir o OS?",yes:"Sim, mostra-me",no:"Não, ver o website",eyebrow:"O TEU OS PESSOAL",nice:"Prazer em conhecer-te.",lead:"Pede a tua demo grátis do OS diretamente por WhatsApp.",items:["Os teus dados Odoo, prontos quando os ligares","Uma marca e um Studio feitos para o teu negócio","A tua equipa, o trabalho e os próximos passos num só lugar"],first:"Nome",last:"Apelido",email:"E-mail",submit:"Pedir por WhatsApp",edit:"Podes editar a mensagem antes de a enviar."},
 pl:{close:"Zamknij powitanie",welcome:"Witaj w SocialNow.",explore:"Chcesz poznać OS?",yes:"Tak, pokaż",no:"Nie, przejdź do strony",eyebrow:"TWÓJ OSOBISTY OS",nice:"Miło Cię poznać.",lead:"Poproś o darmowe demo OS bezpośrednio przez WhatsApp.",items:["Twoje dane z Odoo, gotowe po podłączeniu","Marka i Studio stworzone dla Twojej firmy","Twój zespół, praca i kolejne kroki w jednym miejscu"],first:"Imię",last:"Nazwisko",email:"Adres e-mail",submit:"Poproś przez WhatsApp",edit:"Możesz edytować wiadomość przed wysłaniem."},
 sv:{close:"Stäng välkomst",welcome:"Välkommen till SocialNow.",explore:"Vill du utforska OS:et?",yes:"Ja, visa mig",no:"Nej, till webbplatsen",eyebrow:"DITT PERSONLIGA OS",nice:"Trevligt att träffas.",lead:"Be om din gratis OS-demo direkt via WhatsApp.",items:["Din Odoo-data, klar när du kopplar den","Ett varumärke och en Studio för ditt företag","Ditt team, ditt arbete och nästa steg på ett ställe"],first:"Förnamn",last:"Efternamn",email:"E-postadress",submit:"Skicka via WhatsApp",edit:"Du kan redigera meddelandet innan du skickar det."},
 da:{close:"Luk velkomst",welcome:"Velkommen til SocialNow.",explore:"Vil du udforske OS'et?",yes:"Ja, vis mig",no:"Nej, til hjemmesiden",eyebrow:"DIT PERSONLIGE OS",nice:"Rart at møde dig.",lead:"Bestil din gratis OS-demo direkte via WhatsApp.",items:["Dine Odoo-data, klar når du forbinder dem","Et brand og et Studio lavet til din virksomhed","Dit team, dit arbejde og næste skridt samlet ét sted"],first:"Fornavn",last:"Efternavn",email:"E-mailadresse",submit:"Bestil via WhatsApp",edit:"Du kan redigere beskeden, før du sender den."},
 tr:{close:"Karşılamayı kapat",welcome:"SocialNow’a hoş geldiniz.",explore:"OS’u keşfetmek için mi buradasınız?",yes:"Evet, göster",no:"Hayır, web sitesine git",eyebrow:"KİŞİSEL OS’UNUZ",nice:"Tanıştığımıza memnun olduk.",lead:"Ücretsiz OS demonuzu doğrudan WhatsApp ile isteyin.",items:["Odoo verileriniz, bağladığınız anda hazır","İşletmenize özel bir marka ve Studio","Ekibiniz, işleriniz ve sonraki adımlar tek yerde"],first:"Ad",last:"Soyad",email:"E-posta adresi",submit:"WhatsApp ile iste",edit:"Mesajı göndermeden önce düzenleyebilirsiniz."},
 ja:{close:"閉じる",welcome:"SocialNow へようこそ。",explore:"OS をご覧になりますか？",yes:"はい、見てみる",no:"いいえ、ウェブサイトへ",eyebrow:"あなたのパーソナル OS",nice:"はじめまして。",lead:"無料の OS デモを WhatsApp から直接お申し込みください。",items:["Odoo のデータは接続すればすぐに使えます","あなたのビジネスのためのブランドと Studio","チーム、仕事、次のステップをひとつの場所に"],first:"名",last:"姓",email:"メールアドレス",submit:"WhatsApp で申し込む",edit:"送信前にメッセージを編集できます。"},
};
const QR_KEY = "sn-qr-os-welcome-v1";

function isQrVisit() {
  return new URLSearchParams(window.location.search).get("qr") === "os";
}

export default function QrOsWelcome({ ready }: { ready: boolean }) {
  const { language } = useLanguage();
  const copy = COPY[language];
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
        <button className="qr-os-close" type="button" onClick={close} aria-label={copy.close}><X size={18} /></button>
        {step === "welcome" ? <>
          <img className="qr-os-logo" src="/images/SocialNow-OS-Logo.webp" alt="SocialNow OS" width="900" height="136" loading="lazy" />
          <h1 id="qr-os-title">{copy.welcome}</h1>
          <p className="qr-os-lead">{copy.explore}</p>
          <div className="qr-os-actions">
            <button className="qr-os-primary" type="button" onClick={() => setStep("details")}>{copy.yes} <ArrowRight size={17} /></button>
            <a className="qr-os-secondary" href="/">{copy.no}</a>
          </div>
        </> : <>
          <img className="qr-os-logo" src="/images/SocialNow-OS-Logo.webp" alt="SocialNow OS" width="900" height="136" loading="lazy" />
          <p className="qr-os-eyebrow">{copy.eyebrow}</p>
          <h1 id="qr-os-title">{copy.nice}</h1>
          <p className="qr-os-lead">{copy.lead}</p>
          <ul className="qr-os-list"><li><Check size={15} /> {copy.items[0]}</li><li><Check size={15} /> {copy.items[1]}</li><li><Check size={15} /> {copy.items[2]}</li></ul>
          <form onSubmit={continueToWhatsApp} className="qr-os-form">
            <div className="qr-os-grid"><label htmlFor={firstName}>{copy.first}<input id={firstName} name="firstName" autoComplete="given-name" required /></label><label htmlFor={lastName}>{copy.last}<input id={lastName} name="lastName" autoComplete="family-name" required /></label></div>
            <label htmlFor={email}>{copy.email}<input id={email} type="email" name="email" autoComplete="email" required /></label>
            <button className="qr-os-primary qr-os-try" type="submit">{copy.submit} <ArrowRight size={17} /></button>
            <p className="qr-os-secure">{copy.edit}</p>
          </form>
        </>}
      </div>
    </dialog>
  );
}
