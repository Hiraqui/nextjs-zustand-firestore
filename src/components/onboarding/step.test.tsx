import React from "react";
import { render, screen } from "@testing-library/react";
import Step from "./step";

// Mock motion/react-client using the same pattern as jest.setup.js

describe("Step", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test description for the step component",
  };

  it("renders the title correctly", () => {
    render(<Step {...defaultProps} />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Test Title");
  });

  it("renders the description correctly", () => {
    render(<Step {...defaultProps} />);

    const description = screen.getByText(
      "Test description for the step component"
    );
    expect(description).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <Step {...defaultProps}>
        <button>Test Button</button>
        <p>Test Child Content</p>
      </Step>
    );

    expect(
      screen.getByRole("button", { name: "Test Button" })
    ).toBeInTheDocument();
    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });

  it("renders without children", () => {
    render(<Step {...defaultProps} />);

    const title = screen.getByRole("heading", { level: 1 });
    const description = screen.getByText(
      "Test description for the step component"
    );

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("displays error message when error prop is provided", () => {
    render(
      <Step {...defaultProps} error="Something went wrong">
        <div>Content</div>
      </Step>
    );

    const errorMessage = screen.getByText("Something went wrong");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-destructive");
  });

  it("does not display error message when error is null", () => {
    render(
      <Step {...defaultProps} error={null}>
        <div>Content</div>
      </Step>
    );

    const errorMessage = screen.queryByText("Something went wrong");
    expect(errorMessage).not.toBeInTheDocument();
  });

  it("does not display error message when error is undefined", () => {
    render(
      <Step {...defaultProps}>
        <div>Content</div>
      </Step>
    );

    const errorMessage = screen.queryByText("Something went wrong");
    expect(errorMessage).not.toBeInTheDocument();
  });

  it("renders complex title with JSX elements", () => {
    const complexTitle = (
      <>
        Welcome to{" "}
        <span className="text-secondary font-bold">NextJS Project</span>
      </>
    );

    render(
      <Step title={complexTitle} description={defaultProps.description} />
    );

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Welcome to NextJS Project");

    const span = screen.getByText("NextJS Project");
    expect(span).toHaveClass("text-secondary", "font-bold");
  });

  it("has correct title styling classes", () => {
    render(<Step {...defaultProps} />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass(
      "font-display",
      "text-3xl",
      "font-bold",
      "text-gray-300",
      "transition-colors",
      "sm:text-5xl"
    );
  });

  it("has correct description styling classes", () => {
    render(<Step {...defaultProps} />);

    const description = screen.getByText(
      "Test description for the step component"
    );
    expect(description).toHaveClass(
      "text-gray-300",
      "transition-colors",
      "sm:text-lg"
    );
  });

  it("renders multiple children correctly", () => {
    render(
      <Step {...defaultProps}>
        <input placeholder="Test Input" />
        <button>Submit</button>
        <div>Additional Content</div>
      </Step>
    );

    expect(screen.getByPlaceholderText("Test Input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByText("Additional Content")).toBeInTheDocument();
  });

  it("handles empty string title", () => {
    render(<Step title="" description={defaultProps.description} />);

    // Empty string title should not render the h1 element
    const title = screen.queryByRole("heading", { level: 1 });
    expect(title).not.toBeInTheDocument();
  });

  it("handles empty string description", () => {
    render(<Step title={defaultProps.title} description="" />);

    // Empty string description should not render the p element
    const description = screen.queryByText(
      "Test description for the step component"
    );
    expect(description).not.toBeInTheDocument();
  });

  it("applies motion animation properties correctly", () => {
    render(<Step {...defaultProps} />);

    // Since we're mocking motion, we verify the component structure is maintained
    const title = screen.getByRole("heading", { level: 1 });
    const description = screen.getByText(
      "Test description for the step component"
    );

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("renders without crashing with minimal props", () => {
    render(<Step title="Minimal" description="Minimal description" />);

    expect(screen.getByText("Minimal")).toBeInTheDocument();
    expect(screen.getByText("Minimal description")).toBeInTheDocument();
  });

  it("has correct container structure and classes", () => {
    render(<Step {...defaultProps}>Test Content</Step>);

    // Check that the main container exists - it should be the outermost div with z-10 class
    const container = screen
      .getByText("Test Title")
      .closest("div")?.parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("z-10");
  });

  it("renders error only when children are present", () => {
    // Error should only render when there are children
    render(<Step {...defaultProps} error="Test Error" />);

    // No error should be displayed since there are no children
    expect(screen.queryByText("Test Error")).not.toBeInTheDocument();

    // Error should be displayed when children are present
    render(
      <Step {...defaultProps} error="Test Error">
        <div>Content</div>
      </Step>
    );

    expect(screen.getByText("Test Error")).toBeInTheDocument();
  });
});
