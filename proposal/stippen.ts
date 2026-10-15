// Stippen op socialnow.nl (11 oktober 2026, Marinus: "Ik wil de gehele site met dots hebben en overal waar nu in bentogrids
// vrij nikszeggende animaties staan kan je zulk soort dot animaties maken net als in de explainer video").
// Zelfde regels als de film (explainer-code/STIJL.md): raster van 32 px, stip r 1,6, geen gloed, geen extra vormen, alleen
// bestaande stippen belichten. Effecten: kleurgolf (geel, blauw, roze, groen), kleurburst (confetti via de stippen),
// lichtbalken (veeg rij voor rij), letters en cijfers uit stippen, vaste belichting. Stilstand mag: tekenen gebeurt alleen
// als er iets beweegt. Met "minder beweging" aan staat alles meteen in de eindstand, zonder animatie.

export const STIPKLEUR = {
  geel: "#F5C518", blauw: "#1f6fd1", roze: "#EC1670", groen: "#25D366",
  website: "#25D366", crm: "#1965C2", studio: "#F5940D", ads: "#EC1670", wit: "#ffffff",
} as const;
export type Kleur = keyof typeof STIPKLEUR | `#${string}`;
const GOLFKLEUREN: Kleur[] = ["geel", "blauw", "roze", "groen"];

type RGB = [number, number, number];
const hex = (k: Kleur): RGB => { const h = (STIPKLEUR as Record<string, string>)[k] || k; return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB; };
const sm = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
// Stil = prefers-reduced-motion of de knop "Animaties pauzeren" (proposal/motion.tsx zet dan data-motion-pauze="ja";
// niet data-motion="paused", want dat staat er ook even bij het laden, tot het eerste effect van de MotionProvider).
// Dan staat alles meteen in de eindstand; een lopend effect springt naar zijn eind.
let gepauzeerd = false, wacher: MutationObserver | null = null;
const leesPauze = () => { gepauzeerd = !!document.querySelector("[data-motion-pauze]"); };
export const minderBeweging = () => {
  if (typeof document !== "undefined" && !wacher) {
    leesPauze();
    wacher = new MutationObserver(() => { const was = gepauzeerd; leesPauze(); if (gepauzeerd && !was) velden.forEach((v) => v.naarEind()); });
    wacher.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["data-motion-pauze"] });
  }
  return gepauzeerd || (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
};
const mod = (a: number, b: number) => ((a % b) + b) % b;

type Effect = {
  t0: number; klaar?: boolean; dood?: boolean; af?: () => void;
  // waarde 0..1 voor stip (i, j) op tijd t (s); -1 = effect is voorbij (alleen afhankelijk van t)
  waarde: (i: number, j: number, t: number) => number;
  kleur: (i: number, j: number) => RGB;
  // Ring waarbinnen het effect op tijd t iets laat oplichten (veldcoördinaten); zonder: het hele veld.
  ring?: (t: number) => [x: number, y: number, binnen: number, buiten: number];
  eind?: () => void;  // eindstand bij minder beweging of pauze
};

export type VeldOpties = {
  stap?: number; r?: number;
  basis?: string | null;          // kleur van de rust-stippen; null = niet tekenen (de css-achtergrond doet dat)
  licht?: boolean;                // op wit: grijze stippen
  vast?: boolean;                 // canvas is position: fixed en volgt de scroll (sitebreed veld)
};

// Alle levende velden: samen stil bij een verborgen tab.
const velden = new Set<Veld>();
let tabWeg = false;
if (typeof document !== "undefined") document.addEventListener("visibilitychange", () => {
  tabWeg = document.hidden; velden.forEach((v) => v.wek());
});

export class Veld {
  readonly stap: number; readonly r: number;
  private ctx: CanvasRenderingContext2D; private dpr = 1;
  W = 0; H = 0; kol = 0; rij = 0;
  // Eerste stip in het canvas (veldcoördinaten), zo gekozen dat elke stip op 16 + stap·k in documentcoördinaten valt.
  private x0 = 16; private y0 = 16;
  private effecten: Effect[] = []; private lampjes = new Map<number, { rgb: RGB; a: number }>();
  private loopt = false; private basis: string | null; private vast: boolean; private ro?: ResizeObserver; private io?: IntersectionObserver;
  private inBeeld: boolean; private stilSinds = 0; private vuil = true;
  private vorig: number[] = [];  // gewiste vakken van het vorige beeld: x0, y0, x1, y1 (css-px van het canvas)

  constructor(readonly canvas: HTMLCanvasElement, o: VeldOpties = {}) {
    // Raster 32 px; fijner alleen als onderverdeling (16 of 8), zodat het grote raster erin blijft vallen.
    const s = o.stap ?? 32; this.stap = s >= 24 ? 32 : s >= 14 ? 16 : 8;
    this.r = o.r ?? 1.6; this.vast = !!o.vast; this.inBeeld = this.vast;
    this.basis = o.basis === undefined ? (o.licht ? "rgba(20,35,56,.16)" : "rgba(255,255,255,.13)") : o.basis;
    this.ctx = canvas.getContext("2d")!;
    minderBeweging(); velden.add(this); tabWeg = typeof document !== "undefined" && document.hidden;
    this.ro = new ResizeObserver(() => this.maat()); this.ro.observe(canvas); this.maat();
    if (this.vast) addEventListener("scroll", this.opScroll, { passive: true });
    else {
      // Een stippenscène tekent alleen in beeld; buiten beeld staat de tijd van haar effecten stil.
      this.io = new IntersectionObserver(([e]) => { this.inBeeld = e.isIntersecting; this.wek(); }); this.io.observe(canvas);
    }
  }
  stop() { this.ro?.disconnect(); this.io?.disconnect(); velden.delete(this); removeEventListener("scroll", this.opScroll); this.effecten = []; }
  private opScroll = () => {
    // Ook de rustige basis volgt documentcoördinaten bij scrollen.
    if (this.basis) this.vuil = true;
    if (this.basis || this.effecten.length || this.lampjes.size) this.lus();
  };
  private slaapt() { return tabWeg || !this.inBeeld; }
  // De IntersectionObserver meldt pas na het beeld; tijdens snel scrollen kijkt het veld vóór het tekenen zelf.
  private buiten() {
    if (this.vast) return false;
    const b = this.canvas.getBoundingClientRect();
    if (b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth) return false;
    this.inBeeld = false; return true;
  }
  // Na verborgen tab of buiten beeld: effecten schuiven de stilstand op, en het veld tekent weer als dat nodig is.
  wek() {
    if (this.slaapt()) { if (!this.stilSinds) this.stilSinds = performance.now(); return; }
    if (this.stilSinds) { const d = performance.now() - this.stilSinds; this.effecten.forEach((e) => (e.t0 += d)); this.stilSinds = 0; }
    if (this.vuil || this.effecten.length) this.lus();
  }
  naarEind() {
    for (const e of this.effecten) { e.eind?.(); e.klaar = true; e.af?.(); }
    this.effecten = []; this.vuil = true; this.lus();
  }
  private maat() {
    const b = this.canvas.getBoundingClientRect(); this.dpr = Math.min(2, devicePixelRatio || 1);
    this.W = b.width; this.H = b.height; this.canvas.width = Math.round(this.W * this.dpr); this.canvas.height = Math.round(this.H * this.dpr);
    this.lijn(b);
    this.vorig = []; this.vuil = true;
    if (this.slaapt() || this.buiten()) return;
    this.teken(performance.now());
  }
  // Rasteruitlijning: sitebreed staat het canvas op (0, 0) van het scherm; een scène ligt ergens in het document.
  private lijn(b = this.canvas.getBoundingClientRect()) {
    const { stap } = this;
    if (this.vast) { this.x0 = mod(16 - scrollX, stap); this.y0 = 16; }
    else { this.x0 = mod(16 - (b.left + scrollX), stap); this.y0 = mod(16 - (b.top + scrollY), stap); }
    this.kol = this.W > this.x0 ? Math.floor((this.W - this.x0) / stap) + 1 : 0;
    this.rij = this.vast ? Math.ceil(this.H / stap) : this.H > this.y0 ? Math.floor((this.H - this.y0) / stap) + 1 : 0;
  }
  // Veldcoördinaten: binnen een tegel = ten opzichte van het canvas; sitebreed = documentcoördinaten.
  private oy() { return this.vast ? scrollY : 0; }
  midden(el: Element): [number, number] {
    const a = el.getBoundingClientRect(), c = this.canvas.getBoundingClientRect();
    return [a.left + a.width / 2 - (this.vast ? 0 : c.left), a.top + a.height / 2 - (this.vast ? -scrollY : c.top)];
  }
  cel(x: number, y: number): [number, number] { return [Math.round((x - this.x0) / this.stap), Math.round((y - this.y0) / this.stap)]; }
  pos(i: number, j: number): [number, number] { return [this.x0 + i * this.stap, this.y0 + j * this.stap]; }

  // Tekent alleen wat oplicht. Het vaste veld wist alleen de vakken van het vorige beeld en bekijkt per rij alleen de
  // stippen binnen de ring van een golf of burst (dirty rect); stippen met dezelfde kleur en sterkte gaan in één pad.
  private teken(nu: number) {
    const { ctx, stap, r } = this;
    this.lijn();
    const oy = this.oy(), pad = r + 1.6;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const alles = !!this.basis || this.vuil;
    if (alles) ctx.clearRect(0, 0, this.W, this.H);
    else for (let n = 0; n < this.vorig.length; n += 4) ctx.clearRect(this.vorig[n], this.vorig[n + 1], this.vorig[n + 2] - this.vorig[n], this.vorig[n + 3] - this.vorig[n + 1]);
    this.vuil = false;
    const vakken: number[] = [];
    this.effecten = this.effecten.filter((e) => !e.klaar);
    const tijden = this.effecten.map((e) => (nu - e.t0) / 1000);
    const levend = this.effecten.map((e, n) => tijden[n] < 0 || e.waarde(0, 0, tijden[n]) !== -1);
    // Rijen en stukken rij die bekeken worden
    const heel = !!this.basis || this.lampjes.size > 0 || this.effecten.some((e, n) => levend[n] && tijden[n] >= 0 && !e.ring);
    const ringen = heel ? [] : this.effecten.map((e, n) => (levend[n] && tijden[n] >= 0 && e.ring ? e.ring(tijden[n]) : null)).filter(Boolean) as [number, number, number, number][];
    const emmers = new Map<string, number[]>();
    const j0 = Math.max(0, Math.floor((oy - this.y0) / stap)), j1 = Math.floor((oy + this.H - this.y0) / stap) + 1;
    const stukken: number[] = [];
    for (let j = j0; j <= j1; j++) {
      const py = this.y0 + j * stap, y = py - oy;
      if (y < -pad || y > this.H + pad) continue;
      stukken.length = 0;
      if (heel) stukken.push(0, this.kol - 1);
      else for (const [rx, ry, bi, bu] of ringen) {
        const dy = Math.abs(py - ry); if (dy >= bu) continue;
        const xo = Math.sqrt(bu * bu - dy * dy), xi = dy < bi ? Math.sqrt(bi * bi - dy * dy) : 0;
        const deel = (a: number, b: number) => { const ia = Math.max(0, Math.ceil((a - this.x0) / stap)), ib = Math.min(this.kol - 1, Math.floor((b - this.x0) / stap)); if (ib >= ia) stukken.push(ia, ib); };
        if (xi > 0) { deel(rx - xo, rx - xi); deel(rx + xi, rx + xo); } else deel(rx - xo, rx + xo);
      }
      if (!stukken.length) continue;
      if (stukken.length > 2) {  // overlappende stukken samenvoegen
        const p: [number, number][] = []; for (let n = 0; n < stukken.length; n += 2) p.push([stukken[n], stukken[n + 1]]);
        p.sort((a, b) => a[0] - b[0]); stukken.length = 0;
        for (const [a, b] of p) { const l = stukken.length; if (l && a <= stukken[l - 1] + 1) stukken[l - 1] = Math.max(stukken[l - 1], b); else stukken.push(a, b); }
      }
      let loopVan = -1, loopTot = -1;
      for (let s = 0; s < stukken.length; s += 2) for (let i = stukken[s]; i <= stukken[s + 1]; i++) {
        const x = this.x0 + i * stap;
        let best = 0, kl: RGB | null = null;
        const l = this.lampjes.get(j * 4096 + i); if (l) { best = l.a; kl = l.rgb; }
        for (let n = 0; n < this.effecten.length; n++) {
          const t = tijden[n]; if (t < 0 || !levend[n]) continue;
          const e = this.effecten[n], w = e.waarde(i, j, t);
          if (w > best) { best = w; kl = e.kleur(i, j); }
        }
        let sleutel: string | null = null, straal = r;
        if (best > .02 && kl) {
          const q = Math.round(best * 16) / 16; straal = r + .7 * q;
          sleutel = `rgba(${kl[0]},${kl[1]},${kl[2]},${Math.min(1, .25 + q * .75)})|${straal}`;
        } else if (this.basis) sleutel = `${this.basis}|${r}`;
        if (!sleutel) continue;
        let em = emmers.get(sleutel); if (!em) emmers.set(sleutel, (em = []));
        em.push(x, y);
        if (!alles || this.basis === null) {
          if (loopTot === i - 1 && loopVan >= 0) loopTot = i;
          else { if (loopVan >= 0) vakken.push(this.x0 + loopVan * stap - pad, y - pad, this.x0 + loopTot * stap + pad, y + pad); loopVan = loopTot = i; }
        }
      }
      if (loopVan >= 0) vakken.push(this.x0 + loopVan * stap - pad, y - pad, this.x0 + loopTot * stap + pad, y + pad);
    }
    for (const [sleutel, em] of emmers) {
      const [kleur, s] = sleutel.split("|"), straal = +s;
      ctx.fillStyle = kleur; ctx.beginPath();
      for (let n = 0; n < em.length; n += 2) { ctx.moveTo(em[n] + straal, em[n + 1]); ctx.arc(em[n], em[n + 1], straal, 0, 6.2832); }
      ctx.fill();
    }
    this.vorig = vakken;
    this.effecten.forEach((e, n) => { if (!levend[n]) { e.klaar = true; e.af?.(); } });
    return this.effecten.some((e) => !e.klaar);
  }
  private lus() {
    if (this.loopt) return;
    if (this.slaapt()) { if (!this.stilSinds) this.stilSinds = performance.now(); return; }
    this.loopt = true;
    const f = (nu: number) => {
      if (this.slaapt() || this.buiten()) { this.loopt = false; if (!this.stilSinds) this.stilSinds = performance.now(); return; }
      if (this.teken(nu)) requestAnimationFrame(f); else this.loopt = false;
    };
    requestAnimationFrame(f);
  }
  private voeg(e: Omit<Effect, "t0">, wacht = 0) {
    return new Promise<void>((af) => {
      if (minderBeweging()) { if (e.eind) { e.eind(); this.vuil = true; this.lus(); } return af(); }
      this.effecten.push({ ...e, t0: performance.now() + wacht * 1000, af }); this.lus();
    });
  }

  // Een golf in één kleur vanaf een punt (SN.kleurGolf in de film)
  golf(x: number, y: number, kleur: Kleur, { straal = 1400, duur = 2.2, breed = 140, sterkte = .92, wacht = 0 } = {}) {
    const rgb = hex(kleur), uit = duur > 1.2 ? .7 : duur * .5;
    const R = (t: number) => straal * (1 - (1 - Math.min(t, duur) / duur) ** 2);
    return this.voeg({
      kleur: () => rgb,
      ring: (t) => [x, y, Math.max(0, R(t) - breed * 1.3), R(t) + breed * .7],
      waarde: (i, j, t) => {
        if (t > duur) return -1;
        const [px, py] = this.pos(i, j), R = straal * (1 - (1 - t / duur) ** 2);
        const ring = sm(1 - Math.abs(Math.hypot(px - x, py - y) - R + breed * .3) / breed);
        return ring * sterkte * (t > duur - uit ? (duur - t) / uit : 1);
      },
    }, wacht);
  }
  // Geel, blauw, roze, groen kort na elkaar (einde van de film)
  golfReeks(x: number, y: number, { tussen = .35, ...o }: { tussen?: number; straal?: number; duur?: number } = {}) {
    return Promise.all(GOLFKLEUREN.map((k, n) => this.golf(x, y, k, { ...o, wacht: n * tussen + (n === 3 ? .5 : 0) })));
  }
  // Kleurburst: korte golf waarin elke stip een eigen merkkleur krijgt (confetti via de stippen, geen snippers)
  burst(x: number, y: number, { straal = 480, duur = 1.1, wacht = 0 } = {}) {
    const pal = GOLFKLEUREN.map(hex);
    const R = (t: number) => straal * (1 - (1 - Math.min(t, duur) / duur) ** 2);
    return this.voeg({
      kleur: (i, j) => pal[(i * 7 + j * 13) % 4],
      ring: (t) => [x, y, Math.max(0, R(t) - 110), R(t) + 110],
      waarde: (i, j, t) => {
        if (t > duur) return -1;
        const [px, py] = this.pos(i, j), R = straal * (1 - (1 - t / duur) ** 2);
        return sm(1 - Math.abs(Math.hypot(px - x, py - y) - R) / 110) * (t > duur * .5 ? (duur - t) / (duur * .5) : 1);
      },
    }, wacht);
  }
  // Lichtbalken (SN.lichtBalken): kolommen stippen lichten rij voor rij op, van links naar rechts; daarna staan ze (houd)
  // en faden ze uit. houd = Infinity laat ze staan.
  balken(kolommen: { i: number; rijen: number }[], { onder, kleur = "groen" as Kleur, veeg = 1, op = .9, houd = 1.4, sterkte = .9 }: { onder: number; kleur?: Kleur; veeg?: number; op?: number; houd?: number; sterkte?: number }) {
    const rgb = hex(kleur), m = new Map<number, { rijen: number; vert: number }>();
    kolommen.forEach((k, n) => m.set(k.i, { rijen: k.rijen, vert: veeg * n / Math.max(1, kolommen.length - 1) }));
    const eind = veeg + op + houd;
    const eindstand = () => { if (houd === Infinity) kolommen.forEach((k) => { for (let r = 0; r < k.rijen; r++) this.lampjes.set((onder - r) * 4096 + k.i, { rgb, a: sterkte }); }); };
    return this.voeg({
      kleur: () => rgb, eind: eindstand,
      waarde: (i, j, t) => {
        if (t > eind + .5) return -1;
        const k = m.get(i); if (!k) return 0;
        const tk = t - k.vert; if (tk < 0) return 0;
        const hoog = Math.min(k.rijen, Math.floor(tk / op * k.rijen) + 1), van = onder - j;
        if (van < 0 || van >= hoog) return 0;
        return sterkte * (t > eind ? 1 - (t - eind) / .5 : 1);
      },
    });
  }
  // Stippen één voor één aan (bijv. 500 plekken), in leesvolgorde, over `duur` seconden; blijven daarna staan.
  vul(cellen: [number, number][], kleur: Kleur, { a = .9, duur = 1.2 } = {}) {
    const rgb = hex(kleur);
    const volg = new Map<number, number>(); cellen.forEach(([i, j], n) => volg.set(j * 4096 + i, n / Math.max(1, cellen.length) * duur));
    let gezet = false;
    const eindstand = () => { if (!gezet) { gezet = true; cellen.forEach(([ci, cj]) => this.lampjes.set(cj * 4096 + ci, { rgb, a })); } };
    return this.voeg({
      kleur: () => rgb, eind: eindstand,
      waarde: (i, j, t) => {
        if (t > duur + .3) { eindstand(); return -1; }  // eenmalig overdragen aan de vaste belichting; vanaf hier tekenen de lampjes
        const v = volg.get(j * 4096 + i); if (v === undefined) return 0;
        return t >= v ? a * sm((t - v) / .25) : 0;
      },
    });
  }
  zet(i: number, j: number, kleur: Kleur, a = .9) { this.lampjes.set(j * 4096 + i, { rgb: hex(kleur), a }); this.vuil = true; this.lus(); }
  wis() { this.lampjes.clear(); this.vuil = true; this.lus(); }
}

// Letters en cijfers uit stippen: de tekst wordt op een klein canvas gezet en per rastercel bemonsterd.
// Geeft de cellen terug (links naar rechts, dan boven naar onder), passend in `kol` × `rij` vanaf (i0, j0).
export function tekstCellen(tekst: string, { i0 = 0, j0 = 0, rij = 7, gewicht = 700, familie = "TT Norms, system-ui, sans-serif" } = {}) {
  const c = document.createElement("canvas"), ctx = c.getContext("2d")!, h = rij;
  ctx.font = `${gewicht} ${h * 1.32}px ${familie}`;
  const w = Math.ceil(ctx.measureText(tekst).width) + 2;
  c.width = w; c.height = h;
  ctx.font = `${gewicht} ${h * 1.32}px ${familie}`; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#fff";
  ctx.fillText(tekst, 1, h - .5);
  const d = ctx.getImageData(0, 0, w, h).data, uit: [number, number][] = [];
  for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) if (d[(y * w + x) * 4 + 3] > 110) uit.push([i0 + x, j0 + y]);
  return { cellen: uit, breed: w };
}

// Sitebreed veld: één vast canvas tekent zowel de rust-stippen als de belichting. CSS is de fallback vóór initialisatie.
// Beide lagen delen daardoor exact dezelfde rastercoördinaten. Alleen de muisreactie en een groene golf bij een klik
// belichten de achtergrond; een sectie binnengaan of erlangs scrollen start geen golf.
let site: Veld | null = null;
export function siteVeld(): Veld | null {
  if (site || typeof document === "undefined") return site;
  const c = document.createElement("canvas");
  c.className = "sn-stipveld"; c.setAttribute("aria-hidden", "true");
  document.body.prepend(c);
  // 11 oktober 2026 (Marinus): "De stippen zelf zijn te groot, moet meer een achtergrond effect zijn." Het vaste veld tekent
  // dezelfde kleine stip als het raster in stippen.css (straal 1); oplichten maakt hem iets groter.
  c.dataset.straal = "1";
  // Basis en belichting gebruiken hetzelfde raster; CSS blijft fallback zonder canvas.
  if (!c.getContext("2d")) { c.remove(); return null; }
  site = new Veld(c, { basis: "rgba(255,255,255,.1)", vast: true, r: 1 });
  if (site.W > 0 && site.H > 0) document.documentElement.classList.add("sn-stipveld-ready");
  // A short, soft trail illuminates the existing grid underneath the pointer.
  let laatsteMuis = -Infinity;
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || minderBeweging() || !site) return;
    const nu = performance.now();
    if (nu - laatsteMuis < 16) return;
    laatsteMuis = nu;
    site.golf(e.clientX + scrollX, e.clientY + scrollY, "groen", { straal: 64, duur: .16, breed: 40, sterkte: 1 });
  }, { passive: true });
  // Elke klik geeft één groene golf vanaf de klikplek, ook op de lege achtergrond.
  // Keyboard clicks have no pointer coordinates, so start those at the focused control.
  document.addEventListener("click", (e) => {
    if (!site) return;
    const doel = e.target instanceof Element ? e.target : null;
    const [x, y] = e.detail === 0 && doel
      ? site.midden(doel)
      : [e.clientX + scrollX, e.clientY + scrollY];
    site.golf(x, y, "groen", { straal: Math.hypot(innerWidth, innerHeight), duur: 1.1, breed: 120, sterkte: 1 });
  });
  return site;
}
