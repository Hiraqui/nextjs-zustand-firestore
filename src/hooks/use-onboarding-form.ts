import { OnboardingSteps, STEPS } from "@/config/onboarding";
import { useOnboardingStore } from "@/store/onboarding-store-provider";

import { useRouter } from "next/navigation";

import { useCallback, useState } from "react";

import { ZodType } from "zod";

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

  const updateValue = (value: string | number) => {
    const parsed = schema.safeParse({ [step]: value });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
    }
    setOnboardingInfo(step, value);
  };

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
