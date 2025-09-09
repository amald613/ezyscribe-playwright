import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000, // 2 minutes per test
  fullyParallel: true, // run tests in parallel
  forbidOnly: !!process.env.CI, // fail if test.only is left in code
  retries: process.env.CI ? 2 : 0, // retry on CI only
  workers: process.env.CI ? 1 : undefined, // single worker on CI

  // Shared settings for all projects
  use: {
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 60000,
    trace: 'on-first-retry', // collect trace only on retry
    screenshot: 'only-on-failure', // auto screenshot on test failure
    video: 'retain-on-failure', // record video on failure
    headless: true, // run headless in CI
  },

  // Reporter configuration
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }], // HTML report
    ['github'], // GitHub Actions friendly reporter
  ],

  // Projects for multiple browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
