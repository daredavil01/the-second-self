/**
 * The "forget me" button.
 *
 * A privacy page that only *describes* deletion is asking to be taken on faith.
 * This does it, in one click, with no confirmation dialogue and no attempt to
 * talk you out of it — which is the opposite of the dark pattern this project
 * exists to point at.
 */

import { local } from '../src/storage/local.js';

const button = document.getElementById('forget') as HTMLButtonElement;
const result = document.getElementById('result') as HTMLSpanElement;

const describe = (count: number): string => {
  if (count === 0) return 'There was nothing stored. Nothing to forget.';
  if (count === 1) return 'Forgotten. One thing was stored; it is gone.';
  return `Forgotten. ${count} things were stored; they are gone.`;
};

button.addEventListener('click', () => {
  result.textContent = describe(local.clear());
});
