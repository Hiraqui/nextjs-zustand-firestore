import { useOnboardingStore } from "@/store/onboarding-store-provider";
import { OnboardingSteps } from "@/config/onboarding";
import { OnboardingStore } from "@/store/onboarding-store";

import { renderHook, act } from "@testing-library/react";

import { useRouter } from "next/navigation";

import { z } from "zod";

import useOnboardingForm from "./use-onboarding-form";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/onboarding-store-provider", () => ({
  useOnboardingStore: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseOnboardingStore = useOnboardingStore as jest.MockedFunction<
  typeof useOnboardingStore
>;

describe("useOnboardingForm", () => {
  const mockPush = jest.fn();
  const mockSetOnboardingInfo = jest.fn();

  // Test schemas
  const nameSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  const ageSchema = z.object({
    age: z.number().min(1, "Age must be greater than 0"),
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    });

    // Mock the store selector behavior
    mockUseOnboardingStore.mockImplementation(
      <T>(selector: (store: OnboardingStore) => T): T => {
        const mockStore: OnboardingStore = {
          onboardingInfo: {
            name: "John Doe",
            hobby: "Sports" as const,
            age: 25,
            description: "I love playing basketball",
          },
          isComplete: false,
          setOnboardingInfo: mockSetOnboardingInfo,
          setIsComplete: jest.fn(),
          resetOnboardingInfo: jest.fn(),
          calculateIsComplete: jest.fn().mockResolvedValue(undefined),
        };
        return selector(mockStore);
      }
    );
  });

  describe("initialization", () => {
    it("returns current value from store", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      expect(result.current.currentValue).toBe("John Doe");
    });

    it("initializes with no error", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      expect(result.current.error).toBeNull();
    });

    it("provides updateValue function", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      expect(typeof result.current.updateValue).toBe("function");
    });

    it("provides continueHandler function", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      expect(typeof result.current.continueHandler).toBe("function");
    });
  });

  describe("updateValue", () => {
    it("calls setOnboardingInfo with correct parameters", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      act(() => {
        result.current.updateValue("Jane Doe");
      });

      expect(mockSetOnboardingInfo).toHaveBeenCalledWith("name", "Jane Doe");
    });

    it("clears error on valid input", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      act(() => {
        result.current.updateValue("Valid Name");
      });

      expect(result.current.error).toBeNull();
    });

    it("sets error on invalid input", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      act(() => {
        result.current.updateValue("");
      });

      expect(result.current.error).toBe("Name is required");
    });

    it("handles number values for age step", () => {
      const { result } = renderHook(() => useOnboardingForm(ageSchema, "age"));

      act(() => {
        result.current.updateValue(30);
      });

      expect(mockSetOnboardingInfo).toHaveBeenCalledWith("age", 30);
    });

    it("sets error for invalid number input", () => {
      const { result } = renderHook(() => useOnboardingForm(ageSchema, "age"));

      act(() => {
        result.current.updateValue(0);
      });

      expect(result.current.error).toBe("Age must be greater than 0");
    });
  });

  describe("continueHandler", () => {
    it("navigates to next step on valid input", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      act(() => {
        result.current.continueHandler();
      });

      expect(mockPush).toHaveBeenCalledWith("onboarding?type=hobby");
    });

    it("navigates to summary on final step", () => {
      const descriptionSchema = z.object({
        description: z.string().min(1, "Description is required"),
      });

      const { result } = renderHook(() =>
        useOnboardingForm(descriptionSchema, "description")
      );

      act(() => {
        result.current.continueHandler();
      });

      expect(mockPush).toHaveBeenCalledWith("onboarding/summary");
    });

    it("sets error and does not navigate on invalid input", () => {
      // Mock empty name in store
      mockUseOnboardingStore.mockImplementation(
        <T>(selector: (store: OnboardingStore) => T): T => {
          const mockStore: OnboardingStore = {
            onboardingInfo: {
              name: "",
              hobby: "Sports" as const,
              age: 25,
              description: "I love playing basketball",
            },
            isComplete: false,
            setOnboardingInfo: mockSetOnboardingInfo,
            setIsComplete: jest.fn(),
            resetOnboardingInfo: jest.fn(),
            calculateIsComplete: jest.fn().mockResolvedValue(undefined),
          };
          return selector(mockStore);
        }
      );

      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      act(() => {
        result.current.continueHandler();
      });

      expect(result.current.error).toBe("Name is required");
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("handles hobby step navigation", () => {
      const hobbySchema = z.object({
        hobby: z.enum(["Art", "Sports", "Music", "Gaming", "Reading"]),
      });

      const { result } = renderHook(() =>
        useOnboardingForm(hobbySchema, "hobby")
      );

      act(() => {
        result.current.continueHandler();
      });

      expect(mockPush).toHaveBeenCalledWith("onboarding?type=age");
    });

    it("handles age step navigation", () => {
      const { result } = renderHook(() => useOnboardingForm(ageSchema, "age"));

      act(() => {
        result.current.continueHandler();
      });

      expect(mockPush).toHaveBeenCalledWith("onboarding?type=description");
    });
  });

  describe("error handling", () => {
    it("displays first validation error message", () => {
      const complexSchema = z.object({
        name: z.string().min(2, "Name too short").max(5, "Name too long"),
      });

      const { result } = renderHook(() =>
        useOnboardingForm(complexSchema, "name")
      );

      act(() => {
        result.current.updateValue("A");
      });

      expect(result.current.error).toBe("Name too short");
    });

    it("clears error when validation passes", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      // First set an error
      act(() => {
        result.current.updateValue("");
      });
      expect(result.current.error).toBe("Name is required");

      // Then fix it
      act(() => {
        result.current.updateValue("Valid Name");
      });
      expect(result.current.error).toBeNull();
    });
  });

  describe("integration with store", () => {
    it("uses correct store selector for current value", () => {
      renderHook(() => useOnboardingForm(nameSchema, "name"));

      // Should call useOnboardingStore twice: for setOnboardingInfo and currentValue
      expect(mockUseOnboardingStore).toHaveBeenCalledTimes(2);
    });

    it("updates store when value changes", () => {
      const { result } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      act(() => {
        result.current.updateValue("Updated Name");
      });

      expect(mockSetOnboardingInfo).toHaveBeenCalledWith(
        "name",
        "Updated Name"
      );
    });
  });

  describe("different step types", () => {
    it("works with all onboarding steps", () => {
      const steps: OnboardingSteps[] = ["name", "hobby", "age", "description"];

      steps.forEach((step) => {
        const schema = z.object({
          [step]: z.union([z.string(), z.number()]),
        });

        const { result } = renderHook(() => useOnboardingForm(schema, step));

        expect(result.current.currentValue).toBeDefined();
        expect(typeof result.current.updateValue).toBe("function");
        expect(typeof result.current.continueHandler).toBe("function");
      });
    });
  });

  describe("continueHandler callback stability", () => {
    it("continueHandler is stable when dependencies don't change", () => {
      const { result, rerender } = renderHook(() =>
        useOnboardingForm(nameSchema, "name")
      );

      const firstHandler = result.current.continueHandler;

      rerender();

      const secondHandler = result.current.continueHandler;
      expect(firstHandler).toBe(secondHandler);
    });
  });
});
