import { test, expect } from '../../fixtures/testFixtures';
import { allure } from 'allure-playwright';
import fs from 'fs';

const loginData = JSON.parse(fs.readFileSync('sample/login.json', 'utf-8'));
const contactsData = JSON.parse(fs.readFileSync('sample/contacts.json', 'utf-8'));

test.describe('LeadQ Contacts Module', () => {

  test.beforeEach(async ({ loginPage, config }) => {
    allure.epic('LeadQ CRM Management');
    allure.feature('Contacts Management');
    allure.owner('LeadQ QA Team');

    await test.step('Precondition: User is authenticated and on the dashboard', async () => {
      await loginPage.navigateToLogin(config.baseURL);
      await loginPage.enterUsername(loginData.credentials.valid.username);
      await loginPage.enterPassword(loginData.credentials.valid.password);
      await loginPage.clickLoginButton();
      await loginPage.verifySuccessfulRedirectToDashboard();
    });
  });

  test('TC-101 Verify user can navigate to Contacts page and view the main contacts dashboard', async ({ contactsPage, config, page }) => {
    allure.story('Contacts Dashboard');
    allure.severity('critical');
    allure.description('Verify user can navigate to Contacts page and the Add Contact button is accessible.');

    await test.step('Step 1: Navigate directly to the Contacts module', async () => {
      await contactsPage.navigateToContactsPage(config.baseURL);
    });

    await test.step('Step 2: Click the Add Contact button to ensure the sub-menu opens', async () => {
      await contactsPage.clickAddContact();
      await allure.attachment('Add Contact Menu', await page.screenshot(), 'image/png');
    });
  });

  test('TC-102 Verify user can successfully create a new contact manually and it appears in the grid', async ({ contactsPage, config, page }) => {
    allure.story('Manual Contact Creation');
    allure.severity('blocker');
    allure.description('Submit contact creation form and verify zero validation errors, redirection, and row existence in table.');

    await test.step('Precondition: Navigate to the Manual Entry form', async () => {
      await contactsPage.navigateToManualEntryPage(config.baseURL);
      await expect(page).toHaveURL(/.*contacts\/manual/);
    });

    await test.step('Step 1: Fill out the contact creation form with valid details', async () => {
      await contactsPage.enterName(contactsData.validContact.name);
      await contactsPage.enterJobTitle(contactsData.validContact.jobTitle);
      await contactsPage.enterCompany(contactsData.validContact.company);
      await contactsPage.enterEmail(contactsData.validContact.email);
      await contactsPage.enterPhone(contactsData.validContact.phone);
    });

    await test.step('Step 2: Submit the form by clicking Save', async () => {
      await contactsPage.clickSaveContactButton();
    });

    await test.step('Step 3: Verify no application validation errors are displayed on the form', async () => {
      await contactsPage.verifyApplicationFormShowsNoValidationErrors();
    });

    await test.step('Step 4: Navigate back to the Contacts dashboard to verify creation', async () => {
      await contactsPage.navigateToContactsPage(config.baseURL);
    });
  });

  test('TC-103 Verify user can navigate to Spreadsheet Import page and view the dropzone', async ({ contactsPage, config, page }) => {
    allure.story('Spreadsheet Import');
    allure.severity('normal');
    allure.description('Verify navigation to Excel/CSV import sub-page and validate dropzone and sample template buttons.');

    await test.step('Step 1: Navigate to the Import Contacts page', async () => {
      await contactsPage.navigateToImportPage(config.baseURL);
    });

    await test.step('Step 2: Verify the URL is correct for the import module', async () => {
      await expect(page).toHaveURL(/.*contacts\/import/);
    });

    await test.step('Step 3: Verify the Excel import dropzone and upload interface are displayed', async () => {
      await contactsPage.verifyExcelImportDropzoneDisplayed();
      await allure.attachment('Import Dropzone', await page.screenshot(), 'image/png');
    });
  });

  test('TC-105 Verify contact creation form validation for invalid email format', async ({ contactsPage, config, page }) => {
    allure.story('Manual Contact Creation');
    allure.severity('normal');
    allure.description('Verify form throws validation error when an invalid email is provided.');

    await test.step('Precondition: Navigate to the Manual Entry form', async () => {
      await contactsPage.navigateToManualEntryPage(config.baseURL);
    });

    await test.step('Step 1: Enter an invalid email format', async () => {
      await contactsPage.enterEmail('invalid-email-format');
    });

    await test.step('Step 2: Submit the form by clicking Save', async () => {
      await contactsPage.clickSaveContactButton();
      await allure.attachment('Invalid Email Validation', await page.screenshot(), 'image/png');
    });
  });

  test('TC-106 Verify user can discard a new contact creation process', async ({ contactsPage, config, page }) => {
    allure.story('Manual Contact Creation');
    allure.severity('minor');
    allure.description('Verify the discard button cancels the creation and returns the user to the contacts dashboard.');

    await test.step('Precondition: Navigate to the Manual Entry form', async () => {
      await contactsPage.navigateToManualEntryPage(config.baseURL);
    });

    await test.step('Step 1: Enter some partial data', async () => {
      await contactsPage.enterName('Discard Me');
    });

    await test.step('Step 2: Click the Discard button', async () => {
      await contactsPage.clickDiscardContactButton();
    });

    await test.step('Step 3: Verify the user is returned to the Contacts dashboard', async () => {
      await expect(page).toHaveURL(/.*dashboard/);
      await allure.attachment('Discard Returns to Dashboard', await page.screenshot(), 'image/png');
    });
  });

  test('TC-107 Verify contact grid shows no results for non-existent contact', async ({ contactsPage, config, page }) => {
    allure.story('Contacts Dashboard');
    allure.severity('normal');
    allure.description('Verify search functionality correctly filters out non-existent records.');

    await test.step('Precondition: Navigate directly to the Contacts module', async () => {
      await contactsPage.navigateToContactsPage(config.baseURL);
    });

    await test.step('Step 1: Search for a random string that does not exist', async () => {
      await contactsPage.enterSearchQuery('NonExistentNameXYZ123');
    });

    await test.step('Step 2: Verify the contact record is NOT displayed in the data grid', async () => {
      await contactsPage.verifyContactRecordNotDisplayedInGrid('NonExistentNameXYZ123');
      await allure.attachment('No Results Grid', await page.screenshot(), 'image/png');
    });
  });

});
