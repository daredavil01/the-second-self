/**
 * The comparison corridor.
 *
 *   Idea    curated feeds are highlight reels; measuring yourself against them
 *           erodes you.
 *   World   a corridor lined with taller, glossier, radiant figures, each held
 *           in one perfect frozen moment.
 *   Choice  stop and linger on one (it glows brighter; yours dims) or keep
 *           walking through.
 *   Mirror  the longer you compare, the smaller and greyer you are against the
 *           glow.
 *   Aha     "they were never real, and I let them shrink me anyway."
 *
 * Owns SCALE. Nudges COLOUR. See docs/IMPLEMENTATION-PLAN.md §3.
 *
 * They are built from the same two primitives as the player's avatar, and that
 * is the point — the only differences are height, polish and light, all three of
 * which are free to fake and impossible to live up to.
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

const COST_SCALE = 0.045;
const COST_COLOUR = 0.014;
const FIGURES = 6;
const SPACING = (BODY_AHEAD - BODY_BEHIND) / (FIGURES - 1);
const LINGERS_EACH = 2;

const RADIANT = new THREE.Color('#ffe9c4');

export function createComparisonRoom({ z, reducedMotion = false }: RoomOptions): Room {
  const group = new THREE.Group();
  group.position.z = z;

  let taken = 0;
  let near = 0;

  interface Figure {
    root: THREE.Group;
    material: THREE.MeshStandardMaterial;
    lamp: THREE.PointLight;
    z: number;
    phase: number;
    lingered: number; // how many times you stopped for this one
    flare: number;
  }

  const torsoGeometry = new THREE.CapsuleGeometry(0.22, 0.44, 6, 16);
  const headGeometry = new THREE.SphereGeometry(0.165, 20, 16);
  const plinthGeometry = new THREE.CylinderGeometry(0.5, 0.58, 0.1, 20);
  const plinthMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b3244,
    roughness: 0.8,
    metalness: 0.2,
  });

  const figures: Figure[] = [];

  for (let i = 0; i < FIGURES; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const root = new THREE.Group();
    const fz = BODY_AHEAD - i * SPACING;
    root.position.set(side * 3.1, 0, fz);
    // Turned a little toward the path — displayed, not merely present.
    root.rotation.y = -side * 0.5;

    const material = new THREE.MeshStandardMaterial({
      color: RADIANT.clone(),
      emissive: RADIANT.clone(),
      emissiveIntensity: 1.15,
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
    });

    // Taller than you, on a plinth, so the height difference is architectural
    // rather than something you could ever close.
    const body = new THREE.Group();
    body.scale.setScalar(1.28);
    body.position.y = 0.1;

    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.52;
    body.add(torso);

    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.02;
    body.add(head);

    // The frozen perfect moment: each one holds a different flawless pose and
    // never, ever moves out of it.
    body.rotation.z = (Math.random() - 0.5) * 0.34;
    head.position.x = (Math.random() - 0.5) * 0.12;
    root.add(body);

    const plinth = new THREE.Mesh(plinthGeometry, plinthMaterial);
    plinth.position.y = 0.05;
    root.add(plinth);

    const lamp = new THREE.PointLight(RADIANT.clone(), 0, 8, 2);
    lamp.position.y = 1.1;
    root.add(lamp);

    group.add(root);
    figures.push({ root, material, lamp, z: fz, phase: Math.random() * 7, lingered: 0, flare: 0 });
  }

  /**
   * The one you are level with, if it still has room to be admired.
   *
   * Each figure will hold your attention twice. A third look at the same frozen
   * moment is not comparison any more, it is just standing there — and the room
   * should send you on rather than let you farm it.
   */
  function reachable(distance: number): Figure | null {
    let best: Figure | null = null;
    let bestGap = Infinity;
    for (const figure of figures) {
      if (figure.lingered >= LINGERS_EACH) continue;
      const gap = distance - figure.z;
      if (gap < -2.2) continue;
      if (gap < bestGap) {
        bestGap = gap;
        best = figure;
      }
    }
    return best;
  }

  // Where you were standing when the frame was drawn, and whether the corridor
  // was listening. A tap resolves against these rather than against a figure
  // chosen in advance — see `choose`.
  let atDistance = Infinity;
  let listening = false;
  let pending: Figure | null = null; // display only: which one is lit as next

  return {
    id: 'comparison',
    group,
    get taken(): number {
      return taken;
    },
    get nearness(): number {
      return near;
    },
    influence: STILL,

    choose(): void {
      // Resolved here, at the moment of the tap, rather than read off a figure
      // picked when the frame was drawn. On a slow device several taps land
      // between two frames: caching the choice spent one figure twice, and
      // merely re-checking the cached one threw the extra taps away, so the room
      // went dead in your hand. Resolving fresh moves on to the next figure, the
      // way it does at sixty frames a second.
      if (!listening) return;
      const figure = reachable(atDistance);
      if (!figure) return;

      figure.lingered++;
      figure.flare = 1;
      taken++;
      audio.admire(taken);

      state.mark('scale', COST_SCALE);
      state.mark('colour', COST_COLOUR);
    },

    update({ dt, t, distance, inReach }: RoomFrame): void {
      near = nearnessOf(distance, 20);
      const appear = discloseAt(distance, 17, 7);

      atDistance = distance;
      listening = inReach;
      pending = inReach ? reachable(distance) : null;

      for (const figure of figures) {
        figure.flare = Math.max(0, figure.flare - dt * 0.8);

        // Attention makes them brighter. That is the whole trick — they are lit
        // by being looked at, and you are the light source.
        const admired = figure.lingered / LINGERS_EACH;
        const isNext = figure === pending;
        const shimmer = reducedMotion ? 0 : Math.sin(t * 0.8 + figure.phase) * 0.06;

        // They are lit brighter than the player is, always. If they merely match
        // you they are a crowd; it is the gap that does the work.
        figure.material.opacity = appear * (0.86 + admired * 0.14);
        figure.material.emissiveIntensity =
          2.1 + admired * 1.4 + figure.flare * 1.1 + shimmer + (isNext ? 0.3 : 0);
        figure.lamp.intensity = appear * (1.6 + admired * 2.2 + figure.flare * 2.6);
      }
    },

    reset(): void {
      taken = 0;
      near = 0;
      pending = null;
      listening = false;
      atDistance = Infinity;
      for (const figure of figures) {
        figure.lingered = 0;
        figure.flare = 0;
      }
    },
  };
}
