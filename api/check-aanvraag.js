import { binnenLimiet } from "../server/php-check.mjs";
import { controleerAanvraag, leesAanvraag, verstuurAanvraag } from "../server/check-aanvraag.mjs";

// POST /api/check-aanvraag  { naam, email, domein, uitslag?, phpVersie?, telefoon?, hosting?, vraag?, taal?, website2 (honeypot) }
//   → 200 { ok: true }  ook als de mail niet weg kon: dan staat de aanvraag in de logs (server/check-aanvraag.mjs).
// De mail gaat vóór res.json() de deur uit: op Vercel stopt de functie zodra het antwoord weg is.
const HERKOMST = /^https:\/\/((www\.)?socialnow\.nl|socialnow-check-preview\.vercel\.app|socialnow-(website|check-preview)-[a-z0-9-]+-socialnowmarinus-4115s-projects\.vercel\.app)$/;
const LOKAAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const VELD = { naam: "naam", email: "email", domein: "domein" };

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, reden: "methode" }); }
  const origin = String(req.headers.origin || "");
  if (!origin || (!HERKOMST.test(origin) && !LOKAAL.test(origin))) return res.status(403).json({ ok: false, reden: "herkomst" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const a = leesAanvraag(body || {});
  const fout = controleerAanvraag(a);
  // Honeypot: een bot krijgt gewoon "ontvangen" en er gebeurt niets.
  if (fout === "honing") return res.status(200).json({ ok: true });
  if (fout) return res.status(400).json({ ok: false, reden: VELD[fout] });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "?";
  if (!binnenLimiet(`aanvraag-ip:${ip}`, 3, 10 * 60 * 1000) || !binnenLimiet(`aanvraag-mail:${a.email}`, 2, 60 * 60 * 1000)) {
    // Te veel aanvragen van hetzelfde IP of adres: niet mailen, wel zichtbaar in de logs.
    console.warn(`CHECK_AANVRAAG_LIMIET ${JSON.stringify({ email: a.email, domein: a.domein })}`);
    return res.status(200).json({ ok: true });
  }
  await verstuurAanvraag(a);
  return res.status(200).json({ ok: true });
}
