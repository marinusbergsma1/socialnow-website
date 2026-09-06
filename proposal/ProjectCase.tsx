import React, {useState} from "react";
import type {Project} from "../types";
import {ArrowUpRight, Expand} from "lucide-react";
import {Action, TextLink} from "./ui";
import {AmbientVideo} from "./motion";
import {MediaDialog, type MediaItem} from "./MediaSliders";
import {useLanguage} from "./i18n/context";

const stories: Record<string, {title:string; text:string}[]> = {
  "raveg-branding": [
    {title:"Een herkenbaar vertrekpunt",text:"De merkidentiteit vormde de basis. Van het logo en de visuele stijl tot de manier waarop RAVEG zijn producten presenteert."},
    {title:"Van merk naar product",text:"Die identiteit komt terug in het Hyperpower-verpakkingsontwerp: typografie, productbeelden en informatie vormen samen één geheel."},
    {title:"Het merk in beweging",text:"De drie video’s hieronder laten de vertaling naar motion design zien, met werk voor Dyadium en Hyperpower."},
  ],
  "universal-sony-banners": [
    {title:"Een wereld per film",text:"Voor de filmreleases van Universal en Sony Pictures ontwikkelden we campagnebeelden voor verschillende kanalen en formaten."},
    {title:"Van scherm naar groot formaat",text:"Social content, digitale buitenreclame en offline uitingen sluiten visueel op elkaar aan. Hieronder zie je een selectie van het werk."},
  ],
  "az-alkmaar-socials": [
    {title:"Ontworpen voor het moment",text:"Spelers, wedstrijden en clubmomenten krijgen elk een eigen uitwerking binnen de herkenbare beeldtaal van AZ."},
    {title:"Eén herkenbare lijn",text:"De selectie hieronder laat social artworks en campagnebeelden zien, van Champions League tot spelersvisuals."},
  ],
};
export default function ProjectCase({project,next}:{project:Project;next:Project}) {
  const [selected,setSelected]=useState<MediaItem|null>(null);
  const {t}=useLanguage();
  const isWebsite=!!project.url;
  const captions=project.slug==="raveg-branding" ? ["Dyadium","Hyperpower / 01","Hyperpower / 02"] : [];
  const gallery=project.gallery || [];
  return <>
    <header className="h-wrap h-project-heading">
      <TextLink to="/projecten">Alle projecten</TextLink>
      <div className="h-project-title-row">
        <div><p className="h-eyebrow">{project.client} / {project.year}</p><h1>{project.title}</h1><p className="h-intro">{project.description}</p></div>
        <dl className="h-project-facts"><div><dt>Klant</dt><dd>{project.client}</dd></div><div><dt>Jaar</dt><dd>{project.year}</dd></div><div><dt>Onze bijdrage</dt><dd>{project.services?.map((service,index)=><React.Fragment key={service}>{index>0 && " · "}<span>{service}</span></React.Fragment>)}</dd></div></dl>
      </div>
    </header>
    <section className="h-wrap h-project-body" aria-label="Projectuitwerking">
      {isWebsite ? <div className="h-project-live"><span className="h-eyebrow">Live website</span><h2>{project.title}</h2><Action href={project.url!}>Bekijk de live website</Action><p>Bekijk het ontwerp en de interactie op de website zelf.</p></div> :
        <button type="button" className="h-project-cover" onClick={()=>setSelected({src:project.image,title:project.title,kind:"image"})} aria-label="Vergroot het projectbeeld">
          <img src={project.image} alt={project.title} width="1920" height="1091" />
          <span><Expand size={17}/><span>Bekijk de details</span></span>
        </button>}
      <div className="h-project-story">
        <h2>Van idee naar uitvoering.</h2>
        <div>{(stories[project.slug] || [{title:"Het project",text:project.description}]).map(part=><article key={part.title}><h3>{part.title}</h3><p>{part.text}</p></article>)}</div>
      </div>
      {gallery.length>0 && <section className="h-project-selection" aria-labelledby="case-work-title"><div className="h-project-selection-heading"><h2 id="case-work-title">Het werk van dichtbij.</h2><p>Klik op een beeld of video om het volledig te bekijken.</p></div>
        <div className="h-project-media-grid">{gallery.map((src,index)=>{
          const video=/\.(mp4|webm)(?:\?|$)/i.test(src);
          const title=captions[index] || `${t(video?"Video":"Beeld")} ${index+1}`;
          const item:MediaItem={src,title,kind:video?"video":"image"};
          return <button type="button" className={`h-project-media ${video?"is-video":""}`} key={src} onClick={()=>setSelected(item)} aria-label={title}>
            {video ? <AmbientVideo src={src} label={title} hoverSound suspended={!!selected} /> : <img src={src} alt={title} loading="lazy" />}
            <span className="h-project-media-caption">{title}<ArrowUpRight size={16}/></span>
          </button>;
        })}</div>
      </section>}
      <div className="h-project-cta"><div><p className="h-eyebrow">Van dit werk naar jouw bedrijf</p><h2>Een sterk merk. Een systeem dat past.</h2></div><Action to="/contact">Bespreek je project</Action></div>
      <nav className="h-case-next" aria-label="Andere projecten"><TextLink to="/projecten">Alle projecten</TextLink><div><p>Volgend project</p><TextLink to={`/project/${next.slug}`}>{next.title}</TextLink></div></nav>
    </section>
    <MediaDialog item={selected} close={()=>setSelected(null)} />
  </>;
}
