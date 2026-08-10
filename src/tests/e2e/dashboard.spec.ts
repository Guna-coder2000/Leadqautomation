import { test, expect } from '../../fixtures/testFixtures';
import { allure } from 'allure-playwright';
import fs from 'fs';

const loginData = JSON.parse(fs.readFileSync('sample/login.json', 'utf-8'));

test.describe('LeadQ Dashboard Module', () => {

  test.beforeEach(async ({ loginPage, config }) => {
    allure.epic('LeadQ CRM Management');
    allure.feature('Dashboard & Navigation');
    allure.owner('LeadQ QA Team');

    await test.step('Precondition: User must be authenticated and logged in', async () => {
      await loginPage.navigateToLogin(config.baseURL);
      await loginPage.enterUsername(loginData.credentials.valid.username);
      await loginPage.enterPassword(loginData.credentials.valid.password);
      await loginPage.clickLoginButton();
      await loginPage.verifySuccessfulRedirectToDashboard();
    });
  });

  test('TC-201 Verify authenticated user can view Dashboard summary widgets after successful login', async ({ dashboardPage, page }) => {
    allure.story('Dashboard Overview');
    allure.severity('critical');
    allure.description('Verify main dashboard stat widgets, metrics, and date header display correctly after login.');



    await test.step('Step 2: Verify the KPI statistics cards (Contacts, Meetings, Emails, Voice Agent) are visible', async () => {
      await dashboardPage.verifyStatisticsCardsDisplayed();
    });

    await test.step('Step 4: Verify the Calendar widget is visible', async () => {
      await dashboardPage.verifyCalendarWidgetDisplayed();
      await allure.attachment('Dashboard Widgets Verified', await page.screenshot(), 'image/png');
    });
  });

  test('TC-202 Verify user can navigate to Contacts module via sidebar menu', async ({ dashboardPage, page }) => {
    allure.story('Sidebar Navigation');
    allure.severity('critical');
    allure.description('Verify navigation to Contacts module using left navigation bar.');

    await test.step('Step 1: Click "Contacts" from the left sidebar navigation menu', async () => {
      await dashboardPage.clickContactsMenu();
    });

    await test.step('Step 2: Verify the application URL updates to the contacts route', async () => {
      await expect(page).toHaveURL(/.*contacts/);
      await allure.attachment('Contacts Navigation', await page.screenshot(), 'image/png');
    });
  });

  test('TC-203 Verify user can navigate to Voice Agent module via sidebar menu', async ({ dashboardPage, page }) => {
    allure.story('Sidebar Navigation');
    allure.severity('normal');
    allure.description('Verify navigation to Voice Agent module using left navigation bar.');

    await test.step('Step 1: Click "Voice Agent" from the left sidebar navigation menu', async () => {
      await dashboardPage.clickVoiceAgentMenu();
    });

    await test.step('Step 2: Verify the application URL updates to the voice agent route', async () => {
      await expect(page).toHaveURL(/.*voice-agent/);
      await allure.attachment('Voice Agent Navigation', await page.screenshot(), 'image/png');
    });
  });
  
  test('TC-204 Verify user can navigate to Leads module via sidebar menu', async ({ dashboardPage, page }) => {
    allure.story('Sidebar Navigation');
    allure.severity('critical');
    allure.description('Verify navigation to Leads module using left navigation bar.');

    await test.step('Step 1: Click "Leads" from the left sidebar navigation menu', async () => {
      await dashboardPage.clickLeadsMenu();
    });

    await test.step('Step 2: Verify the application URL updates to the leads route', async () => {
      await expect(page).toHaveURL(/.*leads/);
      await allure.attachment('Leads Navigation', await page.screenshot(), 'image/png');
    });
  });






});
