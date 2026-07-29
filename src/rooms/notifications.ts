/**
 * The notification storm.
 *
 *   Idea    interruption fragments presence; attention gets leased out in tiny
 *           involuntary pieces.
 *   World   a calm clearing that starts pinging — motes of light demanding to be
 *           tapped, arriving faster and faster.
 *   Choice  answer every one the instant it arrives (the space never settles) or
 *           let them accumulate and pass (uncomfortable at first, then quiet).
 *   Mirror  chasing each ping, the avatar is yanked around and never completes a
 *           single motion. Ignoring them, the storm crests and then dissolves.
 *   Aha     "I never finished a single thought in there."
 *
 * Owns WORLD. Nudges POSTURE. See docs/IMPLEMENTATION-PLAN.md §3.
 *
 * This is the last room before the turn, and it is the only one where NOT
 * acting is visibly rewarded. That matters twice over: it is the honest shape of
 * the facet, and it means the silence at the turn arrives as relief for one kind
 * of player and as an ambush for the other.
 */

import * as THREE from 'three';
import { state } from '../state.js';
import * as audio from '../audio.js';
import {
  BODY_AHEAD,
  BODY_BEHIND,
  nearnessOf,
  STILL,
  type Room,
  type RoomFrame,
  type RoomOptions,
} from './types.js';

const COST_WORLD = 0.06;
const COST_POSTURE = 0.015;
const PINGS = 16;
const PING_LIFE = 3.4; // seconds a ping hangs there before it gives up on you
const CALM_RATE = 2.1; // seconds between arrivals at rest
const STORM_RATE = 0.42; // …and at full pressure
const BUILD = 6; // seconds the storm takes to gather on its own
const CREST = 7.5; // …how long it holds…
const BREAK = 4; // …and how long it takes to let go of someone who ignored it

const PING = new THREE.Color('#ffd9e2');

export function createNotificationRoom({
  z,
  reducedMotion = false,
  pace = 1,
}: RoomOptions): Room {
  const group = new THREE.Group();
  group.position.z = z;

  let taken = 0;
  let near = 0;
  let fed = 0; // what your answering has added, and only that
  let pressure = 0; // 0 calm, 1 never settles — the storm as actually felt
  let dwell = 0; // seconds spent inside it
  let sinceSpawn = 0;

  interface Ping {
    sprite: THREE.Sprite;
    material: THREE.SpriteMaterial;
    home: THREE.Vector3;
    life: number; // counts down; 0 = not live
    pop: number;
  }

  // One shared radial texture: a soft dot, the shape every notification has
  // ever been.
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,214,226,0.75)');
  g.addColorStop(1, 'rgba(255,190,210,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const dot = new THREE.CanvasTexture(canvas);
  dot.colorSpace = THREE.SRGBColorSpace;

  const pings: Ping[] = [];
  for (let i = 0; i < PINGS; i++) {
    const material = new THREE.SpriteMaterial({
      map: dot,
      color: PING.clone(),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.visible = false;
    sprite.scale.setScalar(0.5);
    group.add(sprite);
    pings.push({ sprite, material, home: new THREE.Vector3(), life: 0, pop: 0 });
  }

  // Markers standing in the clearing. In a settled world they are still; in an
  // unsettled one nothing is, and that is what the WORLD dimension means.
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x2f3648,
    roughness: 0.85,
    metalness: 0.1,
  });
  const stoneGeometry = new THREE.CylinderGeometry(0.14, 0.2, 1.1, 8);
  const STONES = 7;
  const stones: THREE.Mesh[] = [];
  for (let i = 0; i < STONES; i++) {
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    const side = i % 2 === 0 ? 1 : -1;
    stone.position.set(
      side * (2.4 + Math.random() * 2.6),
      0.55,
      BODY_AHEAD - i * ((BODY_AHEAD - BODY_BEHIND) / (STONES - 1))
    );
    group.add(stone);
    stones.push(stone);
  }

  function spawn(distance: number): void {
    const ping = pings.find((p) => p.life <= 0);
    if (!ping) return;
    // Around and slightly ahead of wherever you are standing, so every one of
    // them lands in your field of view whether you want it or not.
    ping.home.set(
      (Math.random() - 0.5) * 5.4,
      0.7 + Math.random() * 1.9,
      distance - 2 - Math.random() * 5
    );
    ping.sprite.position.copy(ping.home);
    ping.sprite.visible = true;
    ping.life = PING_LIFE;
    ping.pop = 0;
    audio.ping(pressure);
  }

  /** The one shouting loudest: newest live ping wins, as they always do. */
  function loudest(): Ping | null {
    let best: Ping | null = null;
    for (const ping of pings) {
      if (ping.life <= 0 || ping.pop > 0) continue;
      if (!best || ping.life > best.life) best = ping;
    }
    return best;
  }

  return {
    id: 'notifications',
    group,
    get taken(): number {
      return taken;
    },
    get nearness(): number {
      return near;
    },
    influence: STILL,

    choose(): void {
      const ping = loudest();
      if (!ping) return;

      ping.pop = 1;
      ping.life = 0.35;
      taken++;

      // Answering is what feeds it. The storm is not weather; it is a response.
      fed = Math.min(1, fed + 0.19);
      audio.answered(taken);

      state.mark('world', COST_WORLD);
      state.mark('posture', COST_POSTURE);
    },

    update({ dt, t, distance, inReach }: RoomFrame): void {
      near = nearnessOf(distance, 20);

      if (inReach) {
        // This room's clock runs on wall seconds, not on metres walked, so it
        // has to speed up with the journey or `?pace=` would preview a storm
        // that never gathers.
        const storm = dt * pace;
        dwell += storm;
        sinceSpawn += storm;
        fed = Math.max(0, fed - storm * 0.05);

        // The storm gathers on its own, holds, and then — if it has been left
        // alone — breaks. Doing nothing is uncomfortable first and quiet after,
        // and this is the only place in the piece where that is true.
        const gather = Math.min(1, dwell / BUILD);
        const letting = 1 - Math.min(1, Math.max(0, dwell - BUILD - CREST) / BREAK);
        const own = gather * letting;

        // But answering keeps it alive well past its own ending. That gap
        // between "it would have stopped" and "it never stopped" is the facet.
        pressure = Math.min(1, own * 0.62 + fed);

        const rate = THREE.MathUtils.lerp(CALM_RATE, STORM_RATE, pressure);
        if (pressure > 0.04 && sinceSpawn > rate) {
          sinceSpawn = 0;
          spawn(distance);
        }
      } else {
        fed = Math.max(0, fed - dt * pace * 0.6);
        pressure = Math.max(0, pressure - dt * pace * 0.6);
      }

      for (const ping of pings) {
        if (ping.life <= 0) {
          if (ping.sprite.visible) {
            ping.sprite.visible = false;
            ping.material.opacity = 0; // a fade with no terminal state hangs forever
          }
          continue;
        }

        ping.life -= dt * pace;
        if (ping.pop > 0) {
          // Answered: a bright little collapse, over almost before you saw it.
          ping.pop = Math.max(0, ping.pop - dt * pace * 3.4);
          ping.material.opacity = ping.pop;
          ping.sprite.scale.setScalar(0.5 + (1 - ping.pop) * 1.5);
          if (ping.pop <= 0) ping.life = 0;
          continue;
        }

        // Unanswered: it arrives insistently, hangs, and lets go.
        const age = 1 - ping.life / PING_LIFE;
        const arrive = Math.min(1, age * 6);
        const leave = Math.min(1, ping.life / 0.9);
        ping.material.opacity = arrive * leave * 0.9;
        ping.sprite.scale.setScalar(0.34 + arrive * 0.22);
        if (!reducedMotion) {
          ping.sprite.position.y = ping.home.y + Math.sin(t * 3.2 + ping.home.x) * 0.05;
        }
        if (ping.life <= 0) ping.material.opacity = 0;
      }

      // Nothing in an unsettled world holds still — including the ground you
      // were told was solid.
      if (!reducedMotion) {
        const unsettled = state.get().world * 0.5 + pressure * 0.5;
        for (let i = 0; i < stones.length; i++) {
          const stone = stones[i];
          if (!stone) continue;
          stone.rotation.z = Math.sin(t * 7.3 + i) * unsettled * 0.05;
          stone.position.y = 0.55 + Math.sin(t * 5.1 + i * 2) * unsettled * 0.03;
        }
      }
    },

    reset(): void {
      taken = 0;
      near = 0;
      fed = 0;
      pressure = 0;
      dwell = 0;
      sinceSpawn = 0;
      for (const ping of pings) {
        ping.life = 0;
        ping.pop = 0;
        ping.material.opacity = 0;
        ping.sprite.visible = false;
      }
    },
  };
}
