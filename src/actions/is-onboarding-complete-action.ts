"use server";

import { ActionResult, createSuccessResult } from "@/types/action-result";
import { OnboardingInfo } from "@/types/onboarding";

/**
 * This is an example of using an action in a zustand store with server-side logic.
 *
 * Server action to determine if the onboarding process is complete.
 *
 * This action evaluates the provided onboarding information to determine
 * if all required fields have been filled. Currently checks for the presence
 * of name, hobby, age, and description fields.
 *
 * @param onboardingInfo - The onboarding information to validate
 * @returns Promise resolving to ActionResult containing completion status
 */
export async function isOnboardingCompleteAction(
  onboardingInfo: OnboardingInfo
): Promise<ActionResult<boolean>> {
  const isComplete = Boolean(
    onboardingInfo.name &&
      onboardingInfo.hobby &&
      onboardingInfo.age &&
      onboardingInfo.description
  );

  return createSuccessResult(isComplete);
}
