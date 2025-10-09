import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import OnboardingSummary from "./summary";
import { useOnboardingStore } from "@/store/onboarding-store-provider";

// Mock dependencies
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

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

jest.mock("@/store/onboarding-store-provider", () => ({
  useOnboardingStore: jest.fn(),
}));

jest.mock("./summary-row", () => ({
  __esModule: true,
  default: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="summary-row">
      {label}: {value}
    </div>
  ),
}));

jest.mock("../auth/logout", () => ({
  __esModule: true,
  default: () => <button>Logout</button>,
}));

jest.mock("lucide-react", () => ({
  CalendarHeart: "CalendarHeart",
  CaseSensitive: "CaseSensitive",
  Medal: "Medal",
  NotebookText: "NotebookText",
}));

const mockUseOnboardingStore = useOnboardingStore as jest.MockedFunction<
  typeof useOnboardingStore
>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

describe("OnboardingSummary", () => {
  const mockOnboardingData = {
    name: "John Doe",
    age: 30,
    hobby: "Sports" as const,
    description: "I love playing basketball",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNotFound.mockClear();
  });

  it("renders summary when onboarding data exists", () => {
    mockUseOnboardingStore.mockReturnValue(mockOnboardingData);

    render(<OnboardingSummary />);

    expect(
      screen.getByText("Demo complete! Your data is now stored in Firestore.")
    ).toBeInTheDocument();

    // Check that summary rows are rendered
    expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Age: 30")).toBeInTheDocument();
    expect(screen.getByText("Hobby: Sports")).toBeInTheDocument();
    expect(
      screen.getByText("Description: I love playing basketball")
    ).toBeInTheDocument();
  });

  it("renders summary without description when description is empty", () => {
    const dataWithoutDescription = {
      ...mockOnboardingData,
      description: undefined,
    };
    mockUseOnboardingStore.mockReturnValue(dataWithoutDescription);

    render(<OnboardingSummary />);

    expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Age: 30")).toBeInTheDocument();
    expect(screen.getByText("Hobby: Sports")).toBeInTheDocument();
    expect(screen.queryByText(/Description:/)).not.toBeInTheDocument();
  });

  it("calls notFound when onboarding data is null", () => {
    mockUseOnboardingStore.mockReturnValue(null);

    expect(() => render(<OnboardingSummary />)).toThrow();
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("calls notFound when onboarding data is undefined", () => {
    mockUseOnboardingStore.mockReturnValue(undefined);

    expect(() => render(<OnboardingSummary />)).toThrow();
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders redo onboarding link", () => {
    mockUseOnboardingStore.mockReturnValue(mockOnboardingData);

    render(<OnboardingSummary />);

    const redoLink = screen.getByRole("link", { name: /redo onboarding/i });
    expect(redoLink).toBeInTheDocument();
    expect(redoLink).toHaveAttribute("href", "/");
  });

  it("renders logout component", () => {
    mockUseOnboardingStore.mockReturnValue(mockOnboardingData);

    render(<OnboardingSummary />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("renders all summary rows with correct count", () => {
    mockUseOnboardingStore.mockReturnValue(mockOnboardingData);

    render(<OnboardingSummary />);

    const summaryRows = screen.getAllByTestId("summary-row");
    expect(summaryRows).toHaveLength(4); // name, age, hobby, description
  });

  it("renders correct number of summary rows without description", () => {
    const dataWithoutDescription = {
      ...mockOnboardingData,
      description: "",
    };
    mockUseOnboardingStore.mockReturnValue(dataWithoutDescription);

    render(<OnboardingSummary />);

    const summaryRows = screen.getAllByTestId("summary-row");
    expect(summaryRows).toHaveLength(3); // name, age, hobby only
  });
});
