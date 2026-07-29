import { test, expect, type Page } from '@playwright/test';

/**
 * Phase 0.5 smoke tests.
 *
 * These protect the things that are cheap to break and expensive to notice:
 * that the world boots at all, that the mirror only moves the dimensions the
 * dopamine room owns, that the two trajectories genuinely diverge, and that
 * the privacy promise is both reachable and true.
 *
 * The branch-divergence assertion in "two trajectories" is the seed of the
 * Phase 1 anti-railroad gate — the ending MUST vary with choices, or replay
 * and the gallery have nothing to show.
 */

interface Debug {
  phase: string;
  progress: number;
  target: number;
  wall: number;
  leverInReach: boolean;
  pulls: number;
  hint: string;
}

type SelfState = Record<'clarity' | 'posture' | 'colour' | 'scale' | 'world', number>;

const debug = (page: Page) =>
  page.evaluate(() => window.secondSelf.debug() as unknown as Debug);
const selfState = (page: Page) =>
  page.evaluate(() => window.secondSelf.state.get() as unknown as SelfState);

async function boot(page: Page): Promise<void> {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.waitForFunction(() => typeof window.secondSelf === 'object', null, {
    timeout: 20_000,
  });
  expect(errors, 'no uncaught errors on boot').toEqual([]);
}

/**
 * Walk forward until `progress` reaches the target, or give up.
 *
 * Deliberately drives real wheel events rather than poking the rail directly —
 * the input path is part of what is under test. Wheels are batched between
 * checks because each check is a round-trip into the page, and under software
 * rendering that dominates the runtime.
 */
async function walkTo(page: Page, destination: number): Promise<void> {
  // Steer the rail's TARGET, not its eased progress. Watching progress alone
  // overshoots badly: progress lags, so by the time it arrives the target has
  // already run far ahead and the avatar keeps drifting — straight past the
  // door the test was trying to stop at.
  const PER_TICK = 240 * 0.00007;

  for (let i = 0; i < 80; i++) {
    const { target } = await debug(page);
    const remaining = destination - target;
    if (remaining <= 0.002) break;
    const ticks = Math.max(1, Math.min(10, Math.ceil(remaining / PER_TICK)));
    // Real WheelEvents on the real canvas, through the rail's real listener —
    // but dispatched in one round-trip. Driving them singly over CDP costs
    // more than the whole rest of the test.
    await page.evaluate((n: number) => {
      const canvas = document.getElementById('scene')!;
      for (let k = 0; k < n; k++) {
        canvas.dispatchEvent(
          new WheelEvent('wheel', { deltaY: 240, cancelable: true, bubbles: true })
        );
      }
    }, ticks);
    await page.waitForTimeout(30);
  }

  // Now let the eased progress settle onto the target we stopped steering.
  await page.waitForFunction(
    (d: number) => (window.secondSelf.debug()['progress'] as number) >= d - 0.012,
    destination,
    { timeout: 30_000 }
  );
}

test('the world boots and the threshold is calm', async ({ page }) => {
  await boot(page);
  const initial = await debug(page);
  expect(initial.phase).toBe('travel');
  expect(initial.progress).toBe(0);
  expect(initial.pulls).toBe(0);

  // The opening hint is offered late, and only to someone who has not moved.
  await page.waitForFunction(() => window.secondSelf.debug()['hint'] !== '', null, {
    timeout: 10_000,
  });
  expect(await page.textContent('#hint')).toMatch(/scroll|swipe/);
});

test('the lever costs only the dimensions this room owns', async ({ page }) => {
  await boot(page);
  await walkTo(page, 0.25);
  await expect
    .poll(async () => (await debug(page)).leverInReach, { timeout: 10_000 })
    .toBe(true);

  const viewport = page.viewportSize()!;
  for (let i = 0; i < 6; i++) {
    await page.mouse.click(viewport.width / 2, viewport.height / 2);
    await page.waitForTimeout(300);
  }

  expect((await debug(page)).pulls).toBe(6);

  const s = await selfState(page);
  // Dopamine owns COLOUR and nudges SCALE. It must touch nothing else — this
  // is the rule that keeps the mirror legible instead of a mood.
  expect(s.colour).toBeGreaterThan(0.4);
  expect(s.scale).toBeGreaterThan(0.2);
  expect(s.clarity).toBe(0);
  expect(s.posture).toBe(0);
  expect(s.world).toBe(0);
});

test('two trajectories end in genuinely different selves', async ({ page }) => {
  await boot(page);

  // Heedless: stop and pull.
  await walkTo(page, 0.25);
  const viewport = page.viewportSize()!;
  for (let i = 0; i < 8; i++) {
    await page.mouse.click(viewport.width / 2, viewport.height / 2);
    await page.waitForTimeout(280);
  }
  await walkTo(page, 0.83);
  await expect.poll(async () => (await debug(page)).phase, { timeout: 25_000 }).toBe('reveal');
  const heedless = await selfState(page);

  // Careful: walk straight past.
  await page.locator('#again').click();
  await page.waitForTimeout(600);
  expect((await selfState(page)).colour).toBe(0);

  await walkTo(page, 0.83);
  await expect.poll(async () => (await debug(page)).phase, { timeout: 25_000 }).toBe('reveal');
  const careful = await selfState(page);

  expect(heedless.colour - careful.colour).toBeGreaterThan(0.5);
  expect(heedless.scale - careful.scale).toBeGreaterThan(0.3);
});

test('the reach window closes once you have walked past', async ({ page }) => {
  await boot(page);
  await walkTo(page, 0.55); // well beyond the door at 0.34
  expect((await debug(page)).leverInReach).toBe(false);

  const viewport = page.viewportSize()!;
  await page.mouse.click(viewport.width / 2, viewport.height / 2);
  await page.waitForTimeout(300);

  // Walking on has to be final, or it is a postponement rather than a choice.
  expect((await debug(page)).pulls).toBe(0);
  expect((await selfState(page)).colour).toBe(0);
});

test('the privacy promise is reachable, and forgetting works', async ({ page }) => {
  await page.goto('/');
  await page.locator('#promise').click();
  await expect(page).toHaveURL(/privacy/);
  await expect(page.locator('h1')).toHaveText('Nothing leaves your device');

  // Only `secondself:`-prefixed keys are ours, and only those may be erased.
  await page.evaluate(() => {
    localStorage.setItem('secondself:test-gallery', '["a","b"]');
    localStorage.setItem('someone-elses-key', 'do not touch');
  });

  await page.locator('#forget').click();
  await expect(page.locator('#result')).toContainText('Forgotten');

  const remaining = await page.evaluate(() => ({
    ours: localStorage.getItem('secondself:test-gallery'),
    theirs: localStorage.getItem('someone-elses-key'),
  }));
  expect(remaining.ours).toBeNull();
  expect(remaining.theirs).toBe('do not touch');
});

test('nothing is requested from a third party', async ({ page }) => {
  // The promise is only credible if the network tab agrees with it. Analytics
  // is unconfigured in dev and CI builds, so this must be a closed system.
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) external.push(request.url());
  });

  await page.goto('/');
  await page.waitForTimeout(2500);
  expect(external, 'no third-party requests').toEqual([]);
});
