import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server-app";

// Mock dependencies
jest.mock("@/lib/firebase/server-app", () => ({
  getAuthenticatedAppForUser: jest.fn(),
}));

jest.mock("@/components/auth/session-observer", () => ({
  __esModule: true,
  default: ({ initialUser }: { initialUser: unknown }) => (
    <div data-testid="session-observer">
      Session Observer: {initialUser ? "User Present" : "No User"}
    </div>
  ),
}));

// Mock fonts
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

const mockGetAuthenticatedAppForUser =
  getAuthenticatedAppForUser as jest.MockedFunction<
    typeof getAuthenticatedAppForUser
  >;

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children and session observer with no user", async () => {
    mockGetAuthenticatedAppForUser.mockResolvedValue({
      firebaseServerApp: {} as never,
      currentUser: null,
    });

    const LayoutComponent = await RootLayout({
      children: <div>Test Children</div>,
    });

    render(LayoutComponent);

    expect(screen.getByText("Test Children")).toBeInTheDocument();
    expect(screen.getByTestId("session-observer")).toBeInTheDocument();
    expect(screen.getByText("Session Observer: No User")).toBeInTheDocument();
  });

  it("calls getAuthenticatedAppForUser", async () => {
    mockGetAuthenticatedAppForUser.mockResolvedValue({
      firebaseServerApp: {} as never,
      currentUser: null,
    });

    await RootLayout({
      children: <div>Test Children</div>,
    });

    expect(mockGetAuthenticatedAppForUser).toHaveBeenCalledTimes(1);
  });

  it("has correct html structure", async () => {
    mockGetAuthenticatedAppForUser.mockResolvedValue({
      firebaseServerApp: {} as never,
      currentUser: null,
    });

    const LayoutComponent = await RootLayout({
      children: <div>Test Children</div>,
    });

    render(LayoutComponent);

    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute("lang", "en");
  });

  it("has correct body classes with font variables", async () => {
    mockGetAuthenticatedAppForUser.mockResolvedValue({
      firebaseServerApp: {} as never,
      currentUser: null,
    });

    const LayoutComponent = await RootLayout({
      children: <div>Test Children</div>,
    });

    render(LayoutComponent);

    const bodyElement = document.body;
    expect(bodyElement).toHaveClass(
      "--font-geist-sans",
      "--font-geist-mono",
      "antialiased"
    );
  });
});
