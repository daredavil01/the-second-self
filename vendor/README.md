# Vendored dependencies

## three.js — 0.185.1

`three.module.min.js` + `three.core.min.js` (the module build imports the core
build as a sibling, so both must sit here together) and the upstream MIT
`three.LICENSE`.

**Why vendored rather than a CDN import map.** Second Self promises that nothing
leaves your device, stated out loud as a trust signal. A CDN import would make
every visitor's browser call a third party the moment the page loads — breaking
that promise on the very first request, before the user has done anything at
all. Vendoring also drops a runtime dependency on someone else's uptime, and
keeps the piece working offline (which a later PWA phase will want).

The compendium allows either — "load Three.js from a CDN via an import map, or
vendor it locally" — so this is a choice inside the locked stack, not a
departure from it.

**To update:**

```sh
npm pack three@<version>
tar -xzf three-<version>.tgz
cp package/build/three.module.min.js package/build/three.core.min.js vendor/
cp package/LICENSE vendor/three.LICENSE
```

Then update the version above and re-run the Playwright smoke check.
