import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against the PRODUCTION BUILD served by `vite preview`, never the
 * dev server. Two classes of bug only exist in the built output — subpath
 * breakage and anything the minifier changes — and testing the dev server
 * would step right over both.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Each test runs a live WebGL scene. Under a software rasteriser (CI, and any
  // container without a GPU) too many at once starve each other's frame loop
  // and everything times out for reasons that have nothing to do with the code.
  //
  // Two, not three, since the share tests landed: composing a card reads four
  // megapixels back off the GPU, and at three workers that was enough extra
  // load to start timing out an unrelated test that passes in 2.6 seconds on
  // its own. The number is a property of how much work the suite does, so it
  // has to be revisited whenever the suite gets heavier — see LESSONS L12.
  workers: 2,
  // Generous: every test drives the real input path through a software
  // rasteriser, which is far slower than any real device.
  timeout: 120_000,
  expect: { timeout: 30_000 },
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'list' : 'html',

  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    launchOptions: {
      // SwiftShader: neither CI nor a container has a GPU, and this piece is
      // nothing without WebGL.
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
      // Escape hatch for environments that ship a pre-installed browser at a
      // fixed path instead of Playwright's own download cache. Unset in CI,
      // where `playwright install` provides the matching build.
      ...(process.env['PLAYWRIGHT_CHROMIUM_PATH']
        ? { executablePath: process.env['PLAYWRIGHT_CHROMIUM_PATH'] }
        : {}),
    },
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    // Build first, always. `vite preview` serves whatever is already in dist/,
    // so without this the suite will happily test a stale bundle and report
    // green — or fail for reasons that no longer exist in the source.
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
