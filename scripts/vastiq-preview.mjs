import { createServer } from 'node:http';

// Local development only. The public site embeds vastiq.ai directly.
// Separate origin preserves VASTIQ's root-relative routes and assets.
export function startVastiqPreview() {
  return globalThis.__socialnowVastiqPreview ??= createVastiqPreview();
}
async function createVastiqPreview() {
  const server = createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405); res.end(); return;
    }
    try {
      const target = new URL(req.url || '/', 'https://vastiq.ai');
      if (target.origin !== 'https://vastiq.ai') { res.writeHead(400); res.end(); return; }
      const upstream = await fetch(target, { method: req.method, redirect: 'manual', signal: AbortSignal.timeout(15000) });
      const headers = {};
      for (const name of ['content-type', 'cache-control', 'etag', 'last-modified']) {
        const value = upstream.headers.get(name);
        if (value) headers[name] = value;
      }
      // Restrict the development frame to loopback pages. Do not forward credentials.
      headers['content-security-policy'] = "frame-ancestors http://127.0.0.1:* http://localhost:*";
      headers['x-robots-tag'] = 'noindex, nofollow';
      const location = upstream.headers.get('location');
      if (location) {
        const next = new URL(location, target);
        headers.location = next.origin === target.origin ? next.pathname + next.search : next.href;
      }
      res.writeHead(upstream.status, headers);
      res.end(req.method === 'HEAD' ? undefined : Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('VASTIQ kon niet worden geladen. Probeer opnieuw.');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4330, '127.0.0.1', resolve);
  });
  return server;
}
