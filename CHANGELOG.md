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

Phase 1 — the core journey, and Phase 2 — the share engine. There is a whole road now,
with all five rooms standing along it; what you meet at the end of it is the sum of what
you did on the way, it has a name, and you can take it with you.

**The design confirmation gates D1–D9 are all still open, and Phase 0's cold-user test has
not been run.** Everything below is built and previewable, not signed off. The eight names
in particular are a first draft awaiting review as a plain list, per gate D8.

### Added

- **Your second self is given a name.** The reveal now names what you built, in one line,
  as a characterisation rather than a verdict — "The One Who Kept Pulling", "The Steady
  One", "The One Who Said Yes to Everything". Eight of them: one for each room that got
  more of you than the others, one for taking nothing much, one for taking a little
  everywhere, and one for taking all of it. There is no score, no percentage and no count
  anywhere in it. A test asserts that no name and no line ever carries a digit, and that
  none of them contains the vocabulary of a report card.
- **A card you can keep or send on.** A portrait of your avatar as it finally stood,
  composed with the name, the quiet line, and the address of this place for whoever you
  send it to. It goes to the native share sheet where there is one and to the downloads
  folder where there is not. Composed entirely in your own browser — nothing is uploaded,
  and there is no server to upload it to.
- **The ending arrives one beat at a time.** The name lands alone and is left alone for a
  moment; the line follows; only then is anything asked of you. The dark gathers under the
  words as they come in — on a phone the avatar fills most of the frame, and a run that
  kept its light puts a large bright body exactly where the name has to go.
- **A way back that means it.** "your second self could be different", offered next to the
  door, and taking it clears everything — state, card and all.
- **A link preview.** A shared link now unfurls with a title, a description and an image
  rather than as a grey box. The image is a small warm figure alone in a dark field,
  drawn arithmetically by `npm run og` — there is no text in it, because restraint is the
  aesthetic and the words are right beside it in the preview.
- **`npm run cards`** renders three cards from three genuinely different runs, which is
  the artifact gate D9 asks to be shown.

- **Fractured attention.** A road of light plates, whole and continuous, with bright shards
  buzzing beside it. Chase one and it flares, the camera is pulled off the road with it,
  and a plate you were about to walk on breaks and slides away. The horizon closes in a
  little further each time. There are eight shards and no more — the point is not that
  distraction is bottomless, it is what each one costs you of the road ahead.
- **The information flood.** Luminous water you are standing ankle-deep in, carrying
  headlines you never quite read. Take in one more and it rises. It never recedes: you can
  stop adding to it, but the level you are standing in is the one you chose. It stops at
  the chest rather than over your head, because a figure you cannot see is a mirror
  showing nothing.
- **The comparison corridor.** Taller, glossier figures on plinths down both sides, each
  frozen in one flawless moment, each lit brighter than you are. Stop and look and it
  glows; you dim and shrink. Each will hold you twice — a third look at the same frozen
  moment is not comparison any more, and the room sends you on.
- **The notification storm.** A clearing that starts pinging. Answer them and they arrive
  faster and the space never settles. Ignore them and the storm crests, holds, and breaks
  on its own. It is the last room before the turn and the only place in the piece where
  doing nothing is visibly rewarded — so the silence at the turn lands as relief for one
  kind of player and as an ambush for the other.
- **A bed for every room**, synthesised and cross-fading by how near you are: brittle
  beating tones in the attention road, everything heard from underneath the flood, warm
  generosity at the lever, a high polished chord slightly out of tune with itself in the
  corridor, and a tremolo that will not sit still in the storm. And then, at the turn,
  nothing.
- **`?room=` and `?pace=`.** Start beside one room, or run the whole journey faster, so a
  single room can be looked at without replaying the six minutes in front of it. Neither
  changes anything for a visitor who arrives without them.
- **A browser that cannot draw the world now says so.** WebGL is missing or blocked more
  often than a desktop makes it look — old Android, a locked-down work profile, a
  blacklisted GPU driver — and the page used to fail to a black rectangle that a visitor
  could not tell from something still loading. It now explains itself in one line, suggests
  another browser or device, and keeps the privacy promise reachable.
- An **anti-railroad test**: two full playthroughs, driven end to end through real input,
  differing only in whether the player takes what is offered — and asserting they arrive
  somewhere materially different on every one of the five dimensions. Plus a per-room check
  that each facet moves only the dimensions it owns, all five rooms now included.

### Changed

- **The journey has a floor pace, and scrolling harder no longer shortens it.** Before, the
  whole track was two trackpad flicks: rooms streamed past before any of them could land.
  Input now banks rather than piling up, so a push always registers and always coasts to a
  stop, but walking speed is the one thing the player does not get to negotiate — which is
  also, quietly, the argument. Pure travel is around two minutes forty; an engaged run
  should land at six or seven minutes, which is what gate D6 is for.
- **What each room costs has been rebalanced across all five together.** Taking everything
  everywhere used to pin all five dimensions at their maximum, and a saturated self has no
  shape — you could not tell which facets were the ones that got you, which is the whole
  reason each facet owns a dimension. A moderate run now lands mid-range on each.
- Each room's furniture is confined to its own stretch of track. Previously the corridor's
  last figure stood in the middle of the storm and the attention road ran through the
  flood, so five rooms that read fine individually read collectively as one junk drawer.
- The hint that names the verb ("tap it") is now offered once, at whichever room you reach
  first, and never again once you have used it anywhere.
- **The keyboard reaches the ending.** The rail listens for the space bar on the whole
  window, which meant it swallowed the press meant for whichever button was focused. It
  now leaves the ending's own controls alone.

### Fixed

- The world took a step backwards at the very first frame, before the player had touched
  anything. The first animation-frame timestamp can predate the moment the page finished
  setting itself up, so the first frame's elapsed time was negative — which the old easing
  absorbed and the new speed cap faithfully acted on.
- Two taps landing inside a single frame could spend the same shard, or admire the same
  corridor figure, twice — pushing a room past its own limit. What is under your thumb is
  now worked out at the moment you tap rather than when the frame was last drawn, so on a
  slow device a flurry of taps takes the next shard and the next figure instead of being
  quietly thrown away. On a weak phone the room used to go dead in your hand.
- **The turn no longer drags on a slow device.** It was paced off the animation clock,
  which is deliberately capped so a backgrounded tab does not lurch — and on a phone
  rendering at five frames a second that capped clock runs at a third of wall time,
  stretching a three-and-a-half-second camera move to fourteen seconds with nothing
  happening. The turn and the ending now run on the interface clock, which keeps step with
  the wall but still cannot be skipped by leaving the tab in the background.
- **The longest name used to write itself through the link at the foot of the card.** The
  words flowed downwards from the portrait, so a name that wrapped onto two lines pushed
  the line under it into the address — and the name that did this was, of course, the one
  belonging to the heaviest run. The words now sit in a fixed band sized for the worst
  case, which also means the name lands at the same height on every card.
- The portrait on the card was framed so close that the avatar filled it like a lamp,
  leaving the one thing the card exists to show — how much of the figure is left — with
  nowhere to be small in.

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
