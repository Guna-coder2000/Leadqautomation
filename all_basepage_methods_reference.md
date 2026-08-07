# Complete Exhaustive BasePage Methods Reference

This document lists **EVERY SINGLE METHOD** in `BasePage.ts`, showing parameter breakdowns, how Page Objects forward parameters to `super`, and how Spec Files call the Page Object methods.

---

## 1. `navigateTo`

* **BasePage Signature:** `async navigateTo(url: string, options?: object | string, logMessage?: string)`
* **BasePage Parameters:**
  1. `url` (`string`, Required): Target web address.
  2. `options` (`object | string`, Optional): `{ waitUntil: 'load' | 'domcontentloaded' | 'networkidle' }` OR logMessage string.
  3. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private readonly navLog = "Opening target application URL";

async openUrl(url: string) {
  await super.navigateTo(url, undefined, this.navLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.openUrl('https://app.leadq.ai');
```

---

## 2. `clickOnElement`

* **BasePage Signature:** `protected async clickOnElement(locator1: Locator, locator2?: Locator | Locator[] | string, options?: object | string, logMessage?: string)`
* **BasePage Parameters:**
  1. `locator1` (`Locator`, Required): Primary element to click.
  2. `locator2` (`Locator | Locator[] | string`, Optional): Element(s) to wait for after clicking OR logMessage.
  3. `options` (`{ state?: 'visible' | 'hidden'; blur?: boolean } | string`, Optional): Post-click behavior options OR logMessage.
  4. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private submitButton: Locator;
private readonly clickSubmitLog = "Clicking Submit button";

constructor(page: any) {
  super(page);
  this.submitButton = this.page.locator("//button[@type='submit']");
}

async clickSubmit() {
  await super.clickOnElement(this.submitButton, this.clickSubmitLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.clickSubmit();
```

---

## 3. `doubleClickOnElement`

* **BasePage Signature:** `protected async doubleClickOnElement(locator1: Locator, locator2?: Locator | Locator[] | string, options?: object | string, logMessage?: string)`
* **BasePage Parameters:**
  1. `locator1` (`Locator`, Required): Primary element to double-click.
  2. `locator2` (`Locator | Locator[] | string`, Optional): Element(s) to wait for after double-clicking OR logMessage.
  3. `options` (`{ state?: 'visible' | 'hidden'; blur?: boolean } | string`, Optional): Options OR logMessage.
  4. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private rowItem: Locator;
private readonly doubleClickRowLog = "Double-clicking grid row item";

async doubleClickRow() {
  await super.doubleClickOnElement(this.rowItem, this.doubleClickRowLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.doubleClickRow();
```

---

## 4. `enterValueForInputElement`

* **BasePage Signature:** `protected async enterValueForInputElement(locator1: Locator, value: string, options?: object | string, logMessage?: string)`
* **BasePage Parameters:**
  1. `locator1` (`Locator`, Required): Input field locator.
  2. `value` (`string`, Required): Text value to enter.
  3. `options` (`{ state?: string; locator2?: Locator; pressSequence?: boolean; blur?: boolean } | string`, Optional): Entry behavior options OR logMessage.
  4. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private emailInput: Locator;
private readonly fillEmailLog = "Entering user email address";

async fillEmail(emailStr: string) {
  await super.enterValueForInputElement(
    this.emailInput, 
    emailStr, 
    { pressSequence: true }, 
    this.fillEmailLog
  );
}

// SPEC FILE (sample.spec.ts)
await samplePage.fillEmail('user@leadq.ai');
```

---

## 5. `enterValueForInputElementWithOptions`

* **BasePage Signature:** `protected async enterValueForInputElementWithOptions(locator1: Locator, value: string, options?: object & IExpectPollOptions, logMessage?: string)`
* **BasePage Parameters:**
  1. `locator1` (`Locator`, Required): Input field locator.
  2. `value` (`string`, Required): Text value to enter.
  3. `options` (`{ pollFunction?: fn, pollTimeout?: 5000, pressSequence?: boolean }`, Optional): Polling options.
  4. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private searchInput: Locator;
private readonly pollSearchLog = "Entering search query with polling wait";

async fillSearchWithPolling(query: string) {
  await super.enterValueForInputElementWithOptions(
    this.searchInput,
    query,
    { pollTimeout: 5000 },
    this.pollSearchLog
  );
}

// SPEC FILE (sample.spec.ts)
await samplePage.fillSearchWithPolling('Analytics Data');
```

---

## 6. `keyboardType`

* **BasePage Signature:** `protected async keyboardType(locator1: Locator, value: string, logMessage?: string)`
* **BasePage Parameters:**
  1. `locator1` (`Locator`, Required): Target element.
  2. `value` (`string`, Required): Characters to type sequentially.
  3. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private codeInput: Locator;
private readonly typeCodeLog = "Typing security code via keyboard";

async typeSecurityCode(code: string) {
  await super.keyboardType(this.codeInput, code, this.typeCodeLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.typeSecurityCode('987654');
```

---

## 7. `waitForListOfElementsToBeVisibleOrHidden`

* **BasePage Signature:** `protected async waitForListOfElementsToBeVisibleOrHidden(locators: Locator[], options?: object | string, logMessage?: string)`
* **BasePage Parameters:**
  1. `locators` (`Locator[]`, Required): Array of locators to verify.
  2. `options` (`{ state?: 'visible'|'hidden'|'VISIBLE'|'HIDDEN'; timeout?: number } | string`, Optional): Visibility state & timeout OR logMessage.
  3. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private successAlert: Locator;
private readonly verifySuccessAlertLog = "Verifying success alert container is visible";

async verifySuccessAlert() {
  await super.waitForListOfElementsToBeVisibleOrHidden(
    [this.successAlert],
    { state: BasePage.ElementState.VISIBLE, timeout: 15000 },
    this.verifySuccessAlertLog
  );
}

// SPEC FILE (sample.spec.ts)
await samplePage.verifySuccessAlert();
```

---

## 8. `waitForUrlToContainText`

* **BasePage Signature:** `protected async waitForUrlToContainText(text: string, logMessage?: string)`
* **BasePage Parameters:**
  1. `text` (`string`, Required): Expected URL substring.
  2. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private readonly verifyUrlLog = "Checking browser URL contains /dashboard";

async verifyDashboardUrl() {
  await super.waitForUrlToContainText('dashboard', this.verifyUrlLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.verifyDashboardUrl();
```

---

## 9. `clearInputField`

* **BasePage Signature:** `protected async clearInputField(locator: Locator, logMessage?: string)`
* **BasePage Parameters:**
  1. `locator` (`Locator`, Required): Input field to clear.
  2. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private usernameInput: Locator;
private readonly clearUserLog = "Clearing username field";

async clearUsernameField() {
  await super.clearInputField(this.usernameInput, this.clearUserLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.clearUsernameField();
```

---

## 10. `performKeyboardAction`

* **BasePage Signature:** `protected async performKeyboardAction(action: 'Enter'|'Escape'|'ArrowDown'|'ArrowUp', locators?: Locator[], state?: string, logMessage?: string)`
* **BasePage Parameters:**
  1. `action` (`'Enter' | 'Escape' | 'ArrowDown' | 'ArrowUp'`, Required): Keyboard key to press.
  2. `locators` (`Locator[]`, Optional): Locators to monitor post-press.
  3. `state` (`'visible' | 'hidden'`, Optional): Desired state of locators.
  4. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private readonly pressEnterLog = "Pressing Enter key on keyboard";

async pressEnterKey() {
  await super.performKeyboardAction(BasePage.ActionType.Enter, undefined, undefined, this.pressEnterLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.pressEnterKey();
```

---

## 11. `hoverOverElementandVerifyElements`

* **BasePage Signature:** `protected async hoverOverElementandVerifyElements(locator: Locator, logMessage?: string)`
* **BasePage Parameters:**
  1. `locator` (`Locator`, Required): Target element to hover over.
  2. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private menuDropdown: Locator;
private readonly hoverMenuLog = "Hovering over top navigation menu";

async hoverOverMenu() {
  await super.hoverOverElementandVerifyElements(this.menuDropdown, this.hoverMenuLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.hoverOverMenu();
```

---

## 12. `waitForNetworkRequest` & `waitForNetworkResponse`

* **BasePage Signature:** `protected async waitForNetworkRequest(urlSubstring: string, logMessage?: string)`
* **BasePage Signature:** `protected async waitForNetworkResponse(urlSubstring: string, logMessage?: string)`
* **BasePage Parameters:**
  1. `urlSubstring` (`string`, Required): API endpoint URL substring to match.
  2. `logMessage` (`string`, Optional): Human step log message.

### Code Flow Example:
```typescript
// PAGE OBJECT (e.g., SamplePage.ts)
private readonly waitForApiLog = "Waiting for /api/v1/user network response";

async waitForUserResponse() {
  await super.waitForNetworkResponse('/api/v1/user', this.waitForApiLog);
}

// SPEC FILE (sample.spec.ts)
await samplePage.waitForUserResponse();
```
