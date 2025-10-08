import Age from "@/components/onboarding/age";
import Description from "@/components/onboarding/description";
import Hobby from "@/components/onboarding/hobby";
import Intro from "@/components/onboarding/intro";
import Name from "@/components/onboarding/name";
import { BackButton } from "@/components/shared/back-button";
import { STEPS } from "@/config/onboarding";

import { ChevronLeftCircle } from "lucide-react";

import { AnimatePresence } from "motion/react";

/**
 * Props for the onboarding page component.
 */
interface OnboardingPageProps {
  /** Search parameters containing the current onboarding step type */
  searchParams: Promise<{
    type: keyof typeof STEPS | null;
  }>;
}

/**
 * Main onboarding page component that renders different steps based on URL parameters.
 *
 * This component manages the onboarding flow by displaying different form steps
 * based on the 'type' search parameter. It uses AnimatePresence for smooth
 * transitions between steps and includes a back button for navigation.
 * When no type is specified, it shows the intro screen.
 *
 * @param props - Component props
 * @param props.searchParams - Promise containing search parameters with step type
 * @returns JSX element representing the current onboarding step
 */
export default async function Onboarding({
  searchParams,
}: OnboardingPageProps) {
  const { type } = await searchParams;

  return (
    <div className="bg-primary mx-auto flex h-screen max-w-3xl flex-col items-center justify-start overflow-x-hidden pt-40">
      <AnimatePresence mode="wait">
        {type ? (
          <>
            <BackButton
              key="back-button"
              size="icon"
              variant="ghost"
              className="group absolute top-10 left-2 z-40 rounded-full p-2 transition-all hover:bg-gray-400 sm:left-10"
            >
              <ChevronLeftCircle className="h-8! w-8! group-hover:text-gray-800 group-active:scale-90" />
            </BackButton>
          </>
        ) : (
          <Intro key="intro" />
        )}
        {type === STEPS.name.title && <Name key={STEPS.name.title} />}
        {type === STEPS.hobby.title && <Hobby key={STEPS.hobby.title} />}
        {type === STEPS.age.title && <Age key={STEPS.age.title} />}
        {type === STEPS.description.title && (
          <Description key={STEPS.description.title} />
        )}
      </AnimatePresence>
    </div>
  );
}
