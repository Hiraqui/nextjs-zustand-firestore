"use server";

import { ActionResult, createSuccessResult } from "@/types/action-result";
import { OnboardingInfo } from "@/types/onboarding";

export async function isOnboardingCompleteAction(
  onboardingInfo: OnboardingInfo
): Promise<ActionResult<boolean>> {
  const isComplete = Boolean(
    onboardingInfo.name &&
      onboardingInfo.hobbie &&
      onboardingInfo.age &&
      onboardingInfo.description
  );

  return createSuccessResult(isComplete);
}
