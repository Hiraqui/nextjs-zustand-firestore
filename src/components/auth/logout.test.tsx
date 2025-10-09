import { render, screen, fireEvent } from "@testing-library/react";
import Logout from "./logout";
import { signOut } from "@/lib/firebase/auth";

// Mock Firebase auth
jest.mock("@/lib/firebase/auth", () => ({
  signOut: jest.fn(),
}));

const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe("Logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logout button", () => {
    render(<Logout />);

    const button = screen.getByRole("button", { name: /logout/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("text-secondary");
  });

  it("calls signOut when clicked", () => {
    render(<Logout />);

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("prevents default on button click", () => {
    render(<Logout />);

    const button = screen.getByRole("button", { name: /logout/i });
    const clickEvent = new MouseEvent("click", { bubbles: true });
    const preventDefaultSpy = jest.spyOn(clickEvent, "preventDefault");

    fireEvent(button, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
