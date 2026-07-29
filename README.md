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

Scroll or swipe to move. Tap, click, or hold to choose. Walking has a floor pace —
scrolling harder will not hurry it.

Two query parameters exist for reviewing the thing, and do nothing for a visitor
who arrives without them:

| | |
|---|---|
| `?room=attention` | Start beside one room. Also `flood`, `dopamine`, `comparison`, `notifications` |
| `?pace=8` | Run the journey faster, so a later room can be reached without replaying what comes before it |

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

Two generators, run by hand rather than by the build, whose output is committed:

| Command | What it makes |
|---|---|
| `npm run og` | `public/og.png`, the link-preview image. No dependencies — it draws the pixels and encodes the PNG itself |
| `npm run cards` | `preview-cards/*.png`, three end cards from three genuinely different runs. This is the artifact the D9 confirmation gate asks to be shown |

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

Phase 1 is complete as software and Phase 2 is built: the whole journey runs —
five rooms, accumulating state, the turn and the reveal — what you meet at the
end has a name, and you can take it away as a card. The suite is green on desktop
and mobile.

None of it is proven as design. **Nine confirmation rows are open**, and Phase 0
still owes its 5–10 person cold-user test. The eight names in particular are a
first draft awaiting review as a plain list, which is why they live alone in
`src/share/naming.ts`. Until real people have played it, the one question the
piece exists to answer is unanswered: does watching the avatar change in response
to your own choices produce "oh… that's me"? See the status board in
[`docs/IMPLEMENTATION-PLAN.md`](docs/IMPLEMENTATION-PLAN.md).
