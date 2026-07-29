/**
 * The dopamine loop.
 *
 *   Idea    variable-reward mechanics are engineered to be pulled again and
 *           again, and each pull costs a little.
 *   World   a beautiful door with a lever, standing a little off the path.
 *           Pulling it is genuinely satisfying.
 *   Choice  pull again (instant, good) or walk past (nothing happens, which
 *           feels like nothing).
 *   Mirror  every pull, the reward flickers a hair duller and the avatar gets a
 *           touch smaller and greyer. THE DOOR NEVER SAYS NO.
 *   Aha     "it felt great every single time, and I got smaller every time."
 *
 * Owns COLOUR. Nudges SCALE. Touches nothing else — see plan §3.
 *
 * The crucial asymmetry, and the reason this room is built first: the COST per
 * pull is constant while the REWARD decays. Not the other way round.
 *
 * The door stands beside the path rather than across it. You are never made to
 * engage — walking on is a real, available, unremarkable choice, and it has to
 * feel like one or the room is a corridor with a button in it.
 */

import * as THREE from 'three';
import { state } from '../state.js';
import * as audio from '../audio.js';
import {
  discloseAt,
  nearnessOf,
  spentBy,
  STILL,
  type Room,
  type RoomFrame,
  type RoomOptions,
} from './types.js';

const COST_COLOUR = 0.072;
const COST_SCALE = 0.038;
const BURST_COUNT = 90;

/** The panel reads as light, not plaster — a bright core falling off to nothing. */
function panelTexture(): THREE.CanvasTexture {
  const w = 64;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(w / 2, h * 0.42, 2, w / 2, h * 0.42, h * 0.62);
  g.addColorStop(0, 'rgba(255,236,206,1)');
  g.addColorStop(0.45, 'rgba(255,180,105,0.7)');
  g.addColorStop(1, 'rgba(255,150,80,0.05)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDopamineRoom({ z, x = -4.2, reducedMotion = false }: RoomOptions): Room {
  const group = new THREE.Group();
  group.position.z = z;

  // The door sits off the path and turns its face toward whoever is walking by.
  const door = new THREE.Group();
  door.position.x = x;
  door.rotation.y = 0.42;
  group.add(door);

  let pulls = 0;
  let near = 0;
  let leverSwing = 0; // 0 rest, 1 fully pulled
  let flash = 0;

  const warm = new THREE.Color('#ffb765');

  // --- the frame ----------------------------------------------------------

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x323848,
    roughness: 0.7,
    metalness: 0.25,
  });
  const pillar = new THREE.BoxGeometry(0.2, 3.1, 0.2);
  for (const px of [-0.99, 0.99]) {
    const mesh = new THREE.Mesh(pillar, frameMaterial);
    mesh.position.set(px, 1.55, 0);
    door.add(mesh);
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.2, 0.2), frameMaterial);
  lintel.position.y = 3.0;
  door.add(lintel);

  // --- the promise --------------------------------------------------------

  const panelMaterial = new THREE.MeshBasicMaterial({
    map: panelTexture(),
    color: warm.clone(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.78, 2.8), panelMaterial);
  panel.position.y = 1.55;
  door.add(panel);

  const panelLight = new THREE.PointLight(warm.clone(), 1.9, 11, 2);
  panelLight.position.set(0, 1.6, 0.4);
  door.add(panelLight);

  // --- the lever ----------------------------------------------------------
  // On the path-facing side, where a hand would fall.

  const leverPivot = new THREE.Group();
  leverPivot.position.set(1.24, 1.2, 0.14);
  door.add(leverPivot);

  // A bracket, so the lever reads as part of the machine rather than a lollipop
  // floating beside it.
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.16, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x3d4456, roughness: 0.6, metalness: 0.35 })
  );
  bracket.position.set(1.11, 1.2, 0.1);
  door.add(bracket);

  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.048, 0.86, 10),
    new THREE.MeshStandardMaterial({ color: 0x5b6578, roughness: 0.38, metalness: 0.6 })
  );
  arm.position.y = 0.43;
  leverPivot.add(arm);

  const knobMaterial = new THREE.MeshStandardMaterial({
    color: warm.clone(),
    emissive: warm.clone(),
    emissiveIntensity: 1.1,
    roughness: 0.25,
  });
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 16), knobMaterial);
  knob.position.y = 0.9;
  leverPivot.add(knob);

  // --- the reward ---------------------------------------------------------

  const burstGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(BURST_COUNT * 3);
  const velocities = new Float32Array(BURST_COUNT * 3);
  const burstAttribute = new THREE.BufferAttribute(positions, 3);
  burstGeometry.setAttribute('position', burstAttribute);
  const burstMaterial = new THREE.PointsMaterial({
    color: warm.clone(),
    size: 0.1,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const burst = new THREE.Points(burstGeometry, burstMaterial);
  burst.position.set(0, 1.55, 0.25);
  burst.visible = false;
  door.add(burst);
  let burstLife = 0;

  function fireBurst(strength: number): void {
    const spread = 1.5 + strength * 3.0;
    for (let i = 0; i < BURST_COUNT; i++) {
      const o = i * 3;
      positions[o] = 0;
      positions[o + 1] = 0;
      positions[o + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = (0.3 + Math.random() * 0.9) * spread;
      velocities[o] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[o + 1] = Math.abs(Math.cos(phi)) * speed * 0.8;
      velocities[o + 2] = Math.sin(phi) * Math.sin(theta) * speed * 0.6;
    }
    burstAttribute.needsUpdate = true;
    burstLife = 1;
    burst.visible = true;
    burstMaterial.opacity = 0.3 + strength * 0.5;
  }

  return {
    id: 'dopamine',
    group,
    get taken(): number {
      return pulls;
    },
    get nearness(): number {
      return near;
    },
    influence: STILL,

    /**
     * The whole point of the room, in four lines: the reward decays, the cost
     * does not, and the answer is always yes.
     */
    choose(): void {
      const strength = spentBy(pulls);

      audio.pull(strength, pulls);
      if (!reducedMotion) fireBurst(strength);
      leverSwing = 1;
      flash = 0.35 + strength * 0.65;
      pulls++;

      state.mark('colour', COST_COLOUR);
      state.mark('scale', COST_SCALE);
    },

    update({ dt, t, distance }: RoomFrame): void {
      near = nearnessOf(distance);

      // Settle the lever back. It is always ready again before you are.
      leverSwing = Math.max(0, leverSwing - dt * 3.4);
      leverPivot.rotation.x = -leverSwing * 0.95;
      flash = Math.max(0, flash - dt * 2.1);

      // Progressive disclosure: the door's light is not there at the threshold.
      // The opening has to be calm and near-empty, and a glowing destination
      // visible from the first frame gives the whole room away before the
      // player has taken a step.
      const appear = discloseAt(distance, 14);

      // The promise dims as it is spent, but never goes out — it has to stay
      // tempting, or walking past costs the player nothing.
      const spent = spentBy(pulls);
      panelMaterial.opacity = (0.3 + spent * 0.55 + flash * 0.4) * appear;
      panelLight.intensity = (0.7 + spent * 1.5 + flash * 4.5) * appear;
      knobMaterial.emissiveIntensity = (0.55 + spent * 0.75 + flash * 1.6) * appear;

      // An invitation, not an instruction: it breathes while you are near it.
      if (!reducedMotion) {
        const near = Math.max(0, 1 - Math.abs(distance) / 10) * appear;
        const breathe = Math.sin(t * 1.9) * 0.5 + 0.5;
        panelMaterial.opacity += near * breathe * 0.14 * spent;
        knob.position.y = 0.9 + Math.sin(t * 1.9) * 0.012 * near;
      }

      if (burstLife > 0) {
        burstLife -= dt * 1.15;
        const gravity = (1 - burstLife) * 2.4;
        for (let i = 0; i < BURST_COUNT; i++) {
          const o = i * 3;
          positions[o] = (positions[o] ?? 0) + (velocities[o] ?? 0) * dt;
          positions[o + 1] = (positions[o + 1] ?? 0) + ((velocities[o + 1] ?? 0) - gravity) * dt;
          positions[o + 2] = (positions[o + 2] ?? 0) + (velocities[o + 2] ?? 0) * dt;
        }
        burstAttribute.needsUpdate = true;
        burstMaterial.opacity *= 0.94;
        if (burstLife <= 0) {
          burstLife = 0;
          burstMaterial.opacity = 0;
          burst.visible = false; // or it hangs in the air for the rest of the run
        }
      }
    },

    reset(): void {
      pulls = 0;
      near = 0;
      leverSwing = 0;
      flash = 0;
      burstLife = 0;
      burstMaterial.opacity = 0;
      burst.visible = false;
    },
  };
}
