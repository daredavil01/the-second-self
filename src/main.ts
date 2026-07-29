/**
 * Second Self — the core journey.
 *
 * A linear spine: threshold → five rooms → the turn → the reveal. One facet per
 * room, avatar state accumulating throughout, building to a single moment.
 *
 * The rooms are ordered the way the argument escalates, and the storm is last on
 * purpose: it is the only room that rewards doing nothing, so the silence at the
 * turn arrives as relief for one kind of player and as an ambush for the other.
 *
 *   I can't focus → I'm overwhelmed → I can't stop → I don't measure up →
 *   I never finish a thought → …oh.
 */

import * as THREE from 'three';
import { state } from './state.js';
import { createRail } from './rail.js';
import { createAvatar } from './avatar.js';
import { createAttentionRoom } from './rooms/attention.js';
import { createFloodRoom } from './rooms/flood.js';
import { createDopamineRoom } from './rooms/dopamine.js';
import { createComparisonRoom } from './rooms/comparison.js';
import { createNotificationRoom } from './rooms/notifications.js';
import { inReachOf, type Room, type RoomId } from './rooms/types.js';
import * as audio from './audio.js';
import { initAnalytics } from './analytics.js';
import { nameFor, type NamedSelf } from './share/naming.js';
import { drawCard, offerCard, toBlob } from './share/card.js';

const TRACK = 150; // world units from threshold to the turn
const TURN_AT = 0.9; // progress at which the pace breaks
const TURN_SECONDS = 3.6;

/**
 * The ending, one beat at a time.
 *
 * The name lands alone and is left alone; the line follows; only then is
 * anything asked of the person reading it. Rushing this is the difference
 * between being shown yourself and being handed a result screen.
 */
const REVEAL_HOLD = 2.6; // silence before the name
const LINE_AFTER = 2.2; // the quiet line under it
const ACTS_AFTER = 2.4; // and then, finally, the two doors

/**
 * Where each room stands along the track.
 *
 * Spaced 0.16 apart — 24 world units — because the reach window is 14.5 units
 * wide and two rooms must never be able to claim the same tap. There is a
 * breath of empty world between each pair, which the piece needs as much as it
 * needs the rooms.
 */
const PLACES: ReadonlyArray<readonly [RoomId, number]> = [
  ['attention', 0.11],
  ['flood', 0.27],
  ['dopamine', 0.43],
  ['comparison', 0.59],
  ['notifications', 0.75],
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const hint = document.getElementById('hint') as HTMLParagraphElement;
const again = document.getElementById('again') as HTMLButtonElement;
const keep = document.getElementById('keep') as HTMLButtonElement;
const acts = document.getElementById('acts') as HTMLDivElement;
const endingOverlay = document.getElementById('ending-overlay') as HTMLDivElement;
const selfName = document.getElementById('self-name') as HTMLHeadingElement;
const selfLine = document.getElementById('self-line') as HTMLParagraphElement;
const different = document.getElementById('different') as HTMLParagraphElement;

initAnalytics();

// --- preview affordances ----------------------------------------------------
// `?pace=8` runs the journey faster; `?room=comparison` starts you just short of
// one room. Both exist so a single room can be reviewed without replaying the
// six minutes in front of it, which is exactly what gate D5 asks for. Neither
// changes anything for a visitor who arrives without them.

const params = new URLSearchParams(location.search);
const pace = Math.min(40, Math.max(1, Number(params.get('pace')) || 1));
const startAt = params.get('room') as RoomId | null;

// --- renderer ---------------------------------------------------------------

/**
 * If the world cannot be drawn, say so.
 *
 * WebGL is missing or blocked more often than a desktop makes it look: old
 * Android, a locked-down work profile, a browser that has blacklisted the GPU
 * driver. Unguarded, the constructor throws, the module dies with it, and the
 * visitor gets a black rectangle and no idea whether it is still loading. The
 * accessibility line in the plan asks for a graceful failure on weak devices,
 * and this is the floor of it.
 */
function startRenderer(): THREE.WebGLRenderer | null {
  try {
    return new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return null;
  }
}

const attempted = startRenderer();
if (!attempted) {
  document.getElementById('unsupported')?.classList.add('visible');
  canvas.style.display = 'none';
  throw new Error('WebGL unavailable');
}
const renderer = attempted;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0d16');
const fog = new THREE.FogExp2('#0b0d16', 0.028);
scene.fog = fog;

const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120);

scene.add(new THREE.AmbientLight('#4a5570', 1.15));
const key = new THREE.DirectionalLight('#8fa4cc', 0.5);
key.position.set(-3, 6, 4);
scene.add(key);

// --- ground -----------------------------------------------------------------

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(300, TRACK + 120, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 1, metalness: 0 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -TRACK / 2;
scene.add(ground);

// Motes: enough depth cue to feel like a place, cheap enough for any phone.
const moteCount = reducedMotion ? 180 : 460;
const motePositions = new Float32Array(moteCount * 3);
for (let i = 0; i < moteCount; i++) {
  motePositions[i * 3] = (Math.random() - 0.5) * 40;
  motePositions[i * 3 + 1] = Math.random() * 9;
  motePositions[i * 3 + 2] = -Math.random() * (TRACK + 30) + 10;
}
const moteGeometry = new THREE.BufferGeometry();
moteGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
const motes = new THREE.Points(
  moteGeometry,
  new THREE.PointsMaterial({
    color: 0x9fb0d4,
    size: 0.055,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  })
);
scene.add(motes);

// --- the pieces -------------------------------------------------------------

const avatar = createAvatar({ reducedMotion });
scene.add(avatar.root);

const BUILD: Record<RoomId, (z: number) => Room> = {
  attention: (z) => createAttentionRoom({ z, reducedMotion }),
  flood: (z) => createFloodRoom({ z, reducedMotion }),
  dopamine: (z) => createDopamineRoom({ z, reducedMotion }),
  comparison: (z) => createComparisonRoom({ z, reducedMotion }),
  notifications: (z) => createNotificationRoom({ z, reducedMotion, pace }),
};

const rooms: Room[] = PLACES.map(([id, at]) => {
  const room = BUILD[id](-TRACK * at);
  scene.add(room.group);
  return room;
});
const byId = Object.fromEntries(rooms.map((r) => [r.id, r])) as Record<RoomId, Room>;

const rail = createRail(canvas, pace);

if (startAt) {
  const place = PLACES.find(([id]) => id === startAt);
  // Just short of the room, inside its reach window — the state you would be in
  // a moment after arriving, without the walk.
  if (place) rail.seek(Math.max(0, place[1] - 0.075));
}

// --- the choice -------------------------------------------------------------

// Scroll walks you through. Tap or hold takes whatever the room beside you is
// offering. At most one room can ever be in reach — see PLACES — so a tap is
// never ambiguous, and the moment you are past a room, its offer is gone.
// Walking on has to be final, or it is a postponement rather than a choice.

let live: Room | null = null;

rail.onChoose((kind) => {
  audio.start();
  if (phase === 'travel') live?.choose(kind);
});

canvas.addEventListener('pointerdown', () => audio.start(), { once: true });
window.addEventListener('keydown', () => audio.start(), { once: true });

// --- beats ------------------------------------------------------------------

type Phase = 'travel' | 'turn' | 'reveal';
let phase: Phase = 'travel';
let turnT = 0;
let revealT = 0;
let idleInReach = 0;

const behind = new THREE.Vector3(0, 1.62, 4.7);
const front = new THREE.Vector3(0, 1.16, -3.05);
const camPos = new THREE.Vector3();
const lookAt = new THREE.Vector3();

/**
 * Where the card is taken from.
 *
 * Further back than the reveal camera, not closer. The first attempt stood two
 * and a half metres away and produced a lamp: the figure filled the frame, its
 * glow filled the rest, and the one thing the card exists to show — a SMALL
 * luminous figure, and how much of it is left — had nowhere to be small in.
 * From here it is a figure standing in a world, with the world it walked
 * behind it, most of the way into the fog.
 */
const CARD_EYE = new THREE.Vector3(0, 1.34, -4.35);
const cardEye = new THREE.Vector3();

const easeInOut = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

function setHint(text: string): void {
  if (hint.textContent === text) return;
  hint.textContent = text;
  hint.classList.toggle('visible', Boolean(text));
}

const totalTaken = (): number => rooms.reduce((sum, room) => sum + room.taken, 0);

const show = (element: HTMLElement, yes = true): void => {
  element.classList.toggle('visible', yes);
};

// --- the card ---------------------------------------------------------------

interface Card {
  self: NamedSelf;
  canvas: HTMLCanvasElement;
  blob: Blob | null;
}

let card: Card | null = null;

/**
 * Composed once, the moment the reveal settles — not when the button is
 * pressed. Two reasons, and the second is the load-bearing one: reading four
 * megapixels back off the GPU takes long enough to be felt as a stall, and
 * Safari treats any `await` before `navigator.share()` as having left the user
 * gesture behind and refuses the call outright. By the time there is a button
 * to press, the PNG already exists.
 */
function prepareCard(): void {
  if (card) return;
  const self = nameFor(state.get());
  selfName.textContent = self.name;
  selfLine.textContent = self.line;

  cardEye.copy(CARD_EYE).add(avatar.root.position);
  const composed = drawCard(renderer, scene, avatar.focus, cardEye, self);
  card = { self, canvas: composed, blob: null };

  void toBlob(composed).then((blob) => {
    if (card?.canvas !== composed) return; // a new run started while we waited
    card.blob = blob;
    keep.disabled = blob === null;
  });
}

keep.addEventListener('click', () => {
  if (!card?.blob) return;
  void offerCard(card.blob, card.self).then((outcome) => {
    if (outcome === 'downloaded') keep.textContent = 'saved';
    if (outcome === 'shared') keep.textContent = 'shared';
  });
});

// --- loop -------------------------------------------------------------------

let last = performance.now();
let elapsed = 0; // animation time: dt-capped, so a backgrounded tab doesn't jump
let wall = 0; // interface time: what every staged beat is paced against

/**
 * The ceiling on one tick of the interface clock.
 *
 * Generous enough that a device rendering at four frames a second still keeps
 * step with the wall — which the 0.05 animation cap does not, and which is why
 * the turn used to stretch from four seconds to fourteen on a weak phone. Tight
 * enough that a tab left in the background for a minute does not come back to
 * find the turn already over. The turn is the piece; missing it is worse than
 * waiting for it.
 */
const BEAT_CAP = 0.25;

function frame(now: number): void {
  // Floored at zero as well as capped. The first rAF timestamp is the moment
  // the frame began, which can be *earlier* than the `performance.now()` this
  // module recorded while it was still setting itself up — so the very first
  // `raw` can be negative. Easing shrugged that off; a speed cap does not, and
  // the world took a step backwards before the player had touched anything.
  const raw = Math.max(0, (now - last) / 1000);
  const dt = Math.min(raw, 0.05);
  const beat = Math.min(raw, BEAT_CAP);
  last = now;
  elapsed += dt;
  wall += beat;

  const progress = rail.update(dt);
  const s = state.get();

  // The avatar travels; the world stands still and streams past it.
  avatar.root.position.z = -progress * TRACK;
  avatar.update(s, elapsed);

  // One pass over the rooms: who is beside you, who can hear you, and what the
  // world is being asked for.
  live = null;
  let haze = 0;
  let tug = 0;

  for (const room of rooms) {
    const distance = avatar.root.position.z - room.group.position.z;
    const inReach = phase === 'travel' && inReachOf(distance);
    if (inReach) live = room;
    room.update({ dt, t: elapsed, distance, inReach });
    haze = Math.max(haze, room.influence.haze);
    tug += room.influence.tug;
    audio.room(room.id, room.nearness);
  }

  // The world responds to the weight of the self it is carrying — and, where a
  // room has asked for it, closes in.
  const weight = state.weight();
  fog.density = 0.026 + weight * 0.03 + haze * 0.034;
  renderer.toneMappingExposure = 1.05 - weight * 0.12;

  if (phase === 'travel' && progress >= TURN_AT) {
    phase = 'turn';
    rail.lock();
    audio.silence(1.5);
    setHint('');
  }

  if (phase === 'turn') {
    // The interface clock, not the animation one. The turn looks like an
    // animation, but it is also a gate — nothing happens until it finishes — and
    // paced off the dt-capped accumulator it stretched from under four seconds
    // to fourteen on a device rendering at five frames a second. The camera move
    // still reads correctly because it is driven by `turnT`, not by the clock.
    turnT += beat / TURN_SECONDS;
    if (turnT >= 1) {
      turnT = 1;
      phase = 'reveal';
    }
  }

  if (phase === 'reveal') {
    // Same clock, same reason: four staged beats paced off an accumulator that
    // runs slow on a weak device would stretch a nine-second ending into half a
    // minute. See LESSONS L5.
    revealT += beat;
    // One frame in, so the figure has finished gathering itself and the capture
    // does not stall the last moments of the turn.
    if (revealT > 0.2) prepareCard();
    if (revealT > REVEAL_HOLD) {
      show(endingOverlay);
      show(selfName);
    }
    if (revealT > REVEAL_HOLD + LINE_AFTER) show(selfLine);
    if (revealT > REVEAL_HOLD + LINE_AFTER + ACTS_AFTER) {
      show(different);
      show(acts);
    }
  }

  // Camera: behind the shoulder while travelling, arcing around to meet the
  // avatar's face at the turn. This is the first time you see it look back.
  const k = easeInOut(turnT);
  const angle = k * Math.PI;
  const radius = THREE.MathUtils.lerp(behind.z, Math.abs(front.z), k);
  camPos.set(
    Math.sin(angle) * radius,
    THREE.MathUtils.lerp(behind.y, front.y, k),
    Math.cos(angle) * radius
  );
  avatar.attend(k);
  camPos.add(avatar.root.position);
  camera.position.lerp(camPos, phase === 'travel' ? 1 - Math.pow(0.001, dt) : 1);
  lookAt.copy(avatar.focus);
  // A distraction does not wait to be looked at; it takes the look. The camera
  // is pulled off the road, and settles back a moment later than you meant it to.
  lookAt.x += tug * (1 - k);
  camera.lookAt(lookAt);

  // Hints, offered late and only when the player seems to want one. No tutorial
  // wall — the calm, near-empty opening is the point, and once the verb has been
  // used once it is never offered again.
  if (phase === 'travel') {
    if (!rail.hasMoved && wall > 2.2) {
      setHint(isTouch ? 'swipe up' : 'scroll');
    } else if (live && totalTaken() === 0) {
      idleInReach += beat;
      setHint(idleInReach > 3.4 ? (isTouch ? 'tap it' : 'click it') : '');
    } else {
      setHint('');
    }
  }

  if (!reducedMotion) {
    motes.position.y = Math.sin(elapsed * 0.25) * 0.35;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

function resize(): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

again.addEventListener('click', () => {
  state.reset();
  rail.reset();
  for (const room of rooms) room.reset();
  phase = 'travel';
  turnT = 0;
  revealT = 0;
  idleInReach = 0;
  elapsed = 0;
  wall = 0;

  // The door back has to open onto a genuinely blank run, card and all — the
  // whole invitation is that this could come out differently.
  card = null;
  keep.disabled = true;
  keep.textContent = 'keep this';
  for (const element of [endingOverlay, selfName, selfLine, different, acts]) show(element, false);
  audio.restore();
});

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);

// Handy while testing the mirror — read the state the avatar is showing.
// Also what the Playwright suite drives.
declare global {
  interface Window {
    secondSelf: {
      state: typeof state;
      rooms: Record<RoomId, Room>;
      rail: typeof rail;
      /** Pure: the naming function, so the eight selves can be tested directly. */
      nameFor: typeof nameFor;
      /** The composed card, once the reveal has produced one. */
      card: () => Card | null;
      debug: () => Record<string, unknown>;
    };
  }
}

window.secondSelf = {
  state,
  rooms: byId,
  rail,
  nameFor,
  card: () => card,
  debug: () => ({
    phase,
    progress: rail.progress,
    target: rail.target,
    elapsed,
    wall,
    inReach: live?.id ?? null,
    taken: Object.fromEntries(rooms.map((r) => [r.id, r.taken])),
    hint: hint.textContent,
    self: card?.self.id ?? null,
  }),
};
