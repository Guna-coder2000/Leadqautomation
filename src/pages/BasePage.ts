import { expect, Locator, test } from "@playwright/test";
import { FrameworkError, CustomAssertionError, TimeoutError, NetworkError, LocatorError, mapPlaywrightError } from "../utils/exceptions";
import { assertElementVisible, assertElementHidden } from "../utils/assertions";

type XPath = string;

interface IExpectPollOptions {
  pollFunction?: () => Promise<boolean>;
  pollTimeout?: number;
  pollIntervals?: number[];
}

export abstract class BasePage {
    protected page: any;

    constructor(page: any) {
        this.page = page;
    }

    protected logStep(logMessage?: string) {
        if (logMessage) {
            console.log(`▶ [${this.constructor.name}] STEP: ${logMessage}`);
        }
    }

    async navigateTo(
        url: string,
        options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' } | string,
        logMessage?: string
    ) {
        let actualOptions: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' } | undefined;
        let actualLog: string | undefined = logMessage;

        if (typeof options === 'string') {
            actualLog = options;
        } else if (typeof options === 'object') {
            actualOptions = options;
        }

        const stepTitle = actualLog || `Navigating to URL: ${url}`;

        await test.step(stepTitle, async () => {
            this.logStep(stepTitle);
            try {
                await this.page.goto(url, { waitUntil: 'domcontentloaded', ...actualOptions });
            } catch (error: any) {
                console.error(`❌ FAILED NAVIGATION [${stepTitle}]: ${error.message}`);
                throw mapPlaywrightError(error, stepTitle);
            }
        });
    }

    /** Element state constants */
  public static readonly ElementState = {
    VISIBLE: 'visible',
    HIDDEN: 'hidden',
  } as const;

  /** Keyboard action constants */
  public static readonly ActionType = {
    Escape: 'Escape',
    ArrowDown: 'ArrowDown',
    ArrowUp: 'ArrowUp',
    Enter: 'Enter',
  } as const;

  /**
   * Retrieve a dynamic locator from child class XPaths with placeholders.
   */
  protected getDynamicLocatorFromChild(
    xpaths: Record<string, string>,
    key: string,
    ...args: string[]
  ): Locator {
    const template = xpaths[key];
    if (!template) throw new LocatorError(`XPath template key "${key}" was not found in ${this.constructor.name}.`, 'getDynamicLocatorFromChild');

    const resolvedXPath = args.reduce(
      (acc, arg, index) => acc.replace(`{${index}}`, arg),
      template
    );

    return this.page.locator(resolvedXPath);
  }

  /**
   * Click on an element. Playwright auto-waits for actionability.
   * Errors are caught, mapped to FrameworkError subclasses, and rethrown.
   */
  protected async clickOnElement(
    locator1: Locator,
    logMessage?: string,
    blur?: boolean,
    targetLocator2?: Locator | Locator[],
    state: string = BasePage.ElementState.VISIBLE
  ): Promise<void> {
    // Support legacy overloaded signatures
    let targetLoc2: Locator | Locator[] | undefined = targetLocator2;
    let actualLog: string | undefined = logMessage;
    let actualBlur = blur ?? false;
    let actualState = state;

    // Handle overload: clickOnElement(loc, locOrString, optionsOrString, log)
    if (arguments.length >= 2 && typeof arguments[1] === 'object' && arguments[1] !== null && !('click' in arguments[1]) && !Array.isArray(arguments[1])) {
      // options object passed as second arg
    }

    const stepTitle = actualLog || "Clicking element";

    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);

      try {
        await locator1.click();
      } catch (error: any) {
        console.error(`❌ FAILED ACTION [${stepTitle}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }

      if (actualBlur) {
        try {
          await locator1.blur();
        } catch (error: any) {
          throw mapPlaywrightError(error, `${stepTitle} (blur)`);
        }
      }

      if (targetLoc2) {
        for (const loc of Array.isArray(targetLoc2) ? targetLoc2 : [targetLoc2]) {
          await this.waitForLocatorState(loc, actualState);
        }
      }
    });
  }

  /**
   * Double-click on an element. Playwright auto-waits for actionability.
   */
  protected async doubleClickOnElement(
    locator1: Locator,
    locator2?: Locator | Locator[] | string,
    options?: { state?: keyof typeof BasePage.ElementState; blur?: boolean } | string,
    logMessage?: string
  ) {
    let targetLocator2: Locator | Locator[] | undefined;
    let actualOptions: { state?: keyof typeof BasePage.ElementState; blur?: boolean } | undefined;
    let actualLog: string | undefined = logMessage;

    if (typeof locator2 === 'string') {
      actualLog = locator2;
    } else {
      targetLocator2 = locator2;
    }

    if (typeof options === 'string') {
      actualLog = options;
    } else if (typeof options === 'object') {
      actualOptions = options;
    }

    const stepTitle = actualLog || "Double-clicking element";
    const { state, blur = false } = actualOptions || {};

    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);

      try {
        await locator1.dblclick();
      } catch (error: any) {
        console.error(`❌ FAILED ACTION [${stepTitle}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }

      if (blur) {
        try {
          await locator1.blur();
        } catch (error: any) {
          throw mapPlaywrightError(error, `${stepTitle} (blur)`);
        }
      }

      if (targetLocator2) {
        for (const loc of Array.isArray(targetLocator2) ? targetLocator2 : [targetLocator2]) {
          await this.waitForLocatorState(loc, state);
        }
      }
    });
  }

  /**
   * Enter text into an input element. Playwright auto-waits for actionability.
   */
  protected async enterValueForInputElement(
    locator1: Locator,
    value: string,
    options?: {
      state?: keyof typeof BasePage.ElementState;
      locator2?: Locator | Locator[];
      pressSequence?: boolean;
      blur?: boolean;
    } | string,
    logMessage?: string
  ) {
    let actualOptions: {
      state?: keyof typeof BasePage.ElementState;
      locator2?: Locator | Locator[];
      pressSequence?: boolean;
      blur?: boolean;
    } | undefined;
    let actualLog: string | undefined = logMessage;

    if (typeof options === 'string') {
      actualLog = options;
    } else if (typeof options === 'object') {
      actualOptions = options;
    }

    const stepTitle = actualLog || `Entering value into field`;
    const { state, locator2, pressSequence = false } = actualOptions || {};

    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);

      if (value === undefined || value === null) {
        throw new FrameworkError('Value to enter cannot be null or undefined', stepTitle);
      }

      try {
        if (pressSequence) {
          await locator1.click();
          await this.page.keyboard.press('Control+A');
          await this.page.keyboard.press('Backspace');
          await locator1.pressSequentially(value, { delay: 100 });
        } else {
          await locator1.fill(value);
        }
      } catch (error: any) {
        console.error(`❌ FAILED INPUT ACTION [${stepTitle}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }

      try {
        await locator1.blur();
      } catch (error: any) {
        throw mapPlaywrightError(error, `${stepTitle} (blur)`);
      }

      if (locator2) {
        for (const loc of Array.isArray(locator2) ? locator2 : [locator2]) {
          await this.waitForLocatorState(loc, state);
        }
      }
    });
  }

  /**
   * Enter text with polling and advanced options.
   */
  protected async enterValueForInputElementWithOptions(
    locator1: Locator,
    value: string,
    options?: {
      state?: keyof typeof BasePage.ElementState;
      locator2?: Locator | Locator[];
      pressSequence?: boolean;
      blur?: boolean;
    } & IExpectPollOptions,
    logMessage?: string
  ) {
    const { pollFunction, pollTimeout = 5000, pollIntervals = [100] } = options || {};

    if (pollFunction) {
      try {
        await expect.poll(pollFunction, { timeout: pollTimeout, intervals: pollIntervals });
      } catch (error: any) {
        throw new TimeoutError(`Polling function timed out after ${pollTimeout}ms`, logMessage || 'enterValueForInputElementWithOptions');
      }
    }

    await this.enterValueForInputElement(locator1, value, options, logMessage);
  }

  /**
   * Type characters using the keyboard.
   */
  protected async keyboardType(locator1: Locator, value: string, logMessage?: string) {
    const stepTitle = logMessage || `Keyboard typing "${value}"`;
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        await locator1.click();
        await this.page.keyboard.type(value, { delay: 200 });
      } catch (error: any) {
        console.error(`❌ FAILED KEYBOARD TYPE [${stepTitle}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }
    });
  }

  /**
   * Wait for multiple locators to be visible or hidden.
   * Relies on Playwright global timeout — no hardcoded timeout overrides.
   */
  protected async waitForListOfElementsToBeVisibleOrHidden(
    locators: Locator[],
    options?: { state?: 'visible' | 'hidden' | 'VISIBLE' | 'HIDDEN' | string } | string,
    logMessage?: string
  ): Promise<void> {
    let actualOptions: { state?: 'visible' | 'hidden' | 'VISIBLE' | 'HIDDEN' | string } | undefined;
    let actualLog: string | undefined = logMessage;

    if (typeof options === 'string') {
      actualLog = options;
    } else if (typeof options === 'object') {
      actualOptions = options;
    }

    const stepTitle = actualLog || "Checking element visibility";

    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      const state = (actualOptions?.state?.toString().toLowerCase() as 'visible' | 'hidden') || 'visible';
      for (const locator of locators) {
        try {
          if (state === 'visible') {
            await expect(locator).toBeVisible();
          } else if (state === 'hidden') {
            await expect(locator).not.toBeVisible();
          }
        } catch (error: any) {
          console.error(`❌ FAILED VISIBILITY CHECK [${stepTitle}]: ${error.message}`);
          throw mapPlaywrightError(error, stepTitle);
        }
      }
    });
  }

  /**
   * Wait for multiple locators to be visible or hidden (typo variant for backwards compatibility).
   */
  protected async waitForListOfElementstoBeVisibleorHidden(
    locators: Locator[],
    options?: { state?: 'visible' | 'hidden' | 'VISIBLE' | 'HIDDEN' | string } | string,
    logMessage?: string
  ): Promise<void> {
    return this.waitForListOfElementsToBeVisibleOrHidden(locators, options, logMessage);
  }

  /**
   * Get text contents from all matching elements.
   */
  protected async getTextContents(locator: Locator, logMessage?: string): Promise<string[]> {
    const stepTitle = logMessage || "Getting text contents";
    return await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        const elements = await locator.all();
        return Promise.all(elements.map(el => el.textContent().then(text => text || '')));
      } catch (error: any) {
        throw mapPlaywrightError(error, stepTitle);
      }
    });
  }

  /**
   * Inspect application form validation error banners.
   * If any error banner or red validation text is visible, captures the text and throws CustomAssertionError.
   */
  public async verifyNoFormValidationError(customErrorSelector?: string): Promise<void> {
    const selector = customErrorSelector || "//*[contains(text(), 'Please fix the following errors')] | //div[contains(@class, 'bg-red') or contains(@class, 'border-red')]//li | //p[contains(@class, 'text-red-500')]";
    const errorBanner = this.page.locator(selector);
    const isErrorVisible = await errorBanner.first().isVisible().catch(() => false);
    if (isErrorVisible) {
      const errorMessages = await errorBanner.allInnerTexts().catch(() => []);
      const combinedErrors = errorMessages.length > 0 ? errorMessages.filter((t: string) => t.trim().length > 0).join('; ') : 'Form validation failed due to missing required fields or invalid input.';
      console.error(`❌ APPLICATION FORM VALIDATION ERROR DETECTED: ${combinedErrors}`);
      throw new CustomAssertionError(`Validation Failure: ${combinedErrors}`, 'verifyNoFormValidationError');
    }
  }

  /**
   * Hover over an element.
   */
  protected async hoverOverElementandVerifyElements(locator: Locator, logMessage?: string): Promise<void> {
    const stepTitle = logMessage || `Hovering over element`;
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        await locator.hover();
      } catch (error: any) {
        console.error(`❌ FAILED HOVER [${stepTitle}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }
    });
  }

  /**
   * Validate a list of expectations for corresponding locators.
   */
  protected async listOfExpectedResultStatements(
    locators: Locator[],
    expectations: ((locator: Locator) => Promise<void>)[],
    logMessage?: string
  ): Promise<void> {
    const stepTitle = logMessage || "Validating list of expectations";
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      if (locators.length !== expectations.length) {
        throw new FrameworkError(
          `Number of locators (${locators.length}) does not match number of expectations (${expectations.length})`,
          stepTitle
        );
      }

      for (let i = 0; i < locators.length; i++) {
        await expectations[i](locators[i]);
      }
    });
  }

  /**
   * Perform a keyboard action and optionally wait for locators to change state.
   */
  protected async performKeyboardAction(
    action: keyof typeof BasePage.ActionType,
    locators?: Locator[],
    state?: keyof typeof BasePage.ElementState,
    logMessage?: string
  ): Promise<void> {
    const stepTitle = logMessage || `Performing keyboard action "${action}"`;
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        await this.page.keyboard.press(action);
      } catch (error: any) {
        console.error(`❌ FAILED KEYBOARD ACTION [${action}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }

      if (locators) {
        for (const loc of locators) {
          await this.waitForLocatorState(loc, state);
        }
      }
    });
  }

  /**
   * Check whether an element exists in the DOM.
   */
  protected async doesElementExist(locator: Locator): Promise<boolean> {
    return (await locator.count()) > 0;
  }

  /**
   * Wait for the URL to contain specific text.
   */
  protected async waitForUrlToContainText(text: string, logMessage?: string): Promise<void> {
    const stepTitle = logMessage || `Navigating/Waiting - verifying URL contains "${text}"`;
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        await this.page.waitForURL((url: URL) => url.toString().includes(text));
        await expect(this.page).toHaveURL(new RegExp(`.*${text}.*`));
      } catch (error: any) {
        console.error(`❌ FAILED URL CHECK [${stepTitle}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }
    });
  }

  /**
   * Clear the contents of an input field.
   */
  protected async clearInputField(locator: Locator, logMessage?: string): Promise<void> {
    const stepTitle = logMessage || `Clearing input field`;
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        await locator.fill('');
      } catch (error: any) {
        console.error(`❌ FAILED CLEAR FIELD [${stepTitle}]: ${error.message}`);
        throw mapPlaywrightError(error, stepTitle);
      }
    });
  }

  /**
   * Wait for a specific network request.
   */
  protected async waitForNetworkRequest(urlSubstring: string, logMessage?: string): Promise<void> {
    const stepTitle = logMessage || `Waiting for network request containing "${urlSubstring}"`;
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        await this.page.waitForRequest((req: any) => req.url().includes(urlSubstring));
      } catch (error: any) {
        throw mapPlaywrightError(error, stepTitle);
      }
    });
  }

  /**
   * Wait for a specific network response.
   */
  protected async waitForNetworkResponse(urlSubstring: string, logMessage?: string): Promise<void> {
    const stepTitle = logMessage || `Waiting for network response containing "${urlSubstring}"`;
    await test.step(stepTitle, async () => {
      this.logStep(stepTitle);
      try {
        await this.page.waitForResponse((res: any) => res.url().includes(urlSubstring));
      } catch (error: any) {
        throw mapPlaywrightError(error, stepTitle);
      }
    });
  }

  /**
   * Internal helper — wait for a locator to reach the desired state.
   */
  private async waitForLocatorState(
    locator: Locator,
    state?: string
  ): Promise<void> {
    try {
      if (state === 'VISIBLE' || state === 'visible') {
        await locator.waitFor({ state: 'visible' });
      } else if (state === 'HIDDEN' || state === 'hidden') {
        await locator.waitFor({ state: 'hidden' });
      }
    } catch (error: any) {
      throw mapPlaywrightError(error, `waitForLocatorState(${state})`);
    }
  }

}