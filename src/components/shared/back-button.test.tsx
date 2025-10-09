import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import React from "react";
import { BackButton } from "./back-button";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockRouterBack = jest.fn();

describe("BackButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      back: mockRouterBack,
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it("renders a button", () => {
    render(<BackButton>Go Back</BackButton>);

    const button = screen.getByRole("button", { name: /go back/i });
    expect(button).toBeInTheDocument();
  });

  it("calls router.back when clicked", () => {
    render(<BackButton>Go Back</BackButton>);

    const button = screen.getByRole("button", { name: /go back/i });
    fireEvent.click(button);

    expect(mockRouterBack).toHaveBeenCalledTimes(1);
  });

  it("passes through button props", () => {
    render(
      <BackButton className="custom-class" disabled size="lg">
        Go Back
      </BackButton>
    );

    const button = screen.getByRole("button", { name: /go back/i });
    expect(button).toHaveClass("custom-class");
    expect(button).toBeDisabled();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<BackButton ref={ref}>Go Back</BackButton>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has correct display name", () => {
    expect(BackButton.displayName).toBe("BackButton");
  });

  it("accepts variant prop", () => {
    render(<BackButton variant="outline">Go Back</BackButton>);

    const button = screen.getByRole("button", { name: /go back/i });
    expect(button).toBeInTheDocument();
  });

  it("accepts type prop", () => {
    render(<BackButton type="submit">Go Back</BackButton>);

    const button = screen.getByRole("button", { name: /go back/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("handles multiple clicks correctly", () => {
    render(<BackButton>Go Back</BackButton>);

    const button = screen.getByRole("button", { name: /go back/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockRouterBack).toHaveBeenCalledTimes(3);
  });
});
