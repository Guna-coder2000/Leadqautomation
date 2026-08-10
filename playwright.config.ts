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
  fullyParallel: false, // Strict sequential execution within stages
  workers: 1, // Only one worker runs at a time (one after another)
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
      name: 'chrome',
    }
  ],
});