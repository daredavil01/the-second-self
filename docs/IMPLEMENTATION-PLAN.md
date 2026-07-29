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

## 1. Decisions locked

| Area | Decision |
|---|---|
| **Identity** | **Anonymous forever.** No accounts, ever, for the core. All state in `localStorage`/IndexedDB, plus a "carry your self" export/import code for cross-device. |
| **Analytics / counter** | **GoatCounter** (free, cookieless, no personal data, ~3.5KB). Real numbers stay private; one understated line in About. No hero counter. |
| **About** | Four dedicated static pages: `/about/` · `/privacy/` · `/evidence/` · `/credits/`. |
| **Voice** | **Named personal byline** — "I built this because…", with a contact route. |
| **v1 scope** | **Spine only.** Journey + reveal + share card + peaceful place. No hub-as-curriculum, no 2D modules, no role lens. |
| **Tooling** | **Buildless Phase 0** (one HTML file, import maps), then **Vite + TypeScript** from Phase 0.5. |
| **3D assets** | **Procedural geometry in code.** No model files, no artist, no compression pipeline. |
| **Facets** | **All five** — fractured attention, information flood, dopamine loop, comparison corridor, notification storm. |
| **Gesture** | **Scroll to move, tap/hold to choose.** |
| **Ending** | **Continuous 5-dimension state vector, bucketed into ~8 named selves** on the card. |
| **Run length** | **6–7 minutes**, soft ~10 min cap on the return layer, delivered in character. |
| **Name / URL** | Keep "Second Self", ship on `daredavil01.github.io/the-second-self/`. |
| **Evidence page** | **Myth-busting subset first** (dopamine detox, goldfish attention span, filter bubbles, backfire effect), grown later. |
| **Toolkit / Part E** | Deferred until the spine ships and has real users. |
| **Working mode** | Solo, evenings and weekends, no deadline → phases sized to stand alone and be shippable independently. |

**Two trades, made deliberately and recorded so they stay visible:**

1. **Five facets at 6–7 minutes** buys full coverage of the argument at a measurable cost
   to completion and share-through — the compendium leans 4–5 min for shareability.
   Accepted.
2. **Splitting the gesture** (scroll to move, tap/hold to choose) gives up the thematic
   bite of "you scroll your way through a world about the cost of scrolling" in exchange
   for a clearer separation of travel from decision. Accepted.

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

## 4. Status board

Living tracker — update the status cell as each phase moves.

**Legend:** `⬜ Not started` · `🟡 In progress` · `✅ Done` · `⛔ Blocked` · `⏸️ Deferred`

| Phase | What it delivers | Status | Exit criterion met? |
|---|---|---|---|
| **0** — Prove the feeling | One HTML file, dopamine room, bare reveal | ⬜ Not started | — |
| **0.5** — Foundation | Vite + TS, Pages deploy, path guard, GoatCounter, `/privacy/` | ⬜ Not started | — |
| **1** — Core journey | All five rooms, accumulating state, the turn, the reveal, audio | ⬜ Not started | — |
| **2** — Share engine | End card, named selves, share sheet, link-back, replay | ⬜ Not started | — |
| **3** — Peaceful place | Hub, gallery, tend beat, soft cap, export code, `/about/` `/credits/` | ⬜ Not started | — |
| **4** — Evidence surface | `/evidence/` myth-busting subset, verified reference links | ⬜ Not started | — |
| **5+** — Toolkit | 2D modules, lesson engine, role lens, educator materials, Part E | ⏸️ Deferred | Gated on Phase 2 user evidence |

**Current position:** planning complete, no code written. Next action is Phase 0.

---

## 5. Phases

### Phase 0 — Prove the feeling (vertical slice) ⬜ Not started

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

**Exit criterion (hard gate).** Show it cold to 5–10 people. Does watching the avatar
change in response to *their own* choices produce "oh… that's me"? If not, redesign the
mirror before building anything else. Do not proceed on hope.

### Phase 0.5 — Foundation ⬜ Not started

Only after Phase 0 passes.

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

### Phase 1 — The core journey ⬜ Not started

- Four more rooms: `attention`, `flood`, `comparison`, `notifications`
- Accumulating state across all five, per the ownership table in §3
- The turn (motion stops, **silence** — it will hit harder than any music) and the full
  reveal
- The world reflects **either** trajectory — a careful player must arrive somewhere
  visibly different from a heedless one, or the reveal has no stakes
- Audio: synthesised Web Audio beds per room — escalating satisfaction on the lever, a
  muffled underwater wash in the flood, sharp fragmenting tones as attention breaks
- Pacing pass to land the whole run at 6–7 minutes

**Exit criterion.** An automated run asserts that an all-healthy and an all-heedless
playthrough end in materially different state vectors. This is the anti-railroad
guarantee, and both replay and the gallery depend on it.

### Phase 2 — The share engine ⬜ Not started

Arguably as important as Phase 1 for the advocacy goal — people share results, not
experiences.

- `src/share/card.ts` — offscreen-canvas composite of a WebGL snapshot + frame + name
- `src/share/naming.ts` — state vector → one of ~8 named selves ("The Steady One", "The
  One Who Kept Pulling"). Warm, specific, a little poetic. **Never a grade, never a
  number** — the number is the shame vector.
- Download plus `navigator.share`; frictionless link-back; Open Graph meta so the shared
  link previews well
- Immediate replay entry: "your Second Self could be different"

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

### Phase 4 — The About & evidence surface ⬜ Not started

- `/evidence/` with the myth-busting subset first, each card carrying its
  *established / contested / weak-or-debunked* tier label
- `/credits/` — the Part A prior-art list as `{title, creator, url, note, category}`
  records, the Apache-2.0 note, repo link, and a feedback route
- **Verify every reference URL before publishing.** The compendium explicitly flags its
  own link list as unchecked, and several of those projects have moved or retired.

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

## 6. Target file structure

```
index.html
src/
  main.ts          state.ts        rail.ts         avatar.ts
  rooms/           attention.ts  flood.ts  dopamine.ts  comparison.ts  notifications.ts
  scenes/          threshold.ts  turn.ts   reveal.ts    peaceful.ts
  share/           card.ts       naming.ts
  audio/           beds.ts
  storage/         local.ts      gallery.ts   portable.ts
about/ privacy/ evidence/ credits/     (plain static HTML, outside the canvas)
docs/IMPLEMENTATION-PLAN.md
.github/workflows/deploy.yml
```

The four content pages sit **outside** the 3D canvas deliberately: fast, linkable,
indexable, and they cost no WebGL.

---

## 7. Verification

- **Phase 0 is a human test, not a code test** — 5–10 cold users, one question.
- `npm run dev` locally; then `npm run build && npm run preview` **with the base path
  set** — subpath breakage does not reproduce on a dev server.
- CI: relative-path guard · branch-divergence assertion (Phase 1) · Playwright smoke run
  driving the rail end-to-end and asserting the reveal renders.
- Deploy to Pages, then open the live subpath URL on a real mid-range Android.
- Link-check every reference before `/evidence/` or `/credits/` ships.

---

## 8. Deliberate departures from the compendium

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
   Chosen for coverage over shareability — recorded here so the trade stays visible if
   completion rates disappoint.
