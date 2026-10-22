import { binnenLimiet, controleer, testbankModus } from "../server/php-check.mjs";

// POST /api/php-check  { domein }
//   → 200 { ok, domein, uitslag: "groen"|"rood"|"oranje"|"onbekend", phpVersie, reden, ... }
// Uitleg, grenzen en beslisregels: server/php-check.mjs. Contract en meting:
// /Volumes/WORK/02-SOCIALNOW/php-check/testbank (npm run meet). Alles gebeurt vóór res.json(): op Vercel
// stopt de functie zodra het antwoord weg is, dus er loopt daarna niets meer.
const HERKOMST = /^https:\/\/((www\.)?socialnow\.nl|socialnow-check-preview\.vercel\.app|socialnow-(website|check-preview)-[a-z0-9-]+-socialnowmarinus-4115s-projects\.vercel\.app)$/;
const recent = new Map();
const LOKAAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, reden: "methode" });
  }
  // Een browser stuurt altijd Origin bij een POST; alleen onze eigen pagina mag. Zonder Origin (curl,
  // het meetscript) telt het gewoon mee in de limiet.
  const origin = String(req.headers.origin || "");
  if (origin && !HERKOMST.test(origin) && !LOKAAL.test(origin)) return res.status(403).json({ ok: false, reden: "herkomst" });

  const testbank = testbankModus();
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "?";
  if (!testbank && !binnenLimiet(`ip:${ip}`, 20)) return res.status(429).json({ ok: false, reden: "limiet" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  const domein = String(body?.domein || "").slice(0, 300);
  // 22 oktober 2026 (Marinus): geen vinkje. De publieke scan is één gewone GET, zoals elke bezoeker doet.
  // Hetzelfde domein hooguit eens per 20 seconden echt opvragen: niemand gebruikt ons om een site te bestoken.
  // Wie binnen die tijd opnieuw checkt, krijgt de uitslag van daarnet (alleen in het geheugen, 20 s).
  const sleutel = domein.trim().toLowerCase();
  const eerder = !testbank && recent.get(sleutel);
  if (eerder && Date.now() - eerder.t < 20 * 1000) return res.status(200).json(eerder.uit);

  try {
    const uit = await controleer(domein);
    if (uit.ok && !testbank) { recent.set(sleutel, { t: Date.now(), uit }); if (recent.size > 500) recent.delete(recent.keys().next().value); }
    return res.status(uit.ok ? 200 : 400).json(uit);
  } catch (e) {
    // Een check lukt altijd: faalt onze eigen functie, dan is de uitslag gewoon "onbekend".
    console.error("php-check fout", String(e?.message || e));
    return res.status(200).json({ ok: true, domein, uitslag: "onbekend", phpVersie: null, code: "fout", reden: "Van buitenaf niet te beoordelen." });
  }
}
