/**
 * Sound.
 *
 * "Budget real attention for audio design — in a piece about feeling, it's not
 * decoration." Synthesised via the Web Audio API: no files, no library, nothing
 * to load, and the reward can be genuinely parameterised by how worn out it is.
 *
 * Three jobs:
 *   1. Every room has a bed, and the beds cross-fade by proximity. You should
 *      be able to tell which room you are in with your eyes shut.
 *   2. Each choice sounds like what it costs — the lever duller every time, the
 *      flood thicker, the shards thinner, the pings sharper.
 *   3. The turn is SILENT. That silence will hit harder than any music.
 */

import type { RoomId } from './rooms/types.js';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bed: GainNode | null = null;
let started = false;

const PENTATONIC: readonly number[] = [0, 3, 5, 7, 10]; // no leading tones — nothing that begs to resolve

function noiseBuffer(ctx: AudioContext, duration = 0.4): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Must be called from inside a user gesture, or the browser will refuse. */
export function start(): void {
  if (started) return;
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  started = true;

  ctx = new AudioCtx();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  // A low bed, barely there. It is the room tone of a calm place.
  bed = ctx.createGain();
  bed.gain.value = 0;
  bed.connect(master);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 260;
  filter.Q.value = 0.6;
  filter.connect(bed);

  const drones: ReadonlyArray<readonly [number, number]> = [
    [55, -4],
    [82.4, 5],
    [110, 0],
  ];
  for (const [freq, detune] of drones) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const g = ctx.createGain();
    g.gain.value = 0.4;
    osc.connect(g).connect(filter);
    osc.start();
  }

  bed.gain.setTargetAtTime(0.16, ctx.currentTime, 2.5);
}

/**
 * One pull of the lever.
 * @param {number} strength 1 = the first pull, decaying toward 0. The hit is
 *        always there — it just returns less and less. That gap between "it
 *        still feels good" and "it gives less" is the whole facet.
 */
export function pull(strength = 1, index = 0): void {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const s = Math.max(0.06, strength);

  // The mechanism: a dry, physical clunk. This part never fades — the machine
  // is as eager on the twentieth pull as the first.
  const clunk = ctx.createBufferSource();
  clunk.buffer = noiseBuffer(ctx, 0.18);
  const clunkFilter = ctx.createBiquadFilter();
  clunkFilter.type = 'bandpass';
  clunkFilter.frequency.value = 420;
  clunkFilter.Q.value = 1.4;
  const clunkGain = ctx.createGain();
  clunkGain.gain.setValueAtTime(0.34, now);
  clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  clunk.connect(clunkFilter).connect(clunkGain).connect(master);
  clunk.start(now);
  clunk.stop(now + 0.2);

  // The reward: a bright chord that loses its top end and its bloom each time.
  const semitone = PENTATONIC[index % PENTATONIC.length]!;
  const root = 293.66 * Math.pow(2, semitone / 12) * Math.pow(2, -Math.floor(index / 14));

  const voice = ctx.createGain();
  voice.gain.value = 0;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(900 + 5200 * s, now);
  tone.frequency.exponentialRampToValueAtTime(400 + 900 * s, now + 0.9);
  voice.connect(tone).connect(master);

  const peak = 0.05 + 0.2 * s;
  voice.gain.setValueAtTime(0.0001, now);
  voice.gain.exponentialRampToValueAtTime(peak, now + 0.012);
  voice.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + 1.0 * s);

  const partials: ReadonlyArray<readonly [number, number]> = [
    [1, 1],
    [1.5, 0.5],
    [2, 0.34 * s],
    [3, 0.18 * s],
  ];
  for (const [ratio, level] of partials) {
    const osc = ctx.createOscillator();
    osc.type = ratio === 1 ? 'triangle' : 'sine';
    osc.frequency.value = root * ratio;
    const g = ctx.createGain();
    g.gain.value = level;
    osc.connect(g).connect(voice);
    osc.start(now);
    osc.stop(now + 1.6);
  }
}

// --- one-shots: each choice sounds like what it costs ------------------------

/** A short shaped voice. Everything below is some flavour of this. */
function blip(
  type: OscillatorType,
  freq: number,
  peak: number,
  decay: number,
  filter?: { type: BiquadFilterType; freq: number; q?: number }
): void {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter.type;
    f.frequency.value = filter.freq;
    f.Q.value = filter.q ?? 1;
    osc.connect(gain).connect(f).connect(master);
  } else {
    osc.connect(gain).connect(master);
  }
  osc.start(now);
  osc.stop(now + decay + 0.05);
}

/**
 * Chasing a distraction. Bright and quick, and a little thinner and higher each
 * time — the sound of something being taken off the top.
 */
export function shard(index = 1): void {
  const step = Math.min(index, 8);
  blip('triangle', 880 * Math.pow(1.055, step), 0.13, 0.22);
  blip('sine', 1760 * Math.pow(1.055, step), 0.05, 0.13);
}

/** Taking in one more. A swallowed, submerged swell — pleasant, and heavy. */
export function intake(index = 1): void {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const depth = Math.min(1, index / 9);

  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.9);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(900 - depth * 500, now);
  lp.frequency.exponentialRampToValueAtTime(180, now + 0.7);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1 + depth * 0.06, now + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  src.connect(lp).connect(gain).connect(master);
  src.start(now);
  src.stop(now + 0.95);

  // And it settles a little lower every time.
  blip('sine', 150 - depth * 45, 0.11, 0.6, { type: 'lowpass', freq: 500 });
}

/** Lingering on someone else's perfect moment. Beautiful, glassy, far away. */
export function admire(index = 1): void {
  const root = 523.25 * Math.pow(2, -Math.floor(index / 6));
  blip('sine', root, 0.075, 1.5);
  blip('sine', root * 1.5, 0.045, 1.2);
  blip('sine', root * 2.02, 0.022, 0.9); // detuned just enough to feel unreachable
}

/** One notification arriving. Sharper the less settled the space already is. */
export function ping(pressure = 0): void {
  const up = 1 + pressure * 0.35;
  blip('sine', 1245 * up, 0.075, 0.13);
  blip('sine', 1660 * up, 0.055, 0.18);
}

/** Answering one. A small, real satisfaction, over almost before it lands. */
export function answered(index = 1): void {
  blip('square', 2100 + index * 45, 0.035, 0.05, { type: 'bandpass', freq: 2400, q: 2 });
  blip('sine', 700, 0.06, 0.1);
}

// --- beds: one per room, cross-faded by proximity ----------------------------

interface Bed {
  gain: GainNode;
  level: number;
  set: number;
}

const beds = new Map<RoomId, Bed>();

function drone(
  destination: AudioNode,
  type: OscillatorType,
  freq: number,
  level: number,
  detune = 0
): void {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const gain = ctx.createGain();
  gain.gain.value = level;
  osc.connect(gain).connect(destination);
  osc.start();
}

/** A slow oscillation applied to any AudioParam — the breathing in each bed. */
function lfo(param: AudioParam, rate: number, depth: number): void {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = rate;
  const gain = ctx.createGain();
  gain.gain.value = depth;
  osc.connect(gain).connect(param);
  osc.start();
}

/** Per-bed trim, so no room is louder than the thing it is under. */
const BED_LEVEL: Record<RoomId, number> = {
  attention: 0.5,
  flood: 0.95,
  dopamine: 0.75,
  comparison: 0.85,
  notifications: 0.55,
};

function buildBed(id: RoomId): Bed {
  const g = ctx!.createGain();
  g.gain.value = 0;
  g.connect(master!);

  switch (id) {
    // Sharp, brittle, always about to come apart.
    case 'attention': {
      const bp = ctx!.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1500;
      bp.Q.value = 5;
      bp.connect(g);
      drone(bp, 'sawtooth', 494, 0.035);
      drone(bp, 'sawtooth', 494, 0.03, 27); // a beating that never resolves
      lfo(bp.frequency, 0.27, 900);
      break;
    }
    // Everything heard from underneath it.
    case 'flood': {
      const lp = ctx!.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 190;
      lp.Q.value = 1.4;
      lp.connect(g);
      const src = ctx!.createBufferSource();
      src.buffer = noiseBuffer(ctx!, 3);
      src.loop = true;
      const noiseGain = ctx!.createGain();
      noiseGain.gain.value = 0.5;
      src.connect(noiseGain).connect(lp);
      src.start();
      drone(lp, 'sine', 62, 0.5);
      lfo(lp.frequency, 0.13, 110);
      break;
    }
    // Warm and generous, right up until you notice it is a machine.
    case 'dopamine': {
      const lp = ctx!.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 900;
      lp.connect(g);
      drone(lp, 'sine', 146.8, 0.34);
      drone(lp, 'sine', 220, 0.22);
      drone(lp, 'triangle', 440, 0.05, -6);
      lfo(lp.frequency, 0.19, 400);
      break;
    }
    // High, polished, and slightly out of tune with itself.
    case 'comparison': {
      const hp = ctx!.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 300;
      hp.connect(g);
      drone(hp, 'sine', 659.3, 0.055);
      drone(hp, 'sine', 987.8, 0.04, 9);
      drone(hp, 'sine', 1318.5, 0.022, -11);
      break;
    }
    // Nothing settles. The tremolo is the room.
    case 'notifications': {
      const trem = ctx!.createGain();
      trem.gain.value = 0.6;
      trem.connect(g);
      lfo(trem.gain, 5.2, 0.4);
      const lp = ctx!.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1300;
      lp.connect(trem);
      drone(lp, 'sine', 174.6, 0.24);
      drone(lp, 'sine', 261.6, 0.13, 14);
      break;
    }
  }

  return { gain: g, level: BED_LEVEL[id], set: -1 };
}

/**
 * Set a room's bed to how near you are to it, 0..1. Safe to call every frame:
 * beds are built the first time they are heard, and the parameter is only
 * rescheduled when the value has actually moved.
 */
export function room(id: RoomId, nearness: number): void {
  if (!ctx || !master) return;
  let entry = beds.get(id);
  if (!entry) {
    if (nearness <= 0.001) return; // don't build a graph for a room you can't hear
    entry = buildBed(id);
    beds.set(id, entry);
  }
  if (Math.abs(nearness - entry.set) < 0.02) return;
  entry.set = nearness;
  entry.gain.gain.setTargetAtTime(nearness * entry.level, ctx.currentTime, 0.5);
}

/** The turn. Everything stops. */
export function silence(seconds = 1.6): void {
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(0.0001, ctx.currentTime, seconds / 4);
}

export function restore(seconds = 1.2): void {
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(0.9, ctx.currentTime, seconds / 4);
}
