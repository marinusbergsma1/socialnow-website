import React, {useEffect, useState} from "react";
import {AmbientVideo} from "./motion";

export default function CharacterAccent({kind}:{kind:"coder"|"motor"}) {
  const [safari,setSafari]=useState<boolean|null>(null);
  useEffect(()=>setSafari(/^((?!chrome|crios|fxios|edg|android).)*safari/i.test(navigator.userAgent)),[]);
  const name=kind==="coder"?"milo-coder":"milo-motor-loop";
  return <div className={`h-character-accent h-character-${kind}`} aria-hidden="true">
    <AmbientVideo key={String(safari)} label="" poster={`/proposal/milo/${kind}-accent.webp`}
      sources={safari===null?[]:safari
        ? [{src:`/video/${name}-hevc.mp4`,type:'video/mp4; codecs="hvc1"'}]
        : [{src:`/video/${name}.webm`,type:"video/webm"},{src:`/video/${name}.mp4`,type:"video/mp4"}]} />
  </div>;
}
