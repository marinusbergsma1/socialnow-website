import React, { useState } from "react";
import { AmbientVideo } from "./motion";
import { MediaDialog, type MediaItem } from "./MediaSliders";
import { Bento, Tegel } from "./Bento";
export const showcaseFilms = [
 {title:"Meet SocialNow OS",src:"/video/os/os-master-en.mp4",poster:"/video/os/os-master-en.webp",caption:"Productrichting / Voorbeeldomgeving",color:"#25d366"},
 {title:"Next Gen Webdesign",src:"/videos/nextgen-webdesign.mp4",caption:"Websites / Design & development",color:"#00A3E0"},
 {title:"Motion Design",src:"https://storage.googleapis.com/video-slider/FEATURED/BetCity-branded%20bumper%20ad%20-%20.mp4",caption:"BetCity / Branded motion",color:"#F7E644"},
];
// 28 september 2026 (Marinus): drie filmtegels in de bentotaal van het landingsscherm; klik opent de film groot.
export default function ShowcaseFilms(){
 const [selected,setSelected]=useState<MediaItem|null>(null);
 return <>
  <Bento id="in-beweging" className="h-showcase-films" label="Geluid bij hover · Klik voor volledig beeld" titel="See it in motion." swipe>
   {showcaseFilms.map((film)=><Tegel key={film.src} kop={film.title} breed={4} soort="film">
    <button type="button" className="h-film-knop" onClick={()=>setSelected({...film,kind:"video"})} style={{"--film-color":film.color} as React.CSSProperties} aria-label={`Bekijk ${film.title}`}>
     <AmbientVideo src={film.src} poster={film.poster} label={film.title} hoverSound suspended={!!selected} />
    </button>
    <span className="sn-tegel-badge">{film.caption}</span>
   </Tegel>)}
  </Bento>
  <MediaDialog item={selected} close={()=>setSelected(null)}/>
 </>;
}
