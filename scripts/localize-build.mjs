import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const dictionary=JSON.parse(readFileSync('proposal/i18n/en.json','utf8'));
const t=value=>dictionary[value.replace(/\s+/g,' ').trim()] ?? value;
const BASE='https://socialnow.nl';
const sitemap=readFileSync('dist/sitemap.xml','utf8');
const paths=[...sitemap.matchAll(/<loc>https:\/\/socialnow.nl([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
const missing=new Set();
function localize(value){
 if(typeof value==='string') {
  if(value.startsWith('http')) return value;
  const found=t(value);
  if(found!==value)return found;
  if(value.includes(' | '))return value.split(' | ').map(localize).join(' | ');
  if(value.includes('\n'))return value.split('\n').map(localize).join('\n');
  return value;
 }
 if(Array.isArray(value))return value.map(localize);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v)]));
 return value;
}
for(const route of paths){
 const file=`dist${route==='/'?'':route}/index.html`;
 const source=readFileSync(file,'utf8');
 for(const language of ['en','nl']){
  const url=`${BASE}${language==='nl'?'/nl':''}${route}`;
  let output=source.replace(/<html lang="[^"]+"/,`<html lang="${language}"`)
   .replace(/(<link\s+rel="canonical"\s+href=")[^"]+/,`$1${url}`)
   .replace(/(<meta\s+property="og:url"\s+content=")[^"]+/,`$1${url}`)
   .replace(/(<meta\s+property="og:locale"\s+content=")[^"]+/,`$1${language==='nl'?'nl_NL':'en_GB'}`);
  output=output.replace('</head>',`<link rel="alternate" hreflang="en" href="${BASE}${route}" /><link rel="alternate" hreflang="nl" href="${BASE}/nl${route}" /><link rel="alternate" hreflang="x-default" href="${BASE}${route}" /></head>`);
  if(language==='en'){
   output=output.replace(/<title>([^<]+)<\/title>/,(_,v)=>`<title>${localize(v)}</title>`)
    .replace(/(<meta\s+(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"\s+content=")([^"]+)(")/g,(_,a,v,z)=>{
      const text=v.replaceAll('&amp;','&').replaceAll('&quot;','"');const translated=localize(text);
      if(translated===text)missing.add(text);
      return a+translated.replaceAll('&','&amp;').replaceAll('"','&quot;')+z;
    })
    .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,a,v,z)=>a+JSON.stringify(localize(JSON.parse(v)))+z)
    .replace(/<noscript[\s\S]*?<\/noscript\s*>/, '<noscript>SocialNow — One OS for your business. Discuss your Custom OS at info@socialnow.nl or call +31 6 3740 4577.</noscript>');
  }
  const folder=`dist${language==='nl'?'/nl':''}${route==='/'?'':route}`;
  mkdirSync(folder,{recursive:true});writeFileSync(`${folder}/index.html`,output);
 }
}
writeFileSync('dist/404.html',readFileSync('dist/index.html'));
writeFileSync('dist/sitemap.xml',sitemap.replace('</urlset>',paths.map(route=>`<url><loc>${BASE}/nl${route}</loc></url>`).join('\n')+'\n</urlset>'));
console.log(`[languages] ${paths.length*2} EN/NL routes with canonical and hreflang. Unmapped metadata:`,[...missing]);
