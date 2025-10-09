import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Name from "./name";
import useOnboardingForm from "@/hooks/use-onboarding-form";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

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

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseOnboardingForm = useOnboardingForm as jest.MockedFunction<
  typeof useOnboardingForm
>;

const mockRouterPush = jest.fn();

describe("Name", () => {
  const mockFormHook = {
    currentValue: "",
    error: null,
    continueHandler: jest.fn(),
    updateValue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });
    mockUseOnboardingForm.mockReturnValue(mockFormHook);
  });

  it("renders the name input form", () => {
    render(<Name />);

    expect(screen.getByText("What's your name?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Let's get to know each other better. Let's start with your name."
      )
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter your Name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "name");
    expect(input).toHaveAttribute("required");

    const button = screen.getByRole("button", { name: /continue/i });
    expect(button).toBeInTheDocument();
  });

  it("displays current value in input", () => {
    mockUseOnboardingForm.mockReturnValue({
      ...mockFormHook,
      currentValue: "John Doe",
    });

    render(<Name />);

    const input = screen.getByDisplayValue("John Doe");
    expect(input).toBeInTheDocument();
  });

  it("calls updateValue when input changes", () => {
    render(<Name />);

    const input = screen.getByPlaceholderText("Enter your Name");
    fireEvent.change(input, { target: { value: "Jane Smith" } });

    expect(mockFormHook.updateValue).toHaveBeenCalledWith("Jane Smith");
  });

  it("calls continueHandler when continue button is clicked", () => {
    render(<Name />);

    const button = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(button);

    expect(mockFormHook.continueHandler).toHaveBeenCalledTimes(1);
  });

  it("displays error message when present", () => {
    mockUseOnboardingForm.mockReturnValue({
      ...mockFormHook,
      error: "Name is required",
    });

    render(<Name />);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("calls useOnboardingForm with correct parameters", () => {
    render(<Name />);

    expect(mockUseOnboardingForm).toHaveBeenCalledTimes(1);
    // Check that it's called with a schema and "name" step
    const [schema, step] = mockUseOnboardingForm.mock.calls[0];
    expect(step).toBe("name");
    expect(schema).toBeDefined();
  });
});
