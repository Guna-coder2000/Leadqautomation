import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Sidebar elements
  private sidebarDashboard: Locator;
  private sidebarContacts: Locator;
  private sidebarEvents: Locator;
  private sidebarMeetings: Locator;
  private sidebarEmails: Locator;
  private sidebarLeads: Locator;
  private sidebarVoiceAgent: Locator;
  private sidebarCreditUsage: Locator;

  // Dashboard specific widget elements (strictly XPaths)
  private welcomeMessage: Locator;
  private dateHeader: Locator;
  private filterDropdown: Locator;

  private contactsCard: Locator;
  private meetingsCard: Locator;
  private emailsCard: Locator;
  private voiceAgentCard: Locator;
  private conversionRateCard: Locator;

  private upcomingMeetingsCard: Locator;
  private warmLeadsCard: Locator;
  private hotLeadsCard: Locator;
  private viewDetailsLink: Locator;

  private leadPipelineHeader: Locator;
  private calendarMonthYear: Locator;

  private xpaths: Record<string, string> = {
    filterOption: "//div[@role='menuitem' and contains(., '{0}')] | //button[contains(., '{0}')] | //li[contains(text(), '{0}')]",
    leadPipelineRow: "//div[contains(@class, 'pipeline') or contains(@class, 'lead')]//span[contains(text(), '{0}')] | //div[contains(., '{0}') and contains(@class, 'lead')]"
  };

  // Log Message Variables
  private readonly navDashboardLog = "Clicking 'Dashboard' menu from sidebar";
  private readonly navContactsLog = "Clicking 'Contacts' menu from sidebar";
  private readonly navEventsLog = "Clicking 'Events' menu from sidebar";
  private readonly navMeetingsLog = "Clicking 'Meetings' menu from sidebar";
  private readonly navEmailsLog = "Clicking 'Emails' menu from sidebar";
  private readonly navLeadsLog = "Clicking 'Leads' menu from sidebar";
  private readonly navVoiceAgentLog = "Clicking 'Voice Agent' menu from sidebar";
  private readonly navCreditUsageLog = "Clicking 'Credit Usage' menu from sidebar";
  private readonly filterDropdownLog = "Clicking 'Dashboard Filter' dropdown";
  private readonly filterOptionLog = "Selecting 'Dashboard Filter' option";
  private readonly priorityViewDetailsLog = "Clicking 'View Details' link in Priority Actions";

  constructor(page: any) {
    super(page);
    // Sidebar locators
    this.sidebarDashboard = this.page.locator("//a[contains(@href, '/dashboard') and not(contains(@href, '/contacts')) and not(contains(@href, '/events')) and not(contains(@href, '/meetings')) and not(contains(@href, '/emails')) and not(contains(@href, '/leads')) and not(contains(@href, '/voice-agent')) and not(contains(@href, '/credit-usage'))]");
    this.sidebarContacts = this.page.locator("//a[contains(@href, '/dashboard/contacts') or contains(@href, '/contacts')]");
    this.sidebarEvents = this.page.locator("//a[contains(@href, '/dashboard/events') or contains(@href, '/events')]");
    this.sidebarMeetings = this.page.locator("//a[contains(@href, '/dashboard/meetings') or contains(@href, '/meetings')]");
    this.sidebarEmails = this.page.locator("//a[contains(@href, '/dashboard/emails') or contains(@href, '/emails')]");
    this.sidebarLeads = this.page.locator("//a[contains(@href, '/dashboard/leads') or contains(@href, '/leads')]");
    this.sidebarVoiceAgent = this.page.locator("//a[contains(@href, '/dashboard/voice-agent') or contains(@href, '/voice-agent')]");
    this.sidebarCreditUsage = this.page.locator("//a[contains(@href, '/dashboard/credit-usage') or contains(@href, '/credit-usage')]");

    // Dashboard widgets
    this.welcomeMessage = this.page.locator("//h2[contains(text(), 'Good') or contains(text(), 'Welcome')]");
    this.dateHeader = this.page.locator("//p[contains(text(), 'It')]");
    this.filterDropdown = this.page.locator("//button[contains(., 'Overall')]");

    this.contactsCard = this.page.locator("//*[contains(text(), 'Contacts')]").first();
    this.meetingsCard = this.page.locator("//*[contains(text(), 'Meetings')]").first();
    this.emailsCard = this.page.locator("//*[contains(text(), 'Emails')]").first();
    this.voiceAgentCard = this.page.locator("//*[contains(text(), 'Voice Agent')]").first();
    this.conversionRateCard = this.page.locator("//*[contains(text(), 'Conversion Rate')]");

    this.upcomingMeetingsCard = this.page.locator("//*[contains(text(), 'Up Coming Meetings')]");
    this.warmLeadsCard = this.page.locator("//*[contains(text(), 'Warm Leads')]");
    this.hotLeadsCard = this.page.locator("//*[contains(text(), 'Hot Leads')]");
    this.viewDetailsLink = this.page.locator("//a[contains(text(), 'View Details')]");

    this.leadPipelineHeader = this.page.locator("//h2[contains(text(), 'Lead Pipeline')]");
    this.calendarMonthYear = this.page.locator("//div[contains(@class, 'calendar')]//span[contains(@class, 'month')]");
  }

  // Sidebar navigation actions
  async clickDashboardMenu() {
    await super.clickOnElement(this.sidebarDashboard, this.navDashboardLog);
  }

  async clickContactsMenu() {
    await super.clickOnElement(this.sidebarContacts, this.navContactsLog);
  }

  async clickEventsMenu() {
    await super.clickOnElement(this.sidebarEvents, this.navEventsLog);
  }

  async clickMeetingsMenu() {
    await super.clickOnElement(this.sidebarMeetings, this.navMeetingsLog);
  }

  async clickEmailsMenu() {
    await super.clickOnElement(this.sidebarEmails, this.navEmailsLog);
  }

  async clickLeadsMenu() {
    await super.clickOnElement(this.sidebarLeads, this.navLeadsLog);
  }

  async clickVoiceAgentMenu() {
    await super.clickOnElement(this.sidebarVoiceAgent, this.navVoiceAgentLog);
  }

  async clickCreditUsageMenu() {
    await super.clickOnElement(this.sidebarCreditUsage, this.navCreditUsageLog);
  }

  async navigateToSettingsDirectly(baseURL: string) {
    const settingsURL = `${baseURL.replace(/\/$/, '')}/dashboard/settings`;
    await super.navigateTo(settingsURL, undefined, "Navigating directly to 'Settings' page");
  }

  // Dashboard specific widget actions
  async verifyWelcomeBannerDisplayedWithUser(name: string) {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.welcomeMessage], { state: BasePage.ElementState.VISIBLE }, "Verifying 'Welcome' banner displays expected user name");
    await expect(this.welcomeMessage).toContainText(name);
  }

  async verifyCurrentDateDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.dateHeader], { state: BasePage.ElementState.VISIBLE }, "Verifying 'Current Date' header is displayed");
  }

  async clickDashboardFilterDropdown() {
    await super.clickOnElement(this.filterDropdown, this.filterDropdownLog);
  }

  async selectDashboardFilterOption(option: string) {
    const optionLocator = this.getDynamicLocatorFromChild(this.xpaths, 'filterOption', option).first();
    await super.clickOnElement(optionLocator, this.filterOptionLog);
  }

  async verifyFilterOptionSelected(expectedValue: string) {
    await expect(this.filterDropdown).toContainText(expectedValue);
  }

  async verifyStatisticsCardsDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden(
      [this.contactsCard, this.meetingsCard, this.emailsCard, this.voiceAgentCard, this.conversionRateCard],
      { state: BasePage.ElementState.VISIBLE },
      "Verifying KPI statistics cards are displayed on the dashboard"
    );
  }

  async verifyPriorityActionsDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden(
      [this.upcomingMeetingsCard, this.warmLeadsCard, this.hotLeadsCard],
      { state: BasePage.ElementState.VISIBLE },
      "Verifying priority action cards are displayed"
    );
  }

  async clickPriorityActionsViewDetails() {
    await super.clickOnElement(this.viewDetailsLink, this.priorityViewDetailsLog);
  }

  async verifyLeadPipelineDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.leadPipelineHeader], { state: BasePage.ElementState.VISIBLE }, "Verifying Lead Pipeline header is displayed");
  }

  async verifyLeadDisplaysInPipeline(leadName: string) {
    const leadLocator = this.getDynamicLocatorFromChild(this.xpaths, 'leadPipelineRow', leadName).first();
    await super.waitForListOfElementsToBeVisibleOrHidden([leadLocator], { state: BasePage.ElementState.VISIBLE }, `Verifying lead ${leadName} displays in the pipeline`);
  }

  async verifyCalendarWidgetDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.calendarMonthYear], { state: BasePage.ElementState.VISIBLE }, "Verifying Calendar widget is displayed");
  }

  async verifyCalendarShowsMonthYear(monthYear: string) {
    await expect(this.calendarMonthYear).toContainText(monthYear);
  }
}
