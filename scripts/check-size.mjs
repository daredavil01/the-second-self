/**
 * The performance budget.
 *
 * "3D on phones is unforgiving" is listed in the compendium as a top risk, and
 * the mitigation is a strict budget enforced early rather than a cleanup later.
 * The number that actually matters to someone on a mid-range Android on mobile
 * data is COMPRESSED TRANSFER SIZE, so that is what this measures — gzipped,
 * not raw.
 *
 * Three.js alone is most of the current budget. That is expected and fine; the
 * point of the ceiling is to notice the day something unexpected joins it.
 */

import { readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const DIST = 'dist';

const BUDGETS = {
  js: 260, // KB gzipped, all scripts — three.js is ~160 of it
  css: 20,
  html: 12,
  total: 300,
};

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const totals = { js: 0, css: 0, html: 0 };
const files = [];

for await (const file of walk(DIST)) {
  const ext = file.split('.').pop();
  if (!(ext in totals)) continue;
  const size = gzipSync(readFileSync(file)).length;
  totals[ext] += size;
  files.push({ file, size });
}

files.sort((a, b) => b.size - a.size);

const total = totals.js + totals.css + totals.html;
const failures = [];

for (const [kind, budget] of Object.entries(BUDGETS)) {
  const actual = kb(kind === 'total' ? total : totals[kind]);
  if (actual > budget) failures.push(`${kind}: ${actual}KB over the ${budget}KB budget`);
}

console.log('gzipped transfer size:');
for (const { file, size } of files.slice(0, 6)) {
  console.log(`  ${kb(size).toString().padStart(7)}KB  ${file}`);
}
console.log(
  `  ${'—'.repeat(30)}\n  ${kb(total).toString().padStart(7)}KB  total ` +
    `(budget ${BUDGETS.total}KB)`
);

if (failures.length > 0) {
  console.error('\n✗ over budget:');
  for (const failure of failures) console.error(`  ${failure}`);
  console.error(
    '\n  Either trim it, or raise the budget deliberately and say why.\n' +
      '  Silent growth here is what makes a 3D piece unusable on a mid-range\n' +
      '  phone, which is the primary target device.\n'
  );
  process.exit(1);
}

console.log('\n✓ within budget');
