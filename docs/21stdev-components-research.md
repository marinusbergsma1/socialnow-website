# 21st.dev Components Research — Week 12, 2026

> **Gefetcht via Firecrawl:** 24 maart 2026
> **Bron:** https://21st.dev/community/components/week/2026-W12
> **Totaal gevonden:** 178 componenten

---

## Aanbevolen voor SocialNow v2.x

De volgende componenten van 21st.dev week 12 passen uitstekend bij de SocialNow design taal
(donker thema, AI/tech, premium animaties).

---

### 🔥 Hoogste Prioriteit

#### 1. Glowy Waves Hero
- **URL:** https://21st.dev/community/components/moumensoliman/glowy-waves-hero-shadcnui/default
- **Populariteit:** ⭐ 160 saves
- **Installatie:** `npx shadcn@latest add https://21st.dev/r/moumensoliman/glowy-waves-hero-shadcnui`
- **Gebruik:** Alternatief hero design of hero voor landingspagina's
- **SocialNow fit:** Gloeiende waves passen bij de aurora-effecten en neon-glow stijl

#### 2. Liquid Metal Button
- **URL:** https://21st.dev/community/components/johuniq/liquid-metal-button/default
- **Populariteit:** ⭐ 186 saves
- **Gebruik:** Premium CTA buttons — zou de groene "Kennismaken" knop kunnen upgraden
- **SocialNow fit:** Past perfect bij de liquid glass + premium tech esthetiek
- **Let op:** Controleer dependencies (mogelijk canvas/WebGL)

#### 3. CPU Architecture
- **URL:** https://21st.dev/community/components/Mazyar%20kawa/cpu-architecture/default
- **Populariteit:** ⭐ 112 saves
- **Gebruik:** Visual voor de automation/AI diensten sectie
- **SocialNow fit:** "CPU als merk-metafoor" past perfect bij het SYSTEM/PROTOCOL branding

#### 4. Radar Effect
- **URL:** https://21st.dev/community/components/aceternity/radar-effect/default
- **Populariteit:** ⭐ 174 saves
- **Gebruik:** Decoratief element in BentoGridSection of hero
- **SocialNow fit:** Sci-fi radar scan past bij de scanning/detection terminologie

---

### 🟢 Secundaire Prioriteit

#### 5. Cinematic Landing Hero
- **URL:** https://21st.dev/community/components/easemize/cinematic-landing-hero/default
- **Populariteit:** ⭐ 148 saves
- **Gebruik:** Nieuwe variant van de hero sectie
- **Note:** Kan worden getest als A/B variant van de huidige Hero.tsx

#### 6. Glassmorphism Portfolio Block
- **URL:** https://21st.dev/community/components/reapollo/glassmorphism-portfolio-block-shadcnui/default
- **Populariteit:** ⭐ 149 saves
- **Gebruik:** Project showcase cards met glass effect
- **SocialNow fit:** Upgrade voor de WebShowcase.tsx kaarten

#### 7. Glassmorphism Minimal Metrics
- **URL:** https://21st.dev/community/components/reapollo/glassmorphism-minimal-metrics-block-shadcnui/default
- **Populariteit:** ⭐ 61 saves
- **Gebruik:** Vervanging of aanvulling van de AIMetricsSection.tsx
- **SocialNow fit:** Glass + metrics = perfect voor de bewezen impact sectie

#### 8. Interactive Globe
- **URL:** Zoek op 21st.dev voor "interactive globe"
- **Gebruik:** Vervanging of aanvulling van de custom PixelGlobe.tsx
- **Note:** Vergelijken met eigen PixelGlobe implementatie qua performance

#### 9. Stacked Panels Cursor Interactive
- **URL:** https://21st.dev/community/components (zoek op naam)
- **Gebruik:** Interactive project showcase panels
- **SocialNow fit:** Modernere variant van het project grid

#### 10. Apple Dock
- **URL:** Zoek op 21st.dev voor "apple dock"
- **Gebruik:** Variant van de GlassDock component uit v2.0
- **Note:** Vergelijken met eigen GlassDock implementatie

---

### 🔵 Future Reference

| Component | Gebruik |
|-----------|---------|
| Aero Hero 1/2/3 | Hero alternatieven |
| 3D Marquee | TechStackSection upgrade |
| Glass Blog Card | Toekomstige blog/cases sectie |
| SVG Mask Effect | Hero tekst effect |
| Fancy Text Hover | Heading interacties |
| Feature Carousel | Services presentatie |
| Shine Border | Card borders |
| Gradient Wave Text | Heading styling |

---

## Integratie Instructies

### Vereisten
Het project heeft momenteel **geen** shadcn/ui setup. Voor installatie via `npx shadcn@latest`:

1. Initialiseer shadcn (eenmalig):
```bash
npx shadcn@latest init
```

2. Kies bij setup:
- Framework: Vite
- Style: Default
- Base color: Zinc (donkerst)
- CSS variables: Yes

3. Voeg component toe:
```bash
npx shadcn@latest add [URL van component]
```

### Zonder shadcn setup
Alle 21st.dev componenten zijn ook kopieerbaar als losse TSX bestanden.
Ga naar de component pagina → "View code" → kopieer naar `/components/ui/`.

---

## Al Geïntegreerd in v2.0

| Component | Geïnspireerd door | Implementatie |
|-----------|------------------|---------------|
| `liquid-glass.tsx` | 21st.dev Glassmorphism trend | `/components/ui/liquid-glass.tsx` |
| `cursor-particles-typography.tsx` | 21st.dev Cursor Driven Particles | `/components/ui/cursor-particles-typography.tsx` |
| `WorkflowBlock.tsx` | 21st.dev N8N Workflow Block | `/components/WorkflowBlock.tsx` |
| `AIMetricsSection.tsx` | 21st.dev Glassmorphism Minimal Metrics | `/components/AIMetricsSection.tsx` |
| `TechStackSection.tsx` | 21st.dev 3D Marquee (2D variant) | `/components/TechStackSection.tsx` |
