/**
 * The relative-path guard.
 *
 * A GitHub Pages *project* page is served from a subdirectory, so a
 * root-absolute asset path (`/assets/x.js`) resolves to daredavil01.github.io
 * rather than daredavil01.github.io/the-second-self/ — and 404s. The reason
 * this needs a CI check rather than care is that it is INVISIBLE IN
 * DEVELOPMENT: `vite dev` and `vite preview` both serve from the root, so the
 * broken build works perfectly on your machine and fails only once deployed.
 *
 * The compendium names this as the single most common way a Pages deployment
 * breaks. So: scan the built output, fail on anything root-absolute.
 *
 * Run with `npm run check:paths`, after `npm run build`.
 */

import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';

/** Root-absolute references in markup and CSS. Protocol-relative `//` is fine. */
const PATTERNS = [
  { re: /\b(?:src|href)\s*=\s*"\/(?!\/)/g, what: 'src/href="/…"' },
  { re: /\burl\(\s*["']?\/(?!\/)/g, what: 'url(/…)' },
  { re: /\bfrom\s*"\/(?!\/)/g, what: 'import from "/…"' },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const problems = [];
let scanned = 0;

try {
  for await (const file of walk(DIST)) {
    if (!/\.(html|css|js|json|svg|webmanifest)$/.test(file)) continue;
    scanned++;
    const text = readFileSync(file, 'utf8');
    for (const { re, what } of PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(text)) !== null) {
        const line = text.slice(0, match.index).split('\n').length;
        const snippet = text.slice(match.index, match.index + 60).split('\n')[0];
        problems.push(`${relative('.', file)}:${line}  ${what}  →  ${snippet}`);
      }
    }
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`✗ no ${DIST}/ directory — run \`npm run build\` first`);
    process.exit(1);
  }
  throw error;
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} root-absolute path(s) in ${DIST}/:\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    '\n  These work locally and 404 on GitHub Pages, which serves this site\n' +
      '  from a subdirectory. Use a relative path, or keep vite.config.ts on\n' +
      "  `base: './'`.\n"
  );
  process.exit(1);
}

console.log(`✓ ${scanned} built files, no root-absolute paths`);
