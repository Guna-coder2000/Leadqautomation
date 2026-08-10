import { test, expect } from '../../fixtures/testFixtures';
import { allure } from 'allure-playwright';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('sample/login.json', 'utf-8'));

test.describe('LeadQ Authentication Module', () => {

  test.beforeEach(async () => {
    allure.epic('LeadQ User Access');
    allure.feature('Authentication');
    allure.owner('LeadQ QA Team');
  });

  test('TC-001 Verify authenticated user can view Dashboard summary cards after successful login', async ({ loginPage, dashboardPage, config, page }) => {
    allure.story('User Login');
    allure.severity('blocker');
    allure.description('Verify user can successfully log in with valid credentials and redirect to dashboard.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Enter valid Email Address', async () => {
      await loginPage.enterUsername(data.credentials.valid.username);
    });

    await test.step('Step 2: Enter valid password', async () => {
      await loginPage.enterPassword(data.credentials.valid.password);
    });

    await test.step('Step 3: Click the Sign In button', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Step 4: Verify the application redirects to the Dashboard page successfully', async () => {
      await loginPage.verifySuccessfulRedirectToDashboard();
      await expect(page).toHaveURL(/.*dashboard/);
    });

    await test.step('Step 5: Verify the Dashboard statistics cards are visible after login', async () => {
      await dashboardPage.verifyStatisticsCardsDisplayed();
      await allure.attachment('Dashboard Verified', await page.screenshot(), 'image/png');
    });
  });

  test('TC-002 Verify application displays error when logging in with invalid password', async ({ loginPage, config, page }) => {
    allure.story('Login Failure');
    allure.severity('critical');
    allure.description('Verify error message when logging in with invalid password.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Enter valid Email Address', async () => {
      await loginPage.enterUsername(data.credentials.invalidPassword.username);
    });

    await test.step('Step 2: Enter an incorrect password', async () => {
      await loginPage.enterPassword(data.credentials.invalidPassword.password);
    });

    await test.step('Step 3: Click the Sign In button', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Step 4: Verify the invalid credentials error message is displayed', async () => {
      await loginPage.verifyInvalidCredentialsMessageDisplayed();
    });

    await test.step('Step 5: Verify the user is not redirected and remains on the login page', async () => {
      await loginPage.verifyUserRemainsOnLoginPage();
      await allure.attachment('Invalid Password Error', await page.screenshot(), 'image/png');
    });
  });

  test('TC-003 Verify application displays error when logging in with invalid username', async ({ loginPage, config, page }) => {
    allure.story('Login Failure');
    allure.severity('critical');
    allure.description('Verify error message when logging in with invalid username.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Enter an unregistered/invalid Email Address', async () => {
      await loginPage.enterUsername(data.credentials.invalidUsername.username);
    });

    await test.step('Step 2: Enter a valid password', async () => {
      await loginPage.enterPassword(data.credentials.invalidUsername.password);
    });

    await test.step('Step 3: Click the Sign In button', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Step 4: Verify the invalid credentials error message is displayed', async () => {
      await loginPage.verifyInvalidCredentialsMessageDisplayed();
    });

    await test.step('Step 5: Verify the user is not redirected and remains on the login page', async () => {
      await loginPage.verifyUserRemainsOnLoginPage();
      await allure.attachment('Invalid Username Error', await page.screenshot(), 'image/png');
    });
  });

  test('TC-004 Verify application displays validation error when email address field is empty', async ({ loginPage, config, page }) => {
    allure.story('Form Validation');
    allure.severity('normal');
    allure.description('Verify validation error message when email address field is empty.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Leave the Email Address field empty', async () => {
      await loginPage.enterUsername(data.credentials.emptyUsername.username);
    });

    await test.step('Step 2: Enter a valid password', async () => {
      await loginPage.enterPassword(data.credentials.emptyPassword.password);
    });

    await test.step('Step 3: Click the Sign In button', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Step 4: Verify the email validation error message is displayed', async () => {
      await loginPage.verifyMissingEmailValidationMessageDisplayed();
    });

    await test.step('Step 5: Verify the user is not redirected and remains on the login page', async () => {
      await loginPage.verifyUserRemainsOnLoginPage();
      await allure.attachment('Empty Email Error', await page.screenshot(), 'image/png');
    });
  });

  test('TC-005 Verify application displays validation error when password field is empty', async ({ loginPage, config, page }) => {
    allure.story('Form Validation');
    allure.severity('normal');
    allure.description('Verify validation error message when password field is empty.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Enter a valid Email Address', async () => {
      await loginPage.enterUsername(data.credentials.emptyPassword.username);
    });

    await test.step('Step 2: Leave the password field empty', async () => {
      await loginPage.enterPassword(data.credentials.emptyPassword.password);
    });

    await test.step('Step 3: Click the Sign In button', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Step 4: Verify the password validation error message is displayed', async () => {
      await loginPage.verifyMissingPasswordValidationMessageDisplayed();
    });

    await test.step('Step 5: Verify the user is not redirected and remains on the login page', async () => {
      await loginPage.verifyUserRemainsOnLoginPage();
      await allure.attachment('Empty Password Error', await page.screenshot(), 'image/png');
    });
  });

  test('TC-006 Verify application displays validation errors when both credentials fields are empty', async ({ loginPage, config, page }) => {
    allure.story('Form Validation');
    allure.severity('normal');
    allure.description('Verify validation error messages when both username and password fields are empty.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Leave the Email Address field empty', async () => {
      await loginPage.enterUsername(data.credentials.bothEmpty.username);
    });

    await test.step('Step 2: Leave the password field empty', async () => {
      await loginPage.enterPassword(data.credentials.bothEmpty.password);
    });

    await test.step('Step 3: Click the Sign In button', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Step 4: Verify the email validation error message is displayed', async () => {
      await loginPage.verifyMissingEmailValidationMessageDisplayed();
    });

    await test.step('Step 5: Verify the password validation error message is displayed', async () => {
      await loginPage.verifyMissingPasswordValidationMessageDisplayed();
    });

    await test.step('Step 6: Verify the user is not redirected and remains on the login page', async () => {
      await loginPage.verifyUserRemainsOnLoginPage();
      await allure.attachment('Both Fields Empty Error', await page.screenshot(), 'image/png');
    });
  });

  test('TC-007 Verify application displays validation error when email format is invalid', async ({ loginPage, config, page }) => {
    allure.story('Form Validation');
    allure.severity('normal');
    allure.description('Verify validation error message when email format is invalid.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Enter an invalid Email Address format (e.g., missing @ symbol)', async () => {
      await loginPage.enterUsername(data.credentials.invalidEmailFormat.username);
    });

    await test.step('Step 2: Enter a valid password', async () => {
      await loginPage.enterPassword(data.credentials.invalidEmailFormat.password);
    });

    await test.step('Step 3: Click the Sign In button', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Step 4: Verify the email validation error message is displayed', async () => {
      await loginPage.verifyMissingEmailValidationMessageDisplayed();
    });

    await test.step('Step 5: Verify the user is not redirected and remains on the login page', async () => {
      await loginPage.verifyUserRemainsOnLoginPage();
      await allure.attachment('Invalid Email Format Error', await page.screenshot(), 'image/png');
    });
  });

  test('TC-008 Verify login page UI elements are visible on page load', async ({ loginPage, config, page }) => {
    allure.story('UI Integrity');
    allure.severity('minor');
    allure.description('Verify login input fields and submit button are visible on page load.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Verify the login form fields (Email Address, Password, Sign In button) are displayed', async () => {
      await loginPage.verifyLoginFormFieldsDisplayed();
      await allure.attachment('Login Page UI', await page.screenshot(), 'image/png');
    });
  });

  test('TC-009 Verify login page URL matches expected environment domain', async ({ loginPage, config, page }) => {
    allure.story('URL Validation');
    allure.severity('minor');
    allure.description('Verify application URL matches expected domain based on the active environment.');

    await test.step('Precondition: User navigates to the login page', async () => {
      await loginPage.navigateToLogin(config.baseURL);
    });

    await test.step('Step 1: Verify the URL contains the expected application domain', async () => {
      // Clean up baseURL to match exactly what Playwright resolves to
      const cleanBaseURL = config.baseURL.replace(/\/$/, '');
      await expect(page).toHaveURL(new RegExp(cleanBaseURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      await allure.attachment('Login URL Verification', await page.screenshot(), 'image/png');
    });
  });

});
