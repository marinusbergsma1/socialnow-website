import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
// 16 september 2026: zes talen, op 26 september 2026 nog vier, sinds 5 oktober 2026 tien. Nederlands is
// de bron (sleutels), de andere negen zijn woordenboeken. Elke route wordt tien keer geschreven: / (Engels),
// /nl, /de, /fr, /es, /it, /pt, /pl, /sv en /da, met canonical, og:locale en hreflang voor alle tien.
// Een woordenboek dat nog ontbreekt of geen geldige JSON is, telt als leeg: die taal valt terug op het Engels.
const LANGUAGES=['en','nl','de','fr','es','it','pt','pl','sv','da'];
const LOCALES={en:'en_GB',nl:'nl_NL',de:'de_DE',fr:'fr_FR',es:'es_ES',it:'it_IT',pt:'pt_PT',pl:'pl_PL',sv:'sv_SE',da:'da_DK'};
const prefix=l=>l==='en'?'':`/${l}`;
const leesWoordenboek=l=>{try{return JSON.parse(readFileSync(`proposal/i18n/${l}.json`,'utf8'));}catch{console.warn(`[languages] proposal/i18n/${l}.json ontbreekt of is ongeldig; terugval op het Engels`);return {};}};
const dictionaries=Object.fromEntries(LANGUAGES.filter(l=>l!=='nl').map(l=>[l,leesWoordenboek(l)]));
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
    .replace(/(<noscript data-vertaal>)([\s\S]*?)(<\/noscript>)/,(_,a,v,z)=>a+v.replaceAll('-nl-45.mp4','-en-45.mp4').replace(/>([^<]+)</g,(m,tekst)=>tekst.trim()?'>'+escape(t(unescape(tekst.trim()),language))+'<':m)+z)
    .replace(/<noscript(?! data-vertaal)[\s\S]*?<\/noscript\s*>/, '<noscript>SocialNow — One OS for your business. Discuss your Custom OS at steef@socialnow.nl.</noscript>');
  }
  const folder=`dist${prefix(language)}${route==='/'?'':route}`;
  mkdirSync(folder,{recursive:true});writeFileSync(`${folder}/index.html`,output);
 }
}
writeFileSync('dist/404.html',readFileSync('dist/index.html'));
writeFileSync('dist/sitemap.xml',sitemap.replace('</urlset>',LANGUAGES.filter(l=>l!=='en').flatMap(l=>paths.map(route=>`<url><loc>${BASE}${prefix(l)}${route}</loc></url>`)).join('\n')+'\n</urlset>'));
console.log(`[languages] ${paths.length*LANGUAGES.length} routes in ${LANGUAGES.length} languages with canonical and hreflang. Unmapped metadata:`,[...missing]);
