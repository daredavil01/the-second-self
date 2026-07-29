/**
 * Fractured attention.
 *
 *   Idea    constant switching shreds sustained focus; the mind stops being
 *           able to see far ahead.
 *   World   a path of light plates, sharp and continuous. Bright shards drift
 *           beside it, buzzing to be looked at.
 *   Choice  chase a shard (easy, immediately gratifying) or keep your eyes on
 *           the path.
 *   Mirror  each shard chased, another plate cracks and drifts out of line, and
 *           the fog rolls a little closer.
 *   Aha     "I can't even see where I'm going any more — and I did that one tap
 *           at a time."
 *
 * Owns CLARITY. Nudges nothing in the state vector; its second effect is on the
 * WORLD — draw distance closes in — which is a fog influence, not a dimension.
 * See docs/IMPLEMENTATION-PLAN.md §3.
 *
 * The shards are finite. Unlike the lever, this room can run out, and it should:
 * the point is not that distraction is bottomless, it is that each one costs you
 * a piece of the road ahead.
 */

import * as THREE from 'three';
import { state } from '../state.js';
import * as audio from '../audio.js';
import {
  BODY_AHEAD,
  BODY_BEHIND,
  discloseAt,
  nearnessOf,
  type Room,
  type RoomFrame,
  type RoomInfluence,
  type RoomOptions,
} from './types.js';

// Costs across all five rooms are calibrated together, not room by room: a
// player who takes everything on offer everywhere should arrive high on every
// dimension but pinned on none. A vector saturated at all-ones has no shape,
// and a mirror with no shape cannot show which facets were the ones that got
// you — which is the entire reason each facet owns a dimension. Feel values,
// awaiting D5 and D6.
const COST_CLARITY = 0.075;
const SHARDS = 8;
const PLATES = 12;
// The road is laid across the room's whole body, so you are standing on it the
// entire time you are being invited off it.
const PLATE_GAP = (BODY_AHEAD - BODY_BEHIND) / (PLATES - 1);

const SHARD_COLOUR = new THREE.Color('#9ad7ff');
const PATH_COLOUR = new THREE.Color('#cfd9ea');

export function createAttentionRoom({ z, reducedMotion = false }: RoomOptions): Room {
  const group = new THREE.Group();
  group.position.z = z;

  let taken = 0;
  let near = 0;
  const influence: RoomInfluence = { haze: 0, tug: 0 };

  // --- the road ahead -------------------------------------------------------
  // Whole and continuous to begin with. Each plate carries its own break, so
  // the road comes apart in the order it was paid for.

  interface Plate {
    mesh: THREE.Mesh;
    home: THREE.Vector3;
    drift: THREE.Vector3;
    spin: number;
    broken: number; // 0 whole, 1 fully out of line
  }

  const plateMaterial = new THREE.MeshBasicMaterial({
    color: PATH_COLOUR.clone(),
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  // Wider than the gap between them, so an untouched road reads as one ribbon
  // rather than as stepping stones. It has to look whole to look broken later.
  const plateGeometry = new THREE.PlaneGeometry(2.3, PLATE_GAP + 0.3);
  const plates: Plate[] = [];

  for (let i = 0; i < PLATES; i++) {
    const mesh = new THREE.Mesh(plateGeometry, plateMaterial.clone());
    // The road always breaks in front of you: plates are consumed nearest-first
    // and the reach window sits behind the whole run of them, so the piece that
    // goes is the one you were about to put your foot on.
    const home = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      0.02,
      BODY_AHEAD - i * PLATE_GAP
    );
    mesh.position.copy(home);
    mesh.rotation.x = -Math.PI / 2;
    group.add(mesh);
    plates.push({
      mesh,
      home,
      // Broken plates go sideways and only a little upward. Sending them up into
      // the figure buries the one thing the player is supposed to be watching.
      drift: new THREE.Vector3(
        (i % 2 === 0 ? 1 : -1) * (1.8 + Math.random() * 2),
        0.1 + Math.random() * 0.4,
        (Math.random() - 0.5) * 1.6
      ),
      spin: (Math.random() - 0.5) * 1.4,
      broken: 0,
    });
  }

  // --- the distractions -----------------------------------------------------

  interface Shard {
    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    home: THREE.Vector3;
    phase: number;
    side: number;
    spent: boolean;
    flare: number;
  }

  const shardGeometry = new THREE.OctahedronGeometry(0.19, 0);
  const shards: Shard[] = [];

  for (let i = 0; i < SHARDS; i++) {
    const material = new THREE.MeshBasicMaterial({
      color: SHARD_COLOUR.clone(),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(shardGeometry, material);
    const side = i % 2 === 0 ? 1 : -1;
    const home = new THREE.Vector3(
      side * (2.6 + Math.random() * 2.2),
      0.9 + Math.random() * 1.9,
      BODY_AHEAD - i * ((BODY_AHEAD - BODY_BEHIND - 2) / (SHARDS - 1))
    );
    mesh.position.copy(home);
    group.add(mesh);
    shards.push({ mesh, material, home, phase: Math.random() * 7, side, spent: false, flare: 0 });
  }

  /**
   * The shard under your thumb: nearest, unspent, and not already behind you.
   *
   * `distance − home.z` is how far short of the shard you still are, so a
   * negative gap means you have walked past it. Same rule as the lever: once it
   * is behind you, it is gone.
   */
  function reachable(distance: number): Shard | null {
    let best: Shard | null = null;
    let bestGap = Infinity;
    for (const shard of shards) {
      if (shard.spent) continue;
      const gap = distance - shard.home.z;
      if (gap < -2) continue;
      if (gap < bestGap) {
        bestGap = gap;
        best = shard;
      }
    }
    return best;
  }

  // Where you were standing when the frame was drawn, and whether the road was
  // listening. A tap resolves against these — see `choose`.
  let atDistance = Infinity;
  let listening = false;
  let pending: Shard | null = null; // display only: which shard is lit as next
  const from = new THREE.Vector3();

  return {
    id: 'attention',
    group,
    get taken(): number {
      return taken;
    },
    get nearness(): number {
      return near;
    },
    influence,

    choose(): void {
      // Resolved at the moment of the tap, not read off a shard picked when the
      // frame was drawn: on a slow device several taps land between two frames,
      // and each one should take the next shard rather than be thrown away.
      if (!listening) return;
      const shard = reachable(atDistance);
      if (!shard) return;

      shard.spent = true;
      shard.flare = 1;
      taken++;

      // The camera is yanked toward whatever just lit up. You did not decide to
      // look; you had already looked.
      influence.tug = shard.side * 1.5;
      audio.shard(taken);

      // And the road ahead loses a piece. Always the nearest whole plate, so
      // the break is where you were about to put your foot.
      const next = plates.find((p) => p.broken === 0);
      if (next) next.broken = 0.0001;

      state.mark('clarity', COST_CLARITY);
    },

    update({ dt, t, distance, inReach }: RoomFrame): void {
      near = nearnessOf(distance, 20);
      const appear = discloseAt(distance, 17, 7);

      atDistance = distance;
      listening = inReach;
      pending = inReach ? reachable(distance) : null;

      influence.tug *= Math.pow(0.06, dt);
      // The horizon closes in with every piece of road you stopped watching.
      influence.haze = Math.min(1, taken / SHARDS) * near;

      for (const shard of shards) {
        shard.flare = Math.max(0, shard.flare - dt * 2.2);

        if (shard.spent) {
          // Consumed: it rushes the avatar, flares, and is gone. Nothing is left
          // behind — a decaying effect needs a terminal state, not just a curve.
          const k = shard.flare;
          shard.material.opacity = k * 0.95;
          shard.mesh.visible = k > 0.001;
          from.set(0, 1.1, shard.home.z);
          shard.mesh.position.lerpVectors(from, shard.home, k);
          shard.mesh.scale.setScalar(0.4 + k * 1.9);
          continue;
        }

        // Unspent: it buzzes. Brighter the closer you are, and brighter still
        // when it is the one you would take.
        const isNext = shard === pending;
        const buzz = reducedMotion ? 0.5 : Math.sin(t * 5.4 + shard.phase) * 0.5 + 0.5;
        shard.material.opacity = appear * (0.32 + buzz * 0.3 + (isNext ? 0.28 : 0));
        shard.mesh.scale.setScalar(1 + (isNext ? 0.22 : 0));
        if (!reducedMotion) {
          shard.mesh.position.y = shard.home.y + Math.sin(t * 1.6 + shard.phase) * 0.16;
          shard.mesh.rotation.y = t * 0.9 + shard.phase;
          shard.mesh.rotation.x = Math.sin(t * 0.7 + shard.phase) * 0.6;
        }
      }

      for (const plate of plates) {
        const material = plate.mesh.material as THREE.MeshBasicMaterial;
        if (plate.broken > 0) {
          plate.broken = Math.min(1, plate.broken + dt * 0.55);
          const k = plate.broken;
          plate.mesh.position.set(
            plate.home.x + plate.drift.x * k,
            plate.home.y + plate.drift.y * k,
            plate.home.z + plate.drift.z * k
          );
          plate.mesh.rotation.x = -Math.PI / 2 + plate.spin * k;
          plate.mesh.rotation.z = plate.spin * k * 1.6;
          material.opacity = appear * (0.42 - k * 0.3);
        } else {
          material.opacity = appear * 0.42;
        }
      }
    },

    reset(): void {
      taken = 0;
      near = 0;
      pending = null;
      listening = false;
      atDistance = Infinity;
      influence.haze = 0;
      influence.tug = 0;
      for (const shard of shards) {
        shard.spent = false;
        shard.flare = 0;
        shard.mesh.visible = true;
        shard.mesh.position.copy(shard.home);
        shard.mesh.scale.setScalar(1);
      }
      for (const plate of plates) {
        plate.broken = 0;
        plate.mesh.position.copy(plate.home);
        plate.mesh.rotation.set(-Math.PI / 2, 0, 0);
      }
    },
  };
}
