import { Button } from "@/components/ui/button";
import { STEPS } from "@/config/onboarding";
import Link from "next/link";
import Logout from "../auth/logout";
import Step from "./step";

/**
 * Introduction component for the onboarding flow.
 *
 * This component displays the welcome message and explanation of the demo's
 * functionality. It provides a "Get Started" button to begin the onboarding
 * process and includes a logout option. The component demonstrates how data
 * is automatically synced to Firestore during the onboarding process.
 *
 * @returns JSX element representing the onboarding introduction step
 */
export default function Intro() {
  return (
    <Step
      description="Let's collect some basic information to demonstrate how your data is automatically synced to Firestore as you progress through each step."
      title={
        <>
          Welcome to{" "}
          <span className="text-secondary font-bold tracking-tighter">
            nextjs-zustand-firestore
          </span>{" "}
          onboarding
        </>
      }
    >
      <Button asChild variant="ghost" className="text-lg mr-2" size="lg">
        <Link href={`onboarding?type=${STEPS.name.title}`}>Get Started</Link>
      </Button>
      <Logout />
    </Step>
  );
}
