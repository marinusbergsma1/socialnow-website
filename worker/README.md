# Milo AI-chat — Gemini-proxy (Cloudflare Worker)

Milo's antwoorden komen van Google Gemini, aangeroepen via deze Worker zodat de
API-key **serverside** blijft (nooit in de browser). Zonder Worker valt Milo
automatisch terug op de ingebouwde kennisbank — de chat werkt dus altijd.

## Eenmalig opzetten (~5 min)

1. **Gemini-key** (gratis): https://aistudio.google.com/apikey → "Create API key".
2. **Cloudflare** (gratis account): https://dash.cloudflare.com/sign-up
3. In deze `worker/`-map:
   ```bash
   npm i -g wrangler
   wrangler login
   wrangler deploy
   wrangler secret put GEMINI_API_KEY   # plak je Gemini-key als 'ie erom vraagt
   ```
   `wrangler deploy` print een URL, bv. `https://milo-chat.jouwnaam.workers.dev`.
4. Zet die URL in **`components/MiloChat.tsx`** → `const MILO_API_URL = '...'`
   (of als build-var `VITE_MILO_API_URL`), commit + push → live.

## Aanpassen wat Milo zegt
De hele persoonlijkheid + lead-focus staat in `SYSTEM_PROMPT` bovenin
`milo-worker.js`. Pas die tekst aan en run opnieuw `wrangler deploy`.

## Kosten
Gemini `gemini-2.0-flash` heeft een royale gratis laag; Cloudflare Workers
100.000 requests/dag gratis. Voor een chat op je site ruim voldoende.
