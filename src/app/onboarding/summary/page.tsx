import OnboardingSummary from "@/components/onboarding/summary";

/**
 * Onboarding summary page component that displays a summary of all collected information.
 *
 * This page is shown at the end of the onboarding flow and provides users with
 * a review of all the information they've entered during the onboarding process.
 * It uses the same layout structure as other onboarding pages for consistency.
 *
 * @returns JSX element representing the onboarding summary page
 */
export default async function OnboardingSummaryPage() {
  return (
    <div className="bg-primary mx-auto flex h-screen max-w-3xl flex-col items-center justify-start overflow-x-hidden pt-40">
      <OnboardingSummary />
    </div>
  );
}
