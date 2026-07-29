/**
 * The information flood.
 *
 *   Idea    infinite content is not nourishment past a point; it is a tide you
 *           drown in.
 *   World   a rising body of water made of scrolling content — headlines, clips,
 *           takes. Pleasant at ankle depth. It keeps rising.
 *   Choice  take in one more (the water rises, the surface gets richer and more
 *           tempting) or wade on through to dry ground (quieter, emptier, a
 *           little boring at first).
 *   Mirror  the avatar wades, then labours. The more it takes in, the heavier
 *           and slower it moves.
 *   Aha     "I thought I was staying informed. I was just going under."
 *
 * Owns POSTURE. Nudges CLARITY — the wash muddies what you can make out. See
 * docs/IMPLEMENTATION-PLAN.md §3.
 *
 * The water never recedes inside the room. That is the honest part: you can
 * stop adding to it, but the level you are standing in is the one you chose.
 */

import * as THREE from 'three';
import { state } from '../state.js';
import * as audio from '../audio.js';
import {
  BODY_AHEAD,
  BODY_BEHIND,
  discloseAt,
  nearnessOf,
  STILL,
  type Room,
  type RoomFrame,
  type RoomOptions,
} from './types.js';

const COST_POSTURE = 0.065;
const COST_CLARITY = 0.018;
const SLABS = 16;
const SPAN = BODY_AHEAD - BODY_BEHIND + 6; // the water fills the room's own stretch
const RISE_PER_TAKE = 0.115;
const ANKLE = 0.06;
// The water stops at the chest. Over the head would be more dramatic and would
// break the rule that matters more: at its worst the figure must still be
// clearly seen. See LESSONS L7.
const CHEST = 1.2;

const WATER = new THREE.Color('#5b93c9');

/** Horizontal streaks — content read at a glance and never actually read. */
function surfaceTexture(): THREE.CanvasTexture {
  const w = 128;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(20,44,72,1)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(160,205,245,0.5)';
  for (let y = 3; y < h; y += 6) {
    const x = Math.random() * 40;
    ctx.fillRect(x, y, 20 + Math.random() * (w - x - 24), 1.6);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 9);
  return tex;
}

export function createFloodRoom({ z, reducedMotion = false }: RoomOptions): Room {
  const group = new THREE.Group();
  group.position.z = z;

  let taken = 0;
  let near = 0;
  let level = ANKLE; // eased toward its target so the rise is felt, not cut to
  let target = ANKLE;
  let swell = 0;

  // --- the water ------------------------------------------------------------

  const surface = surfaceTexture();
  const waterMaterial = new THREE.MeshBasicMaterial({
    map: surface,
    color: WATER.clone(),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(34, SPAN), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, ANKLE, BODY_AHEAD + 3 - SPAN / 2);
  water.renderOrder = 1;
  group.add(water);

  // A rim of light where the surface meets the air, so the level is legible
  // even when the water itself is nearly transparent.
  const rimMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#a9d8ff'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const rim = new THREE.Mesh(new THREE.PlaneGeometry(34, 0.05), rimMaterial);
  rim.position.set(0, ANKLE, BODY_AHEAD + 3 - SPAN / 2);
  group.add(rim);

  // --- the content ----------------------------------------------------------
  // Thin bright slabs adrift on the surface: legible as *something*, never as
  // anything in particular.

  interface Slab {
    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    speed: number;
    phase: number;
    lit: number; // 0 dormant, 1 just taken in
  }

  const slabGeometry = new THREE.BoxGeometry(1.5, 0.035, 0.42);
  const slabs: Slab[] = [];

  for (let i = 0; i < SLABS; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#cfe6ff'),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(slabGeometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 15,
      ANKLE,
      BODY_AHEAD + 3 - Math.random() * SPAN
    );
    mesh.rotation.y = (Math.random() - 0.5) * 0.9;
    group.add(mesh);
    slabs.push({
      mesh,
      material,
      speed: 0.25 + Math.random() * 0.5,
      phase: Math.random() * 7,
      lit: 0,
    });
  }

  return {
    id: 'flood',
    group,
    get taken(): number {
      return taken;
    },
    get nearness(): number {
      return near;
    },
    influence: STILL,

    choose(): void {
      taken++;
      target = Math.min(CHEST, target + RISE_PER_TAKE);
      swell = 1;
      audio.intake(taken);

      // One more slab lights up and comes toward you. It is genuinely brighter
      // and more interesting than the ones already drifting past.
      const dormant = slabs.filter((s) => s.lit <= 0);
      const pick = dormant[Math.floor(Math.random() * dormant.length)];
      if (pick) pick.lit = 1;

      state.mark('posture', COST_POSTURE);
      state.mark('clarity', COST_CLARITY);
    },

    update({ dt, t, distance }: RoomFrame): void {
      near = nearnessOf(distance, 20);
      const appear = discloseAt(distance, 17, 7);

      // The rise is eased so it reads as water finding its level rather than a
      // number changing.
      level += (target - level) * (1 - Math.pow(0.12, dt));
      swell = Math.max(0, swell - dt * 1.4);

      const depth = (level - ANKLE) / (CHEST - ANKLE); // 0 ankle-deep, 1 at the chest
      water.position.y = level;
      rim.position.y = level;
      waterMaterial.opacity = appear * (0.24 + depth * 0.34 + swell * 0.1);
      rimMaterial.opacity = appear * (0.3 + depth * 0.25);

      if (!reducedMotion) {
        // The surface never stops moving. There is always more.
        surface.offset.y = (surface.offset.y - dt * (0.06 + depth * 0.22)) % 1;
        surface.offset.x = Math.sin(t * 0.2) * 0.03;
        water.position.y += Math.sin(t * 0.9) * 0.012 * (0.3 + depth);
      }

      for (const slab of slabs) {
        const p = slab.mesh.position;
        p.z += slab.speed * dt * (1 + depth);
        // Recycled ahead of you, so the tide keeps arriving from where you are
        // going rather than washing in from behind.
        if (p.z > BODY_AHEAD + 3) {
          p.z = BODY_AHEAD + 3 - SPAN;
          p.x = (Math.random() - 0.5) * 15;
        }
        p.y = level + 0.02 + (reducedMotion ? 0 : Math.sin(t * 1.3 + slab.phase) * 0.02);

        if (slab.lit > 0) slab.lit = Math.max(0, slab.lit - dt * 0.45);
        slab.material.opacity = appear * (0.16 + depth * 0.2 + slab.lit * 0.55);
      }
    },

    reset(): void {
      taken = 0;
      near = 0;
      level = target = ANKLE;
      swell = 0;
      for (const slab of slabs) slab.lit = 0;
    },
  };
}
