import { defineConfig } from '@playwright/test';
import { env } from './src/config/env.config';

/**
 * Central Playwright configuration.
 *
 * Design choices worth calling out:
 * - The browser launches maximized (`--start-maximized`) and viewport is
 *   set to `null` so the page adapts to the real window size — no hardcoded
 *   viewport, works on any resolution.
 * - Every visual artefact (trace, video, screenshot) is captured on every
 *   run by default so the Allure report always has full evidence for the
 *   demo. Toggle via `.env` if you want a faster CI loop.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.retries,
  workers: env.isCI ? 2 : env.workers,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: env.allureResultsDir,
        detail: true,
        suiteTitle: false,
        environmentInfo: {
          environment: env.testEnv,
          base_url: env.baseUrl,
          browser: env.browser,
          headless: String(env.headless),
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    trace: env.trace as 'on-first-retry' | 'on' | 'off' | 'retain-on-failure',
    video: {
      mode: env.video as 'retain-on-failure' | 'on' | 'off' | 'on-first-retry',
      // Recording resolution matches the launch window size below so
      // the video captures the full browser at full fidelity — no
      // shrunken or letter-boxed frames.
      size: { width: 1920, height: 1080 },
    },
    screenshot: env.screenshot as 'only-on-failure' | 'on' | 'off',
    // `viewport: null` hands layout control to the real browser window;
    // combined with the explicit `--window-size=1920,1080` and
    // `--start-maximized` launch args, the browser opens full-screen and
    // the recorded video / screenshots use the exact same resolution.
    viewport: null,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: [
        '--start-maximized',
        '--window-size=1920,1080',
        '--window-position=0,0',
      ],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        // Do NOT spread `devices['Desktop Chrome']` — its
        // `deviceScaleFactor` is incompatible with `viewport: null`, which
        // is what enables the maximized window on any resolution.
        browserName: 'chromium',
      },
    },
  ],
});
