/**
 * Second Self — Phase 0, the vertical slice.
 *
 * One question, and only one: does watching the avatar change in response to
 * your own choices produce "oh… that's me"?
 *
 * Everything here is in service of that. No card, no gallery, no share, no
 * hub. Threshold -> the lever -> the turn -> the reveal.
 */

import * as THREE from 'three';
import { state } from './state.js';
import { createRail } from './rail.js';
import { createAvatar } from './avatar.js';
import { createDopamineRoom } from './rooms/dopamine.js';
import * as audio from './audio.js';

const TRACK = 46; // world units from threshold to the turn
const LEVER_AT = 0.34; // where along the track the door stands
const TURN_AT = 0.82; // progress at which the pace breaks
const TURN_SECONDS = 3.6;
const REVEAL_HOLD = 2.6;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

const canvas = document.getElementById('scene');
const hint = document.getElementById('hint');
const again = document.getElementById('again');

// --- renderer ---------------------------------------------------------------

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0d16');
scene.fog = new THREE.FogExp2('#0b0d16', 0.028);

const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 120);

scene.add(new THREE.AmbientLight('#4a5570', 1.15));
const key = new THREE.DirectionalLight('#8fa4cc', 0.5);
key.position.set(-3, 6, 4);
scene.add(key);

// --- ground -----------------------------------------------------------------

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(260, 320, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 1, metalness: 0 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -TRACK / 2;
scene.add(ground);

// Motes: enough depth cue to feel like a place, cheap enough for any phone.
const moteCount = reducedMotion ? 120 : 320;
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

const room = createDopamineRoom({ z: -TRACK * LEVER_AT, x: -4.2, reducedMotion });
scene.add(room.group);

const rail = createRail(canvas);

// --- the choice -------------------------------------------------------------

// Scroll walks you past the door. Tap or hold pulls the lever. The lever is
// only reachable while you are beside it — walking on is the other choice, and
// it is made simply by continuing.
// Asymmetric on purpose. The lever is reachable across the whole approach —
// you get a long, easy invitation — but the moment you are past it, it is
// gone. Walking on has to be final, or it isn't a choice, it's a postponement.
const REACH_AHEAD = 12;
const REACH_BEHIND = -2.5;
let leverInReach = false;

rail.onChoose(() => {
  audio.start();
  if (leverInReach && phase === 'travel') room.pull();
});

canvas.addEventListener('pointerdown', () => audio.start(), { once: true });
window.addEventListener('keydown', () => audio.start(), { once: true });

// --- beats ------------------------------------------------------------------

let phase = 'travel'; // travel -> turn -> reveal
let turnT = 0;
let revealT = 0;
let idleInReach = 0;

const behind = new THREE.Vector3(0, 1.62, 4.7);
const front = new THREE.Vector3(0, 1.16, -3.05);
const camPos = new THREE.Vector3();
const lookAt = new THREE.Vector3();

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function setHint(text) {
  if (hint.textContent === text) return;
  hint.textContent = text;
  hint.classList.toggle('visible', Boolean(text));
}

// --- loop -------------------------------------------------------------------

let last = performance.now();
let elapsed = 0; // animation time: dt-capped, so a backgrounded tab doesn't jump
let wall = 0; // real time: what the hints are actually paced against

function frame(now) {
  const raw = (now - last) / 1000;
  const dt = Math.min(raw, 0.05);
  last = now;
  elapsed += dt;
  wall += raw;

  const progress = rail.update(dt);
  const s = state.get();

  // The avatar travels; the world stands still and streams past it.
  avatar.root.position.z = -progress * TRACK;
  avatar.update(s, elapsed);

  const distance = avatar.root.position.z - room.group.position.z;
  leverInReach = phase === 'travel' && distance < REACH_AHEAD && distance > REACH_BEHIND;
  room.update(dt, elapsed, distance);

  // The world responds to the weight of the self it is carrying.
  const weight = state.weight();
  scene.fog.density = 0.026 + weight * 0.032;
  renderer.toneMappingExposure = 1.05 - weight * 0.12;

  if (phase === 'travel' && progress >= TURN_AT) {
    phase = 'turn';
    rail.lock();
    audio.silence(1.5);
    setHint('');
  }

  if (phase === 'turn') {
    turnT += dt / TURN_SECONDS;
    if (turnT >= 1) {
      turnT = 1;
      phase = 'reveal';
    }
  }

  if (phase === 'reveal') {
    revealT += dt;
    if (revealT > REVEAL_HOLD) again.classList.add('visible');
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
  camera.lookAt(lookAt);

  // Hints, offered late and only when the player seems to want one. No
  // tutorial wall — the calm, near-empty opening is the point.
  if (phase === 'travel') {
    if (!rail.hasMoved && wall > 2.2) {
      setHint(isTouch ? 'swipe up' : 'scroll');
    } else if (leverInReach && room.pulls === 0) {
      idleInReach += raw;
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

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

again.addEventListener('click', () => {
  state.reset();
  rail.reset();
  room.reset();
  phase = 'travel';
  turnT = 0;
  revealT = 0;
  idleInReach = 0;
  elapsed = 0;
  wall = 0;
  again.classList.remove('visible');
  audio.restore();
});

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);

// Handy while testing the mirror — read the state the avatar is showing.
window.secondSelf = {
  state,
  room,
  rail,
  debug: () => ({
    phase,
    progress: rail.progress,
    elapsed,
    wall,
    leverInReach,
    pulls: room.pulls,
    hint: hint.textContent,
  }),
};
