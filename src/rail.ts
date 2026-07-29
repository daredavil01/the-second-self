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
  lock(): void;
  unlock(): void;
  reset(): void;
}

export function createRail(element: HTMLElement): Rail {
  let target = 0;
  let progress = 0;
  let locked = false;
  let moved = false;

  const chooseListeners = new Set<(kind: ChoiceKind) => void>();
  const emitChoose = (kind: ChoiceKind): void => {
    for (const fn of chooseListeners) fn(kind);
  };

  const advance = (delta: number): void => {
    if (locked) return;
    target = Math.min(1, Math.max(0, target + delta));
    if (Math.abs(delta) > 0.0005) moved = true;
  };

  // --- move channel -------------------------------------------------------

  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    advance(e.deltaY * WHEEL_SENSITIVITY);
  };

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      advance(KEY_STEP);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      advance(-KEY_STEP);
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
      advance(-dy * TOUCH_SENSITIVITY);
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
      progress += (target - progress) * k;
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
