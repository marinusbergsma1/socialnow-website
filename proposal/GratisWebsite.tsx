import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Check, Monitor, Smartphone, X } from "lucide-react";
import { useLanguage } from "./i18n/context";
import { LEGAL_VERSION } from "../components/legal";
import { CLAIM_URL } from "./os-entry";
import { createGlobePoints } from "./BrandGlobe";
import "./gratis-website.css";

// 24 september 2026 (Marinus): de gratis website-upgrade op de beurs. Een basisversie van de vaste
// website-onboarding (skill klant-onboarding, naslag/vragenbank.md). De antwoorden gaan als vraag +
// antwoord naar os.socialnow.nl/api/aanmelden (bron "website"): lead, leadmail en welkomstmail.
//
// 26 september 2026 (Marinus): "als je alles invult, komen er met een mooie SocialNow laadanimatie
// 3 concepten op mobiel en pc die automatisch worden gerenderd". Na het versturen maakt
// app.socialnow.nl/api/website-concepten drie websites uit de scan van de eigen site en de antwoorden.
// Het id maakt de browser zelf (UUID); de link naar de concepten gaat mee in de aanvraag, zodat
// Marinus en de automatisering ze terugvinden. De vraag gaat altijd in het Nederlands mee.
const AANMELD_URL = "https://os.socialnow.nl/api/aanmelden";
const CONCEPT_API = "https://app.socialnow.nl/api/website-concepten";
const OPSLAG = "sn-gratis-website-v1";
const CONCEPT_OPSLAG = "sn-gratis-website-concepten-v1";

type Vraag = { key: string; vraag: string; hint: string; type?: "text" };
const VRAGEN: Vraag[] = [
  { key: "website", vraag: "Huidige website", hint: "Plak de link. Leeg laten als je nog geen site hebt.", type: "text" },
  { key: "voorbeeld", vraag: "Een website die je mega mooi vindt", hint: "Plak de link. Mag uit elke branche komen.", type: "text" },
  { key: "wat", vraag: "Wat doet je bedrijf, in één zin?", hint: "Bijvoorbeeld: wij installeren zonnepanelen voor bedrijven in de regio Utrecht." },
  { key: "nietgoed", vraag: "Waar loop je tegenaan met je huidige site?", hint: "Verouderd, traag, niet vindbaar, levert geen aanvragen op, past niet meer bij je." },
];

type Gegevens = { voornaam: string; achternaam: string; bedrijf: string; email: string; mobiel: string };
type Concept = { n: number; richting: string; naam: string; uitleg: string; kop: string; url: string };
type Uitslag = { id: string; bedrijf: string; site?: string; concepten: Concept[]; overzicht: string; keuze: number | null; bron?: { scan?: boolean; model?: boolean } };
type Fase = "formulier" | "laden" | "concepten" | "gekozen" | "later";

function laad(): { a: Record<string, string>; g: Gegevens } {
  try { const j = JSON.parse(localStorage.getItem(OPSLAG) || "null"); if (j && j.a && j.g && "voornaam" in j.g) return j; } catch {}
  return { a: {}, g: { voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" } };
}
function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16)); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
const volledig = (pad: string) => (pad.startsWith("http") ? pad : `https://app.socialnow.nl${pad}`);
const domein = (u: string) => { try { return new URL(/^https?:/i.test(u) ? u : `https://${u}`).hostname.replace(/^www\./, ""); } catch { return ""; } };
const wacht = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── De laadanimatie: de drie bollen van het SocialNow-beeldmerk die zich uit losse punten vormen ──
function Laadbol({ klaar }: { klaar: boolean }) {
  const doek = useRef<HTMLCanvasElement>(null);
  const klaarRef = useRef(klaar);
  klaarRef.current = klaar;
  useEffect(() => {
    const c = doek.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const punten = createGlobePoints(0.55).map((p) => ({ ...p, sx: (Math.random() - 0.5) * 4, sy: (Math.random() - 0.5) * 4, sz: (Math.random() - 0.5) * 4 }));
    let raf = 0; const start = performance.now(); let klaarOp = 0;
    const teken = (nu: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const t = (nu - start) / 1000;
      if (klaarRef.current && !klaarOp) klaarOp = nu;
      const uit = klaarOp ? Math.min(1, (nu - klaarOp) / 700) : 0;
      const vorm = rustig ? 1 : Math.min(1, t / 1.6); const e = 1 - Math.pow(1 - vorm, 3);
      const hoek = rustig ? 0.6 : t * 0.55, kantel = -0.35 + Math.sin(t * 0.7) * 0.08;
      const schaal = Math.min(w, h) * 0.34 * (1 + uit * 0.9), cx = w / 2, cy = h / 2;
      const adem = rustig ? 1 : 1 + Math.sin(t * 2.2) * 0.02;
      const lijst = punten.map((p) => {
        const s = p.sphere as { x: number; y: number; z: number; color: string };
        let x = (p.x * adem + s.x) * e + p.sx * (1 - e), y = (p.y * adem + s.y) * e + p.sy * (1 - e), z = (p.z * adem + s.z) * e + p.sz * (1 - e);
        const x1 = x * Math.cos(hoek) - z * Math.sin(hoek), z1 = x * Math.sin(hoek) + z * Math.cos(hoek);
        const y2 = y * Math.cos(kantel) - z1 * Math.sin(kantel), z2 = y * Math.sin(kantel) + z1 * Math.cos(kantel);
        const persp = 2.6 / (2.6 + z2);
        return { x: cx + x1 * schaal * persp, y: cy - y2 * schaal * persp, z: z2, persp, kleur: s.color };
      }).sort((a, b) => b.z - a.z);
      for (const p of lijst) {
        ctx.globalAlpha = Math.max(0, (0.25 + (1 - (p.z + 1.2) / 2.4) * 0.75) * (1 - uit));
        ctx.fillStyle = p.kleur;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.6, 1.9 * p.persp), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(teken);
    };
    raf = requestAnimationFrame(teken);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={doek} className="gw-bol" aria-hidden="true" />;
}

function Laden({ bedrijf, site, klaar }: { bedrijf: string; site: string; klaar: boolean }) {
  const fasen = [
    site ? "We scannen je website" : "We lezen je antwoorden",
    "We pakken je logo, kleuren en foto's",
    "We schrijven de teksten in jouw woorden",
    "We ontwerpen drie richtingen",
    "We zetten ze op pc en telefoon",
  ];
  const [sec, setSec] = useState(0);
  useEffect(() => { const s = performance.now(); const i = window.setInterval(() => setSec((performance.now() - s) / 1000), 200); return () => clearInterval(i); }, []);
  const stap = klaar ? fasen.length - 1 : Math.min(fasen.length - 1, Math.floor(sec / 6));
  const procent = klaar ? 100 : Math.round(94 * (1 - Math.exp(-sec / 16)));
  return (
    <section className="gw gw-laden" aria-live="polite">
      <div className="gw-laden-in">
        <Laadbol klaar={klaar} />
        <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>SocialNow AI</p>
        <h1>Drie websites voor <span className="gw-accent">{bedrijf || "jouw bedrijf"}</span></h1>
        <ol className="gw-fasen">
          {fasen.map((f, i) => (
            <li key={f} className={i < stap ? "is-klaar" : i === stap ? "is-nu" : ""}>
              <span className="gw-fase-stip">{i < stap ? <Check size={13} /> : null}</span>{f}
            </li>
          ))}
        </ol>
        <div className="gw-balk" role="progressbar" aria-valuenow={procent} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${procent}%` }} /></div>
        <p className="gw-klein"><b>{procent}%</b> <span>Dit duurt meestal minder dan een minuut</span></p>
      </div>
    </section>
  );
}

// Een concept op pc en telefoon tegelijk. De frames zijn echte pagina's, geschaald naar de kaart.
function Apparaten({ url, naam }: { url: string; naam: string }) {
  const doos = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(360);
  useEffect(() => {
    const el = doos.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth || 360));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  const pc = (w * 0.84) / 1440, tel = (w * 0.27 - 6) / 390;
  const hoog = Math.max(20 + 900 * pc + w * 0.08, 844 * tel + 6);
  return (
    <div className="gw-apparaten" ref={doos} style={{ height: hoog }}>
      <div className="gw-pc"><div className="gw-pc-balk"><i /><i /><i /></div>
        <div className="gw-vlak" style={{ height: 900 * pc }}><iframe src={url} title={`${naam}, pc`} loading="lazy" sandbox="" scrolling="no" tabIndex={-1} style={{ width: 1440, height: 900, transform: `scale(${pc})` }} /></div>
      </div>
      <div className="gw-tel"><div className="gw-vlak" style={{ height: 844 * tel }}><iframe src={url} title={`${naam}, telefoon`} loading="lazy" sandbox="" scrolling="no" tabIndex={-1} style={{ width: 390, height: 844, transform: `scale(${tel})` }} /></div></div>
    </div>
  );
}

function Bekijker({ c, open, sluit, kies, bezig }: { c: Concept; open: boolean; sluit: () => void; kies: () => void; bezig: boolean }) {
  const [soort, setSoort] = useState<"pc" | "tel">(() => (window.matchMedia("(max-width: 760px)").matches ? "tel" : "pc"));
  const telefoon = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  useEffect(() => {
    if (!open) return;
    const oud = document.body.style.overflow; document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") sluit(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = oud; window.removeEventListener("keydown", esc); };
  }, [open, sluit]);
  if (!open) return null;
  // Via een portal op body: een kaart met een animatie is anders het kader van position: fixed.
  return createPortal(
    <div className="gw gw-bekijker" role="dialog" aria-modal="true" aria-label={c.naam}>
      <div className="gw-bekijker-balk">
        <div className="gw-bekijker-naam"><b>0{c.n}</b>{c.naam}</div>
        {!telefoon ? (
          <div className="gw-schakel" role="group" aria-label="Weergave">
            <button type="button" className={soort === "pc" ? "is-aan" : ""} onClick={() => setSoort("pc")}><Monitor size={16} /> Pc</button>
            <button type="button" className={soort === "tel" ? "is-aan" : ""} onClick={() => setSoort("tel")}><Smartphone size={16} /> Telefoon</button>
          </div>
        ) : null}
        <div className="gw-bekijker-acties">
          <button type="button" className="sn-btn3d h-button gw-kies" onClick={kies} disabled={bezig}><span className="sn-btn3d-sheen" /><span>Deze wil ik</span><span className="h-button-icon"><Check size={16} /></span></button>
          <button type="button" className="gw-sluit" onClick={sluit} aria-label="Sluiten"><X size={20} /></button>
        </div>
      </div>
      <div className={`gw-bekijker-vlak is-${telefoon ? "vol" : soort}`}>
        <iframe src={c.url} title={c.naam} sandbox="" />
      </div>
    </div>,
    document.body,
  );
}

export default function GratisWebsite() {
  const { language, t } = useLanguage();
  const [a, setA] = useState<Record<string, string>>({});
  const [g, setG] = useState<Gegevens>({ voornaam: "", achternaam: "", bedrijf: "", email: "", mobiel: "" });
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fase, setFase] = useState<Fase>("formulier");
  const [uitslag, setUitslag] = useState<Uitslag | null>(null);
  const [laadKlaar, setLaadKlaar] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [kiesBezig, setKiesBezig] = useState(false);
  const bovenkant = useRef<HTMLDivElement>(null);

  useEffect(() => { const x = laad(); setA(x.a); setG(x.g); }, []);
  useEffect(() => { if (fase === "formulier") try { localStorage.setItem(OPSLAG, JSON.stringify({ a, g })); } catch {} }, [a, g, fase]);
  // Wie herlaadt of terugkomt, ziet zijn concepten terug.
  useEffect(() => {
    let id = "", site = ""; try { const o = JSON.parse(localStorage.getItem(CONCEPT_OPSLAG) || "null"); id = o?.id || ""; site = o?.site || ""; } catch {}
    if (!id) return;
    fetch(`${CONCEPT_API}?id=${encodeURIComponent(id)}&status=1`, { signal: AbortSignal.timeout(10000) }).then((r) => r.json()).then((j) => {
      if (j?.status === "klaar" && Array.isArray(j.concepten) && j.concepten.length) { setUitslag({ ...normaal(j), site }); setFase(j.keuze ? "gekozen" : "concepten"); }
    }).catch(() => {});
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [fase]);

  const zet = (k: string, v: string) => setA((x) => ({ ...x, [k]: v }));
  const gevuld = VRAGEN.filter((v) => (a[v.key] || "").trim()).length + [g.voornaam, g.achternaam, g.bedrijf, g.email, g.mobiel].filter((x) => x.trim()).length;
  const procent = Math.round((gevuld / (VRAGEN.length + 5)) * 100);
  const naam = `${g.voornaam.trim()} ${g.achternaam.trim()}`.trim();

  function normaal(j: any): Uitslag {
    return { id: j.id, bedrijf: j.bedrijf || g.bedrijf, site: domein(a.website || ""), keuze: j.keuze || null, overzicht: volledig(j.overzicht || ""), bron: j.bron, concepten: (j.concepten || []).map((c: any) => ({ ...c, url: volledig(c.url) })) };
  }

  // Maakt de concepten; bij een verbroken verbinding vraagt hij de stand op tot ze er zijn.
  async function maak(id: string): Promise<Uitslag | null> {
    const lijf = JSON.stringify({ id, bedrijf: g.bedrijf.trim(), website: (a.website || "").trim(), voorbeeld: (a.voorbeeld || "").trim(), wat: (a.wat || "").trim(), nietgoed: (a.nietgoed || "").trim(), taal: language });
    const eind = Date.now() + 150_000;
    for (let poging = 0; poging < 2 && Date.now() < eind; poging++) {
      try {
        const r = await fetch(CONCEPT_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: lijf, signal: AbortSignal.timeout(125_000) });
        const j = await r.json().catch(() => null);
        if (r.ok && j?.status === "klaar") return normaal(j);
        if (r.status !== 202 && r.status !== 409 && r.status < 500) return null;
      } catch { /* verbinding weg: de server werkt door, dus de stand opvragen */ }
      while (Date.now() < eind) {
        await wacht(4000);
        try {
          const j = await fetch(`${CONCEPT_API}?id=${id}&status=1`, { signal: AbortSignal.timeout(10000) }).then((r) => r.json());
          if (j?.status === "klaar") return normaal(j);
          if (!j?.ok) break;
        } catch {}
      }
    }
    return null;
  }

  const verstuur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bezig) return;
    if (!g.voornaam.trim()) { setFout(t("Vul je naam in.")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) { setFout(t("Dat e-mailadres klopt nog niet.")); return; }
    if (g.mobiel.replace(/\D/g, "").length < 8) { setFout(t("Vul je telefoonnummer in, dan bellen we je.")); return; }
    if (!g.bedrijf.trim() && !(a.website || "").trim()) { setFout(t("Vul je bedrijfsnaam of je website in.")); return; }
    setFout(""); setBezig(true);
    const id = uuid();
    const link = `${CONCEPT_API}?id=${id}`;
    const antwoorden = [
      ...VRAGEN.map((v) => ({ vraag: v.vraag, antwoord: (a[v.key] || "").trim() })).filter((x) => x.antwoord),
      { vraag: "Drie website-concepten", antwoord: link },
    ];
    // 26 september 2026: de aanmelding (lead, leadmail, welkomstmail) en de concepten lopen tegelijk.
    // os.socialnow.nl antwoordt pas als de mails de deur uit zijn; koud opgestart duurde dat live 15 s,
    // en met de oude grens van 12 s zag de bezoeker "versturen lukte niet" terwijl alles binnenkwam.
    // Alleen een echte weigering (400) brengt je terug naar het formulier.
    const aanmelding = fetch(AANMELD_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bron: "website", naam, email: g.email.trim(), mobiel: g.mobiel.trim(), bedrijf: g.bedrijf.trim(), website: a.website || "", taal: language, antwoorden, concepten: link, voorwaarden: LEGAL_VERSION }),
      signal: AbortSignal.timeout(45000),
    }).then(async (r) => ({ status: r.status, j: await r.json().catch(() => null) })).catch(() => ({ status: 0, j: null }));
    try { localStorage.removeItem(OPSLAG); localStorage.setItem(CONCEPT_OPSLAG, JSON.stringify({ id, site: domein(a.website || "") })); } catch {}
    setBezig(false); setLaadKlaar(false); setFase("laden");
    const concepten = maak(id);
    const aan = await aanmelding;
    if (aan.status === 400) {
      try { localStorage.setItem(OPSLAG, JSON.stringify({ a, g })); localStorage.removeItem(CONCEPT_OPSLAG); } catch {}
      setFout(t(String(aan.j?.error || "Het versturen lukte niet. Probeer het zo nog eens."))); setFase("formulier"); return;
    }
    const uit = await concepten;
    if (!uit) { setUitslag({ id, bedrijf: g.bedrijf, concepten: [], overzicht: link, keuze: null }); setFase("later"); return; }
    setLaadKlaar(true);
    await wacht(750);
    setUitslag(uit); setFase("concepten");
  };

  const kies = async (n: number) => {
    if (!uitslag || kiesBezig) return;
    setKiesBezig(true);
    try { await fetch(CONCEPT_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: uitslag.id, keuze: n }), signal: AbortSignal.timeout(10000) }); } catch {}
    setUitslag({ ...uitslag, keuze: n }); setOpen(null); setKiesBezig(false); setFase("gekozen");
  };

  if (fase === "laden") return <Laden bedrijf={g.bedrijf.trim() || domein(a.website || "")} site={domein(a.website || "")} klaar={laadKlaar} />;

  if (fase === "later" && uitslag) return (
    <section className="gw gw-klaar"><div className="gw-sheet">
      <span className="gw-vink"><Check size={30} /></span>
      <h1>Top, we bellen je.</h1>
      <p className="gw-lead">Je aanvraag is binnen. Je drie concepten staan zo klaar; open ze straks via deze link of via de mail die je van ons krijgt.</p>
      <a className="sn-btn3d h-button gw-knop" href={uitslag.overzicht} target="_blank" rel="noopener"><span className="sn-btn3d-sheen" /><span>Bekijk je concepten</span><span className="h-button-icon"><ArrowUpRight size={16} /></span></a>
    </div></section>
  );

  if ((fase === "concepten" || fase === "gekozen") && uitslag) {
    const gekozen = uitslag.concepten.find((c) => c.n === uitslag.keuze);
    return (
      <section className="gw gw-resultaat" ref={bovenkant}>
        <div className="gw-breed">
          <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>{fase === "gekozen" ? "Keuze ontvangen" : "Klaar"}</p>
          {fase === "gekozen" && gekozen ? (
            <>
              <h1><span>Top, je koos</span> <span className="gw-accent">{gekozen.naam}</span></h1>
              <p className="gw-lead">We bellen je vandaag en werken hem samen met jou uit tot je nieuwe website. Wil je nog eens kijken? Alle drie staan hieronder.</p>
            </>
          ) : (
            <>
              <h1>Drie websites voor <span className="gw-accent">{uitslag.bedrijf || "jou"}</span></h1>
              <p className="gw-lead">{uitslag.site ? <><span>Gemaakt uit de scan van</span> <b>{uitslag.site}</b> <span>en jouw antwoorden.</span></> : <span>Gemaakt uit jouw antwoorden.</span>} <span>Open ze, scroll erdoor en kies je favoriet.</span></p>
            </>
          )}
          <div className="gw-kaarten">
            {uitslag.concepten.map((c) => (
              <article key={c.n} className={`gw-kaart${uitslag.keuze === c.n ? " is-gekozen" : ""}`}>
                <button type="button" className="gw-kaart-beeld" onClick={() => setOpen(c.n)} aria-label={`Open ${c.naam}`}>
                  <Apparaten url={c.url} naam={c.naam} />
                  <span className="gw-open">Bekijk <ArrowUpRight size={15} /></span>
                </button>
                <div className="gw-kaart-tekst">
                  <span className="gw-num">0{c.n}</span>
                  <h2>{c.naam}</h2>
                  <p>{c.uitleg}</p>
                </div>
                <div className="gw-kaart-acties">
                  {uitslag.keuze === c.n ? <span className="gw-gekozen"><Check size={16} /> Jouw keuze</span> : (
                    <button type="button" className="sn-btn3d h-button gw-kies" onClick={() => kies(c.n)} disabled={kiesBezig}><span className="sn-btn3d-sheen" /><span>Deze wil ik</span><span className="h-button-icon"><Check size={16} /></span></button>
                  )}
                  <button type="button" className="gw-tekstknop" onClick={() => setOpen(c.n)}>Volledig scherm</button>
                </div>
                <Bekijker c={c} open={open === c.n} sluit={() => setOpen(null)} kies={() => kies(c.n)} bezig={kiesBezig} />
              </article>
            ))}
          </div>
          <a className="gw-os" href={CLAIM_URL}>
            <span><small>Ondertussen</small>Probeer ons gratis persoonlijke OS</span>
            <ArrowUpRight size={20} />
          </a>
        </div>
      </section>
    );
  }

  const veld = (v: Vraag) => (
    <label className="gw-fld" key={v.key} htmlFor={`gw-${v.key}`}>
      <span className="gw-l">{t(v.vraag)}</span>
      <span className="gw-h">{t(v.hint)}</span>
      {v.type === "text" ? (
        <input id={`gw-${v.key}`} value={a[v.key] || ""} maxLength={200} inputMode="url" autoCapitalize="none" autoCorrect="off" onChange={(e) => zet(v.key, e.target.value)} />
      ) : (
        <textarea id={`gw-${v.key}`} rows={3} value={a[v.key] || ""} maxLength={1500} onChange={(e) => zet(v.key, e.target.value)} />
      )}
    </label>
  );

  return (
    <div className="gw">
      <div className="gw-sheet">
        <p className="gw-eyebrow"><i className="gw-stipjes"><b /><b /><b /></i>Gratis website-upgrade / Odoo Experience, stand C21</p>
        <h1>Je nieuwe website. <span className="gw-accent">Gratis.</span></h1>
        <p className="gw-lead">Twee minuten invullen. Daarna maakt SocialNow AI meteen drie ontwerpen van je nieuwe website, op pc en telefoon.</p>
        <ul className="gw-beloftes">
          <li><Check size={15} /> Drie concepten in je eigen stijl</li>
          <li><Check size={15} /> Uit je logo, kleuren en foto's</li>
          <li><Check size={15} /> Wij bellen je dezelfde dag</li>
        </ul>
        <div className="gw-progress" aria-label={t("Voortgang")}>
          <div className="gw-bar"><div className="gw-fill" style={{ width: `${procent}%` }} /></div>
          <div className="gw-meta"><span><i className="gw-dot" />Automatisch bewaard</span><span>{procent}%</span></div>
        </div>
        <form onSubmit={verstuur} noValidate>
          <section className="gw-sec">
            <div className="gw-sec-head"><span className="gw-num">01</span><h2>Jij</h2></div>
            <div className="gw-card">
              <div className="gw-rij">
                <label className="gw-fld" htmlFor="gw-voornaam"><span className="gw-l">Voornaam</span><input id="gw-voornaam" autoComplete="given-name" maxLength={40} value={g.voornaam} onChange={(e) => setG({ ...g, voornaam: e.target.value })} /></label>
                <label className="gw-fld" htmlFor="gw-achternaam"><span className="gw-l">Achternaam</span><input id="gw-achternaam" autoComplete="family-name" maxLength={40} value={g.achternaam} onChange={(e) => setG({ ...g, achternaam: e.target.value })} /></label>
              </div>
              <div className="gw-rij">
                <label className="gw-fld" htmlFor="gw-email"><span className="gw-l">E-mailadres</span><input id="gw-email" type="email" autoComplete="email" inputMode="email" maxLength={254} value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} /></label>
                <label className="gw-fld" htmlFor="gw-mobiel"><span className="gw-l">Telefoonnummer</span><input id="gw-mobiel" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={g.mobiel} onChange={(e) => setG({ ...g, mobiel: e.target.value })} /></label>
              </div>
              <label className="gw-fld" htmlFor="gw-bedrijf"><span className="gw-l">Bedrijfsnaam</span><input id="gw-bedrijf" autoComplete="organization" maxLength={120} value={g.bedrijf} onChange={(e) => setG({ ...g, bedrijf: e.target.value })} /></label>
            </div>
          </section>
          <section className="gw-sec">
            <div className="gw-sec-head"><span className="gw-num">02</span><h2>Je website</h2></div>
            <div className="gw-card">
              <div className="gw-rij">{VRAGEN.slice(0, 2).map(veld)}</div>
              {VRAGEN.slice(2).map(veld)}
            </div>
            <p className="gw-juridisch">Met versturen ga je akkoord met onze <a href="/voorwaarden/">algemene voorwaarden</a> en ons <a href="/privacy/">privacybeleid</a>.</p>
            {fout ? <p className="gw-fout" role="alert">{fout}</p> : null}
            <button type="submit" className="sn-btn3d h-button gw-verder" disabled={bezig}>
              <span className="sn-btn3d-sheen" />
              <span>{bezig ? t("Even geduld…") : t("Maak mijn drie websites")}</span>
              <span className="h-button-icon"><ArrowUpRight size={16} /></span>
            </button>
          </section>
        </form>
        <a className="gw-os" href={CLAIM_URL}>
          <span><small>Liever eerst zelf kijken?</small>Probeer ons gratis persoonlijke OS</span>
          <ArrowUpRight size={20} />
        </a>
      </div>
    </div>
  );
}
