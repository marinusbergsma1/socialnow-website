// Kleine hulpjes voor de Vercel-functies. Alles wat moet gebeuren gebeurt vóór res.json():
// op Vercel stopt de functie zodra het antwoord weg is.
const TOEGESTAAN = /^https:\/\/((www\.|book\.)?socialnow\.nl|[a-z0-9-]+-socialnowmarinus-4115s-projects\.vercel\.app|socialnow-boeken[a-z0-9-]*\.vercel\.app)$/;
const LOKAAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const emmers = new Map();

export function basis(req, res, methoden) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (!methoden.includes(req.method)) {
    res.setHeader("Allow", methoden.join(", "));
    res.status(405).json({ ok: false, reden: "methode" });
    return false;
  }
  const origin = String(req.headers.origin || "");
  if (req.method !== "GET" && origin && !TOEGESTAAN.test(origin) && !LOKAAL.test(origin)) {
    res.status(403).json({ ok: false, reden: "herkomst" });
    return false;
  }
  return true;
}

// Simpele limiet per instantie: genoeg tegen een script dat de agenda volboekt.
export function binnenLimiet(sleutel, max = 8, vensterMs = 10 * 60 * 1000) {
  const nu = Date.now();
  const lijst = (emmers.get(sleutel) || []).filter((t) => nu - t < vensterMs);
  if (lijst.length >= max) { emmers.set(sleutel, lijst); return false; }
  lijst.push(nu);
  emmers.set(sleutel, lijst);
  if (emmers.size > 5000) emmers.clear();
  return true;
}

export function ip(req) {
  return String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "?";
}

export function lichaam(req) {
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = null; } }
  return b && typeof b === "object" ? b : {};
}

export function fout(res, f) {
  if (f?.code && f?.status) return res.status(f.status).json({ ok: false, reden: f.code });
  console.error("boeken", f?.status || "", f?.message || f);
  return res.status(502).json({ ok: false, reden: "agenda" });
}

export function basisUrlVan(req, ins) {
  if (!ins.demo) return ins.basisUrl;
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  const proto = /^(localhost|127\.0\.0\.1)/.test(host) ? "http" : "https";
  return host ? `${proto}://${host}` : ins.basisUrl;
}
