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
export const minderBeweging = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

type Effect = {
  t0: number; klaar?: boolean; dood?: boolean; af?: () => void;
  // waarde 0..1 voor stip (i, j) op tijd t (s); -1 = effect is voorbij
  waarde: (i: number, j: number, t: number) => number;
  kleur: (i: number, j: number) => RGB;
};

export type VeldOpties = {
  stap?: number; r?: number;
  basis?: string | null;          // kleur van de rust-stippen; null = niet tekenen (de css-achtergrond doet dat)
  licht?: boolean;                // op wit: grijze stippen
  vast?: boolean;                 // canvas is position: fixed en volgt de scroll (sitebreed veld)
};

export class Veld {
  readonly stap: number; readonly r: number;
  private ctx: CanvasRenderingContext2D; private dpr = 1;
  W = 0; H = 0; kol = 0; rij = 0;
  private effecten: Effect[] = []; private lampjes = new Map<number, { rgb: RGB; a: number }>();
  private loopt = false; private basis: string | null; private vast: boolean; private ro?: ResizeObserver;

  constructor(readonly canvas: HTMLCanvasElement, o: VeldOpties = {}) {
    this.stap = o.stap ?? 32; this.r = o.r ?? 1.6; this.vast = !!o.vast;
    this.basis = o.basis === undefined ? (o.licht ? "rgba(20,35,56,.16)" : "rgba(255,255,255,.13)") : o.basis;
    this.ctx = canvas.getContext("2d")!;
    this.ro = new ResizeObserver(() => this.maat()); this.ro.observe(canvas); this.maat();
    if (this.vast) addEventListener("scroll", this.opScroll, { passive: true });
  }
  stop() { this.ro?.disconnect(); removeEventListener("scroll", this.opScroll); this.effecten = []; }
  private opScroll = () => { if (this.effecten.length || this.lampjes.size) this.lus(); };
  private maat() {
    const b = this.canvas.getBoundingClientRect(); this.dpr = Math.min(2, devicePixelRatio || 1);
    this.W = b.width; this.H = b.height; this.canvas.width = Math.round(this.W * this.dpr); this.canvas.height = Math.round(this.H * this.dpr);
    this.kol = Math.ceil(this.W / this.stap); this.rij = Math.ceil(this.H / this.stap);
    this.teken(performance.now());
  }
  // Veldcoördinaten: binnen een tegel = ten opzichte van het canvas; sitebreed = documentcoördinaten.
  private oy() { return this.vast ? scrollY : 0; }
  midden(el: Element): [number, number] {
    const a = el.getBoundingClientRect(), c = this.canvas.getBoundingClientRect();
    return [a.left + a.width / 2 - (this.vast ? 0 : c.left), a.top + a.height / 2 - (this.vast ? -scrollY : c.top)];
  }
  cel(x: number, y: number): [number, number] { return [Math.round((x - this.stap / 2) / this.stap), Math.round((y - this.stap / 2) / this.stap)]; }
  pos(i: number, j: number): [number, number] { return [this.stap / 2 + i * this.stap, this.stap / 2 + j * this.stap]; }

  private teken(nu: number) {
    const { ctx, stap, r } = this; const oy = this.oy();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); ctx.clearRect(0, 0, this.W, this.H);
    this.effecten = this.effecten.filter((e) => !e.klaar);
    for (const e of this.effecten) e.dood = true;
    const j0 = Math.floor(oy / stap), j1 = j0 + this.rij + 1;
    for (let j = j0; j < j1; j++) {
      const y = stap / 2 + j * stap - oy;
      for (let i = 0; i < this.kol; i++) {
        const x = stap / 2 + i * stap;
        let best = 0, kl: RGB | null = null;
        const l = this.lampjes.get(j * 4096 + i); if (l) { best = l.a; kl = l.rgb; }
        for (const e of this.effecten) {
          const t = (nu - e.t0) / 1000; if (t < 0) { e.dood = false; continue; }
          const w = e.waarde(i, j, t);
          if (w !== -1) e.dood = false;
          if (w > best) { best = w; kl = e.kleur(i, j); }
        }
        if (best > .02 && kl) {
          ctx.fillStyle = `rgba(${kl[0]},${kl[1]},${kl[2]},${Math.min(1, .25 + best * .75)})`;
          ctx.beginPath(); ctx.arc(x, y, r + .7 * best, 0, 7); ctx.fill();
        } else if (this.basis) { ctx.fillStyle = this.basis; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
      }
    }
    for (const e of this.effecten) if (e.dood) { e.klaar = true; e.af?.(); }
    return this.effecten.some((e) => !e.klaar);
  }
  private lus() {
    if (this.loopt) return; this.loopt = true;
    const f = (nu: number) => { if (this.teken(nu)) requestAnimationFrame(f); else this.loopt = false; };
    requestAnimationFrame(f);
  }
  private voeg(e: Omit<Effect, "t0">, wacht = 0) {
    return new Promise<void>((af) => {
      if (minderBeweging()) return af();
      this.effecten.push({ ...e, t0: performance.now() + wacht * 1000, af }); this.lus();
    });
  }

  // Een golf in één kleur vanaf een punt (SN.kleurGolf in de film)
  golf(x: number, y: number, kleur: Kleur, { straal = 1400, duur = 2.2, breed = 140, sterkte = .92, wacht = 0 } = {}) {
    const rgb = hex(kleur), uit = duur > 1.2 ? .7 : duur * .5;
    return this.voeg({
      kleur: () => rgb,
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
    return this.voeg({
      kleur: (i, j) => pal[(i * 7 + j * 13) % 4],
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
    if (minderBeweging()) { if (houd === Infinity) kolommen.forEach((k) => { for (let r = 0; r < k.rijen; r++) this.zet(k.i, onder - r, kleur, sterkte); }); return Promise.resolve(); }
    return this.voeg({
      kleur: () => rgb,
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
    if (minderBeweging()) { cellen.forEach(([i, j]) => this.lampjes.set(j * 4096 + i, { rgb, a })); this.lus(); return Promise.resolve(); }
    const volg = new Map<number, number>(); cellen.forEach(([i, j], n) => volg.set(j * 4096 + i, n / Math.max(1, cellen.length) * duur));
    let gezet = false;
    return this.voeg({
      kleur: () => rgb,
      waarde: (i, j, t) => {
        if (t > duur + .3) {  // eenmalig overdragen aan de vaste belichting; vanaf hier tekenen de lampjes
          if (!gezet) { gezet = true; cellen.forEach(([ci, cj]) => this.lampjes.set(cj * 4096 + ci, { rgb, a })); }
          return -1;
        }
        const v = volg.get(j * 4096 + i); if (v === undefined) return 0;
        return t >= v ? a * sm((t - v) / .25) : 0;
      },
    });
  }
  zet(i: number, j: number, kleur: Kleur, a = .9) { this.lampjes.set(j * 4096 + i, { rgb: hex(kleur), a }); this.lus(); }
  wis() { this.lampjes.clear(); this.lus(); }
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

// Sitebreed veld: één vast canvas achter alle inhoud. De rust-stippen komen uit de css-achtergrond (html), dit canvas
// tekent alleen wat oplicht. Golven starten vanaf elementen met data-stipgolf="kleur" (hover) en data-stipklik="kleur"
// (klik, bijv. inloggen); data-stipburst geeft een kleurburst bij een klik.
let site: Veld | null = null;
export function siteVeld(): Veld | null {
  if (site || typeof document === "undefined") return site;
  const c = document.createElement("canvas");
  c.className = "sn-stipveld"; c.setAttribute("aria-hidden", "true");
  document.body.prepend(c);
  site = new Veld(c, { basis: null, vast: true });
  const laatst = new WeakMap<Element, number>();
  const kleurVan = (v: string | undefined): Kleur => (v && v !== "" ? v : "groen") as Kleur;
  // Een bentotegel geeft bij hover een golf in zijn eigen kleur (rand groen, blauw, roze of geel; gewone tegel groen).
  const tegelKleur = (el: Element): Kleur => {
    const t = el.closest(".sn-tegel"); if (!t) return "groen";
    for (const k of ["blauw", "roze", "geel"] as const) if (t.classList.contains(`is-${k}`)) return k;
    return "groen";
  };
  document.addEventListener("pointerover", (e) => {
    if ((e as PointerEvent).pointerType === "touch") return;
    const el = (e.target as Element)?.closest?.("[data-stipgolf], .sn-tegel:not(.is-film):not(.is-foto) > .sn-tegel-vlak"); if (!el || !site) return;
    const n = performance.now(); if (n - (laatst.get(el) || 0) < 1400) return; laatst.set(el, n);
    const ds = (el as HTMLElement).dataset.stipgolf;
    const [x, y] = site.midden(el); site.golf(x, y, ds !== undefined ? kleurVan(ds) : tegelKleur(el), { straal: 900, duur: 1.8, sterkte: .8 });
  });
  // Klik op een groene knop (inloggen, starten): groene golf vanaf de knop. data-stipburst: kleurburst.
  document.addEventListener("click", (e) => {
    const el = (e.target as Element)?.closest?.("[data-stipklik],[data-stipburst],a.os-claim,.h-button:not(.h-button-secondary)") as HTMLElement | null; if (!el || !site) return;
    const [x, y] = site.midden(el);
    if (el.dataset.stipburst !== undefined) site.burst(x, y); else site.golf(x, y, kleurVan(el.dataset.stipklik), { duur: 2 });
  });
  return site;
}
