import { useCallback, useEffect, useRef } from "react";
import { Mensproef, type Bewijs } from "./mensproef";

// De mensproef (proposal/mensproef.ts) voor een formulier. Begint bij het openen van de pagina met
// rekenen, zodat het antwoord klaar is voordat iemand op versturen drukt. `vak` gaat als ref op een
// lege div in het formulier: daar komt het vinkje van Cloudflare, als dat aan staat en twijfelt.
export function useMensproef(route: string) {
  const proef = useRef<Mensproef | null>(null);
  if (!proef.current) proef.current = new Mensproef(route);
  useEffect(() => {
    const p = proef.current!;
    p.start();
    return () => p.stop();
  }, []);
  const vak = useCallback((el: HTMLDivElement | null) => proef.current?.koppelVak(el), []);
  const voorVersturen = useCallback((): Promise<Bewijs> => proef.current!.voorVersturen(), []);
  return { vak, voorVersturen };
}
