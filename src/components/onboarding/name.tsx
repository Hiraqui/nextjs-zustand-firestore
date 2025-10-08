"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STEPS } from "@/config/onboarding";
import useOnboardingForm from "@/hooks/use-onboarding-form";
import { OnboardingNameSchema } from "@/types/onboarding";
import Step from "./step";

/**
 * Name input component for the onboarding flow.
 *
 * This component renders a form step where users can enter their name.
 * It uses the useOnboardingForm hook for state management, validation,
 * and navigation. The component includes real-time validation and
 * error display using the OnboardingNameSchema.
 *
 * @returns JSX element representing the name input step
 */
export default function Name() {
  const { currentValue, error, continueHandler, updateValue } =
    useOnboardingForm(OnboardingNameSchema, STEPS.name.title);
  return (
    <Step
      description="Let's get to know each other better. Let's start with your name."
      title="What's your name?"
      error={error}
    >
      <div className="flex flex-col items-start space-y-10">
        <Input
          name="name"
          className="text-base! text-gray-700"
          placeholder="Enter your Name"
          required
          value={currentValue}
          onChange={(e) => updateValue(e.target.value)}
        />
        <Button
          className="hover:text-primary mt-auto border-2 border-white px-10 text-base font-medium hover:bg-white"
          onClick={continueHandler}
        >
          Continue
        </Button>
      </div>
    </Step>
  );
}
