import { test, expect } from "./fixtures/base-fixtures";
import { SummaryPage } from "./pages/summary-page";

/**
 * Simplified Onboarding Tests following Playwright best practices
 * - Uses role-based locators
 * - Focuses on user-visible behavior
 * - Keeps tests simple and focused
 */

const testData = {
  validUser: {
    name: "John Doe",
    hobby: "Technology",
    age: 28,
    description: "I love building web applications.",
  },
  minimalUser: {
    name: "Jane Smith",
    hobby: "Art",
    age: 22,
    description: "",
  },
};

test.describe("Onboarding Flow", () => {
  test("should complete full onboarding flow", async ({
    onboardingPage,
    user,
  }) => {
    console.log(`Testing with user: ${user.name} (${user.email})`);

    const summaryPage = new SummaryPage(onboardingPage.page);

    // Complete onboarding
    await onboardingPage.startOnboarding();
    await onboardingPage.fillCompleteOnboarding(testData.validUser);

    // Verify on summary page
    await summaryPage.waitForSummaryPage();
    await summaryPage.verifyCompletionMessage();
    await summaryPage.verifySummaryData(testData.validUser);
  });

  test("should complete onboarding with minimal data", async ({
    onboardingPage,
    user,
  }) => {
    console.log(`Testing minimal flow with user: ${user.name}`);

    const summaryPage = new SummaryPage(onboardingPage.page);

    await onboardingPage.startOnboarding();
    await onboardingPage.fillCompleteOnboarding(testData.minimalUser);

    await summaryPage.waitForSummaryPage();
    await summaryPage.verifySummaryData(testData.minimalUser);
  });

  test("should allow navigation back", async ({ onboardingPage, user }) => {
    console.log(`Testing navigation with user: ${user.name}`);

    await onboardingPage.startOnboarding();

    // Fill name manually
    await onboardingPage.waitForNameStep();

    // Clear existing value and set test value
    await onboardingPage.nameInput.click();
    await onboardingPage.nameInput.fill("");
    await onboardingPage.nameInput.pressSequentially("Test User", {
      delay: 50,
    });
    await expect(onboardingPage.nameInput).toHaveValue("Test User");

    // Try to advance to next step
    await onboardingPage.page.waitForTimeout(1500);
    await expect(onboardingPage.continueButton).toBeVisible();
    await expect(onboardingPage.continueButton).toBeEnabled();
    await onboardingPage.continueButton.click();

    // Wait a bit to see if navigation happens, then go back
    await onboardingPage.page.waitForTimeout(2_000);

    // Navigate back and verify name is preserved
    await onboardingPage.goBack();
    await onboardingPage.waitForNameStep();

    // The input should have the value we set, not the original user name
    await expect(onboardingPage.nameInput).toHaveValue("Test User");
  });

  test("should allow logout from intro", async ({
    onboardingPage,
    user,
    homePage,
  }) => {
    console.log(`Testing logout with user: ${user.name}`);

    await expect(onboardingPage.logoutButton).toBeVisible();
    await onboardingPage.page.waitForTimeout(2_000);
    await onboardingPage.logoutButton.click();

    await homePage.verifyWelcomeMessage();
  });

  test("should allow redo onboarding from summary page", async ({
    onboardingPage,
    user,
  }) => {
    console.log(`Testing redo functionality with user: ${user.name}`);

    const summaryPage = new SummaryPage(onboardingPage.page);

    // Complete initial onboarding
    await onboardingPage.startOnboarding();
    await onboardingPage.fillCompleteOnboarding(testData.minimalUser);

    // Verify we're on summary page
    await summaryPage.waitForSummaryPage();
    await summaryPage.verifyActionButtons();

    // Click redo onboarding button
    await summaryPage.redoOnboarding();

    // Should be back at intro step
    await onboardingPage.waitForIntroStep();
    await expect(onboardingPage.welcomeTitle).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeVisible();
  });

  test("should allow logout from summary page", async ({
    onboardingPage,
    user,
    homePage,
  }) => {
    console.log(`Testing logout from summary with user: ${user.name}`);

    const summaryPage = new SummaryPage(onboardingPage.page);

    // Complete initial onboarding
    await onboardingPage.startOnboarding();
    await onboardingPage.fillCompleteOnboarding(testData.validUser);

    // Verify we're on summary page
    await summaryPage.waitForSummaryPage();
    await summaryPage.verifyActionButtons();

    // Click logout button
    await summaryPage.logout();

    // Should be redirected to home page with sign-in button
    await homePage.verifyWelcomeMessage();
    await expect(homePage.signInButton).toBeVisible();
  });
});
