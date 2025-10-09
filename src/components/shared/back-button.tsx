"use client";

import { Button, ButtonProps } from "../ui/button";

import * as React from "react";

import { useRouter } from "next/navigation";

/**
 * Props for the BackButton component.
 * Extends ButtonProps but excludes onClick and asChild as they are handled internally.
 */
type BackButtonProps = Omit<ButtonProps, "onClick" | "asChild">;

/**
 * A button component that navigates to the previous page in browser history.
 *
 * This component wraps the base Button component and automatically handles
 * the onClick event to trigger browser back navigation using Next.js router.
 * It accepts all standard button props except onClick and asChild.
 *
 * @param props - All button props except onClick and asChild
 * @param ref - Forwarded ref to the button element
 * @returns JSX element representing a back navigation button
 */
const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (props, ref) => {
    const router = useRouter();
    return (
      <Button
        data-testid="back-button"
        ref={ref}
        {...props}
        onClick={() => router.back()}
      />
    );
  }
);
BackButton.displayName = "BackButton";

export { BackButton };
