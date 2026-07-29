/**
 * Three cards, from three genuinely different runs — and the ending each one
 * arrives at, shot on a phone-sized viewport.
 *
 * This is the D8 and D9 gate artifact (docs/IMPLEMENTATION-PLAN.md §4): the
 * names and the end-card layout are confirmed by looking at real ones, not at a
 * description. It lives as a script rather than a one-off because the names and
 * the layout are going to change at least once — a gate you can re-run in half a
 * minute is a gate that actually gets re-run.
 *
 *   npm run cards      → preview-cards/*.png
 *
 * Builds first and serves what it built, for the same reason the Playwright
 * config does: `vite preview` serves whatever is already in dist/, and a stale
 * one has cost this project three debugging rounds already (LESSONS L14).
 */

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4174; // not 4173 — so this never collides with a test run
const OUT = 'preview-cards';

/** Three shapes worth looking at side by side, not three random vectors. */
const RUNS = [
  { file: 'careful', of: {} },
  { file: 'leaning', of: { colour: 0.82, scale: 0.34 } },
  { file: 'everything', of: { clarity: 1, posture: 1, colour: 1, scale: 1, world: 1 } },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function serve() {
  // Vite's own entry point, run directly on this node — not `npx` through a
  // shell. A shell-wrapped child cannot be killed on Windows: `kill()` reaps the
  // wrapper and leaves the server holding the port, which is how two orphaned
  // preview servers ended up outliving this script.
  const vite = join(dirname(createRequire(import.meta.url).resolve('vite/package.json')), 'bin/vite.js');
  const server = spawn(process.execPath, [vite, 'preview', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/`);
      if (response.ok) return server;
    } catch {
      /* not up yet */
    }
    await wait(500);
  }
  server.kill();
  throw new Error('vite preview never came up');
}

const server = await serve();
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

try {
  mkdirSync(OUT, { recursive: true });
  // A phone, because mobile is the primary target and the ending is the one
  // screen in the piece with more than two words on it.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  for (const run of RUNS) {
    await page.goto(`http://127.0.0.1:${PORT}/?pace=10`);
    await page.waitForFunction(() => typeof window.secondSelf === 'object');

    await page.evaluate((of) => {
      for (const [dimension, amount] of Object.entries(of)) {
        window.secondSelf.state.mark(dimension, amount);
      }
      // Straight to the turn. This is the preview affordance `?room=` uses; a
      // gate artifact is exactly what it is for.
      window.secondSelf.rail.seek(0.87);
    }, run.of);

    // Nudge it over the line, then wait for the card to be composed.
    for (let i = 0; i < 40; i++) {
      const phase = await page.evaluate(() => window.secondSelf.debug()['phase']);
      if (phase === 'reveal') break;
      await page.evaluate(() =>
        document
          .getElementById('scene')
          .dispatchEvent(new WheelEvent('wheel', { deltaY: 400, cancelable: true, bubbles: true }))
      );
      await wait(150);
    }

    await page.waitForFunction(() => window.secondSelf.card() !== null, null, { timeout: 30_000 });
    const { name, data } = await page.evaluate(() => {
      const card = window.secondSelf.card();
      return { name: card.self.name, data: card.canvas.toDataURL('image/png') };
    });

    const path = `${OUT}/${run.file}.png`;
    writeFileSync(path, Buffer.from(data.split(',')[1], 'base64'));

    // And the ending itself, once it has finished arriving — the name is read
    // here before it is ever read on a card.
    await page.waitForSelector('#acts.visible', { timeout: 40_000 });
    const ending = `${OUT}/${run.file}-ending.png`;
    await page.screenshot({ path: ending });

    console.log(`  ${path}  ·  ${ending}  —  ${name}`);
  }

  console.log(`\n✓ ${RUNS.length} cards and endings in ${OUT}/ — the D8/D9 gate artifact.`);
} finally {
  await browser.close();
  server.kill();
}
