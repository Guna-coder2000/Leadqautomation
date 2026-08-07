import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  private editButton: Locator;
  private saveButton: Locator;
  private cancelButton: Locator;
  private resetButton: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private emailInput: Locator;
  private phoneNumberInput: Locator;
  private cityInput: Locator;
  private loadingMessage: Locator;

  // Log Message Variables
  private readonly editBtnLog = "Clicking 'Edit' button";
  private readonly saveBtnLog = "Clicking 'Save' button";
  private readonly cancelBtnLog = "Clicking 'Cancel' button";
  private readonly firstNameEnteredLog = "Entering 'First Name'";
  private readonly lastNameEnteredLog = "Entering 'Last Name'";
  private readonly phoneEnteredLog = "Entering 'Phone Number'";
  private readonly cityEnteredLog = "Entering 'City'";

  constructor(page: any) {
    super(page);
    this.editButton = this.page.locator("//button[contains(., 'Edit')]");
    this.saveButton = this.page.locator("//button[contains(., 'Save')]");
    this.cancelButton = this.page.locator("//button[contains(., 'Cancel')]");
    this.resetButton = this.page.locator("//button[contains(., 'Reset')]");
    
    this.firstNameInput = this.page.locator("//input[@placeholder='First Name' or @name='firstName']");
    this.lastNameInput = this.page.locator("//input[@placeholder='Last Name' or @name='lastName']");
    this.emailInput = this.page.locator("//input[@placeholder='Email Address' or @type='email']");
    this.phoneNumberInput = this.page.locator("//input[@type='tel']");
    this.cityInput = this.page.locator("//input[@placeholder='City' or @name='city']");
    this.loadingMessage = this.page.locator("//div[contains(text(), 'Loading')]");
  }

  async waitForProfilePageToLoad() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.loadingMessage], { state: BasePage.ElementState.HIDDEN }, "Waiting for Profile loading message to disappear");
    await super.waitForListOfElementsToBeVisibleOrHidden([this.editButton], { state: BasePage.ElementState.VISIBLE }, "Waiting for Edit Profile button to appear");
  }

  async clickEditProfileButton() {
    await this.waitForProfilePageToLoad();
    await super.clickOnElement(this.editButton, this.editBtnLog);
  }

  async clickSaveProfileButton() {
    await super.clickOnElement(this.saveButton, this.saveBtnLog);
    await this.waitForProfilePageToLoad();
  }

  async clickCancelProfileEditButton() {
    await super.clickOnElement(this.cancelButton, this.cancelBtnLog);
    await this.waitForProfilePageToLoad();
  }

  async enterFirstName(firstName: string) {
    await super.enterValueForInputElement(this.firstNameInput, firstName, { pressSequence: true }, this.firstNameEnteredLog);
  }

  async enterLastName(lastName: string) {
    await super.enterValueForInputElement(this.lastNameInput, lastName, { pressSequence: true }, this.lastNameEnteredLog);
  }

  async enterPhoneNumber(phone: string) {
    await super.enterValueForInputElement(this.phoneNumberInput, phone, { pressSequence: false }, this.phoneEnteredLog);
  }

  async enterCity(city: string) {
    await super.enterValueForInputElement(this.cityInput, city, { pressSequence: true }, this.cityEnteredLog);
  }

  async verifyFirstNameValueMatches(expected: string) {
    await this.waitForProfilePageToLoad();
    await expect(this.firstNameInput).toHaveValue(expected);
  }

  async verifyLastNameValueMatches(expected: string) {
    await this.waitForProfilePageToLoad();
    await expect(this.lastNameInput).toHaveValue(expected);
  }

  async verifyPhoneNumberValueMatches(expected: string) {
    await this.waitForProfilePageToLoad();
    const value = await this.phoneNumberInput.inputValue();
    expect(value.replace(/\D/g, '')).toContain(expected.replace(/\D/g, ''));
  }

  async verifyEmailFieldIsReadOnlyAndMatches(expected: string) {
    await this.waitForProfilePageToLoad();
    const isInput = await this.emailInput.evaluate((el: any) => el.tagName === 'INPUT').catch(() => false);
    if (isInput) {
      await expect(this.emailInput).toHaveValue(expected);
      const isDisabled = await this.emailInput.isDisabled();
      const isReadonly = await this.emailInput.getAttribute('readonly') !== null;
      expect(isDisabled || isReadonly).toBe(true);
    } else {
      const text = await this.emailInput.textContent();
      expect(text ? text.trim() : '').toBe(expected);
    }
  }

  async verifyResetButtonIsNotDisplayed() {
    await this.waitForProfilePageToLoad();
    await super.waitForListOfElementsToBeVisibleOrHidden([this.resetButton], { state: BasePage.ElementState.HIDDEN }, "Verifying Reset button is not displayed on profile page");
  }
}
