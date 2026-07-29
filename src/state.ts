/**
 * The mirror.
 *
 * One object. Five floats. Every room writes to it, the avatar and (later) the
 * end card read from it, and nothing else owns state. This file is small on
 * purpose and load-bearing on purpose — see docs/IMPLEMENTATION-PLAN.md §3.
 *
 * Convention: every value is a COST accrued along that dimension.
 *   0 = untouched, vital, whole
 *   1 = fully diminished
 *
 * Each facet owns one dimension and may nudge one other. Never all five —
 * that rule is what keeps cause and effect legible instead of a mood.
 */

export const DIMENSIONS = ['clarity', 'posture', 'colour', 'scale', 'world'] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export type SelfState = Readonly<Record<Dimension, number>>;

const fresh = (): SelfState => ({
  clarity: 0, // sharp and solid -> coming apart at the edges   (fractured attention)
  posture: 0, // upright and fluid -> heavy, wading, slumped    (information flood)
  colour: 0, // warm and luminous -> drained and grey          (dopamine loop)
  scale: 0, // present -> small, diminished                   (comparison corridor)
  world: 0, // settled -> never settles                       (notification storm)
});

type Listener = (state: SelfState) => void;

let values: SelfState = fresh();
const listeners = new Set<Listener>();

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

function notify(): void {
  for (const fn of listeners) fn(values);
}

export const state = {
  get: (): SelfState => values,

  /** Accumulate cost along one dimension. Costs only ever compound. */
  mark(dimension: Dimension, amount: number): void {
    values = { ...values, [dimension]: clamp01(values[dimension] + amount) };
    notify();
  },

  /** Recovery. Unused in Phase 0 — the "tend" beat lands in Phase 3. */
  ease(dimension: Dimension, amount: number): void {
    this.mark(dimension, -amount);
  },

  /** The overall weight the world responds to: how far the whole self has drifted. */
  weight(): number {
    let sum = 0;
    for (const d of DIMENSIONS) sum += values[d];
    return sum / DIMENSIONS.length;
  },

  reset(): void {
    values = fresh();
    notify();
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    fn(values);
    return () => {
      listeners.delete(fn);
    };
  },
};
