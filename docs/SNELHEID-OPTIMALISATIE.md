# ⚡ Snelheid-optimalisatie — hoe je een site razendsnel maakt

Praktische instructie voor performance van een React/Vite-SPA, met de opzet van
**socialnow.nl** als referentie. Doel: goede **Core Web Vitals** (LCP < 2,5s,
INP < 200ms, CLS < 0,1) — die tellen mee voor zowel gebruikerservaring als SEO.

De vier hefbomen: **minder bytes**, **minder requests**, **later laden wat niet
direct nodig is**, en **niets dat het schilderen blokkeert**.

---

## 1. JavaScript-bundel klein & gesplitst houden

### 1.1 Code-splitting per route en per zware library
In `vite.config.ts` worden grote afhankelijkheden in eigen chunks gezet zodat ze
alleen laden waar nodig:
```ts
manualChunks: {
  'vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui': ['lucide-react'],
  'charts': ['recharts'],   // ~180KB gzipped — alleen op pagina's met grafieken
}
```

### 1.2 Lazy-loading van below-the-fold secties & subpagina's
In `App.tsx` worden zware secties en alle subpagina's met `lazyRetry` (een
`React.lazy` met retry-on-chunk-fail) geladen. Alleen de hero + navbar zitten in
de initiële bundel; de rest komt binnen als je scrollt of navigeert:
```ts
const WebShowcase = lazyRetry(() => import('./components/WebShowcase'));
const TeamPage    = lazyRetry(() => import('./components/TeamPage'));
// … in JSX: <Suspense fallback={null}><WebShowcase /></Suspense>
```

**Regel:** een nieuwe zware sectie of route → altijd via `lazyRetry` +
`<Suspense>`. Kleine, above-the-fold componenten juist niet (extra request
weegt dan zwaarder dan de winst).

### 1.3 Build-instellingen (`vite.config.ts`)
```ts
build: {
  sourcemap: false,          // geen sourcemaps in productie
  target: 'es2020',          // moderne output, minder polyfills
  minify: 'esbuild',         // snelste minifier
  cssMinify: true,
  chunkSizeWarningLimit: 200,// waarschuwt bij te grote chunks
  assetsInlineLimit: 8192,   // assets < 8KB inline als base64 (bespaart requests)
}
```

---

## 2. Afbeeldingen — meestal de grootste winst

- **WebP overal.** Kleiner dan JPEG/PNG bij gelijke kwaliteit. Converteren met
  ffmpeg (in dit project: `ffmpeg` op `~/.local/bin/ffmpeg`, want `sips` schrijft
  geen webp):
  ```bash
  ffmpeg -i input.png -c:v libwebp -quality 82 output.webp
  ```
- **Juiste afmetingen.** Serveer geen 4000px-beeld in een 400px-vak. Schaal vóór
  export.
- **Lazy-load** alles onder de vouw: `loading="lazy"` + `decoding="async"`, of
  een `IntersectionObserver` die pas `src` zet als het beeld nadert (zie
  `ProgressiveImage` / de `LazyImage` in `ImageSlider.tsx`).
- **Afmetingen vastzetten** (`width`/`height` of `aspect-ratio`) → geen
  layout-shift (CLS).
- **Kleine iconen** via `lucide-react` (SVG, tree-shakeable) i.p.v. beeldbestanden.

---

## 3. Video's (o.a. de Milo-animaties)

Video kan zwaar zijn — houd het licht:
```bash
# H.264, redelijk klein, web-geoptimaliseerd (faststart = speelt terwijl 't laadt)
ffmpeg -i in.mp4 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart -pix_fmt yuv420p out.mp4
```
- **`-an`**: audio strippen als er geen geluid nodig is (scheelt fors).
- **`+faststart`**: metadata vooraan → speelt direct.
- **`preload="metadata"`** op het `<video>`-element: laad niet de hele video
  vooraf, alleen de metadata.
- **Transparante Milo-video's** gebruiken een VP9-alpha `.webm` met een
  `.mp4`-fallback via twee `<source>`-tags (zie het Milo-doc).
- Speel below-the-fold video's pas af als ze in beeld komen
  (`IntersectionObserver`) i.p.v. `autoPlay` op alles tegelijk.

---

## 4. Fonts

- **Self-hosted** (`public/fonts/…woff2`) i.p.v. Google Fonts → geen extra
  DNS/verbinding naar een derde partij, geen render-block.
- **WOFF2** (kleinste formaat) + `font-display: swap` → tekst is direct
  zichtbaar met een fallback, geen onzichtbare tekst tijdens het laden.
- **`unicode-range`** per `@font-face` zodat de browser alleen de subsets laadt
  die de pagina nodig heeft.
- Alleen de gewichten laden die je écht gebruikt (400/500/700/900).

---

## 5. Netwerk & resource hints

In `index.html`:
```html
<link rel="preconnect" href="https://feeds.behold.so" crossorigin />
<link rel="preconnect" href="https://storage.googleapis.com" />
```
- **`preconnect`** voor kritieke externe origins → de verbinding (DNS + TLS)
  staat al klaar vóór de fetch.
- **`dns-prefetch`** als goedkopere fallback voor minder kritieke origins.
- Minimaliseer het aantal externe origins — elke nieuwe kost een verbinding.

---

## 6. Render-performance (soepel scrollen, lage INP)

- **Animaties op `transform` en `opacity`** (GPU-compositing), niet op
  `top/left/width` (die forceren layout/reflow).
- **`requestAnimationFrame`** voor scroll-gedreven effecten, met een throttle-vlag
  zodat je niet meerdere keren per frame rekent (zie de marquee-sliders).
- **`will-change: transform`** spaarzaam en alleen op elementen die echt continu
  bewegen — te veel `will-change` vreet geheugen.
- **`content-visibility: auto`** op zware, offscreen secties kan de eerste render
  versnellen (voorzichtig testen).
- Let op de **backdrop-filter-glastegels**: die zijn duur. Mobiel staan ze
  daarom uit (bijna-opaque fallback) — zie de warp-glass-architectuur.

---

## 7. Mobiel apart optimaliseren

In `index.css` staan mobiele uitzonderingen omdat compositing daar duurder is:
```css
@media (max-width: 767px) {
  [class*="backdrop-blur"] { backdrop-filter: none !important; }  /* te duur */
  .neon-glow-green::before { display: none; }                    /* shadow-cost */
}
```
Test **altijd op een echt (mid-range) toestel**, niet alleen op een snelle
desktop. De meeste bezoekers zijn mobiel.

---

## 8. Meten

| Tool | Waarvoor |
|---|---|
| **PageSpeed Insights** | Core Web Vitals (lab + veld), concrete verbeterpunten |
| **Lighthouse** (DevTools) | performance-score + waterfall, lokaal |
| **WebPageTest** | gedetailleerde waterfall, filmstrip, verschillende locaties |
| `npm run build` output | chunk-groottes; let op de `chunkSizeWarningLimit`-warnings |

**Streefwaarden:** Lighthouse Performance ≥ 90, LCP < 2,5s, INP < 200ms,
CLS < 0,1.

---

## 9. Checklist bij een nieuwe sectie/pagina

- [ ] Zware sectie/subpagina via `lazyRetry` + `<Suspense>`
- [ ] Nieuwe zware library in een eigen `manualChunks`-entry
- [ ] Alle afbeeldingen WebP, juiste afmetingen, `loading="lazy"`, afmetingen vast
- [ ] Video's: `libx264 -crf 24 +faststart -an`, `preload="metadata"`
- [ ] Animaties alleen op `transform`/`opacity`
- [ ] Geen nieuwe externe origins zonder `preconnect` (en zonder noodzaak)
- [ ] Na deploy: PageSpeed Insights draaien op de nieuwe pagina
- [ ] Getest op een echt mobiel toestel
