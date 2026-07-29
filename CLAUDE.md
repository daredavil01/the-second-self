# Working on Second Self

A short symbolic 3D world that lets someone meet the person their digital habits are
quietly building. It is an advocacy piece first: the whole thing exists to produce one
beat — *"wait… that's me."* Everything below protects that.

- **Design source of truth:** [`second-self-master-compendium.md`](second-self-master-compendium.md)
- **Build plan and live status board:** [`docs/IMPLEMENTATION-PLAN.md`](docs/IMPLEMENTATION-PLAN.md)
- **What went wrong before:** [`LESSONS.md`](LESSONS.md) — read the rules section before
  touching the rail, the avatar, or the tests

---

## Commands

```sh
npm run dev            # Vite dev server
npm run build          # tsc --noEmit, then vite build
npm run preview        # serve the built output — always check this, not just dev
npm run verify         # build + check:paths + check:size + test
```

Individually: `npm run check:paths` · `npm run check:size` · `npm test`

---

## Changelog discipline

**Every substantive change adds an entry under `[Unreleased]` in
[`CHANGELOG.md`](CHANGELOG.md), in the same commit as the change itself.** Not afterwards,
not at release time — the context is gone by then.

Format is [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Group entries under
`Added` · `Changed` · `Deprecated` · `Removed` · `Fixed` · `Security`.

Write what changed **for the person experiencing it**, not the file that moved:

> ✅ `Fixed: the drained avatar was so dark it read as lost rather than sad.`
> ❌ `Fixed: adjusted emissiveIntensity floor in avatar.ts.`

### Versioning

Semantic versioning, currently `0.x`, reaching `1.0.0` at public launch. This project has
no public API, so SemVer's usual trigger does not apply — it is redefined against what the
piece *is*:

| Bump | Means |
|---|---|
| **MAJOR** | A change to what the experience *is*: the thesis, the arc, the reveal, or the privacy model. `1.0.0` is the public launch. |
| **MINOR** | A phase lands, a room or page is added, a mechanic changes. |
| **PATCH** | Fixes, tuning, copy, tooling, docs. |

Cutting a release: rename `[Unreleased]` to the version with an ISO date, and open a fresh
empty `[Unreleased]` above it.

Skip changelog entries only for things with no observable effect at all — a typo in a
comment, a reformat. When unsure, write the entry.

---

## Project invariants

These are not preferences. Each one took real work to establish and is easy to break by
accident.

**Awareness, not shame.** No scores, no streaks, no leaderboards, no numbers on the end
card — the number is the shame vector. The avatar at its worst is *diminished, foggy and
small*, never grotesque: sad-but-recognisable invites empathy, grotesque invites distance.
There is always a door open to a better run.

**Peace is offered, never earned.** The peaceful place is never gated behind "good"
choices. Everyone arrives; only the state they arrive in differs.

**One state owner.** [`src/state.ts`](src/state.ts) holds the five floats and nothing else
owns state. **Each facet owns exactly one dimension and may nudge one more — never all
five.** This is what keeps the mirror legible instead of a mood, and the ownership table
lives in `docs/IMPLEMENTATION-PLAN.md` §3. The "dimensions this room owns" smoke test
asserts it.

**Privacy is the message, not a policy.** No accounts, ever, in the core. All on-device
storage goes through [`src/storage/local.ts`](src/storage/local.ts) with the `secondself:`
prefix — the Pages origin is shared across every project on the same account, so an
unprefixed key collides. **No third-party runtime requests**, which is why Three.js is
bundled rather than pulled from a CDN; a smoke test asserts the page calls nobody.
Analytics is off unless `VITE_GOATCOUNTER` is set and must respect Do Not Track and Global
Privacy Control before any request ([`src/analytics.ts`](src/analytics.ts)). Any change
here must keep [`privacy/index.html`](privacy/index.html) true.

**No count is ever shown inside the experience.** A visible engagement metric on a piece
critiquing engagement metrics is self-refuting. Numbers belong on the About page, quietly.

**Never root-absolute paths.** `src="/…"`, `url(/…)`. Pages serves this site from a
subdirectory, so these 404 in production — and the failure is **invisible in development**,
because dev and preview both serve from the root. `scripts/check-paths.mjs` is the only
thing standing between you and that bug.

**Stay inside the performance budget.** Measured gzipped by `scripts/check-size.mjs`,
because that is what a phone on mobile data actually pays. Raise the ceiling deliberately
and say why; never let it drift.

**Accessibility from the first commit.** `prefers-reduced-motion` honoured, keyboard
navigable, graceful fallback for weak devices. Retrofitting this is how it never happens.

**Text is where good intentions go to die.** Cut words ruthlessly. Let the world and the
body carry the meaning. Never narrate the lesson — the moment the piece explains its own
moral, it stops being felt.

---

## The design-confirmation gate

Choices with a look, a feel, or a pace are **previewed and confirmed by the human**, per
`docs/IMPLEMENTATION-PLAN.md` §4. A menu selection is a direction; a preview is the
decision.

- **Never self-approve a D-row.** Build it, show it, and say it is awaiting confirmation.
- **Never mark a phase ✅ Done while any of its D-rows are open.**
- Reversing a confirmed-in-principle decision at its preview gate is a normal outcome, not
  a failure. That is what the gate is for.

Structural decisions (architecture, tooling, privacy model) are not D-rows — changing one
is a replan, not a preview note.

---

## Testing

Tests run against the **production build**, never the dev server: subpath breakage and
anything the minifier touches exist only in the built output.

The Playwright `webServer` **builds before it previews**. Do not remove that — `vite
preview` serves whatever is already in `dist/`, and without the build step the suite will
happily report green against a stale bundle. This has already cost three debugging rounds
once; see [`LESSONS.md`](LESSONS.md).

Set `PLAYWRIGHT_CHROMIUM_PATH` when the environment ships a pre-installed browser instead
of Playwright's own download cache. Leave it unset in CI.

Assertions are worthless until you have watched them fail. When adding a guard, break
something on purpose once and confirm it fires.

---

## Documenting as you go

- **`CHANGELOG.md`** — an entry with every substantive change, in the same commit.
- **`LESSONS.md`** — an entry whenever a non-obvious bug is fixed or a new rule emerges.
  If it took more than one attempt to understand, it belongs there.
