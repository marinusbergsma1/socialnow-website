# SocialNow Technical Skills & Stack

> **Gebruik:** AI-context voor Claude/GPT | Developer onboarding | Client presentaties

---

## Frontend Development

### Core Stack
| Technologie | Versie | Gebruik |
|-------------|--------|---------|
| React | 19.2.3 | UI framework |
| TypeScript | 5.8+ | Type-safe development |
| Tailwind CSS | 3.4.19 | Utility-first styling |
| Vite | 6.2.0 | Build tooling |
| React Router | 7.13.0 | Client-side routing |

### UI Libraries
- **Lucide React** — Icon library (600+ icons, tree-shakeable)
- **Recharts** — Data visualisatie (AreaChart, RadarChart, BarChart)

### Custom Components (v2.0)
- `GlassEffect` / `GlassDock` / `GlassButton` — Liquid glass UI (Apple-inspired)
- `CursorDrivenParticleTypography` — Canvas-based particle text reacteert op cursor
- `AIMetricsSection` — Animated counter cards met IntersectionObserver
- `TechStackSection` — Dubbele scrolling tech marquee
- `WorkflowBlock` — Geanimeerde automation workflow visualisatie
- `PixelGlobe` — Custom 3D globe visualisatie (canvas, geen Three.js)

### Performance Patronen
- **lazyRetry pattern** — Alle below-fold componenten via `React.lazy()` + retry bij chunk fail
- **IntersectionObserver** — Scroll-reveal animaties + counter triggers
- **Code splitting** — Vendor / UI / charts in aparte Vite chunks
- **Self-hosted fonts** — Inter WOFF2 (400/500/700/900), elimineert render-blocking Google Fonts
- **WebP assets** — Alle afbeeldingen in WebP formaat
- **Mobile guards** — Canvas, backdrop-filter en grain uitgeschakeld op mobile

---

## Animaties & Effecten

### CSS Keyframes (index.css)
- `grain-shift` — Holografisch grain overlay (12s steps loop)
- `aurora-float-1/2/3` — Aurora achtergrond glow
- `neon-glow-fade` — Neon pulse op CTA buttons
- `moveBackground` — Liquid glass achtergrond beweging
- `counterReveal` — AI Metrics counter entrance
- `tickerSlide` — Tech stack marquee scroll

### React Animaties
- Binary reveal effect (Hero) — Tekst decodeert van 0/1 naar echte tekst
- Word cycle — Roterende woorden met kleurovergang
- Particle typography — Canvas-based, cursor-reactief
- Scroll-driven counters — Tel op bij viewport entry

---

## Automation & AI

| Tool | Gebruik |
|------|---------|
| **n8n** | Workflow automation (self-hosted of cloud) |
| **Make.com** | No-code automation (Zapier alternatief) |
| **OpenAI API** | Content generatie, lead classificatie, chatbot |
| **HubSpot** | CRM, email automation, pipeline management |
| **WhatsApp Business API** | Geautomatiseerde klantcommunicatie |

### Typisch automation workflow
```
Webhook → AI Score → HubSpot Pipeline → Email Sequence → Follow-up
```

---

## Design Tools

| Tool | Gebruik |
|------|---------|
| **Figma** | UI/UX design, component libraries, design systemen |
| **Adobe Premiere Pro** | Video editing, motion graphics |
| **Adobe After Effects** | Motion design, animaties |
| **Midjourney** | AI-gegenereerde visuals |
| **DALL-E 3** | Product mockups, conceptvisualisaties |

---

## Hosting & Infrastructuur

| Service | Gebruik |
|---------|---------|
| **Cloudflare Pages** | Website hosting (edge, 99.9% uptime, gratis SSL) |
| **Cloudflare DNS** | DNS management + DDoS bescherming |
| **GitHub** | Version control, CI/CD via Actions |

---

## SEO & Marketing Tech

| Tool | Gebruik |
|------|---------|
| **JSON-LD Structured Data** | LocalBusiness, Organization, WebSite schema |
| **Open Graph** | Social media previews |
| **sitemap.xml** | Zoekmachine indexering |
| **robots.txt** | Crawl directives |
| **useSEO hook** | Dynamische meta tags per pagina |

---

## Development Practices

### Code Kwaliteit
- TypeScript strict mode — geen `any` types
- ESLint + Prettier configuratie
- Component-first architectuur (één verantwoordelijkheid per component)
- Barrel exports via `index.ts` bestanden

### Accessibility
- Skip-to-content link (WCAG 2.1 AA)
- `prefers-reduced-motion` respected in alle animaties
- Minimum 44×44px touch targets (mobile)
- ARIA labels op alle interactieve elementen
- Semantische HTML structuur

### Git Workflow
- `main` — Productie (protected)
- `v2.0` — Feature branch voor v2.0 release
- Feature branches: `feat/component-name`
- Commit convention: `feat:` / `fix:` / `chore:` / `docs:`

---

## Bestandsstructuur

```
/
├── components/           # 40+ React componenten
│   ├── ui/              # v2.0: Herbruikbare UI primitieven
│   │   ├── liquid-glass.tsx
│   │   ├── cursor-particles-typography.tsx
│   │   └── index.ts
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── PixelGlobe.tsx
│   └── ...
├── data/
│   └── projects.ts      # 15+ project case studies
├── docs/                # Marketing & AI context bestanden
├── hooks/               # Custom React hooks
├── public/
│   ├── fonts/           # Self-hosted Inter
│   └── images/          # WebP assets
├── App.tsx              # Root routing
├── index.css            # Global styles + keyframes
└── tailwind.config.js   # Design tokens
```
