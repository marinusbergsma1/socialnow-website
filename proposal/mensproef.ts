// De mensproef aan de kant van de browser. Het waarom staat in socialnow-os-os/api/_mensproef.js.
//
// 26 september 2026 (Marinus: "BOUW HET BESTE ANTI BOT SYSTEEM MOGELIJK"). Sinds 23 september riepen
// bots de aanvraagingangen van os.socialnow.nl rechtstreeks aan, zonder deze site te openen. Een
// formulier dat hierheen post, haalt daarom bij het openen een ondertekende opgave op en zoekt op de
// achtergrond het getal dat erbij hoort, in plakjes van een paar milliseconden, zodat typen en scrollen
// gewoon doorgaan. Bij het versturen gaat het antwoord mee. Een script dat alleen het verzoek naspeelt,
// heeft dat antwoord niet.
//
// Geeft de server een Turnstile sitekey mee (dat doet hij zodra Cloudflare Turnstile in Vercel is
// ingesteld), dan laadt deze module ook het vinkje van Cloudflare. Dat blijft onzichtbaar zolang
// Cloudflare niet twijfelt. Lukt het ophalen van de opgave niet, omdat os.socialnow.nl hem nog niet kent
// of even weg is, dan gaat de aanvraag zonder antwoord en beslist de server zelf.
//
// Geen React hier, zodat Node de rekenkant kan nalopen (scripts/check-mensproef.mjs). De hook staat in
// useMensproef.ts.

export const UITDAGING = "https://os.socialnow.nl/api/uitdaging";
// De server geeft twintig minuten; na achttien halen we voor de zekerheid een nieuwe.
const VERS_MS = 18 * 60_000;
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export type Opgave = { ok?: boolean; uit?: boolean; v: number; zout: string; opgave: string; max: number; handtekening: string; wacht?: number; turnstile?: string };
export type Antwoord = { v: number; zout: string; opgave: string; max: number; handtekening: string; getal: number };
export type Bewijs = { mensproef?: Antwoord; turnstile?: string };

// SHA-256 van een korte ASCII tekst, als hex. Een eigen uitvoering, want crypto.subtle is asynchroon en
// per aanroep veel te traag voor honderdduizenden kleine hashes. Twee blokken zijn genoeg: het zout is
// hooguit zestig tekens en het getal hooguit acht cijfers.
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
const W = new Int32Array(64);
const BLOK = new Int32Array(32);
const UIT = new Int32Array(8);
const hex = (v: number) => (v >>> 0).toString(16).padStart(8, "0");

export function sha256hex(tekst: string): string {
  hash(tekst);
  let s = "";
  for (let i = 0; i < 8; i++) s += hex(UIT[i]);
  return s;
}

// De hash zelf, in UIT als acht woorden. losOp vergelijkt die woorden met de opgave, zonder er eerst
// tekst van te maken: dat scheelt het meeste werk per poging.
function hash(tekst: string): void {
  const n = tekst.length;
  if (n > 119) throw new Error("te_lang");
  const woorden = n + 9 > 64 ? 32 : 16;
  BLOK.fill(0, 0, woorden);
  for (let i = 0; i < n; i++) {
    const c = tekst.charCodeAt(i);
    if (c > 127) throw new Error("geen_ascii");
    BLOK[i >> 2] |= c << (24 - (i & 3) * 8);
  }
  BLOK[n >> 2] |= 0x80 << (24 - (n & 3) * 8);
  BLOK[woorden - 1] = n * 8;
  let h0 = 0x6a09e667 | 0, h1 = 0xbb67ae85 | 0, h2 = 0x3c6ef372 | 0, h3 = 0xa54ff53a | 0;
  let h4 = 0x510e527f | 0, h5 = 0x9b05688c | 0, h6 = 0x1f83d9ab | 0, h7 = 0x5be0cd19 | 0;
  for (let blok = 0; blok < woorden; blok += 16) {
    for (let t = 0; t < 16; t++) W[t] = BLOK[blok + t];
    for (let t = 16; t < 64; t++) {
      const x = W[t - 15], y = W[t - 2];
      const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
      const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let t = 0; t < 64; t++) {
      const s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const t1 = (h + s1 + ((e & f) ^ (~e & g)) + K[t] + W[t]) | 0;
      const s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const t2 = (s0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
  }
  UIT[0] = h0; UIT[1] = h1; UIT[2] = h2; UIT[3] = h3; UIT[4] = h4; UIT[5] = h5; UIT[6] = h6; UIT[7] = h7;
}

const pauze = () => new Promise<void>(klaar => setTimeout(klaar, 0));

// Zoekt het getal bij de opgave, in plakjes van plakMs, zodat de pagina blijft reageren. Geeft -1 als
// het er niet is (dan klopt de opgave niet en gaat de aanvraag zonder antwoord).
export async function losOp(o: Pick<Opgave, "zout" | "opgave" | "max">, plakMs = 12): Promise<number> {
  if (!/^[a-f0-9]{64}$/.test(o.opgave)) return -1;
  const doel = new Int32Array(8);
  for (let i = 0; i < 8; i++) doel[i] = parseInt(o.opgave.slice(i * 8, i * 8 + 8), 16) | 0;
  let begin = Date.now();
  for (let n = 0; n <= o.max; n++) {
    hash(o.zout + n);
    if (UIT[0] === doel[0] && UIT[1] === doel[1] && UIT[2] === doel[2] && UIT[3] === doel[3]
      && UIT[4] === doel[4] && UIT[5] === doel[5] && UIT[6] === doel[6] && UIT[7] === doel[7]) return n;
    if ((n & 1023) === 1023 && Date.now() - begin >= plakMs) { await pauze(); begin = Date.now(); }
  }
  return -1;
}

type Turnstile = {
  render: (vak: HTMLElement, opties: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
const turnstile = () => (globalThis as unknown as { turnstile?: Turnstile }).turnstile;

let scriptBelofte: Promise<void> | null = null;
function laadTurnstile(): Promise<void> {
  if (turnstile()) return Promise.resolve();
  if (!scriptBelofte) {
    scriptBelofte = new Promise<void>((klaar, fout) => {
      const s = document.createElement("script");
      s.src = TURNSTILE_SCRIPT;
      s.async = true;
      s.onload = () => klaar();
      s.onerror = () => { scriptBelofte = null; fout(new Error("turnstile_laden")); };
      document.head.appendChild(s);
    });
  }
  return scriptBelofte;
}

type Huidig = { opgave: Opgave; ontvangen: number; getal: Promise<number> };

// Eén formulier, één route. start() bij het openen; voorVersturen() levert wat mee moet met de POST en
// begint meteen aan een nieuwe opgave, want elke opgave en elk token werkt maar één keer.
export class Mensproef {
  route: string;
  url: string;
  huidig: Huidig | null = null;
  laden: Promise<void> | null = null;
  sitekey = "";
  vak: HTMLElement | null = null;
  widget: string | null = null;
  token = "";
  wachters: ((token: string) => void)[] = [];

  constructor(route: string, url: string = UITDAGING) {
    this.route = route;
    this.url = url;
  }

  start(): void {
    if (!this.laden) this.laden = this.haal();
    if (this.sitekey) void this.teken();
  }

  async haal(): Promise<void> {
    this.huidig = null;
    try {
      const r = await fetch(`${this.url}?route=${encodeURIComponent(this.route)}`, { cache: "no-store", credentials: "omit" });
      const o = (await r.json().catch(() => null)) as Opgave | null;
      if (!r.ok || !o || o.ok !== true || o.uit || typeof o.zout !== "string" || typeof o.opgave !== "string") return;
      this.huidig = { opgave: o, ontvangen: Date.now(), getal: losOp(o) };
      if (o.turnstile && !this.sitekey) { this.sitekey = o.turnstile; void this.teken(); }
    } catch { /* geen opgave: de aanvraag gaat zonder antwoord */ }
  }

  koppelVak(vak: HTMLElement | null): void {
    this.vak = vak;
    if (vak && this.sitekey) void this.teken();
  }

  async teken(): Promise<void> {
    if (!this.vak || !this.sitekey || this.widget) return;
    try { await laadTurnstile(); } catch { return; }
    const ts = turnstile();
    if (!ts || !this.vak || this.widget) return;
    this.widget = ts.render(this.vak, {
      sitekey: this.sitekey,
      action: this.route,
      appearance: "interaction-only",
      callback: (token: string) => { this.token = token; for (const w of this.wachters.splice(0)) w(token); },
      "expired-callback": () => { this.token = ""; },
      "error-callback": () => { this.token = ""; },
    });
  }

  wachtOpToken(maxMs: number): Promise<string> {
    if (this.token || !this.widget) return Promise.resolve(this.token);
    return new Promise(klaar => {
      const klok = setTimeout(() => { this.wachters = this.wachters.filter(w => w !== af); klaar(this.token); }, maxMs);
      const af = (token: string) => { clearTimeout(klok); klaar(token); };
      this.wachters.push(af);
    });
  }

  async voorVersturen(): Promise<Bewijs> {
    this.start();
    await this.laden;
    if (!this.huidig || Date.now() - this.huidig.ontvangen > VERS_MS) { this.laden = this.haal(); await this.laden; }
    const h = this.huidig;
    const bewijs: Bewijs = {};
    if (h) {
      const getal = await h.getal;
      // De server weigert een antwoord dat sneller komt dan een mens kan; wie heel snel is, wacht even.
      const nogWachten = (h.opgave.wacht || 0) + 150 - (Date.now() - h.ontvangen);
      if (nogWachten > 0) await new Promise(klaar => setTimeout(klaar, nogWachten));
      if (getal >= 0) bewijs.mensproef = { v: h.opgave.v, zout: h.opgave.zout, opgave: h.opgave.opgave, max: h.opgave.max, handtekening: h.opgave.handtekening, getal };
    }
    if (this.sitekey) {
      const token = await this.wachtOpToken(15_000);
      if (token) bewijs.turnstile = token;
    }
    // Verbruikt. Een volgende poging krijgt een nieuwe opgave en een nieuw token.
    this.token = "";
    const ts = turnstile();
    if (this.widget && ts) ts.reset(this.widget);
    this.laden = this.haal();
    return bewijs;
  }

  stop(): void {
    const ts = turnstile();
    if (this.widget && ts) ts.remove(this.widget);
    this.widget = null;
    this.token = "";
  }
}
