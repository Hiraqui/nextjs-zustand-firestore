"use client";

import { useOnboardingStore } from "@/store/onboarding-store-provider";
import {
  CalendarHeart,
  CaseSensitive,
  Medal,
  NotebookText,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "../ui/button";
import OnboardingSummaryRow from "./summary-row";
import Logout from "../auth/logout";

/**
 * Summary component that displays all collected onboarding information.
 *
 * This component shows a comprehensive summary of the user's onboarding data
 * that has been persisted to Firestore. It displays the user's name, age,
 * hobby, and optional description in a grid layout with icons. The component
 * also provides options to redo the onboarding process or logout.
 *
 * @returns JSX element representing the onboarding summary display
 */
export default function OnboardingSummary() {
  const onboarding = useOnboardingStore((state) => state.onboardingInfo);
  if (!onboarding) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="text-secondary mb-12 text-3xl font-medium">
        Demo complete! Your data is now stored in Firestore.
      </h2>

      <div className="mb-16 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
        {/* Name */}
        <OnboardingSummaryRow
          icon={CaseSensitive}
          label="Name"
          value={onboarding.name}
        />

        {/* Age */}
        <OnboardingSummaryRow
          icon={CalendarHeart}
          label="Age"
          value={onboarding.age.toString()}
        />

        {/* Hobby */}
        <OnboardingSummaryRow
          icon={Medal}
          label="Hobby"
          value={onboarding.hobby}
        />

        {/* Description */}
        {onboarding.description && (
          <OnboardingSummaryRow
            icon={NotebookText}
            label="Description"
            value={onboarding.description}
          />
        )}
      </div>

      <Button asChild variant="ghost" className="text-lg mr-2" size="lg">
        <Link href="/">Redo onboarding</Link>
      </Button>
      <Logout />
    </div>
  );
}
