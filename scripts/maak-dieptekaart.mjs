// Dieptekaart voor het 3D-foto-effect (Diepte3D.tsx), met Depth Anything V2 small. Draait los van de site:
//   npm i @huggingface/transformers@3.7.5 sharp   (in een losse map)  en dan  node maak-dieptekaart.mjs foto.webp foto-diepte.webp
// Licht = dichtbij, donker = ver weg. 5 november 2026, eerst voor public/images/verhaal/team-atomium.webp.
import { pipeline, RawImage } from '@huggingface/transformers';
import sharp from 'sharp';
const [inp, out] = process.argv.slice(2);
const png = await sharp(inp).png().toBuffer();
const img = await RawImage.fromBlob(new Blob([png]));
const est = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small', { dtype: 'fp32' });
const { depth } = await est(img);
const d = await depth.resize(img.width, img.height);
await sharp(Buffer.from(d.data), { raw: { width: d.width, height: d.height, channels: 1 } }).blur(2).webp({ quality: 80 }).toFile(out);
console.log('ok', d.width, d.height);
