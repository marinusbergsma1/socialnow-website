import { DOELEN, GEBEURTENISSEN, VARIANTEN, bezoekerId, gewichtB, kiesVariant, stuurNaarPostHog } from "../server/ab.mjs";

// GET  /api/ab?taal=nl&utm=...  → { variant, reden }
// POST /api/ab  { gebeurtenis, variant, doel? }  → doorgestuurd naar PostHog
// Uitleg en instellingen: server/ab.mjs.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "";
  const id = bezoekerId(ip, String(req.headers["user-agent"] || "").slice(0, 300));

  if (req.method === "GET") {
    const taal = String(req.query?.taal || "nl").slice(0, 5);
    const utm = String(req.query?.utm || "").slice(0, 100);
    const { gewichtB: gewicht } = await gewichtB();
    const { variant, reden } = kiesVariant({ id, gewichtB: gewicht, utm, taal });
    return res.status(200).json({ variant, reden });
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
    const { gebeurtenis, variant, doel } = body || {};
    if (!GEBEURTENISSEN.includes(gebeurtenis) || !VARIANTEN.includes(variant) || (doel && !DOELEN.includes(doel)))
      return res.status(400).json({ error: "Onbekende meting" });
    try { await stuurNaarPostHog(gebeurtenis, id, doel ? { variant, doel } : { variant }); } catch {}
    return res.status(204).end();
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
