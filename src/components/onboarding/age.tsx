"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STEPS } from "@/config/onboarding";
import useOnboardingForm from "@/hooks/use-onboarding-form";
import { OnboardingAgeSchema } from "@/types/onboarding";
import Step from "./step";

export default function Age() {
  const { continueHandler, currentValue, error, updateValue } =
    useOnboardingForm(OnboardingAgeSchema, STEPS.age.title);
  return (
    <Step
      description="Enter your age to see how form input data is automatically synced to Firestore in real-time."
      title="How old are you?"
      error={error}
    >
      <div className="flex flex-col items-start space-y-10">
        <Input
          value={currentValue}
          name="age"
          className="text-base! text-gray-700"
          placeholder="Enter your Age"
          type="number"
          min={1}
          step={1}
          max={120}
          required
          onChange={(e) => updateValue(Number(e.target.value))}
        />
        <Button
          type="submit"
          className="hover:text-primary mt-auto border-2 border-white px-10 text-base font-medium hover:bg-white"
          onClick={continueHandler}
        >
          Continue
        </Button>
      </div>
    </Step>
  );
}
