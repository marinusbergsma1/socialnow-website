// Bron-/rendercontrole in Node. Dit is geen visuele of interactieve browsertest.
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const { default: Page } = await server.ssrLoadModule('/proposal/WebsiteProposal.tsx');
  const { parseOsStand, installationHint, OsProof, CLAIM_URL, INSTALL_URL } = await server.ssrLoadModule('/proposal/os-entry.tsx');
  const html = renderToStaticMarkup(React.createElement(Page));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'unique element ids');
  for (const [, id] of html.matchAll(/(?:href="#|aria-controls="|aria-labelledby=")([^" ]+)"/g)) {
    assert(ids.includes(id), `existing anchor/ARIA target: ${id}`);
  }
  const images = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1]))];
  for (const src of images) assert(existsSync(`public${src}`), `image exists: ${src}`);
  assert.equal(CLAIM_URL, 'https://app.socialnow.nl/login/?bron=site');
  assert.equal(INSTALL_URL, 'https://app.socialnow.nl/?bron=installatie');

  const demo = parseOsStand({ ok: true, demo: true, customOs: 26, demos: 240 });
  const live = parseOsStand({ ok: true, live: true, total: 0 });
  assert.equal(demo.mode, 'demo');
  assert.equal(live.mode, 'live');
  for (const data of [
    null, {}, { ok: true, demo: true, live: true, total: 1, customOs: 2, demos: 3 },
    { ok: true, live: true, total: -1 }, { ok: true, live: true, total: 1.1 },
    { ok: true, demo: true, customOs: 1, demos: '2' },
    { ok: true, live: true, total: Number.MAX_SAFE_INTEGER + 1 },
  ]) assert.equal(parseOsStand(data), null);
  const demoMarkup = renderToStaticMarkup(React.createElement(OsProof, { stand: demo }));
  assert(demoMarkup.includes('Demostand') && demoMarkup.includes('geen klantgroei'));
  const liveMarkup = renderToStaticMarkup(React.createElement(OsProof, { stand: live }));
  assert(liveMarkup.includes('OS-werkruimten aangemaakt') && !liveMarkup.includes('Demostand'));
  const absentMarkup = renderToStaticMarkup(React.createElement(OsProof, { stand: null }));
  assert(absentMarkup.includes('tijdelijk niet beschikbaar') && !absentMarkup.includes('OS-werkruimten aangemaakt'));
  assert(installationHint('iPhone Safari', 'iPhone', 1).includes('beginscherm'));
  assert(installationHint('Macintosh Safari', 'MacIntel', 5).includes('beginscherm'));
  assert(installationHint('Macintosh Safari', 'MacIntel', 0).includes('Dock'));
  assert(!installationHint('Macintosh Chrome Safari', 'MacIntel', 0).includes('Dock'));
  assert(installationHint('Android Firefox', 'Linux', 1).includes('als die optie beschikbaar is'));

  if (existsSync('dist/voorstel/index.html')) {
    const preview = readFileSync('dist/voorstel/index.html', 'utf8');
    const home = readFileSync('dist/index.html', 'utf8');
    assert(preview.includes('noindex, nofollow'));
    assert(!home.includes('noindex, nofollow'));
    assert(!readFileSync('dist/sitemap.xml', 'utf8').includes('/voorstel'));
    for (const [, asset] of preview.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      assert(existsSync(`dist${asset}`), `preview bundle: ${asset}`);
    }
    for (const route of ['diensten', 'projecten', 'prijzen', 'privacy', 'team', 'blog', 'project/kwh-garant-website']) {
      assert(existsSync(`dist/${route}/index.html`), `existing route retained: ${route}`);
    }
  }
  console.log(`Geslaagd: Node-render, ${ids.length} unieke IDs en ARIA-doelen, ${images.length} bestaande afbeeldingen, instaplinks, demo/live/foutstanden, installatiehints en preview-isolatie. Geen browser gebruikt.`);
} finally {
  await server.close();
}
