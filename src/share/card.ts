/**
 * The card.
 *
 * People share results, not experiences, so this is the growth engine and gets
 * treated as a first-class surface rather than a screenshot button. It is a
 * portrait of the self you built: the avatar in its final shaped state, its
 * name, one quiet line, and the way back for whoever you send it to.
 *
 * What is deliberately NOT on it: any number. No score, no percentage, no
 * minutes, no rank, no "3 of 5 rooms". A card critiquing engagement metrics
 * cannot carry one — see docs/IMPLEMENTATION-PLAN.md §6 and the naming rules
 * next door in naming.ts.
 *
 * Entirely client-side. Nothing here uploads anything; the image is composited
 * in this tab and handed straight to the OS share sheet or the download folder.
 */

import * as THREE from 'three';
import type { NamedSelf } from './naming.js';

/** 4:5 — the shape a phone feed gives the most room to. */
export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;

/** How much of the card the portrait is rendered at before the words begin. */
const HERO_HEIGHT = 980;

/**
 * The words sit in a fixed band, and the portrait dissolves before it reaches
 * it.
 *
 * The band is sized for the WORST case — the longest name, wrapped onto two
 * lines, with a two-line quiet line under it — because the first version
 * flowed the text downward from the portrait and "The One Who Said Yes to
 * Everything" promptly wrote itself straight through the link at the foot of
 * the card. Anchoring the name at the same height on every card is also what
 * makes three cards side by side look like three of the same thing.
 */
const HERO_FADES_BY = 880;
const NAME_BASELINE = 940;
const FOOT_RULE = 1212;

/**
 * Rendered at twice the display size and drawn down.
 *
 * The alternative is multisampling on the render target, which then has to be
 * resolved before the pixels can be read back. Supersampling costs one large
 * transient buffer and no branching, and this runs exactly once per run.
 */
const SUPERSAMPLE = 2;

const BACKGROUND = '#0b0d16';
const INK = 'rgb(231, 226, 216)';
const DIM = 'rgba(231, 226, 216, 0.5)';
const FAINT = 'rgba(231, 226, 216, 0.3)';

/** Canvas will not parse `ui-serif`, and a font it cannot parse it ignores. */
const SERIF = 'Georgia, "Times New Roman", serif';

/**
 * A portrait of the avatar, painted off to one side of the live scene.
 *
 * Rendered into an offscreen target rather than grabbed off the visible canvas:
 * reading back the drawing buffer would mean turning on `preserveDrawingBuffer`
 * for the whole session — a cost every visitor pays for a feature at most one
 * of them reaches — and it would frame the portrait to whatever shape the
 * player's window happens to be.
 */
function capture(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  focus: THREE.Vector3,
  at: THREE.Vector3
): HTMLCanvasElement {
  const width = CARD_WIDTH * SUPERSAMPLE;
  const height = HERO_HEIGHT * SUPERSAMPLE;

  const target = new THREE.WebGLRenderTarget(width, height);
  target.texture.colorSpace = THREE.SRGBColorSpace;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 120);
  camera.position.copy(at);
  camera.lookAt(focus);

  const previous = renderer.getRenderTarget();
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);

  const pixels = new Uint8Array(width * height * 4);
  renderer.readRenderTargetPixels(target, 0, 0, width, height, pixels);
  renderer.setRenderTarget(previous);
  target.dispose();

  const raw = document.createElement('canvas');
  raw.width = width;
  raw.height = height;
  const ctx = raw.getContext('2d')!;
  ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels.buffer), width, height), 0, 0);

  // WebGL's origin is the bottom-left corner and the 2D canvas's is the top,
  // so what came back is upside down.
  const flipped = document.createElement('canvas');
  flipped.width = width;
  flipped.height = height;
  const out = flipped.getContext('2d')!;
  out.translate(0, height);
  out.scale(1, -1);
  out.drawImage(raw, 0, 0);
  return flipped;
}

/** Longest first: the first size whose wrap fits the space is the one used. */
function layout(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  sizes: readonly number[],
  maxLines: number
): { size: number; lines: string[] } {
  let best = { size: sizes[sizes.length - 1]!, lines: [text] };

  for (const size of sizes) {
    ctx.font = `${size}px ${SERIF}`;
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line === '' ? word : `${line} ${word}`;
      if (ctx.measureText(next).width <= maxWidth || line === '') line = next;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
    best = { size, lines };
    if (lines.length <= maxLines) break;
  }

  return best;
}

/**
 * Compose the card.
 *
 * @param at where the portrait camera stands, in world space. The caller owns
 *        this because the caller knows where the avatar is standing.
 */
export function drawCard(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  focus: THREE.Vector3,
  at: THREE.Vector3,
  self: NamedSelf
): HTMLCanvasElement {
  const hero = capture(renderer, scene, focus, at);

  const card = document.createElement('canvas');
  card.width = CARD_WIDTH;
  card.height = CARD_HEIGHT;
  const ctx = card.getContext('2d')!;

  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.drawImage(hero, 0, 0, CARD_WIDTH, HERO_HEIGHT);

  // The portrait dissolves into the card rather than ending on an edge, and is
  // fully gone before the words begin.
  const fade = ctx.createLinearGradient(0, HERO_FADES_BY - 300, 0, HERO_FADES_BY);
  fade.addColorStop(0, 'rgba(11, 13, 22, 0)');
  fade.addColorStop(1, BACKGROUND);
  ctx.fillStyle = fade;
  ctx.fillRect(0, HERO_FADES_BY - 300, CARD_WIDTH, 300);
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, HERO_FADES_BY, CARD_WIDTH, CARD_HEIGHT - HERO_FADES_BY);

  const margin = 84;
  const usable = CARD_WIDTH - margin * 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const title = layout(ctx, self.name, usable, [70, 62, 54, 48], 2);
  let y = NAME_BASELINE;
  ctx.fillStyle = INK;
  ctx.font = `${title.size}px ${SERIF}`;
  for (const line of title.lines) {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += title.size * 1.22;
  }

  const quiet = layout(ctx, self.line, usable, [34, 30, 27], 2);
  y += 26;
  ctx.fillStyle = DIM;
  ctx.font = `${quiet.size}px ${SERIF}`;
  for (const line of quiet.lines) {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += quiet.size * 1.3;
  }

  // The way back, for whoever this is sent to. A hairline above it so the words
  // at the foot read as a mark rather than a caption.
  ctx.fillStyle = 'rgba(231, 226, 216, 0.14)';
  ctx.fillRect(CARD_WIDTH / 2 - 40, FOOT_RULE, 80, 1);

  ctx.fillStyle = FAINT;
  ctx.font = `26px ${SERIF}`;
  ctx.fillText('second self', CARD_WIDTH / 2, CARD_HEIGHT - 92);
  ctx.font = `21px ${SERIF}`;
  ctx.fillText(linkBack(), CARD_WIDTH / 2, CARD_HEIGHT - 52);

  return card;
}

/**
 * Where the card points.
 *
 * Taken from the `og:url` meta tag, which already has to name where this thing
 * lives for the link preview to work — so the card and the unfurl cannot drift
 * apart, and a card rendered from a local preview still carries the real
 * address rather than `127.0.0.1`. Falls back to wherever it is actually being
 * served from.
 */
export function linkBack(): string {
  const canonical = document
    .querySelector<HTMLMetaElement>('meta[property="og:url"]')
    ?.content.trim();
  const url = new URL(canonical || location.href);
  url.search = '';
  url.hash = '';
  return url.host + url.pathname;
}

export type Offered = 'shared' | 'downloaded' | 'dismissed';

const toBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

/**
 * Hand the card over — the native share sheet where there is one, the download
 * folder where there is not.
 *
 * The blob is made ahead of time and passed in, not awaited here: Safari treats
 * an `await` before `navigator.share()` as leaving the user gesture behind and
 * refuses the call. Everything this function does before sharing is synchronous
 * on purpose.
 */
export function offerCard(blob: Blob, self: NamedSelf): Promise<Offered> {
  const file = new File([blob], 'second-self.png', { type: 'image/png' });
  const url = `https://${linkBack()}`;

  if (navigator.canShare?.({ files: [file] })) {
    return navigator
      .share({ files: [file], text: `${self.name} — ${self.line}`, url })
      .then((): Offered => 'shared')
      .catch((): Offered => 'dismissed'); // AbortError: they closed the sheet
  }

  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = 'second-self.png';
  link.click();
  // Revoked on the next turn: the download has been handed to the browser by
  // then, and holding the blob any longer just holds the memory.
  setTimeout(() => URL.revokeObjectURL(href), 0);
  return Promise.resolve('downloaded');
}

export { toBlob };
