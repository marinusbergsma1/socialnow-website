#!/usr/bin/env node
// Read-only, dependency-free check of the final postbuild/localize/prerender output.
// English lives at /; the other languages use /<language>. Run after prerender:
//   node scripts/check-brand-seo.mjs [dist-directory]
// Contracts, not copy: no exact marketing sentences or arbitrary SEO length limits.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const LANGUAGES = ['en', 'nl', 'de', 'fr', 'es', 'it', 'pt', 'pl', 'sv', 'da'];
export const CORE_ROUTES = ['/', '/het-os', '/diensten', '/projecten', '/prijzen', '/team', '/contact', '/vacatures'];
const BASE = 'https://socialnow.nl';
const LOCALES = { en: 'en_GB', nl: 'nl_NL', de: 'de_DE', fr: 'fr_FR', es: 'es_ES', it: 'it_IT', pt: 'pt_PT', pl: 'pl_PL', sv: 'sv_SE', da: 'da_DK' };
const localizedPath = (route, language) => `${language === 'en' ? '' : `/${language}`}${route}`;
const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
function decode(text) {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', euro: '€', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…' };
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (original, key) => {
    if (!key.startsWith('#')) return entities[key.toLowerCase()] ?? original;
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : '\uFFFD';
  });
}
function attributes(tag) {
  const result = {};
  const source = tag.replace(/^<\/?[\w:-]+/, '').replace(/\/?>$/, '');
  for (const match of source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    const key = match[1].toLowerCase();
    // Browsers keep the first occurrence of a duplicate attribute.
    if (!(key in result)) result[key] = decode(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

// A small tokenizer for build HTML, not a browser DOM implementation. Quoted >,
// comments, and raw-text scripts/styles cannot masquerade as metadata tags.
function inspectHtml(html) {
  const tags = [], scripts = [], titles = [];
  const tokens = /<!--[\s\S]*?-->|<\/?[a-z][\w:-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
  let inHead = false;
  for (let match; (match = tokens.exec(html));) {
    const tag = match[0];
    if (tag.startsWith('<!--')) continue;
    const name = tag.match(/^<\/?([\w:-]+)/)[1].toLowerCase();
    const closing = tag.startsWith('</');
    if (name === 'head') { inHead = !closing; continue; }
    if (closing) continue;
    const attrs = attributes(tag);
    tags.push({ name, attrs, inHead });
    if (['script', 'style', 'title', 'textarea'].includes(name)) {
      const end = new RegExp(`</${name}\\s*>`, 'gi');
      end.lastIndex = tokens.lastIndex;
      const close = end.exec(html);
      const text = html.slice(tokens.lastIndex, close?.index ?? html.length);
      if (name === 'script' && attrs.type?.trim().toLowerCase() === 'application/ld+json') scripts.push({ text, closed: Boolean(close) });
      if (name === 'title' && inHead) titles.push(normalizeText(decode(text)));
      tokens.lastIndex = close ? end.lastIndex : html.length;
    }
  }
  return { tags, scripts, titles };
}
function siteUrl(value) {
  try {
    const url = new URL(value);
    if (url.origin !== BASE || url.username || url.password || url.search || url.hash) return null;
    return `${url.origin}${url.pathname.replace(/\/+$/, '') || '/'}`;
  } catch { return null; }
}
function absoluteImage(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
}
function parseJsonLd(document, label, errors) {
  for (const [index, script] of document.scripts.entries()) {
    if (!script.closed) errors.push(`${label}: JSON-LD #${index + 1} has no closing script tag`);
    try {
      // Script contents are raw text: do NOT HTML-decode JSON-LD.
      const data = JSON.parse(script.text);
      if (!data || typeof data !== 'object' || (Array.isArray(data) && (!data.length || data.some(item => !item || typeof item !== 'object')))) {
        errors.push(`${label}: JSON-LD #${index + 1} must contain an object or a nonempty array of objects`);
      }
    } catch (error) { errors.push(`${label}: JSON-LD #${index + 1} is invalid JSON (${error.message})`); }
  }
}
function indexingErrors(document, label, errors) {
  for (const tag of document.tags.filter(tag => tag.name === 'meta' && tag.inHead)) {
    const name = tag.attrs.name?.toLowerCase();
    if (!['robots', 'googlebot', 'bingbot'].includes(name)) continue;
    const directives = (tag.attrs.content || '').toLowerCase().split(/[\s,]+/);
    if (directives.includes('noindex') || directives.includes('none')) errors.push(`${label}: ${name} prevents indexing (${tag.attrs.content})`);
  }
}

export function validateHtmlPage(html, { route, language, label = localizedPath(route, language) }) {
  const errors = [], warnings = [], document = inspectHtml(html);
  const expectedUrl = siteUrl(`${BASE}${localizedPath(route, language)}`);
  const root = document.tags.filter(tag => tag.name === 'html');
  if (root.length !== 1 || root[0].attrs.lang?.toLowerCase() !== language) errors.push(`${label}: expected one html element with lang="${language}"`);
  const links = document.tags.filter(tag => tag.name === 'link' && tag.inHead);
  const hasRel = (tag, rel) => (tag.attrs.rel || '').toLowerCase().split(/\s+/).includes(rel);
  const canonicals = links.filter(tag => hasRel(tag, 'canonical'));
  if (canonicals.length !== 1 || siteUrl(canonicals[0]?.attrs.href) !== expectedUrl) errors.push(`${label}: expected one self-canonical ${expectedUrl}`);

  const alternates = links.filter(tag => hasRel(tag, 'alternate') && 'hreflang' in tag.attrs);
  for (const target of [...LANGUAGES, 'x-default']) {
    const matching = alternates.filter(tag => tag.attrs.hreflang.toLowerCase() === target);
    const expected = siteUrl(`${BASE}${localizedPath(route, target === 'x-default' ? 'en' : target)}`);
    if (matching.length !== 1 || siteUrl(matching[0]?.attrs.href) !== expected) errors.push(`${label}: expected one hreflang="${target}" pointing to ${expected}`);
  }
  for (const tag of alternates) if (![...LANGUAGES, 'x-default'].includes(tag.attrs.hreflang.toLowerCase())) errors.push(`${label}: unexpected hreflang="${tag.attrs.hreflang}"`);

  const metas = document.tags.filter(tag => tag.name === 'meta' && tag.inHead);
  function meta(key, attribute = 'property', required = true) {
    const matches = metas.filter(tag => tag.attrs[attribute]?.toLowerCase() === key);
    if (!required && matches.length === 0) return null;
    if (matches.length !== 1 || !normalizeText(matches[0]?.attrs.content || '')) errors.push(`${label}: expected one nonempty ${key} meta tag`);
    return normalizeText(matches[0]?.attrs.content || '');
  }
  if (document.titles.length !== 1 || !document.titles[0]) errors.push(`${label}: expected one nonempty title in head`);
  const title = document.titles[0] || '';
  const description = meta('description', 'name');
  if (!/socialnow/i.test(title)) errors.push(`${label}: title must identify SocialNow`);
  const ogTitle = meta('og:title'), ogDescription = meta('og:description');
  if (ogTitle !== title) errors.push(`${label}: og:title differs from title`);
  if (ogDescription !== description) errors.push(`${label}: og:description differs from description`);
  if (siteUrl(meta('og:url')) !== expectedUrl) errors.push(`${label}: og:url must match self-canonical`);
  if (meta('og:locale') !== LOCALES[language]) errors.push(`${label}: expected og:locale ${LOCALES[language]}`);
  if (meta('og:type') !== 'website') errors.push(`${label}: core route og:type must be website`);
  if (meta('og:site_name') !== 'SocialNow') errors.push(`${label}: og:site_name must identify SocialNow`);
  const image = meta('og:image');
  if (!absoluteImage(image)) errors.push(`${label}: og:image must be an absolute HTTPS image URL`);
  const imageAlt = meta('og:image:alt', 'property', false);
  if (imageAlt === null) warnings.push(`${label}: og:image:alt is absent`);
  for (const [key, expected] of [['twitter:title', title], ['twitter:description', description], ['twitter:image', image]]) {
    const value = meta(key, 'name', false);
    if (value !== null && value !== expected) errors.push(`${label}: ${key} differs from corresponding page/Open Graph metadata`);
  }
  indexingErrors(document, label, errors);
  if (!document.scripts.length) errors.push(`${label}: no JSON-LD block present`);
  parseJsonLd(document, label, errors);
  return { errors, warnings, title, description, image, jsonLdBlocks: document.scripts.length };
}

// Google-style longest applicable group/rule; Allow wins ties. Specific bot
// groups override *, and duplicate equally specific groups are combined.
function parseRobots(text) {
  const groups = [], sitemaps = [];
  let group = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim(), split = line.indexOf(':');
    if (split < 0) continue;
    const key = line.slice(0, split).trim().toLowerCase(), value = line.slice(split + 1).trim();
    if (key === 'sitemap') { sitemaps.push(value); continue; }
    if (key === 'user-agent') {
      if (!group || group.rules.length) { group = { agents: [], rules: [] }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(key) && value) group.rules.push({ allow: key === 'allow', pattern: value });
  }
  return { groups, sitemaps };
}
function robotsAllows(groups, pathname, bot) {
  const candidates = groups.map(group => ({ ...group, specificity: Math.max(-1, ...group.agents.map(agent => agent === '*' ? 0 : bot.includes(agent) ? agent.length : -1)) }));
  const specificity = Math.max(-1, ...candidates.map(group => group.specificity));
  const matching = [];
  for (const group of candidates.filter(group => group.specificity === specificity && specificity >= 0)) {
    for (const rule of group.rules) {
      const anchored = rule.pattern.endsWith('$'), pattern = anchored ? rule.pattern.slice(0, -1) : rule.pattern;
      const expression = pattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
      if (new RegExp(`^${expression}${anchored ? '$' : ''}`).test(pathname)) matching.push({ ...rule, length: pattern.replaceAll('*', '').length });
    }
  }
  const length = Math.max(-1, ...matching.map(rule => rule.length));
  return length < 0 || matching.some(rule => rule.length === length && rule.allow);
}
function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('._')) return []; // AppleDouble metadata, not deployed HTML.
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(file);
    return entry.isFile() && entry.name.endsWith('.html') ? [file] : [];
  });
}

export function validateDist(directory = 'dist') {
  const dist = path.resolve(directory), errors = [], warnings = [], pages = new Map();
  const counts = { expectedCorePages: CORE_ROUTES.length * LANGUAGES.length, checkedCorePages: 0, htmlFiles: 0, jsonLdBlocks: 0 };
  const read = file => { try { return readFileSync(file, 'utf8'); } catch (error) { errors.push(`${path.relative(dist, file) || directory}: cannot read (${error.code || error.message})`); return null; } };
  const coreFiles = new Set();
  for (const language of LANGUAGES) for (const route of CORE_ROUTES) {
    const pathname = localizedPath(route, language), label = pathname;
    const file = path.join(dist, pathname, 'index.html');
    coreFiles.add(file);
    const html = read(file);
    if (html === null) continue;
    const result = validateHtmlPage(html, { route, language, label });
    errors.push(...result.errors); warnings.push(...result.warnings);
    pages.set(label, { ...result, language, route });
    counts.checkedCorePages++;
  }
  for (const language of LANGUAGES) {
    const seenTitles = new Map(), seenDescriptions = new Map();
    for (const [label, page] of pages) {
      if (page.language !== language) continue;
      if (page.title && seenTitles.has(page.title)) errors.push(`${label}: title duplicates ${seenTitles.get(page.title)} in ${language}`);
      if (page.description && seenDescriptions.has(page.description)) warnings.push(`${label}: description duplicates ${seenDescriptions.get(page.description)} in ${language}; review route-specific copy`);
      seenTitles.set(page.title, label); seenDescriptions.set(page.description, label);
    }
  }
  try {
    for (const file of htmlFiles(dist)) {
      counts.htmlFiles++;
      const html = read(file);
      if (html === null) continue;
      const document = inspectHtml(html);
      counts.jsonLdBlocks += document.scripts.length;
      // Core blocks were already validated; validate every other HTML file too.
      if (!coreFiles.has(file)) parseJsonLd(document, path.relative(dist, file), errors);
    }
  } catch (error) { errors.push(`${directory}: cannot enumerate HTML (${error.code || error.message})`); }

  const robotsText = read(path.join(dist, 'robots.txt'));
  if (robotsText !== null) {
    const robots = parseRobots(robotsText);
    if (!robots.sitemaps.includes(`${BASE}/sitemap.xml`)) errors.push('robots.txt: missing production sitemap declaration');
    for (const language of LANGUAGES) for (const route of CORE_ROUTES) for (const bot of ['googlebot', 'bingbot']) {
      const pathname = localizedPath(route, language);
      if (!robotsAllows(robots.groups, pathname, bot)) errors.push(`robots.txt: ${bot} cannot crawl ${pathname}`);
    }
  }
  const sitemap = read(path.join(dist, 'sitemap.xml'));
  if (sitemap !== null) {
    if (!/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/.test(sitemap)) errors.push('sitemap.xml: expected sitemap urlset and namespace');
    const locations = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/g)].map(match => decode(match[1].trim()));
    const urls = new Set();
    for (const location of locations) {
      const normalized = siteUrl(location);
      if (!normalized) errors.push(`sitemap.xml: invalid production URL ${location}`);
      else if (urls.has(normalized)) errors.push(`sitemap.xml: duplicate URL ${location}`);
      else urls.add(normalized);
    }
    for (const language of LANGUAGES) for (const route of CORE_ROUTES) {
      const url = siteUrl(`${BASE}${localizedPath(route, language)}`);
      if (!urls.has(url)) errors.push(`sitemap.xml: missing core canonical ${url}`);
    }
  }
  return { ...counts, errors, warnings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length > 3) {
    console.error('Usage: node scripts/check-brand-seo.mjs [dist-directory]');
    process.exitCode = 2;
  } else {
    const result = validateDist(process.argv[2] || 'dist');
    for (const error of result.errors) console.error(`[brand-seo] ERROR ${error}`);
    for (const warning of result.warnings) console.warn(`[brand-seo] WARN ${warning}`);
    console.log(`[brand-seo] ${result.checkedCorePages}/${result.expectedCorePages} core pages (${CORE_ROUTES.length} routes × ${LANGUAGES.length} languages); ${result.htmlFiles} HTML files; ${result.jsonLdBlocks} JSON-LD blocks; ${result.errors.length} errors; ${result.warnings.length} warnings.`);
    process.exitCode = result.errors.length ? 1 : 0;
  }
}
