// Apply one consistent brand definition after localization and prerendering.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { brandMeta } from './brand-meta.mjs';
import { brandGraph } from './brand-schema.mjs';
import { partnerEntities, organizationIds } from './partner-entities.mjs';
import { getBrandFaq } from '../proposal/brand-faq.ts';

const base = 'https://socialnow.nl';
const languages = ['en', 'nl', 'de', 'fr', 'es', 'it', 'pt', 'pl', 'sv', 'da'];
const esc = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(directory, entry.name)) : entry.name === 'index.html' ? [join(directory, entry.name)] : []);
}
function normalizeIds(value) {
  if (Array.isArray(value)) return value.map(normalizeIds);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeIds(item)]));
  if (value === organizationIds.socialnow) return `${base}/#organization`;
  if (value === organizationIds.komen) return `${base}/#komen-consultancy`;
  return value;
}
let corePages = 0;
let organizationPages = 0;
for (const file of files('dist')) {
  const pieces = relative('dist', file).split('/').slice(0, -1);
  const language = languages.includes(pieces[0]) ? pieces.shift() : 'en';
  const route = `/${pieces.join('/')}`;
  let html = readFileSync(file, 'utf8');
  // Private and demonstration pages retain their own metadata and schema.
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;
  const meta = brandMeta(route, language);
  const graph = brandGraph(route, language);
  const organization = brandGraph('/', language)['@graph'].find(node => node['@type'] === 'Organization');
  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (graph && canonical) {
    const page = graph['@graph'].find(node => node['@type'] === 'WebPage');
    page.url = canonical;
    page['@id'] = `${canonical}#webpage`;
    page.name = meta.title;
  }
  if (graph && route === '/team') {
    const nodes = normalizeIds(partnerEntities(language));
    const partnerOrganization = nodes.find(node => node['@id'] === organization['@id']);
    Object.assign(graph['@graph'][0], { founder: partnerOrganization.founder });
    graph['@graph'].push(...nodes.filter(node => node['@id'] !== organization['@id']));
  }
  const replacedIds = new Set(graph?.['@graph'].map(node => node['@id']) ?? [organization['@id']]);
  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (script, body) => {
    const data = JSON.parse(body);
    if (script.includes('data-socialnow-brand')) {
      const oldOrganization = (data['@graph'] ?? [data]).find(node => node['@id'] === organization['@id']);
      if (oldOrganization) {
        Object.assign(organization, { ...(oldOrganization.email ? { email: oldOrganization.email } : {}), ...(oldOrganization.address ? { address: oldOrganization.address } : {}) });
        if (graph) Object.assign(graph['@graph'][0], organization);
      }
      return '';
    }
    // The old team graph assigned all independent people as SocialNow employees.
    if (graph && route === '/team' && data['@graph']?.some(node => node['@type'] === 'Person')) return '';
    const superseded = node => replacedIds.has(node['@id']) ||
      (node['@type'] === 'Organization' && node.name === 'SocialNow') ||
      (graph && node['@type'] === 'SoftwareApplication' && node.name === 'SocialNow OS');
    if (data['@graph']) {
      data['@graph'] = data['@graph'].filter(node => !superseded(node));
      return data['@graph'].length ? `<script type="application/ld+json">${JSON.stringify(data)}</script>` : '';
    }
    if (superseded(data)) {
      Object.assign(organization, { ...(data.email ? { email: data.email } : {}), ...(data.address ? { address: data.address } : {}) });
      if (graph) Object.assign(graph['@graph'][0], organization);
      return '';
    }
    return script;
  });
  const additions = [graph ?? { '@context': 'https://schema.org', ...organization }];
  if (['/', '/het-os', '/prijzen'].includes(route)) {
    additions.push({ '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${canonical}#questions`,
      mainEntity: getBrandFaq(language).items.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  }
  if (meta) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
    for (const [attribute, name, value] of [
      ['name', 'description', meta.description], ['property', 'og:title', meta.title],
      ['property', 'og:description', meta.description], ['name', 'twitter:title', meta.title],
      ['name', 'twitter:description', meta.description],
    ]) html = html.replace(new RegExp(`(<meta\\s+${attribute}="${name}"\\s+content=")[^"]*(")`), `$1${esc(value)}$2`);
    corePages++;
  }
  const scripts = additions.map(data => `<script type="application/ld+json" data-socialnow-brand>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`).join('\n');
  html = html.replace('</head>', `${scripts}\n</head>`);
  writeFileSync(file, html);
  organizationPages++;
}
console.log(`[brand-seo] ${corePages} kernpagina’s; ${organizationPages} pagina’s met consistente organisatiegegevens.`);
