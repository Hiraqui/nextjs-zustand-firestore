"use client";

import { STEPS } from "@/config/onboarding";
import useOnboardingForm from "@/hooks/use-onboarding-form";
import { OnboardingHobbies, OnboardingHobbySchema } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Step from "./step";

const ENUM = OnboardingHobbySchema.shape.hobby.enum;

const ICONS = {
  [ENUM.Art]: "🎨",
  [ENUM.Games]: "🎮",
  [ENUM.Music]: "🎵",
  [ENUM.Food]: "🍔",
  [ENUM.Sports]: "🏀",
  [ENUM.Travel]: "✈️",
  [ENUM.Technology]: "💻",
};

export default function Hobby() {
  const { continueHandler, currentValue, updateValue } = useOnboardingForm(
    OnboardingHobbySchema,
    STEPS.hobby.title
  );

  const handleClick = async (hobby: string) => {
    await updateValue(hobby);
    continueHandler();
  };

  return (
    <Step
      description="Choose your favorite hobby to see how selection data is instantly persisted to Firestore."
      title="What is your hobby?"
    >
      <div className="flex flex-wrap gap-4">
        {OnboardingHobbies.map((hobby) => (
          <Button
            key={hobby}
            className={cn(
              "rounded-lg border-2 border-white text-base font-bold",
              "hover:text-primary hover:bg-white",
              currentValue === hobby && "text-primary bg-white"
            )}
            onClick={() => handleClick(hobby)}
          >
            {hobby}
            <span>{ICONS[hobby]}</span>
          </Button>
        ))}
      </div>
    </Step>
  );
}
