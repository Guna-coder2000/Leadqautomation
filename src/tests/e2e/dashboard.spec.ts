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

    await test.step('Step 1: Verify the current date header is visible on the dashboard', async () => {
      await dashboardPage.verifyCurrentDateDisplayed();
    });

    await test.step('Step 2: Verify the KPI statistics cards (Contacts, Meetings, Emails, Voice Agent) are visible', async () => {
      await dashboardPage.verifyStatisticsCardsDisplayed();
    });
    
    await test.step('Step 3: Verify the Lead Pipeline chart section is visible', async () => {
      await dashboardPage.verifyLeadPipelineDisplayed();
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

  test('TC-205 Verify user can filter dashboard statistics by Today', async ({ dashboardPage, page }) => {
    allure.story('Dashboard Filters');
    allure.severity('normal');
    allure.description('Verify that the user can interact with the filter dropdown and select "Today".');

    await test.step('Step 1: Click on the dashboard date filter dropdown', async () => {
      await dashboardPage.clickDashboardFilterDropdown();
    });

    await test.step('Step 2: Select "Today" from the dropdown options', async () => {
      await dashboardPage.selectDashboardFilterOption('Today');
    });

    await test.step('Step 3: Verify the dropdown now displays "Today"', async () => {
      await dashboardPage.verifyFilterOptionSelected('Today');
      await allure.attachment('Today Filter Applied', await page.screenshot(), 'image/png');
    });
  });

  test('TC-206 Verify user can click View Details in Priority Actions', async ({ dashboardPage, page }) => {
    allure.story('Priority Actions');
    allure.severity('normal');
    allure.description('Verify the View Details link is accessible in the Priority Actions section.');

    await test.step('Step 1: Verify the Priority Actions section is displayed', async () => {
      await dashboardPage.verifyPriorityActionsDisplayed();
    });

    await test.step('Step 2: Click the View Details link', async () => {
      await dashboardPage.clickPriorityActionsViewDetails();
      await allure.attachment('Priority Actions Details', await page.screenshot(), 'image/png');
    });
  });

  test('TC-207 Verify Welcome Banner displays correct user information', async ({ dashboardPage, page }) => {
    allure.story('Dashboard Overview');
    allure.severity('minor');
    allure.description('Verify that the welcome banner correctly addresses the logged-in user.');

    await test.step('Step 1: Verify the welcome banner displays the expected greeting', async () => {
      await dashboardPage.verifyWelcomeBannerDisplayedWithUser('Good');
      await allure.attachment('Welcome Banner Verified', await page.screenshot(), 'image/png');
    });
  });

  test('TC-208 Verify direct URL navigation to Settings page', async ({ dashboardPage, config, page }) => {
    allure.story('Direct Navigation');
    allure.severity('normal');
    allure.description('Verify user can navigate directly to settings via URL manipulation.');

    await test.step('Step 1: Navigate directly to the settings URL', async () => {
      await dashboardPage.navigateToSettingsDirectly(config.baseURL);
    });

    await test.step('Step 2: Verify the application resolves the settings route', async () => {
      await expect(page).toHaveURL(/.*settings/);
      await allure.attachment('Settings Navigation', await page.screenshot(), 'image/png');
    });
  });

});
