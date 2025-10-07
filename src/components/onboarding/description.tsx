"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STEPS } from "@/config/onboarding";
import useOnboardingForm from "@/hooks/use-onboarding-form";
import { OnboardingDescriptionSchema } from "@/types/onboarding";
import Step from "./step";

export default function Description() {
  const { currentValue, continueHandler, updateValue } = useOnboardingForm(
    OnboardingDescriptionSchema,
    STEPS.description.title
  );
  return (
    <Step
      description="Add a brief description about yourself to complete the demo and see all your data persisted in Firestore."
      title="What's your description?"
    >
      <div className="flex flex-col items-start space-y-10">
        <Input
          name="description"
          className="text-base! text-gray-700"
          placeholder="Enter your Description"
          value={currentValue}
          onChange={(e) => updateValue(e.target.value)}
          max={255}
        />
        <Button
          type="submit"
          className="hover:text-primary mt-auto border-2 border-white px-10 text-base font-medium hover:bg-white"
          onClick={continueHandler}
        >
          Finish!
        </Button>
      </div>
    </Step>
  );
}
