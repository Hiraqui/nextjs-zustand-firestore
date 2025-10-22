import { expect, type Locator, type Page } from "@playwright/test";

export interface OnboardingTestData {
  name: string;
  hobby: string;
  age: number;
  description: string;
}

/**
 * Page Object Model for the Onboarding flow
 * Following Playwright best practices with role-based locators
 */
export class OnboardingPage {
  readonly page: Page;

  // Locators using role-based selectors following Playwright POM pattern
  readonly welcomeTitle: Locator;
  readonly getStartedButton: Locator;
  readonly logoutButton: Locator;
  readonly backButton: Locator;
  readonly continueButton: Locator;
  readonly nameInput: Locator;
  readonly hobbySelect: Locator;
  readonly ageInput: Locator;
  readonly descriptionInput: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using role-based selectors
    this.welcomeTitle = page.getByRole("heading", {
      name: /welcome to.*nextjs-zustand-firestore.*onboarding/i,
    });
    this.getStartedButton = page.getByRole("link", { name: /get started/i });
    this.logoutButton = page.getByRole("button", { name: /logout/i });
    this.backButton = page.getByTestId("back-button");
    this.continueButton = page.getByRole("button", { name: /continue/i });
    this.nameInput = page.getByPlaceholder(/enter your name/i);
    this.hobbySelect = page.getByRole("button").first(); // First hobby button
    this.ageInput = page.getByPlaceholder(/enter your age/i);
    this.descriptionInput = page.getByPlaceholder(/enter your description/i);
    this.finishButton = page.getByRole("button", { name: /finish!/i });
  }

  /**
   * Wait for the intro step to be visible
   */
  async waitForIntroStep() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");
    await expect(this.welcomeTitle).toBeVisible({ timeout: 15000 });
    await expect(this.getStartedButton).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  /**
   * Start the onboarding process by clicking Get Started
   */
  async startOnboarding() {
    await expect(this.getStartedButton).toBeVisible();
    await this.getStartedButton.click();
    await this.waitForNameStep();
  }

  /**
   * Wait for the name step to be visible
   */
  async waitForNameStep() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/.*type=name/, { timeout: 10_000 });
    await expect(this.nameInput).toBeVisible({ timeout: 3_000 });
    await expect(this.backButton).toBeVisible();
  }

  /**
   * Fill the name step
   * @param name Name to enter
   */
  async fillNameStep(name: string) {
    await this.waitForNameStep();

    // Clear and fill the input with typing simulation
    await this.nameInput.click();
    await this.nameInput.clear();
    await this.nameInput.fill(name);
    await expect(this.nameInput).toHaveValue(name);

    // Wait a bit for validation and state updates
    await this.page.waitForTimeout(1500);

    // Ensure button is enabled and click it
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();

    await expect(async () => {
      // If keyboard didn't work, try mouse click
      await this.page.waitForTimeout(500);
      const currentUrl = this.page.url();
      if (currentUrl.includes("type=name")) {
        await this.continueButton.click();
      }

      // Wait for navigation to hobby step
      expect(this.page).toHaveURL(/.*type=hobby/);
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Wait for the hobby step to be visible
   */
  async waitForHobbyStep() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/.*type=hobby/, { timeout: 10000 });
    await expect(this.page.getByRole("button").first()).toBeVisible();
  }

  /**
   * Fill the hobby step
   * @param hobby Hobby to select
   */
  async fillHobbyStep(hobby: string) {
    // The hobby component auto-continues after selection
    await expect(this.page.getByRole("button").first()).toBeVisible();
    await this.page
      .getByRole("button", { name: new RegExp(hobby, "i") })
      .click();
    // Wait for navigation to age step
    await expect(this.page).toHaveURL(/.*type=age/, { timeout: 15000 });
  }

  /**
   * Wait for the age step to be visible
   */
  async waitForAgeStep() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/.*type=age/, { timeout: 10000 });
    await expect(this.ageInput).toBeVisible();
  }

  /**
   * Fill the age step
   * @param age Age to enter
   */
  async fillAgeStep(age: number) {
    await expect(this.ageInput).toBeVisible();
    await this.ageInput.fill(age.toString());
    await expect(this.ageInput).toHaveValue(age.toString());
    await expect(this.continueButton).toBeVisible();
    await this.continueButton.click();
    // Wait for navigation to description step
    await expect(this.page).toHaveURL(/.*type=description/, { timeout: 15000 });
  }

  /**
   * Wait for the description step to be visible
   */
  async waitForDescriptionStep() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/.*type=description/, { timeout: 10000 });
    await expect(this.descriptionInput).toBeVisible();
  }

  /**
   * Fill the description step
   * @param description Description to enter (optional)
   */
  async fillDescriptionStep(description: string = "") {
    await this.waitForDescriptionStep();

    if (description) {
      await this.descriptionInput.pressSequentially(description);
      await expect(this.descriptionInput).toHaveValue(description);
    }

    // Click the finish button
    await expect(this.finishButton).toBeVisible();
    await this.finishButton.click();

    // Wait for navigation to summary page
    await this.page.waitForURL("**/summary**", { timeout: 15000 });
  }

  /**
   * Complete the entire onboarding flow with provided data
   * @param data Onboarding test data
   */
  async fillCompleteOnboarding(data: OnboardingTestData) {
    await this.fillNameStep(data.name);
    await this.fillHobbyStep(data.hobby);
    await this.fillAgeStep(data.age);
    await this.fillDescriptionStep(data.description);
  }

  /**
   * Go back to the previous step
   */
  async goBack() {
    await this.page.waitForTimeout(1_000);
    await expect(this.backButton).toBeVisible();
    await this.backButton.click();
  }
}
