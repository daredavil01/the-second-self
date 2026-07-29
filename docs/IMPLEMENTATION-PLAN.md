# Second Self — Phased Implementation Plan

*Companion to `second-self-master-compendium.md`. The compendium is the design and
research source of truth; this document is the build plan and the live status tracker.*

---

## Context

The compendium (1,154 lines, Parts A–F) is a complete design and research document with
**zero code written**. It locks four decisions — modular toolkit · 3D reserved for
emotional peaks · all four roles · static vanilla HTML/JS + Three.js on GitHub Pages —
and leaves six open in its §12 decision-gate register.

This document resolves those six open gates, plus three further questions (identity
model, visitor counter, About section), and turns the compendium's design phases into an
engineering plan with concrete deliverables, file paths, and a hard exit criterion per
phase.

The north star is unchanged and governs every decision below: **awareness, not shame** —
and *peace is offered, never earned*.

---

## 1. Decisions taken — pending visual confirmation

These were decided in discussion. **They are directional, not final.** Anything that has
a look, a feel, or a pace cannot honestly be settled from a description — it gets
**previewed first and explicitly confirmed after**, per the protocol in §4.

Rows marked **structural** are architecture and can be relied on now. Rows marked
**experiential** are provisional until previewed and signed off.

| Area | Decision | Kind |
|---|---|---|
| **Identity** | **Anonymous forever.** No accounts, ever, for the core. All state in `localStorage`/IndexedDB, plus a "carry your self" export/import code for cross-device. | structural |
| **Analytics / counter** | **GoatCounter** (free, cookieless, no personal data, ~3.5KB). Real numbers stay private; one understated line in About. No hero counter. | structural |
| **About** | Four dedicated static pages: `/about/` · `/privacy/` · `/evidence/` · `/credits/`. | structural |
| **Voice** | **Named personal byline** — "I built this because…", with a contact route. | experiential |
| **v1 scope** | **Spine only.** Journey + reveal + share card + peaceful place. No hub-as-curriculum, no 2D modules, no role lens. | structural |
| **Tooling** | **Buildless Phase 0** (one HTML file, import maps), then **Vite + TypeScript** from Phase 0.5. | structural |
| **3D assets** | **Procedural geometry in code.** No model files, no artist, no compression pipeline. | structural |
| **Facets** | **All five** — fractured attention, information flood, dopamine loop, comparison corridor, notification storm. | structural |
| **Gesture** | **Scroll to move, tap/hold to choose.** | experiential |
| **Ending** | **Continuous 5-dimension state vector, bucketed into ~8 named selves** on the card. | experiential |
| **Run length** | **6–7 minutes**, soft ~10 min cap on the return layer, delivered in character. | experiential |
| **Name / URL** | Keep "Second Self", ship on `daredavil01.github.io/the-second-self/`. | structural |
| **Evidence page** | **Myth-busting subset first** (dopamine detox, goldfish attention span, filter bubbles, backfire effect), grown later. | structural |
| **Toolkit / Part E** | Deferred until the spine ships and has real users. | structural |
| **Working mode** | Solo, evenings and weekends, no deadline → phases sized to stand alone and be shippable independently. | — |

**Two trades, made deliberately and recorded so they stay visible:**

1. **Five facets at 6–7 minutes** buys full coverage of the argument at a measurable cost
   to completion and share-through — the compendium leans 4–5 min for shareability.
   Accepted, and re-tested against a timed playthrough at the Phase 1 confirmation gate.
2. **Splitting the gesture** (scroll to move, tap/hold to choose) gives up the thematic
   bite of "you scroll your way through a world about the cost of scrolling" in exchange
   for a clearer separation of travel from decision. Accepted, and re-tested on a real
   phone at the Phase 0 confirmation gate — the compendium itself says to check the
   gesture feels good in 3D on a phone before locking it.

---

## 2. Why anonymous, and what it costs

Dollar cost is ~$0 either way at this scale. The deciding factors were elsewhere.

| | Anonymous only | Accounts |
|---|---|---|
| Hosting | $0 (GitHub Pages) | $0 → Supabase free tier = 50k MAU / 500MB / 2 projects, **paused after 7 days idle**; Pro $25/mo |
| Legal | No personal data → no DPA, no cookie banner, trivial privacy notice | **Data controller**: privacy policy, lawful basis, deletion and export requests |
| Minors | Non-issue | **The blocker.** Audience includes students and parents → GDPR Art. 8 consent, COPPA, UK Age-Appropriate Design Code |
| Security | No attack surface | Password reset, account takeover, breach liability, ongoing patching |
| Product | Zero-friction share — the growth engine | A signup wall between the link and the experience |
| Thesis fit | *Is* the message (Part A §13.5, "visible on-device privacy promise") | Contradicts Part A §4 "frictionless entry" head-on |

**What anonymous genuinely costs:** no cross-device sync, clearing browser data wipes the
gallery, no educator class management, no email contact. The first two are solved by the
export code in Phase 3 — state serialised to a short string / JSON file, pasted on
another device. Zero backend, no personal data.

**If educator group management is ever pulled in**, the shape that avoids storing any
minor's data is **teacher-only accounts; students join with a class code and a
self-chosen alias.** Nothing in Phases 0–4 assumes a server, so this bolts on without a
rewrite.

**If accounts ever ship, store only:** opaque user ID · email (only if magic-link is the
auth) · role · module completions (id + timestamp) · avatar-state JSON (~200 bytes, not
images) · created/last-seen.
**Never:** real name, date of birth, school, any real screen-time data, IP logs,
third-party analytics cookies. Journal entries stay local-only or client-side encrypted.

### On the visitor counter

Options considered: GoatCounter (free non-commercial, cookieless, public API);
Cloudflare Web Analytics (free, cookieless, dashboard only); a self-built counter on
Cloudflare Workers — which must use **Durable Objects** (100k req/day free), **not KV**,
whose free tier allows only **1,000 writes/day**; and badge APIs like Hits.sh, which are
trivially spoofable.

The design question outranks the tech. This project cites Grosser's *Demetricator* —
removing metrics *as the intervention*. A hero-sized visitor count on a piece critiquing
engagement metrics is self-refuting. Hence: real numbers privately via GoatCounter, one
quiet line in `/about/`, and no count anywhere in the experience itself.

---

## 3. The avatar state model (the spine of everything)

The compendium's rule — *each facet moves one or two dimensions, not all* — is what makes
the mirror legible instead of merely a mood. With five facets and the five candidate
dimensions, each facet gets a dimension it **owns**:

| Facet | Primary dimension (owned) | Secondary |
|---|---|---|
| Fractured attention | **Clarity** — sharp → coming apart at the edges | world: draw distance closes in |
| Information flood | **Posture / motion** — fluid → heavy, wading | clarity |
| Dopamine loop | **Colour / light** — luminous → drained | scale |
| Comparison corridor | **Scale** — present → diminished | colour |
| Notification storm | **World response** — settled → never settles | posture |

`state.ts` holds one object of five floats in `0..1`. Every room writes to it; the avatar
renderer and the end card both read from it; nothing else owns state. This is the single
most important file in the project.

**Hard constraint:** the avatar at its worst is *diminished, foggy and small* — never
grotesque. Sad-but-recognisable invites empathy; grotesque invites distance.

---

## 4. Design confirmation protocol

**The rule: no experiential design choice is final until it has been previewed and
explicitly confirmed.** A menu selection is a direction; a preview is the decision. This
exists because the whole project rests on how something *feels*, and feel does not
survive being described in prose.

**How it works, every time:**

1. The choice is built to a previewable state — deployed to the Pages URL, or a set of
   stills, or a short screen capture, whichever actually shows the thing.
2. It gets reviewed **on a real phone** as well as desktop, since mobile is the primary
   target and the compendium treats it as a hard constraint.
3. Confirmation is **explicit and recorded** — the row below is ticked with the date.
   Silence is not confirmation, and no choice is ever self-approved on the builder's side.
4. If it doesn't land, it changes. Reversing a confirmed-in-principle decision at its
   preview gate is a normal outcome, not a failure — that is what the gate is for.
5. **A phase cannot be marked ✅ Done while any of its design rows are unconfirmed.**

| # | Design choice awaiting confirmation | Previewed as | Gate | Confirmed |
|---|---|---|---|---|
| D1 | Core gesture feel — scroll to move, tap/hold to choose | Live build, on your own phone | Phase 0 | ⬜ |
| D2 | Avatar visual language | Stills at min and max of each of the five dimensions | Phase 0 | ⬜ |
| D3 | Palette and overall tone | Live build | Phase 0 | ⬜ |
| D4 | The reveal beat — camera turn, silence, timing | Screen capture of the turn | Phase 0 | ⬜ |
| D5 | Each of the five room designs, one at a time | Live build, room by room — `?room=attention` · `flood` · `dopamine` · `comparison` · `notifications` | Phase 1 | ⬜ |
| D6 | Run pacing at 6–7 minutes | Timed full playthrough, no query string | Phase 1 | ⬜ |
| D7 | Audio beds, and the silence at the turn | Capture with sound | Phase 1 | ⬜ |
| D8 | The ~8 named selves — exact wording, **including the fully-diminished one** (see §5) | Plain list, reviewed before it is wired in — the eight live alone in `src/share/naming.ts`, so rewriting all of them touches no mechanism | Phase 2 | ⬜ |
| D9 | End-card layout | Rendered cards from three different runs — `npm run cards` | Phase 2 | ⬜ |
| D10 | Peaceful place register — warmth, pace, ambience | Live build | Phase 3 | ⬜ |
| D11 | Gallery presentation — ambient, not a completion grid | Live build with several saved selves | Phase 3 | ⬜ |
| D12 | About / privacy / credits copy in your named voice | Draft copy, before it is published | Phase 3 | ⬜ |
| D13 | Evidence-page tier presentation | Draft page | Phase 4 | ⬜ |

Structural decisions in §1 are **not** in this table — they are architecture, they were
reasoned rather than felt, and the build depends on them being stable. Changing one is a
replan, not a preview note.

---

## 5. Status board

Living tracker — update the status cells as each phase moves.

**Legend:** `⬜ Not started` · `🟡 In progress` · `✅ Done` · `⛔ Blocked` · `⏸️ Deferred`

| Phase | What it delivers | Status | Design confirmed | Exit criterion met? |
|---|---|---|---|---|
| **0** — Prove the feeling | One HTML file, dopamine room, bare reveal | 🟡 In progress — built, awaiting your preview | ⬜ D1–D4 | ⬜ cold-user test not yet run |
| **0.5** — Foundation | Vite + TS, Pages deploy, path guard, GoatCounter, `/privacy/` | ✅ Done | n/a | ✅ build + guards + smoke tests green |
| **1** — Core journey | All five rooms, accumulating state, the turn, the reveal, audio | ✅ Done — engineering complete and verified | ⬜ D5–D7 still open | ✅ anti-railroad gate green |
| **2** — Share engine | End card, named selves, share sheet, link-back, replay | 🟡 In progress — built, awaiting your preview | ⬜ D8–D9 | — |
| **3** — Peaceful place | Hub, gallery, tend beat, soft cap, export code, `/about/` `/credits/` | ⬜ Not started | ⬜ D10–D12 | — |
| **4** — Evidence surface | `/evidence/` myth-busting subset, verified reference links | ⬜ Not started | ⬜ D13 | — |
| **5+** — Toolkit | 2D modules, lesson engine, role lens, educator materials, Part E | ⏸️ Deferred | — | Gated on Phase 2 user evidence |

**Current position:** Phase 1 was **closed on 2026-07-29 at the builder's instruction**
("complete phase 1"), with its engineering complete and verified: the whole journey runs,
the exit criterion is met, and the suite is green on desktop and mobile.

**It was closed with D5–D7 open, which the protocol in §4 does not allow.** That is
recorded here rather than smoothed over, because the rule exists for a reason and this is
the second time the phase order has been broken. What "✅ Done" means for Phase 1 is
narrower than it looks:

- ✅ **Engineering** — five rooms, accumulating state, the turn, the reveal, per-room audio,
  the pacing pass, a graceful failure where the world cannot be drawn. Build, path guard,
  size budget and 34 tests green on desktop and mobile.
- ✅ **Exit criterion** — an automated pair of playthroughs proves the two trajectories end
  somewhere materially different on every dimension.
- ⬜ **Design confirmation** — D5, D6 and D7 have not been previewed. Nobody has walked the
  finished journey end to end, timed it, or heard it. Phase 0's D1–D4 and its 5–10 person
  cold-user test are also still owed.

**So Phase 1 is done as a piece of software and unproven as a piece of design.** The
outstanding gates are cheaper to run than they were — `?room=<name>` starts you beside any
single room, which is exactly the "one at a time" review D5 asks for — and if any of them
comes back badly, reopening this row is the correct outcome, not a regression.

**On saturation — reviewed 2026-07-29, kept as built.** Costs are calibrated so that a run
of roughly seven takes per room lands each dimension near 0.6 — mid-range, with shape. But
three of the rooms are deliberately unbounded (the lever never says no, the flood always
accepts one more, the storm keeps pinging), so a player who taps hard enough pins all five
at their maximum and arrives at the same self as every other such player. That stands: it
is the honest outcome for someone who takes everything on offer, and capping it would mean
either the lever saying no or the cost per pull decaying — and the dopamine room exists
precisely because the reward decays while the cost does not.

The consequence lands in Phase 2, not here: **one of the ~8 named selves must be the
fully-diminished one**, and it has to be written as a characterisation rather than a
verdict, like every other name. Re-examined at D8.

**Phase 2 was then started on 2026-07-29 at the builder's instruction** ("start with phase
2"), with D1–D7 and the cold-user test still outstanding — which §4 does not allow either,
and which is recorded here for the same reason as above. The share engine is built and
previewable; **D8 and D9 are open and nothing in it is signed off.**

D8 in particular was honoured as far as it can be without blocking: the eight names live
alone in `src/share/naming.ts` with nothing else in the file, so reviewing them as a plain
list and rewriting every one of them is a single-file edit that touches no mechanism. They
are a first draft, not a proposal to accept.

---

## 6. Phases

### Phase 0 — Prove the feeling (vertical slice) 🟡 In progress

The riskiest assumption in the entire project is *does the mirror moment land*. Nothing
else matters until it does. **Literally one HTML file**, Three.js via import map, no
build step, no repo ceremony.

- `index.html` — canvas plus a minimal DOM overlay
- `src/state.js` — the five-float mirror object with a tiny pub/sub. **Write this
  properly even here** — everything downstream reads it.
- `src/rail.js` — normalises wheel + touch + arrow keys into a single `progress: 0..1`,
  and exposes a separate `choose()` channel for tap/hold
- `src/avatar.js` — procedural luminous figure rendering the five dimensions
- `src/rooms/dopamine.js` — the lever room. Chosen first because it is the most
  self-contained and its mirror is the most immediate.
- A bare reveal: motion stops, silence, the camera comes around

**Preview & confirm (D1–D4).** Before anyone else sees it: you play the build on your own
phone and desktop, and confirm the gesture, the avatar's visual language, the palette,
and the reveal beat — or send them back. Nothing proceeds to Phase 0.5 on unconfirmed
design.

**Exit criterion (hard gate).** *Then* show it cold to 5–10 people. Does watching the
avatar change in response to *their own* choices produce "oh… that's me"? If not, redesign
the mirror before building anything else. Do not proceed on hope.

### Phase 0.5 — Foundation ✅ Done

Only after Phase 0 passes both gates.

- Vite + TypeScript, `base: '/the-second-self/'`, GitHub Actions `actions/deploy-pages`
- **Relative-path CI guard** — fail the build on any `src="/…"` or `url(/…)`. The
  compendium names absolute paths as the single most common way a Pages deployment
  breaks, and it does not reproduce on a dev server.
- `secondself:*` namespacing on all storage keys — the Pages origin is shared across
  every project under `daredavil01.github.io`
- `prefers-reduced-motion` honoured from the first commit, not retrofitted
- Performance budget, with a real mid-range Android in the loop
- The GoatCounter snippet and `/privacy/` ship **together**, so the promise is live on
  the first public deploy

**As built**, with two deliberate refinements:

- `base: './'` rather than a hard-coded `'/the-second-self/'`. Both fix the subpath
  problem; relative additionally survives a custom domain, a user page, or a local
  `vite preview` with no config change. `scripts/check-paths.mjs` enforces it against the
  built output and has been verified to fail on a deliberately broken build.
- **Three.js moved from `vendor/` to an npm dependency.** Vite bundles it first-party, so
  the no-third-party-request property that motivated vendoring is preserved, and version
  updates become `npm update` instead of a manual copy.
- Analytics is **off unless `VITE_GOATCOUNTER` is set**, and obeys Do Not Track and
  Global Privacy Control before making any request. A fork of this repo is silent by
  default. A smoke test asserts the page makes no third-party request at all.
- The performance budget is measured **gzipped**, since that is what a phone on mobile
  data actually pays. Current: **139KB of a 300KB ceiling.**

Purely structural — no design confirmation gate. Its value is that from here on, every
subsequent preview is a real deployed URL you can open on any device.

### Phase 1 — The core journey ✅ Done (engineering) · ⬜ D5–D7 open

- Four more rooms: `attention`, `flood`, `comparison`, `notifications`
- Accumulating state across all five, per the ownership table in §3
- The turn (motion stops, **silence** — it will hit harder than any music) and the full
  reveal
- The world reflects **either** trajectory — a careful player must arrive somewhere
  visibly different from a heedless one, or the reveal has no stakes
- Audio: synthesised Web Audio beds per room — escalating satisfaction on the lever, a
  muffled underwater wash in the flood, sharp fragmenting tones as attention breaks
- Pacing pass to land the whole run at 6–7 minutes

**Preview & confirm (D5–D7).** Rooms go to preview **one at a time**, not as a batch — a
weak room is far cheaper to find alone than buried in a finished journey. Then a timed
end-to-end playthrough confirms the 6–7 minute pacing decision, which is the point at
which the five-facet trade in §1 gets honestly re-examined.

**Exit criterion.** An automated run asserts that an all-healthy and an all-heedless
playthrough end in materially different state vectors. This is the anti-railroad
guarantee, and both replay and the gallery depend on it.

**As built**, with four things worth knowing:

- **Room order is attention → flood → dopamine → comparison → notifications**, the way the
  argument escalates, with the storm last on purpose: it is the only room that rewards
  doing nothing, so the silence at the turn arrives as relief for one kind of player and as
  an ambush for the other.
- **The rail has a floor pace.** Progress is speed-capped and input banks rather than
  piling up, so scrolling harder no longer collapses the journey into two flicks. Roughly
  two minutes forty of pure travel before a second is spent in a room.
- **`?room=<name>` and `?pace=<n>`** are preview affordances, not mechanics. They let a
  single room be looked at without replaying everything in front of it, which is what this
  phase's confirmation protocol asks for. Neither changes anything for a visitor who
  arrives without them.
- **Rooms are staged against each other**, each confined to a shared body budget, with a
  breath of empty world between. Built one at a time they overlapped badly — see
  [`LESSONS.md`](../LESSONS.md) L15.
- **Two clocks, and the turn is on the interface one.** Anything that gates what comes next
  is paced against the wall rather than against the dt-capped animation accumulator, or it
  runs slow on a weak device — the turn stretched from under four seconds to fourteen at
  five frames a second. See [`LESSONS.md`](../LESSONS.md) L19.
- **A graceful failure where there is no WebGL**, rather than a black rectangle nobody can
  tell from a slow load. The floor of the accessibility line in *Cross-cutting*, below.

### Phase 2 — The share engine 🟡 In progress

Arguably as important as Phase 1 for the advocacy goal — people share results, not
experiences.

- `src/share/card.ts` — offscreen-canvas composite of a WebGL snapshot + frame + name
- `src/share/naming.ts` — state vector → one of ~8 named selves ("The Steady One", "The
  One Who Kept Pulling"). Warm, specific, a little poetic. **Never a grade, never a
  number** — the number is the shame vector.
- Download plus `navigator.share`; frictionless link-back; Open Graph meta so the shared
  link previews well
- Immediate replay entry: "your Second Self could be different"

**Preview & confirm (D8–D9).** The eight names are reviewed as a **plain list before any
of them are wired in** — this is the highest-risk copy in the project, because a single
name that reads as a verdict rather than a characterisation reintroduces the shame the
whole design exists to avoid. Then rendered cards from three genuinely different runs
confirm the layout.

**As built**, with five things worth knowing:

- **The eight are one lightest, five leans, one middle, one heaviest.** The vector is read
  for its *shape*, not its size: a run where one dimension stands clearly above the other
  four is named for the room that did it; a run with no lean is named for having no lean.
  The lightest and the heaviest are two of eight written in the same voice, not a top and a
  bottom of a scale.
- **Nothing on the card is a number**, and this is enforced rather than intended: a test
  asserts no name or line contains a digit, and none of them contains the vocabulary of a
  report card (score, rank, grade, healthy, worse, should…).
- **The card is composed off-screen at 1080×1350**, from a portrait render target rather
  than a grab off the visible canvas — so it does not depend on the shape of the player's
  window and does not cost every visitor `preserveDrawingBuffer` for a feature at most one
  of them reaches. It is built the moment the reveal settles, not when the button is
  pressed: Safari refuses `navigator.share()` if anything is awaited first.
- **Open Graph tags carry the only absolute URLs in the project**, because no unfurler
  resolves a relative `og:image` and there is no server here to rewrite one. The image is
  drawn arithmetically by `npm run og` with no dependencies and committed; everything else
  stays relative.
- **`npm run cards`** renders the D9 artifact — three cards from three genuinely different
  runs, in about twenty seconds. It exists because the names and the layout will change at
  least once, and a gate that is cheap to re-run is a gate that gets re-run. It also earned
  its keep immediately: it found a layout bug ([LESSONS L20](../LESSONS.md)) that every
  existing assertion passed straight over.

**Two things the cards made visible are avatar work, not card work, and were deliberately
left alone** rather than self-approved under D2: at full fog the clarity shell reads as a
hard-edged capsule *around* the figure rather than as edges coming apart, and stray room
furniture floats in the far background of some portraits. Both belong to that gate.

### Phase 3 — The peaceful place & return layer ⬜ Not started

- `src/scenes/peaceful.ts` — perpetual soft night, stars always visible, light moving on
  water, generative ambience that never loops mechanically. **Never gated on "good"
  choices** — everyone arrives; only the state they arrive in differs.
- Gallery of past selves in IndexedDB, surfaced ambiently (lanterns on the water), not as
  a completion grid
- The "tend" beat — recovery made physical: fog clears, colour returns, posture
  straightens
- Soft ~10 minute cap, delivered in character by the place itself
- **"Carry your self" export/import code** — the cross-device answer with no backend
- `/about/` and `/credits/` ship here

**Preview & confirm (D10–D12).** The peaceful place is confirmed by sitting in it, not by
looking at a screenshot — warmth and pace are the entire point. The About copy is
confirmed as draft text before publication, because it goes out under your name.

### Phase 4 — The About & evidence surface ⬜ Not started

- `/evidence/` with the myth-busting subset first, each card carrying its
  *established / contested / weak-or-debunked* tier label
- `/credits/` — the Part A prior-art list as `{title, creator, url, note, category}`
  records, the Apache-2.0 note, repo link, and a feedback route
- **Verify every reference URL before publishing.** The compendium explicitly flags its
  own link list as unchecked, and several of those projects have moved or retired.

**Preview & confirm (D13).** Draft page reviewed before publication — the tier labels are
a public credibility claim and need to read as honest rather than hedging.

### Phase 5+ — Deferred, documented, not scheduled ⏸️ Deferred

The 2D module library, the content-as-data lesson engine, the role lens, educator
materials, and the Echo-Chamber Exit module (Part E) all wait on evidence that the spine
lands with real users. A backend is needed only for educator group management, and stays
isolated behind that one gate.

### Cross-cutting, every phase

- **Accessibility** — keyboard-navigable, `prefers-reduced-motion`, and a graceful
  lower-fidelity fallback for weak devices
- **Performance** — verified on a real mid-range phone, not a desktop throttle
- **The shame audit** — no numbers on the card, sad-not-monstrous avatar, and always a
  door open to a better run

---

## 7. Target file structure

```
index.html
src/
  main.ts          state.ts        rail.ts         avatar.ts       audio.ts
  rooms/           types.ts  attention.ts  flood.ts  dopamine.ts  comparison.ts  notifications.ts
  scenes/          threshold.ts  turn.ts   reveal.ts    peaceful.ts
  share/           card.ts       naming.ts
  storage/         local.ts      gallery.ts   portable.ts
public/            og.png        (generated by scripts/make-og.mjs, committed)
scripts/           check-paths.mjs  check-size.mjs  make-og.mjs  cards.mjs
about/ privacy/ evidence/ credits/     (plain static HTML, outside the canvas)
docs/IMPLEMENTATION-PLAN.md
.github/workflows/deploy.yml
```

Two departures from the sketch above, both settled by what actually got built. Audio is one
file rather than an `audio/` directory — there is no library, only synthesis, and splitting
it buys nothing. And the threshold, the turn and the reveal are beats in `main.ts` rather
than files in `scenes/`: they are three camera states on one continuous journey, not
separate scenes, and giving them their own modules would only spread one loop across four
files. `scenes/peaceful.ts` still lands in Phase 3, where it genuinely is a separate place.

`rooms/types.ts` is the room contract — what every room is, how far an offer reaches, how
much world a room may occupy, and the two things a room may ask of the world outside it.

The four content pages sit **outside** the 3D canvas deliberately: fast, linkable,
indexable, and they cost no WebGL.

---

## 8. Verification

- **Phase 0 has two gates and they are not the same thing** — the design confirmation
  (§4, you) comes first, the "that's me" test (5–10 cold users) comes second.
- `npm run dev` locally; then `npm run build && npm run preview` **with the base path
  set** — subpath breakage does not reproduce on a dev server.
- CI: relative-path guard · branch-divergence assertion (Phase 1) · Playwright smoke run
  driving the rail end-to-end and asserting the reveal renders.
- Deploy to Pages, then open the live subpath URL on a real mid-range Android. From
  Phase 0.5 on, this deployed URL *is* the preview mechanism for every confirmation gate.
- Link-check every reference before `/evidence/` or `/credits/` ships.

---

## 9. Deliberate departures from the compendium

1. **Vite from Phase 0.5, instead of buildless throughout.** This does not break the
   "static vanilla HTML/JS + Three.js on GitHub Pages" lock — the output is still static
   files with no framework runtime and no server. It buys base-path correctness, asset
   hashing, and types on the state machine. Phase 0 stays genuinely buildless, exactly as
   the compendium describes.
2. **A hand-rolled `rail.ts` instead of GSAP + ScrollTrigger.** ScrollTrigger is built for
   scroll-linked DOM documents; this is a fixed canvas driven by an abstract progress
   value. Roughly 60 lines, no CDN dependency, and keyboard accessibility falls out for
   free.
3. **Five facets at 6–7 minutes**, rather than the compendium's recommended three at 4–5.
   Chosen for coverage over shareability — recorded here so the trade stays visible, and
   re-examined at the D6 confirmation gate against a timed playthrough.
