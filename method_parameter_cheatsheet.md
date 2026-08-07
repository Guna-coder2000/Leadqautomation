# Playwright Framework - Complete Method & Parameter Cheat Sheet

This cheat sheet lists **every single method in the framework**, how many parameters it requires, parameter types, internal forwarding, and spec file usage examples.

---

## 1. BasePage Low-Level Action Methods (`src/pages/BasePage.ts`)

| BasePage Method | Param Count | Parameter Breakdown | How Page Objects Forward to BasePage |
| :--- | :--- | :--- | :--- |
| `navigateTo` | **1 to 3** | 1. `url: string` (Req)<br>2. `options?: object` (Opt)<br>3. `logMessage?: string` (Opt) | `super.navigateTo(url, undefined, this.navLog)` |
| `clickOnElement` | **1 to 4** | 1. `locator1: Locator` (Req)<br>2. `locator2?: Locator` (Opt)<br>3. `options?: object` (Opt)<br>4. `logMessage?: string` (Opt) | `super.clickOnElement(this.loginButton, this.clickLog)` |
| `doubleClickOnElement` | **1 to 4** | 1. `locator1: Locator` (Req)<br>2. `locator2?: Locator` (Opt)<br>3. `options?: object` (Opt)<br>4. `logMessage?: string` (Opt) | `super.doubleClickOnElement(this.btn, this.dblClickLog)` |
| `enterValueForInputElement` | **2 to 4** | 1. `locator1: Locator` (Req)<br>2. `value: string` (Req)<br>3. `options?: object` (Opt)<br>4. `logMessage?: string` (Opt) | `super.enterValueForInputElement(this.userInput, val, { pressSequence: true }, this.userLog)` |
| `enterValueForInputElementWithOptions` | **2 to 4** | 1. `locator1: Locator` (Req)<br>2. `value: string` (Req)<br>3. `options?: PollOptions` (Opt)<br>4. `logMessage?: string` (Opt) | `super.enterValueForInputElementWithOptions(this.input, val, { pollTimeout: 5000 }, this.log)` |
| `keyboardType` | **2 to 3** | 1. `locator1: Locator` (Req)<br>2. `value: string` (Req)<br>3. `logMessage?: string` (Opt) | `super.keyboardType(this.input, val, this.typeLog)` |
| `waitForListOfElementsToBeVisibleOrHidden` | **1 to 3** | 1. `locators: Locator[]` (Req)<br>2. `options?: object` (Opt)<br>3. `logMessage?: string` (Opt) | `super.waitForListOfElementsToBeVisibleOrHidden([this.errorMsg], { state: 'VISIBLE' }, this.errLog)` |
| `waitForUrlToContainText` | **1 to 2** | 1. `text: string` (Req)<br>2. `logMessage?: string` (Opt) | `super.waitForUrlToContainText('dashboard', this.dashLog)` |
| `clearInputField` | **1 to 2** | 1. `locator: Locator` (Req)<br>2. `logMessage?: string` (Opt) | `super.clearInputField(this.usernameInput, this.clearLog)` |
| `performKeyboardAction` | **1 to 4** | 1. `action: 'Enter'\|'Escape'\|'ArrowUp'\|'ArrowDown'` (Req)<br>2. `locators?: Locator[]` (Opt)<br>3. `state?: string` (Opt)<br>4. `logMessage?: string` (Opt) | `super.performKeyboardAction('Enter', undefined, undefined, this.pressEnterLog)` |
| `doesElementExist` | **1** | 1. `locator: Locator` (Req) | `await this.doesElementExist(this.btn)` |

---

## 2. LoginPage Methods & Parameter Cheat Sheet (`src/pages/LoginPage.ts`)

| LoginPage Method | Spec Param Count | Spec Parameters | Code Example in Spec (`*.spec.ts`) |
| :--- | :--- | :--- | :--- |
| `navigateToLogin` | **1** | `baseURL: string` | `await loginPage.navigateToLogin(config.baseURL);` |
| `enterUsername` | **1** | `username: string` | `await loginPage.enterUsername('user@leadq.ai');` |
| `enterPassword` | **1** | `password: string` | `await loginPage.enterPassword('Pass@123');` |
| `clickLoginButton` | **0** | None | `await loginPage.clickLoginButton();` |
| `login` | **2** | `username: string`, `password: string` | `await loginPage.login('user@leadq.ai', 'Pass@123');` |
| `clearUsername` | **0** | None | `await loginPage.clearUsername();` |
| `clearPassword` | **0** | None | `await loginPage.clearPassword();` |
| `verifyEmailErrorVisible` | **0** | None | `await loginPage.verifyEmailErrorVisible();` |
| `verifyPasswordErrorVisible` | **0** | None | `await loginPage.verifyPasswordErrorVisible();` |
| `verifyInvalidCredentialsErrorVisible` | **0** | None | `await loginPage.verifyInvalidCredentialsErrorVisible();` |
| `verifyDashboardLoaded` | **0** | None | `await loginPage.verifyDashboardLoaded();` |
| `verifyStillOnLoginPage` | **0** | None | `await loginPage.verifyStillOnLoginPage();` |

---

## 3. DashboardPage Methods & Parameter Cheat Sheet (`src/pages/DashboardPage.ts`)

| DashboardPage Method | Spec Param Count | Spec Parameters | Code Example in Spec (`*.spec.ts`) |
| :--- | :--- | :--- | :--- |
| `navigateToDashboard` | **0** | None | `await dashboardPage.navigateToDashboard();` |
| `navigateToContacts` | **0** | None | `await dashboardPage.navigateToContacts();` |
| `navigateToEvents` | **0** | None | `await dashboardPage.navigateToEvents();` |
| `navigateToMeetings` | **0** | None | `await dashboardPage.navigateToMeetings();` |
| `navigateToEmails` | **0** | None | `await dashboardPage.navigateToEmails();` |
| `navigateToLeads` | **0** | None | `await dashboardPage.navigateToLeads();` |
| `navigateToVoiceAgent` | **0** | None | `await dashboardPage.navigateToVoiceAgent();` |
| `navigateToCreditUsage` | **0** | None | `await dashboardPage.navigateToCreditUsage();` |
| `navigateToSettingsDirectly` | **1** | `baseURL: string` | `await dashboardPage.navigateToSettingsDirectly(config.baseURL);` |
| `verifyWelcomeMessageContains` | **1** | `name: string` | `await dashboardPage.verifyWelcomeMessageContains('Guna');` |
| `verifyDateHeaderVisible` | **0** | None | `await dashboardPage.verifyDateHeaderVisible();` |
| `clickFilterDropdown` | **0** | None | `await dashboardPage.clickFilterDropdown();` |
| `selectFilterOption` | **1** | `option: string` | `await dashboardPage.selectFilterOption('Overall');` |
| `verifyFilterValue` | **1** | `expectedValue: string` | `await dashboardPage.verifyFilterValue('Overall');` |
| `verifyStatsCardsVisible` | **0** | None | `await dashboardPage.verifyStatsCardsVisible();` |
| `verifyPriorityActionsVisible` | **0** | None | `await dashboardPage.verifyPriorityActionsVisible();` |
| `clickPriorityActionsViewDetails` | **0** | None | `await dashboardPage.clickPriorityActionsViewDetails();` |
| `verifyLeadPipelineVisible` | **0** | None | `await dashboardPage.verifyLeadPipelineVisible();` |
| `verifyLeadInPipeline` | **1** | `leadName: string` | `await dashboardPage.verifyLeadInPipeline('Acme Inc');` |
| `verifyCalendarWidgetVisible` | **0** | None | `await dashboardPage.verifyCalendarWidgetVisible();` |
| `verifyCalendarMonthYear` | **1** | `monthYear: string` | `await dashboardPage.verifyCalendarMonthYear('August 2026');` |

---

## 4. ContactsPage Methods & Parameter Cheat Sheet (`src/pages/ContactsPage.ts`)

| ContactsPage Method | Spec Param Count | Spec Parameters | Code Example in Spec (`*.spec.ts`) |
| :--- | :--- | :--- | :--- |
| `navigateToContactsPage` | **1** | `baseURL: string` | `await contactsPage.navigateToContactsPage(config.baseURL);` |
| `clickAddContact` | **0** | None | `await contactsPage.clickAddContact();` |
| `clickManualEntry` | **0** | None | `await contactsPage.clickManualEntry();` |
| `enterName` | **1** | `name: string` | `await contactsPage.enterName('Jane Doe');` |
| `enterJobTitle` | **1** | `jobTitle: string` | `await contactsPage.enterJobTitle('Manager');` |
| `enterCompany` | **1** | `company: string` | `await contactsPage.enterCompany('Acme Corp');` |
| `enterEmail` | **1** | `email: string` | `await contactsPage.enterEmail('jane@acme.com');` |
| `enterPhone` | **1** | `phone: string` | `await contactsPage.enterPhone('1234567890');` |
| `clickSave` | **0** | None | `await contactsPage.clickSave();` |
| `clickDiscard` | **0** | None | `await contactsPage.clickDiscard();` |
| `enterSearchQuery` | **1** | `name: string` | `await contactsPage.enterSearchQuery('Jane Doe');` |
| `verifyContactVisibleInList` | **1** | `name: string` | `await contactsPage.verifyContactVisibleInList('Jane Doe');` |
| `verifyContactNotVisibleInList` | **1** | `name: string` | `await contactsPage.verifyContactNotVisibleInList('Jane Doe');` |
| `verifyContactDetailsHeaderVisible` | **0** | None | `await contactsPage.verifyContactDetailsHeaderVisible();` |

---

## 5. ProfilePage Methods & Parameter Cheat Sheet (`src/pages/ProfilePage.ts`)

| ProfilePage Method | Spec Param Count | Spec Parameters | Code Example in Spec (`*.spec.ts`) |
| :--- | :--- | :--- | :--- |
| `clickEditButton` | **0** | None | `await profilePage.clickEditButton();` |
| `clickSaveButton` | **0** | None | `await profilePage.clickSaveButton();` |
| `clickCancelButton` | **0** | None | `await profilePage.clickCancelButton();` |
| `enterFirstName` | **1** | `firstName: string` | `await profilePage.enterFirstName('John');` |
| `enterLastName` | **1** | `lastName: string` | `await profilePage.enterLastName('Doe');` |
| `enterPhoneNumber` | **1** | `phone: string` | `await profilePage.enterPhoneNumber('9876543210');` |
| `enterCity` | **1** | `city: string` | `await profilePage.enterCity('Austin');` |
| `getFirstNameValue` | **0** | None | `const name = await profilePage.getFirstNameValue();` |
| `getPhoneNumberValue` | **0** | None | `const phone = await profilePage.getPhoneNumberValue();` |
| `verifyFirstNameValue` | **1** | `expected: string` | `await profilePage.verifyFirstNameValue('John');` |
| `verifyLastNameValue` | **1** | `expected: string` | `await profilePage.verifyLastNameValue('Doe');` |
| `verifyPhoneNumberValue` | **1** | `expected: string` | `await profilePage.verifyPhoneNumberValue('9876543210');` |
| `verifyEmailValue` | **1** | `expected: string` | `await profilePage.verifyEmailValue('john@example.com');` |
| `verifyEmailFieldReadOnly` | **0** | None | `await profilePage.verifyEmailFieldReadOnly();` |
| `verifyResetButtonNotVisible` | **0** | None | `await profilePage.verifyResetButtonNotVisible();` |

---

## 6. Framework Assertions Cheat Sheet (`src/utils/assertions.ts`)

| Assertion Function | Param Count | Parameters | Code Example |
| :--- | :--- | :--- | :--- |
| `assertElementVisible` | **1 to 2** | 1. `locator: Locator`<br>2. `message?: string` | `await assertElementVisible(locator, "Element should be visible");` |
| `assertElementHidden` | **1 to 2** | 1. `locator: Locator`<br>2. `message?: string` | `await assertElementHidden(locator, "Element should be hidden");` |
| `assertElementTextEquals` | **2 to 3** | 1. `locator: Locator`<br>2. `expectedText: string`<br>3. `message?: string` | `await assertElementTextEquals(locator, "Dashboard", "Heading text mismatch");` |
| `assertElementTextContains` | **2 to 3** | 1. `locator: Locator`<br>2. `expectedSubstring: string`<br>3. `message?: string` | `await assertElementTextContains(locator, "Welcome", "Greeting mismatch");` |
| `assertUrlContains` | **2 to 3** | 1. `page: Page`<br>2. `expectedSubstring: string`<br>3. `message?: string` | `await assertUrlContains(page, "dashboard", "URL mismatch");` |
| `assertValuesEqual` | **2 to 3** | 1. `actual: T`<br>2. `expected: T`<br>3. `message?: string` | `assertValuesEqual(actualStatus, 200, "Status code error");` |

---

## 7. Data Validations Cheat Sheet (`src/utils/validations.ts`)

| Validation Function | Param Count | Parameters | Code Example |
| :--- | :--- | :--- | :--- |
| `validateEmail` | **1** | `email: string` | `validateEmail('user@leadq.ai');` |
| `validatePhoneNumber` | **1** | `phone: string` | `validatePhoneNumber('1234567890');` |
| `validateZipCode` | **1** | `zip: string` | `validateZipCode('90210');` |
| `validateDateFormat` | **1** | `dateStr: string` | `validateDateFormat('2026-08-05');` |
| `validateLeadData` | **1** | `lead: Lead` | `validateLeadData({ firstName: 'John', lastName: 'Doe', email: 'john@test.com' });` |
