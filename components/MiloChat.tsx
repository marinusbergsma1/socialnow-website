import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, X } from 'lucide-react';

const MAX_CHARS = 500;

// Endpoint van de Gemini-proxy (Cloudflare Worker, zie /worker). Leeg = Milo
// draait puur op de ingebouwde kennisbank. Vul in na deploy van de Worker,
// bijv. via build-var VITE_MILO_API_URL of hier hardcoded.
const MILO_API_URL = (import.meta.env.VITE_MILO_API_URL as string | undefined) || '';

/**
 * MiloChat — persoonlijke AI-assistent, getraind op SocialNow-data.
 *
 * Architectuur: `getAnswer()` is de enige plek die antwoorden levert. Nu draait
 * die op een lokale kennisbank (keyword-retrieval over echte SocialNow-content:
 * diensten, prijzen, werkwijze, cases, contact). Zodra er een backend-endpoint
 * is (bv. Cloudflare Worker → Claude API), vervang je alleen de body van
 * getAnswer() door een fetch — de UI en de kennisbank-context blijven gelijk.
 */

type Msg = { role: 'milo' | 'user'; text: string; links?: { label: string; href: string }[] };

const WHATSAPP = 'https://wa.me/31637404577?text=Hoi%20SocialNow!';
const MAIL = 'mailto:info@socialnow.nl';

// Vaste contact-chip onder elk Gemini-antwoord: Milo blijft op contact sturen.
const CONTACT_LINKS = [{ label: 'App Marinus', href: WHATSAPP }];

// ─── Kennisbank: SocialNow-data ─────────────────────────────────────────
type KBEntry = { keywords: string[]; answer: string; links?: { label: string; href: string }[] };

const KB: KBEntry[] = [
  {
    keywords: ['gratis', 'proof of concept', 'poc', 'demo', 'vrijblijvend', 'kosteloos', 'free'],
    answer: 'Je start bij ons altijd met een gratis proof of concept: een complete website demo én rebranding. Je ziet het werken vóórdat je iets betaalt — helemaal vrijblijvend. Binnen 1 week na je discovery call heb je \'m in handen. 🚀',
    links: [{ label: 'Claim je gratis proof of concept', href: WHATSAPP }],
  },
  {
    keywords: ['prijs', 'prijzen', 'kost', 'kosten', 'tarief', 'tarieven', 'investering', 'budget', 'euro', 'maand', 'abonnement'],
    answer: 'Content Automation start vanaf €3.000 per maand — inclusief branded content, planning, advertentie-optimalisatie en analytics. Eén partij die alles doet, geen losse freelancers of dure bureaus meer. En je begint altijd met een gratis proof of concept, dus je weet wat je krijgt.',
    links: [{ label: 'Bekijk alle prijzen', href: '/prijzen' }],
  },
  {
    keywords: ['dienst', 'diensten', 'service', 'services', 'wat doen', 'wat doet', 'aanbod', 'mogelijkheden'],
    answer: 'We bouwen alles onder één dak: AI-websitesystemen (met AI-chat, CRM en analytics), content automation, advertentie-optimalisatie, branding en maatwerk software. Alles komt samen in één overzichtelijke AI-chat — je website, CRM, content & ads.',
    links: [{ label: 'Bekijk onze diensten', href: '/diensten' }],
  },
  {
    keywords: ['website', 'webapp', 'site', 'crm', 'analytics', 'chatbot', 'ai chat', 'systeem'],
    answer: 'Ons website + AI-pakket is een complete site die werkt als je beste verkoper: hij overtuigt bezoekers, beantwoordt vragen via AI-chat en plant afspraken in — dag en nacht. Inclusief CRM, analytics-dashboard en branded content.',
    links: [{ label: 'Meer over onze aanpak', href: '/diensten' }],
  },
  {
    keywords: ['content', 'automation', 'social', 'instagram', 'posts', 'planning', 'ads', 'advertentie', 'adverteren'],
    answer: 'Ons AI-systeem leest dagelijks je advertentieresultaten, analyseert wat werkt voor jouw doelgroep en vertaalt dat direct naar je contentplanner. Elke maand automatisch ingepland — je zit nooit zonder content en je strategie is altijd up-to-date.',
  },
  {
    keywords: ['snel', 'hoelang', 'hoe lang', 'wanneer', 'resultaat', 'resultaten', 'duurt', 'termijn', 'week'],
    answer: 'Snel! Je gratis demo of content ontvang je binnen 1 week na je discovery call — geen maandenlange trajecten. Ter illustratie: VDZ-Brigade ging binnen 1 maand van nul naar veertien afspraken per week. 📈',
  },
  {
    keywords: ['bestaande', 'al een website', 'huidige site', 'upgrade', 'vernieuwen', 'redesign'],
    answer: 'Heb je al een website? Dan maken we een gratis demo-upgrade van je huidige site. We laten zien hoe jouw bestaande site kan werken als een compleet verkoopsysteem met AI, analytics en geautomatiseerde content.',
    links: [{ label: 'Vraag je demo-upgrade aan', href: WHATSAPP }],
  },
  {
    keywords: ['contact', 'bellen', 'mailen', 'afspraak', 'call', 'kennismaken', 'bereiken', 'telefoon', 'whatsapp', 'email', 'e-mail'],
    answer: 'Leuk! Je bereikt ons het snelst via WhatsApp of mail. We zitten aan de Amstelstraat 43G in Amsterdam en zijn bereikbaar op werkdagen van 9:00 tot 18:00.',
    links: [
      { label: 'WhatsApp ons', href: WHATSAPP },
      { label: 'info@socialnow.nl', href: MAIL },
    ],
  },
  {
    keywords: ['wie', 'team', 'jullie', 'amsterdam', 'kantoor', 'agency', 'bureau', 'over'],
    answer: 'SocialNow is een AI-gedreven creative agency uit Amsterdam (sinds 2021). We combineren menselijke creativiteit met AI-technologie: 500+ projecten, 4.9/5 van onze klanten. Ons werk zie je o.a. bij Universal, AZ en Amsterdam Light Festival.',
    links: [{ label: 'Ontmoet het team', href: '/team' }],
  },
  {
    keywords: ['portfolio', 'werk', 'projecten', 'cases', 'voorbeelden', 'klanten', 'referenties'],
    answer: 'Kijk gerust rond in ons portfolio — van Universal-campagnes tot complete websites en branding. Dagelijks nieuw werk vind je ook op @socialnow.nl op Instagram.',
    links: [{ label: 'Bekijk projecten', href: '/projecten' }],
  },
];

const FALLBACK: Msg = {
  role: 'milo',
  text: 'Goede vraag! Daar geef ik je liever een écht goed antwoord op dan een half — mijn team weet dit het beste. Stuur ons even een appje of mailtje, dan hoor je het snel. 💬',
  links: [
    { label: 'WhatsApp ons', href: WHATSAPP },
    { label: 'info@socialnow.nl', href: MAIL },
  ],
};

const GREETING: Msg = {
  role: 'milo',
  text: 'Hoi! Ik ben Milo, de AI-assistent van SocialNow. 👋 Vraag me alles over onze diensten, prijzen of de gratis proof of concept — of kies hieronder een vraag.',
};

const QUICK = [
  'Wat krijg ik precies gratis?',
  'Wat kost het?',
  'Welke diensten bieden jullie?',
  'Ik wil contact opnemen',
];

// Keyword-retrieval: beste KB-match op basis van hits in de vraag
const getAnswer = (q: string): Msg => {
  const s = q.toLowerCase();
  let best: KBEntry | null = null;
  let bestScore = 0;
  for (const entry of KB) {
    const score = entry.keywords.reduce((acc, k) => acc + (s.includes(k) ? (k.length > 4 ? 2 : 1) : 0), 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (!best || bestScore === 0) return FALLBACK;
  return { role: 'milo', text: best.answer, links: best.links };
};

// ─── Milo-bericht (Claude-stijl) — op module-niveau + memo, zodat typen in de
// composer NIET alle berichten (en avatars) remount: dat veroorzaakte lag. ───
const MILO_AVATAR = `${import.meta.env.BASE_URL}images/milo-avatar.webp?v=1`;

const MiloMessage = React.memo(({ m, partial, onLink }: {
  m: Msg;
  partial?: number;
  onLink: (e: React.MouseEvent, href: string) => void;
}) => (
  <div className="flex items-start gap-3">
    <img src={MILO_AVATAR} alt="" width={28} height={28} className="w-7 h-7 shrink-0 mt-0.5 object-contain select-none" draggable={false} />
    <div className="flex-1 min-w-0 text-[14px] leading-relaxed text-white/90 whitespace-pre-line pt-0.5">
      {partial !== undefined ? m.text.slice(0, partial) : m.text}
      {partial !== undefined && partial < m.text.length && (
        <span className="inline-block w-[7px] h-[15px] bg-[#25D366] align-text-bottom ml-0.5 animate-pulse rounded-[1px]" />
      )}
      {partial === undefined && m.links && (
        <div className="flex flex-wrap gap-2 mt-3">
          {m.links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={(e) => onLink(e, l.href)}
              className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#25D366] border border-[#25D366]/40 rounded-full px-3 py-1.5 hover:bg-[#25D366] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
));
MiloMessage.displayName = 'MiloMessage';

interface MiloChatProps {
  open: boolean;
  onClose: () => void;
}

const MiloChat: React.FC<MiloChatProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  // Streaming (Claude/GPT-gevoel): het antwoord verschijnt woord voor woord
  const [streaming, setStreaming] = useState<Msg | null>(null);
  const [streamLen, setStreamLen] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const msgsRef = useRef<Msg[]>(msgs);
  useEffect(() => { msgsRef.current = msgs; }, [msgs]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing, streamLen]);

  // Stream het antwoord in (~2-3 tekens per tick), daarna definitief toevoegen
  useEffect(() => {
    if (!streaming) return;
    const iv = setInterval(() => {
      setStreamLen((l) => {
        if (l >= streaming.text.length) {
          clearInterval(iv);
          setMsgs((prev) => [...prev, streaming]);
          setStreaming(null);
          return 0;
        }
        return l + 2 + Math.floor(Math.random() * 2);
      });
    }, 16);
    return () => clearInterval(iv);
  }, [streaming]);

  // Auto-groeiende invoer (zoals Claude): hoogte volgt de inhoud, tot 140px
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  // Vraag Gemini (via de Worker) om een antwoord; geef null terug bij geen URL/fout.
  const askGemini = async (q: string): Promise<Msg | null> => {
    if (!MILO_API_URL) return null;
    // Historie zonder de generieke begroeting, + de nieuwe vraag
    const history = [...msgsRef.current.filter((m) => m !== GREETING), { role: 'user' as const, text: q }]
      .map((m) => ({ role: m.role, text: m.text }));
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(MILO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.text) return null;
      return { role: 'milo', text: data.text, links: CONTACT_LINKS };
    } catch {
      return null; // val netjes terug op de kennisbank
    }
  };

  const ask = useCallback((raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setMsgs((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    const started = Date.now();
    askGemini(q).then((remote) => {
      const reply = remote || getAnswer(q); // Gemini, anders offline kennisbank
      // Minimaal ~500ms "denken", daarna streamt het antwoord in
      const wait = Math.max(0, 500 - (Date.now() - started));
      setTimeout(() => { setTyping(false); setStreamLen(0); setStreaming(reply); }, wait);
    });
  }, []);

  // Stabiele link-handler zodat MiloMessage (memo) niet her-rendert bij typen
  const handleLink = useCallback((e: React.MouseEvent, href: string) => {
    if (href.startsWith('/')) { e.preventDefault(); onClose(); navigate(href); }
  }, [onClose, navigate]);

  if (!open) return null;

  return (
    <div
      className="fixed z-[95] inset-0 sm:inset-auto sm:left-6 sm:bottom-6 sm:w-[440px] sm:h-[min(660px,calc(100vh-3rem))] rounded-none sm:rounded-3xl border-0 sm:border border-white/10 bg-[#0b0b0b]/98 sm:bg-[#0b0b0b]/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_30px_rgba(37,211,102,0.12)] flex flex-col overflow-hidden"
      role="dialog"
      aria-label="Milo AI-assistent"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
        <div className="relative w-11 h-11 shrink-0">
          <video autoPlay muted loop playsInline aria-hidden="true" className="w-full h-full object-contain">
            <source src={`${import.meta.env.BASE_URL}video/milo-blink.webm?v=2`} type="video/webm" />
            <source src={`${import.meta.env.BASE_URL}video/milo-blink.mp4?v=2`} type="video/mp4" />
          </video>
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#0b0b0b]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black uppercase tracking-wider text-sm leading-none">Milo</p>
          <p className="text-[#25D366] text-[10px] font-bold uppercase tracking-[0.15em] mt-1">AI-assistent · online</p>
        </div>
        <button onClick={onClose} aria-label="Chat sluiten" className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Berichten — Claude-stijl: assistent kaal met avatar, gebruiker in bubbel */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-5">
        {msgs.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[82%] rounded-2xl rounded-br-md bg-[#25D366] text-white font-medium px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-line">
                {m.text}
              </div>
            </div>
          ) : (
            <MiloMessage key={i} m={m} onLink={handleLink} />
          )
        ))}

        {/* Streamend antwoord */}
        {streaming && <MiloMessage m={streaming} partial={streamLen} onLink={handleLink} />}

        {/* Denk-indicator */}
        {typing && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 shrink-0" />
            <div className="flex gap-1.5 pt-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggesties — alleen bij de start, zoals Claude/GPT */}
        {msgs.length === 1 && !typing && !streaming && (
          <div className="flex flex-col items-start gap-2 pt-1 pl-10">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="text-left text-[12px] font-medium text-white/60 border border-white/10 rounded-xl px-3.5 py-2 hover:text-white hover:border-[#25D366]/50 hover:bg-[#25D366]/[0.06] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Invoer — Claude-stijl composer: auto-groeiend, ronde pijl-knop */}
      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="px-4 sm:px-5 pb-3 pt-2"
      >
        <div className="flex items-end gap-2 rounded-2xl bg-white/[0.05] border border-white/10 focus-within:border-[#25D366]/50 focus-within:shadow-[0_0_20px_rgba(37,211,102,0.12)] transition-all px-4 py-2.5">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
            rows={1}
            maxLength={MAX_CHARS}
            placeholder="Vraag het aan Milo…"
            className="flex-1 resize-none bg-transparent py-1 text-[14px] leading-relaxed text-white placeholder-white/30 outline-none"
            style={{ scrollbarWidth: 'none' }}
          />
          <button
            type="submit"
            aria-label="Versturen"
            disabled={!input.trim() || typing || !!streaming}
            className="w-8 h-8 shrink-0 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 enabled:hover:scale-110 enabled:hover:shadow-[0_0_16px_rgba(37,211,102,0.55)] enabled:active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Disclaimer — zoals Claude/GPT */}
        <p className="text-center text-[10px] text-white/25 mt-2">
          Milo kan fouten maken. Neem voor zekerheid <a href="https://wa.me/31637404577" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#25D366] transition-colors">direct contact</a> op.
        </p>
      </form>
    </div>
  );
};

export default MiloChat;
