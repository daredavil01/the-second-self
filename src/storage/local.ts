/**
 * On-device storage. The only place this project is allowed to touch
 * localStorage — everything goes through here.
 *
 * Two reasons this exists before anything needs it:
 *
 * 1. NAMESPACING. Every project page under daredavil01.github.io shares one
 *    origin, so an unprefixed key here can collide with an unrelated project
 *    of yours (and vice versa). Every key is prefixed `secondself:`.
 *
 * 2. THE PROMISE. "Nothing leaves your device" is only credible if there is
 *    exactly one narrow door that data goes through, and you can point at it.
 *    /privacy/ describes this file. Keep them true to each other.
 *
 * Storage can throw or be absent — Safari private mode, disabled cookies,
 * quota. None of that is an error worth interrupting the experience for, so
 * every operation degrades to a no-op.
 */

const PREFIX = 'secondself:';

function available(): Storage | null {
  try {
    const probe = `${PREFIX}__probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

export const local = {
  read<T>(key: string, fallback: T): T {
    const store = available();
    if (!store) return fallback;
    try {
      const raw = store.getItem(PREFIX + key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },

  write(key: string, value: unknown): void {
    const store = available();
    if (!store) return;
    try {
      store.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* quota or private mode — losing a gallery entry is not worth a crash */
    }
  },

  remove(key: string): void {
    available()?.removeItem(PREFIX + key);
  },

  /** Every key this project owns. /privacy/ offers this as "forget me". */
  keys(): string[] {
    const store = available();
    if (!store) return [];
    const found: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (key?.startsWith(PREFIX)) found.push(key.slice(PREFIX.length));
    }
    return found;
  },

  /** Erase everything this project has ever stored, and nothing else. */
  clear(): number {
    const store = available();
    if (!store) return 0;
    const mine = this.keys();
    for (const key of mine) store.removeItem(PREFIX + key);
    return mine.length;
  },
};
