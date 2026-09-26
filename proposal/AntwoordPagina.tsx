import React, { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { LANGUAGE_NAMES, type Language } from "./i18n/context";
import "./antwoord-pagina.css";

const STANDAARD = "Hoi! Bedankt voor je aanvraag bij SocialNow. Ik heb je bericht ontvangen en bekijk wat ik voor je kan doen. Ik stuur je snel de volgende stap. Heb je nog een website of een voorbeeld dat je mooi vindt? Stuur de link gerust door. Groet, Marinus";
const VERTALINGEN: Record<Language, string> = {
  nl: STANDAARD,
  en: "Hi! Thanks for your request to SocialNow. I've received your message and will see how I can help. I'll send you the next step soon. Do you have a website or an example you like? Feel free to send me the link. Best, Marinus",
  de: "Hallo! Vielen Dank für Ihre Anfrage bei SocialNow. Ich habe Ihre Nachricht erhalten und sehe mir an, wie ich Ihnen helfen kann. Ich melde mich bald mit dem nächsten Schritt. Haben Sie eine Website oder ein Beispiel, das Ihnen gefällt? Schicken Sie mir gern den Link. Viele Grüße, Marinus",
  fr: "Bonjour ! Merci pour votre demande auprès de SocialNow. J’ai bien reçu votre message et vais voir comment je peux vous aider. Je vous enverrai bientôt la prochaine étape. Avez-vous un site web ou un exemple qui vous plaît ? N’hésitez pas à m’envoyer le lien. À bientôt, Marinus",
  it: "Ciao! Grazie per la tua richiesta a SocialNow. Ho ricevuto il tuo messaggio e vedrò come posso aiutarti. Ti invierò presto il prossimo passo. Hai un sito o un esempio che ti piace? Mandami pure il link. A presto, Marinus",
  es: "¡Hola! Gracias por tu solicitud a SocialNow. He recibido tu mensaje y revisaré cómo puedo ayudarte. Pronto te enviaré el siguiente paso. ¿Tienes una web o un ejemplo que te guste? Puedes enviarme el enlace. Un saludo, Marinus",
};
const TALEN: Language[] = ["nl", "en", "de", "fr", "it", "es"];
const SLEUTEL = "sn-antwoord-aanvragen-v1";
type Bewaard = { bron: string; teksten: Partial<Record<Language, string>>; bijgewerkt: Partial<Record<Language, string>> };

function lees(): Bewaard {
  try { const x = JSON.parse(localStorage.getItem(SLEUTEL) || "null"); if (x?.bron && x?.teksten && x?.bijgewerkt) return x; } catch {}
  return { bron: STANDAARD, teksten: VERTALINGEN, bijgewerkt: Object.fromEntries(TALEN.map(taal => [taal, STANDAARD])) };
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
  const [data, setData] = useState<Bewaard>(lees);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [gekopieerd, setGekopieerd] = useState<Language | null>(null);
  const versie = useRef(0);
  useEffect(() => { try { localStorage.setItem(SLEUTEL, JSON.stringify(data)); } catch {} }, [data]);
  useEffect(() => {
    if (!data.bron.trim()) return;
    const open = TALEN.slice(1).filter((taal) => data.bijgewerkt[taal] !== data.bron);
    if (!open.length) { setBezig(false); setFout(""); return; }
    const huidig = ++versie.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setBezig(true); setFout("");
      const resultaten = await Promise.allSettled(open.map((taal) => vertaal(data.bron, taal, controller.signal)));
      if (huidig !== versie.current || controller.signal.aborted) return;
      const nieuw = { ...data.teksten }, bijgewerkt = { ...data.bijgewerkt };
      let fouten = 0;
      resultaten.forEach((r, i) => { if (r.status === "fulfilled") { nieuw[open[i]] = r.value; bijgewerkt[open[i]] = data.bron; } else fouten++; });
      if (fouten < open.length) setData((oud) => oud.bron === data.bron ? { ...oud, teksten: nieuw, bijgewerkt } : oud);
      setBezig(false);
      if (fouten) setFout(`${fouten} vertaling${fouten === 1 ? "" : "en"} lukte${fouten === 1 ? "" : "n"} niet. Pas de tekst aan of herlaad de pagina om opnieuw te proberen.`);
    }, 800);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [data.bron, data.bijgewerkt]);
  const wijzig = (bron: string) => setData((oud) => bron === STANDAARD
    ? { bron, teksten: VERTALINGEN, bijgewerkt: Object.fromEntries(TALEN.map(taal => [taal, bron])) }
    : { ...oud, bron, teksten: { ...oud.teksten, nl: bron }, bijgewerkt: { ...oud.bijgewerkt, nl: bron } });
  const kopieer = async (taal: Language) => {
    const tekst = data.teksten[taal]; if (!tekst || data.bijgewerkt[taal] !== data.bron) return;
    try { await navigator.clipboard.writeText(tekst); setGekopieerd(taal); window.setTimeout(() => setGekopieerd(null), 2200); }
    catch { setFout("Kopiëren lukte niet. Selecteer de tekst en kopieer hem zelf."); }
  };
  return <section className="antwoord-pagina" translate="no"><div className="antwoord-in">
    <p className="antwoord-label">SocialNow · WhatsApp</p><h1>Antwoord op een aanvraag</h1>
    <p>Pas het Nederlandse standaardbericht aan. De andere talen worden automatisch bijgewerkt. Kopieer daarna de taal van de aanvrager en plak het bericht in WhatsApp.</p>
    <label htmlFor="antwoord-bron">Standaardbericht in het Nederlands</label>
    <textarea id="antwoord-bron" value={data.bron} maxLength={350} rows={7} onChange={e => wijzig(e.target.value)} />
    <p className="antwoord-klein">Alleen bewaard in deze browser. Voor automatisch vertalen gaat de standaardtekst naar MyMemory. Zet geen persoonsgegevens in dit bericht.</p>
    <p className="antwoord-status" role="status">{fout || bezig || TALEN.slice(1).some(taal => data.bijgewerkt[taal] !== data.bron) ? fout || "Vertalingen worden bijgewerkt…" : "Alle beschikbare vertalingen zijn bijgewerkt."}</p>
    <div className="antwoord-grid">{TALEN.map(taal => {
      const klaar = !!data.teksten[taal] && data.bijgewerkt[taal] === data.bron;
      return <article key={taal} className="antwoord-kaart" lang={taal}><div className="antwoord-kaart-kop"><h2>{LANGUAGE_NAMES[taal]}</h2><span>{klaar ? "Klaar" : "Wacht op vertaling"}</span></div>
        <p>{klaar ? data.teksten[taal] : "De nieuwe tekst is nog niet vertaald."}</p>
        <button type="button" disabled={!klaar} onClick={() => void kopieer(taal)}>{gekopieerd === taal ? <Check size={16} /> : <Copy size={16} />}{gekopieerd === taal ? "Gekopieerd" : "Kopieer voor WhatsApp"}</button>
      </article>;
    })}</div>
  </div></section>;
}
