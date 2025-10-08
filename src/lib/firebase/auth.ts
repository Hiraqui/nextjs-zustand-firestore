import { auth } from "@/lib/firebase/client-app";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
} from "firebase/auth";
import type { User, Unsubscribe } from "firebase/auth";

/**
 * Callback function type for authentication state changes.
 */
interface ChangeCallback {
  /**
   * Called when authentication state changes.
   *
   * @param user - The current user object, or null if not authenticated
   */
  (user: User | null): void;
}

/**
 * Subscribes to authentication state changes.
 *
 * @param cb - Callback function to invoke when auth state changes
 * @returns Unsubscribe function to stop listening to auth state changes
 */
export function onAuthStateChanged(cb: ChangeCallback): Unsubscribe {
  return _onAuthStateChanged(auth, cb);
}

/**
 * Subscribes to ID token changes.
 * Fires when the user signs in, signs out, or the token is refreshed.
 *
 * @param cb - Callback function to invoke when ID token changes
 * @returns Unsubscribe function to stop listening to token changes
 */
export function onIdTokenChanged(cb: ChangeCallback) {
  return _onIdTokenChanged(auth, cb);
}

/**
 * Initiates Google sign-in using a popup window.
 *
 * @throws Error if sign-in fails or user cancels the operation
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

/**
 * Signs out the current user.
 *
 * @returns Promise that resolves when sign-out is complete
 * @throws Error if sign-out operation fails
 */
export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
