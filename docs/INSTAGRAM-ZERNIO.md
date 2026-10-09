# Instagram-werk op socialnow.nl

De website toont een selectie van publieke posts van `@socialnow.nl`, via de Zernio API. Elk beeld opent de oorspronkelijke Instagram-post. De VDZ-case filtert op `VDZ` en `verduurzaming` in de caption; carrouselbeelden behouden de link naar dezelfde post.

## Productieconfiguratie

Stel `ZERNIO_API_KEY` in **alleen in de productieomgeving** van Vercel-project `socialnow-website`. Gebruik een geldige sleutel voor het Zernio-account waarop `@socialnow.nl` gekoppeld is. Kopieer deze sleutel niet naar de ontwikkelmap of browser. De sleutel die momenteel in `socialnow-app` staat, gaf bij de controle op 9 oktober 2026 HTTP 401 en is niet overgenomen.

Na het instellen moet de website opnieuw worden uitgerold. Controleer `https://socialnow.nl/api/instagram`: `posts` moet publieke media en Instagram-permalinks bevatten. Controleer vervolgens `/nl/projecten#social` en de VDZ-case zichtbaar.

## Gedrag

- `/api/instagram` accepteert alleen GET, zonder instelbaar account of andere queryfilters.
- De server zoekt uitsluitend het actieve Instagram-account `socialnow.nl` op.
- Alleen gepubliceerde posts uit `/v1/posts?source=external` en `/v1/posts?status=published` worden verwerkt. Geen drafts, geplande posts, Stories, accounttokens of statistieken in de publieke response.
- Succesvolle responses worden één uur in de CDN gecachet. Fouten worden niet gecachet.
- Zonder sleutel of bij een storing blijft op Ons werk de bestaande lokale collectie staan, met links naar het Instagram-profiel. De VDZ-case toont alleen de house-animatie en de profielverwijzing totdat relevante publieke posts beschikbaar zijn. De oude uitvergrote mobiele screenshots komen niet terug.
- Lokaal zijn geen productiecredentials nodig. De feed gebruikt de lokale collectie als fallback.

De creatieve videoslider staat onder de geschiedenis op de homepage, bij `#creatief-verleden`.

Validatie: `node --test scripts/proef-instagram-feed.mjs` en `npm run build`, plus zichtbare controle van afspelen, doorklikken en de mobiele weergave.

API-contract: [Zernio OpenAPI](https://docs.zernio.com/api/openapi) en [Zernio Instagram](https://docs.zernio.com/platforms/instagram).
