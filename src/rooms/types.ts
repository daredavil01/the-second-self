/**
 * What every room is.
 *
 * Five facets, one contract. Each room is a lump of world standing beside the
 * path, an offer that is genuinely tempting, and a cost written into exactly the
 * dimensions the room owns — see docs/IMPLEMENTATION-PLAN.md §3.
 *
 * The shared rules live here rather than in each room so they cannot quietly
 * drift apart: how far an offer reaches, when it stops reaching, and how a room
 * discloses itself on approach.
 */

import type * as THREE from 'three';
import type { ChoiceKind } from '../rail.js';

export const ROOM_IDS = ['attention', 'flood', 'dopamine', 'comparison', 'notifications'] as const;

export type RoomId = (typeof ROOM_IDS)[number];

export interface RoomFrame {
  dt: number;
  /** Animation clock. Capped — never pace interface timing off it (see LESSONS L5). */
  t: number;
  /** avatar.z − room.z. Positive while approaching, negative once past. */
  distance: number;
  /** Whether this room currently owns the choose channel. */
  inReach: boolean;
}

/**
 * The two things a room is allowed to reach outside itself and ask the world
 * for. Anything more and rooms stop being self-contained; anything less and
 * "the horizon closes in" has nowhere to live.
 */
export interface RoomInfluence {
  /** Extra fog, 0..1 — the draw distance closing in. Attention only. */
  haze: number;
  /** Signed lateral pull on the camera, in world units. Attention only. */
  tug: number;
}

export const STILL: RoomInfluence = Object.freeze({ haze: 0, tug: 0 });

export interface Room {
  readonly id: RoomId;
  readonly group: THREE.Group;
  /** How many times the player took what this room offered. */
  readonly taken: number;
  /** 0..1 proximity. Drives the audio bed's cross-fade. */
  readonly nearness: number;
  readonly influence: RoomInfluence;
  choose(kind: ChoiceKind): void;
  update(frame: RoomFrame): void;
  reset(): void;
}

export interface RoomOptions {
  /** Where along the track the room stands, in world units (negative = ahead). */
  z: number;
  /** How far off the path it stands. Each room has a sensible default. */
  x?: number;
  reducedMotion?: boolean;
  /**
   * The `?pace=` multiplier. Rooms whose behaviour is timed in wall seconds
   * rather than in metres of track must scale by it, or previewing a room at
   * speed shows you something the real journey never does. Only the storm has
   * such a clock; everything else is paced by how far you have walked.
   */
  pace?: number;
}

/**
 * The reach window, asymmetric on purpose.
 *
 * Open across the whole approach — a long, easy invitation — and shut the
 * instant you are past. Walking on has to be final, or it is a postponement
 * rather than a choice. See LESSONS L8.
 */
export const REACH_AHEAD = 12;
export const REACH_BEHIND = -2.5;

export const inReachOf = (distance: number): boolean =>
  distance < REACH_AHEAD && distance > REACH_BEHIND;

/**
 * Where a room is allowed to put its furniture, relative to its own centre.
 *
 * Rooms stand 24 units apart and reach 12 ahead, so a room's body must fit
 * inside roughly the window it is reachable from. Get this wrong and the
 * corridor's last figure ends up standing in the middle of the storm, which is
 * exactly what happened the first time: five rooms that individually read fine
 * and collectively read as one junk drawer. The gap between BODY_BEHIND and the
 * next room's BODY_AHEAD is the breath of empty world the piece needs.
 */
export const BODY_AHEAD = 11;
export const BODY_BEHIND = -6;

/** 0..1, peaking as you draw level with the room. */
export const nearnessOf = (distance: number, span = 17): number =>
  Math.max(0, 1 - Math.abs(distance) / span);

/**
 * Progressive disclosure, enforced in code rather than merely intended.
 *
 * A room's light is not there from the first frame. One glowing object visible
 * across the whole track announces the room before the player has taken a step,
 * and undoes the calm, near-empty opening the piece depends on. See LESSONS L9.
 */
export const discloseAt = (distance: number, from = 15, over = 6): number =>
  Math.min(1, Math.max(0, (from - distance) / over));

/** The offer dims as it is spent, but never goes out — or walking past is free. */
export const spentBy = (taken: number, rate = 0.42): number => 1 / (1 + taken * rate);
