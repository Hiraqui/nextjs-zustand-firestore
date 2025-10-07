"use client";

import { signOut } from "@/lib/firebase/auth";
import { Button } from "../ui/button";

export default function Logout() {
  const handleSignOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signOut();
  };
  return (
    <Button className="text-secondary" variant="link" onClick={handleSignOut}>
      Logout
    </Button>
  );
}
