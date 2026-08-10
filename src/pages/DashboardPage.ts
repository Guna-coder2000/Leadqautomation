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

  private contactsCard: Locator;
  private meetingsCard: Locator;
  private emailsCard: Locator;
  private voiceAgentCard: Locator;
  private conversionRateCard: Locator;


  private calendarMonthYear: Locator;

  private xpaths: Record<string, string> = {
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

    this.contactsCard = this.page.locator("//*[contains(text(), 'Contacts')]").first();
    this.meetingsCard = this.page.locator("//*[contains(text(), 'Meetings')]").first();
    this.emailsCard = this.page.locator("//*[contains(text(), 'Emails')]").first();
    this.voiceAgentCard = this.page.locator("//*[contains(text(), 'Voice Agent')]").first();
    this.conversionRateCard = this.page.locator("//*[contains(text(), 'Conversion Rate')]");


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



  // Dashboard specific widget actions






  async verifyStatisticsCardsDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden(
      [this.contactsCard, this.meetingsCard, this.emailsCard, this.voiceAgentCard, this.conversionRateCard],
      { state: BasePage.ElementState.VISIBLE },
      "Verifying KPI statistics cards are displayed on the dashboard"
    );
  }



  async verifyCalendarWidgetDisplayed() {
    await super.waitForListOfElementsToBeVisibleOrHidden([this.calendarMonthYear], { state: BasePage.ElementState.VISIBLE }, "Verifying Calendar widget is displayed");
  }

  async verifyCalendarShowsMonthYear(monthYear: string) {
    await expect(this.calendarMonthYear).toContainText(monthYear);
  }
}
