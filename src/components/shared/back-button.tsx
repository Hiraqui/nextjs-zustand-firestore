"use client";

import { Button, ButtonProps } from "../ui/button";

import * as React from "react";

import { useRouter } from "next/navigation";

type BackButtonProps = Omit<ButtonProps, "onClick" | "asChild">;

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (props, ref) => {
    const router = useRouter();
    return <Button ref={ref} {...props} onClick={() => router.back()} />;
  }
);
BackButton.displayName = "BackButton";

export { BackButton };
