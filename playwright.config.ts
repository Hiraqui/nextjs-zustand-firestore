import { defineConfig, devices } from "@playwright/test";

import path from "path";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Timeout per test
  timeout: 60 * 1000, // Increased timeout for CI environment
  // Global test timeout for all tests
  globalTimeout: 30 * 60 * 1000, // 30 minutes total
  // Expect timeout for assertions
  expect: {
    timeout: process.env.CI ? 15000 : 10000,
  },
  // Test directory
  testDir: path.join(__dirname, "e2e"),
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: "test-results/",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry 2 times*/
  retries: 2,
  /* Do not opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { open: process.env.CI ? "never" : "on-failure" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retry-with-trace",

    screenshot: "only-on-failure",

    /* Increase navigation timeout for CI */
    navigationTimeout: process.env.CI ? 30000 : 15000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        // Chromium-specific settings for better stability
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
        }
      },
    },

    {
      name: "firefox",
      use: { 
        ...devices["Desktop Firefox"],
        // Firefox-specific settings for better stability  
        launchOptions: {
          firefoxUserPrefs: {
            'dom.webnotifications.enabled': false,
            'dom.push.enabled': false
          }
        }
      },
    },

    {
      name: "webkit",
      use: { 
        ...devices["Desktop Safari"],
        // WebKit-specific settings for better stability
        ignoreHTTPSErrors: true,
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run start",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
