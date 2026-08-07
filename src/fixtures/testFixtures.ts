import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ContactsPage } from '../pages/ContactsPage';
import { getEnvConfig, EnvConfig } from '../utils/env';

import { setupAllureEnvironment } from '../utils/allureSetup';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  profilePage: ProfilePage;
  contactsPage: ContactsPage;
  config: EnvConfig;
};

export const test = baseTest.extend<PageFixtures>({
  config: async ({}, use) => {
    setupAllureEnvironment();
    const cfg = getEnvConfig();
    await use(cfg);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await use(profilePage);
  },

  contactsPage: async ({ page }, use) => {
    const contactsPage = new ContactsPage(page);
    await use(contactsPage);
  },
});

export { expect } from '@playwright/test';
