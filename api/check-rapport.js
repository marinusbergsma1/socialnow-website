import { binnenLimiet, testbankModus } from "../server/php-check.mjs";
import { maakRapport, meetSnelheid } from "../server/check-rapport.mjs";

// POST /api/check-rapport  { domein, deel: "rest" | "snelheid" }
//   → 200 { ok, domein, punten: { verbinding, software, headers, email } }   (deel "rest", binnen ~15 s)
//   → 200 { ok, domein, punten: { snelheid } }                               (deel "snelheid", tot ~50 s)
// Elk punt: { status: goed|aandacht|slecht|onbekend, problemen, reden, waarde, bewijs }. Uitleg: server/check-rapport.mjs.
// Altijd 200 met punten; ook als onze eigen functie faalt (dan "onbekend" met reden "fout"). Alleen bij onzin-invoer 400.
// Alles gebeurt vóór res.json(): op Vercel stopt de functie zodra het antwoord weg is.
const HERKOMST = /^https:\/\/((www\.)?socialnow\.nl|socialnow-check-preview\.vercel\.app|socialnow-(website|check-preview)-[a-z0-9-]+-socialnowmarinus-4115s-projects\.vercel\.app)$/;
const LOKAAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const LEEG = { status: "onbekend", problemen: [], bewijs: [] };

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, reden: "methode" }); }
  const origin = String(req.headers.origin || "");
  if (origin && !HERKOMST.test(origin) && !LOKAAL.test(origin)) return res.status(403).json({ ok: false, reden: "herkomst" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  const domein = String(body?.domein || "").slice(0, 300);
  const deel = body?.deel === "snelheid" ? "snelheid" : "rest";
  const leeg = (reden) => (deel === "snelheid" ? { snelheid: { ...LEEG, reden } } : { verbinding: { ...LEEG, reden }, software: { ...LEEG, reden }, headers: { ...LEEG, reden }, email: { ...LEEG, reden } });

  // Limiet per IP: twintig rapporten per tien minuten; Google-metingen tien. Daarboven een nette "onbekend".
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "?";
  if (!testbankModus() && !binnenLimiet(`rapport-${deel}-ip:${ip}`, deel === "snelheid" ? 10 : 20)) return res.status(200).json({ ok: true, domein, punten: leeg("limiet") });

  try {
    const uit = deel === "snelheid" ? await meetSnelheid(domein) : await maakRapport(domein);
    return res.status(uit.ok ? 200 : 400).json(uit);
  } catch (e) {
    console.error("check-rapport fout", String(e?.message || e));
    return res.status(200).json({ ok: true, domein, punten: leeg("fout") });
  }
}
