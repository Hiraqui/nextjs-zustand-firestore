import { OnboardingSteps, STEPS } from "@/config/onboarding";
import { useOnboardingStore } from "@/store/onboarding-store-provider";

import { useRouter } from "next/navigation";

import { useCallback, useState } from "react";

import { ZodType } from "zod";

/**
 * Custom hook for managing onboarding form state and navigation.
 *
 * This hook provides utilities for handling form input, validation,
 * and navigation within the onboarding flow. It integrates with the
 * onboarding store to persist data and provides validation using Zod schemas.
 *
 * @param schema - Zod schema for validating the current step's data
 * @param step - The current onboarding step being processed
 * @returns Object containing form state and handlers
 *
 * @template K - The specific onboarding step type
 */
export default function useOnboardingForm<K extends OnboardingSteps>(
  schema: ZodType,
  step: K
) {
  const setOnboardingInfo = useOnboardingStore(
    (state) => state.setOnboardingInfo
  );
  const currentValue = useOnboardingStore(
    (state) => state.onboardingInfo[step]
  );
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  /**
   * Updates the form value and performs validation.
   * Sets error state if validation fails.
   *
   * @param value - The new value to set for the current step
   */
  const updateValue = (value: string | number) => {
    const parsed = schema.safeParse({ [step]: value });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
    }
    setOnboardingInfo(step, value);
  };

  /**
   * Handles form submission and navigation to the next step.
   * Validates the current form data before proceeding.
   * Navigates to the next step in the onboarding flow or to the summary page.
   */
  const continueHandler = useCallback(() => {
    const parsed = schema.safeParse({ [step]: currentValue });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    const nextPath = STEPS[step].next
      ? `?type=${STEPS[step].next}`
      : "/summary";

    const path = `onboarding${nextPath}`;
    router.push(path);
  }, [schema, step, currentValue, router]);

  return {
    currentValue,
    error,
    continueHandler,
    updateValue,
  };
}
