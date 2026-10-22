// Ondertekende beheerlink: wie de link uit de uitnodiging heeft, kan die ene afspraak verzetten of
// annuleren. Het geheim (BOEK_GEHEIM) staat alleen in Vercel-env.
import { createHmac, timingSafeEqual } from "node:crypto";

const handtekening = (id, geheim) => createHmac("sha256", geheim).update(`boeking:${id}`).digest("base64url").slice(0, 32);

export function maakBeheerToken(id, geheim) {
  return `${id}.${handtekening(id, geheim)}`;
}

export function leesBeheerToken(token, geheim) {
  const t = String(token || "");
  const punt = t.lastIndexOf(".");
  if (!geheim || punt < 1 || t.length > 300) return null;
  const id = t.slice(0, punt);
  const a = Buffer.from(t.slice(punt + 1));
  const b = Buffer.from(handtekening(id, geheim));
  return a.length === b.length && timingSafeEqual(a, b) ? id : null;
}
