import { test as base, expect } from "@playwright/test";

import { GoogleSignInPage } from "../pages/google-sign-in-page";
import { HomePage } from "../pages/home-page";
import { OnboardingPage } from "../pages/onboarding-page";

type AuthenticatedFixtures = {
  homePage: HomePage;
  onboardingPage: OnboardingPage;
  user: {
    email: string;
    name: string;
  };
};

export const test = base.extend<AuthenticatedFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  user: [
    async ({ homePage, context }, use) => {
      // Navigate to home page
      await homePage.goto();

      // Verify sign-in button is present and click it
      await expect(homePage.signInButton).toBeVisible();
      const pagePromise = context.waitForEvent("page");
      await homePage.signInButton.click();

      // Handle Google sign-in page
      const googleSignInPage = new GoogleSignInPage(await pagePromise);
      await googleSignInPage.waitForPageLoad();
      const user = await googleSignInPage.generateNewUserAndLogin();

      await expect(async () => {
        await googleSignInPage.signInWithGoogleButton.click();

        // Create onboarding page object and wait for intro step
        await expect(homePage.page).toHaveURL(/\/onboarding/);
      }).toPass({ intervals: [1000, 2000, 3000], timeout: 45_000 });

      // Use the authenticated user
      await use(user);
    },
    { timeout: 45_000 },
  ],

  onboardingPage: async ({ page, user, homePage }, use) => {
    // User is authenticated via the user fixture
    void user; // Ensure user fixture is used
    void homePage; // Ensure home page fixture is used

    // Create onboarding page object and wait for intro step
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.waitForIntroStep();

    await use(onboardingPage);
  },
});

export { expect };
