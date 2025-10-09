import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Hobby from "./hobby";
import useOnboardingForm from "@/hooks/use-onboarding-form";
import { OnboardingHobbies } from "@/types/onboarding";

// Mock dependencies
jest.mock("@/hooks/use-onboarding-form", () => ({
  __esModule: true,
  default: jest.fn(),
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

const mockUseOnboardingForm = useOnboardingForm as jest.MockedFunction<
  typeof useOnboardingForm
>;

describe("Hobby", () => {
  const mockFormHook = {
    currentValue: "Art",
    error: null,
    continueHandler: jest.fn(),
    updateValue: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboardingForm.mockReturnValue(mockFormHook);
  });

  it("renders hobby selection form", () => {
    render(<Hobby />);

    expect(screen.getByText("What is your hobby?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Choose your favorite hobby to see how selection data is instantly persisted to Firestore."
      )
    ).toBeInTheDocument();
  });

  it("renders all hobby options with icons", () => {
    render(<Hobby />);

    OnboardingHobbies.forEach((hobby) => {
      const button = screen.getByRole("button", {
        name: new RegExp(hobby, "i"),
      });
      expect(button).toBeInTheDocument();
    });

    // Check for specific icons
    expect(screen.getByText("🎨")).toBeInTheDocument(); // Art
    expect(screen.getByText("🎮")).toBeInTheDocument(); // Games
    expect(screen.getByText("🎵")).toBeInTheDocument(); // Music
    expect(screen.getByText("🍔")).toBeInTheDocument(); // Food
    expect(screen.getByText("🏀")).toBeInTheDocument(); // Sports
    expect(screen.getByText("✈️")).toBeInTheDocument(); // Travel
    expect(screen.getByText("💻")).toBeInTheDocument(); // Technology
  });

  it("highlights current selected hobby", () => {
    mockUseOnboardingForm.mockReturnValue({
      ...mockFormHook,
      currentValue: "Sports",
    });

    render(<Hobby />);

    const sportsButton = screen.getByRole("button", { name: /sports/i });
    expect(sportsButton).toHaveClass("text-primary", "bg-white");
  });

  it("calls updateValue and continueHandler when hobby is clicked", async () => {
    render(<Hobby />);

    const musicButton = screen.getByRole("button", { name: /music/i });
    fireEvent.click(musicButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockFormHook.updateValue).toHaveBeenCalledWith("Music");
      expect(mockFormHook.continueHandler).toHaveBeenCalledTimes(1);
    });
  });

  it("calls useOnboardingForm with correct parameters", () => {
    render(<Hobby />);

    expect(mockUseOnboardingForm).toHaveBeenCalledTimes(1);
    const [schema, step] = mockUseOnboardingForm.mock.calls[0];
    expect(step).toBe("hobby");
    expect(schema).toBeDefined();
  });

  it("renders all expected hobby count", () => {
    render(<Hobby />);

    const hobbyButtons = screen.getAllByRole("button");
    expect(hobbyButtons).toHaveLength(OnboardingHobbies.length);
  });
});
