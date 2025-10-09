import { expect, type Locator, type Page } from "@playwright/test";

export class GoogleSignInPage {
  readonly page: Page;

  // Locators using role-based selectors
  readonly welcomeTitle: Locator;
  readonly addAccountButton: Locator;
  readonly generateUserButton: Locator;
  readonly emailInput: Locator;
  readonly nameInput: Locator;
  readonly signInWithGoogleButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using role-based selectors
    this.welcomeTitle = page.getByText("Sign-in with Google.com");
    this.addAccountButton = page.getByRole("button", {
      name: "Add new account",
    });
    this.generateUserButton = page.getByRole("button", {
      name: "Auto-generate user information",
    });
    this.emailInput = page.getByLabel("Email");
    this.nameInput = page.getByLabel("Display name");
    this.signInWithGoogleButton = page.getByRole("button", {
      name: "Sign in with Google.com",
    });
  }

  /**
   * Wait for the page to fully load by checking for key elements
   */
  async waitForPageLoad() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.addAccountButton).toBeVisible();
  }

  async waitForFormLoad() {
    await expect(this.generateUserButton).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.signInWithGoogleButton).toBeVisible();
  }

  /**
   * Click the Google Sign In button
   * This will typically navigate to the onboarding flow after authentication
   * Note: In test environment, this may not work without proper emulator setup
   */
  async generateNewUserAndLogin() {
    await expect(this.addAccountButton).toBeVisible();
    await this.addAccountButton.click();

    await this.waitForFormLoad();

    await this.generateUserButton.click();

    await expect(this.emailInput).toHaveValue(/@/);
    const name = await this.nameInput.inputValue();
    const email = await this.emailInput.inputValue();
    if (!name || !email) {
      throw new Error("Failed to generate user information");
    }

    return { name, email };
  }
}
