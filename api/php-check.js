import { binnenLimiet, controleer, testbankModus } from "../server/php-check.mjs";

// POST /api/php-check  { domein, toestemming: true }
//   → 200 { ok, domein, uitslag: "groen"|"rood"|"oranje"|"onbekend", phpVersie, reden, ... }
// Uitleg, grenzen en beslisregels: server/php-check.mjs. Contract en meting:
// /Volumes/WORK/02-SOCIALNOW/php-check/testbank (npm run meet). Alles gebeurt vóór res.json(): op Vercel
// stopt de functie zodra het antwoord weg is, dus er loopt daarna niets meer.
const HERKOMST = /^https:\/\/((www\.)?socialnow\.nl|socialnow-website-[a-z0-9-]+-socialnowmarinus-4115s-projects\.vercel\.app)$/;
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
  if (!testbank && !binnenLimiet(`ip:${ip}`)) return res.status(429).json({ ok: false, reden: "limiet" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  const domein = String(body?.domein || "").slice(0, 300);
  // Het vinkje "dit is mijn site of ik heb toestemming" is verplicht. Alleen het meetscript op deze
  // Mac (testbank, nooit op Vercel) mag zonder.
  if (body?.toestemming !== true && !testbank) return res.status(400).json({ ok: false, reden: "toestemming" });
  // Hetzelfde domein niet vaker dan elke 20 seconden: niemand gebruikt ons om een site te bestoken.
  if (!testbank && !binnenLimiet(`domein:${domein.trim().toLowerCase()}`, 1, 20 * 1000)) return res.status(429).json({ ok: false, reden: "limiet-domein" });

  try {
    const uit = await controleer(domein);
    return res.status(uit.ok ? 200 : 400).json(uit);
  } catch {
    return res.status(200).json({ ok: true, domein, uitslag: "onbekend", phpVersie: null, reden: "fout" });
  }
}
