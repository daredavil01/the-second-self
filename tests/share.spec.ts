import { test, expect } from '@playwright/test';
import { boot, debug, toTheTurn, type SelfState } from './harness.js';

/**
 * The share engine.
 *
 * Two things are being protected here, and the first one matters more than any
 * pixel: THE NAMES DO NOT READ AS GRADES, and no number ever reaches the
 * player. A card critiquing engagement metrics that carries a score is
 * self-refuting, and the number is the shame vector the entire design exists to
 * avoid. The second is that the card is actually a card — right shape, avatar
 * in it, words on it — rather than a black rectangle nobody notices is black.
 */

const zero: SelfState = { clarity: 0, posture: 0, colour: 0, scale: 0, world: 0 };
const vector = (over: Partial<SelfState>): SelfState => ({ ...zero, ...over });

/** One run of each shape the eight names exist to characterise. */
const RUNS: ReadonlyArray<{ what: string; state: SelfState; expect: string }> = [
  { what: 'took nothing at all', state: zero, expect: 'steady' },
  { what: 'barely touched anything', state: vector({ colour: 0.12 }), expect: 'steady' },
  { what: 'chased every shard', state: vector({ clarity: 0.7, posture: 0.1 }), expect: 'glancing' },
  { what: 'let the water rise', state: vector({ posture: 0.66, clarity: 0.2 }), expect: 'carrying' },
  { what: 'kept working the lever', state: vector({ colour: 0.8, scale: 0.3 }), expect: 'pulling' },
  { what: 'stopped at every plinth', state: vector({ scale: 0.6, colour: 0.2 }), expect: 'measuring' },
  { what: 'answered every ping', state: vector({ world: 0.72, posture: 0.25 }), expect: 'answering' },
  {
    what: 'took some of everything',
    state: vector({ clarity: 0.4, posture: 0.45, colour: 0.38, scale: 0.42, world: 0.4 }),
    expect: 'little-of-everything',
  },
  {
    what: 'took all of everything',
    state: vector({ clarity: 1, posture: 1, colour: 1, scale: 1, world: 1 }),
    expect: 'yes-to-everything',
  },
];

/** The naming function is pure, so it can simply be handed every vector at once. */
const nameAll = (page: import('@playwright/test').Page) =>
  page.evaluate(
    (states) => states.map((s) => window.secondSelf.nameFor(s)),
    RUNS.map((run) => run.state)
  );

test('every shape of run gets its own name, and all eight are reachable', async ({ page }) => {
  await boot(page);

  const named = await nameAll(page);

  for (const [i, self] of named.entries()) {
    expect(self.id, `a run that ${RUNS[i]!.what}`).toBe(RUNS[i]!.expect);
  }

  // A name that nothing can produce is a name that was never really written.
  expect(new Set(named.map((self) => self.id)).size, 'all eight selves are reachable').toBe(8);
});

test('no name and no line is a grade, and none of them carries a number', async ({ page }) => {
  await boot(page);

  const named = await nameAll(page);

  for (const self of named) {
    // The number is the shame vector. Not a score, not a percentage, not a
    // count of rooms, not "3 of 5" — nothing with a digit in it.
    expect(self.name, `"${self.name}" carries a number`).not.toMatch(/\d/);
    expect(self.line, `"${self.line}" carries a number`).not.toMatch(/\d/);

    // Nor a verdict. These are the words that turn a characterisation into a
    // report card, and none of them belongs anywhere near this copy.
    expect(`${self.name} ${self.line}`.toLowerCase()).not.toMatch(
      /\b(score|level|rank|grade|addict|healthy|unhealthy|bad|worse|worst|best|winner|failed?|should|try harder)\b/
    );
  }
});

test('the reveal names you, and the card is a portrait rather than a black rectangle', async ({
  page,
}) => {
  await boot(page, '?pace=10');

  // Seeded directly and driven to the turn from just short of it. What the
  // rooms do to the state vector is covered room by room in smoke.spec.ts, and
  // end to end in journey.spec.ts; what is under test here is everything that
  // happens *after* the turn, which two more full playthroughs would only make
  // slower to find out.
  await page.evaluate(() => {
    window.secondSelf.state.mark('colour', 0.78);
    window.secondSelf.state.mark('scale', 0.3);
  });
  await toTheTurn(page);

  await expect(page.locator('#self-name')).toHaveClass(/visible/);
  await expect(page.locator('#self-name')).toHaveText('The One Who Kept Pulling');
  await expect(page.locator('#self-line')).toHaveText('there was always one more.');
  expect((await debug(page)).self).toBe('pulling');

  const card = await page.evaluate(() => {
    const composed = window.secondSelf.card()!.canvas;
    const ctx = composed.getContext('2d')!;
    const light = (x: number, y: number, w: number, h: number): { peak: number; mean: number } => {
      const { data } = ctx.getImageData(x, y, w, h);
      let peak = 0;
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const value = (data[i]! + data[i + 1]! + data[i + 2]!) / 3;
        if (value > peak) peak = value;
        sum += value;
      }
      return { peak, mean: sum / (data.length / 4) };
    };
    return {
      width: composed.width,
      height: composed.height,
      hero: light(0, 0, composed.width, 860),
      words: light(0, 890, composed.width, 460),
    };
  });

  expect(card.width).toBe(1080);
  expect(card.height).toBe(1350);

  // Something is lit up there, and it is not the whole frame — a portrait of a
  // luminous figure in a dark field, which is the entire point of the image.
  expect(card.hero.peak, 'the avatar is in the portrait').toBeGreaterThan(60);
  expect(card.hero.mean, 'and the field around it is still dark').toBeLessThan(120);
  expect(card.hero.mean, 'but not pure black').toBeGreaterThan(2);

  // And the words got drawn, in ink that can actually be read against the
  // field behind them — which is a thing worth finding out from a test rather
  // than from a card somebody has already sent to a friend.
  expect(card.words.peak, 'the name is written on the card').toBeGreaterThan(100);
});

test('nothing in the ending is a number, and the way back clears it', async ({ page }) => {
  await boot(page, '?pace=10');
  await page.evaluate(() => window.secondSelf.state.mark('world', 0.7));
  await toTheTurn(page);

  await expect(page.locator('#acts')).toHaveClass(/visible/);
  await expect(page.locator('#keep')).toBeEnabled();

  // Everything the player is shown at the end, in one string.
  const ending = (await page.locator('#ending').innerText()).trim();
  expect(ending, 'the ending shows a number').not.toMatch(/\d/);
  expect(ending).toContain('your second self could be different');

  await page.locator('#again').click();
  await expect.poll(async () => (await debug(page)).phase, { timeout: 20_000 }).toBe('travel');

  // The invitation is that this could come out differently, so the door back
  // has to open onto a blank run — the old card included.
  expect(await page.evaluate(() => window.secondSelf.card() === null)).toBe(true);
  await expect(page.locator('#self-name')).not.toHaveClass(/visible/);
  await expect(page.locator('#keep')).toBeDisabled();
});
