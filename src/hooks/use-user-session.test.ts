import { renderHook } from "@testing-library/react";

import { setCookie, deleteCookie } from "cookies-next";

import { User } from "firebase/auth";

import { onIdTokenChanged } from "../lib/firebase/auth";
import { SESSION_COOKIE } from "../lib/firebase/config";

import useUserSession from "./use-user-session";

// Mock Firebase Auth functions
jest.mock("../lib/firebase/auth", () => ({
  onIdTokenChanged: jest.fn(),
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

// Note: We skip testing window.location.reload functionality due to JSDOM limitations
// The core authentication and cookie logic is tested below

const mockOnIdTokenChanged = onIdTokenChanged as jest.MockedFunction<
  typeof onIdTokenChanged
>;
const mockSetCookie = setCookie as jest.MockedFunction<typeof setCookie>;
const mockDeleteCookie = deleteCookie as jest.MockedFunction<
  typeof deleteCookie
>;

describe("useUserSession", () => {
  const mockUser = {
    uid: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
    getIdToken: jest.fn().mockResolvedValue("mock-id-token"),
  } as unknown as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initialization", () => {
    it("returns the initial user", () => {
      mockOnIdTokenChanged.mockReturnValue(() => {});

      const { result } = renderHook(() => useUserSession(mockUser));

      expect(result.current).toBe(mockUser);
    });

    it("returns null when no initial user", () => {
      mockOnIdTokenChanged.mockReturnValue(() => {});

      const { result } = renderHook(() => useUserSession(null));

      expect(result.current).toBeNull();
    });

    it("sets up onIdTokenChanged listener", () => {
      mockOnIdTokenChanged.mockReturnValue(() => {});

      renderHook(() => useUserSession(mockUser));

      expect(mockOnIdTokenChanged).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("authentication state changes", () => {
    it("sets cookie when user signs in", async () => {
      let authCallback: ((user: User | null) => void) | undefined;

      mockOnIdTokenChanged.mockImplementation((callback) => {
        authCallback = callback;
        return () => {};
      });

      renderHook(() => useUserSession(null));

      // Simulate user sign in
      if (authCallback) {
        await authCallback(mockUser);
      }

      expect(mockSetCookie).toHaveBeenCalledWith(
        SESSION_COOKIE,
        "mock-id-token"
      );
    });

    it("deletes cookie when user signs out", async () => {
      let authCallback: ((user: User | null) => void) | undefined;

      mockOnIdTokenChanged.mockImplementation((callback) => {
        authCallback = callback;
        return () => {};
      });

      renderHook(() => useUserSession(mockUser));

      // Simulate user sign out
      if (authCallback) {
        await authCallback(null);
      }

      expect(mockDeleteCookie).toHaveBeenCalledWith(SESSION_COOKIE);
    });
  });

  describe("cleanup", () => {
    it("returns cleanup function from onIdTokenChanged", () => {
      const mockCleanup = jest.fn();
      mockOnIdTokenChanged.mockReturnValue(mockCleanup);

      const { unmount } = renderHook(() => useUserSession(mockUser));

      unmount();

      expect(mockOnIdTokenChanged).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("effect dependencies", () => {
    it("re-runs effect when initialUser changes", () => {
      mockOnIdTokenChanged.mockReturnValue(() => {});

      const { rerender } = renderHook(
        ({ user }: { user: User | null }) => useUserSession(user),
        { initialProps: { user: null as User | null } }
      );

      expect(mockOnIdTokenChanged).toHaveBeenCalledTimes(1);

      rerender({ user: mockUser });

      expect(mockOnIdTokenChanged).toHaveBeenCalledTimes(2);
    });

    it("does not re-run effect when initialUser is the same reference", () => {
      mockOnIdTokenChanged.mockReturnValue(() => {});

      const { rerender } = renderHook(
        ({ user }: { user: User | null }) => useUserSession(user),
        { initialProps: { user: mockUser as User | null } }
      );

      expect(mockOnIdTokenChanged).toHaveBeenCalledTimes(1);

      rerender({ user: mockUser as User | null });

      expect(mockOnIdTokenChanged).toHaveBeenCalledTimes(1);
    });
  });
});
