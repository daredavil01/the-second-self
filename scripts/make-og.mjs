/**
 * The link preview image.
 *
 * A shared link that unfurls as a grey box is a shared link nobody opens, so
 * Open Graph needs a real image — and Open Graph needs a *raster* one: SVG is
 * not honoured by any of the major unfurlers.
 *
 * Rather than commit a binary nobody can diff, or pull in a canvas dependency
 * for one 1200×630 image, this draws it arithmetically and encodes the PNG by
 * hand. Node's zlib does the only hard part. Run `npm run og` after changing
 * anything here; the output is committed so a plain `npm run build` needs no
 * extra step.
 *
 * There is deliberately NO TEXT in it. The title and description are supplied
 * by the meta tags right next to it, and restraint is the aesthetic — a dark
 * field, a small warm figure, and the fog it is standing in.
 */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const WIDTH = 1200;
const HEIGHT = 630;
const OUT = 'public/og.png';

// --- the picture ------------------------------------------------------------

const WARM = [255, 194, 122];
const TOP = [9, 11, 19];
const BOTTOM = [14, 17, 28];

const cx = WIDTH / 2;
const cy = 330; // the figure stands a little above centre
const horizon = 408;

const clamp = (n) => (n < 0 ? 0 : n > 255 ? 255 : Math.round(n));
const falloff = (d, radius) => Math.exp(-((d / radius) ** 2));

/** Distance to a vertical capsule — the figure, at the crudest possible scale. */
function toCapsule(x, y, top, bottom) {
  const dy = y < top ? y - top : y > bottom ? y - bottom : 0;
  return Math.hypot(x - cx, dy);
}

const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const t = y / HEIGHT;
    let r = TOP[0] + (BOTTOM[0] - TOP[0]) * t;
    let g = TOP[1] + (BOTTOM[1] - TOP[1]) * t;
    let b = TOP[2] + (BOTTOM[2] - TOP[2]) * t;

    // The ground it is standing on: a shade lighter, and a hairline where the
    // two meet, fading out towards the edges of the frame.
    if (y > horizon) {
      const into = Math.min(1, (y - horizon) / 220);
      r += 9 * into;
      g += 10 * into;
      b += 14 * into;
    }
    const edge = falloff(y - horizon, 2.5) * falloff(x - cx, 520) * 26;
    r += edge;
    g += edge * 1.02;
    b += edge * 1.1;

    // Its halo, squashed vertically so it reads as light in fog rather than a
    // sun, and the figure itself inside it: a torso and a head, which is the
    // least geometry that stops reading as a lamp and starts reading as someone.
    // Kept under the clipping point — a warm figure, never a white one.
    const halo = falloff(Math.hypot((x - cx) * 0.78, y - cy), 205) * 0.3;
    const torso = falloff(toCapsule(x, y, cy - 6, cy + 34), 21) * 0.62;
    const head = falloff(Math.hypot(x - cx, y - (cy - 34)), 17) * 0.6;
    const light = halo + torso + head;

    r += WARM[0] * light;
    g += WARM[1] * light;
    b += WARM[2] * light;

    // A vignette, so the eye is left with nowhere else to go.
    const vignette =
      1 - 0.42 * Math.min(1, Math.hypot((x - cx) / (WIDTH / 2), (y - HEIGHT / 2) / (HEIGHT / 2)));
    const i = (y * WIDTH + x) * 3;
    pixels[i] = clamp(r * vignette);
    pixels[i + 1] = clamp(g * vignette);
    pixels[i + 2] = clamp(b * vignette);
  }
}

// --- the PNG ----------------------------------------------------------------

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // colour type: truecolour, no alpha
// bytes 10-12 stay zero: deflate, adaptive filtering, no interlacing

// Every scanline carries a filter byte. Filter 0 (none) keeps this readable;
// the image is smooth gradients, which deflate handles well regardless.
const stride = WIDTH * 3;
const raw = Buffer.alloc(HEIGHT * (stride + 1));
for (let y = 0; y < HEIGHT; y++) {
  raw[y * (stride + 1)] = 0;
  pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync('public', { recursive: true });
writeFileSync(OUT, png);
console.log(`✓ ${OUT} — ${WIDTH}×${HEIGHT}, ${Math.round(png.length / 1024)}KB`);
