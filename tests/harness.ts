import { expect, type Page } from '@playwright/test';

/** Shared driving code for the suite. Nothing here asserts anything on its own. */

export type Dimension = 'clarity' | 'posture' | 'colour' | 'scale' | 'world';
export type SelfState = Record<Dimension, number>;
export type RoomId = 'attention' | 'flood' | 'dopamine' | 'comparison' | 'notifications';

export const DIMENSIONS: readonly Dimension[] = [
  'clarity',
  'posture',
  'colour',
  'scale',
  'world',
];

export interface Debug {
  phase: string;
  progress: number;
  target: number;
  wall: number;
  inReach: RoomId | null;
  taken: Record<RoomId, number>;
  hint: string;
  /** Which of the eight selves the run produced. Null until the reveal. */
  self: string | null;
}

export const debug = (page: Page): Promise<Debug> =>
  page.evaluate(() => window.secondSelf.debug() as unknown as Debug);

export const selfState = (page: Page): Promise<SelfState> =>
  page.evaluate(() => window.secondSelf.state.get() as unknown as SelfState);

export async function boot(page: Page, query = ''): Promise<void> {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`/${query}`);
  await page.waitForFunction(() => typeof window.secondSelf === 'object', null, {
    timeout: 20_000,
  });
  expect(errors, 'no uncaught errors on boot').toEqual([]);
}

/** One batch of real wheel events on the real canvas, in a single round-trip. */
export const push = (page: Page, ticks = 4): Promise<void> =>
  page.evaluate((n: number) => {
    const canvas = document.getElementById('scene')!;
    for (let k = 0; k < n; k++) {
      canvas.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 240, cancelable: true, bubbles: true })
      );
    }
  }, ticks);

/**
 * Walk forward until `progress` arrives, driving the real input path.
 *
 * The rail caps both its speed and how far the target may lead it, so unlike in
 * Phase 0 there is no overshooting it by flooding it with input — but there is
 * also no hurrying it, which is why every caller runs at an elevated `?pace=`.
 * Wheels are batched because each check is a round-trip into the page, and
 * under software rendering those dominate the runtime.
 */
export async function walk(page: Page, to: number, timeoutMs = 90_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const { progress } = await debug(page);
    if (progress >= to - 0.004) return;
    if (Date.now() > deadline) throw new Error(`stalled at ${progress}, wanted ${to}`);
    await push(page);
    await page.waitForTimeout(50);
  }
}

/**
 * Straight to the turn, from just short of it.
 *
 * `seek` is the affordance `?room=` uses — a preview mechanism, never something
 * the experience itself calls. It is right for a test that is about what
 * happens AFTER the turn and wrong for a test about the journey: the walk is
 * the piece, and journey.spec.ts walks all of it. Using it here keeps the share
 * tests to seconds instead of adding two more full playthroughs to the suite.
 */
export async function toTheTurn(page: Page, timeoutMs = 60_000): Promise<void> {
  await page.evaluate(() => window.secondSelf.rail.seek(0.87));
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    if ((await debug(page)).phase !== 'travel') break;
    if (Date.now() > deadline) throw new Error('never reached the turn');
    await push(page);
    await page.waitForTimeout(60);
  }

  await expect.poll(async () => (await debug(page)).phase, { timeout: 30_000 }).toBe('reveal');
}

/** A tap in the middle of the canvas: the choose channel, as a player uses it. */
export async function tap(page: Page, times: number, gapMs = 260): Promise<void> {
  const viewport = page.viewportSize()!;
  for (let i = 0; i < times; i++) {
    await page.mouse.click(viewport.width / 2, viewport.height / 2);
    await page.waitForTimeout(gapMs);
  }
}

/**
 * A whole playthrough, threshold to reveal, driven entirely through wheel and
 * pointer events.
 *
 * `engage` is the only difference between the two trajectories the Phase 1 exit
 * criterion compares: one player takes everything offered, the other walks the
 * same road and takes nothing.
 */
export async function playthrough(
  page: Page,
  { engage }: { engage: boolean },
  timeoutMs = 150_000
): Promise<void> {
  const viewport = page.viewportSize()!;
  const deadline = Date.now() + timeoutMs;

  // Under a software rasteriser the frame loop runs at well under half wall
  // time, so a run takes far longer than its nominal pace suggests. Round-trips
  // into the page are the other tax: the phase is only checked every few
  // iterations, so the clicking stays dense enough to fill each reach window.
  for (let i = 0; ; i++) {
    if (i % 4 === 0) {
      const { phase } = await debug(page);
      if (phase !== 'travel') break;
      if (Date.now() > deadline) throw new Error('the journey never reached the turn');
    }
    if (engage) await page.mouse.click(viewport.width / 2, viewport.height / 2);
    await push(page);
    await page.waitForTimeout(60);
  }

  await expect.poll(async () => (await debug(page)).phase, { timeout: 30_000 }).toBe('reveal');
}
