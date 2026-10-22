import { timingSafeEqual, createHash } from "node:crypto";
import config from "../config.mjs";
import { berekenSlots } from "../lib/slots.mjs";
import { isoMetOffset, datumInZone, plusDagen, zoneNaarUtc } from "../lib/tijd.mjs";
import { kiesAgenda } from "../lib/omgeving.mjs";
import { basis, binnenLimiet, fout, ip } from "../lib/http.mjs";

// Privé-overzicht voor Marinus (het SocialNow OS leest dit server-side). Contract in LEESMIJ.md.
// GET /api/beheer?van=YYYY-MM-DD&tot=YYYY-MM-DD   Authorization: Bearer <BOEKING_BEHEER_SLEUTEL>
// → { ok, tijdzone, van, tot, slots: [{ start, eind, soort }], calls: [{ id, naam, email, soort, soortTitel, start, eind, vraag, domein, meet }] }
const DAG = 24 * 3600e3;
const gelijk = (a, b) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

export default async function handler(req, res) {
  if (!basis(req, res, ["GET"])) return;
  const sleutel = process.env.BOEKING_BEHEER_SLEUTEL || "";
  if (sleutel.length < 24) return res.status(503).json({ ok: false, reden: "niet-ingesteld" });
  if (!binnenLimiet(`beheer-overzicht:${ip(req)}`, 60, 10 * 60 * 1000)) return res.status(429).json({ ok: false, reden: "limiet" });
  const kop = String(req.headers.authorization || "");
  if (!kop.startsWith("Bearer ") || !gelijk(kop.slice(7).trim(), sleutel)) {
    res.setHeader("WWW-Authenticate", "Bearer");
    return res.status(401).json({ ok: false, reden: "inlog" });
  }

  const agenda = kiesAgenda();
  if (!agenda) return res.status(503).json({ ok: false, reden: "niet-ingesteld" });
  const tz = config.tijdzone;
  const nu = new Date();
  const datum = (w) => (/^\d{4}-\d\d-\d\d$/.test(String(w || "")) ? String(w) : null);
  const vanDatum = datum(req.query?.van) || datumInZone(nu, tz);
  let totDatum = datum(req.query?.tot) || plusDagen(vanDatum, 14);
  if (totDatum < vanDatum) totDatum = vanDatum;
  if (totDatum > plusDagen(vanDatum, 31)) totDatum = plusDagen(vanDatum, 31);
  const van = zoneNaarUtc(vanDatum, "00:00", tz);
  const tot = zoneNaarUtc(plusDagen(totDatum, 1), "00:00", tz); // tot en met de laatste dag

  try {
    const [bezet, geboekt] = await Promise.all([agenda.bezet(new Date(Math.max(+van, +nu)), tot), agenda.overzicht(van, tot)]);
    const slots = [];
    const ruimNu = new Date(+nu); // berekenSlots kijkt vanaf nu vooruit; venster afkappen op van/tot
    const tijdelijk = { ...config, maximaleDagenVooruit: Math.ceil((+tot - +nu) / DAG) + 1 };
    for (const soort of Object.keys(config.soorten)) {
      const duur = config.soorten[soort].minuten * 60e3;
      for (const s of berekenSlots({ config: tijdelijk, soortId: soort, nu: ruimNu, bezet })) {
        const ms = Date.parse(s);
        if (ms >= +van && ms + duur <= +tot) slots.push({ start: isoMetOffset(ms, tz), eind: isoMetOffset(ms + duur, tz), soort });
      }
    }
    slots.sort((a, b) => Date.parse(a.start) - Date.parse(b.start) || a.soort.localeCompare(b.soort));
    const calls = geboekt
      .sort((a, b) => a.start - b.start)
      .map((a) => ({
        id: a.id,
        naam: a.gastNaam || "",
        email: a.gastEmail || "",
        soort: a.soortId || "",
        soortTitel: config.soorten[a.soortId]?.titel?.nl || "",
        start: isoMetOffset(a.start, tz),
        eind: isoMetOffset(a.eind, tz),
        vraag: a.vraag || "",
        domein: a.domein || "",
        meet: a.meet || null,
      }));
    return res.status(200).json({ ok: true, tijdzone: tz, van: vanDatum, tot: totDatum, slots, calls });
  } catch (f) {
    return fout(res, f);
  }
}
