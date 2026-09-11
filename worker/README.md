# Milo AI-chat — Gemini-proxy (Cloudflare Worker)

Milo's antwoorden komen van Google Gemini, aangeroepen via deze Worker zodat de
API-key **serverside** blijft en nooit in de browser terechtkomt. De website
kent alleen de Worker-URL, en die is niet geheim.

## Stand van zaken

| | |
|---|---|
| Worker | `https://milo-chat.socialnow-marinus.workers.dev` — **gedeployed** |
| Cloudflare-account | socialnow.marinus@gmail.com |
| `GEMINI_API_KEY` | **nog niet gezet** — zolang die ontbreekt geeft de Worker 503 en valt de site terug op de eigen vragenlijst |

## De sleutel erin zetten (eenmalig, ~2 min)

1. Maak een gratis Gemini-key op <https://aistudio.google.com/apikey>.
2. Vanuit deze `worker/`-map:

   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```

   Wrangler vraagt om de key en stuurt hem rechtstreeks naar Cloudflare. Plak
   hem nooit in een bestand, in een commit of in een chat.

3. Controleren dat het werkt:

   ```bash
   curl -s -X POST https://milo-chat.socialnow-marinus.workers.dev \
     -H "Origin: https://socialnow.nl" -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","text":"Wat is een Custom OS?"}],"language":"nl"}'
   ```

   Je hoort een antwoord van Milo terug te krijgen in plaats van een foutmelding.
   Daarna antwoordt de chat op socialnow.nl meteen via Gemini; de site hoeft niet
   opnieuw gebouwd te worden.

## Hoe het terugvalt

De chat staat nooit stil. Is de Worker onbereikbaar, heeft hij geen sleutel, of
duurt het langer dan 15 seconden, dan beantwoordt Milo de vraag uit de eigen
vragenlijst in `proposal/content.ts`. Levert die niets op, dan verwijst hij naar
WhatsApp en e-mail.

## Wat Milo zegt aanpassen

De hele persoonlijkheid, de feiten die hij mag gebruiken en de gespreksregels
staan in `SYSTEM_PROMPT` bovenin `milo-worker.js`. Pas die tekst aan en run
opnieuw `npx wrangler deploy`.

## Modellen

De Worker probeert `gemini-2.5-flash`, dan `gemini-2.0-flash`, dan
`gemini-flash-latest`, en onthoudt welke werkte. Faseert Google er een uit, dan
schuift de chat vanzelf door. Een vast model afdwingen kan met:

```bash
npx wrangler secret put GEMINI_MODEL
```

## Kosten

Gemini Flash heeft een royale gratis laag; Cloudflare Workers 100.000
requests per dag gratis. Voor een chat op de site ruim voldoende.
