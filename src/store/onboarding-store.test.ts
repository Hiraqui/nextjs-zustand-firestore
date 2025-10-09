import { isOnboardingCompleteAction } from "@/actions/is-onboarding-complete-action";

import { renderHook, act } from "@testing-library/react";

import {
  createOnboardingStore,
  initialState,
  OnboardingStore,
} from "./onboarding-store";

// Mock dependencies
jest.mock("@/actions/is-onboarding-complete-action", () => ({
  isOnboardingCompleteAction: jest.fn(),
}));

jest.mock("zustand/middleware", () => ({
  createJSONStorage: jest.fn(() => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  })),
  persist: jest.fn((storeConfig) => storeConfig),
  subscribeWithSelector: jest.fn((storeConfig) => storeConfig),
}));

jest.mock("use-broadcast-ts", () => ({
  shared: jest.fn((storeConfig) => storeConfig),
}));

jest.mock("./server-storage", () => ({
  createServerStorage: jest.fn(() => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  })),
}));

const mockIsOnboardingCompleteAction =
  isOnboardingCompleteAction as jest.MockedFunction<
    typeof isOnboardingCompleteAction
  >;

describe("onboarding-store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Default mock implementation
    mockIsOnboardingCompleteAction.mockResolvedValue({
      success: true,
      data: false,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("initialState", () => {
    it("has correct initial values", () => {
      expect(initialState).toEqual({
        onboardingInfo: {
          name: "",
          hobby: "Art",
          age: 0,
        },
        isComplete: false,
      });
    });
  });

  describe("createOnboardingStore", () => {
    let store: ReturnType<typeof createOnboardingStore>;
    let hookResult: { current: OnboardingStore };

    beforeEach(() => {
      store = createOnboardingStore();
      const { result } = renderHook(() => store());
      hookResult = result;
    });

    it("initializes with default state", () => {
      expect(hookResult.current.onboardingInfo).toEqual(
        initialState.onboardingInfo
      );
      expect(hookResult.current.isComplete).toBe(false);
    });

    it("initializes with custom state", () => {
      const customState = {
        onboardingInfo: {
          name: "Custom Name",
          hobby: "Sports" as const,
          age: 25,
        },
        isComplete: true,
      };

      const customStore = createOnboardingStore(customState);
      const { result } = renderHook(() => customStore());

      expect(result.current.onboardingInfo).toEqual(customState.onboardingInfo);
      expect(result.current.isComplete).toBe(true);
    });

    it("updates onboarding info field", () => {
      act(() => {
        hookResult.current.setOnboardingInfo("name", "John Doe");
      });

      expect(hookResult.current.onboardingInfo.name).toBe("John Doe");
      expect(hookResult.current.onboardingInfo.hobby).toBe("Art");
      expect(hookResult.current.onboardingInfo.age).toBe(0);
    });

    it("updates multiple onboarding info fields", () => {
      act(() => {
        hookResult.current.setOnboardingInfo("name", "Jane Smith");
      });

      act(() => {
        hookResult.current.setOnboardingInfo("hobby", "Music");
      });

      act(() => {
        hookResult.current.setOnboardingInfo("age", 30);
      });

      expect(hookResult.current.onboardingInfo).toEqual({
        name: "Jane Smith",
        hobby: "Music",
        age: 30,
      });
    });

    it("sets completion status", () => {
      act(() => {
        hookResult.current.setIsComplete(true);
      });

      expect(hookResult.current.isComplete).toBe(true);
    });

    it("resets onboarding info to initial state", () => {
      // First modify the state
      act(() => {
        hookResult.current.setOnboardingInfo("name", "Test Name");
        hookResult.current.setOnboardingInfo("age", 25);
        hookResult.current.setIsComplete(true);
      });

      // Then reset
      act(() => {
        hookResult.current.resetOnboardingInfo();
      });

      expect(hookResult.current.onboardingInfo).toEqual(
        initialState.onboardingInfo
      );
      expect(hookResult.current.isComplete).toBe(false);
    });

    it("handles undefined values in setOnboardingInfo", () => {
      act(() => {
        hookResult.current.setOnboardingInfo("name", undefined);
      });

      expect(hookResult.current.onboardingInfo.name).toBeUndefined();
    });

    describe("calculateIsComplete", () => {
      it("calls server action and updates isComplete on success", async () => {
        mockIsOnboardingCompleteAction.mockResolvedValue({
          success: true,
          data: true,
        });

        await act(async () => {
          await hookResult.current.calculateIsComplete();
        });

        expect(mockIsOnboardingCompleteAction).toHaveBeenCalledWith(
          hookResult.current.onboardingInfo
        );
        expect(hookResult.current.isComplete).toBe(true);
      });

      it("handles server action failure gracefully", async () => {
        const consoleErrorSpy = jest
          .spyOn(console, "error")
          .mockImplementation(() => {});
        mockIsOnboardingCompleteAction.mockResolvedValue({
          success: false,
          error: "Server error",
        });

        await act(async () => {
          await hookResult.current.calculateIsComplete();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to check if onboarding is complete:",
          "Server error"
        );
        // isComplete should not be updated on failure
        expect(hookResult.current.isComplete).toBe(false);

        consoleErrorSpy.mockRestore();
      });

      it("is called with debounce when setOnboardingInfo is called", async () => {
        mockIsOnboardingCompleteAction.mockResolvedValue({
          success: true,
          data: true,
        });

        act(() => {
          hookResult.current.setOnboardingInfo("name", "Test Name");
        });

        // Fast-forward through debounce timer (default is 500ms)
        act(() => {
          jest.advanceTimersByTime(500);
        });

        // Wait for all promises to resolve
        await act(async () => {
          await Promise.resolve();
        });

        expect(mockIsOnboardingCompleteAction).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Test Name" })
        );
      }, 10000);

      it("debounces multiple rapid setOnboardingInfo calls", async () => {
        mockIsOnboardingCompleteAction.mockResolvedValue({
          success: true,
          data: true,
        });

        act(() => {
          hookResult.current.setOnboardingInfo("name", "First");
          hookResult.current.setOnboardingInfo("name", "Second");
          hookResult.current.setOnboardingInfo("name", "Third");
        });

        // Fast-forward through debounce timer
        act(() => {
          jest.advanceTimersByTime(500);
        });

        await act(async () => {
          await Promise.resolve();
        });

        // Should only be called once with the final value
        expect(mockIsOnboardingCompleteAction).toHaveBeenCalledTimes(1);
        expect(mockIsOnboardingCompleteAction).toHaveBeenCalledWith(
          expect.objectContaining({ name: "Third" })
        );
      }, 10000);
    });
  });
});
