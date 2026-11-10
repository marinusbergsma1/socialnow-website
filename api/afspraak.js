const plannerUrl = 'https://script.google.com/macros/s/AKfycbyqZR6y-lWrbKO-lrkgcwfhH-GAxTlcTrpRHSNy8sI_kSfU2z5A3DTV_CIkhSPBvq2L/exec';

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

  try {
    const upstream = await fetch(plannerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, operation: 'website-' + input.operation }),
      signal: AbortSignal.timeout(22000),
    });
    if (!upstream.ok) throw new Error('Planner unavailable');
    return res.status(200).json(await upstream.json());
  } catch {
    return res.status(502).json({ status: 'retry' });
  }
}
