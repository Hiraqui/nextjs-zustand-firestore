import { OnboardingInfo } from "@/types/onboarding";

export type OnboardingSteps = keyof OnboardingInfo;

export const STEPS: {
  [key in OnboardingSteps]: {
    title: OnboardingSteps;
    next: OnboardingSteps | null;
    skippable: boolean;
  };
} = {
  name: {
    title: "name",
    next: "hobby",
    skippable: false,
  },
  hobby: {
    title: "hobby",
    next: "age",
    skippable: false,
  },
  age: {
    title: "age",
    next: "description",
    skippable: false,
  },
  description: {
    title: "description",
    next: null,
    skippable: true,
  },
};
