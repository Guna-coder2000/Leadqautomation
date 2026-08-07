# Pure Framework Architecture & Execution Pattern (Generic Example)

This example uses **pure generic names** (`SamplePage`, `elementA`, `inputFieldB`) to demonstrate how the framework mechanics work without domain-specific pages like Login or Dashboard.

---

## 1. Generic Page Object (`src/pages/SamplePage.ts`)

```typescript
import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertElementVisible } from '../utils/assertions';
import { validateEmail } from '../utils/validations';

export class SamplePage extends BasePage {
  // 1. Declare Locators at top of class
  private inputFieldA: Locator;
  private actionButtonB: Locator;
  private statusContainerC: Locator;

  // 2. Declare Human Log String Variables at top of class
  private readonly navPageLog = "Navigating to Sample page";
  private readonly fillInputLog = "Entering value into input field A";
  private readonly clickButtonLog = "Clicking action button B";
  private readonly verifyStatusLog = "Checking status container visibility";

  constructor(page: any) {
    super(page);
    // 3. Initialize Locators in constructor
    this.inputFieldA = this.page.locator("//input[@id='generic-input']").first();
    this.actionButtonB = this.page.locator("//button[@id='generic-button']").first();
    this.statusContainerC = this.page.locator("//div[@id='generic-status']").first();
  }

  // 4. Action Methods - Pass (locator, value/options, logVariable) to BasePage
  async openSamplePage(targetUrl: string) {
    await super.navigateTo(targetUrl, undefined, this.navPageLog);
  }

  async enterSampleValue(inputValue: string) {
    // Optionally validate payload with utils before sending
    validateEmail(inputValue);
    
    await super.enterValueForInputElement(
      this.inputFieldA,
      inputValue,
      { pressSequence: true },
      this.fillInputLog
    );
  }

  async clickActionButton() {
    await super.clickOnElement(this.actionButtonB, this.clickButtonLog);
  }

  async verifyStatusVisible() {
    await super.waitForListOfElementsToBeVisibleOrHidden(
      [this.statusContainerC],
      { state: BasePage.ElementState.VISIBLE },
      this.verifyStatusLog
    );
  }
}
```

---

## 2. Generic Fixture Registration (`src/fixtures/testFixtures.ts`)

```typescript
import { test as baseTest } from '@playwright/test';
import { SamplePage } from '../pages/SamplePage';
import { getEnvConfig, EnvConfig } from '../utils/env';

type FrameworkFixtures = {
  samplePage: SamplePage;
  config: EnvConfig;
};

export const test = baseTest.extend<FrameworkFixtures>({
  config: async ({}, use) => {
    await use(getEnvConfig());
  },
  samplePage: async ({ page }, use) => {
    await use(new SamplePage(page));
  },
});

export { expect } from '@playwright/test';
```

---

## 3. Generic Test Spec (`src/tests/e2e/sample.spec.ts`)

```typescript
import { test, expect } from '../../fixtures/testFixtures';

test.describe('Generic Feature Test Suite', () => {

  test('TC-000: Generic End-to-End Execution Flow', async ({ samplePage, config }) => {
    // 1. Open target URL
    await samplePage.openSamplePage(config.baseURL);

    // 2. Perform actions by passing ONLY test data inputs
    await samplePage.enterSampleValue('sample@example.com');
    await samplePage.clickActionButton();

    // 3. Perform verifications
    await samplePage.verifyStatusVisible();
  });

});
```

---

## 4. Parameter Flow Matrix

| Layer | Responsibility | What It Receives | What It Sends Out |
| :--- | :--- | :--- | :--- |
| **Spec File** | Test orchestration | Fixtures (`samplePage`, `config`) | Test data strings (`'sample@example.com'`) |
| **Page Object** | Locators + Logs | Test data strings | `(this.inputFieldA, inputValue, options, this.fillInputLog)` to `BasePage` |
| **BasePage** | Execution & Errors | Locators, Data, Log strings | Executes Playwright action & logs step via `logStep()`. Throws custom exceptions if failed. |
| **Utils** | Helper & Diagnostic | Raw inputs / Error context | Validates data, runs assertions, formats diagnostic reports. |
