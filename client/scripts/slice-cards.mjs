// Slices design/cabo-deck-sheet.webp (4x4 grid of cards on a cream background)
// into client/public/cards/{0..13,back,blank}.webp.
//
// The grid is measured from the image: a column/row counts as gutter when
// almost all of its pixels are close to the cream background colour.
//
// Usage: node client/scripts/slice-cards.mjs [sheet] [outDir]
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const sheet = process.argv[2] ?? path.resolve(here, '../../design/cabo-deck-sheet.webp');
const outDir = process.argv[3] ?? path.resolve(here, '../public/cards');
const NAMES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 'back', 'blank'];
const OUT_W = 250;
const OUT_H = 350; // 5:7
const RADIUS = 14; // px at output size, matches the art's rounded corners

const { data, info } = await sharp(sheet).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => {
  const i = (y * W + x) * 3;
  return [data[i], data[i + 1], data[i + 2]];
};

// Background colour: median of the four corner pixels.
const corners = [px(1, 1), px(W - 2, 1), px(1, H - 2), px(W - 2, H - 2)];
const bg = [0, 1, 2].map((c) => corners.map((p) => p[c]).sort((a, b) => a - b)[2]);
const isBg = (p) => Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) < 36;

function gutterProfile(len, other, get) {
  const out = [];
  for (let i = 0; i < len; i++) {
    let n = 0;
    for (let j = 0; j < other; j++) if (isBg(get(i, j))) n++;
    out.push(n / other);
  }
  return out;
}

// Find the 4 content spans along one axis.
function spans(profile, count) {
  const content = profile.map((f) => f < 0.6);
  const runs = [];
  let start = -1;
  content.forEach((c, i) => {
    if (c && start < 0) start = i;
    if (!c && start >= 0) { runs.push([start, i - 1]); start = -1; }
  });
  if (start >= 0) runs.push([start, content.length - 1]);
  const big = runs.filter(([a, b]) => b - a > profile.length / (count * 2));
  if (big.length !== count) throw new Error(`expected ${count} spans, found ${big.length}: ${JSON.stringify(runs)}`);
  return big;
}

const cols = spans(gutterProfile(W, H, (x, y) => px(x, y)), 4);
const rows = spans(gutterProfile(H, W, (y, x) => px(x, y)), 4);
console.log('background', bg, '\ncolumns', JSON.stringify(cols), '\nrows', JSON.stringify(rows));

fs.mkdirSync(outDir, { recursive: true });
const mask = Buffer.from(
  `<svg width="${OUT_W}" height="${OUT_H}"><rect width="${OUT_W}" height="${OUT_H}" rx="${RADIUS}" ry="${RADIUS}"/></svg>`,
);

let k = 0;
for (const [y0, y1] of rows) {
  for (const [x0, x1] of cols) {
    // Inset by 2px so no cream gutter or anti-aliased edge survives.
    const left = x0 + 2, top = y0 + 2, width = x1 - x0 - 3, height = y1 - y0 - 3;
    const file = path.join(outDir, `${NAMES[k]}.webp`);
    await sharp(sheet)
      .extract({ left, top, width, height })
      .resize(OUT_W, OUT_H, { fit: 'fill' })
      .composite([{ input: mask, blend: 'dest-in' }])
      .webp({ quality: 88, alphaQuality: 90 })
      .toFile(file);
    const kb = (fs.statSync(file).size / 1024).toFixed(1);
    console.log(`${NAMES[k].padEnd(5)} ${width}x${height} -> ${file.replace(process.cwd() + '/', '')} (${kb} KB)`);
    k++;
  }
}
