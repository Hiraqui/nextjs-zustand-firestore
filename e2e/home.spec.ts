import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home-page";

test.describe("Basic Application Tests", () => {
  test("should load home page with welcome message", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.verifyWelcomeMessage();
    await expect(homePage.signInButton).toBeVisible();
  });

  test("should redirect unauthenticated users from onboarding", async ({
    page,
  }) => {
    await page.goto("/onboarding");
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("button", { name: /sign in with google/i })
    ).toBeVisible();
  });
});
