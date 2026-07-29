import { test, expect } from '@playwright/test';
import { boot, debug, selfState, playthrough, DIMENSIONS } from './harness.js';

/**
 * The Phase 1 exit criterion — the anti-railroad gate.
 *
 * "An automated run asserts that an all-healthy and an all-heedless playthrough
 * end in materially different state vectors." (docs/IMPLEMENTATION-PLAN.md §6.)
 *
 * This is the load-bearing test of the whole phase. If both trajectories end in
 * the same place then the reveal has no stakes, the mirror is showing the piece's
 * opinion rather than the player's choices, and replay and the gallery have
 * nothing to show. Everything downstream assumes this holds.
 *
 * Both runs are driven end to end through real wheel and pointer events at an
 * elevated `?pace=`. The only difference between them is whether the player taps.
 */

// Fast enough that the suite finishes, slow enough that every reach window is
// still seconds wide and the storm has time to gather. Two full playthroughs of
// a live 3D scene through a software rasteriser is not a fast test, and it
// should not pretend to be.
const PACE = '?pace=10';

test.describe.configure({ timeout: 400_000 });

test('the two trajectories end in genuinely different selves', async ({ page }) => {
  await boot(page, PACE);
  await playthrough(page, { engage: true });
  const heedless = await selfState(page);

  // Every room must have left a mark. A dimension at zero here means a room is
  // silently doing nothing — which the divergence assertion below would happily
  // pass anyway, as long as the other four moved.
  for (const dimension of DIMENSIONS) {
    expect(heedless[dimension], `${dimension} never moved`).toBeGreaterThan(0.15);
  }

  await page.locator('#again').click();
  await expect.poll(async () => (await debug(page)).phase, { timeout: 20_000 }).toBe('travel');
  expect(await selfState(page), 'again starts a genuinely fresh self').toEqual({
    clarity: 0,
    posture: 0,
    colour: 0,
    scale: 0,
    world: 0,
  });

  await playthrough(page, { engage: false });
  const careful = await selfState(page);

  // Walking the same road and taking nothing has to arrive somewhere visibly
  // different, on every axis, or the reveal is a foregone conclusion.
  for (const dimension of DIMENSIONS) {
    expect(careful[dimension], `${dimension} moved without being chosen`).toBe(0);
    expect(
      heedless[dimension] - careful[dimension],
      `${dimension} does not separate the two runs`
    ).toBeGreaterThan(0.15);
  }
});

test('the turn takes the steering away, and the reveal waits before offering a way back', async ({
  page,
}) => {
  await boot(page, PACE);
  await playthrough(page, { engage: false });

  // Once the pace breaks, the rail is not yours any more.
  const before = await debug(page);
  await page.evaluate(() => {
    const canvas = document.getElementById('scene')!;
    for (let k = 0; k < 20; k++) {
      canvas.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 400, cancelable: true, bubbles: true })
      );
    }
  });
  await page.waitForTimeout(600);
  const after = await debug(page);

  // Asserted on `target` — the thing the player actually steers — and not on
  // `progress`. The lock takes the steering away; it does not stop the world
  // dead, and whatever was already banked is still gliding to a halt, which is
  // deliberate. Watching the lagging value was L13 all over again: it passed
  // whenever the glide happened to have finished first, and flaked under a
  // loaded suite for reasons that had nothing to do with the lock.
  expect(after.target, 'input still moves the rail after the turn').toBe(before.target);
  expect(after.progress, 'and the world never runs past what was banked').toBeLessThanOrEqual(
    before.target + 1e-6
  );

  // And the way out is offered only after the moment has been allowed to land.
  // Asserted on the class rather than `toBeVisible`, which counts a fully
  // transparent element as visible and would have passed either way.
  await expect(page.locator('#acts')).toHaveClass(/visible/);
});
