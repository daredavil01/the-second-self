# Second Self

A short symbolic 3D world that lets you meet the person your digital habits are
quietly building. Awareness, not shame.

- **The design and research source of truth:** [`second-self-master-compendium.md`](second-self-master-compendium.md)
- **The build plan and live status board:** [`docs/IMPLEMENTATION-PLAN.md`](docs/IMPLEMENTATION-PLAN.md)

## Running it

Phase 0 is deliberately buildless — no bundler, no `npm install`, no dependencies
to fetch. Three.js is vendored in `vendor/`. Serve the folder over HTTP (ES
modules will not load from `file://`):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Scroll or swipe to move. Tap, click, or hold to choose.

## Status

Phase 0 — the vertical slice — is built and awaiting design confirmation. It
answers exactly one question: does watching the avatar change in response to your
own choices produce "oh… that's me"? Everything else is premature until it does.
