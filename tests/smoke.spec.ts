import { test, expect } from '@playwright/test';
import {
  boot,
  debug,
  selfState,
  tap,
  walk,
  DIMENSIONS,
  type Dimension,
  type RoomId,
} from './harness.js';

/**
 * Smoke tests.
 *
 * These protect the things that are cheap to break and expensive to notice:
 * that the world boots at all, that each room moves only the dimensions it
 * owns, that walking past is final, and that the privacy promise is both
 * reachable and true.
 *
 * The anti-railroad gate — the Phase 1 exit criterion — lives next door in
 * journey.spec.ts.
 */

test('the world boots and the threshold is calm', async ({ page }) => {
  await boot(page);
  const initial = await debug(page);
  expect(initial.phase).toBe('travel');
  expect(initial.progress).toBe(0);
  expect(initial.inReach).toBeNull();
  expect(Object.values(initial.taken)).toEqual([0, 0, 0, 0, 0]);

  // The opening hint is offered late, and only to someone who has not moved.
  await page.waitForFunction(() => window.secondSelf.debug()['hint'] !== '', null, {
    timeout: 10_000,
  });
  expect(await page.textContent('#hint')).toMatch(/scroll|swipe/);
});

/**
 * The ownership table, asserted room by room.
 *
 * "Each facet owns exactly one dimension and may nudge one more — never all
 * five" is the rule that keeps the mirror legible instead of a mood, and it is
 * the single easiest thing in this project to break by accident. Every room is
 * checked against docs/IMPLEMENTATION-PLAN.md §3, including the dimensions it
 * must leave completely alone.
 */
const OWNERSHIP: ReadonlyArray<{
  room: RoomId;
  taps: number;
  owns: Dimension;
  nudges: Dimension | null;
}> = [
  { room: 'attention', taps: 8, owns: 'clarity', nudges: null },
  { room: 'flood', taps: 8, owns: 'posture', nudges: 'clarity' },
  { room: 'dopamine', taps: 6, owns: 'colour', nudges: 'scale' },
  { room: 'comparison', taps: 8, owns: 'scale', nudges: 'colour' },
];

for (const { room, taps, owns, nudges } of OWNERSHIP) {
  test(`${room} costs only the dimensions it owns`, async ({ page }) => {
    await boot(page, `?room=${room}`);
    await expect.poll(async () => (await debug(page)).inReach, { timeout: 15_000 }).toBe(room);

    await tap(page, taps);
    expect((await debug(page)).taken[room]).toBeGreaterThan(0);

    const s = await selfState(page);
    expect(s[owns], `${room} owns ${owns}`).toBeGreaterThan(0.3);
    if (nudges) expect(s[nudges], `${room} nudges ${nudges}`).toBeGreaterThan(0);

    for (const dimension of DIMENSIONS) {
      if (dimension === owns || dimension === nudges) continue;
      expect(s[dimension], `${room} must not touch ${dimension}`).toBe(0);
    }
  });
}

/**
 * The storm gets its own case: it is the one room whose offer arrives on a
 * clock rather than standing there waiting, so a tap only lands when something
 * is actually pinging. Tapping into the silence between pings must cost nothing.
 */
test('the storm costs only what it owns, and only when it is pinging', async ({ page }) => {
  await boot(page, '?room=notifications&pace=4');
  await expect
    .poll(async () => (await debug(page)).inReach, { timeout: 15_000 })
    .toBe('notifications');

  await tap(page, 20, 200);

  const s = await selfState(page);
  expect(s.world, 'the storm owns world').toBeGreaterThan(0.2);
  expect(s.posture, 'and nudges posture').toBeGreaterThan(0);
  expect(s.clarity).toBe(0);
  expect(s.colour).toBe(0);
  expect(s.scale).toBe(0);

  // Every tap that landed answered something real. Some of the twenty fell into
  // the silence between pings and cost nothing, which is the difference between
  // a storm and a button.
  const { taken } = await debug(page);
  expect(taken.notifications).toBeGreaterThan(2);
  expect(taken.notifications).toBeLessThan(20);
});

test('the reach window closes once you have walked past', async ({ page }) => {
  await boot(page, '?room=dopamine&pace=3');
  await expect.poll(async () => (await debug(page)).inReach, { timeout: 20_000 }).toBe('dopamine');

  await walk(page, 0.47); // past the door at 0.43, short of the corridor at 0.59
  await expect
    .poll(async () => (await debug(page)).inReach, { timeout: 20_000 })
    .not.toBe('dopamine');

  await tap(page, 3);

  // Walking on has to be final, or it is a postponement rather than a choice.
  expect((await debug(page)).taken.dopamine).toBe(0);
});

test('the journey has a floor pace that scrolling harder cannot shorten', async ({ page }) => {
  await boot(page);

  // Flood it with far more input than the whole track is worth. The rail banks
  // what it can use and drops the rest — the walk is not negotiable, and that
  // is the point of the walk.
  await page.evaluate(() => {
    const canvas = document.getElementById('scene')!;
    for (let k = 0; k < 400; k++) {
      canvas.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 400, cancelable: true, bubbles: true })
      );
    }
  });
  await page.waitForTimeout(1500);

  const { progress, target, phase } = await debug(page);
  expect(progress, 'a second and a half of world, not a whole journey').toBeLessThan(0.05);
  expect(target, 'and the input banked rather than piling up').toBeLessThan(0.06);
  expect(phase).toBe('travel');
});

test('a browser that cannot draw the world says so rather than showing nothing', async ({
  page,
}) => {
  // WebGL is missing or blocked far more often than a desktop makes it look.
  // Refusing every WebGL context is the closest thing to an old Android or a
  // locked-down work profile that a test can arrange.
  await page.addInitScript(() => {
    const real = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...rest: unknown[]
    ) {
      if (kind.includes('webgl')) return null;
      return (real as (...a: unknown[]) => unknown).call(this, kind, ...rest);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });

  await page.goto('/');

  // A black rectangle with no explanation is the failure this is guarding
  // against: the visitor cannot tell it from something still loading.
  await expect(page.locator('#unsupported')).toBeVisible();
  await expect(page.locator('#unsupported')).toContainText('cannot draw it');

  // And the promise stays reachable, because it is true of this page too.
  await page.locator('#unsupported a').click();
  await expect(page).toHaveURL(/privacy/);
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
