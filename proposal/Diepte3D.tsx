import React, { useEffect, useRef } from "react";

// 3D-foto zoals Apple's ruimtelijke foto's. Marinus, 4 november 2026: "Of een 3D effect zoals Apple nu ook heeft met die foto's".
// Een dieptekaart (scripts/maak-dieptekaart.mjs, licht = dichtbij) laat voorgrond en achtergrond tegen elkaar in bewegen als je de
// muis beweegt; op touch beweegt het rustig vanzelf. Het canvas ligt over de gewone <img> (alt-tekst en terugval) en neemt die pas
// over als alles geladen is. Niets bij prefers-reduced-motion of zonder WebGL. Buiten beeld staat de animatie stil.
type Props = { src: string; diepte: string; positie?: [number, number]; sterkte?: number };

const VS = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}`;
// Cover-passing zoals object-fit: cover met object-position, iets ingezoomd zodat de randen nooit leeg trekken. De verschuiving
// wordt drie keer bijgesteld (eenvoudige parallax-occlusie), zodat randen van mensen strak blijven.
const FS = `precision mediump float;varying vec2 v;uniform sampler2D uFoto;uniform sampler2D uDiepte;uniform vec2 uMuis;uniform vec2 uSchaal;uniform vec2 uPos;uniform float uSterkte;
vec2 dek(vec2 t){return (t-uPos)*uSchaal*.94+uPos;}
void main(){vec2 uv=dek(v);vec2 q=uv;for(int i=0;i<3;i++){float d=texture2D(uDiepte,q).r;q=uv+uMuis*(d-.45)*uSterkte;}
gl_FragColor=texture2D(uFoto,clamp(q,0.,1.));}`;

function laad(src: string) {
  return new Promise<HTMLImageElement>((ok, nee) => { const i = new Image(); i.decoding = "async"; i.onload = () => ok(i); i.onerror = nee; i.src = src; });
}

export default function Diepte3D({ src, diepte, positie = [0.5, 0.6], sterkte = 0.028 }: Props) {
  const doek = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = doek.current;
    if (!c || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = c.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;
    let raf = 0, zichtbaar = false, weg = false;
    const doel = { x: 0, y: 0 }, nu = { x: 0, y: 0 };
    const vanzelf = window.matchMedia("(hover: none)").matches;
    const figuur = c.parentElement as HTMLElement;

    const shader = (soort: number, bron: string) => { const s = gl.createShader(soort)!; gl.shaderSource(s, bron); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const textuur = (eenheid: number, beeld: HTMLImageElement) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + eenheid);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, beeld);
      return t;
    };
    let foto: HTMLImageElement | null = null;

    const maat = () => {
      if (!foto) return;
      const r = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(c.clientWidth * r)), h = Math.max(1, Math.round(c.clientHeight * r));
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; gl.viewport(0, 0, w, h); }
      // object-fit: cover: welk deel van de foto past in het vlak.
      const vlak = w / h, beeld = foto.naturalWidth / foto.naturalHeight;
      gl.uniform2f(u("uSchaal"), vlak > beeld ? 1 : vlak / beeld, vlak > beeld ? beeld / vlak : 1);
    };
    const teken = (t: number) => {
      raf = 0;
      if (weg || !zichtbaar) return;
      if (vanzelf) { doel.x = Math.sin(t / 2600) * 0.7; doel.y = Math.cos(t / 3400) * 0.45; }
      nu.x += (doel.x - nu.x) * 0.06; nu.y += (doel.y - nu.y) * 0.06;
      maat();
      gl.uniform2f(u("uMuis"), nu.x, nu.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(teken);
    };
    const start = () => { if (!raf && zichtbaar && foto) raf = requestAnimationFrame(teken); };
    const muis = (e: PointerEvent) => {
      const b = figuur.getBoundingClientRect();
      doel.x = Math.max(-1, Math.min(1, ((e.clientX - (b.left + b.width / 2)) / (b.width / 2)) * 0.8));
      doel.y = Math.max(-1, Math.min(1, ((e.clientY - (b.top + b.height / 2)) / (b.height / 2)) * 0.6));
    };
    const io = new IntersectionObserver(([e]) => { zichtbaar = e.isIntersecting; if (zichtbaar) start(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } });
    io.observe(c);
    if (!vanzelf) window.addEventListener("pointermove", muis, { passive: true });

    Promise.all([laad(src), laad(diepte)]).then(([f, d]) => {
      if (weg) return;
      foto = f;
      textuur(0, f); textuur(1, d);
      gl.uniform1i(u("uFoto"), 0); gl.uniform1i(u("uDiepte"), 1);
      gl.uniform2f(u("uPos"), positie[0], positie[1]);
      gl.uniform1f(u("uSterkte"), sterkte);
      maat();
      gl.uniform2f(u("uMuis"), 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      figuur.classList.add("is-3d");
      start();
    }).catch(() => {});

    return () => {
      weg = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", muis);
      figuur.classList.remove("is-3d");
    };
  }, [src, diepte, positie[0], positie[1], sterkte]);
  return <canvas ref={doek} className="sn-diepte3d" aria-hidden="true" />;
}
