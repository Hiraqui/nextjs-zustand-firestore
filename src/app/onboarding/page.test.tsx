import { render, screen } from "@testing-library/react";
import Onboarding from "./page";

// Mock dependencies
jest.mock("@/components/onboarding/intro", () => ({
  __esModule: true,
  default: () => <div data-testid="intro">Intro Component</div>,
}));

jest.mock("@/components/onboarding/name", () => ({
  __esModule: true,
  default: () => <div data-testid="name">Name Component</div>,
}));

jest.mock("@/components/onboarding/hobby", () => ({
  __esModule: true,
  default: () => <div data-testid="hobby">Hobby Component</div>,
}));

jest.mock("@/components/onboarding/age", () => ({
  __esModule: true,
  default: () => <div data-testid="age">Age Component</div>,
}));

jest.mock("@/components/onboarding/description", () => ({
  __esModule: true,
  default: () => <div data-testid="description">Description Component</div>,
}));

jest.mock("@/components/shared/back-button", () => ({
  BackButton: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <button {...props} data-testid="back-button">
      {children}
    </button>
  ),
}));

jest.mock("lucide-react", () => ({
  ChevronLeftCircle: ({ className }: { className?: string }) => (
    <div className={className} data-testid="chevron-left-icon">
      ChevronLeft
    </div>
  ),
}));

jest.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
}));

describe("Onboarding", () => {
  it("renders intro when no type is specified", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: null }),
    });

    render(OnboardingComponent);

    expect(screen.getByTestId("intro")).toBeInTheDocument();
    expect(screen.getByText("Intro Component")).toBeInTheDocument();
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
  });

  it("renders name component when type is name", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: "name" }),
    });

    render(OnboardingComponent);

    expect(screen.getByTestId("name")).toBeInTheDocument();
    expect(screen.getByText("Name Component")).toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders hobby component when type is hobby", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: "hobby" }),
    });

    render(OnboardingComponent);

    expect(screen.getByTestId("hobby")).toBeInTheDocument();
    expect(screen.getByText("Hobby Component")).toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders age component when type is age", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: "age" }),
    });

    render(OnboardingComponent);

    expect(screen.getByTestId("age")).toBeInTheDocument();
    expect(screen.getByText("Age Component")).toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders description component when type is description", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: "description" }),
    });

    render(OnboardingComponent);

    expect(screen.getByTestId("description")).toBeInTheDocument();
    expect(screen.getByText("Description Component")).toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders back button with correct styling when type is provided", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: "name" }),
    });

    render(OnboardingComponent);

    const backButton = screen.getByTestId("back-button");
    expect(backButton).toHaveClass(
      "group",
      "absolute",
      "top-10",
      "left-2",
      "z-40",
      "rounded-full",
      "p-2",
      "transition-all",
      "hover:bg-gray-400",
      "sm:left-10"
    );
  });

  it("wraps content in AnimatePresence", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: null }),
    });

    render(OnboardingComponent);

    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
  });

  it("handles unknown type gracefully", async () => {
    const OnboardingComponent = await Onboarding({
      searchParams: Promise.resolve({ type: "unknown" as never }),
    });

    render(OnboardingComponent);

    // Should render back button but no specific component
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    expect(screen.queryByTestId("intro")).not.toBeInTheDocument();
    expect(screen.queryByTestId("name")).not.toBeInTheDocument();
  });
});
