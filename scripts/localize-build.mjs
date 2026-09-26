import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
// 16 september 2026: zes talen, sinds 26 september 2026 nog vier. Nederlands is de bron (sleutels),
// de andere drie zijn woordenboeken. Elke route wordt vier keer geschreven: / (Engels), /nl, /de en
// /fr, met canonical, og:locale en hreflang voor alle vier.
const LANGUAGES=['en','nl','de','fr'];
const LOCALES={en:'en_GB',nl:'nl_NL',de:'de_DE',fr:'fr_FR'};
const prefix=l=>l==='en'?'':`/${l}`;
const dictionaries=Object.fromEntries(LANGUAGES.filter(l=>l!=='nl').map(l=>[l,JSON.parse(readFileSync(`proposal/i18n/${l}.json`,'utf8'))]));
const t=(value,language)=>{const key=value.replace(/\s+/g,' ').trim();return dictionaries[language][key] ?? dictionaries.en[key] ?? value;};
const BASE='https://socialnow.nl';
const sitemap=readFileSync('dist/sitemap.xml','utf8');
const paths=[...sitemap.matchAll(/<loc>https:\/\/socialnow.nl([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
const missing=new Set();
const unescape=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;');
// Case- en blogtitels zijn merknamen plus een achtervoegsel dat al Engels is.
// Die hoeven niet vertaald te worden; ze als "ontbrekend" melden verbergt de
// regels die wel echt een vertaling missen.
const geenVertalingNodig=text=>/ \| SocialNow (Cases|Blog)$/.test(text);
const meld=text=>{if(!geenVertalingNodig(text))missing.add(text);};
function localize(value,language){
 if(typeof value==='string') {
  if(value.startsWith('http')) return value;
  const found=t(value,language);
  if(found!==value)return found;
  if(value.includes(' | '))return value.split(' | ').map(v=>localize(v,language)).join(' | ');
  if(value.includes('\n'))return value.split('\n').map(v=>localize(v,language)).join('\n');
  return value;
 }
 if(Array.isArray(value))return value.map(v=>localize(v,language));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v,language)]));
 return value;
}
const alternates=route=>LANGUAGES.map(l=>`<link rel="alternate" hreflang="${l}" href="${BASE}${prefix(l)}${route}" />`).join('')+`<link rel="alternate" hreflang="x-default" href="${BASE}${route}" />`;
for(const route of paths){
 const file=`dist${route==='/'?'':route}/index.html`;
 const source=readFileSync(file,'utf8');
 for(const language of LANGUAGES){
  const url=`${BASE}${prefix(language)}${route}`;
  let output=source.replace(/<html lang="[^"]+"/,`<html lang="${language}"`)
   .replace(/(<link\s+rel="canonical"\s+href=")[^"]+/,`$1${url}`)
   .replace(/(<meta\s+property="og:url"\s+content=")[^"]+/,`$1${url}`)
   .replace(/(<meta\s+property="og:locale"\s+content=")[^"]+/,`$1${LOCALES[language]}`);
  output=output.replace('</head>',`${alternates(route)}</head>`);
  if(language!=='nl'){
   output=output.replace(/<title>([^<]+)<\/title>/,(_,v)=>`<title>${escape(localize(unescape(v),language))}</title>`)
    .replace(/(<meta\s+(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"\s+content=")([^"]+)(")/g,(_,a,v,z)=>{
      const text=unescape(v);const translated=localize(text,language);
      if(translated===text&&language==='en')meld(text);
      return a+escape(translated)+z;
    })
    .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,a,v,z)=>a+JSON.stringify(localize(JSON.parse(v),language))+z)
    .replace(/<noscript[\s\S]*?<\/noscript\s*>/, '<noscript>SocialNow — One OS for your business. Discuss your Custom OS at info@socialnow.nl or call +31 6 3740 4577.</noscript>');
  }
  const folder=`dist${prefix(language)}${route==='/'?'':route}`;
  mkdirSync(folder,{recursive:true});writeFileSync(`${folder}/index.html`,output);
 }
}
// Italiaans en Spaans zijn eraf. Oude links naar /it en /es gaan door naar dezelfde pagina in het Engels.
for(const oud of ['it','es'])for(const route of paths){
 const doel=`${BASE}${route}`;
 const folder=`dist/${oud}${route==='/'?'':route}`;
 mkdirSync(folder,{recursive:true});
 writeFileSync(`${folder}/index.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${doel}"><meta http-equiv="refresh" content="0; url=${route}"><script>location.replace(${JSON.stringify(route)}+location.search+location.hash)</script></head><body><a href="${route}">SocialNow</a></body></html>`);
}
writeFileSync('dist/404.html',readFileSync('dist/index.html'));
writeFileSync('dist/sitemap.xml',sitemap.replace('</urlset>',LANGUAGES.filter(l=>l!=='en').flatMap(l=>paths.map(route=>`<url><loc>${BASE}${prefix(l)}${route}</loc></url>`)).join('\n')+'\n</urlset>'));
console.log(`[languages] ${paths.length*LANGUAGES.length} routes in ${LANGUAGES.length} languages with canonical and hreflang. Unmapped metadata:`,[...missing]);
