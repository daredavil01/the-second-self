# THE SECOND SELF TOOLKIT — MASTER COMPENDIUM
### One document: the concept, the toolkit plan, and all supporting research

*Consolidated single source of truth. Compiled July 2026. This file integrates five prior artifacts into one — nothing was cut, only reorganized and cross-linked, with a merged bibliography in Part F.*

---

## What this is

**Second Self** is a self-contained, symbolic 3D web experience that lets people *feel* what their digital habits do to them. **The Second Self Toolkit** wraps that flagship experience in a modular, role-aware curriculum for wide digital-wellbeing literacy — for individuals, students, educators, and parents. This compendium holds everything planned and researched so far.

## The north star (governs every part below)

**Awareness, not shame.** The toolkit observes and reflects; it never scolds, scores, or lectures. Its one hard rule, enforced everywhere: *every lesson is an experience or a story that lands on its own, and the explicit teaching is a light, optional "unpack" that comes after the feeling — never before it, never instead of it.* This is documented as the safest posture in the evidence base (Part D) and is the reason the toolkit teaches through felt interaction and honest, evidence-tiered content rather than fear. A companion rule from the experience design: *peace is offered, never earned* — restorative content is never gated behind "good" behaviour.

## How this document is organized

| Part | Contents | Source artifact |
|---|---|---|
| **A** | The Second Self experience — full spec for the flagship symbolic journey (thesis, facets, avatar, reveal, peaceful place, feature set, tech) | `second-self-concept.md` |
| **B** | The Toolkit plan — architecture, roles, curriculum map, lesson template, gamification, tech, roadmap, and the decision-gate register | `second-self-toolkit-plan.md` |
| **C** | Landscape & inspirations survey — prior art across net-art, games, apps, advocacy, and immersive work, with the white-space analysis | Design survey report |
| **D** | Content evidence base — sourced, evidence-tiered facts and "unpack" material for every curriculum topic, plus myths to avoid | Research & reference report |
| **E** | The Echo-Chamber Exit module — a seven-phase, dual-track exit journey (self + supporter) grounded in the change/disengagement literature | Exit-journey report |
| **F** | Consolidated references & further reading — the merged, grouped bibliography aggregating every source cited across Parts A–E | *(new — merges all)* |

## Reading guide (how the parts relate)

Start with the north star above. **Part A** is the emotional heart — the experience everything else builds toward. **Part B** is the container that turns that experience into a curriculum, and is where the open decisions live (see its §12 decision-gate register). **Parts C–E are the evidence floor:** C keeps the design honest against prior art, D keeps the *content* accurate and non-alarmist, and E is a fully-researched flagship module. **Part F** is the bibliography for the app's "Further reading" UI.

> **Note on evidence tiers.** Parts D and E label claims as *established / contested / weak-or-debunked*. That convention should propagate into the app's content and the Part F links, so nothing in the toolkit repeats a myth (dopamine detox, the "goldfish attention span," strong filter bubbles, the general backfire effect, etc.).

> **Note on open decisions.** Four foundational choices are locked (modular toolkit · 3D for peaks · all four roles · static vanilla HTML/JS + Three.js on GitHub Pages). Six remain open and are tracked in Part B §12. This document decides nothing past those gates.


---

# PART A — THE SECOND SELF EXPERIENCE (SPINE SPEC)

*The full specification for the flagship symbolic experience at the centre of the toolkit. Everything below is the original concept document.*

# SECOND SELF
### A self-contained 3D world that lets you meet the person your digital habits are quietly building

*Working title. Alternatives at the end.*
*Concept document — v0.1*

---

## 1. One-line premise

You walk a small avatar through a symbolic world. Along the way you make choices that feel like harmless play. At the end, the avatar you've shaped turns around and looks at you — and you realise you were looking at yourself the whole time.

---

## 2. The thesis (read this first — everything else hangs off it)

The single most important design decision in this project is *how the truth is delivered*, and it comes straight out of a tension in the concept itself.

The world is **self-contained** — it never touches your real screen-time data. But the avatar is meant to **mirror your habits**. Those two ideas look like they're fighting. They aren't. The avatar doesn't mirror your real data; it mirrors the choices you make *inside the world*. And that turns out to be the strongest possible move for a piece whose primary job is advocacy.

Here's the reasoning. Confronting someone with their real numbers ("you unlocked your phone 142 times today") reliably reads as an accusation — *you're doing it wrong* — and people defend rather than reflect. Google's own digital-wellbeing designers ran headlong into this: framing usage data as a problem to fix made a chunk of users feel shamed rather than supported. Shame closes people down. It's the opposite of advocacy.

So instead: drop the person into a symbolic world where every choice feels like a game, not a test. Keep scrolling or stop. Dismiss the notifications or let them pile up. Take the "just one more" door. Each choice is frictionless and reads as play. Then, at the reveal, show them what those choices did to their avatar — *this is who you built.*

The realisation now arrives as **self-discovery instead of accusation.** They did it to themselves, in front of themselves, and it felt natural the entire time. That "wait… that's me" beat is the emotional core of the whole thing — and, not incidentally, it's the exact thing a person screenshots and sends to a friend. **For an advocacy piece, that moment is the product.**

Everything below serves that moment.

---

## 3. What it is, concretely

- A **fully animated 3D world**, navigated as a short guided journey (target: 4–7 minutes end to end).
- **Self-contained and symbolic** — no login, no permissions, no real data. Anyone can experience it instantly.
- **Avatar-driven** — a small character you shape through in-world choices, whose visible state is the emotional payload.
- **Web-first, runs on mobile and desktop** from the same codebase.
- **Ends in a shareable artifact** — a personal "digital self" card that carries the piece to the next person.
- **Primary purpose: advocacy** — spark reflection and conversation about digital habits — with lighter behaviour-change and game elements woven in without diluting the spine.

---

## 4. Design principles (the non-negotiables)

These are the guardrails. When a later decision is unclear, resolve it against these.

**Awareness, never shame.** The world observes and reflects; it never scolds. No red numbers, no "you failed," no wagging finger. The user draws the conclusion themselves — the moment you narrate the lesson, it curdles into a lecture and people bounce.

**Frictionless entry.** Advocacy pieces die at the install button and the signup wall. No account, no download, no data permission. Click a link, you're in. (The self-contained choice already guarantees this — protect it.)

**One sharp point beats a full syllabus.** Pick two or three facets of digital life and dramatise them hard. Do not try to teach everything about digital wellbeing. Depth of feeling, not breadth of coverage.

**Symbolic over literal.** Because you're not bound to real data or real UI, you can make abstract harms *physical* — attention you can see fraying, information you can drown in. This is your unfair advantage over every dashboard app. Lean all the way into it.

**Short and shaped.** 4–7 minutes with a clear arc and a payoff. The pieces that travel are tight. Resist scope creep that flattens the emotional curve.

**Designed to travel.** Assume the most important interaction isn't the first person playing — it's the third person, who got the link because the second person was moved enough to send it. Build for the share.

---

## 5. Where this sits (and why the gap is real)

Adjacent work exists; the specific thing does not.

- **Google's Digital Wellbeing Experiments** (Unlock Clock, Screen Stopwatch, We Flip, Paper Phone, etc.) are the closest *philosophical* cousins — small, open-source, awareness-first — but they're single-purpose 2D utilities, not one connected world, and most are now inactive.
- **Gamified screen-time apps** (Forest, Opal, one sec, Breakr) run on reward loops and blocking. They nudge behaviour but never *explain the phenomena* or make you feel them.
- **Serious games / VR for attention** exist mostly in clinical and academic settings (ADHD, executive function). Good evidence that immersive environments engage and teach — but they're lab tools, not consumer experiences.
- **Immersive 3D web** (WebGL brand sites, scrollytelling) is mature and mobile-capable, but pointed almost entirely at commerce.

**The white space:** a *world-as-explanation* — abstract digital harms turned into spaces you walk through and feel, delivered as a shareable, self-contained, avatar-driven experience. Nobody is really occupying it.

---

## 5.1 Prior art deep-dive — projects to study, and what to steal from each

These are the concrete, named experiences closest to what Second Self is trying to do. Each earned its place by solving a problem we also have. The notes are the transferable lessons, tied back to our design.

**The Endless Doomscroller — Ben Grosser (net-art).**
A single, infinite feed stripped down to bare, generalised interface conventions — vague ominous headlines, endless scroll, nothing to actually read. By reducing social/news feeds to their skeleton, it exposes the *mechanism* behind scroll-anxiety rather than any particular content.
- *Steal:* abstraction is a scalpel. You reveal a system more clearly by removing specifics than by adding them. Our facet rooms should distil each harm to its barest symbolic form, not simulate a real app.
- *Steal:* the medium enacts the message — the piece is exhausting to use *on purpose*. Our world should let the user *feel* the harm through the interaction itself, not have it narrated.

**Doomscrolling: The Game — Ironic Sans (browser game).**
A Doom-style shooter where the *only* input is scrolling; runs in the browser on desktop and mobile. Takes a heavy subject and makes it genuinely fun and instantly playable with one gesture.
- *Steal:* radical input simplicity. A single, obvious gesture (scroll, tap, hold) as the core verb lowers the entry barrier to zero — critical for a piece meant to travel.
- *Steal:* playful reframing disarms a preachy topic. Fun is not the enemy of the message; it's the delivery vehicle.
- *Steal:* browser-first, no install, works on a phone — exactly our distribution model.

**Network Effect — Jonathan Harris & Greg Hochmuth (interactive art).**
A site that floods you with a torrent of human video and data to the point of simulated panic — and then *locks you out for the day* after a short time. It literally rations your access.
- *Steal:* the **time limit as a statement.** A hard cap on how long you can stay is both a design mercy and the message embodied. Consider capping a session and making the cap *meaningful* ("that's enough for today").
- *Steal:* overwhelm, deployed deliberately and briefly, is a legitimate emotional tool — but it must be bounded, or you just harm the user you're trying to reach.

**Finch — self-care pet app (the closest cousin to our avatar mechanic).**
You hatch a bird that grows as you do small real-world wellbeing actions. Its power is the framing: people who won't act for themselves will reliably act *for something that depends on them* — without the shame of streak-based apps.
- *Steal:* **externalised care creates emotional investment.** Our avatar being *yours*, shaped by you, is what makes its state land. Lean into ownership.
- *Steal:* **no penalty for a bad day.** Finch never punishes; a missed day just means a companion glad to see you return. Our world must never scold — decline is shown, never blamed.
- *Steal:* **progressive disclosure.** Finch doesn't dump its toolkit on you; the companion is simply *present* first. Our opening should be calm and near-empty before any mechanic appears.
- *Steal:* **patterns surface gently over time**, and **entries stay on-device.** Both reinforce our "self-contained, nothing leaves your device" promise — and it's worth stating that promise out loud, as a trust signal.

**Florence — award-winning narrative mobile game (craft benchmark).**
A wordless story of a first relationship told entirely through tiny mini-games. Widely praised for conveying emotion *through mechanics* rather than text.
- *Steal:* **emotion through mechanics.** The strongest validation of our whole approach — dragging puzzle pieces to "speak," boxing up belongings to feel a breakup. Our meaning must live in what the user *does*, not in captions.
- *Steal:* **colour as emotional state.** Florence renders monotony and low moods in grey, happiness in vivid hue — direct precedent for our avatar's colour-drain / colour-return language.
- *Steal:* **deliberate boredom.** Its morning-routine mini-games are *almost boring on purpose*, so you feel the monotony. Our dopamine lever should be satisfying, then subtly hollow — the point is felt, not stated.
- *Steal:* **short and self-assured beats long and branching.** Florence is under an hour, linear, and unforgettable. Confidence and edit are the craft; breadth is not.

**Cross-cutting lesson.** Every one of these works because it makes an abstract, invisible dynamic *physical and immediate*, and (the good ones) does it without lecturing. The failure mode they collectively warn against is the same one in our principles: the moment the piece explains its own moral, it stops being felt. Show the mechanism, hand over the choice, let the realisation be theirs.

---

## 5.2 Extended survey — the wider field, mapped

A broader scan (net-art, viral toys, serious games, friction apps, advocacy, academic HCI, and immersive/3D) surfaced more named work worth knowing, grouped below with the transferable note. Full annotated write-ups live in the companion survey document.

**Attention-economy net-art (beyond the Doomscroller).**
- **Ben Grosser's wider body of work** — *Demetricator* (browser extensions that hide every like and count on the big platforms), *Order of Magnitude* (a supercut of a tech CEO endlessly saying "more" and "grow"), *Minus* (a social network with a 100-post *lifetime* limit), *Go Rando* (scrambles your emotional reactions to defeat affect-tracking). The method across all of them is **subtraction as intervention** — remove or scramble one interface element and the manipulation becomes visible. *Steal:* a "de-metricated" beat — show a feed with the numbers stripped out, and the compulsion has nothing to feed on.
- **Doomscrolling — Ben Kovach** (generative art): a physics-accurate iPhone feed made of the word "DOOM." *Steal:* simulate the exact **swipe physics** (inertia, friction, overscroll) — it's what makes a symbolic scroll feel like *your* phone in your hand.
- **Jang Seungkeun** (painting): renders image-search results as collectible trading cards. *Steal:* the "everything becomes an interchangeable collectible" frame as a metaphor for feed-flattening.

**Complicity games — the strongest advocacy format we found.**
- **Nicky Case** is the most transferable creator here. *We Become What We Behold* (a 5-minute browser game in which *you* are the outrage-media loop — you photograph anger, it goes viral, violence escalates), *The Evolution of Trust* (game-theory made playable), *Adventures with Anxiety* (you play *as* the anxiety), and the *Explorable Explanations* hub. Case's working philosophy — "education is empathy," show-then-tell, keep it under five minutes, release it public-domain. *Steal:* **make the player complicit.** A beat where the user's own gesture visibly causes the harm produces a self-authored "…oh, I do this" that no dashboard can.

**Serious games that carry purpose invisibly.**
- **Sea Hero Quest** (Glitchers + UCL, 2016): a gorgeous, low-pressure boat game that quietly gathered the largest spatial-navigation dataset ever, for dementia research — millions of players, consented and told upfront. *Steal:* a beautiful, no-pressure experience earns permission for a serious purpose, *if* you're honest about it.

**The calm, no-fail register.**
- ***Journey*, *Flower*, *Abzû*, *GRIS*, *Monument Valley***, and especially ***Alto's Odyssey*'s Zen Mode** (no score, no "game over," single touch, weather-like drift). *Steal:* this is exactly the register a shame-free piece should adopt — remove the threat response, leave only movement and mood. Reinforces our tone (Section 12).

**Friction / micro-boundary apps — and the research behind them.**
- ***one sec*** forces a breath before an app opens; a *PNAS* field study (Marx et al., 2023) found roughly a third of app-opens were abandoned after the pause, and target-app opens fell about 37% over six weeks. ***ScreenZen*** scales its friction with usage; ***Clearspace*** puts a small task "at the door." Minimalist launchers (*Olauncher*) and grayscale advocacy strip the dopamine of colour. *Steal:* the winning micro-pattern is the **pause-at-the-point-of-impulse** — a breath or a question inserted exactly where the compulsive tap happens; dramatise that pause as a felt beat. *Caveat to design around:* people **habituate** to any fixed friction — another argument for a one-shot experience over a daily nag.

**Advocacy framing.**
- **Center for Humane Technology** (the *Ledger of Harms*, youth toolkits), **Log Off Movement** (youth-led, founded by a teenager), **5Rights Foundation** (drove the UK's Age-Appropriate Design Code). *Steal:* **youth-led / peer framing** sidesteps the "adults lecturing teens" trap. If the audience skews young, the voice should feel like a peer noticing something, not an elder warning.

**The academic frontier (which validates our thesis).**
- **"Microboundaries"** (Cox et al., CHI 2016) is the foundational friction paper — small designed pauses disrupt mindless automatic use, likened to keeping "a credit card in a block of ice." **"Monitoring Screen Time or Redesigning It?"** (CHI 2022) argues for redesigning *toward intention* over merely measuring. Research on **infinite scroll** links it to a dissociative, self-awareness-dimming state. *Takeaway:* the field has moved decisively from *tracking and shame* to *awareness, reflection, and redesign* — Second Self is aligned with the research frontier, not fighting it.

**Immersive / 3D comparators (the rarest category — and our white space).**
- **Impulse: Playing With Reality** (ANAGRAM; Achievement Prize, Venice 2024; Emmy 2025) — a room-scale mixed-reality piece on ADHD/dopamine built around a deliberately **un-winnable** mini-game: you embody a dopamine-depleted brain drowning in information, fail on purpose, then get dropped into a bare quiet room. The emotional *contrast* is the message. *Steal:* **the un-winnable game** — a loop you're meant to lose puts the feeling in the body better than any exposition.
- **The Wilderness Downtown** (Chris Milk + Google, 2010) — a landmark on-rails browser experience personalised by a single input (your childhood address). *Steal:* one small personal input turns a generic sequence into something intimate (see Section 9).
- **Bury Me, My Love** (ARTE) — a story told entirely in a chat interface, with real push notifications arriving on your phone. *Steal:* use the device's own native grammar — chat bubbles, notifications — as the medium, which is devastating for a notification-interruption facet.
- **Verdict, now firmly established:** 3D/immersive pieces *specifically* about phones, doomscrolling, and notifications are essentially absent, and the nearest topical cousin (*Impulse*) is a paid headset piece, not a free shareable link. **Fusing award-winning WebGL-scrollytelling *form* with attention-economy *topic*, in a no-headset shareable web format, is genuine white space.** This is the sharpest strategic finding of the whole survey.

---

## 5.3 Four proven mechanics to build on

Distilled from everything above, four mechanics recur in the work that actually lands. Second Self should lean on all four.

1. **Abstraction / reduction** *(Endless Doomscroller; Grosser's subtraction method).* Strip content and metrics until only the compulsive structure remains. → Our facet rooms already do this; add an explicit de-metricated moment.
2. **Complicity / role-reversal** *(We Become What We Behold).* The user *causes* the harm, so the realisation is self-authored. → Wire at least one facet so the user's own gesture visibly triggers the damage (the dopamine pull and the notification storm are naturals).
3. **The un-winnable game** *(Impulse).* A loop you're meant to fail; the failure lands the feeling in the body. → The dopamine lever "never says no" — make its un-winnability explicit and felt.
4. **The living avatar that mirrors you** *(Finch, Forest, + avatar-identification research).* An externalised, personalised state you come to care about. → Our whole spine; strengthen it with lightweight up-front personalisation (Section 9).

The through-line of the entire survey: the strongest works make an invisible dynamic **physical, immediate, and self-caused** — and never explain their own moral.

---

## 6. The core loop

The engine of the piece is a simple, repeating loop:

1. **Encounter** — the avatar arrives at a symbolic situation (an endless feed, a notification storm, a "just one more" door).
2. **Choice** — the user makes a small, playful micro-decision. Low stakes, feels like a game beat, never framed as a quiz.
3. **Response** — the avatar and the surrounding world change *immediately and visibly*. This is the mirror. The feedback must be legible in the moment, not buried in a score.
4. **Accumulation** — the change persists. Choices compound. The avatar you carry into the next room is the sum of what you've done so far.

The craft lives in step 3: the response has to be felt, not read. No numbers going up. The avatar slumps, the world fogs, the path ahead fractures, the colour drains or returns. **Show the cost (and the recovery) in the body and the world, never in a stat.**

---

## 7. The facets (the heart of the document)

Each facet is a concept from digital life, expressed as a *space*, a *choice*, and an *avatar response*. Pick two or three for the first build — I've flagged a recommended starting set. Each is written as: the idea → the world metaphor → the micro-choice → the mirror → the intended "aha."

### 7a. Fractured attention  ★ recommended starter
- **Idea:** constant switching shreds sustained focus; the mind stops being able to see far ahead.
- **World:** a path forward that is sharp and continuous when you're focused, but splinters into floating shards the more you divide your attention. Draw distance literally shrinks — the horizon closes in.
- **Choice:** a clear path ahead vs. bright, buzzing side-distractions that pull the camera and the avatar off-track. Chasing them feels good and is easy.
- **Mirror:** each distraction chased, the road ahead cracks further and the fog rolls closer. The avatar starts to stumble on the broken ground.
- **Aha:** "I can't even see where I'm going anymore — and I did that one tap at a time."

### 7b. The information flood  ★ recommended starter
- **Idea:** infinite content isn't nourishment past a point; it's a tide you drown in.
- **World:** a rising body of water made of scrolling content — headlines, clips, takes. It's pleasant at ankle depth. It keeps rising.
- **Choice:** keep consuming (the water rises, the visuals get richer and more tempting) or climb out to dry ground (quieter, emptier, a little boring at first).
- **Mirror:** the avatar wades, then swims, then struggles to keep its head up. The more it takes in, the heavier and slower it moves.
- **Aha:** "I thought I was staying informed. I was just going under."

### 7c. The dopamine loop  ★ recommended starter
- **Idea:** variable-reward mechanics are engineered to be pulled again and again, and each pull costs a little.
- **World:** a beautiful slot-machine door / lever. Pulling it is genuinely satisfying — great sound, great feedback, a hit of colour.
- **Choice:** pull again (satisfying, instant) or walk past (nothing happens, which feels like nothing).
- **Mirror:** every pull, the reward flickers a hair duller and the avatar gets a touch smaller / greyer. The satisfaction is real but the returns visibly diminish. The door never says no.
- **Aha:** "It felt great every single time, and I got smaller every single time."

### 7d. The comparison corridor
- **Idea:** curated feeds are highlight reels; measuring yourself against them erodes you.
- **World:** a corridor lined with taller, glossier, radiant avatars living perfect frozen moments.
- **Choice:** stop and linger on each (they glow brighter, yours dims) or keep walking through.
- **Mirror:** the longer you compare, the more your avatar shrinks and greys against the glow.
- **Aha:** "They were never real, and I let them shrink me anyway."

### 7e. The notification storm
- **Idea:** interruption fragments presence; attention gets leased out in tiny involuntary pieces.
- **World:** a calm space that starts pinging — motes of light demanding to be tapped, arriving faster and faster.
- **Choice:** answer every one the instant it arrives (the space never settles) or let them accumulate and pass (uncomfortable at first, then quiet).
- **Mirror:** chasing each ping, the avatar is yanked around and can never complete a single motion. Ignoring them, the storm crests and then dissolves.
- **Aha:** "I never finished a single thought in there."

**Suggested first-build set:** Fractured attention → Information flood → Dopamine loop. They're the three most viscerally translatable to space and body, they escalate nicely, and together they tell one coherent story (I can't focus → I'm overwhelmed → I can't stop). Comparison and notifications are strong expansion rooms for v2.

---

## 8. World structure

Give it a **linear spine** — a guided journey, one room/biome per facet, avatar state accumulating throughout, building to a single reveal. Linear is the right call for advocacy: it concentrates the emotional payoff instead of scattering it across a sandbox.

**The arc:**

1. **Threshold** — a blank, neutral start. The avatar is featureless and calm. A quiet, unhurried tone. No instructions beyond "walk forward." (Establishes the baseline the ending will pay off against.)
2. **The facet rooms** — 2–3 rooms, each running the core loop, each leaving a mark on the avatar. Escalating intensity and stakes. The world grows subtly heavier/dimmer as accumulated cost mounts (or stays lighter, if the player kept making the harder, healthier choices — the world should be able to reflect *either* trajectory, or the reveal has no stakes).
3. **The turn** — the pace breaks. Motion stops. The world goes quiet. The camera comes around to face the avatar for the first time.
4. **The reveal** — the avatar you built looks back at you. Its state is the sum of everything you did. No score, no verdict — just the reflection. This is the "that's me" beat.
5. **The peaceful place** — the world doesn't end on the reveal; it opens out into a calm, unhurried place to simply *be* (see 8.5). This is the positive pole the journey was otherwise missing — the felt experience of the alternative, not a lecture about it.
6. **The card** — offered from within the peaceful place: the reveal resolves into a shareable artifact (Section 10) and a single, gentle, non-preachy invitation.

**On the "either trajectory" point:** the reveal only lands if the ending genuinely *could* have been different. If every playthrough ends in a drowned grey avatar regardless of choices, players feel railroaded and the self-discovery collapses into a scripted guilt trip. The choices must matter enough that a careful player meets a different Second Self than a heedless one. That branching state is the thing that makes it a mirror rather than a movie.

---

## 8.5 The peaceful place (the positive pole)

*Inspiration: James Shedden's cozy-game project "A Peaceful Place" — a world where you can always see the stars, watch the moonlight move on the water, and hear the wind in the trees — and the wider cozy-games movement (no timers, no goals, no stress; a soft place to land).*

The plan as written is almost entirely a *diagnosis* — rooms that show what digital life costs you. That's necessary, but on its own it's just a more artful version of the thing that doesn't work: being told screens are bad. A diagnosis with no destination leaves the user feeling caught, not changed. The peaceful place is the fix.

**What it is.** After the reveal, the world opens out into a small, cozy, sensory place with no goals, no score, and no timer pressure — somewhere to simply *be*. Perpetual soft night; stars always visible; light moving on water; wind you can hear in the trees; generative ambient sound that never loops mechanically. Nothing asks anything of you. Stay ten seconds or ten minutes.

**Why it matters:**
- **It makes the alternative *felt*, not preached.** The whole piece argues for a healthier relationship with attention — the peaceful place *is* that relationship, experienced directly (unhurried, non-extractive presence) instead of described. The contrast with the harm-rooms is the argument: the same chaos-then-quiet-room move that makes *Impulse* land, but now as your home rather than a single beat.
- **It's the ultimate practice-what-you-preach.** A digital-wellbeing piece whose reward is a place that demands nothing of you resolves the one real risk in the feature set — that the return layer becomes just another engagement loop. So **reframe the return layer as the peaceful place you come back to**: not a streak to maintain or a gallery to complete, but a calm you're welcome to sit in. The gallery of past selves can live here as something quiet and ambient (lanterns on the water, stars, small companions), and the session cap ("enough for today") is delivered gently *by* the place, in character.
- **It carries the recovery.** The "tend" moments belong here: in the peaceful place the avatar visibly softens, straightens, regains its colour — recovery made physical. This is where the behaviour-change goal actually lives, and it's the opposite of doom.

**The one hard rule: peace is offered, never earned.** Do *not* gate the peaceful place behind "good" choices — that would rebuild the very shame the design avoids. Everyone arrives here regardless of how their run went; what differs is the *state the avatar arrives in* and how much tending it wants. The message isn't "behave and you may rest," it's "whatever today was, you can put it down now." That framing is what keeps the positive pole compassionate instead of conditional.

**Register.** Warm, hand-crafted, intimate — the cozy-games tonal target, a notch warmer than the contemplative art-game register of the harm-rooms. The shift *into* warmth as you leave the harm-rooms is itself part of the feeling.

---

## 9. The avatar system

The avatar is the payload. Its state should read at a glance and accumulate across rooms along a few legible dimensions. Keep the vocabulary small and consistent so players learn to read it without being told.

Candidate state dimensions (map facet outcomes onto these):
- **Scale** — how big/present vs. small/diminished the avatar is (dopamine, comparison).
- **Clarity** — sharp and solid vs. blurred, foggy, coming apart at the edges (attention, flood).
- **Colour / light** — warm and luminous vs. drained and grey (overall vitality).
- **Posture / motion** — upright and fluid vs. slumped, stumbling, dragged around (notifications, flood).
- **The world's response to it** — how far it can see, how solid the ground is, how much the environment leans toward or away from it.

Design rule: **each facet moves one or two dimensions, not all of them.** That keeps cause and effect legible — the player can feel *which* choices did *what*, which is the difference between a mirror and a mood.

The avatar should never be grotesque or punishing at its worst — diminished, foggy, and small is sadder and more effective than monstrous. Sad-but-recognisable invites empathy; grotesque invites distance.

**Make it read as *you*.** HCI research on future-self and quantified-self avatars finds that *identification* is the decisive variable: avatars carrying the user's own features, and visibly changing in response to the user's behaviour, drive markedly stronger real-world change than generic ones (Objective Self-Awareness theory explains why — a personalised avatar turns attention inward). *The Wilderness Downtown* proved the same for on-rails web pieces: one small personal input (a childhood address) turned a generic sequence into something intimate. So give the user one featherweight act of personalisation *before* the journey — a colour, a shape, a trait, a name — no account and no upload, but enough to make this "my second self" rather than "an avatar." That ownership is the entire emotional bet, and it's cheap to buy.

---

## 10. The reveal and the shareable artifact

People share results, not experiences. The end card is the growth engine, so treat it as a first-class design surface, not an afterthought.

The card should:
- **Show the avatar**, in its final shaped state, as the hero image — a portrait of the self you built.
- **Name it**, gently and specifically, in a way that's true to the run without being an insult. Not a grade ("D-, heavy user"). A characterisation ("The Overwhelmed Wanderer," "The Steady One," "The One Who Kept Pulling"). Warm, a little poetic, non-judgmental.
- **Feel earned and personal** — different runs produce visibly different cards, so sharing one is sharing something about *you*, which is why it spreads.
- **Carry a frictionless link back** to the start, so the receiver is one tap from their own run.
- **Avoid the number.** No screen-time stat, no percentage, no leaderboard rank on the card itself. The number is the shame vector; keep it out.

Optional gentle close after the card: a single quiet line and a way to "sit with it" or begin again — never a listicle of ten tips to fix your life.

---

## 11. The gamification / behaviour layer (kept thin on purpose)

You wanted some behaviour-change and game flavour alongside the advocacy spine. The trick is to add it as a *thin layer* that never competes with the reveal.

Safe ways to add game feel without diluting the point:
- **Legible choice-and-consequence** is already a game mechanic — lean on it rather than bolting on points.
- **A replay hook:** "your Second Self can be different — try again" invites a second, more deliberate run. Replay is where the light behaviour-change lives: the player experiments with the healthier choices and *feels* the different outcome.
- **A "tend" beat**, optional and small: a moment where a healthy choice visibly restores the avatar (clears fog, returns colour), so recovery is felt, not just decline. This keeps it from being purely doom.
- **Collectible "selves"** across runs (a small gallery of the different avatars you've produced) — light, optional, and it rewards exploration of the choice space.

Things to avoid: hard scores, streaks, leaderboards, and anything that turns *this* experience into another engagement-maximising loop — that would be self-refuting given the subject matter. The irony is a trap; stay clear of it.

---

## 12. Tone, art direction, and sound

- **Mood:** contemplative, a little dreamlike, unhurried. Closer to a quiet art game than a bright mobile title. Restraint is the aesthetic.
- **Palette:** a small, deliberate range. Warmth and light = vitality/presence; desaturation and fog = cost. Let colour do narrative work.
- **Form:** simple, stylised geometry over realism — cheaper to build, runs better on mobile, ages better, and reads more clearly as symbolic. The avatar can be almost abstract (a small luminous figure) and still carry huge emotional weight through posture and light.
- **Sound is doing half the work.** Satisfying, escalating audio on the dopamine lever; a rising muffled underwater wash in the flood; sharp fragmenting tones as attention breaks; and *silence* at the turn, which will hit harder than any music. Budget real attention for audio design — in a piece about feeling, it's not decoration.
- **Text:** minimal. Let the space and the body speak. Every word you add is a word that risks tipping into lecture.

---

## 13. Technical approach

Re-platformed to a **static, buildless-capable HTML + JavaScript** project that deploys as a **GitHub Pages subpage** — no server, no backend, no framework runtime. This fits the piece perfectly: it's a linear, scripted, self-contained experience, which is exactly the kind of thing that doesn't need React. The re-platforming is low-risk *because* the design was chosen to be linear and backend-free from the start.

- **Rendering: Three.js, used directly (no React, no React Three Fiber).** Three.js *is* a vanilla-JS library; R3F was only a React wrapper over it. For an on-rails, scripted journey you're authoring a *timeline of scenes*, not managing a reactive UI tree — so the imperative Three.js API (scene, camera, renderer, animation loop) is a clean, natural fit: one fewer abstraction layer, a smaller footprint, and no build step required.
- **Structure: a single `index.html` plus ES modules.** Load Three.js from a CDN via an **import map**, or vendor it locally. The whole thing can begin as one HTML file with a `<script type="module">` and grow into a small `/src` module tree (`main.js`, `state.js`, `/scenes`, `/avatar`, `/share`, `/audio`, `/assets`) as it gets real. No bundler is needed to ship.
- **The one thing you must get right — the subpath.** A GitHub Pages *project* page is served from a subdirectory (`username.github.io/second-self/`), not the domain root. So **every asset path must be relative** (`./assets/…`, never `/assets/…`), or models, textures, and audio will 404 in production while working fine locally. If you later add a bundler, set its base path to the subfolder. This is the single most common way a Pages deployment breaks — design for it from the first commit.
- **State: a plain JS module.** The avatar/world "mirror" state is one small central object in `state.js` with a tiny publish/subscribe (or just direct reads) — no Zustand, no framework store. Both the world and the end card read from this single object; keep it clean and central.
- **2D UI (start screen, card, menus): plain HTML/CSS overlaid on the canvas.** The interface here is deliberately minimal (calm progressive disclosure), so DOM elements layered over the WebGL canvas are lighter and simpler than any component framework.
- **Supporting libraries — all vanilla and CDN-friendly:** **GSAP** (+ ScrollTrigger) to script the on-rails timeline and map the single scroll gesture to scene beats — an excellent fit for this piece; optionally **Lenis** for smooth-scroll feel; **Howler.js** or the raw Web Audio API for sound; Three's own `GLTFLoader` / `DRACOLoader` for models and `EffectComposer` for the *sparing* fog/bloom.
- **Persistence stays fully client-side** — `localStorage` / `IndexedDB` for the return-layer gallery, working identically on Pages with no backend. *Caveat:* every project page under `username.github.io` shares one origin, so storage is shared across all your Pages projects — **namespace your keys** (`secondself:gallery`, …) to avoid collisions. This keeps the "nothing leaves your device" promise literally true.
- **The share card** renders the final avatar to an image (canvas/WebGL snapshot composited with the frame + name), offered via download and the **Web Share API** (`navigator.share`) for the native mobile share sheet — Pages is HTTPS, which the Share API requires. Entirely client-side; no server.
- **Assets & performance — the real constraint (unchanged by the re-platform).** GitHub Pages is static hosting with per-file limits (keep files well under ~50MB; repo lean). Optimise hard: **Draco/meshopt** geometry compression, **KTX2/basis** textures, compressed audio, and load-on-approach so you never ship the whole world at once. Identical to the mobile-first budget already in the plan — the low-poly, stylised art direction is doing double duty. Test on a mid-range Android early and often.
- **Deployment — two clean paths, both buildless:** (a) a dedicated repo `second-self`, enable Pages → live at `username.github.io/second-self/`; or (b) a `/second-self/` folder inside an existing Pages repo, served at the same subpath. If you want a build step later, a **GitHub Actions** workflow (`actions/deploy-pages`) with the base path set to the subfolder handles it — but you don't need one to launch.
- **Analytics, if any:** keep it minimal and anonymous (finished / which ending / shared) and be transparent about it — the whole piece argues for a healthier relationship with tech, so a privacy-friendly, cookieless counter is the only consistent choice.

**What this change does *not* touch:** everything else in this document. The thesis, facets, avatar system, on-rails single-gesture spine, self-contained/no-data promise, share card, and phased roadmap are all stack-agnostic and survive intact. Concretely, Phase 0's "ugly prototype" can now be *literally one HTML file* you open in a browser.

---

## 13.5 Feature set (v1 scope, locked)

The decisions below are locked. What matters isn't the list — it's how they fit together, because two of them pull against each other and the resolution shapes the whole build.

### Session model: one-shot core + optional return layer
The **one-shot journey is the advocacy spine** — the thing you send someone, that they finish once and feel. The **return layer is opt-in** and is where the lighter behaviour-change and game features live. This split is the organising principle for everything else: each feature below belongs to *one* of the two, and keeping that boundary clean is what stops the return layer from bloating the core.

- **Core (one-shot):** the journey, the reveal, the shareable card, immediate replay.
- **Return layer (opt-in, persistent):** *the peaceful place you come back to* (see 8.5) — home to the gallery of past selves, the recovery/tend moments, and the gentle session cap. Framed as a calm to sit in, never a streak to maintain.

### The tension to resolve up front: single-gesture input vs. a navigable 3D world
You chose **single-gesture core input** *and* a walkable 3D world. Taken literally these fight — you can't free-roam an avatar through 3D space with only a scroll or tap. The resolution is clean and actually better: **make the world on-rails.** The world moves past a fixed-position avatar while the user's single gesture does double duty — it advances them through the space *and* is the choice mechanic in each room.

This is a genuinely elegant fit for the subject: if the core verb is **scroll**, the user literally scrolls their way through a world about the cost of scrolling. The gesture indicts itself. (This also resolves the old "camera" open-decision decisively in favour of on-rails.) The honest trade: you give up free-roam exploration and immersion-through-navigation. For a 4–7 minute shareable advocacy piece that must run on any phone, that's the right trade — but name it as a trade, not a default.

### Behaviour-layer features (all in scope)
- **Shareable end-card** — *core.* End of the one-shot journey; the growth engine (Section 10).
- **Replay for a different ending** — *core/bridge.* The immediate "your Second Self could be different — try again" re-entry. This makes a hard requirement of Section 8's branching: the ending **must** genuinely vary with choices, or replay and the gallery have nothing to show.
- **Gallery of past 'selves'** — *return layer.* Requires persistence across sessions (local storage / IndexedDB). A small, growing collection of the avatars you've produced; rewards exploring the choice space.
- **Recovery / 'tend' moments** — *return layer* (with a small taste allowed in-core). Healthy choices visibly restore the avatar — clear the fog, return the colour — so the piece isn't pure doom and recovery is *felt*. This is where the behaviour-change goal actually lives.

### Signature mechanics (all in scope)
- **Single-gesture core input** — resolved to on-rails, above. One learnable verb (lean toward **scroll** for thematic bite, or tap/hold per room).
- **Meaningful session cap ("enough for today")** — governs mainly the *return layer*, and it's thematically perfect: a tool about digital wellbeing that caps your own time on it practices what it preaches. In the one-shot core, the "cap" is simply the natural end of the journey.
- **Visible on-device privacy promise** — dovetails with the gallery's local storage: nothing leaves the device, and you say so plainly. Free trust, and it models the healthy alternative to the extractive apps you're critiquing.
- **Calm progressive-disclosure opening** — this *is* the Threshold (Section 8, step 1): a near-empty, quiet start where mechanics reveal themselves one at a time. No tutorial wall.

### How it all coheres
Three of your choices reinforce each other into one quiet argument: the **gallery** needs persistence → persistence is **on-device** → which you **promise visibly** → and the **session cap** means the app refuses to farm your attention. Together they make the product itself a working example of the healthier relationship it's advocating for. That self-consistency is worth protecting; it's a big part of why the piece would be credible rather than preachy.

---

## 14. Scope and phased roadmap

Resist building the whole thing first. The riskiest assumption is *does the mirror moment actually land* — prove that before you invest in breadth.

**Phase 0 — The vertical slice (prove the feeling).**
One facet only (recommend the **dopamine loop** — it's the most self-contained and the mirror is immediate), a blank start, that one room, and a bare reveal. No card yet. The single question you're answering: does watching the avatar change in response to your own choices produce the "oh… that's me" beat? If it doesn't, everything else is premature. Get this in front of real people.

**Phase 1 — The core journey.**
Add the other two starter facets (fractured attention, information flood), the accumulating avatar state across rooms, the turn, and the full reveal. This is the shippable advocacy artifact.

**Phase 2 — The share engine.**
The end card, the named "selves," the frictionless link-back, mobile share-sheet. This is what turns it from a nice experience into something that travels. Arguably as important as Phase 1 for the advocacy goal.

**Phase 3 — Depth and polish.**
Expansion rooms (comparison, notifications), the "tend"/recovery beat, the collectible gallery, audio polish, the graceful-fallback path, accessibility pass.

Ship Phase 0 as an ugly prototype. Ship Phase 1+2 as the real thing. Treat Phase 3 as optional gravy.

---

## 15. Risks and how to handle them

- **The shame trap.** The single biggest failure mode. Mitigation: obsessively enforce the "awareness not shame" principle, keep numbers off the card, make the diminished avatar sad-not-monstrous, and always leave a door to a better run.
- **The railroad.** If choices don't visibly change the ending, it's a scripted guilt trip, not a mirror. Mitigation: make branching state real and legible; a careful player must meet a different Second Self.
- **Preachiness.** Text and narration are where good intentions go to die. Mitigation: cut words ruthlessly; let the world and body carry meaning.
- **"So what" fatigue.** People know screens are bad; being told again bounces off. Mitigation: the whole design answers this — you're not *telling*, you're letting them *feel it happen to something they made*. Protect that.
- **Mobile performance.** 3D on phones is unforgiving. Mitigation: the stylised low-poly direction, strict budgets, and early mid-range-device testing (see Section 13).
- **Self-refuting gamification.** An engagement-maxing loop about the harms of engagement-maxing loops is a bad look. Mitigation: keep the game layer thin; no streaks/leaderboards.

---

## 16. Open decisions (things to lock next)

Resolved during feature scoping: **session model** (one-shot core + optional return layer) and **camera/navigation** (on-rails, single-gesture — see Section 13.5). Still open:

- Which **2–3 facets** for the first build? (Recommendation on the table: attention, flood, dopamine.)
- **The core gesture:** commit to **scroll** everywhere for thematic bite, or vary it per room (tap / hold)? Scroll is the strongest single choice but check it feels good in 3D on a phone before locking.
- **Ending form:** the ending *must* branch (replay + gallery now depend on it) — open question is only the shape: a continuous spectrum along the avatar-state dimensions, a handful of discrete named "selves," or both.
- **Run length** target — leaning 4–5 min for shareability, or a slower 7–8 min for depth?
- **Session-cap value** for the return layer — what's "enough for today," and how gently is it enforced?
- **The name.** (See below.)

---

## Appendix: name options

*Second Self* is the working title. Other directions, by flavour:

- **The mirror angle:** Second Self · Reflection · The Mirror Walk · Looking Glass
- **The avatar-you angle:** You, Rendered · Little Self · The One You Made
- **The world angle:** Driftworld · The Long Scroll · Downstream · The Feed
- **The quiet/poetic angle:** Undertow · Every Tap · What You Fed It · Small Hours

Pick for how it reads on a shared card next to a small sad-hopeful avatar — that's the context that matters most.

---

## Appendix: references & inspirations

This is the source list behind Sections 5–5.3, curated so it can double as an in-app **"Inspirations / Further reading"** screen — a credits-style page is itself on-brand here, since it models transparency and points people toward better things to do than scroll. Each entry carries what a UI card needs: title, creator, link, and why it's there.

> **Before shipping to production UI, verify every URL.** These are best-known canonical links; a few of these projects have retired or moved their original sites, and links rot. Treat this as a to-be-link-checked list, not a validated one.

**Attention-economy art & net-art**
- *The Endless Doomscroller* — Ben Grosser · `bengrosser.com/projects/endless-doomscroller/` · the reduction mechanic, live.
- *Demetricator / Order of Magnitude / Minus / Go Rando* — Ben Grosser · `bengrosser.com` · "subtraction as intervention."
- *Doomscrolling* — Ben Kovach · (generative-art platforms; search "Ben Kovach Doomscrolling") · swipe-physics realism.
- "Conceptual Art for the Attention Economy" — Jonathan Zong · `jonathanzong.com/blog/2018/02/03/conceptual-art-for-the-attention-economy` · a catalogue of anti-engagement art to mine.
- Net Art Anthology — Rhizome · `anthology.rhizome.org` · the canonical archive.

**Complicity & explorable games**
- *We Become What We Behold* — Nicky Case · `ncase.me/wbwbh/` · complicity in five minutes.
- *The Evolution of Trust* — Nicky Case · `ncase.me/trust/` · systems made playable.
- *Adventures with Anxiety* — Nicky Case · `ncase.itch.io/anxiety` · play *as* the feeling.
- *Explorable Explanations* — community hub · `explorabl.es` · the whole genre.

**Serious & calm games**
- *Sea Hero Quest* — Glitchers / UCL / Alzheimer's Research UK · `alzheimersresearchuk.org` · purpose carried invisibly.
- *Alto's Odyssey* (Zen Mode) — Snowman · `altosodyssey.com` · the no-fail register.
- *Florence* — Mountains / Annapurna Interactive · (App Store / `annapurna.interactive`) · emotion through mechanics.
- *Journey* — thatgamecompany · `thatgamecompany.com` · wordless on-rails emotion.
- *A Peaceful Place* — James Shedden (Kickstarter) · `kickstarter.com/projects/jamesshedden/a-peaceful-place` · the positive pole — a cozy, no-goal sensory world to *be* in (see 8.5).
- The cozy-games movement (*Stardew Valley*, *Animal Crossing*, *A Short Hike*, *Alba*, *Cozy Kingdom*) · the "no timers, no pressure, a soft place to land" register.

**Virtual-pet / avatar-mirror apps**
- *Finch* — Finch Care · `finchcare.com` · shame-free externalised care.
- *Forest* — Seekrtech · `forestapp.cc` · the avatar that lives or dies by your focus.

**Friction / digital-wellbeing tools**
- *one sec* — `one-sec.app` · the pause-at-impulse (PNAS-studied).
- *ScreenZen* — `screenzen.co` · progressive friction.
- *Freedom* — `freedom.to` · cross-device blocking.
- Google Digital Wellbeing Experiments — `experiments.withgoogle.com` · the awareness-first precedent.

**Advocacy & campaigns**
- Center for Humane Technology (*Ledger of Harms*) — `humanetech.com` · the harms catalogue + youth toolkits.
- Log Off Movement — `logoffmovement.org` · youth-led framing.
- 5Rights Foundation — `5rightsfoundation.com` · policy + youth voice.

**Research & the governing principle**
- "Designing for Digital Wellbeing" — Google Design · `design.google/library/designing-for-digital-wellbeing` · the documented awareness-vs-shame lesson (our thesis's backbone).
- "Microboundaries…" — Cox, Gould, Cecchinato, Iacovides & Renfree, CHI EA 2016 · ACM Digital Library · the friction foundation.
- "Monitoring Screen Time or Redesigning It?" — Zhang, Lukoff et al., CHI 2022 · ACM Digital Library · redesign over monitoring.
- "Reducing overuse with one sec" — Marx et al., *PNAS* 2023 · `pnas.org` · the friction evidence base.

**Immersive / 3D comparators**
- *Impulse: Playing With Reality* — ANAGRAM · `impulse-xr.io` · the un-winnable-game mechanic (nearest topical cousin).
- *The Wilderness Downtown* — Chris Milk + Google · `thewildernessdowntown.com` · personalisation on rails.
- *Bury Me, My Love* — The Pixel Hunt / ARTE · `burymemylove.arte.tv` · native device grammar.

*For an in-app screen, this maps cleanly to a list of `{ title, creator, url, note, category }` records — the same four fields used above.*

---

*This is a living document. The thesis in Section 2 is the load-bearing wall; if a future decision undermines the self-discovery moment, that decision is wrong, not the thesis.*


---

# PART B — THE TOOLKIT PLAN

*The container that turns the experience above into a modular, role-aware curriculum. The §12 decision-gate register in this part tracks every open choice.*

# THE SECOND SELF TOOLKIT
### A modular, role-aware toolkit for wide digital-wellbeing literacy

*Plan document — v0.1. Companion to `second-self-concept.md`, which is now the full spec for the "spine" experience described in §4.*

---

## How to read this document

This plan is deliberately built to **stop at the points where a human decision is needed** rather than assume its way past them. Those points are marked inline like this:

> **DECISION GATE —** the question, the options, and my recommendation.

There's a consolidated register of every gate in §12, mapped to the phase each one blocks. Locked decisions (already made) are stated as settled; everything else waits for you.

---

## 1. What this is now

The project has grown from a single short experience into a **toolkit**: a go-to place where anyone can build real literacy about their digital life — what the technology does to attention, why the systems are built the way they are, and what a healthier relationship looks like. The goal is **wide literacy for everyone**, delivered not as a lecture but as a set of short, felt, anecdote-driven interactive lessons you can pick from.

"Second Self" — the symbolic 3D experience specced in the companion document — doesn't disappear. It becomes the **emotional flagship** at the centre of the toolkit: the piece that makes the whole thing *land* rather than merely *inform*.

**Locked so far:** modular toolkit architecture · 3D reserved for emotional peaks, 2D-interactive for breadth · all four roles (individual, student, educator, parent) · static vanilla HTML + JS + Three.js on GitHub Pages · self-contained / on-device.

---

## 2. The governing thesis (unchanged, and load-bearing)

A curriculum teaches lessons; our thesis says *never lecture.* These reconcile only one way, and it's the rule the whole toolkit is built on:

**Every lesson is an experience or a story that lands on its own. The explicit teaching is a light, optional "unpack" that comes *after* the feeling — never before it, never instead of it.**

Keep this and it's a course with a soul. Lose it and it's a slideshow saying screens are bad — the exact thing that changes no one. The awareness-not-shame principle (documented from Google's own team, see the concept doc) governs every screen: the toolkit observes and reflects; it never scolds, scores, or wags a finger.

---

## 3. Architecture at a glance

One shared foundation, built once, seen through a role lens, producing role-specific take-home tools. (The diagram shared in chat is the canonical picture.)

- **A hub** — the peaceful place doubles as home: you launch into calm, choose a lesson, and return here between them.
- **A shared foundation** — the 3D emotional spine (built once) plus a library of 2D-interactive mini-lessons (content-as-data).
- **A role lens** — the selected role reorders and reframes what's surfaced, swaps the anecdotes and examples, and attaches role-specific outputs. It changes defaults; it never gates. Anyone can reach anything.

The engineering consequence that makes this affordable: **role support scales with content, not code.** Lessons are data with role variants; the role just selects which variant to render.

---

## 4. The shared foundation

### 4a. The 3D emotional spine (built once, shared by all roles)
This is the Second Self experience: the on-rails, single-gesture symbolic journey through the harm-rooms, the reveal ("that's me"), and the opening-out into the **peaceful place**. Full spec lives in `second-self-concept.md`. In the toolkit it plays three parts: the flagship first-run experience, the emotional payoff the lessons build toward, and — as the peaceful place — the hub you always return to.

### 4b. The module library (the breadth, in 2D)
A growing set of short interactive mini-lessons, each dramatising one idea through an anecdote and a mechanic. These are **2D-interactive** (cheaper, faster to build, mobile-friendly), reserving the expensive 3D for the spine and any rare emotional peak. Each is small, self-contained, and picked from the hub in any order.

---

## 5. The curriculum (module map)

A genuine literacy curriculum, grouped into four strands. Each module is an anecdote-driven felt lesson, not a reading. Medium: **[3D]** = part of the spine; **[2D]** = interactive mini-lesson.

**Strand A — Attention & the mind** (how the tech acts on you)
- Fractured attention **[3D]** · Information flood **[3D]** · The dopamine loop / variable reward **[3D]** · Notification interruption & task-switching **[2D]** · Doomscrolling & the dissociative scroll **[2D]**

**Strand B — The machine** (how the systems work)
- How feeds & algorithms choose what you see **[2D]** · The attention economy: how "free" pays for itself **[2D]** · Engagement design & dark patterns (infinite scroll, autoplay, pull-to-refresh) **[2D]** · Monetised outrage: why anger travels **[2D, complicity mechanic]**

**Strand C — You & others** (identity, social, truth)
- Social comparison & the highlight reel **[2D]** · Online identity & self-presentation **[2D]** · Misinformation & how to check it **[2D]** · Privacy & your data footprint **[2D]**

**Strand D — Repair & agency** (what you can do)
- Rest & recovery (the peaceful place) **[3D]** · Micro-boundaries: the pause at the impulse **[2D]** · Designing your own defaults (notifications, grayscale, intentional use) **[2D]** · Talking about it (peer & family conversations) **[2D]**

> **DECISION GATE — v1 module set.** My recommendation for a shippable, coherent v1: the three spine modules (attention, flood, dopamine) + the peaceful place, plus three 2D modules that complete the arc — **feeds & algorithms** (how it works), **social comparison** (you & others), and **micro-boundaries** (what to do). Seven modules that tell one full story: *what it does to me → why → what I can do.* The remaining eleven become the post-v1 growth path. Your call on the exact set and count.

---

## 6. Anatomy of a lesson (the repeatable template)

For a modular toolkit to stay buildable and consistent, every module follows one shape:

1. **Hook** — a short anecdote or vignette that sets a relatable situation (role-flavoured).
2. **Felt interaction** — the core mechanic: the user *does* the thing and it happens to them (built on one of the four proven mechanics — abstraction, complicity, un-winnable loop, living avatar).
3. **The turn** — a beat where the interaction's cost or pattern becomes visible.
4. **Light unpack** *(optional, skippable)* — two or three lines of "here's why this happens," with a link to a source in the references appendix. Never more.
5. **Take-home** — one role-specific artifact or reflection (see §7), then back to the hub.

> **DECISION GATE — anecdote style.** Options: (a) **true real-world stories/cases**, (b) a **small cast of recurring fictional characters** grounded in real research, (c) **research-driven scenarios** (no named characters), (d) **the learner's own reflection** as the anecdote. My recommendation: (b) a small recurring cast — reusable across modules and roles, relatable enough for students to see themselves, and it sidesteps the privacy/copyright issues of real people while staying grounded in real findings. Your call, since this sets the toolkit's whole voice.

---

## 7. The role system (all four, v1)

The same foundation, four lenses. What changes is framing, examples, which modules surface first, tone, and the take-home tool.

| Role | Framing / goal | Example flavour | Surfaced first | Take-home tool | Needs backend? |
|---|---|---|---|---|---|
| **Individual** | "understand my own habits" | personal, introspective | attention · dopamine · defaults | reflection journal + shareable card | no |
| **Student** | "this is your world" | peer voice, feed-native | comparison · algorithms · outrage | shareable card + reflection | no |
| **Educator** | "run it with a class" | structured, cited, time-boxed | any, sequenced into a lesson | printable lesson plan + slides + discussion guide | **v1: no** (materials only) |
| **Parent** | "talk with my kid" | reassuring, practical, non-surveillance | comparison · algorithms · healthy habits | conversation cards + family-agreement template | no |

The **core felt experiences stay universal** — everyone walks the same spine and the same peaceful place. Roles only reshape the layer around them.

> **DECISION GATE — educator scope in v1.** Educators need materials (lesson plans, slides, discussion prompts) *or* a managed classroom (assign lessons, track a group's progress). The first is fully static and can ship in v1 as generated downloadable/printable assets. The second needs accounts + a backend and breaks the zero-infrastructure model. My recommendation: **v1 gives educators self-serve downloadable materials only; group management is a separate later backend phase.** Confirm, or pull group features forward (and accept the backend now).

---

## 8. Gamification & "literacy proof"

The game layer has to be genuinely non-extractive, or the toolkit contradicts its own message. So:

- **Progress is ambient, not gamified.** Show it as the peaceful place filling in — a star or lantern per module completed — not XP, not streaks, not a leaderboard. (Streaks are the exact engagement trick we're critiquing; using them would be self-refuting.)
- **The hub is the map.** Returning to the peaceful place and seeing your constellation grow *is* the progression.

> **DECISION GATE — does "literacy" need proof?** Option A: **purely experiential** — finishing the felt lesson is enough. Option B: each lesson ends with a tiny reflective act (a one-line "field note" the learner writes, or a small choice/challenge) that becomes the literacy signal and feeds the Individual's journal / the Educator's completion checklist. My recommendation: **Option B, kept feather-light** — a single reflective beat per lesson deepens retention and gives educators something real to see, without ever becoming a quiz or a grade. Your call on how much "showing understanding" to ask for.

---

## 9. Technical implementation

Carries the stack from the concept doc (§13 there) and extends it for the toolkit.

- **Static vanilla HTML + JS + Three.js**, deployed as a **GitHub Pages subpage**. No framework runtime, no server for v1. (Relative asset paths for the subpath; namespace `localStorage` keys — see concept doc §13.)
- **Content-as-data is now mandatory, not optional.** A "curriculum" that can't grow without re-coding isn't one. Every lesson is a data record; the app is an engine that renders records. Sketch:

```
Lesson = {
  id, strand, title,
  medium: "2d" | "3d",
  mechanic: "abstraction" | "complicity" | "unwinnable" | "avatar",
  assets: [...],
  variants: {                     // the role lens reads these
    individual: { hook, examples, takeHome },
    student:    { hook, examples, takeHome },
    educator:   { hook, examples, lessonPlan, slides },
    parent:     { hook, examples, conversationCards }
  },
  unpack: { text, sources: [refIds] },   // links into the references appendix
  literacyCheck: { type: "reflection" | "choice" | null }
}
```

- **3D only for the spine/peaks; 2D-interactive for the module library** — keeps the build tractable and mobile-safe.
- **Persistence on-device** (localStorage/IndexedDB): role, progress, journal, gallery. No accounts in v1.
- **Educator materials are generated static assets** (printable lesson plans, slide exports) — no backend.
- **Backend is deferred and isolated** — needed *only* for educator group management, cross-device accounts, and a future workplace role. Designing v1 around content-as-data + local persistence means this can be bolted on later without a rewrite.

> **DECISION GATE — reach & localisation.** Web-only, or also installable/offline (PWA), and — since it's "for everyone" — localised into multiple languages? Content-as-data makes localisation a matter of translating records, not re-coding, so it's cheap *if designed in from the start*. Recommendation: build the content layer i18n-ready now, ship English-first, add a PWA wrapper in a later phase. Your call on which languages, and whether offline matters for v1.

- **Accessibility as a first-class constraint:** `prefers-reduced-motion` honoured, keyboard navigable, and a graceful lower-fidelity / 2D fallback for weak devices and the 3D spine.

---

## 10. The hub

The peaceful place is the home screen. First-time visitors are offered the spine (the Second Self journey) as the flagship first experience; returning visitors land straight in the calm and choose a module. The role picker lives here (optional, switchable, default Individual). Progress shows ambiently as the place fills in. This unifies three earlier ideas — the hub, the return layer, and the peaceful place — into one screen that is both the map and the reward.

---

## 11. Phased roadmap (with gates)

- **Phase 0 — Prove the feeling.** The dopamine-loop room as a single HTML file; confirm the "that's me" mirror moment lands. Nothing else matters until it does. *(Concept doc §14.)*
- **Phase 1 — The foundation.** The spine journey + the peaceful-place hub + the content-as-data engine + the first 2–3 modules + the Individual role. This is the first coherent, shippable toolkit. *Gate: v1 module set (§5); anecdote style (§6).*
- **Phase 2 — Breadth & roles.** The rest of the v1 module set; the Student and Parent lenses (framing, examples, take-home tools); the shareable card and the gallery. *Gate: literacy-proof model (§8).*
- **Phase 3 — Educator (static).** Generated printable lesson plans, slides, and discussion guides. No backend. *Gate: educator scope (§7).*
- **Phase 4 — Backend (optional).** Accounts, educator group management, cross-device progress, workplace role. Only if the earlier gate pulled it in. *Gate: reach & localisation (§9).*

---

## 12. Decision-gate register (the human-intervention checklist)

The full set of open choices, so nothing gets decided by default. Bring me any of these and I'll work it through; until then the plan holds them open.

| # | Decision gate | Status | Blocks |
|---|---|---|---|
| — | Architecture (modular toolkit) | **locked** | — |
| — | 3D scope (peaks only) | **locked** | — |
| — | Roles in v1 (all four) | **locked** | — |
| — | Tech stack (static / Three.js / Pages) | **locked** | — |
| 1 | v1 module set (§5) | open | Phase 1 |
| 2 | Anecdote style (§6) | open | Phase 1 |
| 3 | Literacy proof: experiential vs reflective (§8) | open | Phase 2 |
| 4 | Educator scope: materials vs managed class (§7) | open | Phase 3/4 |
| 5 | Reach & localisation; PWA/offline (§9) | open | Phase 4 |
| 6 | Toolkit name / brand (§13) | open | anytime |

---

## 13. Open naming

Working umbrella: **the Second Self Toolkit**, with *Second Self* as the flagship experience inside it. Alternatives welcome — the umbrella could stay "Second Self," or the toolkit could take its own name with Second Self as one component. (Name candidates for the experience itself live in the concept doc appendix.)

---

## 14. What carries over unchanged

The entire `second-self-concept.md` remains valid as the **spec for the spine** (thesis, facets, avatar system, on-rails single-gesture, reveal, peaceful place, feature set, references/inspirations). This document sits above it, describing the toolkit that the spine now anchors. If any decision here ever undermines the self-discovery moment at the heart of the spine, that decision is wrong — the thesis in §2 is still the load-bearing wall.


---

# PART C — LANDSCAPE & INSPIRATIONS SURVEY

*A design survey of the digital-wellbeing landscape: what already exists, and where Second Self is genuinely distinct. Extended annotated write-ups behind the concept doc's prior-art sections (Part A §5.1–5.3).*

## TL;DR
- The field is crowded with **flat-screen tools** (dashboards, blockers, friction apps) and **2D net-art** (Ben Grosser, Nicky Case), but an **on-rails, symbolic, avatar-driven 3D world about the attention economy is essentially unoccupied**. The only close immersive comparator, ANAGRAM's *Impulse: Playing With Reality* (Achievement Prize, 81st Venice International Film Festival, Sept 2024; a 2025 Emmy winner), is a 40-minute headset MR piece about ADHD/dopamine, not a shareable web experience about doomscrolling.
- The single most validated design lesson is **awareness, not shame**: Google's own digital-wellbeing team documented that prescriptive framing provoked backlash, concluding that what was meant to be supportive felt like shaming for some people. The best works (Grosser, Case, Finch, calm games) win by making a mechanic *felt* and letting the user draw their own conclusion.
- The mechanics that best translate abstract harms into felt experience are **abstraction/reduction** (strip content, leave only the compulsive gesture — *Endless Doomscroller*), **role-reversal/complicity** (you cause the harm — *We Become What We Behold*), **the un-winnable game** (fail on purpose — *Impulse*), and a **living avatar that mirrors your state** (Finch, Forest). Second Self should combine the award-winning WebGL scrollytelling FORM with the attention-economy TOPIC — a combination almost no one has shipped.

## Key Findings

**1. The white space is real and specific.** Across Venice Immersive, SXSW XR, and the WebGL award scene there is abundant *craft* (symbolic on-rails scroll journeys) and abundant *topic* (attention-economy critique) — but almost nothing that fuses them. Attention-economy critique overwhelmingly lives in documentary film (*The Social Dilemma*), 2D browser net-art, and utility apps. A 3D, embodied, symbolic, shareable web world about your own digital habits would be close to unique.

**2. "Awareness, not shame" is the governing principle, documented from the inside.** Google's own team published in Google Design's *Designing for Digital Wellbeing* essay that raising screen-time awareness backfired into shame during COVID; users pushed back on prescriptive rules. Their pivot — better defaults, context over raw metrics, compassion, and putting individuals in control while equipping them to make good choices — is the exact posture Second Self aims for.

**3. Reduction and abstraction are the strongest "felt harm" mechanics.** The works that land hardest strip away specifics until only the compulsive *structure* remains, so the user feels the pattern rather than being lectured about it.

**4. Complicity beats accusation.** The most memorable advocacy games implicate the player in the harm (you are the media; you are the algorithm), producing a self-authored "oh — I do this" moment no dashboard can.

**5. A living avatar/creature is the proven vehicle for shame-free behavior change.** Virtual-pet lineage designs (Finch, Forest, Flora, Habitica) externalize the user's state onto a character you care for, converting self-criticism into care for something else.

## Details

### Category 1 — Interactive web art & net-art about attention and doomscrolling
- **Ben Grosser — body of work.** Grosser (Professor of New Media, University of Illinois; Berkman Klein affiliate) is the definitive artist here. Beyond *The Endless Doomscroller*, his relevant pieces include **Demetricator** (browser extensions that hide all metrics — likes, counts — on Facebook, Twitter/X, and Instagram), **Order of Magnitude** (a supercut of every time a tech CEO says "more," "grow," or a metric), **Minus** (a social platform giving each user only 100 lifetime posts, ever), **Go Rando** (obfuscates your Facebook emotional reactions), and the *Software for Less* exhibition (arebyte Gallery, London). *Design lesson:* **subtraction as intervention** — remove or scramble one interface element (metrics, content, post-count) so the manipulation becomes visible.
- **The Endless Doomscroller** (Grosser) — infinite single-gesture scroll of escalating generic dread, content removed so only the mechanic remains. *Lesson:* the gesture itself is the argument.
- **Doomscrolling** (Ben Kovach) — a physics-accurate generative animation of an iPhone feed made of the word "DOOM." *Lesson:* simulating the exact swipe *physics* (inertia, friction) is what makes a symbolic scroll feel like *your* phone.
- **Jang Seungkeun** — a Gen-Z painter who renders Google-image-search results as trading cards to comment on post-truth information overload. *Lesson:* the "collectible card" frame is a legible metaphor for how feeds turn everything into interchangeable stimulus.
- **Curatorial sources:** Jonathan Zong's essay "Conceptual Art for the Attention Economy"; Rhizome's Net Art Anthology.

### Category 2 — "Experiments" platforms and viral browser toys
- **Neal.fun (Neal Agarwal).** The reference point for viral, single-idea, low-onboarding toys: **Stimulation Clicker** (Jan 2025; a Cookie-Clicker parody built to capture "the experience of being terminally online" — it piles on notifications, autoplay video, and sound until the screen is chaos); **Life Stats / Life Checklist** (enter your birthday → see how much of your life you've spent); **The Size of Space** and **Speed** (scroll-driven scale visualizations). *Lesson:* one clear idea, zero tutorial, instantly shareable. Stimulation Clicker proves that *simulating overload to the point of absurd comedy* is a shame-free way to make people feel it.
- **Google Digital Wellbeing Experiments platform** — note the open-sourced "Hack Pack" and that all experiments are framed as self-experiments ("use for a day, a week, however long is helpful"), never mandates.

### Category 3 — Serious games / games-for-change that make you FEEL a harm
- **Nicky Case** is the single most transferable creator for Second Self. *We Become What We Behold* (a 5-minute browser game where you photograph circles and squares; capturing anger goes viral, escalating to violence — *you* are the outrage-media loop; public domain), *The Evolution of Trust* (interactive game-theory), *Adventures with Anxiety* (you play *as* the anxiety), and the *Explorable Explanations* hub. Case's philosophy — "education is empathy," everything remixable, "show, then tell." *Lesson:* **make the player complicit** and keep it under five minutes.
- **Sea Hero Quest** (Glitchers, with UCL, UEA, Alzheimer's Research UK, Deutsche Telekom, 2016) — a beautiful boat-navigation game that secretly gathered the world's largest spatial-navigation dataset; per Alzheimer's Research UK it was played over 117 years by 4.3 million people, providing data that would have taken traditional research 176 centuries to collect. *Lesson:* a game can carry a serious purpose invisibly, and players tolerate — even enjoy — data collection when told upfront and given a beautiful, low-pressure experience.
- **Calm/contemplative games** — *Journey*, *Flower*, *Abzû*, *GRIS*, *Prune*, *Monument Valley*, *Alto's Odyssey* (esp. its **Zen Mode**: no score, no "game over," you just tap and continue). *Lesson:* the "no-fail, no-score, single-touch, weather-like" aesthetic is exactly the register a shame-free advocacy piece should adopt.
- **Indie games about phone/online life** (itch.io) — *Connected* (phone addiction), *Dopamine Dash* ("Dopey, the manifestation of your chronically online brain"). *Lesson:* small, single-session, emotionally specific games are a proven shame-free format.

### Category 4 — Virtual-pet / avatar-mirrors-you designs
- **Finch, Forest, Flora, Habitica, Pou** (Tamagotchi lineage) — all externalize the user's behavior onto a creature you nurture. Forest's tree *dies* if you leave the app; Finch's bird thrives when you do self-care. *Lesson:* **displace self-judgment onto care for a character.** This is the emotional engine most directly applicable to Second Self's avatar.
- **Academic backing:** HCI/health research (future-self avatar RCTs; "quantified self" avatar studies) finds avatar **identification** is the crucial variable — users who saw their *own* features on an avatar, and avatars that visibly *change* in response to behavior, sustained behavior change more. Objective Self-Awareness theory explains why a personalized avatar directs attention inward. *Lesson:* the more the avatar reads as *you* and visibly changes, the stronger the effect — but keep the change shame-free.

### Category 5 — Digital-wellbeing apps and features beyond the mainstream
- **Friction / intention-prompt apps:** **one sec** (a forced deep-breath before an app opens — the most-studied: Marx et al., *PNAS* 2023, found ~36% of app-opens abandoned after the pause, and ~37% fewer opens over six weeks), **Clearspace**, **ScreenZen** (progressive friction), **Jomo**, **Roots**, **Opal**, **Brick**, **Freedom**, **unpluq**.
- **Minimalist launchers / grayscale advocacy:** **Olauncher** ("Are you using your phone, or is your phone using you?"), **Before Launcher**, **Blloc Zero 18**; grayscale-mode advocacy.
- *Lesson:* the winning micro-pattern is the **micro-boundary / pause-at-the-point-of-impulse** — a breath, a question, a small delay inserted exactly where the compulsive tap happens. Recurring failure mode: users **habituate** to any fixed friction, so novelty and variation matter.

### Category 6 — Advocacy orgs, campaigns, documentaries
- **Center for Humane Technology** (Tristan Harris, Aza Raskin; grew out of "Time Well Spent") — companion to *The Social Dilemma*; the **Ledger of Harms**, a **Youth Toolkit**, and courses. *Lesson:* pairs a felt narrative (the film) with light, non-preachy self-reflection tools — but its assets are mostly text/curricula, leaving the *felt-experience* niche open.
- **Log Off Movement** (Emma Lembke, 2020), **5Rights Foundation** (drove the UK Age-Appropriate Design Code), **#GoodforMEdia** (Stanford), **Mothers Against Media Addiction**. *Lesson:* youth-led, peer-to-peer framing avoids the "adults lecturing teens" trap.
- **Museum/gallery installations** — Grosser's *Software for Less*; interactive installations that redirect the phone into a "wand." *Lesson:* physical/spatial framing invites slow, embodied attention.

### Category 7 — Academic prototypes on friction, mindful interaction, awareness-vs-shame
- **"Design Frictions for Mindful Interactions: The Case for Microboundaries"** (Cox, Gould, Cecchinato, Iacovides & Renfree, CHI EA 2016) — the foundational paper; friction/microboundaries disrupt "mindless" automatic interactions, likened to "having a credit card in a block of ice."
- **"Monitoring Screen Time or Redesigning It?"** (Zhang, Lukoff, Rao, Baughan, Hiniker, CHI 2022) — argues for *redesigning* the experience over merely *monitoring* it.
- **Infinite scroll & "normative dissociation"** research — infinite scroll induces a dissociative, self-awareness-diminishing state; adding friction improves recall but frustrates users.
- **"In my defense, only three hours on Instagram"** (arXiv 2025) — argues digital-wellbeing tools should move beyond restrictive screen-time controls toward reflective practices. *Lesson:* the literature has moved from tracking/shame to awareness/reflection/redesign — Second Self is aligned with the research frontier.

### Category 8 — 3D / WebGL / immersive / VR about attention (the rarest category)
- **Impulse: Playing With Reality** (ANAGRAM — May Abdalla & Barry Gene Murphy; narrated by Tilda Swinton; Meta VR for Good) — a 40-minute room-scale Meta Quest 3 MR documentary about ADHD, built around dopamine loops. Its first half is a deliberately **un-winnable mini-game** where you embody a dopamine-depleted brain drowning in information; then a bare shadow room — the emotional contrast *is* the message. Achievement Prize at the 81st Venice International Film Festival (Sept 2024); 2025 Emmy. Its predecessor **Goliath: Playing With Reality** (2021, schizophrenia; Venice Grand Jury Prize) proves symbolic on-rails "inner-state" VR can win top awards. *Lesson:* **make the user fail on purpose.**
- **The Wilderness Downtown** (Chris Milk + Google Creative Lab, 2010) — landmark browser experience; you type your childhood address and an on-rails music journey personalizes itself with Street View of *your* neighborhood. *Lesson:* one piece of personal input turns a generic on-rails piece into something intimate — a template for a personalized, shareable end card.
- **Bury Me, My Love** (The Pixel Hunt + Figs + ARTE) — a refugee story told entirely through a WhatsApp-style chat, with real-time push notifications on your phone. *Lesson:* use the device's own native grammar (chat bubbles, notifications) as the medium.
- **From the Main Square** (Pedro Harres, SXSW XR 2023) — an on-rails symbolic VR allegory of a civilization that rises and destroys itself. *Lesson:* a symbolic rise-and-fall arc can carry critique without literal representation.
- **Formal WebGL/Three.js craft references:** award-winning scroll journeys (Awwwards Three.js collection, FWA) — recurring craft lesson: **"five scenes, not fifteen"**; cut aggressively, treat scroll like a film timeline, and calibrate pacing/performance for mobile.
- **Verdict:** VR/3D pieces *specifically* about phones/doomscrolling/notifications are essentially absent. *Impulse* is the nearest topical cousin (ADHD/dopamine) and it's a headset piece, not a shareable link. **Second Self occupies genuine white space by combining the WebGL scrollytelling form with the attention-economy topic in a free, shareable, no-headset format.**

## Recommendations (design)
1. **Lock the tone before building:** "awareness, not shame" as a written constraint. No red numbers, no "you wasted X hours." Every harm is shown as something that *happens to* the avatar/world, which the user observes. *If testers report feeling "judged" or "caught," rework the beat.*
2. **Prototype the three highest-leverage mechanics as isolated beats:** (1) a reduction/de-metricated scroll (Endless Doomscroller + Demetricator); (2) a complicity beat where the user's own gesture causes the harm (We Become What We Behold); (3) a living-avatar mirror that shifts state as the journey progresses (Finch/Forest + identification research), recovering gently at the end.
3. **Nail entry and exit:** Neal.fun's "open it and go," zero tutorial, single gesture; one lightweight personalization input (The Wilderness Downtown); an affirming, curiosity-driven shareable result card (not a scorecard of shame).
4. **Respect the craft ceiling:** "five scenes, not fifteen," mobile-first, `prefers-reduced-motion` and a static fallback, core under ~5 minutes, an optional lightweight return layer.

## Caveats
- **Immersive-VR effectiveness claims** (e.g., *Impulse*'s impact) come partly from publisher-commissioned studies — read as advocacy; its awards are independently verifiable.
- **Some app-comparison and "best interactive websites" sources are SEO/marketing content** — the app *mechanics* are reliable, but ranking/effectiveness claims from vendor blogs should be treated skeptically. Named primary sources (Grosser, Case, Venice Biennale, Games for Change, Google Design, CHI/ACM, PNAS) are the trustworthy backbone.
- **Friction habituation is a well-documented failure mode** — any single fixed mechanic loses power with repetition, which is precisely why a one-shot symbolic experience is a defensible strategic choice for Second Self.


---

# PART D — CONTENT EVIDENCE BASE

*Evidence-based content and source reference for the toolkit's lessons. Each topic separates (a) established findings, (b) contested/mixed evidence, and (c) weak or debunked popular claims, with sources and years. This is the "unpack" material and the accuracy floor for every module.*

## TL;DR
- **The strongest, most defensible material is about mechanisms** (task-switching costs, variable-ratio reinforcement, negativity bias, moral-emotional virality) and **how the systems are built** (infinite scroll, dark patterns, engagement optimization). The **weakest** are popular causal/quantitative claims ("dopamine detox," "social media is destroying teens" as settled fact, the "8-second goldfish attention span," the "23-minutes-15-seconds" recovery figure).
- **For "awareness, not shame," use a three-tier convention:** teach the *mechanism* as established, present *harm-size and causation* debates as genuinely contested, and explicitly flag the *debunked pop-science* so lessons never repeat myths.
- **Behavior-change evidence is humbling:** friction/nudge tools like "one sec" have real short-term effects, but most screen-time interventions show small, inconsistent, often short-lived effects on low-certainty evidence — so lessons should frame tools as personal experiments, not cures.

---

## STRAND A — Attention & the Mind

### 1. Fractured attention / continuous partial attention
**Established.** Task-switching carries real, measurable cognitive costs (Rubinstein, Meyer & Evans, 2001, *JEP:HPP*). David Meyer's widely-quoted interpretation is that switching can cost "as much as 40 percent" of productive time (APA summary) — a researcher's estimate, not a constant. Sophie Leroy (2009, *OBHDP*) established **"attention residue"**: switching tasks leaves part of your attention behind, degrading the next task. Gloria Mark (UC Irvine, *Attention Span*, 2023) reports average on-screen attention fell from ~2.5 minutes (2004) to ~75 seconds (2012) to ~47 seconds recently (median 40s), and says it's been replicated.

**Unpack:** Every switch forces "goal shifting" then "rule activation," and leftover residue means fewer resources for the new task — multitasking feels productive but leaks time and focus.

**Nuance:** Mark resists the fatalistic "our attention is broken" framing: our ability to focus isn't lost, the *way* we focus is changing (environment, stress, design). **Debunked:** the "Microsoft/goldfish 8-second attention span" claim is a myth from a non-peer-reviewed consultancy citation.

**Anecdote seeds:** (a) sitting down to study, three tabs later a minute gone; (b) returning from a Slack ping unable to recall the sentence you were mid-writing.

**Reference links:** apa.org/topics/research/multitasking · ideas.repec.org/a/eee/jobhdp/v109y2009i2p168-181.html · gloriamark.com/attention-span

### 2. Information overload / decision fatigue
**Established-ish.** Working memory is sharply limited; heavy input forces low-quality shortcuts. **Contested:** "decision fatigue"/"ego depletion" are popular but scientifically shaky — the ego-depletion literature failed key large-scale replications. Don't state "willpower is a depleting fuel tank" as fact. **Unpack:** More inputs than working memory can hold pushes you to shortcuts; the *feeling* of overwhelm is real even where "depletion" is uncertain.

### 3. The dopamine loop / variable-ratio reinforcement
**Established mechanism.** Variable-ratio reinforcement (Skinner) — rewards on an unpredictable schedule — is the most powerful, extinction-resistant schedule, shared by slot machines and feeds. Natasha Dow Schüll's *Addiction by Design* (2012) documents how machine gambling engineers "time on device" and the "machine zone." Tristan Harris popularized "a slot machine in your pocket."

**Critical correction (a flagship myth-busting lesson).** Dopamine is *not* a "pleasure chemical" you "get hits of" and "deplete." Building on Wolfram Schultz's work, dopamine encodes **reward prediction error** and drives *anticipation/seeking*, not the pleasure of receiving; uncertainty maximizes the signal. So **"dopamine detox" is scientifically incoherent as marketed** — you can't "fast from" a neurotransmitter; what shifts is your *baseline expectations*.

**Unpack:** The pull to check isn't about how good the reward is — it's that your brain can't predict *whether* there's a reward this time, and unpredictability keeps you seeking.

**Reference links:** press.princeton.edu/books/paperback/9780691278285 · psychologytoday.com/us/blog/between-cultures/202506/dopamine-decoded-5-myths-10-facts · ncbi.nlm.nih.gov/pmc/articles/PMC6760455

### 4. Notification interruption & task-switching
**Established.** Mark, Gudith & Klocke (2008, CHI, "The Cost of Interrupted Work") found interrupted workers completed tasks faster but at significantly higher stress, effort, and pressure; even brief interruptions carry a recovery cost. **Sourcing caveat:** the famous "23 minutes 15 seconds to refocus" figure is not cleanly traceable to a published result — present as "roughly 20+ minutes, per Mark's interviews." **Unpack:** the interruption is short; the cost is the reload — rebuilding the mental context.

**Reference links:** blog.oberien.de/2023/11/05/23-minutes-15-seconds.html

### 5. Doomscrolling & the "zombie scroll" (normative dissociation)
**Established (emerging but solid).** Baughan et al. (2022, CHI) showed infinite feeds increase **normative dissociation** — absorbed, low-self-awareness states with disrupted memory — and frame it as a *normal* state (like getting lost in a book), disruptable by time-limit dialogs and usage stats. Doomscrolling exploits **negativity bias**; term popularized by journalist Karen Ho (2020). **Unpack:** infinite scroll removes stopping cues, so the moment to stop never arrives; negativity bias holds you on distressing content. **Editorial:** keep non-pathologizing — the *design*, not the user, removed the exits.

**Reference links:** dl.acm.org/doi/fullHtml/10.1145/3491102.3501899 · arxiv.org/pdf/2407.18803

## STRAND B — The Machine

### 6. Recommender/feed algorithms
**Established.** Feeds rank content to maximize engagement (dwell, likes, shares, watch time). Eli Pariser's *The Filter Bubble* (2011) warned of personalized isolation. **Strongly contested — present the correction.** The Reuters Institute review (Fletcher et al., Oxford) finds echo chambers "much less widespread than commonly assumed," "no support for the filter bubble hypothesis," and mostly *diverse* media diets; a 2020 *MIS Quarterly* review calls the evidence "inconclusive." (Pariser is an activist/entrepreneur, not an academic.) **Unpack:** the feed shows you what keeps you engaged — but doesn't seal most people in an airtight bubble as strongly as feared.

**Reference links:** reutersinstitute.politics.ox.ac.uk/echo-chambers-filter-bubbles-and-polarisation-literature-review · policyreview.info/concepts/filter-bubble

### 7. Attention economy / how "free" apps monetize
**Established.** Ad-funded platforms sell attention and behavioral prediction — "if you're not paying, you're the product." Shoshana Zuboff's *The Age of Surveillance Capitalism* (2019) names the extraction of behavioral data sold in "behavioral futures markets." Tim Wu's *The Attention Merchants* (2016) traces the model's long pre-internet history. **Balance:** Wu is a useful corrective — the model isn't wholly new, and Zuboff's sweeping claims are debated; keep it analytical, not conspiratorial. **Unpack:** the product being optimized is your engaged time, because that's what's sold.

**Reference links:** hbs.edu/faculty/Pages/item.aspx?num=56791 · nybooks.com/articles/2020/04/09/bigger-brother-surveillance-capitalism

### 8. Persuasive design & dark patterns
**Established.** Infinite scroll was popularized by **Aza Raskin (2006)**, who publicly regrets it and co-founded the Center for Humane Technology (2018) — though Microsoft engineers claim an earlier patented invention, so credit Raskin as *popularizer/critic*. **Pull-to-refresh** (Loren Brichter, ~2008–2009) is likened to a slot-machine handle. **B.J. Fogg** founded Stanford's **Persuasive Technology Lab (1998)** and the **Fogg Behavior Model, B=MAP**. **Harry Brignull coined "dark patterns" (2010)** with a ~12-pattern taxonomy (roach motel, confirmshaming, privacy zuckering, forced continuity…), now embedded in EU law (GDPR, DSA) and FTC enforcement; Mathur et al. (Princeton, 2019) documented them across ~11,000 shopping sites. **Balance:** Fogg disputes the "addiction lab" framing — persuasive design is a neutral toolkit. Brignull's test: would the user *thank you* if they understood it? **Unpack:** these features are engineered to remove friction and stopping points; naming the mechanic restores a beat of choice.

**Reference links:** behaviormodel.org · deceptive.design · arxiv.org/pdf/1907.07032

### 9. Monetized outrage / why anger spreads
**Established — with a key limit.** Brady et al. (2017, *PNAS*) found each additional moral-emotional word increased diffusion by ~20% (n=563,312 tweets); the **MAD model** explains why, and Brady et al. (2021, *Science Advances*) showed social feedback *teaches* more outrage over time. **Limit:** the effect is largely *within* ideological groups, and a replication failed in 4 of 6 additional datasets — present as robust in the original data but domain-specific, not universal. **Unpack:** outrage is engaging and engagement is amplified, so anger travels; and likes on your angriest posts quietly train you to post more.

**Reference links:** pnas.org (doi:10.1073/pnas.1618923114) · thedecisionlab.com/insights/society/social-media-and-moral-outrage

## STRAND C — You & Others

### 10. Social comparison & the "highlight reel"
**Established theory.** Festinger's Social Comparison Theory (1954): upward comparisons can lower self-evaluation; applied to feeds, you compare your behind-the-scenes to others' highlight reels. **Genuinely contested — present both sides.** Whether social media is *causing* a teen mental-health crisis is fiercely debated: **Haidt's** *The Anxious Generation* (2024) argues a smartphone-driven "great rewiring"; critics **Odgers** (*Nature*, 2024) and **Orben & Przybylski** (2019, *Nature Human Behaviour*; ~0.4% of well-being variance associated with tech use, "no more than eating potatoes") argue the causal claim isn't supported. The **Haugen disclosures** (2021) included Meta's internal slide that "32% of teen girls said that when they felt bad about their bodies, Instagram made them feel worse" — suggestive but small internal surveys with leading questions, not rigorous causal studies. **Editorial rule:** teach the *mechanism* (upward comparison to highlight reels) as solid; present the *population-level causal claim* as unresolved; avoid alarmism.

**Reference links:** platformer.news/anxious-generation-jonathan-haidt-debate-critique · doi:10.1038/s41562-018-0506-1 · npr.org/2021/10/05/1043194385

### 11. Online identity & self-presentation
**Established (sociological).** Goffman's *The Presentation of Self in Everyday Life* (1959): "front stage" vs "back stage" impression management. boyd & Marwick's **"context collapse"**: online, multiple audiences flatten into one. **Unpack:** curating a profile isn't fake — impression management is normal — but online it's permanent, searchable, and performed to collapsed audiences at once.

### 12. Misinformation & how to verify
**Established.** Vosoughi, Roy & Aral (2018, *Science*): across ~126,000 cascades, "falsehood diffused significantly farther, faster, deeper, and more broadly than the truth"; falsehoods ~70% more likely to be retweeted; driven by novelty/emotion; *humans*, not bots, did most spreading. **Tools that work:** Caulfield's **SIFT** (Stop; Investigate the source; Find better coverage; Trace to origin) and **lateral reading** (Wineburg & McGrew, 2017/2019) — teachable and effective; prebunking/inoculation (Roozenbeek & van der Linden) builds resistance. **Unpack:** the emotional jolt that makes you want to share is the signal to *stop and check*.

**Reference links:** politics.media.mit.edu/papers/Vosoughi_Science.pdf · hapgood.us/2019/06/19/sift-the-four-moves

### 13. Privacy & the data footprint
**Established.** Data brokers and trackers build behavioral profiles from browsing, location, apps, purchases; **GDPR** (2018) and **CCPA** are the major responses. **Unpack:** "free" services are paid for with data; practical literacy (permissions, ad-settings, tracker awareness) restores some control without going off-grid.

## STRAND D — Repair & Agency

### 14. Rest, attention restoration & "the peaceful place"
**Contested-but-useful.** Attention Restoration Theory (Kaplan & Kaplan, 1989/1995): directed-attention fatigue eases with "soft fascination," "being away," etc. **Be honest:** systematic reviews find mixed/modest support; "soft fascination" is vaguely operationalized; Johnson et al. (2021) found simulated nature didn't reliably restore executive attention; Bell et al. (2025 meta-analysis) suggests duration moderates the effect. Boredom's benefits and awe research (Keltner) are *emerging*. **Unpack:** genuine rest likely comes from low-demand "softly fascinating" input (a walk, water) — not swapping one high-stimulation feed for another. **Editorial:** frame as "worth trying, evidence modest."

**Reference links:** en.wikipedia.org/wiki/Attention_restoration_theory

### 15. Micro-boundaries & friction / the pause at the impulse
**Established — strong for a wellbeing app.** Cox et al. (2016, CHI) introduced **microboundaries** — small deliberate frictions that open a reflective moment. The **"one sec"** app is the flagship evidence: Grüning, Riedel & Lorenz-Spreen (2023, *PNAS*), 280 participants over 6 weeks — "on average 36% of the times participants attempted opening a target app, they closed that app again after one sec interfered," and target-app opens fell ~37% over six weeks. **Nuance:** effects can fade as the pause becomes ritual. **Unpack:** a few seconds of friction converts an automatic reach into a conscious choice — you're not blocked, just handed back the beat where you decide.

**Reference links:** pnas.org/doi/10.1073/pnas.2213114120 · one-sec.app

### 16. Designing your own defaults
**Mixed evidence — calibrate honestly.** **Grayscale:** Holte & Ferraro (2020, *The Social Science Journal*) found grayscale cut screen time ~37.9 min/day — but a short, small, non-RCT study with adherence problems (some reverted because it was "boring") and no mood improvement; Dekker & Baumgartner (2024) found only modest support. (Often mis-attributed — use Holte & Ferraro.) **Notifications:** turning off non-essentials and batching checks are reasonable, evidence-consistent moves. **Digital minimalism (Cal Newport):** popular but no RCT — present as expert opinion. **Overall:** Lyngs et al. (2019, CHI) reviewed 367 self-control tools (rich design, under-evidenced); Radtke et al. (2022) reviewed 21 detox studies (inconsistent, no recommendation); a 2025 meta-analysis found interventions reduced *problematic* use but barely reduced raw screen time. **Editorial rule:** offer defaults as personal experiments — reducing *problematic* use is more achievable than reducing total minutes.

**Reference links:** tandfonline.com/doi/abs/10.1080/03623319.2020.1737461 · doi.org/10.1145/3290605.3300361

### 17. Talking about it
**Established guidance.** The AAP moved from rigid limits toward a **Family Media Plan** emphasizing quality, context, co-use. **Parental mediation** research distinguishes *restrictive*, *active* (talking together), and *co-use*; active mediation is generally associated with better outcomes, while heavy surveillance can backfire with teens. Common Sense Media and the Center for Humane Technology offer non-shaming, youth-oriented toolkits. **Unpack:** conversations and shared norms beat surveillance; the goal is agency and trust, not policing.

**Reference links:** healthychildren.org · commonsensemedia.org · humanetech.com

## Cross-Cutting: Myths & Failure Modes to Avoid
1. **"Dopamine detox"** — misunderstands dopamine (prediction/motivation, not stored pleasure).
2. **"Social media is destroying teen mental health" (as settled causation)** — genuinely contested; small effect sizes; leaked surveys are suggestive, not rigorous.
3. **"Screen time" as a single meaningful metric** — total minutes correlate weakly with well-being; context matters more.
4. **"Attention spans shrank to 8 seconds (goldfish)"** — debunked; Mark's 47s finding is about on-screen switching, and she resists "broken brains."
5. **"23 minutes 15 seconds to refocus"** — interview-sourced; use "~20+ minutes" with a caveat.
6. **Filter bubbles/echo chambers as dominant** — weaker support than assumed; feeds may increase diverse exposure.
7. **"Tech addiction" framing** — behavioral "addiction" to phones is debated; medicalizing ordinary use can shame users.
8. **Intervention over-promising** — grayscale, detoxes, blockers show small/short-lived effects; frame as experiments.

## Recommendations (content)
1. **Adopt a three-tier labeling convention** (established / contested / weak-or-debunked) across every "unpack" line and the references UI.
2. **Lead with mechanisms, not scare-stats.**
3. **Make myth-busting a lesson** — a "dopamine, honestly" lesson and a "screen time isn't the whole story" lesson model intellectual honesty.
4. **Anchor the "repair" strand on the best-evidenced tool (microboundaries / one sec)** and frame the rest as experiments.
5. **For the family strand, default to active mediation and youth-led framing;** caution against surveillance-first approaches.
6. **Benchmarks:** upgrade a tool from "experiment" to "recommended" only if higher-quality RCTs later show durable effects; if a flagship figure fails replication, downgrade it.

## Caveats
- Several flagship numbers are interview- or secondary-sourced (Meyer's "40%," Mark's "23 minutes," the "one sec 57%" combined figure) — link primary studies where they exist and label the rest.
- Prefer primary sources (PNAS, *Science*, *Nature Human Behaviour*, CHI proceedings, the Kaplans, Festinger, Goffman, Zuboff, Wu, Schüll, Brignull, Vosoughi/Roy/Aral) over secondary explainers.
- The grayscale study is commonly mis-attributed — use **Holte & Ferraro (2020)**.
- The moral-contagion effect failed to replicate in 4 of 6 additional datasets — cite as domain-specific.
- The teen-harm section is a live scientific dispute — keep it even-handed and dated.


---

# PART E — THE ECHO-CHAMBER EXIT MODULE

*A research-grounded, dual-track (self + supporter) seven-phase model for getting out of digital echo chambers, scaling from mild news bubbles to severe radicalization. A flagship curriculum module, built to the same "awareness, not shame" standard.*

## TL;DR
- The best-supported exit journey is a **seven-phase arc — Immersed/Unaware → First Doubt (cognitive opening) → Active Questioning → Seeking & Diversifying → Disengaging → Rebuilding Identity & Habits → Maintenance/Helping Others** — synthesized from the Transtheoretical (Stages of Change) model, disengagement research (Horgan; Barrelle), and role-exit theory (Ebaugh). The same arc scales from a mild news bubble to severe radicalization; **severity mainly changes intensity, identity-stakes, social cost, and safety needs — not the shape of the path.**
- The highest-yield **self-guided** practices are prebunking/inoculation, lateral reading/SIFT, and *deliberate, non-tokenistic* source diversification. The highest-yield **supporter** methods are non-judgmental, question-led approaches (motivational interviewing, "street epistemology," deep canvassing, tailored evidence) — **not** fact-bombing.
- Honest evidence-labeling is mandatory and on-brand: algorithmic **filter bubbles are largely unsupported**; self-selected **echo chambers are real but affect a small, highly-partisan minority**; **affective polarization is rising in some countries (notably the US), not all**; the **backfire effect is mostly debunked**; and simplistic "just expose them to the other side" can genuinely **backfire** (Bail et al. 2018). Sell skills and self-efficacy, not alarm.

## Key Findings
- **The "echo chamber/filter bubble" evidence base is genuinely contested — lead with this.** Arguedas, Robertson, Fletcher & Nielsen, *Echo chambers, filter bubbles, and polarisation* (Reuters Institute, 2022) concludes echo chambers are "much less widespread than commonly assumed," finds "no support for the filter bubble hypothesis," and a "very mixed picture on polarisation"; algorithmic distribution is generally associated with *more* diverse news diets.
- **Change frameworks converge on one arc** (Transtheoretical Model; disengagement vs deradicalization; role-exit theory).
- **What initiates exit: the "cognitive opening"** (Wiktorowicz) — a catalytic crisis/experience that makes someone receptive. Horgan finds the leading reason people leave extremism is "disillusionment from the disparity between fantasy and reality."
- **Self-guided practices are well-evidenced** (Bad News inoculation; lateral reading/SIFT).
- **Supporting others: question-led beats fact-led** (deep canvassing; MI; tailored dialogue).
- **Popular claims that are weak or debunked:** the general backfire effect largely failed to replicate (Wood & Porter); but naive cross-partisan exposure *can* backfire (Bail et al. 2018).

## Details

### PART A — The contested evidence base (frames the whole module)
**Established:** reliance on search/social/aggregators is generally associated with *more* diverse news repertoires, not less; self-selected echo chambers are real but confined to a small minority (Fletcher, Robertson & Nielsen 2021 estimate ~2% left-leaning / ~5% right-leaning online news echo chambers); intergroup contact typically reduces prejudice (Pettigrew & Tropp 2006 meta-analysis, 515 studies, mean r ≈ −.21).
**Contested:** polarization is complex — ideological polarization declined long-term in many countries while *affective* polarization rose in some (notably the US); whether echo chambers exist at all depends on method (Hartmann et al. 2025 review of 129 studies: homophily/trace studies support the hypothesis, content-exposure/survey studies challenge it; field is US-centric); Kitchens, Johnson & Gray (2020, *MIS Quarterly*) find they exist but with less determining effect than assumed.
**Weak/debunked:** the algorithmic **filter bubble** hypothesis (Pariser) has essentially no empirical support; the general **backfire effect** is largely debunked; naive cross-partisan exposure can *increase* polarization (Bail et al. 2018).

> **Course framing note:** these facts are *reassuring*, not dismissive: "Extreme, sealed bubbles are rarer than headlines suggest — which means getting out, or helping someone out, is more achievable than you fear." That is the emotional core of "awareness, not shame."

### PART B — Frameworks and their extracted stages
- **Transtheoretical Model / Stages of Change** (Prochaska & DiClemente, 1983): precontemplation → contemplation → preparation → action → maintenance (→ termination). Non-linear, cyclical; **relapse is expected**, not failure.
- **Disengagement vs deradicalization** (Horgan 2008): *disengagement* = behavioral change without belief change; *deradicalization* = cognitive change. People often disengage without deradicalizing. Dominant driver of leaving: "disillusion from the disparity between fantasy and reality."
- **Barrelle's Pro-Integration Model** (2015): 22 former extremists; five domains — social relations, coping, identity, ideology, action orientation; sustained exit is proactive *re-integration*, and most leave unassisted.
- **Ebaugh's role-exit theory** (*Becoming an Ex*, 1988): First Doubts → Seeking Alternatives → The Turning Point → Creating the Ex-Role.
- **Cult/conspiracy exit:** Hassan's **BITE model** (Behavior, Information, Thought, Emotional control) within the **Influence Continuum** — a self-assessment lens, not a labeling weapon. Mick West's *Escaping the Rabbit Hole* (2018/2023): the successful approach is "clear communication based on mutual respect, honesty, openness, and patience," not proving people wrong.
- **Cognitive openings & turning points** (Wiktorowicz): a moment of crisis/experience that opens someone to new interpretations — the same openness that lets someone in can let them out.

### PART C — The self-guided toolbox
- **Prebunking / inoculation — the *Bad News* game** (Roozenbeek & van der Linden, 2019; getbadnews.com): players role-play a disinformation producer, learning six techniques (impersonation, emotional manipulation, group polarization, conspiracy, discrediting/ad hominem, trolling). Cross-cultural replication (2020, HKS Misinformation Review). *Contested note:* at least one replication found no improved discrimination — teach as promising, not infallible.
- **Lateral reading / SIFT** (Wineburg & McGrew 2017/2019; Caulfield): fact-checkers *leave* the page to check who's behind it. SIFT = Stop; Investigate the source; Find better coverage; Trace to origin. Teachable and effective (district RCT, 2022). Caulfield's caveat: blanket cynicism is the *enemy* of good evaluation — aim for *strategic* skepticism.
- **Diversifying the information diet — what works vs tokenism:** merely following opposing elites can *increase* polarization (Bail 2018); hostile/uncivil content is the culprit. Favor *relatable, sympathetic* individuals across difference and *shared* identity (Voelkel et al. 2024). "Diversify" means credible, humanizing sources — not adversarial feeds.

### PART D — The supporter toolbox
- **Deep canvassing / non-judgmental exchange of narratives** (Broockman & Kalla, *Science* 2016): "a single approximately 10-minute conversation encouraging actively taking the perspective of others can markedly reduce prejudice for at least 3 months." Follow-up (Kalla & Broockman, *APSR* 2020) confirms across immigration and transgender attitudes.
- **Motivational interviewing (MI):** autonomy-respecting; open questions, affirmations, reflective listening, summarizing; principles: express empathy, develop discrepancy, avoid argument, roll with resistance, support self-efficacy. Reduces vaccine hesitancy (Gagneur PromoVac). *Direct persuasion increases resistance.*
- **Street epistemology** (Boghossian): Socratic questioning of *how* someone knows, not attacking the belief. A conversational posture (practitioner technique, not RCT-validated) — pair with tested methods.
- **Tailored evidence, delivered conversationally (AI-assisted):** Costello, Pennycook & Rand (2024, *Science*): ~8-minute GPT-4 dialogues reduced conspiracy belief ~20%, durable at 2 months, generalizing across theories. **Integrity caveat:** *Science* issued an Editorial Expression of Concern (June 11, 2026) over dataset reproducibility; treat as promising-but-provisional.
- **The relationship comes first** (West; Picciolini; r/QAnonCasualties): preserve trust, avoid mockery/ultimatums, fill unmet needs. Picciolini's "potholes": extremism fills gaps in **identity, community, purpose** — a soft landing must replace them.

### PART E — Weak, debunked, or double-edged claims (teach explicitly)
- **The "backfire effect" is mostly debunked.** Origin: Nyhan & Reifler (2010). But Wood & Porter (2019): "more than 10,100 subjects… 52 issues… we found no corrections capable of triggering backfire." Nyhan himself (2021) concluded backfire can't explain durable misperceptions. *Implication:* gently sharing facts usually helps or is neutral — it rarely "makes things worse," which lowers the fear that keeps supporters silent.
- **But "just show them the other side" *can* backfire.** Bail et al. (2018, *PNAS*): Republicans who followed a liberal bot for a month became *more* conservative. Lesson: adversarial, identity-threatening exposure can entrench; humanizing exposure helps.
- **Depolarization is possible but shallow and fades.** Voelkel et al. (2024, *Science*) megastudy (32,059 participants, 25 treatments): most effective at reducing animosity = showing relatable, sympathetic people across difference + emphasizing shared identity; effects "waned significantly" by two weeks. Reducing affective polarization does not automatically reduce anti-democratic attitudes. *Single interventions are seeds, not cures — hence the maintenance phase.*

### PART F — The consolidated seven-phase EXIT JOURNEY (both tracks)
Severity scaling: at the mild end the work is largely cognitive and low-cost; at the severe end identity, belonging, fear, and physical safety dominate, timelines lengthen, and professional involvement becomes essential.

**Phase 1 — Immersed / Unaware** *(precontemplation; pre-doubt).*
- *Self:* gentle self-awareness — noticing strong emotional reactions, the *feeling* of certainty, and who's missing from your feed. An audit beats a lecture.
- *Supporter:* **protect the relationship above all** — no fact-bombing, mockery, or ultimatums; stay warmly connected. Severe: quietly assess risk, identify allies.

**Phase 2 — First Doubt / Cognitive Opening** *(contemplation; First Doubts).*
- *Self:* let the doubt exist without arguing it away; note contradictions between claims and reality; personal turning points open doors.
- *Supporter:* **ask, don't tell** — street-epistemology / MI open questions; validate the *person* while questioning the *method*.

**Phase 3 — Active Questioning** *(contemplation → preparation).*
- *Self:* **prebunk yourself** (Bad News; SIFT/lateral reading); strategic skepticism, not cynicism.
- *Supporter:* keep asking "how do you know?"; offer **tailored, specific, respectful evidence** for the claims that matter to them — never a firehose.

**Phase 4 — Seeking & Diversifying** *(preparation → action; Seeking Alternatives).*
- *Self:* deliberately diversify toward *credible, humanizing* voices; avoid hostile cross-partisan feeds.
- *Supporter:* **non-judgmental exchange of narratives** (deep canvassing); share your story, hear theirs, emphasize common identity.

**Phase 5 — Disengaging** *(action; behavioral disengagement; Turning Point).*
- *Self:* reduce time in the community; anticipate identity threat, grief, and social cost; behavioral exit can precede belief change.
- *Supporter:* provide a **soft landing** — belonging, dignity, purpose outside the group; never force recantation. Severe: security planning, professionals.

**Phase 6 — Rebuilding Identity & Habits** *(action → maintenance; pro-integration; Creating the Ex-Role).*
- *Self:* rebuild durable epistemic habits and a coherent new identity; sustained exit is positive re-integration, not just absence of the old belief.
- *Supporter:* support new belonging, coping, meaning; be patient with lingering beliefs.

**Phase 7 — Maintenance / Helping Others** *(maintenance; relapse normalized).*
- *Self:* **expect relapse — it's part of the model, not failure;** maintain diverse habits; watch for stress-driven pull-backs.
- *Supporter:* stay available; celebrate progress. Many "formers" become the most credible helpers.

**How the tracks diverge (design into the UI):** the *self* track is internal skill/identity work and can move fast in mild cases; the *supporter* track is fundamentally **restraint and relationship** — *less arguing, more listening,* paced by the other person. Both share the same phase spine, so one UI can show "where you are" and "where they are" side by side.

### PART G — Case studies to seed lessons
- **Christian Picciolini** — recruited into a neo-Nazi group at 14; left 1995–96; co-founded **Life After Hate** and the **Free Radicals Project**; "potholes" theory (identity, community, purpose).
- **Life After Hate** — nonprofit (2011); "formers helping formers."
- **Ex-QAnon: Jitarth Jadeja** — the "good vs evil" framing that makes exit hard (CNN, 2020).
- **Ex-QAnon: "Justin"** — family who *walked with him and listened* rather than arguing (NBC News) — a supporter-track lesson.
- **r/QAnonCasualties** — peer support for families; evidence that the *supporter's* wellbeing and boundaries matter.
- **Mick West's Metabunk** — respectful debunking case studies (chemtrails, 9/11, Flat Earth, QAnon).

## Recommendations (module)
1. **Open with the contested evidence** — Lesson 0 states plainly that sealed bubbles are rarer than headlines claim; lowers defensiveness and models humility.
2. **Use the seven-phase arc as the spine**, one lesson per phase, each branching into *self* and *supporter* tracks with a shared "where are you / where are they" progress UI.
3. **Front-load skills, not warnings** — Bad News + a SIFT drill as the first interactive elements; teach "strategic skepticism, not cynicism."
4. **For supporters, teach what NOT to do first** (no fact-bombing/mocking/ultimatums), then MI, street epistemology, and deep-canvassing narrative exchange.
5. **Label every claim's evidence tier**; flag the Costello et al. AI study as *promising but under an Expression of Concern (June 2026)*.
6. **Ship a safety/escalation lesson.** For severe cases (violent intent, threats, self-harm, a minor at risk), switch from "dialogue" to "involve professionals/authorities" and surface resources (Life After Hate; Parents for Peace; local mental-health and emergency lines). **Hard threshold:** any expressed intent to harm self or others → immediate professional/authority referral, not continued persuasion.
7. **Normalize relapse and set boundaries for supporters** — a "your wellbeing matters" lesson; it is legitimate to set limits and take breaks.

## Caveats
- **US-centric evidence** — most echo-chamber/polarization/canvassing studies are American; say so in-app.
- **The Costello et al. (2024) AI-dialogue result is provisional** (Expression of Concern, June 2026).
- **Definitional fog** — "echo chamber," "filter bubble," "polarization" are used inconsistently; define terms crisply.
- **Practitioner vs peer-reviewed** — street epistemology, BITE, and "potholes" are valuable practitioner frameworks, not RCT-validated; pair with tested methods.
- **Retrospective bias** — exit accounts are after-the-fact; treat narratives as illustrative, not effect-size evidence.
- **Deradicalization efficacy is hard to evaluate**, and disengagement doesn't guarantee deradicalization — don't promise belief change as the success metric; behavioral change and healthy re-integration are legitimate outcomes.


---

# PART F — CONSOLIDATED REFERENCES & FURTHER READING

*The merged, deduplicated bibliography aggregating sources cited across Parts A–E, grouped by theme. Structured so it can drive the app's in-app "Inspirations / Further reading" screen as `{ title, creator, url, note, tier }` records.*

> **Verify every URL before shipping to production UI.** These are best-known canonical links; some projects have retired or moved their sites, and links rot. **Evidence tier** (for research sources): E = established · C = contested/mixed · D = weak-or-debunked. Design inspirations are unlabeled.

## 1. Design inspirations & prior art
- *The Endless Doomscroller* — Ben Grosser · bengrosser.com/projects/endless-doomscroller/ · reduction mechanic.
- *Demetricator / Order of Magnitude / Minus / Go Rando* — Ben Grosser · bengrosser.com · subtraction as intervention.
- *Doomscrolling* — Ben Kovach · (search "Ben Kovach Doomscrolling") · swipe-physics realism.
- "Conceptual Art for the Attention Economy" — Jonathan Zong · jonathanzong.com/blog/2018/02/03/conceptual-art-for-the-attention-economy
- Net Art Anthology — Rhizome · anthology.rhizome.org
- *We Become What We Behold* — Nicky Case · ncase.me/wbwbh/ · complicity in 5 minutes.
- *The Evolution of Trust* — Nicky Case · ncase.me/trust/
- *Adventures with Anxiety* — Nicky Case · ncase.itch.io/anxiety
- *Explorable Explanations* — explorabl.es
- Stimulation Clicker / Life Stats — Neal Agarwal · neal.fun · viral single-idea toys.
- *Sea Hero Quest* — Glitchers / UCL / Alzheimer's Research UK · alzheimersresearchuk.org · purpose carried invisibly.
- *Alto's Odyssey* (Zen Mode) — Snowman · altosodyssey.com · the no-fail register.
- *Florence* — Mountains / Annapurna Interactive · annapurna.interactive · emotion through mechanics.
- *Journey* — thatgamecompany · thatgamecompany.com
- *A Peaceful Place* — James Shedden (Kickstarter) · kickstarter.com/projects/jamesshedden/a-peaceful-place · the positive pole (cozy, no-goal sensory world).
- Cozy-games movement (*Stardew Valley*, *Animal Crossing*, *A Short Hike*, *Alba*) · "no timers, a soft place to land."
- *Finch* — Finch Care · finchcare.com · shame-free externalised care.
- *Forest* — Seekrtech · forestapp.cc
- *Impulse: Playing With Reality* — ANAGRAM · impulse-xr.io · the un-winnable-game mechanic (nearest 3D comparator).
- *The Wilderness Downtown* — Chris Milk + Google · thewildernessdowntown.com · personalisation on rails.
- *Bury Me, My Love* — The Pixel Hunt / ARTE · burymemylove.arte.tv · native device grammar.
- Google Digital Wellbeing Experiments — experiments.withgoogle.com · awareness-first precedent.

## 2. Wellbeing tools & advocacy
- *one sec* — one-sec.app (E — PNAS-studied) · *ScreenZen* — screenzen.co · *Freedom* — freedom.to · *Olauncher* — minimalist launcher.
- Center for Humane Technology (Ledger of Harms, youth toolkits) — humanetech.com
- Log Off Movement — logoffmovement.org · 5Rights Foundation — 5rightsfoundation.com · Common Sense Media — commonsensemedia.org · AAP Family Media Plan — healthychildren.org

## 3. The governing principle & design research
- "Designing for Digital Wellbeing" — Google Design · design.google/library/designing-for-digital-wellbeing (E — the documented awareness-vs-shame lesson).
- "Design Frictions for Mindful Interactions: The Case for Microboundaries" — Cox et al., CHI EA 2016 · ACM Digital Library (E).
- "Monitoring Screen Time or Redesigning It?" — Zhang, Lukoff et al., CHI 2022 · ACM Digital Library (E).
- "I Don't Even Remember What I Read" (normative dissociation) — Baughan et al., CHI 2022 · dl.acm.org/doi/fullHtml/10.1145/3491102.3501899 (E).

## 4. Attention & the mind
- Multitasking / switching costs — APA summary · apa.org/topics/research/multitasking (E).
- "Attention residue" — Sophie Leroy, 2009, *OBHDP* (E).
- Gloria Mark, *Attention Span* (2023); ~47-second finding · gloriamark.com/attention-span (E, interview-nuanced).
- "23 minutes 15 seconds" analysis — blog.oberien.de/2023/11/05/23-minutes-15-seconds.html (C — figure is interview-sourced).
- Dopamine as reward-prediction-error — Schultz, 2016 · ncbi.nlm.nih.gov/pmc/articles/PMC6760455 (E); "Dopamine Decoded" myths · psychologytoday.com/us/blog/between-cultures/202506/dopamine-decoded-5-myths-10-facts (E). "Dopamine detox" (D).
- *Addiction by Design* — Natasha Dow Schüll, 2012 · press.princeton.edu/books/paperback/9780691278285 (E).

## 5. The machine (systems, attention economy, dark patterns)
- Echo chambers / filter bubbles literature review — Reuters Institute, 2022 · reutersinstitute.politics.ox.ac.uk/echo-chambers-filter-bubbles-and-polarisation-literature-review (E for the review; filter bubble = D).
- *The Age of Surveillance Capitalism* — Zuboff, 2019 · hbs.edu/faculty/Pages/item.aspx?num=56791 (C — influential, debated).
- *The Attention Merchants* — Tim Wu, 2016 (E).
- Fogg Behavior Model (B=MAP) — behaviormodel.org (E).
- Dark/deceptive patterns — Harry Brignull · deceptive.design (E); Mathur et al., 2019 · arxiv.org/pdf/1907.07032 (E).
- Moral-emotional contagion — Brady et al., 2017, *PNAS* doi:10.1073/pnas.1618923114 (E within-group; C as universal).

## 6. You & others (comparison, identity, misinformation, privacy)
- Social comparison — Festinger, 1954 (E, theory).
- *The Anxious Generation* debate — Haidt vs Odgers/Orben · platformer.news/anxious-generation-jonathan-haidt-debate-critique (C).
- Orben & Przybylski, 2019, *Nature Human Behaviour* · doi:10.1038/s41562-018-0506-1 (E for small effect sizes).
- Haugen disclosures / Instagram internal research — npr.org/2021/10/05/1043194385 (C — internal surveys).
- Context collapse — boyd & Marwick (E, sociological); Goffman, *Presentation of Self*, 1959 (E).
- "The spread of true and false news online" — Vosoughi, Roy & Aral, 2018, *Science* · politics.media.mit.edu/papers/Vosoughi_Science.pdf (E).
- SIFT / lateral reading — Caulfield · hapgood.us/2019/06/19/sift-the-four-moves ; Wineburg & McGrew, SSRN 3048994 (E).
- GDPR / data footprint — general regulatory reference (E).

## 7. Repair, agency & behavior change
- Attention Restoration Theory — Kaplan & Kaplan · en.wikipedia.org/wiki/Attention_restoration_theory (C — mixed support).
- "one sec" field study — Grüning, Riedel & Lorenz-Spreen, 2023, *PNAS* · pnas.org/doi/10.1073/pnas.2213114120 (E).
- Grayscale — Holte & Ferraro, 2020, *The Social Science Journal* · tandfonline.com/doi/abs/10.1080/03623319.2020.1737461 (C — small, short); Dekker & Baumgartner, 2024 (C).
- "Self-Control in Cyberspace" (367 tools) — Lyngs et al., CHI 2019 · doi.org/10.1145/3290605.3300361 (E for the landscape; effectiveness C).
- Digital detox review — Radtke et al., 2022 (C — inconsistent).

## 8. Echo-chamber exit (frameworks, methods, evidence)
- Transtheoretical Model — Prochaska & DiClemente, 1983 · pubmed.ncbi.nlm.nih.gov/10170434 (E).
- Disengagement vs deradicalization — Horgan, 2008 · jstor.org/stable/26298340 ; sagepub 10.1177/0002716208317539 (E).
- Pro-Integration Model — Barrelle, 2015 · tandfonline.com/doi/abs/10.1080/19434472.2014.988165 (E).
- *Becoming an Ex* (role-exit theory) — Ebaugh, 1988 · press.uchicago.edu/ucp/books/book/chicago/B/bo5952245.html (E).
- Cognitive opening — Wiktorowicz, 2004 · en.wikipedia.org/wiki/Cognitive_opening (E).
- BITE model / Influence Continuum — Steven Hassan · freedomofmind.com (C — practitioner diagnostic).
- *Escaping the Rabbit Hole* — Mick West · en.wikipedia.org/wiki/Escaping_the_Rabbit_Hole (practitioner).
- *Bad News* inoculation game — Roozenbeek & van der Linden, 2019 · nature.com/articles/s41599-019-0279-9 ; getbadnews.com (E, some replication caveats).
- Lateral reading RCT — Wineburg et al., 2022 (E).
- Deep canvassing — Broockman & Kalla, 2016, *Science* · science.org/doi/10.1126/science.aad9713 ; Kalla & Broockman, 2020, *APSR* (E).
- Intergroup contact meta-analysis — Pettigrew & Tropp, 2006 · ideas.wharton.upenn.edu/wp-content/uploads/2018/07/Pettigrew-Tropp.pdf (E).
- Backfire effect debunk — Wood & Porter, 2019, *Political Behavior* · papers.ssrn.com/sol3/papers.cfm?abstract_id=2819073 (E — backfire = D).
- Cross-partisan exposure can backfire — Bail et al., 2018, *PNAS* · pmc.ncbi.nlm.nih.gov/articles/PMC6140520 (E).
- Depolarization megastudy — Voelkel et al., 2024, *Science* (E — effects fade).
- AI-dialogue conspiracy reduction — Costello, Pennycook & Rand, 2024, *Science* doi:10.1126/science.adq1814 (C — Editorial Expression of Concern, June 2026); debunkbot.com.
- Echo-chamber systematic review — Hartmann et al., 2025, *J. Computational Social Science* · arxiv.org/abs/2407.06631 (C).
- Life After Hate — en.wikipedia.org/wiki/Life_After_Hate · Christian Picciolini — christianpicciolini.com/bio · r/QAnonCasualties (case-study sources).

---

*End of compendium. The north star in the front matter and the thesis in Part A §2 remain the load-bearing walls: if any decision ever undermines the self-discovery moment at the heart of the experience, that decision is wrong — not the thesis.*
