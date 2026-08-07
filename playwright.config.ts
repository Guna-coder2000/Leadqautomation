import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'fs';

const env = process.env.ENV || 'uat';
const configFile = `./src/configs/${env}.json`;
const config = JSON.parse(readFileSync(configFile, 'utf-8'));

export default defineConfig({
  testDir: './src/tests',
  timeout: 90000,
  fullyParallel: false,
  workers: 1,
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
  },
  projects: [
    {
      name: 'chrome',
      use: {
        // use the installed Google Chrome browser on the machine
        channel: 'chrome',
        // common options
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
      },
    },
  ],
});