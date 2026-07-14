import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, X, Info } from 'lucide-react';

const MAX_CHARS = 500;

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

interface MiloChatProps {
  open: boolean;
  onClose: () => void;
}

const MiloChat: React.FC<MiloChatProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const ask = useCallback((raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setMsgs(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setTyping(true);
    // Kort "denk"-moment voor een natuurlijk gevoel
    setTimeout(() => {
      setTyping(false);
      setMsgs(prev => [...prev, getAnswer(q)]);
    }, 700 + Math.random() * 500);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed z-[95] bottom-4 inset-x-4 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[360px] rounded-3xl border border-white/10 bg-[#0b0b0b]/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_30px_rgba(37,211,102,0.12)] flex flex-col overflow-hidden"
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

      {/* Berichten */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[46vh] sm:max-h-[380px]">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
              m.role === 'user'
                ? 'bg-[#25D366] text-black font-semibold rounded-br-md'
                : 'bg-white/[0.06] text-white/90 rounded-bl-md border border-white/[0.06]'
            }`}>
              {m.text}
              {m.links && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {m.links.map((l) => (
                    <a
                      key={l.href + l.label}
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        // Interne routes via de SPA-router (geen page reload)
                        if (l.href.startsWith('/')) { e.preventDefault(); onClose(); navigate(l.href); }
                      }}
                      className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#25D366] border border-[#25D366]/40 rounded-full px-3 py-1.5 hover:bg-[#25D366] hover:text-black transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Snelle vragen */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => ask(q)}
            className="text-[10px] font-bold uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-2.5 py-1.5 hover:text-[#25D366] hover:border-[#25D366]/40 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Invoer — rijke glowende composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="px-4 pb-3 pt-2 border-t border-white/[0.07]"
      >
        <div className="relative rounded-2xl bg-white/[0.04] border border-white/10 focus-within:border-[#25D366]/50 focus-within:shadow-[0_0_20px_rgba(37,211,102,0.15)] transition-all overflow-hidden">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
            rows={2}
            maxLength={MAX_CHARS}
            placeholder="Stel je vraag aan Milo — diensten, prijzen, de gratis demo…"
            className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[13px] leading-relaxed text-white placeholder-white/30 outline-none"
            style={{ scrollbarWidth: 'none' }}
          />
          <div className="flex items-center justify-between px-3 pb-2.5">
            <span className="text-[10px] font-medium text-white/30 tabular-nums">
              {input.length}<span className="text-white/20">/{MAX_CHARS}</span>
            </span>
            <button
              type="submit"
              aria-label="Versturen"
              disabled={!input.trim()}
              className="group relative w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#25D366] to-[#17a94d] text-black flex items-center justify-center transition-all duration-300 enabled:hover:scale-110 enabled:hover:shadow-[0_0_18px_rgba(37,211,102,0.6)] enabled:active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} className="transition-transform duration-300 group-enabled:group-hover:-translate-y-0.5 group-enabled:group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Footer — hint + status */}
        <div className="flex items-center justify-between mt-2 text-[10px] text-white/30 gap-4">
          <span className="flex items-center gap-1.5">
            <Info size={11} />
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/10 rounded text-white/50 font-mono">Shift + Enter</kbd> voor nieuwe regel
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            Milo is online
          </span>
        </div>
      </form>
    </div>
  );
};

export default MiloChat;
