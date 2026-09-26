import React, { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { LANGUAGE_NAMES, type Language } from "./i18n/context";
import "./antwoord-pagina.css";

type Soort = "website" | "os";
type Bewaard = { bron: string; teksten: Partial<Record<Language, string>>; bijgewerkt: Partial<Record<Language, string>> };
const TALEN: Language[] = ["nl", "en", "de", "fr", "it", "es"];
const OPSLAG = "sn-antwoord-aanvragen-v2";
const OUDE_OPSLAG = "sn-antwoord-aanvragen-v1";
const OUDE_STANDAARD = "Hoi! Bedankt voor je aanvraag bij SocialNow. Ik heb je bericht ontvangen en bekijk wat ik voor je kan doen. Ik stuur je snel de volgende stap. Heb je nog een website of een voorbeeld dat je mooi vindt? Stuur de link gerust door. Groet, Marinus";
const OS_LIVE_LINK = "https://app.socialnow.nl/login/";

const STANDAARD: Record<Soort, Record<Language, string>> = {
  website: {
    nl: "Hoi! Bedankt voor je websiteaanvraag. Ik heb je gegevens en antwoorden ontvangen. Heb je nog extra foto's, je logo of ander beeldmateriaal dat we mogen gebruiken? Stuur het hier gerust door. Ik bekijk alles en laat je weten wat de volgende stap is. Groet, Marinus",
    en: "Hi! Thanks for your website request. I've received your details and answers. Do you have any extra photos, your logo or other images we could use? Feel free to send them here. I'll review everything and let you know the next step. Best, Marinus",
    de: "Hallo! Vielen Dank für Ihre Website-Anfrage. Ich habe Ihre Angaben und Antworten erhalten. Haben Sie noch weitere Fotos, Ihr Logo oder anderes Bildmaterial, das wir verwenden dürfen? Schicken Sie es mir gern hier. Ich sehe mir alles an und melde mich mit dem nächsten Schritt. Viele Grüße, Marinus",
    fr: "Bonjour ! Merci pour votre demande de site web. J’ai bien reçu vos coordonnées et vos réponses. Avez-vous d’autres photos, votre logo ou des visuels que nous pouvons utiliser ? Envoyez-les-moi ici. Je vais tout examiner et vous indiquer la prochaine étape. À bientôt, Marinus",
    it: "Ciao! Grazie per la richiesta del sito. Ho ricevuto i tuoi dati e le tue risposte. Hai altre foto, il tuo logo o immagini che possiamo usare? Mandamele pure qui. Esaminerò tutto e ti farò sapere il prossimo passo. A presto, Marinus",
    es: "¡Hola! Gracias por solicitar tu web. He recibido tus datos y respuestas. ¿Tienes más fotos, tu logotipo u otras imágenes que podamos usar? Envíamelas por aquí. Revisaré todo y te diré cuál es el siguiente paso. Un saludo, Marinus",
  },
  os: {
    nl: "Hoi! Bedankt voor je OS-demoaanvraag. Je kunt het OS direct openen via de link hieronder. Meld je aan met het e-mailadres uit je aanvraag. Als je hulp nodig hebt, stuur me gerust een bericht. Groet, Marinus",
    en: "Hi! Thanks for requesting an OS demo. You can open the OS through the link below. Sign in with the email address from your request. If you need help, feel free to message me. Best, Marinus",
    de: "Hallo! Vielen Dank für Ihre Anfrage zur OS-Demo. Über den Link unten können Sie das OS öffnen. Melden Sie sich mit der E-Mail-Adresse aus Ihrer Anfrage an. Wenn Sie Hilfe benötigen, schreiben Sie mir gern. Viele Grüße, Marinus",
    fr: "Bonjour ! Merci pour votre demande de démo de l’OS. Vous pouvez ouvrir l’OS avec le lien ci-dessous. Connectez-vous avec l’adresse e-mail indiquée dans votre demande. Si vous avez besoin d’aide, écrivez-moi. À bientôt, Marinus",
    it: "Ciao! Grazie per aver richiesto una demo dell’OS. Puoi aprire l’OS dal link qui sotto. Accedi con l’indirizzo e-mail della tua richiesta. Se hai bisogno di aiuto, scrivimi pure. A presto, Marinus",
    es: "¡Hola! Gracias por solicitar una demo del OS. Puedes abrir el OS con el enlace de abajo. Accede con el correo electrónico de tu solicitud. Si necesitas ayuda, escríbeme. Un saludo, Marinus",
  },
};

function begin(soort: Soort): Bewaard {
  const teksten = STANDAARD[soort];
  return { bron: teksten.nl, teksten, bijgewerkt: Object.fromEntries(TALEN.map(taal => [taal, teksten.nl])) };
}

function lees(): Record<Soort, Bewaard> {
  try {
    const x = JSON.parse(localStorage.getItem(OPSLAG) || "null");
    if (x?.website?.bron && x?.os?.bron) return x;
  } catch {}
  const uit = { website: begin("website"), os: begin("os") };
  try {
    const oud = JSON.parse(localStorage.getItem(OUDE_OPSLAG) || "null");
    // Bewaar eigen aanpassingen; vervang alleen het oude, ongewijzigde concept uit de screenshot.
    if (oud?.bron && oud.bron !== OUDE_STANDAARD) uit.website = oud;
  } catch {}
  return uit;
}

function klaarBericht(soort: Soort, tekst: string): string {
  return soort === "os" ? `${tekst.trim()}\n\n${OS_LIVE_LINK}` : tekst.trim();
}

async function vertaal(tekst: string, taal: Language, signal: AbortSignal): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", tekst); url.searchParams.set("langpair", `nl|${taal}`);
  const response = await fetch(url, { signal });
  if (!response.ok) throw Error("Vertaalservice niet bereikbaar");
  const data = await response.json();
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) throw Error("Vertaling niet beschikbaar");
  const html = document.createElement("textarea"); html.innerHTML = data.responseData.translatedText;
  const resultaat = html.value.trim();
  if (!resultaat || /MYMEMORY WARNING/i.test(resultaat)) throw Error("Vertaling niet beschikbaar");
  return resultaat;
}

export default function AntwoordPagina() {
  const [soort, setSoort] = useState<Soort>("website");
  const [alles, setAlles] = useState<Record<Soort, Bewaard>>(lees);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [gekopieerd, setGekopieerd] = useState<Language | null>(null);
  const versie = useRef(0);
  const data = alles[soort];

  useEffect(() => { try { localStorage.setItem(OPSLAG, JSON.stringify(alles)); } catch {} }, [alles]);
  useEffect(() => {
    if (!data.bron.trim()) return;
    const open = TALEN.slice(1).filter(taal => data.bijgewerkt[taal] !== data.bron);
    if (!open.length) { setBezig(false); setFout(""); return; }
    const huidig = ++versie.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setBezig(true); setFout("");
      const resultaten = await Promise.allSettled(open.map(taal => vertaal(data.bron, taal, controller.signal)));
      if (huidig !== versie.current || controller.signal.aborted) return;
      const teksten = { ...data.teksten }, bijgewerkt = { ...data.bijgewerkt };
      let fouten = 0;
      resultaten.forEach((r, i) => {
        if (r.status === "fulfilled") { teksten[open[i]] = r.value; bijgewerkt[open[i]] = data.bron; }
        else fouten++;
      });
      if (fouten < open.length) setAlles(oud => oud[soort].bron === data.bron ? { ...oud, [soort]: { ...oud[soort], teksten, bijgewerkt } } : oud);
      setBezig(false);
      if (fouten) setFout(`${fouten} vertaling${fouten === 1 ? "" : "en"} lukte${fouten === 1 ? "" : "n"} niet. Pas de tekst aan of herlaad de pagina om opnieuw te proberen.`);
    }, 800);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [soort, data.bron, data.bijgewerkt]);

  const wijzig = (bron: string) => setAlles(oud => ({ ...oud, [soort]: bron === STANDAARD[soort].nl
    ? begin(soort)
    : { ...oud[soort], bron, teksten: { ...oud[soort].teksten, nl: bron }, bijgewerkt: { ...oud[soort].bijgewerkt, nl: bron } } }));
  const kopieer = async (taal: Language) => {
    const tekst = data.teksten[taal]; if (!tekst || data.bijgewerkt[taal] !== data.bron) return;
    try { await navigator.clipboard.writeText(klaarBericht(soort, tekst)); setGekopieerd(taal); window.setTimeout(() => setGekopieerd(null), 2200); }
    catch { setFout("Kopiëren lukte niet. Selecteer de tekst en kopieer hem zelf."); }
  };
  const wissel = (volgende: Soort) => { setSoort(volgende); setFout(""); setGekopieerd(null); };
  const wacht = bezig || TALEN.slice(1).some(taal => data.bijgewerkt[taal] !== data.bron);

  return <section className="antwoord-pagina" translate="no"><div className="antwoord-in">
    <p className="antwoord-label">SocialNow · WhatsApp</p><h1>Antwoord op een aanvraag</h1>
    <p>Kies de aanvraag. Pas het Nederlandse standaardbericht aan; de andere talen worden bijgewerkt. Kopieer daarna de reactie voor het WhatsApp-gesprek.</p>
    <div className="antwoord-keuze" role="group" aria-label="Soort aanvraag">
      <button type="button" aria-pressed={soort === "website"} onClick={() => wissel("website")}>Website · extra beeldmateriaal</button>
      <button type="button" aria-pressed={soort === "os"} onClick={() => wissel("os")}>OS · livelink</button>
    </div>
    <label htmlFor="antwoord-bron">Standaardbericht in het Nederlands</label>
    <textarea id="antwoord-bron" value={data.bron} maxLength={350} rows={7} onChange={e => wijzig(e.target.value)} />
    {soort === "os" && <p className="antwoord-link">De livelink komt automatisch onder elke taalversie: <a href={OS_LIVE_LINK} target="_blank" rel="noopener noreferrer">{OS_LIVE_LINK}</a></p>}
    <p className="antwoord-klein">Alleen bewaard in deze browser. Voor automatisch vertalen gaat de standaardtekst naar MyMemory. Zet geen persoonsgegevens in dit bericht.</p>
    <p className="antwoord-status" role="status">{fout || (wacht ? "Vertalingen worden bijgewerkt…" : "Alle beschikbare vertalingen zijn bijgewerkt.")}</p>
    <div className="antwoord-grid">{TALEN.map(taal => {
      const klaar = !!data.teksten[taal] && data.bijgewerkt[taal] === data.bron;
      return <article key={taal} className="antwoord-kaart" lang={taal}><div className="antwoord-kaart-kop"><h2>{LANGUAGE_NAMES[taal]}</h2><span>{klaar ? "Klaar" : "Wacht op vertaling"}</span></div>
        <p>{klaar ? klaarBericht(soort, data.teksten[taal] || "") : "De nieuwe tekst is nog niet vertaald."}</p>
        <button type="button" disabled={!klaar} onClick={() => void kopieer(taal)}>{gekopieerd === taal ? <Check size={16} /> : <Copy size={16} />}{gekopieerd === taal ? "Gekopieerd" : "Kopieer voor WhatsApp"}</button>
      </article>;
    })}</div>
  </div></section>;
}
