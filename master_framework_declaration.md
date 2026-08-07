# Single Master Framework Declaration & Reference Guide

This is the **single master reference guide** for the Playwright POM TypeScript Automation Framework. It defines how `BasePage`, Page Objects, Spec files, and `utils` interact.

---

## 1. Master Architecture & Parameter Flow

```
+---------------------------------------------------------------------------------------+
| 1. TEST SPEC FILE (*.spec.ts)                                                         |
|    - Receives page fixtures: ({ loginPage, config })                                  |
|    - Sends ONLY test data inputs: await loginPage.enterUsername(data.username)       |
|    - DOES NOT send locators or log strings                                            |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 2. PAGE OBJECT CLASS (e.g. LoginPage.ts)                                              |
|    - Declares Locators at top of class (private usernameInput: Locator)               |
|    - Declares Human Log Strings at top of class (private readonly emailLog = "...")    |
|    - Forwards locator + input data + options + log string to BasePage                 |
|    - Example: super.enterValueForInputElement(this.usernameInput, val, opts, emailLog)|
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 3. BASE PAGE CLASS (BasePage.ts)                                                      |
|    - Receives: (locator, value/options, logMessage)                                   |
|    - Calls logStep(logMessage) -> outputs "▶ [PageName] STEP: <logMessage>"           |
|    - Executes Playwright action (fill, click, wait)                                   |
|    - Catches low-level errors -> throws custom exceptions (AutomationError, etc.)     |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
| 4. UTILS & REPORTER LAYER (src/utils/)                                                |
|    - exceptions.ts: Throws CustomAssertionError, TimeoutException, NetworkException   |
|    - ConsoleStepReporter.ts: Formats console logs & generates CLIENT PROOF REPORT    |
|      distinguishing [SCRIPT / LOCATOR TIMEOUT] vs [CONFIRMED APPLICATION BUG]        |
|    - assertions.ts & validations.ts: Reusable assert & payload validation helpers     |
+---------------------------------------------------------------------------------------+
```

---

## 2. Complete List of BasePage Methods & Signatures

All Page Objects inherit these methods from `BasePage`.

### 1. `navigateTo(url, options?, logMessage?)`
* **Parameters:**
  * `url`: `string` (Target URL to navigate to)
  * `options?`: `{ waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' } | string`
  * `logMessage?`: `string` (Human log message string)
* **What it does:** Logs step, navigates page. Throws `NetworkException` on failure.

### 2. `clickOnElement(locator1, locator2?, options?, logMessage?)`
* **Parameters:**
  * `locator1`: `Locator` (Primary element to click)
  * `locator2?`: `Locator | Locator[] | string` (Optional element to wait for after click)
  * `options?`: `{ state?: 'visible' | 'hidden'; blur?: boolean } | string`
  * `logMessage?`: `string` (Human log message string)
* **What it does:** Logs step, clicks `locator1`, optionally waits for `locator2`. Throws `AutomationError`.

### 3. `doubleClickOnElement(locator1, locator2?, options?, logMessage?)`
* **Parameters:**
  * `locator1`: `Locator` (Primary element to double-click)
  * `locator2?`: `Locator | Locator[] | string`
  * `options?`: `{ state?: 'visible' | 'hidden'; blur?: boolean } | string`
  * `logMessage?`: `string`
* **What it does:** Logs step, double-clicks `locator1`. Throws `AutomationError`.

### 4. `enterValueForInputElement(locator1, value, options?, logMessage?)`
* **Parameters:**
  * `locator1`: `Locator` (Target input element)
  * `value`: `string` (Text value to enter)
  * `options?`: `{ state?: string; locator2?: Locator; pressSequence?: boolean; blur?: boolean } | string`
  * `logMessage?`: `string` (Human log message string)
* **What it does:** Logs step, validates value, fills/types into `locator1`, blurs. Throws `LeadValidationError` or `AutomationError`.

### 5. `waitForListOfElementsToBeVisibleOrHidden(locators, options?, logMessage?)`
* **Parameters:**
  * `locators`: `Locator[]` (Array of locators to verify)
  * `options?`: `{ state?: 'visible' | 'hidden'; timeout?: number } | string`
  * `logMessage?`: `string`
* **What it does:** Logs step, asserts visibility/hidden state. Throws `CustomAssertionError`.

### 6. `waitForUrlToContainText(text, logMessage?)`
* **Parameters:**
  * `text`: `string` (Expected URL substring)
  * `logMessage?`: `string`
* **What it does:** Logs step, waits for URL substring. Throws `TimeoutException`.

### 7. `clearInputField(locator, logMessage?)`
* **Parameters:**
  * `locator`: `Locator` (Target input element to clear)
  * `logMessage?`: `string`
* **What it does:** Logs step, fills input with empty string. Throws `AutomationError`.

### 8. `performKeyboardAction(action, locators?, state?, logMessage?)`
* **Parameters:**
  * `action`: `'Escape' | 'ArrowDown' | 'ArrowUp' | 'Enter'`
  * `locators?`: `Locator[]`
  * `state?`: `'visible' | 'hidden'`
  * `logMessage?`: `string`
* **What it does:** Logs step, presses keyboard key. Throws `AutomationError`.

---

## 3. Rules: What to Declare vs. What NOT to Declare

### What TO Declare in Page Objects:
1. **Locators at Top of Class:** Declare as `private property: Locator;` and initialize in constructor.
2. **Log Variables at Top of Class:** Declare as `private readonly logVar = "Human-written step message";`.

### What NOT to Declare / NOT to Do:
* ❌ **DO NOT** create separate `validXPath` vs `invalidXPath` (a single element locator represents the UI field).
* ❌ **DO NOT** use inline `this.page.locator('...')` inside page methods (declare at top of class).
* ❌ **DO NOT** use dynamic string interpolation like `${username}` in log variables (keep logs human-phrased).
* ❌ **DO NOT** pass locators or log messages in Spec files (Spec files pass ONLY test data inputs).

---

## 4. Page Object Master Example ([LoginPage.ts](file:///c:/Users/gunasekhar.p/OneDrive%20-%20TestPerform/Desktop/Leadq-automation/src/pages/LoginPage.ts))

```typescript
import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // 1. Locators declared at top of class
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private emailErrorMessage: Locator;

  // 2. Log message variables declared at top of class
  private readonly navigatedToLoginLog = "Opening login page";
  private readonly emailEnteredLog = "Entering email address";
  private readonly passwordEnteredLog = "Entering password";
  private readonly loginButtonClickedLog = "Clicking Sign In button";
  private readonly emailErrorLog = "Checking email validation error message";

  constructor(page: any) {
    super(page);
    this.usernameInput = this.page.locator('input[placeholder="Email Address"], input[type="email"]').first();
    this.passwordInput = this.page.locator('input[placeholder="Enter your password"], input[type="password"]').first();
    this.loginButton = this.page.locator('button:has-text("Sign In"), button[type="submit"]').first();
    this.emailErrorMessage = this.page.locator("text=Please enter a valid email address");
  }

  // 3. Methods forward (locator, value, options, logVariable) to BasePage
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
    await super.clickOnElement(this.loginButton, this.loginButtonClickedLog);
  }

  async verifyEmailErrorVisible() {
    await super.waitForListOfElementsToBeVisibleOrHidden(
      [this.emailErrorMessage], 
      { state: BasePage.ElementState.VISIBLE }, 
      this.emailErrorLog
    );
  }
}
```

---

## 5. Spec File Master Example ([login.spec.ts](file:///c:/Users/gunasekhar.p/OneDrive%20-%20TestPerform/Desktop/Leadq-automation/src/tests/e2e/login.spec.ts))

Spec files receive fixtures and send **ONLY** test data parameters:

```typescript
import { test, expect } from '../../fixtures/testFixtures';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('sample/login.json', 'utf-8'));

test.describe('Leadq Login Functionality', () => {

  test('TC-001: Valid login with correct credentials', async ({ loginPage, config }) => {
    await loginPage.navigateToLogin(config.baseURL);
    await loginPage.enterUsername(data.credentials.valid.username);
    await loginPage.enterPassword(data.credentials.valid.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyDashboardLoaded();
  });

  test('TC-002: Invalid login with wrong password', async ({ loginPage, config }) => {
    await loginPage.navigateToLogin(config.baseURL);
    await loginPage.enterUsername(data.credentials.invalidPassword.username);
    await loginPage.enterPassword(data.credentials.invalidPassword.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyInvalidCredentialsErrorVisible();
    await loginPage.verifyStillOnLoginPage();
  });

});
```

---

## 6. How and Where to Use `src/utils/`

### A. `src/utils/assertions.ts`
Use when performing assertion checks in page objects or custom helpers:
* `assertElementVisible(locator, "Message")`
* `assertElementHidden(locator, "Message")`
* `assertElementTextEquals(locator, "Expected Text", "Message")`
* `assertUrlContains(page, "dashboard", "Message")`

### B. `src/utils/validations.ts`
Use to validate business data payloads before filling input fields:
* `validateEmail(email)` -> Throws `LeadValidationError` if email format invalid.
* `validatePhoneNumber(phone)` -> Throws `LeadValidationError` if phone format invalid.
* `validateLeadData(leadObject)` -> Validates required fields before submission.

### C. `src/utils/exceptions.ts`
Custom error hierarchy used by `BasePage` and `ConsoleStepReporter`:
* `AutomationError`: General action failure.
* `XPathNotFoundError`: Missing locator definition.
* `TimeoutException`: Locator or URL timeout.
* `CustomAssertionError`: UI expectation mismatch (classified as **APPLICATION BUG**).
* `LeadValidationError`: Invalid input data payload.
* `NetworkException`: Navigation or API failure.

### D. `src/utils/ConsoleStepReporter.ts`
Automatically handles execution output:
* Prints `▶ [PageName] STEP: <logMessage>` during test execution.
* On failure, outputs **CLIENT PROOF DIAGNOSTIC REPORT**:
  * `🏷️ Category: CODE ERROR / LOCATOR TIMEOUT` (if locator failed)
  * `🏷️ Category: CONFIRMED APPLICATION BUG / PRODUCT DEFECT` (if assertion failed)
  * Shows exact line number, executed step history, and clean 10-line callstack.

---

## 7. Global Configuration ([playwright.config.ts](file:///c:/Users/gunasekhar.p/OneDrive%20-%20TestPerform/Desktop/Leadq-automation/playwright.config.ts))

Global settings apply automatically to **all test cases**:

```typescript
export default defineConfig({
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
    trace: 'on',      // Millisecond trace recording for every test case
    screenshot: 'on', // Screenshot for every test case
    video: 'on',      // Full video recording (.webm) for every test case
  },
});
```
