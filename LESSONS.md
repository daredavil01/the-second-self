# Lessons

What was asked for, what went wrong, and what we learned. Part 1 is the distilled set of
rules — that is the part [`CLAUDE.md`](CLAUDE.md) points at, and the part worth reading
before you change anything. Part 2 is the log the rules came from.

Add an entry whenever a non-obvious bug is fixed or a new rule emerges. If it took more
than one attempt to understand, it belongs here.

---

## Part 1 — Rules learned the hard way

### Craft

1. **Derive input sensitivity from a target total travel; never guess it.** Pick how much
   physical scrolling the whole journey should cost, then divide. → [L4](#l4)
2. **Keep two clocks.** Cap `dt` for animation so a backgrounded tab does not jump, but
   never pace interface timing off that capped accumulator — on a slow device it silently
   runs behind wall time. **If a beat gates what comes next, it belongs on the interface
   clock no matter how much it looks like an animation**, and that clock needs its own,
   looser cap: tight enough that a background tab cannot skip the beat, loose enough that a
   weak device keeps step. → [L5](#l5) · [L19](#l19)
3. **Every decaying effect needs an explicit terminal state**, not just a decay curve. A
   value that merely approaches zero will sit visible forever. → [L6](#l6)
4. **The worst state must still be clearly legible.** A mirror you cannot see shows
   nothing. Diminished, foggy and small — never swallowed by the dark. → [L7](#l7)
5. **Progressive disclosure has to be enforced in code, not merely intended.** A calm,
   near-empty opening is undone by one glowing object visible from the first frame. → [L9](#l9)
6. **Make the alternative a real choice, not a postponement.** If the interactive window
   never closes, walking past costs nothing and is not a decision. → [L8](#l8)
7. **Rooms are staged against each other, never one at a time.** Each one gets a budget of
   world and stays inside it, or five pieces that individually read fine collectively read
   as a junk drawer. → [L15](#l15)
8. **A cost scale is only meaningful where it does not saturate.** If taking everything
   pins every dimension at its maximum, the outcome has no shape and the thing you spent
   all that effort making legible is invisible. → [L16](#l16)
9. **Re-resolve the target at the moment of the action; do not merely re-check a cached
   one.** A "what's under your thumb" pointer computed once per frame can be spent twice
   inside it — and a guard that turns the extra taps into *no* action has moved the bug,
   not fixed it. → [L17](#l17)
10. **When you tighten a control loop, re-derive what its inputs are allowed to be.** A
    forgiving filter silently absorbs malformed input; the tighter thing that replaces it
    acts on it faithfully. → [L18](#l18)
11. **A layout is only tested by its worst content, and the worst content is never the
    default one.** Lay out for the longest string, then check that the shortest still
    looks deliberate — not the other way round. → [L20](#l20)
12. **When the subject is how much of something is left, the frame has to include what it
    is measured against.** Filling the frame with the thing destroys the comparison that
    made it worth showing. → [L21](#l21)

### Testing

13. **A test harness must build what it tests.** `vite preview` serves whatever is already
   in `dist/`. This cost three debugging rounds chasing failures that had already been
   fixed in source. → [L14](#l14)
14. **When driving an eased value, steer the input and assert on the output.** Watching the
    lagging value overshoots: it arrives long after the target has run ahead. → [L13](#l13)
15. **Verify that your assertions can fail.** Break the build on purpose once and watch the
    guard fire. An assertion never seen failing is not known to work. → [L11](#l11)
16. **Give live scenes room to breathe.** Parallel WebGL contexts under a software
    rasteriser starve each other's frame loop, and everything times out for reasons that
    have nothing to do with the code. → [L12](#l12)
17. **A test driver is not a player.** Automation taps three times a second and will find
    the ceiling of any mechanic. Do not tune a feel value against what it reports. → [L16](#l16)
18. **Run the slowest target you have, every time.** Four bugs in this project have been
    invisible on desktop and obvious on the mobile project, because a software rasteriser at
    a phone's pixel count is the closest thing here to a weak device. → [L19](#l19)
19. **A worker cap is a property of how much work the suite does.** Re-derive it whenever
    the suite gets heavier, or new tests will start failing old ones. → [L22](#l22)
20. **Some things can only be found by looking at the output.** A guard asserting that
    pixels are lit passes just as happily when two pieces of text are lit on top of each
    other. Render the artifact and look at it. → [L20](#l20)

### Direction and decisions

21. **Check a set of answers for mutual contradiction before acting on it.** Two
    individually reasonable choices can be jointly impossible. Surface the conflict; do not
    silently pick a winner. → [L2](#l2)
22. **When a question format stalls, change the format.** Two rounds of multiple-choice
    went unanswered; the same questions written out as a numbered list got answered. → [L1](#l1)
23. **A blocked path is sometimes the better path.** The sandbox blocking a CDN forced
    local bundling — which turned out to be the only option consistent with the project's
    own privacy promise. Ask whether the workaround is actually the right answer. → [L10](#l10)
24. **Strict types earn their keep on the first day.** Turning on strict TypeScript
    surfaced four real latent bugs in code that had been running fine. → [L11](#l11)
25. **A menu selection is a direction; a preview is the decision.** And when a phase is
    closed with its preview gates still open, record that it was — the status is then
    honest, and reopening it later is a normal outcome rather than a regression. → [L3](#l3)

---

## Part 2 — Log

Newest first.

---

### 2026-07-29 · Phase 2 — the share engine

**Asked for:** *"start with phase 2."*

**Built:** eight named selves derived from the state vector, a composed share card
(portrait of the final avatar + name + quiet line + the way back), the native share sheet
with a download fallback, a staged ending, the replay invitation, Open Graph tags with a
dependency-free generated preview image, and four tests — all three new guards watched
failing on purpose before being trusted.

**Flagged, not fixed:** D1–D7 were open before this started and D8–D9 are open now.
Nothing in this phase is signed off, and the eight names especially are a draft. Two things
the cards made visible are avatar work rather than card work, and were deliberately left
alone rather than self-approved under D2: at full fog the clarity shell reads as a
hard-edged capsule *around* the figure rather than as edges coming apart, and stray room
furniture floats in the far background of some portraits.

<a id="l20"></a>
**L20 — The longest name wrote itself straight through the link at the foot of the card.**
The text flowed downward from the portrait, so a name that wrapped onto two lines pushed
everything below it into a footer anchored to the bottom edge. Every card looked right
until the one that did not — and it was, inevitably, "The One Who Said Yes to Everything",
the name belonging to the heaviest run and the one most likely to be shared. Nothing in the
test suite could have caught it: the assertions were about pixels being lit, and the
overlapping text lit them beautifully. It was found by rendering three cards and looking at
them, which is exactly what the D9 gate is for and why it now has a script.
*Rule: a layout is only tested by its worst content, and the worst content is not the
default one.*

<a id="l21"></a>
**L21 — The frame that was too close made the mirror invisible.**
The card's portrait camera was placed two and a half metres from a 1.2-metre figure,
reasoning that a portrait should be close. What came out was a lamp: the figure filled the
frame, its glow filled the rest, and *diminished, foggy and small* had nowhere to be small
in — the one comparison the card exists to support, between a run that took everything and
a run that took nothing, was flattened by the framing. Pulled back to four and a third
metres and the three cards became unmistakably three different people.
*Rule: when the subject is how much of something is left, the frame has to include what it
is being measured against.*

<a id="l22"></a>
**L22 — A new test made an old, unrelated one start failing.**
Adding four share tests — each composing a card, each reading four megapixels back off the
GPU — pushed an unrelated boot test from 2.6 seconds to a ten-second timeout. This is
[L12](#l12) returning by a different door: the worker count was tuned when the suite was
lighter, and nothing re-derives it when the suite grows. Confirmed as starvation rather
than logic the same way as last time — it passed alone, and the failure moved between runs.
Local workers dropped from three to two.
*Rule: a worker cap is a property of how much work the suite does, so re-check it whenever
the suite gets heavier.*

**Also worth recording:** the same run turned up a genuinely weak assertion in the Phase 1
suite. "The turn takes the steering away" was checking that `progress` stopped moving —
but the lock stops the *input*, and whatever was already banked keeps gliding to a halt by
design. It passed only when the glide happened to have finished first, which under a loaded
suite it sometimes had not. That is [L13](#l13) again, on the other side: steer the input,
assert on the input. It now asserts that `target` does not move, which is the actual claim.

---

### 2026-07-29 · Phase 1 — the core journey

**Asked for:** *"start with phase 1."*

**Built:** the four remaining rooms — fractured attention, the information flood, the
comparison corridor, the notification storm — on a shared room contract, laid along a
150-unit track with the turn at the end. Per-room synthesised audio beds cross-fading by
proximity. A floor pace on the rail. `?room=` and `?pace=` so a single room can be
previewed. Twelve smoke tests plus the anti-railroad gate, on desktop and mobile.

**Flagged, not fixed:** Phase 0's D1–D4 and the cold-user test were still open when this
was built, and D5–D7 are open now. Nothing here is signed off.

<a id="l15"></a>
**L15 — Five rooms that each looked right looked like a junk drawer together.**
Every room was built and checked on its own, and every one of them read. Put on the same
track they overlapped badly: the comparison corridor's last figure stood in the middle of
the notification clearing, and the attention road ran the full length of the flood. Each
room had quietly helped itself to more world than the 24 units between it and its
neighbour. Fixed by giving every room the same explicit body — `BODY_AHEAD` to
`BODY_BEHIND`, sized to the window it is actually reachable from — with a few units of
empty world left between each pair, which the piece needs as much as it needs the rooms.
*Rule: rooms are staged against each other, never one at a time.*

<a id="l16"></a>
**L16 — Every dimension pinned at 1.0, and the test was happy about it.**
The anti-railroad gate passed comfortably: the heedless run ended at all-ones, the careful
run at all-zeros, maximum divergence. It looked like the best possible result and it was
the worst. A saturated vector has no shape — every determined player gets the same self,
and the facet-owns-one-dimension rule that the whole design rests on becomes invisible in
the outcome it was built to produce. What made it invisible was the harness: it taps about
three times a second, taking 30-odd from every unbounded room, which no person does.
Rebalanced all five rooms' costs together against a human cadence, and confirmed against a
real one — around seven takes a room lands each dimension near 0.6, with shape.
*Rules: a cost scale is only meaningful where it does not saturate; a test driver is not a
player.*

<a id="l17"></a>
**L17 — The corridor recorded thirteen lingers, and it only has twelve.**
Six figures, each willing to hold your attention twice. The count came back 13. `pending` —
whatever is under your thumb — is worked out once per frame, and `choose()` trusted it,
checking only that it was not null. Two taps inside one slow frame spent the same figure
twice. The same latent bug sat in the attention room's shards. Worth noting how it
surfaced: not from a failing test but from a number in a debug dump that was one larger
than it could be.

**The first fix was wrong, and the mobile suite caught it.** Re-checking the cached figure
stopped the over-spend and introduced a worse bug: on a slow device the extra taps were now
*discarded*, so eight taps produced six lingers and the room went dead in your hand. The
right fix is not to validate the cached answer but to stop caching it — resolve what is
under your thumb at the moment of the tap. Then a flurry of taps between two frames takes
the next figure and the next, exactly as it does at sixty frames a second.
*Rule: re-resolve the target at the moment of the action; do not merely re-check a cached
one. A guard that turns a wrong action into no action has moved the bug, not fixed it.*

<a id="l18"></a>
**L18 — Capping the rail's speed made the world take a step backwards.**
The world moved to −0.0001 before the player had touched anything. The first
animation-frame timestamp is when the frame *began*, which can be earlier than the
`performance.now()` the module recorded while it was still starting up — so the first
frame's elapsed time is negative. The old easing multiplied that by a tiny coefficient and
it vanished. The new speed cap, being a clamp rather than a filter, applied it faithfully.
The bug was years old in spirit and one commit old in effect.
*Rule: when you tighten a control loop, re-derive what its inputs are allowed to be.*

<a id="l19"></a>
**L19 — The turn never ended, and only the mobile suite knew.**
Four tests failed on mobile and passed on desktop, all stuck in `phase: 'turn'`. The turn
advances by `dt / 3.6`, and `dt` is capped at 50ms so a backgrounded tab does not lurch —
which means that below twenty frames a second the clock driving it runs slower than the
world does. Under a software rasteriser at the mobile viewport, roughly five frames a
second, a three-and-a-half-second camera move took fourteen. This is [L5](#l5) exactly, in
code written after L5 was already on the wall: the reveal beats had been moved onto wall
time and the turn had been left behind, on the reasoning that it is an animation. It is an
animation *and* a gate, and the gate half is what matters.

The cap is the whole subtlety. Uncapped wall time would let a minute in a background tab
skip the turn entirely, and the turn is the piece. Capped at 250ms it keeps step with any
device managing four frames a second, and a tab left for a minute comes back with the turn
still ahead of it.
*Rules: keep two clocks — and if a beat gates what comes next, it belongs on the interface
clock no matter how much it looks like an animation. Test on the slowest target you have;
desktop will not tell you.*

**Also worth recording:** the stale-`dist/` trap from [L14](#l14) caught us again, from a
new direction. The Playwright config builds before it previews, so the suite was safe — but
a preview server started by hand for screenshots serves whatever was last built, which was
a deliberately-broken build from a guard-verification run. Two minutes of confusion over
numbers that were correct for the code actually being served.

---

### 2026-07-29 · Phase 0.5 — the foundation

**Asked for:** *"implement Phase 0.5: Foundation (Vite, TypeScript, GitHub Pages,
GoatCounter, privacy page)."*

**Built:** Vite + strict TypeScript, relative asset paths, a root-absolute-path guard, a
gzipped size budget, twelve Playwright smoke tests on desktop and mobile, `/privacy/` with
a working "forget me", namespaced on-device storage, DNT/GPC-respecting analytics, and a
Pages deploy workflow.

<a id="l10"></a>
**L10 — The CDN was blocked, and that was the right answer.**
Phase 0 loaded Three.js from unpkg via an import map. The sandbox refused the connection.
The obvious workaround was to vendor the library locally — but the real insight came from
asking *why we would want to anyway*: this piece promises that nothing leaves your device,
and a CDN import makes every visitor's browser call a third party on arrival, before they
have done anything at all. The promise would be broken on the very first request. Vendored
in Phase 0, then moved to a bundled npm dependency here, which keeps the property and makes
updates routine. There is now a smoke test asserting the page contacts nobody.
*Rule: a blocked path is sometimes the better path.*

<a id="l11"></a>
**L11 — Strict TypeScript found four real bugs on day one.**
`noUncheckedIndexedAccess` caught unsafe destructuring in the audio synthesis and unguarded
particle buffer reads; the `Fog | FogExp2` union caught a property access that would have
failed had the fog type ever changed; and `__dirname` in an ESM config file was simply
broken. All of it in code that appeared to run fine.
Separately: after writing the path guard, the build was deliberately broken to confirm the
guard actually fired. It did. *Rule: verify that your assertions can fail.*

<a id="l12"></a>
**L12 — Twelve parallel WebGL scenes starved each other.**
The first full test run had four failures, all timeouts, all in different places on each
run. The cause was not the code: twelve tests each running a live 3D scene through a
software rasteriser on a shared CPU. Capping workers cut the suite from 3.2 minutes to
about 1 and made the failures move — which is how it became clear they were a resource
problem, not a logic one.
*Rule: give live scenes room to breathe.*

<a id="l13"></a>
**L13 — The test driver walked straight past the door it was aiming at.**
The rail eases: `progress` chases `target`. The driver pushed input until *progress*
reached the destination — by which time *target* had already run far ahead, so the avatar
kept drifting forward while the test was busy clicking. The lever fell out of reach
mid-test and the pull count came back zero. Fixed by steering `target` precisely, then
waiting for `progress` to settle onto it.
*Rule: when driving an eased value, steer the input and assert on the output.*

<a id="l14"></a>
**L14 — Three debugging rounds lost to a stale `dist/`.**
`npm run preview` serves whatever is already built. A new debug field had been added to the
source but never rebuilt, so the test driver read `undefined`, computed `NaN`, and
dispatched zero input events — presenting as a timeout with no obvious cause. The fix is
permanent: the Playwright `webServer` now builds before it previews, and
`reuseExistingServer` is off.
*Rule: a test harness must build what it tests.*

---

### 2026-07-29 · Phase 0 — the vertical slice

**Asked for:** *"start with phase 0."*

**Built:** one buildless HTML file plus ES modules — the five-dimension mirror, the rail,
a procedural avatar, the dopamine room, synthesised audio, the turn and the reveal.
Verified end to end with Playwright across both trajectories: a heedless run ends at
colour 0.98 / scale 0.58 with the other three dimensions untouched, confirming the
facet-owns-one-dimension rule holds in practice; a careful run ends at zero.

<a id="l4"></a>
**L4 — Scroll sensitivity was six times too high.**
Forty-six wheel ticks took `progress` from 0 to 1.0 — the entire journey in about two
trackpad flicks — so the avatar shot past the door before the test could interact with it.
The value had been picked by feel with nothing behind it. Recalibrated from a target:
roughly 14,000px of wheel for the full track, about a dozen full-screen swipes.
*Rule: derive input sensitivity from a target total travel.*

<a id="l5"></a>
**L5 — The interface was running on the wrong clock.**
At four seconds of wall time the animation clock read 1.9. `dt` is capped at 50ms so a
backgrounded tab does not jump — correct for animation, wrong for anything timed against
real seconds. The opening hint was paced off that capped accumulator, so on a slow device
it would arrive roughly half as fast as intended. Split into two clocks: `elapsed` for
animation, `wall` for interface timing.
*Rule: keep two clocks.*

<a id="l6"></a>
**L6 — Reward particles hung in the air forever.**
The burst faded by multiplying opacity each frame while its life counter ran down. When the
counter hit zero the update loop stopped — leaving opacity at whatever it happened to be,
permanently visible near the door for the rest of the run. Now the effect has an explicit
end: opacity zeroed and the object hidden.
*Rule: every decaying effect needs a terminal state, not just a decay curve.*

<a id="l7"></a>
**L7 — The drained avatar was lost, not sad.**
At full cost, emissive intensity, lamp brightness, glow and exposure all fell together and
the figure nearly vanished into the background. The compendium asks for *diminished, foggy
and small* — but a player who cannot make out their own avatar has been given nothing to
feel. Every channel now keeps a floor.
*Rule: the worst state must still be clearly legible.*

<a id="l8"></a>
**L8 — Walking past was a postponement, not a choice.**
The lever's reach window was symmetric around the door, so it was only usable while level
with it, and remained usable after passing. Made asymmetric: reachable across the entire
approach — a long, easy invitation — and closed the moment you are past. Walking on is now
final, which is what makes it a decision.
*Rule: make the alternative a real choice.*

<a id="l9"></a>
**L9 — The opening gave away the destination.**
The threshold is meant to be calm and near-empty. The door's glowing panel was visible from
the very first frame, announcing the room before the visitor had taken a step. Its light
now fades in on approach; from the threshold only a faint unlit frame is visible in the
distance — intriguing rather than announcing.
*Rule: progressive disclosure has to be enforced in code.*

**Also fixed in this block:** the avatar walked *through* the doorway with the panel filling
the frame as an opaque wall and the lever cut off at the screen edge. The door was moved
beside the path and angled toward the walker, the panel became translucent and additive
rather than a lit billboard, and the lever gained a bracket so it reads as part of the
machine rather than a lollipop floating next to it.

---

### 2026-07-29 · Planning

**Asked for:** *"Study second-self-master-compendium.md and create phased implementation
plan… Let's brainstorm about the final requirements and technology… Ask me as many
questions as possible."* Followed by *"add status for phased implementation"* and
*"Update plan to explicitly confirm design choices after user has previewed the same."*

**Produced:** `docs/IMPLEMENTATION-PLAN.md` — the compendium's six open decision gates
resolved, three further questions answered (anonymous identity, visitor counter, About
section), an avatar state model assigning each facet a dimension it owns, a status board,
and a design-confirmation protocol.

<a id="l1"></a>
**L1 — Two rounds of multiple-choice questions went unanswered.**
The brief explicitly asked for many questions, and multiple-choice seemed the efficient
format. Two full rounds were dismissed without an answer. Writing the same questions out as
a numbered list, with a recommendation next to each, got them all answered — and the
multiple-choice rounds worked fine afterwards, once the reasoning behind each option was
already on the page.
*Rule: when a question format stalls, change the format rather than repeating it.*

<a id="l2"></a>
**L2 — Two answers were individually sensible and jointly impossible.**
"All five facets" and "a 4–5 minute run" together allow about fifty seconds per room,
including the threshold, the turn and the reveal — and the compendium explicitly warns that
all five flattens the emotional curve. Rather than quietly picking one, the conflict was
put back as its own question with four resolutions. The chosen answer extended the run to
6–7 minutes, and the trade is recorded in the plan so it stays visible if completion rates
later disappoint.
*Rule: check a set of answers for mutual contradiction before acting on it.*

<a id="l3"></a>
**L3 — A decision made from a description is not a decision.**
The plan initially recorded every choice as "locked" on the strength of a menu selection.
But anything with a look, a feel, or a pace cannot honestly be settled from prose. Section 1
was split into *structural* (architecture — relied on now) and *experiential* (provisional
until previewed), and a thirteen-row confirmation register was added: what gets previewed,
how it will be shown, and at which phase. The standing rules that came out of it — never
self-approve a design row, never mark a phase done while its rows are open — now live in
[`CLAUDE.md`](CLAUDE.md).
*Rule: a menu selection is a direction; a preview is the decision.*
