import { expect, type Locator, type Page } from "@playwright/test";

import type { OnboardingTestData } from "./onboarding-page";

export class SummaryPage {
  readonly page: Page;

  // Locators using role-based selectors
  readonly completionMessage: Locator;
  readonly summaryTitle: Locator;
  readonly redoButton: Locator;
  readonly logoutButton: Locator;
  readonly descriptionRow: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using role-based selectors
    this.completionMessage = page.getByText(
      /demo complete.*stored in firestore/i
    );
    this.summaryTitle = page.getByRole("heading", { name: /demo complete/i });
    this.redoButton = page.getByRole("link", { name: /redo onboarding/i }); // This is a link, not a button
    this.logoutButton = page.getByRole("button", { name: /logout/i });
    this.descriptionRow = page.getByText(/description:/i);
  }

  async goto() {
    await this.page.goto("/onboarding/summary");
  }

  async waitForSummaryPage() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.completionMessage).toBeVisible();
    await expect(this.summaryTitle).toBeVisible();
  }

  async verifyCompletionMessage() {
    await expect(this.completionMessage).toBeVisible();
  }

  async verifySummaryData(expectedData: OnboardingTestData) {
    // Wait for the summary page to be fully loaded
    await expect(this.completionMessage).toBeVisible();

    // Look for data in a more flexible way using text contains
    await expect(this.page.locator("text=Name")).toBeVisible();
    await expect(this.page.locator(`text=${expectedData.name}`)).toBeVisible();

    await expect(this.page.locator("text=Age")).toBeVisible();
    await expect(
      this.page.locator(`text=${expectedData.age.toString()}`)
    ).toBeVisible();

    await expect(this.page.locator("text=Hobby")).toBeVisible();
    await expect(this.page.locator(`text=${expectedData.hobby}`)).toBeVisible();

    if (expectedData.description) {
      await expect(this.page.locator("text=Description")).toBeVisible();
      await expect(
        this.page.locator(`text=${expectedData.description}`)
      ).toBeVisible();
    }
  }

  async verifyActionButtons() {
    await expect(this.redoButton).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async redoOnboarding() {
    await expect(this.redoButton).toBeVisible();
    await this.redoButton.click();
  }

  async logout() {
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
  }
}
