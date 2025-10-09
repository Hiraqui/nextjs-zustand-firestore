import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  // Locators using role-based selectors
  readonly welcomeTitle: Locator;
  readonly welcomeDescription: Locator;
  readonly signInButton: Locator;
  readonly sourceCodeLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using role-based selectors
    this.welcomeTitle = page.getByRole("heading", {
      name: /welcome to.*nextjs.*zustand.*firestore/i,
    });
    this.welcomeDescription = page.getByText(
      /experience seamless state management/i
    );
    this.signInButton = page.getByRole("button", {
      name: /sign in with google/i,
    });
    this.sourceCodeLink = page.getByRole("link", { name: /view source code/i });
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.welcomeTitle).toBeVisible();
  }

  async verifyWelcomeMessage() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.welcomeDescription).toBeVisible();
  }

  async signInWithGoogle() {
    await expect(this.signInButton).toBeVisible();
    await this.signInButton.click();
  }

  async verifySourceCodeLink() {
    await expect(this.sourceCodeLink).toBeVisible();
  }
}
