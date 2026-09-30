import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { faqs } from "./content";
import { useLanguage } from "./i18n/context";
import { type Bericht, vraagMilo } from "./ui";
import "./milo-vragen.css";

// 30 september 2026 (Marinus): de veelgestelde vragen "passen niet in de stijl", "iets voor verzinnen, desnoods dat het een
// AI-chat is", en "Stel je vraag, goed getraind AI-model erachter, met mooie HTML-animaties die het vertrouwen geven wat het
// systeem ook geeft". Het vragenblok is nu een gesprek met Milo: de vragen staan klaar als knoppen (antwoord uit onze eigen
// vragenlijst, meteen), en een eigen vraag gaat via vraagMilo naar de Worker. Onder elk antwoord staat eerlijk waar het
// vandaan komt. De stappen tijdens het denken beschrijven alleen wat echt gebeurt.

const STAPPEN_VRAAG = ["Versleuteld verstuurd", "Milo leest je vraag", "Checkt het tegen onze eigen kennis"];
const STAPPEN_LIJST = ["Gevonden in onze vragenlijst"];

function bronNaam(bron: string | undefined, t: (tekst: string) => string) {
  if (!bron) return "";
  if (bron === "vragenlijst") return t("Uit onze vragenlijst");
  if (bron.startsWith("claude-opus-5-5")) return `${t("Antwoord van")} Claude Opus 5.5`;
  if (bron.startsWith("claude")) return `${t("Antwoord van")} Claude`;
  if (bron.startsWith("gemini")) return `${t("Antwoord van")} Gemini`;
  return `${t("Antwoord van")} ${bron}`;
}

function rustig() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
}

// Milo typt zijn antwoord uit; bij minder beweging staat het er meteen.
function Getypt({ tekst, klaar }: { tekst: string; klaar: () => void }) {
  const [n, setN] = useState(() => (rustig() ? tekst.length : 0));
  useEffect(() => {
    if (n >= tekst.length) { klaar(); return; }
    const stap = Math.max(1, Math.round(tekst.length / 90));
    const t = window.setTimeout(() => setN((v) => Math.min(tekst.length, v + stap)), 16);
    return () => window.clearTimeout(t);
  }, [n, tekst, klaar]);
  return <>{tekst.slice(0, n)}{n < tekst.length && <i className="h-mv-cursor" aria-hidden="true" />}</>;
}

function Denkt({ stappen, t }: { stappen: string[]; t: (tekst: string) => string }) {
  const [aan, setAan] = useState(1);
  useEffect(() => {
    if (aan >= stappen.length) return;
    const klok = window.setTimeout(() => setAan((v) => v + 1), 520);
    return () => window.clearTimeout(klok);
  }, [aan, stappen.length]);
  return (
    <div className="h-mv-bericht is-milo h-mv-denkt" aria-label={t("Milo denkt na")}>
      <ol className="h-mv-stappen">
        {stappen.map((stap, i) => (
          <li key={stap} className={i < aan - 1 ? "is-klaar" : i === aan - 1 ? "is-bezig" : undefined}>
            <span className="h-mv-stip" aria-hidden="true">{i < aan - 1 ? <Check size={11} strokeWidth={3} /> : null}</span>
            {t(stap)}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function MiloVragen() {
  const { language, t } = useLanguage();
  const groet: Bericht = { van: "milo", tekst: t("Hoi, ik ben Milo. Vraag me alles over het OS, onze diensten of hoe we samen verder gaan.") };
  const [berichten, setBerichten] = useState<Bericht[]>([]);
  const [denkt, setDenkt] = useState<string[] | null>(null);
  const [typt, setTypt] = useState(-1);
  const [vraag, setVraag] = useState("");
  const [gesteld, setGesteld] = useState<string[]>([]);
  const [alles, setAlles] = useState(false);
  const lijst = useRef<HTMLDivElement>(null);
  const gesprek = berichten.length ? berichten : [groet];

  useEffect(() => {
    const el = lijst.current;
    if (el && berichten.length) el.scrollTo({ top: el.scrollHeight, behavior: rustig() ? "auto" : "smooth" });
  }, [berichten, denkt, typt]);

  const antwoord = (heen: Bericht[], nieuw: Bericht) => {
    const volgende = [...heen, nieuw];
    setBerichten(volgende);
    setTypt(volgende.length - 1);
  };

  // Een klaargezette vraag: het antwoord staat in onze eigen vragenlijst, dus geen verzoek naar buiten.
  const kies = (faq: (typeof faqs)[number]) => {
    if (denkt) return;
    const heen: Bericht[] = [...gesprek, { van: "bezoeker", tekst: t(faq.question) }];
    setBerichten(heen);
    setGesteld((g) => [...g, faq.question]);
    setDenkt(STAPPEN_LIJST);
    window.setTimeout(() => {
      setDenkt(null);
      antwoord(heen, { van: "milo", tekst: t(faq.answer), bron: "vragenlijst" });
    }, rustig() ? 0 : 650);
  };

  const stel = async (event: React.FormEvent) => {
    event.preventDefault();
    const q = vraag.trim();
    if (!q || denkt) return;
    const heen: Bericht[] = [...gesprek, { van: "bezoeker", tekst: q }];
    setBerichten(heen);
    setVraag("");
    setDenkt(STAPPEN_VRAAG);
    const begin = Date.now();
    const nieuw = await vraagMilo(heen, language, t);
    // De stappen krijgen de tijd om zichtbaar af te lopen, ook als het antwoord sneller is.
    const rest = rustig() ? 0 : Math.max(0, STAPPEN_VRAAG.length * 520 + 200 - (Date.now() - begin));
    window.setTimeout(() => { setDenkt(null); antwoord(heen, nieuw); }, rest);
  };

  // Rust: vier vragen tegelijk, de rest achter "meer".
  const open = faqs.filter((faq) => !gesteld.includes(faq.question));
  const zichtbaar = alles ? open : open.slice(0, 4);

  return (
    <div className="h-mv" translate="no">
      <div className="h-mv-kop">
        <span className="h-mv-avatar"><img src="/proposal/milo/website.webp" alt="" width="52" height="52" loading="lazy" decoding="async" /></span>
        <span className="h-mv-naam">
          <b>Milo</b>
          <span className="h-mv-online"><i aria-hidden="true" />{t("Online")}</span>
        </span>
        <ul className="h-mv-vertrouwen" aria-label={t("Zo gaan we met je vraag om")}>
          <li><Lock size={13} aria-hidden="true" />{t("Versleuteld")}</li>
          <li><ShieldCheck size={13} aria-hidden="true" />{t("Geen tracking")}</li>
          <li><Sparkles size={13} aria-hidden="true" />{t("Eigen kennis")}</li>
        </ul>
      </div>

      <div className="h-mv-lijst" ref={lijst} aria-live="polite">
        {gesprek.map((bericht, i) => (
          <div key={i} className={`h-mv-bericht ${bericht.van === "bezoeker" ? "is-bezoeker" : "is-milo"}`}>
            <p>{bericht.van === "milo" && i === typt ? <Getypt tekst={bericht.tekst} klaar={() => setTypt(-1)} /> : bericht.tekst}</p>
            {bericht.van === "milo" && i !== typt && (bericht.bron || bericht.links) && (
              <div className="h-mv-onder">
                {bericht.bron && <span className="h-mv-bron"><Check size={12} strokeWidth={3} aria-hidden="true" />{bronNaam(bericht.bron, t)}</span>}
                {bericht.links?.map((link) => (
                  <a key={link.href + link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>{link.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}
        {denkt && <Denkt stappen={denkt} t={t} />}
      </div>

      {open.length > 0 && (
        <div className="h-mv-chips" role="group" aria-label={t("Veelgestelde vragen")}>
          {zichtbaar.map((faq) => (
            <button key={faq.question} type="button" onClick={() => kies(faq)} disabled={Boolean(denkt)}>{t(faq.question)}</button>
          ))}
          {!alles && open.length > zichtbaar.length && (
            <button type="button" className="is-meer" onClick={() => setAlles(true)}>+{open.length - zichtbaar.length} {t("meer")}</button>
          )}
        </div>
      )}

      <form className="h-mv-invoer" onSubmit={stel}>
        <label className="sr-only" htmlFor="h-mv-vraag">{t("Stel je vraag aan Milo")}</label>
        <input id="h-mv-vraag" type="text" autoComplete="off" maxLength={500} value={vraag} onChange={(e) => setVraag(e.target.value)} placeholder={t("Stel je vraag aan Milo")} />
        <button type="submit" disabled={!vraag.trim() || Boolean(denkt)} aria-label={t("Versturen")}><ArrowUp size={18} /></button>
      </form>
      <p className="h-mv-voet">{t("Milo kan fouten maken. Bij twijfel helpt ons team je verder.")}</p>
    </div>
  );
}
