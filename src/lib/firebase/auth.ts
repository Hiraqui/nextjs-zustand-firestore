import { auth } from "@/lib/firebase/client-app";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
} from "firebase/auth";
import type { User, Unsubscribe } from "firebase/auth";

// Type for auth state change callback
interface ChangeCallback {
  (user: User | null): void;
}

export function onAuthStateChanged(cb: ChangeCallback): Unsubscribe {
  return _onAuthStateChanged(auth, cb);
}

export function onIdTokenChanged(cb: ChangeCallback) {
  return _onIdTokenChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
