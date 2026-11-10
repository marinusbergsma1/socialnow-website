const plannerUrl = 'https://script.google.com/macros/s/AKfycbyqZR6y-lWrbKO-lrkgcwfhH-GAxTlcTrpRHSNy8sI_kSfU2z5A3DTV_CIkhSPBvq2L/exec';
const salesUrl = 'https://sales.socialnow.nl/api/';
const uur = 60 * 60 * 1000;

// Standaardgastheer zolang de planner (Apps Script) nog geen gastheer meestuurt. Gelijk aan de pagina.
const standaardGastheer = { sleutel: 'marinus', naam: 'Marinus Bergsma', foto: '/images/klein/marinus-profiel-blauw-320.webp',
  telefoon: '+31637404577', whatsapp: '31637404577' };

// Rem op het openbare boeken, per serverinstantie. De planner houdt zelf één toekomstige afspraak per adres en
// een uurlimiet over alle bezoekers bij; dit vangt herhaald proberen al hier af.
const MAX_POGINGEN_PER_ADRES = 3;
const MAX_POGINGEN_PER_UUR = 30;
const pogingen = [];
function remBoeking(email, nu = Date.now()) {
  while (pogingen.length && pogingen[0].op <= nu - uur) pogingen.shift();
  const adres = String(email || '').trim().toLowerCase();
  if (pogingen.length >= MAX_POGINGEN_PER_UUR ||
      pogingen.filter(poging => poging.adres === adres).length >= MAX_POGINGEN_PER_ADRES) return true;
  pogingen.push({ adres, op: nu });
  return false;
}

// Melding aan Sales met herhaling. Mislukt alles, dan zet het uurlijkse vangnet in Sales de opvolging alsnog klaar.
async function meldAanSales(salesSleutel, gegevens, begin) {
  let status = 'onbereikbaar';
  for (const [poging, wacht] of [0, 300, 900].entries()) {
    if (poging && Date.now() - begin > 20000) break;
    if (wacht) await new Promise(klaar => setTimeout(klaar, wacht));
    try {
      const antwoord = await fetch(salesUrl + 'signalflow-boeking-melding', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + salesSleutel },
        body: JSON.stringify(gegevens), signal: AbortSignal.timeout(6000),
      });
      if (antwoord.ok) return true;
      status = antwoord.status;
      if ([400, 401, 404].includes(antwoord.status)) break;
    } catch { status = 'onbereikbaar'; }
  }
  console.error('signalflow_afspraakopvolging_mislukt', status);
  return false;
}

export default async function handler(req, res) {
  const begin = Date.now();
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'invalid' });
  }
  if (req.headers['sec-fetch-site'] === 'cross-site' ||
      req.headers['content-type']?.split(';')[0] !== 'application/json') {
    return res.status(403).json({ status: 'invalid' });
  }

  let input;
  try {
    input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!input || !['slots', 'book', 'cancel'].includes(input.operation) || JSON.stringify(input).length > 4096 ||
        (input.gastheer !== undefined && (typeof input.gastheer !== 'string' || !/^[a-z0-9-]{0,32}$/.test(input.gastheer)))) {
      return res.status(400).json({ status: 'invalid' });
    }
  } catch {
    return res.status(400).json({ status: 'invalid' });
  }

  const persoonlijk = Object.hasOwn(input, 'mailTicket');
  const salesSleutel = process.env.SIGNALFLOW_PLANNER_MELDING_KEY;
  if (persoonlijk && (typeof input.mailTicket !== 'string' || !/^[a-zA-Z0-9_-]{40,1100}$/.test(input.mailTicket))) {
    return res.status(200).json({ status: 'expired' });
  }
  if (persoonlijk && input.operation === 'book' && input.website) {
    return res.status(200).json({ status: 'invalid' });
  }
  // Annuleren kan alleen met de persoonlijke link uit de bevestiging, rechtstreeks bij Sales.
  if (input.operation === 'cancel' && (!persoonlijk || !salesSleutel)) return res.status(400).json({ status: 'invalid' });
  if (!persoonlijk && input.operation === 'book' && remBoeking(input.email)) return res.status(200).json({ status: 'limiet' });
  const payload = persoonlijk && salesSleutel ? {
    operation: input.operation,
    ticket: input.mailTicket,
    ...(input.operation === 'book' ? { slot: input.token, firstName: input.firstName, lastName: input.lastName } : {}),
  } : persoonlijk ? {
    operation: 'website-mail-' + input.operation,
    mailTicket: input.mailTicket,
    ...(input.operation === 'book' ? { token: input.token, firstName: input.firstName, lastName: input.lastName } : {}),
  } : { ...input, gastheer: input.gastheer || '', operation: 'website-' + input.operation };

  try {
    const direct = persoonlijk && Boolean(salesSleutel);
    const upstream = await fetch(direct ? salesUrl + 'signalflow-agenda-web' : plannerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(direct ? { Authorization: 'Bearer ' + salesSleutel } : {}) },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(22000),
    });
    if (direct && upstream.status === 401) return res.status(200).json({ status: 'expired' });
    if (!upstream.ok) throw new Error('Planner unavailable');
    const result = await upstream.json();
    // An older planner must never provide a public response to a personal request.
    if (persoonlijk && (!result || Array.isArray(result) ||
        !['available', 'booked', 'cancelled', 'expired', 'taken', 'pending', 'retry', 'invalid'].includes(result.status))) {
      throw new Error('Personal planner unavailable');
    }
    if (!persoonlijk && input.operation === 'slots') {
      // Een oudere planner geeft alleen een lijst; dan geldt de standaardgastheer.
      if (!Array.isArray(result) && result?.status !== 'available') return res.status(200).json(result);
      const slots = Array.isArray(result) ? result : result.slots;
      if (!Array.isArray(slots)) throw new Error('Planner unavailable');
      return res.status(200).json({ status: 'available', slots, gastheer: { ...standaardGastheer, ...(result.gastheer || {}) } });
    }
    if (!persoonlijk && input.operation === 'book' && result?.status === 'bestaat') {
      // Geen tweede afspraak: Sales stuurt de bevestiging met de link om te verzetten of te annuleren opnieuw.
      const opnieuwVerstuurd = Boolean(salesSleutel) && /^[a-f0-9]{64}$/.test(result.id || '') && await meldAanSales(salesSleutel,
        { id: result.id, uid: result.uid, start: result.start, email: input.email, opnieuw: true }, begin);
      return res.status(200).json({ status: 'bestaat', opnieuwVerstuurd });
    }
    if (!persoonlijk && input.operation === 'book' && salesSleutel &&
        result.status === 'booked' && result.invited === true) {
      // Calendar is authoritative. A follow-up outage must never invite a second booking.
      const gemeld = await meldAanSales(salesSleutel, { id: result.id, uid: result.uid, start: result.start, email: input.email }, begin);
      if (!gemeld) res.setHeader('X-Signalflow-Opvolging', 'mislukt');
    }
    return res.status(200).json(result);
  } catch {
    return res.status(502).json({ status: 'retry' });
  }
}
