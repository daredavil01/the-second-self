# Second Self

A short symbolic 3D world that lets you meet the person your digital habits are
quietly building. Awareness, not shame.

- **Design and research source of truth:** [`second-self-master-compendium.md`](second-self-master-compendium.md)
- **Build plan and live status board:** [`docs/IMPLEMENTATION-PLAN.md`](docs/IMPLEMENTATION-PLAN.md)

## Running it

```sh
npm install
npm run dev
```

Scroll or swipe to move. Tap, click, or hold to choose.

## Verifying it

```sh
npm run verify     # build + path guard + size budget + smoke tests
```

Or individually:

| Command | What it protects |
|---|---|
| `npm run build` | Type check, then production build |
| `npm run check:paths` | No root-absolute asset paths. These work in dev and 404 on GitHub Pages, which serves from a subdirectory — the single most common way a Pages deploy breaks |
| `npm run check:size` | Gzipped transfer budget, because 3D on a mid-range phone is unforgiving |
| `npm test` | Playwright smoke tests, run against the **production build** on desktop and mobile |

Always preview the built output, not just the dev server — subpath and minifier
bugs do not reproduce on `vite dev`:

```sh
npm run build && npm run preview
```

## Privacy

There is no account, no cookie, and no backend. Anything remembered is written to
your own browser under keys prefixed `secondself:`, through the single file
`src/storage/local.ts`. Optional page-view counting via GoatCounter is **off
unless `VITE_GOATCOUNTER` is set**, and never runs if your browser sends Do Not
Track or Global Privacy Control. See [`/privacy/`](privacy/index.html).

## Status

Phase 0 (the vertical slice) and Phase 0.5 (the foundation) are built. Phase 0 is
awaiting design confirmation — it answers one question: does watching the avatar
change in response to your own choices produce "oh… that's me"?
