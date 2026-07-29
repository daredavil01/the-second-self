/**
 * The eight selves.
 *
 * This is the highest-risk copy in the project. One name that reads as a
 * verdict rather than a characterisation reintroduces the exact shame the whole
 * design exists to avoid — so the rules are narrow and worth stating:
 *
 *   · A CHARACTERISATION, never a grade. "The One Who Kept Pulling", never
 *     "Heavy User". It says what you did, not what you are worth.
 *   · NEVER A NUMBER. No score, no percentage, no minutes, no rank. The number
 *     is the shame vector; there is a test asserting no digit ever reaches the
 *     card.
 *   · The line underneath OBSERVES; it does not advise, praise or scold. The
 *     mirror of shame is praise — "you did well" makes the other runs a
 *     failure, and everyone is meant to be able to look at their own card.
 *   · The lightest self is not the winner and the heaviest is not the loser.
 *     They are two of eight, written in the same voice.
 *
 * Awaiting design confirmation D8 (docs/IMPLEMENTATION-PLAN.md §4). The names
 * live alone in this file, with the selection logic below them, precisely so
 * that rewriting all eight is a single-file edit that touches no mechanism.
 */

import { DIMENSIONS, type Dimension, type SelfState } from '../state.js';

export type SelfId =
  | 'steady'
  | 'glancing'
  | 'carrying'
  | 'pulling'
  | 'measuring'
  | 'answering'
  | 'little-of-everything'
  | 'yes-to-everything';

export interface NamedSelf {
  readonly id: SelfId;
  /** What the card says, large. */
  readonly name: string;
  /** One quiet line underneath. An observation, never an instruction. */
  readonly line: string;
}

/**
 * Five of these are the shape of a run that leaned into one room; the other
 * three are the shapes that have no single lean — nothing taken, a little of
 * everything, and all of it.
 */
export const SELVES: Readonly<Record<SelfId, NamedSelf>> = Object.freeze({
  steady: {
    id: 'steady',
    name: 'The Steady One',
    line: 'you passed a lot of open doors.',
  },
  glancing: {
    id: 'glancing',
    name: 'The One Who Kept Glancing Away',
    line: 'you were here, mostly.',
  },
  carrying: {
    id: 'carrying',
    name: 'The One Who Carried It All',
    line: 'you did not want to miss anything.',
  },
  pulling: {
    id: 'pulling',
    name: 'The One Who Kept Pulling',
    line: 'there was always one more.',
  },
  measuring: {
    id: 'measuring',
    name: 'The One Who Kept Measuring',
    line: 'everyone else was further along.',
  },
  answering: {
    id: 'answering',
    name: 'The One Who Kept Answering',
    line: 'everything got a reply.',
  },
  'little-of-everything': {
    id: 'little-of-everything',
    name: 'The One Who Took a Little of Everything',
    line: 'nothing much, every time.',
  },
  'yes-to-everything': {
    id: 'yes-to-everything',
    name: 'The One Who Said Yes to Everything',
    line: 'nothing here ever had to ask you twice.',
  },
});

/** Which room's dimension a lean belongs to — see §3 of the plan. */
const LEANS: Readonly<Record<Dimension, SelfId>> = Object.freeze({
  clarity: 'glancing', // fractured attention
  posture: 'carrying', // information flood
  colour: 'pulling', // dopamine loop
  scale: 'measuring', // comparison corridor
  world: 'answering', // notification storm
});

/**
 * The thresholds.
 *
 * Deliberately generous at both ends. A run that took one or two things should
 * not be called steady, and a run that stopped short of taking everything
 * should not be handed the heaviest name — both of those misreadings cost the
 * player their own recognition of the run they actually had.
 */
const BARELY = 0.06; // below this the whole vector counts as untouched
const NEARLY_ALL = 0.82; // above this every dimension is effectively pinned
const A_CLEAR_LEAN = 0.15; // how far the leading dimension must stand out

/**
 * The state vector, characterised.
 *
 * Pure, total and deterministic: the same run always produces the same self,
 * which is what makes the card feel earned rather than dealt. Nothing here
 * reads the DOM, the clock or storage.
 */
export function nameFor(s: SelfState): NamedSelf {
  let sum = 0;
  let lead: Dimension = 'clarity';
  let least = 1;

  for (const dimension of DIMENSIONS) {
    const value = s[dimension];
    sum += value;
    if (value > s[lead]) lead = dimension;
    if (value < least) least = value;
  }

  const mean = sum / DIMENSIONS.length;

  // Took nothing worth speaking of. Not a reward — one of eight.
  if (mean <= BARELY) return SELVES.steady;

  // Took all of it. Every dimension pinned, so there is no lean left to name:
  // this is the shape three of the rooms produce for anyone determined enough,
  // and it is an honest outcome rather than a punishment. (See the saturation
  // note in docs/IMPLEMENTATION-PLAN.md §5.)
  if (least >= NEARLY_ALL) return SELVES['yes-to-everything'];

  // Otherwise: did one room get more of you than the rest? Measured against the
  // other four, not against the whole, so a strong lean still reads as a lean
  // in a heavy run.
  const rest = (sum - s[lead]) / (DIMENSIONS.length - 1);
  if (s[lead] - rest >= A_CLEAR_LEAN) return SELVES[LEANS[lead]];

  return SELVES['little-of-everything'];
}
