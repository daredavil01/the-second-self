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

const DIMENSIONS = ['clarity', 'posture', 'colour', 'scale', 'world'];

const fresh = () => ({
  clarity: 0, // sharp and solid -> coming apart at the edges   (fractured attention)
  posture: 0, // upright and fluid -> heavy, wading, slumped    (information flood)
  colour: 0, // warm and luminous -> drained and grey          (dopamine loop)
  scale: 0, // present -> small, diminished                   (comparison corridor)
  world: 0, // settled -> never settles                       (notification storm)
});

let values = fresh();
const listeners = new Set();

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

function notify() {
  for (const fn of listeners) fn(values);
}

export const state = {
  get: () => values,

  /** Accumulate cost along one dimension. Costs only ever compound. */
  mark(dimension, amount) {
    if (!DIMENSIONS.includes(dimension)) {
      throw new Error(`unknown dimension: ${dimension}`);
    }
    values = { ...values, [dimension]: clamp01(values[dimension] + amount) };
    notify();
  },

  /** Recovery. Unused in Phase 0 — the "tend" beat lands in Phase 3. */
  ease(dimension, amount) {
    this.mark(dimension, -amount);
  },

  /** The overall weight the world responds to: how far the whole self has drifted. */
  weight() {
    return DIMENSIONS.reduce((sum, d) => sum + values[d], 0) / DIMENSIONS.length;
  },

  reset() {
    values = fresh();
    notify();
  },

  subscribe(fn) {
    listeners.add(fn);
    fn(values);
    return () => listeners.delete(fn);
  },
};

export { DIMENSIONS };
