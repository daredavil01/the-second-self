# Changelog

All notable changes to Second Self are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project uses [semantic versioning](https://semver.org/spec/v2.0.0.html) — with one
adjustment. There is no public API here, so SemVer's usual trigger does not apply. It is
redefined against what the piece *is*:

- **MAJOR** — a change to what the experience is: the thesis, the arc, the reveal, or the
  privacy model. `1.0.0` is the public launch.
- **MINOR** — a phase lands, a room or page is added, a mechanic changes.
- **PATCH** — fixes, tuning, copy, tooling, docs.

Entries describe what changed for the person experiencing it, not the file that moved.

## [Unreleased]

Nothing yet.

## [0.2.0] — 2026-07-29

Phase 0.5 — the foundation. The project can now build itself, check itself, test itself,
and deploy itself, and the privacy promise became something you can verify rather than
something you have to believe.

### Added

- A privacy page at `/privacy/`, reachable by a quiet "nothing leaves your device" line at
  the bottom of the experience. It states exactly what is stored and offers a working
  "forget everything" button that erases only this project's own keys.
- Optional page-view counting via GoatCounter — cookieless, no personal data, and **off
  entirely** unless configured. It obeys Do Not Track and Global Privacy Control before
  making any request, so a fork of this repository is silent by default. No count is ever
  shown inside the experience.
- A single narrow door for all on-device storage, namespaced `secondself:` so it cannot
  collide with anything else served from the same GitHub Pages account.
- Twelve smoke tests running on desktop and mobile against the production build. They
  assert the world boots, the dopamine room moves only the dimensions it owns, the two
  trajectories genuinely diverge, walking past the door is final, and the page makes no
  third-party request at all.
- A guard that fails the build on any root-absolute asset path — the single most common
  way a GitHub Pages deploy breaks, and one that is invisible in development.
- A gzipped transfer budget, because that is what a phone on mobile data actually pays.
  Currently 139KB against a 300KB ceiling.
- A GitHub Actions workflow that verifies every push and deploys `main` to Pages.

### Changed

- Migrated from a buildless prototype to Vite and TypeScript under strict settings.
- Asset paths are now relative rather than pinned to a deployment subdirectory, so the same
  build runs from a project page, a user page, a custom domain, or a local preview
  unchanged.

### Removed

- The vendored copy of Three.js. It is now a normal dependency, bundled first-party at
  build time — which preserves the no-third-party-request property that motivated
  vendoring in the first place, and makes updating it routine.

### Fixed

- Four latent issues that strict TypeScript surfaced: unsafe destructuring in the audio
  synthesis, a fog type that could have been the wrong shape, unguarded particle buffer
  access, and a module resolution bug in the build config.
- The test harness could report green against a stale build. It now rebuilds before
  serving, so the suite always tests current source.

## [0.1.0] — 2026-07-29

Phase 0 — the vertical slice. One room, one choice, one reveal, built to answer a single
question: does watching the avatar change in response to your own choices produce
*"oh… that's me"*?

### Added

- **The mirror** — five accumulating dimensions describing the self you are shaping.
  Nothing else in the project owns state.
- **The rail** — one gesture language. Scroll, swipe or arrow keys to move; tap, click or
  hold to choose. Holding repeats, so the lever can keep saying yes.
- **The avatar** — a small luminous figure built entirely from code, no model files. It
  reads every state dimension through scale, colour, clarity and posture.
- **The dopamine room** — a beautiful door standing beside the path. Pulling its lever is
  genuinely satisfying and the reward fades a little every time, while the cost does not.
  The door never says no. Walking past is a real choice, and once you are past it, it is
  final.
- **The turn and the reveal** — motion stops, sound falls away, and the camera comes around
  to meet the self you built.
- Synthesised sound with no audio files: the machinery clunks identically on every pull
  while the reward loses its brightness, and the turn is silent.

### Fixed

- Scroll sensitivity was roughly six times too high — two flicks of a trackpad completed
  the entire journey.
- Reward particles froze permanently in mid-air instead of fading out.
- The drained avatar became so dark it read as *lost* rather than *sad*. It now keeps a
  floor: diminished, but always clearly seen.
- Interface timing ran off the animation clock, so hints arrived late on slow devices.
- The glowing door was visible from the opening moment, giving away the destination before
  the visitor had taken a step.

## [0.0.1] — 2026-07-29

The plan.

### Added

- `docs/IMPLEMENTATION-PLAN.md`: the six open decision gates from the compendium resolved,
  three further questions answered (identity model, visitor counter, About section), the
  avatar state model that assigns each facet a dimension it owns, a phased build plan with
  a hard exit criterion per phase, and a live status board.
- A design-confirmation protocol: choices with a look, a feel or a pace are previewed and
  explicitly confirmed by a human before any phase counts as done.

[Unreleased]: https://github.com/daredavil01/the-second-self/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/daredavil01/the-second-self/releases/tag/v0.2.0
[0.1.0]: https://github.com/daredavil01/the-second-self/releases/tag/v0.1.0
[0.0.1]: https://github.com/daredavil01/the-second-self/releases/tag/v0.0.1
