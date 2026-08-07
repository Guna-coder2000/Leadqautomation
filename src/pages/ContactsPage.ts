import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactsPage extends BasePage {
  private addContactButton: Locator;
  private manualEntryOption: Locator;
  private importOption: Locator;
  private scanOption: Locator;
  private nameInput: Locator;
  private jobTitleInput: Locator;
  private companyInput: Locator;
  private emailInput: Locator;
  private phoneInput: Locator;
  private websiteInput: Locator;
  private saveButton: Locator;
  private discardButton: Locator;
  private backToContactsLink: Locator;
  private searchInput: Locator;
  private contactDetailsHeader: Locator;
  private excelImportHeader: Locator;
  private downloadSampleCsvBtn: Locator;
  private importFileInput: Locator;
  private continueButton: Locator;
  private scanCardStatusBanner: Locator;

  // Log Message Variables
  // Log Message Variables
  private readonly navContactsLog = "Opening 'Contacts' page";
  private readonly addContactBtnLog = "Clicking 'Add Contact' button";
  private readonly manualEntryLog = "Selecting 'Manual Entry' option";
  private readonly importOptionLog = "Selecting 'Import Spreadsheet' option";
  private readonly scanOptionLog = "Selecting 'Scan / Upload' option";
  private readonly nameEnteredLog = "Entering 'Name'";
  private readonly jobTitleEnteredLog = "Entering 'Job Title'";
  private readonly companyEnteredLog = "Entering 'Company'";
  private readonly emailEnteredLog = "Entering 'Email Address'";
  private readonly phoneEnteredLog = "Entering 'Phone Number'";
  private readonly websiteEnteredLog = "Entering 'Website'";
  private readonly saveBtnLog = "Clicking 'Save' button";
  private readonly discardBtnLog = "Clicking 'Discard' button";
  private readonly backLinkLog = "Clicking 'Back to Contacts' link";
  private readonly searchEnteredLog = "Entering 'Search' query";

  constructor(page: any) {
    super(page);
    // Declared strictly using exact single XPath locators directly from DOM
    this.addContactButton = this.page.locator("//button[contains(text(), 'Add Contact')]");
    this.manualEntryOption = this.page.locator("//a[contains(@href, '/manual')] | //*[contains(text(), 'Manual Entry')]");
    this.importOption = this.page.locator("//a[contains(@href, '/import')] | //*[contains(text(), 'Import')]");
    this.scanOption = this.page.locator("//a[contains(@href, '/scan')] | //*[contains(text(), 'Scan')]");

    this.nameInput = this.page.locator("//input[@placeholder='Jane Doe']");
    this.jobTitleInput = this.page.locator("//input[@placeholder='e.g. Senior Marketing Manager']");
    this.companyInput = this.page.locator("//input[@placeholder='e.g. Acme Corp']");
    this.emailInput = this.page.locator("//input[@placeholder='jane@example.com']");
    this.phoneInput = this.page.locator("//input[@type='tel']");
    this.websiteInput = this.page.locator("//input[@placeholder='e.g. https://acme.com']");

    this.saveButton = this.page.locator("//button[contains(text(), 'Save') or @type='submit']").first();
    this.discardButton = this.page.locator("//button[contains(text(), 'Discard') or contains(text(), 'Cancel')]").first();
    this.backToContactsLink = this.page.locator("//a[contains(@href, '/contacts')]").first();
    this.searchInput = this.page.locator("//input[@placeholder='Search']");
    this.contactDetailsHeader = this.page.locator("//h1[contains(text(), 'Contact Details')]");

    // Import Page Locators
    this.excelImportHeader = this.page.locator("//*[text()='Excel Import']").first();
    this.downloadSampleCsvBtn = this.page.locator("//*[contains(text(), 'Download sample') or contains(text(), '.csv')]").first();
    this.importFileInput = this.page.locator("//input[@type='file']").first();
    this.continueButton = this.page.locator("//button[contains(., 'Continue')]");

    // Scan Card Page Locators
    this.scanCardStatusBanner = this.page.locator("//*[contains(text(), 'Align card') or contains(text(), 'Capture') or contains(text(), 'FRONT')]").first();
  }

  // Navigation Methods
  async navigateToContactsPage(baseURL: string) {
    const url = `${baseURL.replace(/\/$/, '')}/dashboard/contacts`;
    await super.navigateTo(url, undefined, this.navContactsLog);
  }

  async navigateToManualEntryPage(baseURL: string) {
    const url = `${baseURL.replace(/\/$/, '')}/dashboard/contacts/manual`;
    await super.navigateTo(url, undefined, "Navigating to Manual Contact Entry page");
  }

  async navigateToImportPage(baseURL: string) {
    const url = `${baseURL.replace(/\/$/, '')}/dashboard/contacts/import`;
    await super.navigateTo(url, undefined, "Navigating to Import Contacts page");
  }

  async navigateToScanCardPage(baseURL: string) {
    const url = `${baseURL.replace(/\/$/, '')}/dashboard/contacts/scan-card`;
    await super.navigateTo(url, undefined, "Navigating to Scan Card page");
  }

  async clickAddContact() {
    await super.clickOnElement(this.addContactButton, this.addContactBtnLog);
  }

  async clickManualEntry() {
    await super.clickOnElement(this.manualEntryOption, this.manualEntryLog);
  }

  async clickImportOption() {
    await super.clickOnElement(this.importOption, this.importOptionLog);
  }

  async clickScanOption() {
    await super.clickOnElement(this.scanOption, this.scanOptionLog);
  }

  // Form Methods
  async enterName(name: string) {
    await super.enterValueForInputElement(this.nameInput, name, { pressSequence: true }, this.nameEnteredLog);
  }

  async enterJobTitle(jobTitle: string) {
    await super.enterValueForInputElement(this.jobTitleInput, jobTitle, { pressSequence: true }, this.jobTitleEnteredLog);
  }

  async enterCompany(company: string) {
    await super.enterValueForInputElement(this.companyInput, company, { pressSequence: true }, this.companyEnteredLog);
  }

  async enterEmail(email: string) {
    await super.enterValueForInputElement(this.emailInput, email, { pressSequence: true }, this.emailEnteredLog);
  }

  async enterPhone(phone: string) {
    await super.enterValueForInputElement(this.phoneInput, phone, { pressSequence: false }, this.phoneEnteredLog);
  }

  async enterWebsite(website: string) {
    await super.enterValueForInputElement(this.websiteInput, website, { pressSequence: true }, this.websiteEnteredLog);
  }

  async clickSaveContactButton() {
    await super.clickOnElement(this.saveButton, this.saveBtnLog);
  }

  async clickDiscardContactButton() {
    await super.clickOnElement(this.discardButton, this.discardBtnLog);
  }

  async clickBackToContacts() {
    await super.clickOnElement(this.backToContactsLink, this.backLinkLog);
  }

  async enterSearchQuery(name: string) {
    await super.enterValueForInputElement(this.searchInput, name, { pressSequence: true }, this.searchEnteredLog);
  }

  // Import & Scan Card Page Verification
  async verifyExcelImportDropzoneDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden(
      [this.excelImportHeader, this.downloadSampleCsvBtn, this.continueButton], 
      { state: BasePage.ElementState.VISIBLE }, 
      "Verifying Excel import dropzone and related buttons are displayed"
    );
  }

  async verifyBusinessCardScannerDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden(
      [this.scanCardStatusBanner], 
      { state: BasePage.ElementState.VISIBLE }, 
      "Verifying Business Card scanner interface is displayed"
    );
  }

  // Validation & List Verification
  async verifyApplicationFormShowsNoValidationErrors() {
    await super.verifyNoFormValidationError();
  }

  async verifyContactRecordDisplayedInGrid(name: string) {
    const contactCell = this.page.locator(`xpath=//*[contains(text(), '${name}')]`).filter({ visible: true }).first();
    await super.waitForListOfElementsToBeVisibleOrHidden([contactCell], { state: BasePage.ElementState.VISIBLE }, `Verifying contact record for ${name} is displayed in the data grid`);
  }

  async verifyContactRecordNotDisplayedInGrid(name: string) {
    const contactCell = this.page.locator(`xpath=//*[contains(text(), '${name}')]`).filter({ visible: true }).first();
    await super.waitForListOfElementsToBeVisibleOrHidden([contactCell], { state: BasePage.ElementState.HIDDEN }, `Verifying contact record for ${name} is NOT displayed in the data grid`);
  }

  async verifyContactDetailsHeaderDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.contactDetailsHeader], { state: BasePage.ElementState.VISIBLE }, "Verifying Contact Details header is displayed");
  }
}
