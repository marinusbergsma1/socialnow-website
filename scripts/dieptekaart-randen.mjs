// Na maak-dieptekaart.mjs: maakt de voorgrond 7 px ruimer (max-filter) en verzacht, zodat bij het 3D-effect de achtergrond rekt
// in plaats van dat randen van mensen dubbel worden. Gebruik: node dieptekaart-randen.mjs in.webp uit.webp [straal]
import sharp from 'sharp';
const [inp, out, R = '7'] = process.argv.slice(2); const r = +R;
const { data, info } = await sharp(inp).greyscale().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info; const a = new Uint8Array(w * h); const bb = new Uint8Array(w * h);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = 0; for (let k = -r; k <= r; k++) { const xx = Math.min(w - 1, Math.max(0, x + k)); m = Math.max(m, data[y * w + xx]); } a[y * w + x] = m; }
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = 0; for (let k = -r; k <= r; k++) { const yy = Math.min(h - 1, Math.max(0, y + k)); m = Math.max(m, a[yy * w + x]); } bb[y * w + x] = m; }
await sharp(Buffer.from(bb), { raw: { width: w, height: h, channels: 1 } }).blur(5).webp({ quality: 80 }).toFile(out);
console.log('ok');
