import config from "../config.mjs";
import { bekijk, verzet, annuleer } from "../lib/boek.mjs";
import { instellingen, kiesAgenda } from "../lib/omgeving.mjs";
import { leesBeheerToken } from "../lib/sleutel.mjs";
import { basis, binnenLimiet, fout, ip, lichaam } from "../lib/http.mjs";

// Beheer via de link in de uitnodiging.
// GET  /api/afspraak?t=...                          → { ok, soort, start, eind, naam }
// POST /api/afspraak { t, actie: "verzet", start }  → { ok, start, eind }
// POST /api/afspraak { t, actie: "annuleer" }       → { ok, geannuleerd }
export default async function handler(req, res) {
  if (!basis(req, res, ["GET", "POST"])) return;
  const agenda = kiesAgenda();
  if (!agenda) return res.status(503).json({ ok: false, reden: "niet-ingesteld" });
  const ins = instellingen();
  const b = req.method === "POST" ? lichaam(req) : {};
  const id = leesBeheerToken(req.method === "POST" ? b.t : req.query?.t, ins.geheim);
  if (!id) return res.status(404).json({ ok: false, reden: "onbekend" });

  try {
    if (req.method === "GET") return res.status(200).json({ ok: true, demo: ins.demo, ...(await bekijk({ agenda, id })) });
    if (!binnenLimiet(`beheer:${ip(req)}`)) return res.status(429).json({ ok: false, reden: "limiet" });
    if (b.actie === "annuleer") return res.status(200).json({ ok: true, ...(await annuleer({ agenda, id })) });
    if (b.actie === "verzet") return res.status(200).json({ ok: true, ...(await verzet({ agenda, config, id, start: String(b.start || "") })) });
    return res.status(400).json({ ok: false, reden: "actie" });
  } catch (f) {
    return fout(res, f);
  }
}
