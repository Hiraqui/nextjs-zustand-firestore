import { render, screen } from "@testing-library/react";
import OnboardingSummaryRow from "./summary-row";
import { CaseSensitive } from "lucide-react";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  CaseSensitive: ({ className }: { className?: string }) => (
    <div className={className} data-testid="case-sensitive-icon">
      Icon
    </div>
  ),
}));

describe("OnboardingSummaryRow", () => {
  const defaultProps = {
    icon: CaseSensitive,
    label: "Name",
    value: "John Doe",
  };

  it("renders with required props", () => {
    render(<OnboardingSummaryRow {...defaultProps} />);

    expect(screen.getByTestId("case-sensitive-icon")).toBeInTheDocument();
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("applies custom icon className", () => {
    render(
      <OnboardingSummaryRow {...defaultProps} iconClassName="text-red-500" />
    );

    const icon = screen.getByTestId("case-sensitive-icon");
    expect(icon).toHaveClass("h-8", "w-8", "shrink-0", "text-red-500");
  });

  it("applies default icon classes", () => {
    render(<OnboardingSummaryRow {...defaultProps} />);

    const icon = screen.getByTestId("case-sensitive-icon");
    expect(icon).toHaveClass("h-8", "w-8", "shrink-0");
  });

  it("handles long values with truncation", () => {
    const longValue =
      "This is a very long value that should be truncated when it exceeds the available space";

    render(<OnboardingSummaryRow {...defaultProps} value={longValue} />);

    const value = screen.getByText(longValue);
    expect(value).toHaveClass("truncate");
  });
});
