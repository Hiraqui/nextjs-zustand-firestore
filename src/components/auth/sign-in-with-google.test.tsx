import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SignInWithGoogle from "./sign-in-with-google";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { AuthErrorCodes } from "firebase/auth";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/firebase/auth", () => ({
  signInWithGoogle: jest.fn(),
}));

const mockRouterPush = jest.fn();
const mockSignInWithGoogle = signInWithGoogle as jest.MockedFunction<
  typeof signInWithGoogle
>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("SignInWithGoogle", () => {
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
  });

  it("renders the sign-in button with Google icon", () => {
    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    expect(button).toBeInTheDocument();

    const googleIcon = screen.getByAltText("Google icon");
    expect(googleIcon).toBeInTheDocument();
    expect(googleIcon).toHaveAttribute("src", "/google.svg");
  });

  it("handles successful sign-in", async () => {
    mockSignInWithGoogle.mockResolvedValueOnce(undefined);

    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).toHaveBeenCalledWith("/onboarding");
    });
  });

  it("shows loading state during sign-in", async () => {
    let resolveSignIn: () => void = () => {
      return;
    };
    const signInPromise = new Promise<void>((resolve) => {
      resolveSignIn = resolve;
    });
    mockSignInWithGoogle.mockReturnValueOnce(signInPromise);

    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);

    // Should show spinner while loading
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(button).toBeDisabled();

    resolveSignIn();
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/onboarding");
    });
  });

  it("handles popup blocked error", async () => {
    const error = { code: AuthErrorCodes.POPUP_BLOCKED };
    mockSignInWithGoogle.mockRejectedValueOnce(error);

    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Your browser prevented the popup from opening")
      ).toBeInTheDocument();
    });
  });

  it("handles popup closed by user without showing error", async () => {
    const error = {
      code: AuthErrorCodes.POPUP_CLOSED_BY_USER,
      message: "Popup closed",
    };
    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    mockSignInWithGoogle.mockRejectedValueOnce(error);

    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Popup closed");
    });

    // Should not show error message
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("handles expired popup request without showing error", async () => {
    const error = {
      code: AuthErrorCodes.EXPIRED_POPUP_REQUEST,
      message: "Expired",
    };
    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    mockSignInWithGoogle.mockRejectedValueOnce(error);

    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Expired");
    });

    // Should not show error message
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("handles generic errors", async () => {
    const error = { code: "unknown-error" };
    mockSignInWithGoogle.mockRejectedValueOnce(error);

    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("There was an error processing your request")
      ).toBeInTheDocument();
    });
  });

  it("prevents default on button click", () => {
    render(<SignInWithGoogle />);

    const button = screen.getByRole("button", { name: /sign in with google/i });
    const clickEvent = new MouseEvent("click", { bubbles: true });
    const preventDefaultSpy = jest.spyOn(clickEvent, "preventDefault");

    fireEvent(button, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
