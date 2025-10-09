import { render } from "@testing-library/react";
import SessionObserver from "./session-observer";
import useUserSession from "@/hooks/use-user-session";
import type { User } from "firebase/auth";

// Mock the useUserSession hook
jest.mock("@/hooks/use-user-session", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseUserSession = useUserSession as jest.MockedFunction<
  typeof useUserSession
>;

describe("SessionObserver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing", () => {
    mockUseUserSession.mockReturnValue(null);

    const { container } = render(<SessionObserver initialUser={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("calls useUserSession with null initial user", () => {
    mockUseUserSession.mockReturnValue(null);

    render(<SessionObserver initialUser={null} />);

    expect(mockUseUserSession).toHaveBeenCalledWith(null);
    expect(mockUseUserSession).toHaveBeenCalledTimes(1);
  });

  it("calls useUserSession with provided initial user", () => {
    const mockUser = {
      uid: "test-user-id",
      email: "test@example.com",
      displayName: "Test User",
    } as User;

    mockUseUserSession.mockReturnValue(mockUser);

    render(<SessionObserver initialUser={mockUser} />);

    expect(mockUseUserSession).toHaveBeenCalledWith(mockUser);
    expect(mockUseUserSession).toHaveBeenCalledTimes(1);
  });

  it("returns the user from useUserSession hook", () => {
    const mockUser = {
      uid: "test-user-id",
      email: "test@example.com",
      displayName: "Test User",
    } as User;

    mockUseUserSession.mockReturnValue(mockUser);

    render(<SessionObserver initialUser={mockUser} />);

    expect(mockUseUserSession).toHaveReturnedWith(mockUser);
  });
});
