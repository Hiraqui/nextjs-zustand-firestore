import { render, screen } from "@testing-library/react";
import Intro from "./intro";

// Mock dependencies
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock("../auth/logout", () => ({
  __esModule: true,
  default: () => <button>Logout</button>,
}));

// Mock the Step component directly
jest.mock("./step", () => {
  return function MockStep({
    children,
    title,
    description,
    error,
  }: {
    children?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    error?: string | null;
  }) {
    return (
      <div data-testid="step">
        {title && <h1>{title}</h1>}
        {description && <p>{description}</p>}
        {error && <p role="alert">{error}</p>}
        {children}
      </div>
    );
  };
});

describe("Intro", () => {
  it("renders the intro content", () => {
    render(<Intro />);

    // Check individual text parts since they're in separate elements
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      /Welcome to.*nextjs-zustand-firestore.*onboarding/
    );

    expect(
      screen.getByText(
        "Let's collect some basic information to demonstrate how your data is automatically synced to Firestore as you progress through each step."
      )
    ).toBeInTheDocument();
  });

  it("renders get started link with correct href", () => {
    render(<Intro />);

    const getStartedLink = screen.getByRole("link", { name: /get started/i });
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute("href", "onboarding?type=name");
  });

  it("renders logout component", () => {
    render(<Intro />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("get started button renders correctly", () => {
    render(<Intro />);

    const getStartedLink = screen.getByRole("link", { name: /get started/i });
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute("href", "onboarding?type=name");
  });

  it("renders complete title text", () => {
    render(<Intro />);

    // Check that the complete title is rendered
    const titleElement = screen.getByRole("heading", { level: 1 });
    expect(titleElement).toHaveTextContent(
      /Welcome to.*nextjs-zustand-firestore.*onboarding/
    );
  });
});
