"use client";

import useUserSession from "@/hooks/use-user-session";
import { User } from "firebase/auth";

interface SessionObserverProps {
  initialUser: User | null;
}

export default function SessionObserver({ initialUser }: SessionObserverProps) {
  useUserSession(initialUser);
  return null;
}
