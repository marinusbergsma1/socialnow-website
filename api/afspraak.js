const plannerUrl = 'https://script.google.com/macros/s/AKfycbyqZR6y-lWrbKO-lrkgcwfhH-GAxTlcTrpRHSNy8sI_kSfU2z5A3DTV_CIkhSPBvq2L/exec';
const salesUrl = 'https://sales.socialnow.nl/api/';

export default async function handler(req, res) {
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
    if (!input || !['slots', 'book'].includes(input.operation) || JSON.stringify(input).length > 4096) {
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
  const payload = persoonlijk && salesSleutel ? {
    operation: input.operation,
    ticket: input.mailTicket,
    ...(input.operation === 'book' ? { slot: input.token, firstName: input.firstName, lastName: input.lastName } : {}),
  } : persoonlijk ? {
    operation: 'website-mail-' + input.operation,
    mailTicket: input.mailTicket,
    ...(input.operation === 'book' ? { token: input.token, firstName: input.firstName, lastName: input.lastName } : {}),
  } : { ...input, operation: 'website-' + input.operation };

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
        !['available', 'booked', 'expired', 'taken', 'pending', 'retry', 'invalid'].includes(result.status))) {
      throw new Error('Personal planner unavailable');
    }
    if (!persoonlijk && input.operation === 'book' && salesSleutel &&
        result.status === 'booked' && result.invited === true) {
      // Calendar is authoritative. A follow-up outage must never invite a second booking.
      try {
        const bevestiging = await fetch(salesUrl + 'signalflow-boeking-melding', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + salesSleutel },
          body: JSON.stringify({ id: result.id, uid: result.uid, start: result.start, email: input.email }),
          signal: AbortSignal.timeout(9500),
        });
        if (!bevestiging.ok) console.error('signalflow_afspraakopvolging', bevestiging.status);
      } catch { console.error('signalflow_afspraakopvolging_onbereikbaar'); }
    }
    return res.status(200).json(result);
  } catch {
    return res.status(502).json({ status: 'retry' });
  }
}
