/**
 * Sound.
 *
 * "Budget real attention for audio design — in a piece about feeling, it's not
 * decoration." Synthesised via the Web Audio API: no files, no library, nothing
 * to load, and the reward can be genuinely parameterised by how worn out it is.
 *
 * Two jobs in Phase 0:
 *   1. The lever pull is satisfying — and audibly duller every single time.
 *   2. The turn is SILENT. That silence will hit harder than any music.
 */

let ctx = null;
let master = null;
let bed = null;
let started = false;

const PENTATONIC = [0, 3, 5, 7, 10]; // no leading tones — nothing that begs to resolve

function noiseBuffer(duration = 0.4) {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Must be called from inside a user gesture, or the browser will refuse. */
export function start() {
  if (started) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
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

  for (const [freq, detune] of [
    [55, -4],
    [82.4, 5],
    [110, 0],
  ]) {
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
export function pull(strength = 1, index = 0) {
  if (!ctx) return;
  const now = ctx.currentTime;
  const s = Math.max(0.06, strength);

  // The mechanism: a dry, physical clunk. This part never fades — the machine
  // is as eager on the twentieth pull as the first.
  const clunk = ctx.createBufferSource();
  clunk.buffer = noiseBuffer(0.18);
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
  const semitone = PENTATONIC[index % PENTATONIC.length];
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

  for (const [ratio, level] of [
    [1, 1],
    [1.5, 0.5],
    [2, 0.34 * s],
    [3, 0.18 * s],
  ]) {
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

/** The turn. Everything stops. */
export function silence(seconds = 1.6) {
  if (!ctx) return;
  master.gain.setTargetAtTime(0.0001, ctx.currentTime, seconds / 4);
}

export function restore(seconds = 1.2) {
  if (!ctx) return;
  master.gain.setTargetAtTime(0.9, ctx.currentTime, seconds / 4);
}
