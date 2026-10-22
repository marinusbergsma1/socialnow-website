import config from "../config.mjs";
import { berekenSlots, venster } from "../lib/slots.mjs";
import { instellingen, kiesAgenda } from "../lib/omgeving.mjs";
import { basis, fout } from "../lib/http.mjs";

// GET /api/slots            → soorten calls en instellingen voor de pagina
// GET /api/slots?type=intro → plus de vrije begintijden (UTC) voor die soort
export default async function handler(req, res) {
  if (!basis(req, res, ["GET"])) return;
  const ins = instellingen();
  const algemeen = {
    tijdzone: config.tijdzone,
    standaardSoort: config.standaardSoort,
    soorten: Object.entries(config.soorten).map(([id, s]) => ({ id, minuten: s.minuten, titel: s.titel, uitleg: s.uitleg, vraag: s.vraag, velden: s.velden })),
    demo: ins.demo,
    noodroute: ins.noodroute || null,
  };
  const type = String(req.query?.type || "");
  if (!type) return res.status(200).json({ ok: true, ...algemeen });
  if (!config.soorten[type]) return res.status(400).json({ ok: false, reden: "soort", ...algemeen });

  const agenda = kiesAgenda();
  if (!agenda) return res.status(503).json({ ok: false, reden: "niet-ingesteld", ...algemeen });
  try {
    const nu = new Date();
    const { van, tot } = venster(config, nu);
    const bezet = await agenda.bezet(van, tot);
    const slots = berekenSlots({ config, soortId: type, nu, bezet });
    return res.status(200).json({ ok: true, ...algemeen, soort: type, slots });
  } catch (f) {
    return fout(res, f);
  }
}
