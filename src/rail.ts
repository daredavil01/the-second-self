/**
 * The rail.
 *
 * Two channels, one gesture language:
 *   MOVE   — wheel, touch drag, arrow keys, space. Normalised to progress 0..1.
 *   CHOOSE — tap, or hold (which repeats). The choice mechanic in each room.
 *
 * Deliberately hand-rolled rather than GSAP + ScrollTrigger: this is a fixed
 * canvas driven by an abstract progress value, not a scroll-linked DOM
 * document. Keyboard support falls out for free, and there is no CDN
 * dependency. See docs/IMPLEMENTATION-PLAN.md §9.
 */

// Calibrated so the whole track takes a deliberate journey rather than a
// flick: roughly 14,000px of wheel, or a dozen full-screen swipes. These are
// feel values, not truths — they are exactly what gate D1 exists to confirm on
// a real phone.
const WHEEL_SENSITIVITY = 0.00007;
const TOUCH_SENSITIVITY = 0.00014;
const KEY_STEP = 0.022;
const EASE = 0.075; // how hard progress chases its target

/**
 * The journey has a floor pace, and scrolling harder does not shorten it.
 *
 * Without this the whole track is two trackpad flicks: the rooms stream past
 * before any of them can land, and the run comes in at well under a minute
 * rather than the six or seven the piece is written for. Walking speed is the
 * one thing the player does not get to negotiate — which is also, quietly, the
 * argument.
 *
 * MAX_SPEED is progress per second: about two minutes forty of pure travel
 * before a single second spent standing in a room. An engaged run lands at six
 * to seven minutes, which is the number gate D6 exists to check against a real
 * timed playthrough.
 */
const MAX_SPEED = 0.006;

/**
 * …but the input must still be felt. Rather than dropping scroll on the floor,
 * it banks: `target` may run this far ahead of `progress` and no further, so a
 * push always registers and always coasts, and letting go still glides to a
 * stop instead of stopping dead.
 */
const MAX_LEAD = 0.02;
const TAP_MAX_MS = 260;
const TAP_MAX_DRIFT = 12; // px — beyond this a touch is a drag, not a tap
const HOLD_START_MS = 300;
const HOLD_REPEAT_MS = 380;

export type ChoiceKind = 'tap' | 'hold';

export interface Rail {
  update(dt: number): number;
  readonly progress: number;
  readonly target: number;
  readonly hasMoved: boolean;
  onChoose(fn: (kind: ChoiceKind) => void): () => void;
  seek(to: number): void;
  lock(): void;
  unlock(): void;
  reset(): void;
}

/**
 * @param pace multiplies the floor pace and the input sensitivity together, so
 *        the journey is the same journey, just faster. Driven by `?pace=` — it
 *        exists so a single room can be previewed without replaying the six
 *        minutes in front of it, which is what gate D5 asks for. Always 1 for a
 *        real visitor.
 */
export function createRail(element: HTMLElement, pace = 1): Rail {
  let target = 0;
  let progress = 0;
  let locked = false;
  let moved = false;

  const maxSpeed = MAX_SPEED * pace;
  const maxLead = MAX_LEAD * pace;
  const wheel = WHEEL_SENSITIVITY * pace;
  const touch = TOUCH_SENSITIVITY * pace;
  const step = KEY_STEP * pace;

  const chooseListeners = new Set<(kind: ChoiceKind) => void>();
  const emitChoose = (kind: ChoiceKind): void => {
    for (const fn of chooseListeners) fn(kind);
  };

  const advance = (delta: number): void => {
    if (locked) return;
    // Bank the push, then clamp how far ahead of the world it is allowed to get.
    target = Math.min(1, Math.max(0, target + delta));
    target = Math.min(target, progress + maxLead);
    target = Math.max(target, progress - maxLead);
    if (Math.abs(delta) > 0.0005) moved = true;
  };

  // --- move channel -------------------------------------------------------

  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    advance(e.deltaY * wheel);
  };

  const onKey = (e: KeyboardEvent): void => {
    // The overlay's own controls come first. The rail listens on the window, so
    // without this it swallows the space bar that was meant to press a focused
    // button — and the ending would be unreachable by keyboard alone.
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'BUTTON' || target.tagName === 'A')) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      advance(step);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      advance(-step);
    } else if (e.key === 'Enter') {
      emitChoose('tap');
    }
  };

  // --- pointer: both channels share one press -----------------------------

  let pressing = false;
  let pressStart = 0;
  let lastY = 0;
  let startX = 0;
  let startY = 0;
  let drift = 0;
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  let repeatTimer: ReturnType<typeof setInterval> | null = null;
  let holding = false;

  const clearHold = (): void => {
    if (holdTimer !== null) clearTimeout(holdTimer);
    if (repeatTimer !== null) clearInterval(repeatTimer);
    holdTimer = null;
    repeatTimer = null;
  };

  const onPointerDown = (e: PointerEvent): void => {
    pressing = true;
    holding = false;
    pressStart = performance.now();
    lastY = startY = e.clientY;
    startX = e.clientX;
    drift = 0;
    element.setPointerCapture?.(e.pointerId);

    // A press that outlives HOLD_START_MS without drifting becomes a hold, and
    // a hold repeats. The lever never says no — you can keep it saying yes.
    holdTimer = setTimeout(() => {
      if (!pressing || drift > TAP_MAX_DRIFT) return;
      holding = true;
      emitChoose('hold');
      repeatTimer = setInterval(() => emitChoose('hold'), HOLD_REPEAT_MS);
    }, HOLD_START_MS);
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (!pressing) return;
    const dy = e.clientY - lastY;
    lastY = e.clientY;
    drift = Math.max(drift, Math.hypot(e.clientX - startX, e.clientY - startY));

    if (drift > TAP_MAX_DRIFT) {
      clearHold();
      // Drag up to move forward — the same direction as scrolling a feed.
      advance(-dy * touch);
    }
  };

  const onPointerUp = (): void => {
    if (!pressing) return;
    const held = performance.now() - pressStart;
    pressing = false;
    clearHold();
    if (!holding && drift <= TAP_MAX_DRIFT && held <= TAP_MAX_MS) {
      emitChoose('tap');
    }
    holding = false;
  };

  element.addEventListener('wheel', onWheel, { passive: false });
  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerUp);
  element.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  window.addEventListener('keydown', onKey);

  return {
    /** Called once per frame. dt is in seconds. */
    update(dt: number): number {
      const k = 1 - Math.pow(1 - EASE, dt * 60);
      const eased = (target - progress) * k;
      const limit = maxSpeed * dt;
      progress += Math.min(limit, Math.max(-limit, eased));
      return progress;
    },
    get progress(): number {
      return progress;
    },
    get target(): number {
      return target;
    },
    /** Has the user moved at all yet? Drives the opening hint. */
    get hasMoved(): boolean {
      return moved;
    },
    onChoose(fn: (kind: ChoiceKind) => void): () => void {
      chooseListeners.add(fn);
      return () => {
        chooseListeners.delete(fn);
      };
    },
    /**
     * Jump to a point on the track. Only `?room=` uses this — it is the preview
     * affordance, not a mechanic, and nothing in the experience may call it.
     */
    seek(to: number): void {
      progress = target = Math.min(1, Math.max(0, to));
    },
    /** The turn: the pace breaks and the user stops steering. */
    lock(): void {
      locked = true;
      clearHold();
    },
    unlock(): void {
      locked = false;
    },
    reset(): void {
      target = 0;
      progress = 0;
      locked = false;
      moved = false;
      clearHold();
    },
  };
}
