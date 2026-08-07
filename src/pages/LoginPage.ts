import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private emailErrorMessage: Locator;
  private passwordErrorMessage: Locator;
  private invalidCredentialsError: Locator;

  // Log Message Variables
  private readonly navigatedToLoginLog = "Opening 'Login' page";
  private readonly emailEnteredLog = "Entering 'Email Address'";
  private readonly passwordEnteredLog = "Entering 'Password'";
  private readonly loginButtonClickedLog = "Clicking 'Sign In' button";
  private readonly usernameClearedLog = "Clearing 'Email Address' field";
  private readonly passwordClearedLog = "Clearing 'Password' field";
  private readonly emailErrorLog = "Verifying 'Email Address' validation error message";
  private readonly passwordErrorLog = "Verifying 'Password' validation error message";
  private readonly invalidCredentialsErrorLog = "Verifying 'Invalid credentials' error message";
  private readonly dashboardLoadedLog = "Verifying successful redirect to 'Dashboard'";
  private readonly stillOnLoginLog = "Verifying user remains on 'Login' page";
  private readonly formVisibleLog = "Verifying 'Login' form fields are visible";

  constructor(page: any) {
    super(page);
    this.usernameInput = this.page.locator("//input[@placeholder='Email Address']");
    this.passwordInput = this.page.locator("//input[@placeholder='Enter your password']");
    this.loginButton = this.page.locator("//button[@type='submit']");
    this.emailErrorMessage = this.page.locator("//p[text()='Please enter a valid email address']");
    this.passwordErrorMessage = this.page.locator("//p[text()='Password is required']");
    this.invalidCredentialsError = this.page.locator("//p[text()='Invalid email or password']");
  }

  async navigateToLogin(baseURL: string) {
    await super.navigateTo(baseURL, undefined, this.navigatedToLoginLog);
  }

  async enterUsername(username: string) {
    await super.enterValueForInputElement(this.usernameInput, username, this.emailEnteredLog);
  }

  async enterPassword(password: string) {
    await super.enterValueForInputElement(this.passwordInput, password, this.passwordEnteredLog);
  }

  async clickLoginButton() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.loginButton], { state: BasePage.ElementState.VISIBLE }, "Waiting for Sign In button");
    await super.clickOnElement(this.loginButton, this.loginButtonClickedLog);
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async clearUsername() {
    await super.clearInputField(this.usernameInput, this.usernameClearedLog);
  }

  async clearPassword() {
    await super.clearInputField(this.passwordInput, this.passwordClearedLog);
  }

  // Verification methods - mapped to business expectations
  async verifyMissingEmailValidationMessageDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.emailErrorMessage], { state: BasePage.ElementState.VISIBLE }, this.emailErrorLog);
  }

  async verifyMissingPasswordValidationMessageDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.passwordErrorMessage], { state: BasePage.ElementState.VISIBLE }, this.passwordErrorLog);
  }

  async verifyInvalidCredentialsMessageDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.invalidCredentialsError], { state: BasePage.ElementState.VISIBLE }, this.invalidCredentialsErrorLog);
  }

  async verifySuccessfulRedirectToDashboard() {
    await super.waitForUrlToContainText('dashboard', this.dashboardLoadedLog);
  }

  async verifyUserRemainsOnLoginPage() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.loginButton], { state: BasePage.ElementState.VISIBLE }, this.stillOnLoginLog);
  }

  async verifyLoginFormFieldsDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.usernameInput, this.passwordInput, this.loginButton], { state: BasePage.ElementState.VISIBLE }, this.formVisibleLog);
  }
}
