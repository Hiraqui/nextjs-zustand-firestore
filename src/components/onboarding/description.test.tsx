import { render, screen, fireEvent } from "@testing-library/react";
import Description from "./description";
import useOnboardingForm from "@/hooks/use-onboarding-form";

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

describe("Description", () => {
  const mockFormHook = {
    currentValue: "",
    error: null,
    continueHandler: jest.fn(),
    updateValue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboardingForm.mockReturnValue(mockFormHook);
  });

  it("renders the description input form", () => {
    render(<Description />);

    expect(screen.getByText("What's your description?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add a brief description about yourself to complete the demo and see all your data persisted in Firestore."
      )
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter your Description");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "description");
    expect(input).toHaveAttribute("max", "255");

    const button = screen.getByRole("button", { name: /finish!/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("displays current value in input", () => {
    mockUseOnboardingForm.mockReturnValue({
      ...mockFormHook,
      currentValue: "I love coding and hiking",
    });

    render(<Description />);

    const input = screen.getByDisplayValue("I love coding and hiking");
    expect(input).toBeInTheDocument();
  });

  it("calls updateValue when input changes", () => {
    render(<Description />);

    const input = screen.getByPlaceholderText("Enter your Description");
    fireEvent.change(input, { target: { value: "New description" } });

    expect(mockFormHook.updateValue).toHaveBeenCalledWith("New description");
  });

  it("calls continueHandler when finish button is clicked", () => {
    render(<Description />);

    const button = screen.getByRole("button", { name: /finish!/i });
    fireEvent.click(button);

    expect(mockFormHook.continueHandler).toHaveBeenCalledTimes(1);
  });

  it("calls useOnboardingForm with correct parameters", () => {
    render(<Description />);

    expect(mockUseOnboardingForm).toHaveBeenCalledTimes(1);
    const [schema, step] = mockUseOnboardingForm.mock.calls[0];
    expect(step).toBe("description");
    expect(schema).toBeDefined();
  });

  it("handles empty input value", () => {
    mockUseOnboardingForm.mockReturnValue({
      ...mockFormHook,
      currentValue: undefined,
    });

    render(<Description />);

    const input = screen.getByPlaceholderText("Enter your Description");
    expect(input).toHaveValue("");
  });
});
