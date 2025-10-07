import { Button } from "@/components/ui/button";
import { STEPS } from "@/config/onboarding";
import Link from "next/link";
import Logout from "../auth/logout";
import Step from "./step";

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
