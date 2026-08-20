// GitHub Pages SPA-fix: geef elke route een echte index.html (status 200)
// en gebruik een kopie van de SPA als 404-fallback voor dynamische routes
// zoals /project/:slug.
//
// Bovendien: geef elke route UNIEKE SEO-metadata (title, description,
// canonical, og-tags). Zonder dit deelt elke route de homepage-title én
// wees de canonical naar de homepage — waardoor Google /diensten, /prijzen
// etc. als duplicaat kan zien en niet apart indexeert.
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';

const BASE = 'https://socialnow.nl';

// Per-route metadata. Homepage (index.html) blijft ongewijzigd.
const routeMeta = {
  diensten: {
    title: 'Diensten — AI Website, CRM, Content & Ads | SocialNow',
    description: 'Ontdek de diensten van SocialNow: een AI-website die verkoopt, automatische content, CRM met opvolging en data-gestuurde advertenties. Alles onder één dak, aangestuurd via één AI-chat.',
  },
  projecten: {
    title: 'Projecten & Cases — 500+ opgeleverd | SocialNow',
    description: 'Bekijk het werk van SocialNow: 500+ projecten, gemiddeld 4.9/5. Van AI-websites en branded content tot complete verkoopsystemen voor merken door heel Nederland.',
  },
  prijzen: {
    title: 'Prijzen & Pakketten — vanaf €3.000/maand | SocialNow',
    description: 'Transparante prijzen van SocialNow. Start met een gratis proof of concept; het Alles-in-1 AI-pakket met content, CRM, ads en analytics start vanaf €3.000 per maand.',
  },
  privacy: {
    title: 'Privacybeleid | SocialNow',
    description: 'Lees hoe SocialNow omgaat met je gegevens. Transparant privacybeleid over verwerking, opslag en jouw rechten.',
  },
  team: {
    title: 'Team — Wij zijn SocialNow | SocialNow',
    description: 'Maak kennis met het team achter SocialNow, het AI-native creative agency uit Amsterdam. Founder Marinus Bergsma en het team dat merken laat groeien.',
  },
  blog: {
    title: 'Blog — AI Websites, SEO en GEO | SocialNow',
    description: 'Inzichten van SocialNow over AI websites, content automation, SEO en GEO. Praktische uitleg, geschreven vanuit de praktijk.',
  },
};

// Zichtbare kruimel-labels per route (voor de BreadcrumbList). Vul aan waar nodig.
const crumbLabels = {
  diensten: 'Diensten',
  projecten: 'Projecten',
  prijzen: 'Prijzen',
  privacy: 'Privacybeleid',
  team: 'Team',
  blog: 'Blog',
};

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const html = readFileSync('dist/index.html', 'utf8');

for (const [route, meta] of Object.entries(routeMeta)) {
  const url = `${BASE}/${route}`;
  const title = esc(meta.title);
  const desc = esc(meta.description);

  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`);

  // BreadcrumbList (GEO/SEO): Home > <route> — helpt Google breadcrumb-rich-results
  // en geeft AI-antwoordmachines de sitehiërarchie. Vóór </body> ingevoegd.
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: crumbLabels[route] || route, item: url },
    ],
  };
  const bcScript = `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;
  out = out.replace('</body>', `    ${bcScript}\n  </body>`);

  // /team: Person-graph (E-E-A-T voor Google AI-search — echte expertise tonen)
  if (route === 'team') {
    const person = (name, jobTitle) => ({ '@type': 'Person', name, jobTitle, worksFor: { '@id': `${BASE}/#organization` } });
    const teamGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        { ...person('Marinus Bergsma', 'Founder & Creative Art Director'), url: `${BASE}/team`, knowsAbout: ['AI Marketing', 'Branding', 'Creative Direction'] },
        person('Jos Hollenberg', 'Partner — OS-systemen & Groei'),
        person('Sergio Jovovic', 'Creative Marketing Designer'),
        person('Carmel Boon', 'Video & Motion Editor'),
        person('Emma Peperkamp', 'Fotograaf'),
        person('Nick van Keulen', 'Google Ads Expert'),
        person('Sid van Kalken', 'Webdeveloper'),
        person('Michel Pluister', 'Software Engineer'),
        {
          '@type': 'Organization',
          '@id': `${BASE}/#komen-consultancy`,
          name: 'Komen Consultancy',
          description: 'Partner van SocialNow voor slimme AI-systemen: financieel en strategisch fundament onder data-gedreven AI-producten.',
        },
        {
          ...person('Steef Komen', 'Partner · Slimme OS-systemen · Accountant'),
          worksFor: { '@id': `${BASE}/#komen-consultancy` },
          affiliation: { '@id': `${BASE}/#organization` },
        },
      ],
    };
    const teamScript = `<script type="application/ld+json">${JSON.stringify(teamGraph)}</script>`;
    out = out.replace('</body>', `    ${teamScript}\n  </body>`);
  }

  mkdirSync(`dist/${route}`, { recursive: true });
  writeFileSync(`dist/${route}/index.html`, out);
}

// --- Project case-study pagina's (/project/:slug) -----------------------
// Deze routes stonden al in sitemap.xml maar kregen nooit een eigen
// dist/project/<slug>/index.html. GitHub Pages gaf dus een echte 404 zodra
// iemand (of Google, of een AI-crawler) zo'n project-URL rechtstreeks
// opende, en de pagina's deelden bij client-side navigatie de homepage-meta.
// Fix hieronder, in dezelfde stijl als routeMeta hierboven: meta wordt
// afgeleid uit data/projects.ts (regex-parse, geen TS-compile nodig in dit
// losse postbuild-script). Groeit automatisch mee met nieuwe projecten.
// Blijft het patroon slug/title/client/description als quoted strings in
// data/projects.ts staan, dan werkt dit vanzelf; wijkt dat ooit af, faalt
// de regex stil (0 project-pagina's) — check dan de console-telling onder.
const projectsSrc = readFileSync('data/projects.ts', 'utf8');
const projectMeta = {};
for (const block of projectsSrc.split(/\n {2}\{/).slice(1)) {
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
  const title = block.match(/title:\s*"([^"]+)"/)?.[1];
  const client = block.match(/client:\s*"([^"]+)"/)?.[1];
  const description = block.match(/description:\s*"([^"]+)"/)?.[1];
  if (slug && !projectMeta[slug] && title && description) {
    projectMeta[slug] = { title, client, description };
  }
}

for (const [slug, p] of Object.entries(projectMeta)) {
  const url = `${BASE}/project/${slug}`;
  const pageTitle = esc(`${p.title}${p.client && p.client !== p.title ? ' — ' + p.client : ''} | SocialNow Cases`);
  const desc = esc(p.description);

  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${pageTitle}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${pageTitle}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`);

  // BreadcrumbList + CreativeWork (GEO/SEO): geeft Google en AI-antwoordmachines
  // de sitehiërarchie én een citeerbaar feitenblok per case.
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Projecten', item: `${BASE}/projecten` },
      { '@type': 'ListItem', position: 3, name: p.title, item: url },
    ],
  };
  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    ...(p.client ? { about: p.client } : {}),
    description: p.description,
    url,
    creator: { '@id': `${BASE}/#organization` },
  };
  out = out.replace(
    '</body>',
    `    <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n` +
    `    <script type="application/ld+json">${JSON.stringify(creativeWork)}</script>\n  </body>`
  );

  mkdirSync(`dist/project/${slug}`, { recursive: true });
  writeFileSync(`dist/project/${slug}/index.html`, out);
}

// --- Blog-artikelen (/blog/:slug) ----------------------------------------
// Bron is data/posts.json, echte JSON dus geen regex-parse nodig zoals bij
// projects.ts hierboven. Elk artikel krijgt een eigen index.html met unieke
// SEO-meta, BreadcrumbList, BlogPosting (met articleBody) en, als het
// artikel faqs heeft, een FAQPage. Groeit vanzelf mee zodra de dagelijkse
// schrijftaak een nieuw artikel toevoegt aan posts.json; niets hieronder
// hoeft daarvoor aangepast te worden.
let posts = [];
try {
  posts = JSON.parse(readFileSync('data/posts.json', 'utf8'));
} catch (err) {
  console.warn('[postbuild] data/posts.json niet gevonden of ongeldig, blog-paginas overgeslagen:', err.message);
}

for (const post of posts) {
  const url = `${BASE}/blog/${post.slug}`;
  const title = esc(`${post.title} | SocialNow Blog`);
  const desc = esc(post.excerpt);

  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    articleBody: post.body.replace(/^#+\s*/gm, '').replace(/^[-*>]\s*/gm, ''),
    datePublished: post.date,
    dateModified: post.date,
    image: `${BASE}/${post.coverImage}`,
    url,
    author: { '@id': `${BASE}/#organization` },
    publisher: { '@id': `${BASE}/#organization` },
    mainEntityOfPage: url,
  };
  let scripts =
    `    <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n` +
    `    <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>\n`;

  if (post.faqs && post.faqs.length > 0) {
    const faqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    };
    scripts += `    <script type="application/ld+json">${JSON.stringify(faqPage)}</script>\n`;
  }
  out = out.replace('</body>', `${scripts}  </body>`);

  mkdirSync(`dist/blog/${post.slug}`, { recursive: true });
  writeFileSync(`dist/blog/${post.slug}/index.html`, out);
}

copyFileSync('dist/index.html', 'dist/404.html');

// --- sitemap.xml volledig herbouwen ---------------------------------------
// Was handmatig onderhouden in public/sitemap.xml (nog aanwezig als
// pre-build placeholder, maar wordt hieronder overschreven). Nu afgeleid
// van dezelfde bronnen als hierboven (routeMeta, projectMeta, posts) zodat
// een nieuwe route, project of blogartikel nooit meer vergeten kan worden,
// ook niet door de dagelijkse geplande taak.
const routeSitemapMeta = {
  diensten: { changefreq: 'monthly', priority: '0.9' },
  projecten: { changefreq: 'weekly', priority: '0.9' },
  prijzen: { changefreq: 'monthly', priority: '0.8' },
  team: { changefreq: 'monthly', priority: '0.7' },
  privacy: { changefreq: 'yearly', priority: '0.3' },
  blog: { changefreq: 'daily', priority: '0.8' },
};

function buildDate() {
  return new Date().toISOString().slice(0, 10);
}

const sitemapUrls = [
  { loc: `${BASE}/`, changefreq: 'weekly', priority: '1.0' },
  ...Object.keys(routeMeta).map((route) => ({
    loc: `${BASE}/${route}`,
    ...(routeSitemapMeta[route] || { changefreq: 'monthly', priority: '0.7' }),
  })),
  ...Object.keys(projectMeta).map((slug) => ({
    loc: `${BASE}/project/${slug}`,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  ...posts.map((post) => ({
    loc: `${BASE}/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: post.date,
  })),
];

const sitemapXml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemapUrls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod || buildDate()}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n') +
  '\n</urlset>\n';

writeFileSync('dist/sitemap.xml', sitemapXml);

console.log(`[postbuild] ${Object.keys(routeMeta).length} route-pagina's + ${Object.keys(projectMeta).length} project-pagina's + ${posts.length} blog-pagina's (unieke SEO-meta) + SPA 404-fallback + sitemap.xml (${sitemapUrls.length} urls) geschreven`);
