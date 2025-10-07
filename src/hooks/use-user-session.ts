"use client";

import { SESSION_COOKIE } from "@/lib/firebase/config";
import { onIdTokenChanged } from "@/lib/firebase/auth";

import { deleteCookie, setCookie } from "cookies-next";

import { User } from "firebase/auth";

import { useEffect } from "react";

export default function useUserSession(initialUser: User | null) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie(SESSION_COOKIE, idToken);
      } else {
        await deleteCookie(SESSION_COOKIE);
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}
