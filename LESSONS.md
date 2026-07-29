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
   runs behind wall time. → [L5](#l5)
3. **Every decaying effect needs an explicit terminal state**, not just a decay curve. A
   value that merely approaches zero will sit visible forever. → [L6](#l6)
4. **The worst state must still be clearly legible.** A mirror you cannot see shows
   nothing. Diminished, foggy and small — never swallowed by the dark. → [L7](#l7)
5. **Progressive disclosure has to be enforced in code, not merely intended.** A calm,
   near-empty opening is undone by one glowing object visible from the first frame. → [L9](#l9)
6. **Make the alternative a real choice, not a postponement.** If the interactive window
   never closes, walking past costs nothing and is not a decision. → [L8](#l8)

### Testing

7. **A test harness must build what it tests.** `vite preview` serves whatever is already
   in `dist/`. This cost three debugging rounds chasing failures that had already been
   fixed in source. → [L14](#l14)
8. **When driving an eased value, steer the input and assert on the output.** Watching the
   lagging value overshoots: it arrives long after the target has run ahead. → [L13](#l13)
9. **Verify that your assertions can fail.** Break the build on purpose once and watch the
   guard fire. An assertion never seen failing is not known to work. → [L11](#l11)
10. **Give live scenes room to breathe.** Parallel WebGL contexts under a software
    rasteriser starve each other's frame loop, and everything times out for reasons that
    have nothing to do with the code. → [L12](#l12)

### Direction and decisions

11. **Check a set of answers for mutual contradiction before acting on it.** Two
    individually reasonable choices can be jointly impossible. Surface the conflict; do not
    silently pick a winner. → [L2](#l2)
12. **When a question format stalls, change the format.** Two rounds of multiple-choice
    went unanswered; the same questions written out as a numbered list got answered. → [L1](#l1)
13. **A blocked path is sometimes the better path.** The sandbox blocking a CDN forced
    local bundling — which turned out to be the only option consistent with the project's
    own privacy promise. Ask whether the workaround is actually the right answer. → [L10](#l10)
14. **Strict types earn their keep on the first day.** Turning on strict TypeScript
    surfaced four real latent bugs in code that had been running fine. → [L11](#l11)

---

## Part 2 — Log

Newest first.

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
