import { render, screen, fireEvent } from "@testing-library/react";
import Age from "./age";
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

describe("Age", () => {
  const mockFormHook = {
    currentValue: 0,
    error: null,
    continueHandler: jest.fn(),
    updateValue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOnboardingForm.mockReturnValue(mockFormHook);
  });

  it("renders the age input form", () => {
    render(<Age />);

    expect(screen.getByText("How old are you?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your age to see how form input data is automatically synced to Firestore in real-time."
      )
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter your Age");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "age");
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "120");
    expect(input).toHaveAttribute("step", "1");
    expect(input).toHaveAttribute("required");

    const button = screen.getByRole("button", { name: /continue/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("displays current value in input", () => {
    mockUseOnboardingForm.mockReturnValue({
      ...mockFormHook,
      currentValue: 25,
    });

    render(<Age />);

    const input = screen.getByDisplayValue("25");
    expect(input).toBeInTheDocument();
  });

  it("calls updateValue with number when input changes", () => {
    render(<Age />);

    const input = screen.getByPlaceholderText("Enter your Age");
    fireEvent.change(input, { target: { value: "30" } });

    expect(mockFormHook.updateValue).toHaveBeenCalledWith(30);
  });

  it("calls continueHandler when continue button is clicked", () => {
    render(<Age />);

    const button = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(button);

    expect(mockFormHook.continueHandler).toHaveBeenCalledTimes(1);
  });

  it("displays error message when present", () => {
    mockUseOnboardingForm.mockReturnValue({
      ...mockFormHook,
      error: "Age must be positive",
    });

    render(<Age />);

    expect(screen.getByText("Age must be positive")).toBeInTheDocument();
  });

  it("calls useOnboardingForm with correct parameters", () => {
    render(<Age />);

    expect(mockUseOnboardingForm).toHaveBeenCalledTimes(1);
    const [schema, step] = mockUseOnboardingForm.mock.calls[0];
    expect(step).toBe("age");
    expect(schema).toBeDefined();
  });

  it("handles invalid number input", () => {
    render(<Age />);

    const input = screen.getByPlaceholderText("Enter your Age");
    fireEvent.change(input, { target: { value: "invalid" } });

    // When invalid text is entered in a number input, it results in empty string or 0
    // depending on browser behavior. The component calls Number() on it.
    expect(mockFormHook.updateValue).toHaveBeenCalledWith(0);
  });

  it("handles empty input", () => {
    render(<Age />);

    const input = screen.getByPlaceholderText("Enter your Age");
    fireEvent.change(input, { target: { value: "" } });

    expect(mockFormHook.updateValue).toHaveBeenCalledWith(0);
  });
});
