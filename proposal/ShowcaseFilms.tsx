import React, { useState } from "react";
import { AmbientVideo } from "./motion";
import { MediaDialog, type MediaItem } from "./MediaSliders";
export const showcaseFilms = [
 {title:"Meet SocialNow OS",src:"/video/os/os-master-en.mp4",poster:"/video/os/os-master-en.webp",caption:"Productrichting / Voorbeeldomgeving",color:"#25d366"},
 {title:"Next Gen Webdesign",src:"/videos/nextgen-webdesign.mp4",caption:"Websites / Design & development",color:"#00A3E0"},
 {title:"Motion Design",src:"https://storage.googleapis.com/video-slider/FEATURED/BetCity-branded%20bumper%20ad%20-%20.mp4",caption:"BetCity / Branded motion",color:"#F7E644"},
];
export default function ShowcaseFilms(){
 const [selected,setSelected]=useState<MediaItem|null>(null);
 return <section className="h-wrap h-showcase-films" aria-labelledby="showcase-films-title">
  <div className="h-film-heading"><h2 id="showcase-films-title">See it in motion.</h2><span>Geluid bij hover · Klik voor volledig beeld</span></div>
  <div className="h-film-grid">{showcaseFilms.map((film)=><button key={film.src} type="button" onClick={()=>setSelected({...film,kind:"video"})} style={{"--film-color":film.color} as React.CSSProperties} aria-label={`Bekijk ${film.title}`}>
   <AmbientVideo src={film.src} poster={film.poster} label={film.title} hoverSound suspended={!!selected} />
   <span className="h-film-caption"><strong>{film.title}</strong><span>{film.caption}</span></span>
  </button>)}</div>
  <p className="h-film-note">De OS-film laat de productrichting zien, met voorbeeldgegevens. De beschikbare inrichting bespreken we persoonlijk.</p>
  <MediaDialog item={selected} close={()=>setSelected(null)}/>
 </section>;
}
