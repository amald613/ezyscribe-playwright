import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter configuration for HTML and GitHub Actions */
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }], // HTML report
    ['github'], // GitHub Actions friendly reporter
  ],
  /* Shared settings for all projects */
  use: {
    /* Base URL for easy navigation */
    // baseURL: 'https://appv2.ezyscribe.com',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    trace: 'on-first-retry', // collect trace on retry
    screenshot: 'only-on-failure', // auto screenshot only if test fails
    video: 'retain-on-failure', // record video for failures
    headless: true, // run headless in CI
  },

  /* Projects for browsers */
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
