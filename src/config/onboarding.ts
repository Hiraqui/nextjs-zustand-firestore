import { OnboardingInfo } from "@/types/onboarding";

/**
 * Type representing the possible steps in the onboarding process.
 * Derived from the keys of the OnboardingInfo type.
 */
export type OnboardingSteps = keyof OnboardingInfo;

/**
 * Configuration object that defines the onboarding step flow.
 * Each step contains navigation information.
 *
 * @property title - The identifier for the step
 * @property next - The next step in the flow, or null if it's the final step
 */
export const STEPS: {
  [key in OnboardingSteps]: {
    title: OnboardingSteps;
    next: OnboardingSteps | null;
  };
} = {
  name: {
    title: "name",
    next: "hobby",
  },
  hobby: {
    title: "hobby",
    next: "age",
  },
  age: {
    title: "age",
    next: "description",
  },
  description: {
    title: "description",
    next: null,
  },
};
