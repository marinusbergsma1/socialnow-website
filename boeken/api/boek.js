import config from "../config.mjs";
import { boek } from "../lib/boek.mjs";
import { instellingen, kiesAgenda } from "../lib/omgeving.mjs";
import { maakBeheerToken } from "../lib/sleutel.mjs";
import { basis, binnenLimiet, fout, ip, lichaam, basisUrlVan } from "../lib/http.mjs";

// POST /api/boek { type, start, naam, email, vraag, domein, taal } → { ok, start, eind, meet, beheer }
// Controleert vlak voor het aanmaken nog een keer vrij/bezet (lib/boek.mjs). Alles gebeurt vóór res.json().
export default async function handler(req, res) {
  if (!basis(req, res, ["POST"])) return;
  const b = lichaam(req);
  if (b.website) return res.status(400).json({ ok: false, reden: "invoer" }); // honingpot voor bots
  if (!binnenLimiet(`boek:${ip(req)}`)) return res.status(429).json({ ok: false, reden: "limiet" });

  const agenda = kiesAgenda();
  if (!agenda) return res.status(503).json({ ok: false, reden: "niet-ingesteld" });
  const ins = instellingen();
  const taal = b.taal === "nl" ? "nl" : "en";
  const basisUrl = basisUrlVan(req, ins);
  const beheerUrl = ins.geheim ? (id) => `${basisUrl}/?beheer=${encodeURIComponent(maakBeheerToken(id, ins.geheim))}&lang=${taal}` : null;

  try {
    const uit = await boek({
      agenda, config, soortId: String(b.type || ""), start: String(b.start || ""),
      naam: b.naam, email: b.email, vraag: b.vraag, domein: b.domein, taal, beheerUrl, extraGasten: ins.extraGasten,
    });
    return res.status(200).json({ ok: true, demo: ins.demo, ...uit });
  } catch (f) {
    return fout(res, f);
  }
}
