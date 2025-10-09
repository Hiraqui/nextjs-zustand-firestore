/**
 * @jest-environment node
 */

import { isOnboardingCompleteAction } from "./is-onboarding-complete-action";
import { OnboardingInfo } from "@/types/onboarding";

describe("isOnboardingCompleteAction", () => {
  it("returns true when all required fields are provided", async () => {
    const completeOnboardingInfo: OnboardingInfo = {
      name: "John Doe",
      hobby: "Sports",
      age: 25,
      description: "I love playing basketball",
    };

    const result = await isOnboardingCompleteAction(completeOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
  });

  it("returns false when name is missing", async () => {
    const incompleteOnboardingInfo: OnboardingInfo = {
      name: "",
      hobby: "Sports",
      age: 25,
      description: "I love playing basketball",
    };

    const result = await isOnboardingCompleteAction(incompleteOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(false);
  });

  it("returns false when hobby is missing", async () => {
    const incompleteOnboardingInfo: OnboardingInfo = {
      name: "John Doe",
      hobby: "" as never,
      age: 25,
      description: "I love playing basketball",
    };

    const result = await isOnboardingCompleteAction(incompleteOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(false);
  });

  it("returns false when age is 0", async () => {
    const incompleteOnboardingInfo: OnboardingInfo = {
      name: "John Doe",
      hobby: "Sports",
      age: 0,
      description: "I love playing basketball",
    };

    const result = await isOnboardingCompleteAction(incompleteOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(false);
  });

  it("returns false when description is missing", async () => {
    const incompleteOnboardingInfo: OnboardingInfo = {
      name: "John Doe",
      hobby: "Sports",
      age: 25,
      description: "",
    };

    const result = await isOnboardingCompleteAction(incompleteOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(false);
  });

  it("returns false when description is undefined", async () => {
    const incompleteOnboardingInfo: OnboardingInfo = {
      name: "John Doe",
      hobby: "Sports",
      age: 25,
      description: undefined,
    };

    const result = await isOnboardingCompleteAction(incompleteOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(false);
  });

  it("returns false when multiple fields are missing", async () => {
    const incompleteOnboardingInfo: OnboardingInfo = {
      name: "",
      hobby: "Sports",
      age: 0,
      description: undefined,
    };

    const result = await isOnboardingCompleteAction(incompleteOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(false);
  });

  it("returns true with valid age greater than 0", async () => {
    const completeOnboardingInfo: OnboardingInfo = {
      name: "Jane Smith",
      hobby: "Art",
      age: 30,
      description: "I enjoy painting landscapes",
    };

    const result = await isOnboardingCompleteAction(completeOnboardingInfo);

    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
  });

  it("handles all hobby types correctly", async () => {
    const hobbies: Array<OnboardingInfo["hobby"]> = [
      "Sports",
      "Food",
      "Games",
      "Travel",
      "Music",
      "Art",
      "Technology",
    ];

    for (const hobby of hobbies) {
      const onboardingInfo: OnboardingInfo = {
        name: "Test User",
        hobby,
        age: 25,
        description: "Test description",
      };

      const result = await isOnboardingCompleteAction(onboardingInfo);
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    }
  });

  it("always returns success response", async () => {
    const onboardingInfo: OnboardingInfo = {
      name: "",
      hobby: "" as never,
      age: 0,
      description: "",
    };

    const result = await isOnboardingCompleteAction(onboardingInfo);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
