import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'fs';

const env = process.env.ENV || 'uat';
const configFile = `./src/configs/${env}.json`;
const config = JSON.parse(readFileSync(configFile, 'utf-8'));

// Detect CI environment - CI servers use Chromium, local uses installed Chrome
const isCI = !!(process.env.CI || process.env.GITHUB_ACTIONS || process.env.JENKINS_URL || process.env.GITLAB_CI);

export default defineConfig({
  testDir: './src/tests',
  timeout: 90000,
  fullyParallel: true, // Enabled for parallel execution within stages
  // workers: undefined, // Let Playwright decide based on CPU cores
  expect: {
    timeout: 10000
  },
  reporter: [
    ['list'], 
    ['html', { open: 'never' }], 
    ['allure-playwright', { detail: true, suiteTitle: true }],
    ['./src/utils/ConsoleStepReporter.ts']
  ],
  use: {
    baseURL: config.baseURL,
    actionTimeout: 15000,
    navigationTimeout: 45000,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    // CI servers use bundled Chromium; local machine uses installed Google Chrome
    ...(isCI ? {} : { channel: 'chrome' }),
    // Explicitly define the browser engine for peace of mind
    browserName: 'chromium',
    // Run headed (visible) locally, headless in cloud CI
    headless: !!(process.env.GITHUB_ACTIONS || process.env.GITLAB_CI),
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'API-Tests',
      testMatch: /.*api\/.*/, // Runs first to ensure backend is healthy
    },
    {
      name: 'Chrome-1-Login',
      testMatch: /.*login\.spec\.ts/,
      dependencies: ['API-Tests'], // UI tests only start if APIs are healthy
    },
    {
      name: 'Chrome-2-Dashboard',
      testMatch: /.*dashboard\.spec\.ts/,
      dependencies: ['Chrome-1-Login'],
    },
    {
      name: 'Chrome-3-Other-UI', // Captures contacts, profile, etc.
      testIgnore: [/.*login\.spec\.ts/, /.*dashboard\.spec\.ts/, /.*api\/.*/],
      dependencies: ['Chrome-2-Dashboard'], 
    }
  ],
});