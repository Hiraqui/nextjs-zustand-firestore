import { render, screen } from "@testing-library/react";
import OnboardingSummaryPage from "./page";

// Mock dependencies
jest.mock("@/components/onboarding/summary", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="onboarding-summary">Onboarding Summary Component</div>
  ),
}));

describe("OnboardingSummaryPage", () => {
  it("renders the onboarding summary component", async () => {
    const SummaryPageComponent = await OnboardingSummaryPage();

    render(SummaryPageComponent);

    expect(screen.getByTestId("onboarding-summary")).toBeInTheDocument();
    expect(
      screen.getByText("Onboarding Summary Component")
    ).toBeInTheDocument();
  });
});
